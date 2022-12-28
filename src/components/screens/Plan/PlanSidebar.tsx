import {
	Center,
	Checkbox,
	Divider,
	Input,
	InputGroup,
	InputRightAddon,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Stack,
	Text,
	Tooltip,
	useColorModeValue,
} from '@chakra-ui/react';

export const PlanSidebar = () => {
	const categoryColor = useColorModeValue('gray.800', 'gray.200');

	const defaultSaving = 1600;
	const defaultMonthlySaving = 1000;

	return (
		<Stack
			as={'nav'}
			spacing={6}
			maxW={{ md: '3xs' }}
			w={'full'}
			flexShrink={0}
			display={{ base: 'none', lg: 'block' }}
		>
			<Stack>
				<Text
					align={'center'}
					textTransform={'uppercase'}
					color={categoryColor}
					fontWeight={700}
					fontSize={'sm'}
					letterSpacing={1}
				>
					Amount Saved
				</Text>
				<Tooltip
					hasArrow
					label="Amount saved in total"
					placement="auto"
				>
					<InputGroup>
						<NumberInput
							allowMouseWheel
							defaultValue={defaultSaving}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
						<InputRightAddon>DKK</InputRightAddon>
					</InputGroup>
				</Tooltip>
				<Tooltip
					hasArrow
					label="Auto-update savings based on amount and interval"
					placement="auto"
				>
					<Center>
						<Checkbox defaultChecked>Auto-update savings</Checkbox>
					</Center>
				</Tooltip>
				<Divider />
				<Text
					align={'center'}
					textTransform={'uppercase'}
					color={categoryColor}
					fontWeight={700}
					fontSize={'sm'}
					letterSpacing={1}
				>
					Amount to Save
				</Text>

				<Tooltip
					hasArrow
					label="Amount add to current savings based on savings frequency"
					placement="auto"
				>
					<InputGroup>
						<NumberInput
							allowMouseWheel
							defaultValue={defaultMonthlySaving}
							min={0}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
						<InputRightAddon>DKK</InputRightAddon>
					</InputGroup>
				</Tooltip>
				<Text
					align={'center'}
					textTransform={'uppercase'}
					color={categoryColor}
					fontWeight={500}
					fontSize={'sm'}
					letterSpacing={1}
				>
					First Saving
				</Text>
				<Tooltip hasArrow label="Date of first saving" placement="auto">
					<Input
						placeholder="Select Date and Time"
						size="md"
						type="date"
					/>
				</Tooltip>
				<Text
					align={'center'}
					textTransform={'uppercase'}
					color={categoryColor}
					fontWeight={500}
					fontSize={'sm'}
					letterSpacing={1}
				>
					Savings Frequency
				</Text>
				<Tooltip
					hasArrow
					label="Frequency of current amount saved updated based on Savings Amount"
					placement="auto"
				>
					<Select placeholder="Select option">
						<option value="som">Start of month</option>
						<option value="eom">End of month</option>
						<option value="ed">Every day</option>
						<option value="ew">Every week</option>
						<option value="e14d">Every 14th day</option>
						<option value="em">Every Month</option>
						<option value="e2m">Every 2 Months</option>
						<option value="e3m">Every 3 Months</option>
						<option value="e4m">Every 4 Months</option>
						<option value="e6m">Every 6 Months</option>
						<option value="ey">Every year</option>
					</Select>
				</Tooltip>
			</Stack>
		</Stack>
	);
};
