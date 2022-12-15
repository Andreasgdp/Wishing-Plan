import { type NextPage } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import styles from './index.module.css';

import type { CtxOrReq } from 'next-auth/client/_utils';
import dynamic from 'next/dynamic';
import { Content } from '../components/layouts/Content';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
	const hello = trpc.example.hello.useQuery({ text: 'from tRPC' });

	return (
		<>
			<Content>
				<div className={styles.showcaseContainer}>
					<p className={styles.showcaseText}>
						{hello.data
							? hello.data.greeting
							: 'Loading tRPC query...'}
					</p>
				</div>
				<AuthShowcase />
			</Content>
		</>
	);
};

export default Home;

const CreateLinkForm = dynamic(
	() => import('../components/common/CreateLink'),
	{
		ssr: false,
	}
);

const AuthShowcase: React.FC = () => {
	const { data: sessionData } = useSession();

	const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
		undefined, // no input
		{ enabled: sessionData?.user !== undefined }
	);

	return (
		<div className={styles.authContainer}>
			<p className={styles.showcaseText}>
				{sessionData && (
					<div>
						<span>Logged in as {sessionData.user?.name}</span>
						<CreateLinkForm />
					</div>
				)}
				{secretMessage && <span> - {secretMessage}</span>}
			</p>
			<button
				className={styles.loginButton}
				onClick={sessionData ? () => signOut() : () => signIn()}
			>
				{sessionData ? 'Sign out' : 'Sign in'}
			</button>
		</div>
	);
};

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
