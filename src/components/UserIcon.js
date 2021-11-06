import React, { useState } from 'react';
import Identicon from 'react-identicons';
import complementaryColors from 'complementary-colors';
import styled from 'styled-components';

const UserIcon = ({ name = '', size = 50, rounded }) => {
	const [color, setColor] = useState('#fff');

	const arrToRGB = (arr) => `rgb(${arr[1].r},${arr[1].g},${arr[1].b})`;

	return (
		<Container rounded={rounded} size={size}>
			<Identicon
				string={name}
				size={size}
				bg={arrToRGB(new complementaryColors(color).square())}
				getColor={(c) => setColor(`#${c}`)}
			/>
		</Container>
	);
};

const Container = styled.div`
	overflow: hidden;
	border-radius: ${({ rounded, size }) => (rounded ? `${size}px` : '3px')};
	height: ${({ size }) => `${size}px`};
	width: ${({ size }) => `${size}px`};
`;

export default UserIcon;
