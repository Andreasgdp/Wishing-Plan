import { SavingsFrequency } from '@components/screens/Plan/planUtils';
import { prisma } from '@server/db/client';
import type { User } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';

export async function signInChecks(user: User | AdapterUser) {
	if (user.name) {
		await hasSettingsCheck(user);
		await hasPlanCheck(user);
		return true;
	} else {
		// User has no custom name yet, redirect him
		return '/userInfo';
	}
}
async function hasSettingsCheck(user: User | AdapterUser) {
	const settings = await prisma.userSettings.findFirst({
		where: {
			userId: user.id,
		},
	});

	if (!settings) {
		// create settings in prisma
		await prisma.userSettings.create({
			data: {
				userId: user.id,
				currency: 'USD',
			},
		});
	}
}

async function hasPlanCheck(user: User | AdapterUser) {
	const plan = await prisma.plan.findFirst({
		where: {
			userId: user.id,
		},
	});

	if (!plan) {
		// create plan in prisma
		await prisma.plan.create({
			data: {
				userId: user.id,
				amountToSave: 0,
				autoUpdateSavedAmount: false,
				currentAmountSaved: 0,
				firstSaving: new Date(),
				frequency: SavingsFrequency.SOM,
			},
		});
	}
}
