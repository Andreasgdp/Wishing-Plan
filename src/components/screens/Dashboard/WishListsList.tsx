import { Container, SimpleGrid } from '@chakra-ui/react';
import styled from '@emotion/styled';
import type { WishList } from '@prisma/client';
import { WishListCard } from './WishListCard';

const CircleImage = styled.img`
	border-radius: 50%;
`;

export const WishListsList = ({
	wishLists,
	refreshListFunc,
}: {
	wishLists: WishList[];
	refreshListFunc?: () => void;
}) => {
	return (
		<Container maxW="container.xl">
			<SimpleGrid minChildWidth="21rem" spacing="40px">
				{wishLists.map((wishList) => (
					<WishListCard
						refreshListFunc={refreshListFunc}
						key={wishList.id}
						wishList={wishList}
					/>
				))}
			</SimpleGrid>
		</Container>
	);
};
