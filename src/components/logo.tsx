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
	&:hover img {
		transform: rotate(20deg);
	}
`;

const Logo = () => {
	const foorPrintImg = `/logo${useColorModeValue('-light', '-dark')}.svg`;
	return (
		<Link href="/">
			<LogoBox>
				<Image src={foorPrintImg} width={22} height={22} alt="logo" />
				<Text color={useColorModeValue('gray.800', 'white.900')} ml={3}>
					Wishing Plan
				</Text>
			</LogoBox>
		</Link>
	);
};

export default Logo;
