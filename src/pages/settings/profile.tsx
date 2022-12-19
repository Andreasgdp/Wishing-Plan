import { requireAuthentication } from '@utils/requireAuthentication';
import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

import { Button, Container, Stack } from '@chakra-ui/react';
import { Navigation } from '@components/common/Navigation/Navigation';
import { Content } from '@components/layouts/Content';
import { settingsNavigationData } from '@lib/constants';

// TODO: implement something like this to get rid of duplicate code when creating new pages in the settings section

// Create about page component
const Profile = () => {
	const { data: sessionData } = useSession();

	return (
		<>
			<Head>
				<title>Profile - {sessionData?.user?.name}</title>
			</Head>
			<Container maxW={'7xl'} flex={'1 0 auto'} py={8} mt={20}>
				<Stack
					direction={{ base: 'column', lg: 'row' }}
					spacing={{ base: 0, lg: 8 }}
				>
					<Navigation
						data={settingsNavigationData}
						baseURL="/settings"
					/>
					<Content>
						<Button>I am a button</Button>
					</Content>
				</Stack>
			</Container>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async () => {
		return {
			props: {},
		};
	}
);

export default Profile;
