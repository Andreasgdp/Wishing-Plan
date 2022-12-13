import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import { ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Fonts from '../components/fonts';
import Layout from '../components/layouts/layout';
import theme from '../libs/theme';
import '../styles/globals.css';

const prefersDarkMode = () => {
	return globalThis?.window?.matchMedia('(prefers-color-scheme: dark)')
		.matches;
};

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
	router,
}) => {
	return (
		<SessionProvider session={session}>
			<Head>
				{!prefersDarkMode() && (
					<>
						<link
							rel="shortcut icon"
							href="/favicon/logo-light.ico"
						/>
					</>
				)}
				{prefersDarkMode() && (
					<>
						<link
							rel="shortcut icon"
							href="/favicon/logo-dark.ico"
						/>
					</>
				)}
			</Head>
			<ChakraProvider theme={theme}>
				<Fonts />
				<Layout>
					<AnimatePresence
						exitBeforeEnter
						initial={true}
						onExitComplete={() => {
							if (typeof window !== 'undefined') {
								window.scrollTo({ top: 0 });
							}
						}}
					>
						<Component {...pageProps} key={router.route} />
					</AnimatePresence>
				</Layout>
			</ChakraProvider>
		</SessionProvider>
	);
};

export default trpc.withTRPC(MyApp);
