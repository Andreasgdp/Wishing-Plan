import { requireAuthentication } from '@utils/requireAuthentication';
import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

import { Center, Container, Flex, Stack } from '@chakra-ui/react';
import { Content } from '@components/layouts/Content';
import { PlanSidebar } from '@components/screens/Plan/PlanSidebar';
import { SortableItem } from '@components/screens/Plan/SortableItem';
import { WishModal } from '@components/screens/WishList/WishModal';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';

// TODO: implement something like this to get rid of duplicate code when creating new pages in the settings section
// https://github.com/hauptrolle/chakra-templates/blob/main/src/pages/%5B...slug%5D.tsx

const Plan = () => {
	const { data: sessionData } = useSession();
	const [languages, setLanguages] = useState(['Wish 1', 'Wish 2', 'Wish 3']);

	return (
		<>
			<Head>
				<title>Profile - {sessionData?.user?.name}</title>
			</Head>
			<Container maxW={'7xl'} flex={'1 0 auto'} py={8}>
				<Stack
					direction={{ base: 'column', lg: 'row' }}
					spacing={{ base: 0, lg: 8 }}
				>
					<PlanSidebar />
					<Flex
						direction={'column'}
						w={'full'}
						maxW={{ lg: 'calc(100% - 16rem)' }}
					>
						<Content>
							<Center h="100px">
								<WishModal
									buttonProps={{
										variant: 'solid',
										colorScheme: 'green',
									}}
									buttonName="Add a wish"
									onSubmit={(data) => {
										console.log(data);
									}}
								/>
							</Center>
							<DndContext
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<Stack spacing={4}>
									<SortableContext
										items={languages}
										strategy={verticalListSortingStrategy}
									>
										{/* We need components that use the useSortable hook */}
										{languages.map((language) => (
											<SortableItem
												key={language}
												id={language}
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

	function handleDragEnd(event: any) {
		console.log('Drag end called');
		const { active, over } = event;
		console.log('ACTIVE: ' + active.id);
		if (over === null) {
			console.log('OVER: null');
			return;
		}
		console.log('OVER :' + over.id);

		if (active.id !== over.id) {
			setLanguages((items) => {
				const activeIndex = items.indexOf(active.id);
				const overIndex = items.indexOf(over.id);
				console.log(arrayMove(items, activeIndex, overIndex));
				return arrayMove(items, activeIndex, overIndex);
				// items: [2, 3, 1]   0  -> 2
				// [1, 2, 3] oldIndex: 0 newIndex: 2  -> [2, 3, 1]
			});
		}
	}
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async () => {
		return {
			props: {},
		};
	}
);

export default Plan;
