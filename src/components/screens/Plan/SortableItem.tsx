import { DragHandleIcon } from '@chakra-ui/icons';
import {
	Box,
	Card,
	CardBody,
	Center,
	Flex,
	Heading,
	IconButton,
	Image,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Progress,
	Tag,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PlanWishType } from '@server/trpc/router/Plan/plan';

type SortableItemProps = {
	wish: PlanWishType;
	currency: string;
};

export function SortableItem(props: SortableItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.wish.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div style={style}>
			<Card
				direction={'row'}
				background={useColorModeValue('gray.100', 'gray.700')}
			>
				<Center ml={2}>
					<NumberInput defaultValue={props.wish.placement} w={85} p={0} m={0}>
						<NumberInputField />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</Center>

				<CardBody pr={2} maxW={'85%'}>
					<Flex maxW={'85%'}>
						<Image
							boxSize="100px"
							borderRadius={'lg'}
							objectFit="cover"
							src={
								props.wish.imageUrl ??
								'/images/placeholderWish.png'
							}
							alt="Wish image"
							mr={2}
							mt={-0.1}
						/>
						<Box flex="1" gap="2" alignItems="center" maxW={'85%'}>
							<Tag colorScheme="purple" size={'lg'}>
								3 days left
							</Tag>
							<Heading
								maxW={'70%'}
								overflowX={'hidden'}
								textOverflow={'ellipsis'}
								whiteSpace={'nowrap'}
							>
								{props.wish.title}{' '}
							</Heading>
							<Text
								align={'left'}
								color={useColorModeValue(
									'gray.800',
									'gray.200'
								)}
								fontWeight={500}
								fontSize={'lg'}
								letterSpacing={1}
								maxW={'70%'}
								overflowX={'hidden'}
								textOverflow={'ellipsis'}
								whiteSpace={'nowrap'}
								mb={-7}
							>
								{props.wish.description !== ''
									? props.wish.description
									: 'Empty Description'}
							</Text>
							<Text
								align={'right'}
								textTransform={'uppercase'}
								color={useColorModeValue(
									'gray.800',
									'gray.200'
								)}
								fontWeight={700}
								fontSize={'lg'}
								letterSpacing={1}
								width={'120%'}
							>
								{props.wish.price} {props.currency}
							</Text>
						</Box>
					</Flex>
					<Progress mt={2} colorScheme={'purple'} value={80} />
				</CardBody>
				<Center mr={2}>
					<IconButton
						ref={setNodeRef}
						{...listeners}
						{...attributes}
						aria-label="Search database"
						icon={<DragHandleIcon />}
					/>
				</Center>
			</Card>
		</div>
	);
}
