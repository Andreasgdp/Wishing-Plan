import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { AnimatePresence } from 'framer-motion';
import type { AppProps } from 'next/app';
import Fonts from '../components/fonts';
import Layout from '../components/layouts/layout';
import theme from '../libs/theme';
import '../styles/globals.css';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState } from 'react';

export default function App({ Component, pageProps, router }: AppProps) {
	const [supabase] = useState(() => createBrowserSupabaseClient());
	return (
		<SessionContextProvider
			supabaseClient={supabase}
			initialSession={pageProps.initialSession}
		>
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
		</SessionContextProvider>
	);
}
