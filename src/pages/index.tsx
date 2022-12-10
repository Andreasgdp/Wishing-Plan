import { type NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import Hero from '../components/hero-section';
import Testimonials from '../components/testimonials';
import styles from './index.module.css';

import Content from '../components/layouts/content';
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
				<Hero></Hero>
				<Testimonials></Testimonials>
			</Content>
		</>
	);
};

export default Home;

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
					<span>Logged in as {sessionData.user?.name}</span>
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
