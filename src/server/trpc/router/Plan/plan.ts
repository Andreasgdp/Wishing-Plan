import { updatePlacement } from '@components/screens/Plan/planUtils';
import type { PlanWish, Wish } from '@prisma/client';
import { assertHasAccessToPlan } from '@server/trpc/utils/assertHasAccessToPlan';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { protectedProcedure, router } from '../../trpc';

export interface PlanWishType extends Wish {
	placement: number;
}

export const planRouter = router({
	get: protectedProcedure.query(({ ctx }) => {
		const userId = ctx.session?.user?.id;

		return ctx.prisma.plan.findFirst({ where: { userId: userId } });
	}),
	getWishes: protectedProcedure
		.input(z.object({ planId: z.string().nullish() }))
		.query(({ input, ctx }) => {
			console.log('input.planId', input.planId);

			if (!input.planId) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}
			assertHasAccessToPlan(ctx, input.planId);

			return ctx.prisma.planWish
				.findMany({
					where: { planId: input.planId },
					orderBy: { placement: 'asc' },
					include: { wish: true },
				})
				.then((planWishes) => {
					return planWishes.map((planWish) => {
						return {
							...planWish.wish,
							placement: planWish.placement,
						};
					});
				});
		}),
	createAndAddWish: protectedProcedure
		.input(
			z.object({
				planId: z.string(),
				wishTitle: z.string(),
				wishDescription: z.string().nullish(),
				wishPrice: z.number(),
				wishUrl: z.string(),
				wishImageUrl: z.string().nullish(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			assertHasAccessToPlan(ctx, input.planId);

			const userId = ctx.session?.user?.id;

			const wish = await ctx.prisma.wish.create({
				data: {
					creator: {
						connect: { id: userId },
					},
					title: input.wishTitle,
					description: input.wishDescription,
					price: input.wishPrice,
					url: input.wishUrl,
					imageUrl: input.wishImageUrl,
				},
			});

			const largestPlacementWish = await ctx.prisma.planWish.findFirst({
				where: { planId: input.planId },
				orderBy: { placement: 'desc' },
			});

			const newPlacement = (largestPlacementWish?.placement ?? 0) + 1;

			const bridge = await ctx.prisma.planWish.create({
				data: {
					plan: {
						connect: { id: input.planId },
					},
					wish: {
						connect: { id: wish.id },
					},
					placement: newPlacement,
				},
			});

			return { wish, bridge };
		}),
	relocateWish: protectedProcedure
		.input(
			z.object({
				planId: z.string(),
				wishId: z.string(),
				oldIndex: z.number(),
				newIndex: z.number(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			assertHasAccessToPlan(ctx, input.planId);

			const planWish = await ctx.prisma.planWish.findFirst({
				where: { planId: input.planId, wishId: input.wishId },
			});

			if (!planWish) {
				throw new TRPCError({ code: 'NOT_FOUND' });
			}

			const planWishes = await ctx.prisma.planWish.findMany({
				where: { planId: input.planId },
				orderBy: { placement: 'asc' },
			});

			const newPlanWishes = updatePlacement(
				planWishes,
				input.oldIndex,
				input.newIndex
			);

			return await Promise.all(
				newPlanWishes.map((planWish) => {
					return ctx.prisma.planWish.update({
						where: { id: planWish.id },
						data: { placement: planWish.placement },
					});
				})
			);
		}),
	updatePlan: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				amountToSave: z.number(),
				autoUpdateSavedAmount: z.boolean(),
				currentAmountSaved: z.number(),
				firstSaving: z.date(),
				frequency: z.string(),
			})
		)
		.mutation(({ input, ctx }) => {
			assertHasAccessToPlan(ctx, input.id);
			const userId = ctx.session?.user?.id;

			return ctx.prisma.plan.update({
				where: { userId: userId },
				data: {
					amountToSave: input.amountToSave,
					autoUpdateSavedAmount: input.autoUpdateSavedAmount,
					currentAmountSaved: input.currentAmountSaved,
					firstSaving: input.firstSaving,
					frequency: input.frequency,
				},
			});
		}),
});

