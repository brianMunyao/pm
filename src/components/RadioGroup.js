import React, { useState } from 'react';
import styled from 'styled-components';

import colors from '../config/colors';
import AppToolTip from './AppToolTip';

const RadioGroup = ({ data = [], onChange }) => {
	const [active, setActive] = useState(0);
	const handleChange = (index, val) => {
		setActive(index);
		onChange(val);
	};
	return (
		<StyledRadioGroup>
			{data.map((item, index) => (
				<AppToolTip title={item.label} placement="top">
					<div
						onClick={() => handleChange(index, item.value)}
						key={index}
						className={index === active ? 'rgi-active' : null}>
						{item.icon}
					</div>
				</AppToolTip>
			))}
		</StyledRadioGroup>
	);
};

const StyledRadioGroup = styled.div`
	display: flex;
	flex-direction: row;
	background: ${colors.lightGrey};
	border-radius: 5px;
	margin-right: 20px;

	div {
		width: 30px;
		height: 30px;
		border-radius: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${colors.darkGrey};
		border: 1px solid transparent;
		transition: all 0.2s linear;
		cursor: pointer;
	}
	.rgi-active {
		background: rgb(250, 250, 250);
		color: ${colors.secondary};
		border: 1px solid ${colors.secondary};
		font-size: 17px;
	}
`;

export default RadioGroup;
