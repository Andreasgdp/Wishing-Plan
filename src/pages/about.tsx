import { Box, Container, Text } from '@chakra-ui/react';
import Head from 'next/head';

// Create about page component
const About = () => {
	return (
		<Container maxW="container.xl">
			<Head>
				<title>About</title>
			</Head>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				height="100vh"
			>
				<Text fontSize="2xl" fontWeight="bold">
					This is the about page for Wishing Plan.
				</Text>
				<Text fontSize="xl" fontWeight="medium">
					...
				</Text>
			</Box>
		</Container>
	);
};

export default About;
