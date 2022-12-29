import {
	Button,
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
import { SortableItem } from '@components/screens/Plan/SortableItem';
import { WishModal } from '@components/screens/WishList/WishModal';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { PlanWishType } from '@server/trpc/router/Plan/plan';
import { trpc } from '@utils/trpc';
import { useEffect, useState } from 'react';
import { updatePlacement } from './planUtils';

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
						isLoading={isLoading}
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
							<Flex justifyContent="right" mb={4}>
								<Button
									colorScheme={'blue'}
									onClick={() =>
										toast({
											title: 'Plan saved successfully',
											description:
												"We've updated your plan.",
											status: 'success',
											duration: 2000,
											isClosable: true,
											position: 'top',
										})
									}
								>
									Save
								</Button>
							</Flex>

							<DndContext
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<Stack spacing={4}>
									<SortableContext
										items={stateWishes}
										strategy={verticalListSortingStrategy}
									>
										{/* We need components that use the useSortable hook */}
										{stateWishes.map((wish) => (
											<SortableItem
												key={wish.id}
												wish={wish}
												currency={currency ?? ''}
											/>
										))}
									</SortableContext>
								</Stack>
							</DndContext>
						</Content>
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

				relocateWish.mutateAsync({
					planId: 'clc87ke8v00009muo690pm3fn',
					wishId: active.id.toString(),
					oldIndex: oldWish?.placement ?? 0,
					newIndex: newWish?.placement ?? 0,
				});

				// sort items in ascending order based on placement
				items = items.sort((a, b) => a.placement - b.placement);

				items = updatePlacement(
					items,
					oldWish?.placement ?? 0,
					newWish?.placement ?? 0
				) as PlanWishType[];

				const activeIndex = items.map((e) => e.id).indexOf(active.id.toString());
				const overIndex = items.map((e) => e.id).indexOf(over.id.toString());
				return arrayMove(items, activeIndex, overIndex);
			});
		}
	}
};
