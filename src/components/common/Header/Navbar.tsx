import type { ReactNode } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
	Avatar,
	Box,
	Button,
	Center,
	Container,
	Flex,
	Heading,
	IconButton,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spacer,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { IoLogoGithub } from 'react-icons/io5';
import ThemeToggleButton from '../Theme/ThemeToggleButton';
import Logo from './Logo';

type LinkItemProps = {
	href: string;
	path: string;
	children: ReactNode;
};

const LinkItem = ({ href, path, children }: LinkItemProps) => {
	const active = path === href;
	const inacitiveColor = useColorModeValue('gray200', 'white.900');
	const activeColor = useColorModeValue(
		'navBarPrimaryLight',
		'navBarPrimaryDark'
	);
	return (
		<Link
			as={NextLink}
			p={2}
			bg={active ? activeColor : undefined}
			color={active ? '#202023' : inacitiveColor}
			borderRadius={4}
			href={href}
			style={{ marginTop: '-2px' }}
		>
			{children}
		</Link>
	);
};

type NavbarProps = {
	path: string;
};

const Navbar = (props: NavbarProps) => {
	const { path } = props;
	const { data: sessionData } = useSession();

	return (
		<Box
			position="fixed"
			as="nav"
			w="100%"
			bg={useColorModeValue('#dfe7f099', '#2d374899')}
			style={{ backdropFilter: 'blur(10px)' }}
			zIndex={1}
			{...props}
		>
			<Container display="flex" p={2} maxW="container.xxl">
				<Box mr={5} mt={1}>
					<Heading as="h1" size="lg" letterSpacing={'tighter'}>
						<Logo />
					</Heading>
				</Box>
				<FullMenu path={path} />

				<Flex flex={1}>
					<Spacer />
					<ThemeToggleButton />
					{(sessionData && (
						<Center ml={2} display={{ base: 'none', md: 'flex' }}>
							<Link as={NextLink} href="/settings/profile">
								<Avatar
									height={'2.5rem'}
									width={'2.5rem'}
									name={sessionData?.user?.name ?? 'User'}
									src={sessionData?.user?.image ?? ''}
								/>
							</Link>
						</Center>
					)) || (
						<Link as={NextLink} href={'/auth/signin'}>
							<Button ml={2} colorScheme="green">
								Sign In
							</Button>{' '}
						</Link>
					)}

					<CollapsedMenu />
				</Flex>
			</Container>
		</Box>
	);
};

export default Navbar;
function FullMenu({ path }: { path: string }) {
	const { data: sessionData } = useSession();
	return (
		<Stack
			direction={{ base: 'column', md: 'row' }}
			display={{ base: 'none', md: 'flex' }}
			width={{ base: 'full', md: 'auto' }}
			spacing="12px"
		>
			{!sessionData && (
				<>
					<LinkItem href="/about" path={path}>
						About
					</LinkItem>
					<LinkItem href="/features" path={path}>
						Features
					</LinkItem>
				</>
			)}
			<Link
				target="_blank"
				href="https://github.com/Andreasgdp/Wishing-Plan"
				color={useColorModeValue('gray200', 'white.900')}
				display="inline-flex"
				alignItems="center"
				style={{ gap: 4, marginTop: '-2px' }}
				pl={2}
			>
				<IoLogoGithub />
				<Text style={{ marginTop: '-2px' }}>Source</Text>
			</Link>
		</Stack>
	);
}

function CollapsedMenu() {
	const { data: sessionData } = useSession();

	return (
		<Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
			<Menu>
				<MenuButton
					as={IconButton}
					icon={<HamburgerIcon />}
					variant="outline"
					aria-label="Options"
				/>
				<MenuList>
					{(sessionData && (
						<MenuItem as={NextLink} href="/settings/profile">
							Profile
						</MenuItem>
					)) || (
						<>
							<MenuItem as={NextLink} href="/about">
								About
							</MenuItem>
							<MenuItem as={NextLink} href="/features">
								Features
							</MenuItem>
						</>
					)}
					<MenuItem
						as={Link}
						href="https://github.com/Andreasgdp/Portfolio"
					>
						View Source
					</MenuItem>
				</MenuList>
			</Menu>
		</Box>
	);
}
