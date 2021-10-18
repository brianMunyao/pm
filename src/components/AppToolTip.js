import { Tooltip } from '@mui/material';
import React from 'react';

const AppToolTip = ({ title, placement = 'right', children }) => {
	return (
		<Tooltip title={title} arrow disableInteractive placement={placement}>
			{children}
		</Tooltip>
	);
};

export default AppToolTip;
