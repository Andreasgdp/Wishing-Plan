import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Icon,
	Input,
	Link,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import type { CtxOrReq } from 'next-auth/client/_utils';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import { FaDiscord, FaGoogle } from 'react-icons/fa';
import NextLink from 'next/link';

import { Content } from '../../components/layouts/Content';

type formButtonProps = {
	provider: any;
};

const FormButton = (props: formButtonProps) => {
	const { provider } = props;

	if (provider.name === 'Email') {
		return null;
	}

	let icon: IconType;
	let color: string;

	switch (provider.name.toString().toLowerCase()) {
		case 'google':
			icon = FaGoogle;
			color = 'red.500';
			break;
		case 'discord':
			icon = FaDiscord;
			color = '#7a83f8';
			break;
		default:
			icon = FaGoogle;
			color = 'red.500';
			break;
	}

	return (
		<Button
			bg={color}
			leftIcon={<Icon as={icon} />}
			onClick={() => {
				signIn(provider.id, {
					callbackUrl: '/',
				});
			}}
		>
			Sign in with {provider.name}
		</Button>
	);
};

export default function SimpleCard({ providers }: { providers: any }) {
	const [email, setEmail] = useState('');
	const handleSubmit = (event: any) => {
		event.preventDefault();

		signIn('email', {
			email,
		});
	};

	return (
		<Flex minH={'93vh'} align={'center'} justify={'center'}>
			<Content>
				<Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
					<Stack align={'center'}>
						<Heading fontSize={'4xl'}>
							Sign in to your account
						</Heading>
						<Text fontSize={'lg'} color={'gray.600'}>
							to enjoy all of our cool{' '}
							<Link as={ NextLink } color={'blue.400'} href={'/features'}>
								features
							</Link>{' '}
							✌️
						</Text>
					</Stack>
					<Box
						rounded={'lg'}
						bg={useColorModeValue('white', 'gray.700')}
						boxShadow={'lg'}
						p={8}
					>
						<form onSubmit={handleSubmit}>
							<Stack spacing={4}>
								<FormControl id="email" isRequired>
									<FormLabel>Email address</FormLabel>

									<Input
										type="email"
										placeholder="Email (Not Setup - Please Use Google/Discord)"
										onChange={(event) =>
											setEmail(event.currentTarget.value)
										}
									/>
								</FormControl>

								<Stack spacing={10}>
									<Button
										bg={'blue.400'}
										color={'white'}
										_hover={{
											bg: 'blue.500',
										}}
										type="submit"
									>
										Sign in
									</Button>
								</Stack>

								<Text align={'center'}>OR</Text>

								<Stack spacing={5}>
									{providers &&
										Object.values(providers).map(
											(provider: any) => (
												<FormButton
													key={provider.name}
													provider={provider}
												/>
											)
										)}
								</Stack>
							</Stack>
						</form>
					</Box>
				</Stack>
			</Content>
		</Flex>
	);
}

export async function getServerSideProps(context: CtxOrReq | undefined) {
	const session = await getSession(context);

	if (session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const providers = await getProviders();
	return {
		props: {
			providers,
		},
	};
}
