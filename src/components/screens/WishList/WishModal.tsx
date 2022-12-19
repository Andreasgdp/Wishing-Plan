import type { ButtonProps } from '@chakra-ui/react';
import {
	Button,
	Center,
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
	Textarea,
	useDisclosure,
} from '@chakra-ui/react';
import type { Wish } from '@prisma/client';
import { trpc } from '@utils/trpc';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export type WishForm = {
	title: string;
	description?: string;
	price: string;
	url: string;
	imageUrl: string;
};

type WishModalProps = {
	buttonName: string;
	buttonProps: ButtonProps;
	onSubmit: (
		title: string,
		description: string,
		url: string,
		imageUrl: string,
		price: number
	) => void;
	existingWish?: Wish;
};

export const WishModal = (props: WishModalProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { register, handleSubmit, reset, getValues, setValue, setFocus } =
		useForm<WishForm>();

	const [priceValue, setPriceValue] = useState('0');
	const [descriptionValue, setDescriptionValue] = useState('');

	const scrapeProduct = trpc.scraping.get.useMutation();

	const onGetProductData = async () => {
		const values = getValues();
		const url = values.url;

		if (!url) return;

		const scrapingData = await scrapeProduct.mutateAsync({
			url: url,
		});
		if (!scrapingData) return;

		setValue('title', scrapingData.title);
		setPriceValue(scrapingData.price.toString());
		setValue('imageUrl', scrapingData.imageUrl ?? '');
	};

	const onSubmit = handleSubmit(async (data) => {
		props.onSubmit(
			data.title,
			descriptionValue,
			data.url,
			data.imageUrl,
			Number(priceValue)
		);
		reset();
		setPriceValue('0');
		onClose();
	});

	const openModal = () => {
		if (props.existingWish) {
			setValue('title', props.existingWish.title);
			setDescriptionValue(props.existingWish.description ?? '');
			setValue('url', props.existingWish.url);
			setValue('imageUrl', props.existingWish.imageUrl ?? '');
			setPriceValue(props.existingWish.price.toString());
		}
		setFocus('url');
		onOpen();
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setDescriptionValue(e.target.value);
	};

	return (
		<>
			<Button {...props.buttonProps} onClick={openModal}>
				{props.buttonName}
			</Button>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>
						<ModalCloseButton />
					</ModalHeader>

					<ModalBody>
						<form id="new-note" onSubmit={onSubmit}>
							<FormControl>
								<FormLabel>URL for Wish</FormLabel>
								<Input
									id="url"
									type="url"
									{...register('url')}
								/>
							</FormControl>
							<FormControl>
								<Center mt={6} mb={2}>
									<Button onClick={onGetProductData}>
										Get Data From URL
									</Button>
								</Center>
							</FormControl>
							<FormControl>
								<FormLabel>URL for Image</FormLabel>
								<Input
									id="imageUrl"
									type="url"
									{...register('imageUrl')}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Name of Wish</FormLabel>
								<Input
									id="title"
									type="text"
									{...register('title')}
								/>
							</FormControl>
							<FormControl isRequired>
								<FormLabel>Price of your Wish</FormLabel>

								<NumberInput
									id="price"
									{...register('price')}
									onChange={(valueString) =>
										setPriceValue(valueString)
									}
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
								<FormLabel>Describe your Wish</FormLabel>
								<Textarea
									value={descriptionValue}
									onChange={handleDescriptionChange}
									placeholder="Here is a sample placeholder"
									size="sm"
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
		</>
	);
};
