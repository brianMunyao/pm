import React from 'react';
import { IoClose } from 'react-icons/io5';
import styled from 'styled-components';

import { tags } from '../apis/constants';
import { getColor, getLightColor } from '../apis/funcs';

const TaskTag = ({ title, deleteTag }) => {
	return (
		<Container color={tags[title]} className="fja">
			{title}
			<span className="fja" onClick={deleteTag}>
				<IoClose />
			</span>
		</Container>
	);
};

const Container = styled.span`
	background: ${({ color }) => getLightColor(color)};
	color: ${({ color }) => getColor(color)};
	font-size: 11px;
	font-weight: 600;
	padding: 0 8px;
	border-radius: 4px;
	margin: 3px 4px;
	position: relative;
	height: 18px;

	&:hover {
		span {
			display: flex;
		}
	}

	span {
		display: none;
		position: absolute;
		right: -5px;
		top: 50%;
		transform: translate(0, -50%);
		border-radius: 10px;
		width: 15px;
		height: 15px;
		background: ${({ color }) => getColor(color)};
		color: ${({ color }) => getLightColor(color)};
	}
`;

export default TaskTag;
