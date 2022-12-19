import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';

import { DashboardScreen } from '@components/screens/Dashboard/DashboardScreen';
import { requireAuthentication } from '@utils/requireAuthentication';

const Home: NextPage = () => {
	return (
		<>
			<DashboardScreen />
		</>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async () => {
		return {
			props: {},
		};
	}
);
