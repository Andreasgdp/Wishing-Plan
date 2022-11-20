import { ReactNode } from 'react';

import { Box, Container } from '@chakra-ui/react';
import Head from 'next/head';

import Footer from '../footer';
import Navbar from '../navbar';

type LayoutProps = {
	children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
	return (
		<Box as="main" pb={8}>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<title>Wishing Plan</title>
			</Head>

			<Navbar />

			<Container maxW="container.xxl" pt={16}>
				{children}
			</Container>

			<Footer />
		</Box>
	);
};

export default Layout;
