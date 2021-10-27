import React from 'react';
import styled from 'styled-components';

const ProgressBar = ({ width, color = 'green', bgColor }) => {
	return (
		<Container width={width} color={color} bgColor={bgColor}>
			<div className="pg-bar"></div>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	height: 7px;
	background: ${({ bgColor }) => bgColor || 'white'};
	border-radius: 10px;
	position: relative;
	overflow: hidden;

	.pg-bar {
		position: absolute;
		width: ${({ width }) => width};
		top: 0;
		left: 0;
		height: 100%;
		background: ${({ color }) => color};
		border-radius: 10px;
	}
`;

export default ProgressBar;
