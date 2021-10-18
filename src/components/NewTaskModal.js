import React from 'react';
import { Modal } from '@mui/material';
import styled from 'styled-components';

const NewTaskModal = ({ open, closeModal }) => {
	return (
		<Modal
			open={open}
			onClose={closeModal}
			style={{
				overflowY: 'auto',
			}}>
			<Container className="fja"></Container>
		</Modal>
	);
};

const Container = styled.div``;

export default NewTaskModal;
