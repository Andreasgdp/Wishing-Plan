import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Heading,
	Text,
} from '@chakra-ui/react';
import { DeleteAlert } from '@components/common/Alert/DeleteAlert';
import type { WishList } from '@prisma/client';
import { trpc } from '@utils/trpc';

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

	return (
		<Card>
			<CardHeader>
				<Heading size="md"> {wishList.name}</Heading>
			</CardHeader>
			<CardBody>
				<Text>{wishList.description}</Text>
			</CardBody>
			<CardFooter gap={3} justifyContent="space-evenly">
				<Button>View here</Button>
				<DeleteAlert
					typeToDelete="WishList"
					entityName={wishList.name}
					onDelete={onDelete}
				/>
			</CardFooter>
		</Card>
	);
};
