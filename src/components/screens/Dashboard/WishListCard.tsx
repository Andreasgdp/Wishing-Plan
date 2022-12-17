import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Center,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import { DeleteAlert } from '@components/common/Alert/DeleteAlert';
import type { WishList } from '@prisma/client';
import { trpc } from '@utils/trpc';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import type { WishListForm } from './DashboardScreen';

export const WishListCard = ({
	wishList,
	refreshListFunc,
}: {
	wishList: WishList;
	refreshListFunc?: () => void;
}) => {
	const { register, handleSubmit, reset, setValue } = useForm<WishListForm>();

	const deleteWishList = trpc.wishList.delete.useMutation();

	const onDelete = async () => {
		await deleteWishList.mutateAsync({ id: wishList.id });
		if (refreshListFunc) refreshListFunc();
	};

	const editWishList = trpc.wishList.update.useMutation();

	const onSubmit = handleSubmit(async (data) => {
		onClose();
		await editWishList.mutateAsync({
			id: wishList.id,
			name: data.name,
			description: data.description,
		});
		reset();
	});

	const onOpenEdit = () => {
		setValue('name', wishList.name);
		setValue('description', wishList.description);
		onOpen();
	};

	// modal
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Center>
			<Card maxW={'30rem'}>
				<CardHeader>
					<Heading size="md"> {wishList.name}</Heading>
				</CardHeader>
				<CardBody>
					<Text>{wishList.description}</Text>
				</CardBody>
				<CardFooter
					justify="start"
					flexWrap="wrap"
					sx={{
						'& > button': {
							minW: '2rem',
						},
					}}
				>
					<Link href={`/wishlists/${wishList.id}`}>
						<Button
							mr={4}
							mb={4}
							colorScheme="purple"
							variant="solid"
						>
							View here
						</Button>
					</Link>
					<Button mr={2} mb={2} variant="ghost" onClick={onOpenEdit}>
						Edit
					</Button>

					<DeleteAlert
						typeToDelete="WishList"
						entityName={wishList.name}
						onDelete={onDelete}
					/>
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
		</Center>
	);
};
