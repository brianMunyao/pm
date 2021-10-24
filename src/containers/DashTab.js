import React, { useState } from 'react';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import styled from 'styled-components';

const DashTab = () => {
	const [dateAnchor, setDateAnchor] = useState(null);
	const [dPickerOpen, setDPickerOpen] = useState(false);
	return (
		<Container>
			{/* <LocalizationProvider dateAdapter={DateAdapter}>
				<DatePicker
					// open={dPickerOpen}
					label="dt-date-picker"
					// value={due_date}
					// onChange={(val) => {
					// 	setDue_date(val);
					// 	// updateTask({ ...taskInfo, due_date: val });
					// 	// setDPickerOpen(false);
					// }}

					// onClose={() => setDPickerOpen(false)}
					renderInput={(inputProps) => null}
					PopperProps={{
						anchorEl: dateAnchor,
					}}
				/>
			</LocalizationProvider> */}
		</Container>
	);
};

const Container = styled.div`
	overflow: hidden;
	display: flex;
	flex-flow: column;
	height: 100%;
`;

export default DashTab;
