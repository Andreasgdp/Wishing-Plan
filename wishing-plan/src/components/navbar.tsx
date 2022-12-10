// import {
// 	ChevronDownIcon,
// 	ChevronRightIcon,
// 	CloseIcon,
// 	HamburgerIcon,
// } from '@chakra-ui/icons';
// import {
// 	Box,
// 	Button,
// 	Collapse,
// 	Flex,
// 	Icon,
// 	IconButton,
// 	Link,
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// 	Stack,
// 	Text,
// 	useBreakpointValue,
// 	useColorModeValue,
// 	useDisclosure,
// } from '@chakra-ui/react';

// export default function WithSubnavigation() {
// 	const { isOpen, onToggle } = useDisclosure();

// 	return (
// 		<Box
// 			position="fixed"
// 			as="nav"
// 			w="100%"
// 			zIndex={1}
// 			style={{ backdropFilter: 'blur(10px' }}
// 		>
// 			<Flex
// 				bg={useColorModeValue('white', 'gray.800')}
// 				color={useColorModeValue('gray.600', 'white')}
// 				minH={'60px'}
// 				py={{ base: 2 }}
// 				px={{ base: 4 }}
// 				borderBottom={1}
// 				borderStyle={'solid'}
// 				borderColor={useColorModeValue('gray.200', 'gray.900')}
// 				align={'center'}
// 			>
// 				<Flex
// 					flex={{ base: 1, md: 'auto' }}
// 					ml={{ base: -2 }}
// 					display={{ base: 'flex', md: 'none' }}
// 				>
// 					<IconButton
// 						onClick={onToggle}
// 						icon={
// 							isOpen ? (
// 								<CloseIcon w={3} h={3} />
// 							) : (
// 								<HamburgerIcon w={5} h={5} />
// 							)
// 						}
// 						variant={'ghost'}
// 						aria-label={'Toggle Navigation'}
// 					/>
// 				</Flex>
// 				<Flex
// 					flex={{ base: 1 }}
// 					justify={{ base: 'center', md: 'start' }}
// 				>
// 					<Link href="/">
// 						<Text
// 							textAlign={useBreakpointValue({
// 								base: 'center',
// 								md: 'left',
// 							})}
// 							fontFamily={'heading'}
// 							color={useColorModeValue('gray.800', 'white')}
// 						>
// 							Logo
// 						</Text>
// 					</Link>

// 					<Flex display={{ base: 'none', md: 'flex' }} ml={10}>
// 						<DesktopNav />
// 					</Flex>
// 				</Flex>

// 				<Stack
// 					flex={{ base: 1, md: 0 }}
// 					justify={'flex-end'}
// 					direction={'row'}
// 					spacing={6}
// 				>
// 					<Button
// 						as={'a'}
// 						fontSize={'sm'}
// 						fontWeight={400}
// 						variant={'link'}
// 						href={'/auth/signin'}
// 					>
// 						Sign In
// 					</Button>
// 					<Link href="/auth/signup">
// 						<Button
// 							display={{ base: 'none', md: 'inline-flex' }}
// 							fontSize={'sm'}
// 							fontWeight={600}
// 							color={'white'}
// 							bg={'pink.400'}
// 							_hover={{
// 								bg: 'pink.300',
// 							}}
// 						>
// 							Sign Up
// 						</Button>
// 					</Link>
// 				</Stack>
// 			</Flex>

// 			<Collapse in={isOpen} animateOpacity>
// 				<MobileNav />
// 			</Collapse>
// 		</Box>
// 	);
// }

// const DesktopNav = () => {
// 	const linkColor = useColorModeValue('gray.600', 'gray.200');
// 	const linkHoverColor = useColorModeValue('gray.800', 'white');
// 	const popoverContentBgColor = useColorModeValue('white', 'gray.800');

// 	return (
// 		<Stack direction={'row'} spacing={4}>
// 			{NAV_ITEMS.map((navItem) => (
// 				<Box key={navItem.label}>
// 					<Popover trigger={'hover'} placement={'bottom-start'}>
// 						<PopoverTrigger>
// 							<Link
// 								p={2}
// 								href={navItem.href ?? '#'}
// 								fontSize={'sm'}
// 								fontWeight={500}
// 								color={linkColor}
// 								_hover={{
// 									textDecoration: 'none',
// 									color: linkHoverColor,
// 								}}
// 							>
// 								{navItem.label}
// 							</Link>
// 						</PopoverTrigger>

// 						{navItem.children && (
// 							<PopoverContent
// 								border={0}
// 								boxShadow={'xl'}
// 								bg={popoverContentBgColor}
// 								p={4}
// 								rounded={'xl'}
// 								minW={'sm'}
// 							>
// 								<Stack>
// 									{navItem.children.map((child) => (
// 										<DesktopSubNav
// 											key={child.label}
// 											{...child}
// 										/>
// 									))}
// 								</Stack>
// 							</PopoverContent>
// 						)}
// 					</Popover>
// 				</Box>
// 			))}
// 		</Stack>
// 	);
// };

