import { type NextPage } from 'next';
import { getSession } from 'next-auth/react';

import { DashboardScreen } from '@components/screens/Dashboard/DashboardScreen';
import type { CtxOrReq } from 'next-auth/client/_utils';

const Home: NextPage = () => {
	return (
		<>
			<DashboardScreen />
		</>
	);
};

export default Home;

export async function getServerSideProps(context: CtxOrReq | undefined) {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/product',
				permanent: false,
			},
		};
	}

	return {
		props: {},
	};
}
