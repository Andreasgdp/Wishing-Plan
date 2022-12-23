import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Center,
	Heading,
	Text,
} from '@chakra-ui/react';
import { DeleteAlert } from '@components/common/Alert/DeleteAlert';
import type { WishList } from '@prisma/client';
import { trpc } from '@utils/trpc';
import router from 'next/router';
import { WishListModal } from './WishListModal';

export const WishListCard = ({
	wishList,
	refreshListFunc,
}: {
	wishList: WishList;
	refreshListFunc?: () => void;
}) => {
	const deleteWishList = trpc.wishList.delete.useMutation();

	const onDelete = async () => {
		await deleteWishList.mutateAsync({ id: wishList.id });
		if (refreshListFunc) refreshListFunc();
	};

	const editWishList = trpc.wishList.update.useMutation();

	const onSubmit = async (name: string, description: string) => {
		await editWishList.mutateAsync({
			id: wishList.id,
			name: name,
			description: description,
		});
		if (refreshListFunc) await refreshListFunc();
	};

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
					<Button
						mr={4}
						mb={4}
						colorScheme="purple"
						variant="solid"
						onClick={() => {
							router.push(`/wishlists/${wishList.id}`);
						}}
					>
						View here
					</Button>

					<WishListModal
						buttonProps={{
							mr: 2,
							mb: 2,
							variant: 'ghost',
							colorScheme: 'purple',
						}}
						buttonName="Edit"
						onSubmit={onSubmit}
						existingWishList={wishList}
					/>

					<DeleteAlert
						typeToDelete="WishList"
						entityName={wishList.name}
						onDelete={onDelete}
					/>
				</CardFooter>
			</Card>
		</Center>
	);
};
