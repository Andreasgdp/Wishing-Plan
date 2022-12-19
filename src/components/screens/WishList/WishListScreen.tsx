import {
	Button,
	Center,
	Container,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Tag,
	useDisclosure,
} from '@chakra-ui/react';
import { EmptyStateWrapper } from '@components/EmptyStateWrapper';
import { Content } from '@components/layouts/Content';
import { trpc } from '@utils/trpc';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { WishesList } from './WishesList';

export type WishForm = {
	title: string;
	description: string;
	price: string;
	url: string;
};

type WishListScreenProps = {
	wishListId: string;
};

export const WishListScreen = (props: WishListScreenProps) => {
	const { register, handleSubmit, reset } = useForm<WishForm>();

	const { isLoading: isLoadingSettings } = trpc.settings.get.useQuery();

	const {
		data: wishes,
		isLoading: isLoadingWishes,
		refetch: refetchWishLists,
	} = trpc.wishList.getWishes.useQuery({
		id: props.wishListId,
	});

	const createWish = trpc.wish.create.useMutation();

	const onSubmit = handleSubmit(async (data) => {
		await createWish.mutateAsync({
			title: data.title,
			description: data.description,
			price: Number(data.price),
			url: data.url,
			wishListId: props.wishListId,
		});
		reset();
		await refetchWishLists();
		onClose();
	});

	// modal
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [value, setValue] = useState('69');

	return (
		<>
			<Content>
				<Container maxW="container.xl">
					<Center h="100px">
						<Button onClick={onOpen}>Add a Wish</Button>
					</Center>
					{/* TODO: replace with skeleton setup in future */}
					<EmptyStateWrapper
						isLoading={isLoadingWishes && isLoadingSettings}
						data={wishes}
						EmptyComponent={
							<Center>
								<Tag
									size={'lg'}
									variant="solid"
									colorScheme="teal"
								>
									No Wishes Yet
								</Tag>
							</Center>
						}
						NonEmptyComponent={
							<WishesList
								refreshListFunc={refetchWishLists}
								wishes={wishes ?? []}
							/>
						}
					/>
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
										<FormLabel>Name of Wish</FormLabel>
										<Input
											id="title"
											type="text"
											{...register('title')}
										/>
									</FormControl>
									<FormControl>
										<FormLabel>
											Describe your Wish
										</FormLabel>
										<Input
											id="description"
											type="text"
											{...register('description')}
										/>
									</FormControl>
									<FormControl isRequired>
										<FormLabel>
											Price of your Wish
										</FormLabel>

										<NumberInput
											id="price"
											{...register('price')}
											onChange={(valueString) =>
												setValue(valueString)
											}
											value={value}
											max={100000000}
											min={0}
										>
											<NumberInputField />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
									</FormControl>
									<FormControl>
										<FormLabel>URL for Wish</FormLabel>
										<Input
											id="url"
											type="url"
											{...register('url')}
										/>
									</FormControl>
								</form>
							</ModalBody>

							<ModalFooter>
								<Button type="submit" form="new-note">
									Submit
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>{' '}
				</Container>
			</Content>
		</>
	);
};
