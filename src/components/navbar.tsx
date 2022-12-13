import type { ReactNode } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
	Box,
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
	useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { IoLogoGithub } from 'react-icons/io5';
import Logo from './logo';
import ThemeToggleButton from './theme-toggle-button';

type LinkItemProps = {
	href: string;
	path: string;
	children: ReactNode;
};

const LinkItem = ({ href, path, children }: LinkItemProps) => {
	const active = path === href;
	const inacitiveColor = useColorModeValue('gray200', 'white.900');
	return (
		<Link
			as={NextLink}
			p={2}
			bg={active ? 'navBarPrimary' : undefined}
			color={active ? '#202023' : inacitiveColor}
			borderRadius={4}
			href={href}
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

	return (
		<Box
			position="fixed"
			as="nav"
			w="100%"
			bg={useColorModeValue('#caa8ff40', '#2D333B99')}
			style={{ backdropFilter: 'blur(10px' }}
			zIndex={1}
			{...props}
		>
			<Container display="flex" p={2} maxW="container.xxl">
				<Box mr={5} mt={1}>
					<Heading as="h1" size="lg" letterSpacing={'tighter'}>
						<Logo />
					</Heading>
				</Box>
				<Stack
					direction={{ base: 'column', md: 'row' }}
					display={{ base: 'none', md: 'flex' }}
					width={{ base: 'full', md: 'auto' }}
					spacing="12px"
				>
					<LinkItem href="/about" path={path}>
						About
					</LinkItem>
					<Link
						target="_blank"
						href="https://github.com/Andreasgdp/Portfolio"
						color={useColorModeValue('gray200', 'white.900')}
						display="inline-flex"
						alignItems="center"
						style={{ gap: 4 }}
						pl={2}
					>
						<IoLogoGithub />
						Source
					</Link>
				</Stack>

				<Flex flex={1}>
					<Spacer />
					<ThemeToggleButton />
					<Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
						<Menu>
							<MenuButton
								as={IconButton}
								icon={<HamburgerIcon />}
								variant="outline"
								aria-label="Options"
							/>
							<MenuList>
								<MenuItem as={NextLink} href="/about">
									About
								</MenuItem>
								<MenuItem
									as={Link}
									href="https://github.com/Andreasgdp/Portfolio"
								>
									View Source
								</MenuItem>
							</MenuList>
						</Menu>
					</Box>
				</Flex>
			</Container>
		</Box>
	);
};

export default Navbar;
