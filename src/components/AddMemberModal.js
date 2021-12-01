import React, { useState } from 'react';
import { Modal } from '@mui/material';
import styled from 'styled-components';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import axios from 'axios';

import FormItem from './FormItem';
import { updateProject } from '../store/actions';
import colors from '../config/colors';

const AddMemberModal = ({
	projects,
	open,
	handleClose,
	openedProject,
	updateProject,
}) => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');

	const checkUser = async (em) => {
		setError('');
		if (email.length === 0) {
			setError('Email required');
		} else {
			const { data } = await axios.get(
				`http://localhost:3001/users/user/${em}`
			);

			if (data.data) {
				const p = projects.filter((i) => i._id === openedProject)[0];
				await updateProject(p._id, {
					members: [
						...p.members,
						{
							_id: data.data._id,
							fullname: data.data.fullname,
							user_id: data.data._id,
						},
					],
				});
				handleClose();
			} else {
				setError('User Not Found');
			}
		}
	};

	// const validateEmail = () => {
	// 	if (email.length > 0) {
	// 		addMember(email, openedProject);
	// 		handleClose();
	// 	}
	// };

	return (
		<Modal open={open} onClose={handleClose} style={{ overflowY: 'auto' }}>
			<Container className="fja">
				<div className="amm-inner">
					<h3>Add Member</h3>

					<p className="amm-error">{error}</p>

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
						onClick={() => checkUser(email)}
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

		.amm-error {
			text-align: center;
			color: ${colors.error};
		}
	}
`;

const mapStateToProps = ({ openedProject, projects }) => ({
	openedProject,
	projects,
});

export default connect(mapStateToProps, { updateProject })(AddMemberModal);
