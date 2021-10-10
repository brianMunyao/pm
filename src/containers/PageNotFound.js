import React from 'react';
import { useLocation } from 'react-router-dom';

const PageNotFound = () => {
	return (
		<div>
			Not Found
			<p>{useLocation().pathname}</p>
		</div>
	);
};

export default PageNotFound;
