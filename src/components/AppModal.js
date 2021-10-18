import React from 'react';
import { Modal } from '@mui/material';

const AppModal = ({ open, closeModal, children }) => {
	return (
		<Modal
			open={open}
			onClose={closeModal}
			style={{
				overflowY: 'auto',
			}}>
			{children}
		</Modal>
	);
};

export default AppModal;
