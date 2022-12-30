import {
	Button,
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
	useToast,
} from '@chakra-ui/react';
import type { Plan } from '@prisma/client';
import { useEffect, useState } from 'react';

type PlanSidebarProps = {
	plan?: Plan;
};

export const PlanSidebar = (props: PlanSidebarProps) => {
	const toast = useToast();

	const categoryColor = useColorModeValue('gray.800', 'gray.200');

	function formatToDateString(date?: Date) {
		if (!date) return '';
		// format to yyyy-mm-dd
		return date.toISOString().split('T')[0];
	}

	const [savedAmount, setSavedAmount] = useState(0);
	const handleSavedAmountChange = (value: string) =>
		setSavedAmount(Number(value));

	const [amountToSave, setAmountToSave] = useState(0);
	const handleAmountToSaveChange = (value: string) =>
		setAmountToSave(Number(value));

	useEffect(() => {
		setSavedAmount(props.plan?.currentAmountSaved ?? 0);
	}, [props.plan?.currentAmountSaved]);

	useEffect(() => {
		setAmountToSave(props.plan?.amountToSave ?? 0);
	}, [props.plan?.amountToSave]);

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
				<Button
					colorScheme={'purple'}
					onClick={() =>
						toast({
							title: 'Plan settings updated successfully',
							description: "Plan's settings have been updated",
							status: 'success',
							duration: 2000,
							isClosable: true,
							position: 'top',
						})
					}
				>
					Update
				</Button>
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
							defaultValue={props.plan?.currentAmountSaved}
							value={savedAmount}
							onChange={handleSavedAmountChange}
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
					label="Auto-update savings based on amount to save and interval"
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
							defaultValue={props.plan?.amountToSave}
							min={0}
							value={amountToSave}
							onChange={handleAmountToSaveChange}
							onBlur={() => {
								// TODO: how do we update the plan?
								if (props.plan?.amountToSave) {
									props.plan.amountToSave = amountToSave;
								}
								console.log(amountToSave);

								console.log(props.plan);
							}}
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
						defaultValue={formatToDateString(
							props.plan?.firstSaving
						)}
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
					<Select
						placeholder={props.plan?.frequency ?? 'Select option'}
						defaultValue={props.plan?.frequency}
					>
						<option value="som">Start of month</option>
						<option value="eom">End of month</option>
						<option value="ed">Every day</option>
						<option value="ew">Every week</option>
						<option value="e14d">Every 14th day</option>
					</Select>
				</Tooltip>
			</Stack>
		</Stack>
	);
};
