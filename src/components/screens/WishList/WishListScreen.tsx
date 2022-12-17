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

export const formatPriceForInput = (val: string) => `$` + val;
export const parsePrice = (val: string) => val.replace(/^\$/, '');
export const priceToNumber = (val: string) => Number(val.replace(/^\$/, ''));

export const WishListScreen = (props: WishListScreenProps) => {
	const { register, handleSubmit, reset } = useForm<WishForm>();

	const {
		data: wishes,
		isLoading,
		refetch: refetchWishLists,
	} = trpc.wishList.getWishes.useQuery({
		id: props.wishListId,
	});

	const createWish = trpc.wish.create.useMutation();

	const onSubmit = handleSubmit(async (data) => {
		onClose();
		await createWish.mutateAsync({
			title: data.title,
			description: data.description,
			price: priceToNumber(data.price),
			url: data.url,
			wishListId: props.wishListId,
		});
		reset();
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
						isLoading={isLoading}
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
									<FormControl isRequired>
										<FormLabel>
											Describe your Wish
										</FormLabel>
										<Input
											id="description"
											type="text"
											{...register('description')}
										/>
										<FormErrorMessage>
											Description is required.
										</FormErrorMessage>
									</FormControl>
									<FormControl isRequired>
										<FormLabel>
											Price of your Wish
										</FormLabel>

										<NumberInput
											id="price"
											{...register('price')}
											onChange={(valueString) =>
												setValue(
													parsePrice(valueString)
												)
											}
											value={formatPriceForInput(value)}
											max={100000000}
											min={0}
										>
											<NumberInputField />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
										<FormErrorMessage>
											Price is required.
										</FormErrorMessage>
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
