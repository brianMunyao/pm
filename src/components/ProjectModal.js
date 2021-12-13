import React, { useEffect, useState } from 'react';
import { Modal } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import styled from 'styled-components';
import moment from 'moment';
import { connect } from 'react-redux';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { useCookies } from 'react-cookie';
import { useHistory } from 'react-router';

import { closePModal, addProject, updateProject } from '../store/actions';
import FormItem from './FormItem';
import {
	getColor,
	getLightColor,
	ourColors,
	projectTypes,
} from '../apis/funcs';
import AppToolTip from '../components/AppToolTip';

const ProjectModal = ({
	pEdit,
	pModal,
	addProject,
	updateProject,
	closePModal,
}) => {
	const [cookies] = useCookies(['user']);

	const [title, setTitle] = useState('');
	const [type, setType] = useState('');
	const [color, setColor] = useState(ourColors[0]);
	const [due_date, setDue_date] = useState(moment().add(1, 'month'));

	const [titleError, setTitleError] = useState('');
	const [typeError, setTypeError] = useState('');

	const [dateAnchor, setDateAnchor] = useState(null);
	const [dPickerOpen, setDPickerOpen] = useState(false);

	const history = useHistory();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (title === '' || type === '') {
			setTitleError(title === '' ? 'Field cannot be empty' : '');
			setTypeError(type === '' ? 'Field cannot be empty' : '');
		} else {
			if (pEdit) {
				await updateProject(pEdit._id, {
					title,
					type,
					color,
					due_date,
				});
			} else {
				await addProject(
					{
						title,
						type,
						due_date,
						color,
						created_by: cookies.user._id,
						tags: [
							{ id: '1', title: 'Frontend', color: 'green' },
							{ id: '2', title: 'Backend', color: 'red' },
						],
						members: [
							{
								fullname: cookies.user.fullname,
								user_id: cookies.user._id,
							},
						],
					},
					goToProject
				);
			}
			closePModal();
		}
	};

	const goToProject = (id) => history.push('/m/projects', id);

	useEffect(() => {
		setTitle(pEdit ? pEdit.title : '');
		setType(pEdit ? pEdit.type : '');
		setDue_date(pEdit ? pEdit.due_date : moment().add(1, 'month'));
		setColor(pEdit ? pEdit.color : ourColors[0]);
	}, [pEdit]);

	return (
		<Modal
			open={pModal}
			onClose={closePModal}
			style={{
				overflowY: 'auto',
			}}>
			<Container className="fja">
				<form onSubmit={handleSubmit}>
					<div className="pm-inner">
						<h3>New Project</h3>

						<FormItem
							id="title"
							label="Project Title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="title"
							error={titleError}
						/>

						<FormItem
							id="type"
							label="Project Type"
							value={type}
							onChange={(e) => setType(e.target.value)}
							list={projectTypes}
							error={typeError}
						/>

						<LocalizationProvider dateAdapter={DateAdapter}>
							<DatePicker
								open={dPickerOpen}
								label="date-picker"
								value={due_date}
								onChange={(val) => {
									setDue_date(val);
									// updateTask({ ...taskInfo, due_date: val });
									// setDPickerOpen(false);
								}}
								onClose={() => setDPickerOpen(false)}
								renderInput={(inputProps) => null}
								PopperProps={{
									anchorEl: dateAnchor,
								}}
							/>
						</LocalizationProvider>

						<div
							className="pm-due"
							onClick={(e) => {
								setDateAnchor(e.currentTarget);
								setDPickerOpen(true);
							}}>
							<AppToolTip title="Due date" placement="top">
								<span>
									<IoCalendarClearOutline />
									{due_date &&
										` ${moment(due_date).format('MMM DD')}`}
								</span>
							</AppToolTip>
						</div>

						<div className="pm-colors">
							{ourColors.map((c, i) => (
								<ColorIcon
									key={i}
									c={c}
									active={color === c}
									onClick={() => setColor(c)}>
									<div />
								</ColorIcon>
							))}
						</div>

						<FormItem
							inputType="submit"
							label={pEdit ? 'Update Project' : 'Create Project'}
						/>
					</div>
				</form>
			</Container>
		</Modal>
	);
};

const Container = styled.div`
	width: 100%;
	height: 100vh;
	min-height: 400px;
	pointer-events: none;

	.pm-inner {
		width: 370px;
		padding: 20px;
		border-radius: 10px;
		background: white;
		pointer-events: all;
		h3 {
			padding: 0 0 10px;
		}
		.pm-due {
			padding: 5px;
			width: fit-content;
			margin: 0 0 10px;
		}
		.pm-colors {
			display: flex;
			width: 100%;
			margin: 0 0 10px;
		}
	}
`;

const ColorIcon = styled.div`
	border: 1.5px dashed
		${({ c, active }) => (active ? getColor(c) : 'transparent')};
	width: 30px;
	height: 30px;
	border-radius: 20px;
	margin: 0 3px;
	padding: 0.8px;
	cursor: pointer;
	&:hover {
		border: 1.5px dashed
			${({ c, active }) => (!active ? getLightColor(c) : getColor(c))};
	}
	div {
		background: ${({ c }) => getColor(c)};
		width: 100%;
		height: 100%;
		border-radius: 20px;
	}
`;

const mapStateToProps = ({ pModal, pEdit }) => ({ pModal, pEdit });

export default connect(mapStateToProps, {
	closePModal,
	addProject,
	updateProject,
})(ProjectModal);
