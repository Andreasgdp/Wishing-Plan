import {
	Button,
	ButtonGroup,
	Card,
	CardBody,
	CardFooter,
	Center,
	Divider,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Image,
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
	Stack,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { DeleteAlert } from '@components/common/Alert/DeleteAlert';
import type { Wish } from '@prisma/client';
import { trpc } from '@utils/trpc';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { WishForm } from './WishListScreen';
import {
	formatPriceForInput,
	parsePrice,
	priceToNumber,
} from './WishListScreen';

export const WishCard = ({
	wish: wish,
	refreshListFunc,
}: {
	wish: Wish;
	refreshListFunc?: () => void;
}) => {
	const { register, handleSubmit, reset, setValue } = useForm<WishForm>();

	const deleteWish = trpc.wish.delete.useMutation();

	const onDelete = async () => {
		await deleteWish.mutateAsync({ id: wish.id });
		if (refreshListFunc) refreshListFunc();
	};

	const formatPrice = (price: number) => {
		return price.toLocaleString('dk-DK', {
			style: 'currency',
			currency: 'DKK',
		});
	};

	const updateWish = trpc.wish.update.useMutation();

	const onSubmit = handleSubmit(async (data) => {
		await updateWish.mutateAsync({
			id: wish.id,
			title: data.title,
			description: data.description,
			price: priceToNumber(data.price),
			url: data.url,
			wishListId: wish.wishListId,
		});
		reset();
		onClose();
	});

	const onOpenEdit = () => {
		setValue('title', wish.title);
		setValue('description', wish.description);
		setValue('price', formatPriceForInput(wish.price.toString()));
		setValue('url', wish.url);
		onOpen();
	};

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [value, setPriceValue] = useState('69');

	return (
		<Center>
			<Card maxW={'30rem'}>
				<CardBody>
					<Center>
						<Image
							src="/images/placeholderWish.png"
							alt={wish.title}
							borderRadius="lg"
						/>
					</Center>
					<Stack mt="6" spacing="3">
						<Heading size="md">{wish.title}</Heading>
						<Text>{wish.description}</Text>
						<Text color="blue.600" fontSize="2xl">
							{formatPrice(wish.price)}
						</Text>
					</Stack>
				</CardBody>
				<Divider />
				<CardFooter>
					<ButtonGroup spacing="2">
						{wish.url && (
							<Button
								colorScheme="purple"
								variant="solid"
								onClick={(e) => {
									e.preventDefault();
									window.open(wish.url, '_blank');
								}}
							>
								Open link
							</Button>
						)}

						<Button
							variant="ghost"
							colorScheme="purple"
							onClick={onOpenEdit}
						>
							Edit
						</Button>
						<DeleteAlert
							typeToDelete="Wish"
							entityName={wish.title}
							onDelete={onDelete}
						/>
					</ButtonGroup>
				</CardFooter>
				<Modal
					isOpen={isOpen}
					onClose={onClose}
					onCloseComplete={refreshListFunc}
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
									<FormLabel>Describe your Wish</FormLabel>
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
									<FormLabel>Price of your Wish</FormLabel>

									<NumberInput
										id="price"
										{...register('price')}
										onChange={(valueString) =>
											setPriceValue(
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
			</Card>
		</Center>
	);
};
