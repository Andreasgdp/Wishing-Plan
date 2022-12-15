import {
	Button,
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
	useDisclosure,
} from '@chakra-ui/react';
import { EmptyStateWrapper } from '@components/EmptyStateWrapper';
import { trpc } from '@utils/trpc';
import { useForm } from 'react-hook-form';
import { WishListsList } from './WishListsList';

type CreateWishListForm = {
	name: string;
	description: string;
};

export const DashboardScreen = () => {
	const { register, handleSubmit, reset } = useForm<CreateWishListForm>();

	const {
		data: wishLists,
		isLoading,
		refetch: refetchWishLists,
	} = trpc.wishList.getAll.useQuery();

	const createWishList = trpc.wishList.create.useMutation();

	const onSubmit = handleSubmit(async (data) => {
		await createWishList.mutateAsync({
			name: data.name,
			description: data.description,
		});
		reset();
		onClose();
	});

	// modal
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<Button onClick={onOpen}>Create a WishList</Button>

			<EmptyStateWrapper
				isLoading={isLoading}
				data={wishLists}
				EmptyComponent={<p>Empty</p>}
				NonEmptyComponent={
					<WishListsList wishLists={wishLists ?? []} />
				}
			/>
			<FormErrorMessage>Description is required.</FormErrorMessage>

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
									{...register('name', { required: true })}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Describe your</FormLabel>
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
		</>
	);
};
