import { TRPCError } from '@trpc/server';
import type { Context } from '../router/context';

/**
 *
 * @param ctx The context
 * @param planId The ID of the wish list
 */
export const assertHasAccessToPlan = async (ctx: Context, planId: string) => {
	// Get the authenticated user's ID
	const userId = ctx.session?.user?.id;

	const plan = await ctx.prisma.plan.findFirst({
		where: { id: planId },
	});
	if (!plan) {
		throw new TRPCError({ code: 'NOT_FOUND' });
	}

	if (plan.userId !== userId) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}
};