// const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
// 	return (
// 		<Link
// 			href={href}
// 			role={'group'}
// 			display={'block'}
// 			p={2}
// 			rounded={'md'}
// 			_hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
// 		>
// 			<Stack direction={'row'} align={'center'}>
// 				<Box>
// 					<Text
// 						transition={'all .3s ease'}
// 						_groupHover={{ color: 'pink.400' }}
// 						fontWeight={500}
// 					>
// 						{label}
// 					</Text>
// 					<Text fontSize={'sm'}>{subLabel}</Text>
// 				</Box>
// 				<Flex
// 					transition={'all .3s ease'}
// 					transform={'translateX(-10px)'}
// 					opacity={0}
// 					_groupHover={{
// 						opacity: '100%',
// 						transform: 'translateX(0)',
// 					}}
// 					justify={'flex-end'}
// 					align={'center'}
// 					flex={1}
// 				>
// 					<Icon
// 						color={'pink.400'}
// 						w={5}
// 						h={5}
// 						as={ChevronRightIcon}
// 					/>
// 				</Flex>
// 			</Stack>
// 		</Link>
// 	);
// };

// const MobileNav = () => {
// 	return (
// 		<Stack
// 			bg={useColorModeValue('white', 'gray.800')}
// 			p={4}
// 			display={{ md: 'none' }}
// 		>
// 			{NAV_ITEMS.map((navItem) => (
// 				<MobileNavItem key={navItem.label} {...navItem} />
// 			))}
// 		</Stack>
// 	);
// };

// const MobileNavItem = ({ label, children, href }: NavItem) => {
// 	const { isOpen, onToggle } = useDisclosure();

// 	return (
// 		<Stack spacing={4} onClick={children && onToggle}>
// 			<Flex
// 				py={2}
// 				as={Link}
// 				href={href ?? '#'}
// 				justify={'space-between'}
// 				align={'center'}
// 				_hover={{
// 					textDecoration: 'none',
// 				}}
// 			>
// 				<Text
// 					fontWeight={600}
// 					color={useColorModeValue('gray.600', 'gray.200')}
// 				>
// 					{label}
// 				</Text>
// 				{children && (
// 					<Icon
// 						as={ChevronDownIcon}
// 						transition={'all .25s ease-in-out'}
// 						transform={isOpen ? 'rotate(180deg)' : ''}
// 						w={6}
// 						h={6}
// 					/>
// 				)}
// 			</Flex>

// 			<Collapse
// 				in={isOpen}
// 				animateOpacity
// 				style={{ marginTop: '0!important' }}
// 			>
// 				<Stack
// 					mt={2}
// 					pl={4}
// 					borderLeft={1}
// 					borderStyle={'solid'}
// 					borderColor={useColorModeValue('gray.200', 'gray.700')}
// 					align={'start'}
// 				>
// 					{children &&
// 						children.map((child) => (
// 							<Link key={child.label} py={2} href={child.href}>
// 								{child.label}
// 							</Link>
// 						))}
// 				</Stack>
// 			</Collapse>
// 		</Stack>
// 	);
// };

// interface NavItem {
// 	label: string;
// 	subLabel?: string;
// 	children?: Array<NavItem>;
// 	href?: string;
// }

// const NAV_ITEMS: Array<NavItem> = [
// 	{
// 		label: 'Inspiration',
// 		children: [
// 			{
// 				label: 'Explore Design Work',
// 				subLabel: 'Trending Design to inspire you',
// 				href: '#',
// 			},
// 			{
// 				label: 'New & Noteworthy',
// 				subLabel: 'Up-and-coming Designers',
// 				href: '#',
// 			},
// 		],
// 	},
// 	{
// 		label: 'Find Work',
// 		children: [
// 			{
// 				label: 'Job Board',
// 				subLabel: 'Find your dream design job',
// 				href: '#',
// 			},
// 			{
// 				label: 'Freelance Projects',
// 				subLabel: 'An exclusive list for contract work',
// 				href: '#',
// 			},
// 		],
// 	},
// 	{
// 		label: 'Learn Design',
// 		href: '#',
// 	},
// 	{
// 		label: 'Hire Designers',
// 		href: '#',
// 	},
// ];

import { ReactNode } from 'react';

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
				<Box mr={5}>
					<Heading as="h1" size="lg" letterSpacing={'tighter'}>
						<Logo />
					</Heading>
				</Box>
				<Stack
					direction={{ base: 'column', md: 'row' }}
					display={{ base: 'none', md: 'flex' }}
					width={{ base: 'full', md: 'auto' }}
					alignItems="center"
					flexGrow={1}
					mt={{ base: 4, md: 0 }}
					spacing="12px"
				>
					<LinkItem href="/works" path={path}>
						Works
					</LinkItem>
					<LinkItem href="/resume" path={path}>
						Resume
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
								<MenuItem as={Link} href="/works">
									Works
								</MenuItem>
								<MenuItem as={Link} href="/resume">
									Resume
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
