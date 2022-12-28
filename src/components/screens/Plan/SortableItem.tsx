import { DragHandleIcon } from '@chakra-ui/icons';
import {
	Badge,
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
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type SortableItemProps = {
	id: string;
};

export function SortableItem(props: SortableItemProps) {
	// props.id
	// JavaScript

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.id });

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
					<NumberInput defaultValue={1} w={85} p={0} m={0}>
						<NumberInputField />
						<NumberInputStepper>
							<NumberIncrementStepper />
							<NumberDecrementStepper />
						</NumberInputStepper>
					</NumberInput>
				</Center>
				<Center ml={2}>
					<Image
						boxSize="100px"
						borderRadius={'lg'}
						objectFit="cover"
						src="https://bit.ly/dan-abramov"
						alt="Dan Abramov"
					/>
				</Center>
				<CardBody>
					<Flex>
						<Flex
							flex="1"
							gap="2"
							alignItems="center"
							flexWrap="wrap"
						>
							<Heading>
								{props.id}{' '}
								<Badge colorScheme="purple">3 days left</Badge>
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
								width={'80%'}
								overflowX={'hidden'}
								textOverflow={'ellipsis'}
								whiteSpace={'nowrap'}
								mb={-10}
							>
								Some wish description that is very long andfghhjsdgfjhasgdfgadsfghhajfgjagf
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
								width={'100%'}
							>
								2400 DKK
							</Text>
						</Flex>
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
