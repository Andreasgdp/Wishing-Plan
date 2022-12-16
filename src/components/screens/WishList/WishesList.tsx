import { Container, SimpleGrid } from '@chakra-ui/react';
import styled from '@emotion/styled';
import type { Wish } from '@prisma/client';
import { WishCard } from './WishCard';

const CircleImage = styled.img`
	border-radius: 50%;
`;

export const WishesList = ({
	wishes,
	refreshListFunc,
}: {
	wishes: Wish[];
	refreshListFunc?: () => void;
}) => {
	return (
		<Container maxW="container.xxl">
			<SimpleGrid minChildWidth="21rem" spacing="40px">
				{wishes.map((wish) => (
					<WishCard
						refreshListFunc={refreshListFunc}
						key={wish.id}
						wish={wish}
					/>
				))}
			</SimpleGrid>
		</Container>
	);
};
