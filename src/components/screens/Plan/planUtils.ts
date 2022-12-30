import { PlanWish } from "@prisma/client";
import { PlanWishType } from "@server/trpc/router/Plan/plan";

export const SavingsFrequency = {
	SOM: 'SOM',
	EOM: 'EOM',
	ED: 'ED',
	EW: 'EW',
	E14D: 'E14D',
} as const;

export function updatePlacement(
	planWishes: PlanWish[] | PlanWishType[],
	oldIndex: number,
	newIndex: number
) {
	console.log('updatePlacement', oldIndex, newIndex);
	console.log('planWishes', planWishes);
	
	for (const planWish of planWishes) {
		if (planWish.placement === oldIndex) {
			planWish.placement = newIndex;
		} else if (
			planWish.placement > oldIndex &&
			planWish.placement <= newIndex
		) {
			planWish.placement--;
		} else if (
			planWish.placement < oldIndex &&
			planWish.placement >= newIndex
		) {
			planWish.placement++;
		}
	}

	console.log('planWishes', planWishes);
	

	return planWishes;
}