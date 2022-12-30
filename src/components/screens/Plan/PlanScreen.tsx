import {
	Center,
	Container,
	Flex,
	Stack,
	Tag,
	useToast,
} from '@chakra-ui/react';
import { EmptyStateWrapper } from '@components/EmptyStateWrapper';
import { Content } from '@components/layouts/Content';
import { PlanSidebar } from '@components/screens/Plan/PlanSidebar';
import type { SortablePlanWishType } from '@components/screens/Plan/PlanWish';
import { PlanWishComponent } from '@components/screens/Plan/PlanWish';
import { WishModal } from '@components/screens/WishList/WishModal';
import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Plan } from '@prisma/client';
import type { PlanWishType } from '@server/trpc/router/Plan/plan';
import { trpc } from '@utils/trpc';
import moment from 'moment';
import { useEffect, useState } from 'react';

export const PlanScreen = () => {
	const toast = useToast();
	const {
		data: plan,
		isLoading,
		refetch: refetchPlan,
	} = trpc.plan.get.useQuery();

	const {
		data: wishes,
		isLoading: isLoadingWishes,
		refetch: refetchWishLists,
	} = trpc.plan.getWishes.useQuery({
		planId: 'clc87ke8v00009muo690pm3fn',
	});

	const {
		data: currency,
		isLoading: isLoadingCurrency,
		refetch: refetchCurrency,
	} = trpc.settings.getCurrency.useQuery();

	const [stateWishes, setWishes] = useState<PlanWishType[]>([]);

	const createAndAddWish = trpc.plan.createAndAddWish.useMutation();

	const relocateWish = trpc.plan.relocateWish.useMutation();

	useEffect(() => {
		setWishes(wishes ?? []);
	}, [wishes]);

	const onSubmit = async (
		title: string,
		description: string,
		url: string,
		imageUrl: string,
		price: number
	) => {
		await createAndAddWish.mutateAsync({
			planId: 'clc87ke8v00009muo690pm3fn',
			wishTitle: title,
			wishDescription: description ?? '',
			wishPrice: price,
			wishUrl: url,
			wishImageUrl: imageUrl,
		});
		await refetchWishLists();
	};

	return (
		<>
			<Container maxW={'7xl'} flex={'1 0 auto'} py={8}>
				<Stack
					direction={{ base: 'column', lg: 'row' }}
					spacing={{ base: 0, lg: 8 }}
				>
					<EmptyStateWrapper
						isLoading={isLoading && isLoadingCurrency}
						data={plan}
						EmptyComponent={
							<Center>
								<Tag
									size={'lg'}
									variant="solid"
									colorScheme="teal"
								>
									No Plan
								</Tag>
							</Center>
						}
						NonEmptyComponent={
							<PlanSidebar plan={plan ?? undefined} />
						}
					/>

					<Flex
						direction={'column'}
						w={'full'}
						maxW={{ lg: 'calc(100% - 16rem)' }}
					>
						<EmptyStateWrapper
							isLoading={isLoadingWishes && isLoadingCurrency}
							data={plan}
							EmptyComponent={
								<Center>
									<Tag
										size={'lg'}
										variant="solid"
										colorScheme="teal"
									>
										No Plan
									</Tag>
								</Center>
							}
							NonEmptyComponent={
								<Content>
									<Center>
										<WishModal
											buttonProps={{
												variant: 'solid',
												colorScheme: 'green',
											}}
											buttonName="Add a wish"
											onSubmit={onSubmit}
										/>
									</Center>
									<Flex justifyContent="right" mb={4}></Flex>

									<DndContext
										collisionDetection={closestCenter}
										onDragEnd={handleDragEnd}
									>
										<Stack spacing={4}>
											<SortableContext
												items={stateWishes}
												strategy={
													verticalListSortingStrategy
												}
											>
												<>
													{/* We need components that use the useSortable hook */}
													{stateWishes.map((wish) => {
														return (
															<PlanWishComponent
																key={wish.id}
																wish={addTimeLeftAndPercentage(
																	plan ??
																		undefined,
																	wish
																)}
																currency={
																	currency ??
																	''
																}
																onPlacementChange={(
																	newIndex,
																	oldIndex
																) => {
																	relocateWish
																		.mutateAsync(
																			{
																				planId: 'clc87ke8v00009muo690pm3fn',
																				wishId: wish.id,
																				newIndex,
																				oldIndex,
																			}
																		)
																		.then(
																			() => {
																				refetchWishLists();
																			}
																		);
																}}
															/>
														);
													})}
												</>
											</SortableContext>
										</Stack>
									</DndContext>
								</Content>
							}
						/>
					</Flex>
				</Stack>
			</Container>
		</>
	);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (over === null) {
			return;
		}

		if (active.id !== over.id) {
			setWishes((items) => {
				if (items === undefined) {
					return [];
				}

				const oldWish = items.find((e) => e.id === active.id);
				const newWish = items.find((e) => e.id === over.id);

				relocateWish
					.mutateAsync({
						planId: 'clc87ke8v00009muo690pm3fn',
						wishId: active.id.toString(),
						oldIndex: oldWish?.placement ?? 0,
						newIndex: newWish?.placement ?? 0,
					})
					.then(async () => {
						await refetchWishLists();
					});

				const activeIndex = items
					.map((e) => e.id)
					.indexOf(active.id.toString());
				const overIndex = items
					.map((e) => e.id)
					.indexOf(over.id.toString());
				return arrayMove(items, activeIndex, overIndex);
			});
		}
	}

	function addTimeLeftAndPercentage(
		plan: Plan | undefined,
		wish: PlanWishType
	): SortablePlanWishType {
		if (plan === undefined) {
			return {
				...wish,
				timeLeft: {
					text: '',
					isPurchaseable: false,
				},
				percentage: 0,
			};
		}

		const percentage = calculatePercentage(plan, wish);
		const intervalsLeft = calculateIntervalsLeft(plan, wish);
		const timeLeftText = intervalsLeftText(plan, intervalsLeft);

		const timeLeft = {
			text: timeLeftText,
			isPurchaseable: wish.sumOfMoney - plan.currentAmountSaved <= 0,
		};

		return {
			...wish,
			timeLeft,
			percentage,
		};
	}

	function calculatePercentage(plan: Plan | undefined, wish: PlanWishType) {
		if (plan === undefined) {
			return 0;
		}

		const percentage = (plan.currentAmountSaved / wish.sumOfMoney) * 100;

		return percentage;
	}

	function calculateIntervalsLeft(
		plan: Plan | undefined,
		wish: PlanWishType
	) {
		if (plan === undefined) {
			return 0;
		}

		const remainingPrice = wish.sumOfMoney - plan.currentAmountSaved;

		const intervalsLeft = remainingPrice / plan.amountToSave;

		return Math.ceil(intervalsLeft);
	}

	function intervalsLeftText(plan: Plan, intervalsLeft: number) {
		if (intervalsLeft <= 0) {
			return 'You can buy this now!';
		}

		const frequency = plan.frequency.toLowerCase();
		const firstSavingDate = plan.firstSaving;

		// calculate next saving date based on the frequency
		const nextSavingDate = calculateNextSavingDate(
			intervalsLeft,
			frequency,
			firstSavingDate
		);

		console.log('nextSavingDate', nextSavingDate);

		const today = new Date();
		const m1 = moment(today);
		const m2 = moment(nextSavingDate);
		const timeLeftText = moment.duration(m1.diff(m2)).humanize();

		return `${timeLeftText} left`;
	}

	function calculateNextSavingDate(
		intervalsLeft: number,
		frequency: string,
		firstSavingDate: Date
	) {
		const today = new Date();
		const firstSaving = new Date(firstSavingDate);
		const daysSinceFirstSaving = Math.floor(
			(today.getTime() - firstSaving.getTime()) / (1000 * 60 * 60 * 24)
		);
		console.log('intervalsLeft', intervalsLeft);

		switch (frequency) {
			case 'som':
				return new Date(
					today.getFullYear(),
					today.getMonth() + 1 * intervalsLeft,
					1
				);
			case 'eom':
				return new Date(
					today.getFullYear(),
					today.getMonth() + 1 * intervalsLeft,
					0
				);
			case 'ed':
				return new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() + 1 * intervalsLeft
				);
			case 'ew':
				const daysSinceLastWeeklySaving = daysSinceFirstSaving % 7;
				const daysUntilNextWeeklySaving = 7 - daysSinceLastWeeklySaving;
				return new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() + daysUntilNextWeeklySaving * intervalsLeft
				);
			case 'e14d':
				const daysSinceLast14DaySaving = daysSinceFirstSaving % 14;
				const daysUntilNext14DaySaving = 14 - daysSinceLast14DaySaving;
				return new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() + daysUntilNext14DaySaving * intervalsLeft
				);
			default:
				return new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate()
				);
		}
	}
};
