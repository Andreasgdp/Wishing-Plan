import { Text, useColorModeValue } from '@chakra-ui/react';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';

const LogoBox = styled.span`
	font-weight: bold;
	font-size: 18px;
	display: inline-flex;
	align-items: center;
	height: 30px;
	line-height: 20px;
	padding: 10px;
	img {
		transition-duration: 250ms;
	}
	&:hover img {
		transform: rotate(15deg);
	}
`;

const Logo = () => {
	const logoImg = `/logo${useColorModeValue('-light', '-dark')}.svg`;
	return (
		<Link href="/" style={{ display: 'flex' }}>
			<LogoBox>
				<Image src={logoImg} width={25} height={25} alt="logo" />
				<Text
					color={useColorModeValue('gray.700', 'white.900')}
					ml={3}
					letterSpacing={'tight'}
				>
					Wishing Plan
				</Text>
			</LogoBox>
		</Link>
	);
};

export default Logo;
