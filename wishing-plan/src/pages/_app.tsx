import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import { ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import Fonts from '../components/fonts';
import Layout from '../components/layouts/layout';
import theme from '../libs/theme';
import '../styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
	router,
}) => {
	return (
		<SessionProvider session={session}>
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
