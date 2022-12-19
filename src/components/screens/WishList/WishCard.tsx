import {
	Button,
	Card,
	CardBody,
	CardFooter,
	Center,
	Divider,
	FormControl,
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
	Tag,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { DeleteAlert } from '@components/common/Alert/DeleteAlert';
import { EmptyStateWrapper } from '@components/EmptyStateWrapper';
import type { Wish } from '@prisma/client';
import { trpc } from '@utils/trpc';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { WishForm } from './WishListScreen';

export const WishCard = ({
	wish: wish,
	refreshListFunc,
}: {
	wish: Wish;
	refreshListFunc?: () => void;
}) => {
	const { register, handleSubmit, reset, setValue } = useForm<WishForm>();

	const { data: settings, isLoading } = trpc.settings.get.useQuery();

	const deleteWish = trpc.wish.delete.useMutation();

	const onDelete = async () => {
		await deleteWish.mutateAsync({ id: wish.id });
		if (refreshListFunc) refreshListFunc();
	};

	const formatPriceForDisplay = (price: number) => {
		return price.toLocaleString('local', {
			style: 'currency',
			currency: settings?.currency,
		});
	};

	const updateWish = trpc.wish.update.useMutation();

	const onSubmit = handleSubmit(async (data) => {
		onClose();
		await updateWish.mutateAsync({
			id: wish.id,
			title: data.title,
			description: data.description,
			price: Number(priceValue),
			url: data.url,
			wishListId: wish.wishListId,
		});
		reset();
		if (refreshListFunc) refreshListFunc();
	});

	const onOpenEdit = () => {
		setValue('title', wish.title);
		setValue('description', wish.description);
		setValue('price', wish.price.toString());
		setValue('url', wish.url);
		onOpen();
	};

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [priceValue, setPriceValue] = useState(wish.price.toString());

	return (
		<Center>
			<EmptyStateWrapper
				isLoading={isLoading}
				data={settings}
				EmptyComponent={
					<Center>
						<Tag size={'lg'} variant="solid" colorScheme="teal">
							No Settings
						</Tag>
					</Center>
				}
				NonEmptyComponent={
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
									{formatPriceForDisplay(wish.price)}
								</Text>
							</Stack>
						</CardBody>
						<Divider />
						<CardFooter
							justify="start"
							flexWrap="wrap"
							sx={{
								'& > button': {
									minW: '2rem',
								},
							}}
						>
							{wish.url && (
								<Button
									mr={4}
									mb={4}
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
								mr={2}
								mb={2}
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
						</CardFooter>
						<Modal
							isOpen={isOpen}
							onClose={onClose}
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
													setPriceValue(valueString)
												}
												defaultValue={wish.price.toString()}
												value={priceValue}
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
						</Modal>
					</Card>
				}
			/>
		</Center>
	);
};
