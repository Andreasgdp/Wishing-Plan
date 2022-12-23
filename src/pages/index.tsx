import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { type NextPage } from 'next';

import { DashboardScreen } from '@components/screens/Dashboard/DashboardScreen';
import { getAuthSession } from '@utils/getServerSession';
import { useSession } from 'next-auth/react';
import router from 'next/router';

const Home: NextPage = () => {
	const { data: sessionData } = useSession();

	if (!sessionData) {
		router.push('/product');
		return null;
	}

	return (
		<>
			<DashboardScreen />
		</>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (
	ctx: GetServerSidePropsContext
) => {
	const session = await getAuthSession(ctx);

	if (!session) {
		return {
			redirect: {
				destination: '/product',
				permanent: false,
			},
		};
	}

	return {
		props: {
			session,
		},
	};
};
