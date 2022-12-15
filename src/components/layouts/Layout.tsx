import { ReactNode } from 'react';

import { Box } from '@chakra-ui/react';
import Head from 'next/head';

import { useRouter } from 'next/router';
import Navbar from '../common/Header/Navbar';
import Footer from '../common/Footer/Footer';

type LayoutProps = {
	children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
	const router = useRouter();
	return (
		<Box as="main">
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<title>Wishing Plan</title>
			</Head>

			<Navbar path={router.asPath} />

			<div style={{ paddingTop: '3.5rem' }}>{children}</div>

			<Footer />
		</Box>
	);
};

export default Layout;
