import React, { useState } from 'react';
import { Modal } from '@mui/material';
import styled from 'styled-components';
import * as Yup from 'yup';
import { connect } from 'react-redux';

import FormItem from './FormItem';
import { addMember } from '../store/actions';

const AddMemberModal = ({ open, handleClose, addMember, openedProject }) => {
	const [email, setEmail] = useState('');

	const validateEmail = () => {
		if (email.length > 0) {
			addMember(email, openedProject);
			handleClose();
		}
	};

	return (
		<Modal open={open} onClose={handleClose} style={{ overflowY: 'auto' }}>
			<Container className="fja">
				<div className="amm-inner">
					<h3>Add Member</h3>

					<FormItem
						id="email"
						label="User Email"
						value={email}
						inputType="email"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email Address"
						// error={titleError}
					/>

					<FormItem
						inputType="submit"
						label="Add to Project"
						onClick={validateEmail}
					/>
				</div>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	width: 100%;
	height: 100vh;
	min-height: 400px;
	pointer-events: none;
	.amm-inner {
		width: 370px;
		padding: 20px;
		border-radius: 10px;
		background: white;
		pointer-events: all;
		h3 {
			padding: 0 0 10px;
		}
	}
`;

const mapStateToProps = ({ openedProject }) => ({
	openedProject,
});

export default connect(mapStateToProps, { addMember })(AddMemberModal);
