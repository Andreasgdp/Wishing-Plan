import { WishListScreen } from '@components/screens/WishList/WishListScreen';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const ClassroomPage: NextPage = () => {
	const router = useRouter();
	const wishListId = router.query.wishlistid as string;

	return (
		<>
			<Head>
				<title>Classrooms</title>
				<meta
					name="description"
					content="all of the classrooms you've created as a teacher"
				/>
			</Head>

				<WishListScreen wishListId={wishListId} />
		</>
	);
};

export default ClassroomPage;
