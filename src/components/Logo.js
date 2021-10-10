import React from 'react';

import logo from '../assets/logo.png';

const Logo = ({ align, link, size = 70, className }) => {
	return (
		<div className={'logo ' + className} style={{ textAlign: align }}>
			{link ? (
				<a href="/">
					<img width={size} src={logo} alt="logo" />
				</a>
			) : (
				<img width={size} src={logo} alt="logo" />
			)}
		</div>
	);
};

export default Logo;
