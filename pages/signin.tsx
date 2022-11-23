import {
	Box,
	Button,
	Checkbox,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import Content from '../components/layouts/content';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';

import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import  Account  from './account';
import { useEffect, useState } from 'react';
import { supabase } from '../libs/supabaseClient';
import { AuthSession } from '@supabase/supabase-js';

export default function SimpleCard() {
	  const [session, setSession] = useState<AuthSession | null>(null);

		useEffect(() => {
			async function fetchData() {
				// You can await here
				const session = (await supabase.auth.getSession()).data.session;
				setSession(session);
				// ...
			}
			fetchData();

			supabase.auth.onAuthStateChange(
				(_event: string, session: AuthSession | null) => {
					setSession(session);
				}
			);
		}, []);


	  return (
			<div className="container" style={{ padding: '50px 0 100px 0' }}>
				{!session ? (
					<Auth
						supabaseClient={supabase}
						appearance={{ theme: ThemeSupa }}
						theme="dark"
					/>
				) : (
					<Account key={session.user.id} session={session} />
				)}
			</div>
		);
	
	// return (
	// 	<Flex minH={'93vh'} align={'center'} justify={'center'}>
	// 		<Content>
	// 			<Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
	// 				<Stack align={'center'}>
	// 					<Heading fontSize={'4xl'}>
	// 						Sign in to your account
	// 					</Heading>
	// 					<Text fontSize={'lg'} color={'gray.600'}>
	// 						to enjoy all of our cool{' '}
	// 						<Link color={'blue.400'}>features</Link> ✌️
	// 					</Text>
	// 				</Stack>
	// 				<Box
	// 					rounded={'lg'}
	// 					bg={useColorModeValue('white', 'gray.700')}
	// 					boxShadow={'lg'}
	// 					p={8}
	// 				>
	// 					<Stack spacing={4}>
	// 						<FormControl id="email">
	// 							<FormLabel>Email address</FormLabel>
	// 							<Input type="email" />
	// 						</FormControl>
	// 						<FormControl id="password">
	// 							<FormLabel>Password</FormLabel>
	// 							<Input type="password" />
	// 						</FormControl>
	// 						<Stack spacing={10}>
	// 							<Stack
	// 								direction={{ base: 'column', sm: 'row' }}
	// 								align={'start'}
	// 								justify={'space-between'}
	// 							>
	// 								<Checkbox>Remember me</Checkbox>
	// 								<Link
	// 									color={'blue.400'}
	// 									href="/forgot-password"
	// 								>
	// 									Forgot password?
	// 								</Link>
	// 							</Stack>
	// 							<Button
	// 								bg={'blue.400'}
	// 								color={'white'}
	// 								_hover={{
	// 									bg: 'blue.500',
	// 								}}
	// 							>
	// 								Sign in
	// 							</Button>
	// 						</Stack>
	// 					</Stack>
	// 				</Box>
	// 			</Stack>
	// 		</Content>
	// 	</Flex>
	// );
}
