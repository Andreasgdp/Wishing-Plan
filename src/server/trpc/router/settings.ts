import { assertIsWishCreator } from '@server/trpc/utils/assertIsWishCreator';
import { z } from 'zod';
import { protectedProcedure, router } from '../trpc';

export const settingsRouter = router({
	get: protectedProcedure.query(({ ctx }) => {
		const userId = ctx.session?.user?.id;

		return ctx.prisma.userSettings.findFirst({
			where: { userId: userId },
		});
	}),
	create: protectedProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string(),
				price: z.number(),
				url: z.string(),
				wishListId: z.string(),
			})
		)
		.mutation(({ input, ctx }) => {
			const userId = ctx.session?.user?.id;

			return ctx.prisma.wish.create({
				data: {
					creator: {
						connect: { id: userId },
					},
					title: input.title,
					description: input.description,
					price: input.price,
					url: input.url,
					wishList: {
						connect: { id: input.wishListId },
					},
				},
			});
		}),
	updateCurrency: protectedProcedure
		.input(z.object({ currency: z.string() }))
		.mutation(({ input, ctx }) => {
			const userId = ctx.session?.user?.id;

			return ctx.prisma.userSettings.upsert({
				where: { userId: userId },
				update: { currency: input.currency },
				create: {
					userId: userId,
					currency: input.currency,
				},
			});
		}),
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string(),
				description: z.string(),
				price: z.number(),
				url: z.string(),
				wishListId: z.string(),
			})
		)
		.mutation(({ input, ctx }) => {
			assertIsWishCreator(ctx, input.id);

			return ctx.prisma.wish.update({
				where: { id: input.id },
				data: {
					title: input.title,
					description: input.description,
					price: input.price,
					url: input.url,
					wishList: {
						connect: { id: input.wishListId },
					},
				},
			});
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(({ input, ctx }) => {
			assertIsWishCreator(ctx, input.id);

			return ctx.prisma.wish.delete({ where: { id: input.id } });
		}),
});
