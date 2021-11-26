import React from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';

import defaultAnim from '../assets/circle_loader.json';

const Loader = ({ animation, height = 150, speed = 1, style }) => {
	return (
		<Container style={style}>
			<Lottie
				isClickToPauseDisabled={true}
				options={{
					loop: true,
					autoplay: true,
					animationData: animation ? animation : defaultAnim,
				}}
				height={height}
				speed={speed}
			/>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export default Loader;
