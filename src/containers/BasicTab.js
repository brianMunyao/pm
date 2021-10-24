import React from 'react';
import styled from 'styled-components';

const BasicTab = ({ children, title }) => {
	return (
		<Container>
			{title && <div className="tab-title">{title}</div>}
			{children}
		</Container>
	);
};

const Container = styled.div`
	height: 100vh;
	overflow: auto;
	/* background: red; */
	/* padding: 0 0 10px; */
	.tab-title {
		font-size: 23px;
		font-weight: 700;
		padding: 10px 15px;
		letter-spacing: 0.4px;
		opacity: 0.7;
	}
`;

export default BasicTab;
