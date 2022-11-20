import { ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import type { AppProps } from 'next/app';
import Fonts from '../components/fonts';
import Layout from '../components/layouts/layout';
import theme from '../libs/theme';
import '../styles/globals.css';

export default function App({ Component, pageProps, router }: AppProps) {
	return (
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
	);
}
