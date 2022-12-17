import {
	Button,
	Center,
	Container,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tag,
	useDisclosure,
} from '@chakra-ui/react';
import { EmptyStateWrapper } from '@components/EmptyStateWrapper';
import { Content } from '@components/layouts/Content';
import { trpc } from '@utils/trpc';
import { useForm } from 'react-hook-form';
import { WishListsList } from './WishListsList';

export type WishListForm = {
	name: string;
	description: string;
};

export const DashboardScreen = () => {
	const { register, handleSubmit, reset } = useForm<WishListForm>();

	const {
		data: wishLists,
		isLoading,
		refetch: refetchWishLists,
	} = trpc.wishList.getAll.useQuery();

	const createWishList = trpc.wishList.create.useMutation();

	const onSubmit = handleSubmit(async (data) => {
		onClose();
		await createWishList.mutateAsync({
			name: data.name,
			description: data.description,
		});
		reset();
	});

	// modal
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Content>
				<Container maxW="container.xl">
					<Center h="100px">
						<Button onClick={onOpen}>Create a WishList</Button>
					</Center>
					{/* TODO: replace with skeleton setup in future */}
					<EmptyStateWrapper
						isLoading={isLoading}
						data={wishLists}
						EmptyComponent={
							<Center>
								<Tag
									size={'lg'}
									variant="solid"
									colorScheme="teal"
								>
									No WishLists
								</Tag>
							</Center>
						}
						NonEmptyComponent={
							<WishListsList
								refreshListFunc={refetchWishLists}
								wishLists={wishLists ?? []}
							/>
						}
					/>
					<FormErrorMessage>
						Description is required.
					</FormErrorMessage>
					<Modal
						isOpen={isOpen}
						onClose={onClose}
						onCloseComplete={refetchWishLists}
					>
						<ModalOverlay />

						<ModalContent>
							<ModalHeader>
								<ModalCloseButton />
							</ModalHeader>

							<ModalBody>
								<form id="new-note" onSubmit={onSubmit}>
									<FormControl isRequired>
										<FormLabel>Name of WishList</FormLabel>
										<Input
											id="name"
											type="text"
											{...register('name', {
												required: true,
											})}
										/>
									</FormControl>
									<FormControl isRequired>
										<FormLabel>
											Describe your WishList
										</FormLabel>
										<Input
											id="description"
											type="text"
											{...register('description', {
												required: true,
											})}
										/>
										<FormErrorMessage>
											Description is required.
										</FormErrorMessage>
									</FormControl>
								</form>
							</ModalBody>

							<ModalFooter>
								<Button type="submit" form="new-note">
									Submit
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
				</Container>
			</Content>
		</>
	);
};
