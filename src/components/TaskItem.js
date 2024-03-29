import React, { useEffect, useState } from 'react';
import { IconButton, Menu } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterMoment';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import {
	IoCalendarClearOutline,
	IoCheckmark,
	IoEllipsisHorizontal,
	IoPersonAddOutline,
	IoPricetagsOutline,
	IoTrashOutline,
} from 'react-icons/io5';
import styled from 'styled-components';
import { connect } from 'react-redux';
import moment from 'moment';

import { getRandomColor } from '../apis/funcs';
import colors from '../config/colors';
import { updateTask, deleteTask, updateProject } from '../store/actions';
import TaskTag from './TaskTag';
import AppToolTip from './AppToolTip';
import emptyImg from '../assets/empty.png';
import UserIcon from './UserIcon';

const TaskItem = ({
	projects,
	openedProject,
	data,
	updateTask,
	deleteTask,
	listStyle,
	empty,
	quickView,
	onClick,
	updateProject,
}) => {
	const [taskInfo, setTaskInfo] = useState({});
	const [editMode, setEditMode] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const settOpen = Boolean(anchorEl);

	const [aEl, setAEl] = useState(null);
	const tagOpen = Boolean(aEl);

	const [assignEl, setAssignEl] = useState(null);
	const assignOpen = Boolean(assignEl);

	const [dateAnchor, setDateAnchor] = useState(null);
	const [dPickerOpen, setDPickerOpen] = useState(false);

	const [newTag, setNewTag] = useState('');

	const handleUpdate = (label, value) => {
		const obj = { ...data };
		obj[label] = value;
		setTaskInfo(obj);
	};

	const updateInfo = async () => {
		toggleEditMode();
		await updateTask(data._id, {
			title: taskInfo.title || 'new task',
		});
	};

	const markComplete = async () => await updateTask(data._id, { status: 2 });
	const checkMark = (e) =>
		updateTask(data._id, {
			status: e.target.value === 'true' ? 1 : 2,
		});

	const assignTask = (id) => updateTask(data._id, { assigned: id });

	const toggleEditMode = () => setEditMode(!editMode);

	const handleNewTag = (t) => {
		updateTask(data._id, { tags: [...taskInfo.tags, t] });
	};

	const handleDelTag = (t) => {
		updateTask(data._id, {
			tags: taskInfo.tags.filter((tg) => tg !== t),
		});
	};

	const genNewTag = async () => {
		const tag = {
			id: Date.now().toString(),
			title: newTag,
			color: getRandomColor(),
		};
		const p = projects.filter((i) => i._id === openedProject)[0];
		await updateProject(p._id, { tags: [...p.tags, tag] });
	};

	useEffect(() => {
		setTaskInfo(data);
	}, [data]);

	if (empty)
		return (
			<Empty>
				<div className="dt-empty fja">
					<div className="fja">
						<img src={emptyImg} alt="empty" />
						<span>No tasks</span>
					</div>
				</div>
			</Empty>
		);

	return (
		<Container
			list={listStyle === 'list'}
			onClick={onClick}
			quickView={quickView}>
			{listStyle === 'list' && (
				<input
					type="checkbox"
					className="ti-check"
					checked={data.status === 2}
					value={data.status === 2}
					onChange={checkMark}
					onClick={(e) => e.stopPropagation()}
				/>
			)}

			{quickView ? (
				<div className="ti-title">
					<span className="ti-title-span">{data.title}</span>
				</div>
			) : (
				<div className="ti-title">
					{editMode ? (
						<textarea
							name="title"
							id="title"
							autoFocus
							value={taskInfo.title}
							onChange={(e) =>
								handleUpdate('title', e.target.value)
							}
							onBlur={updateInfo}
							onKeyPress={(e) =>
								e.key === 'Enter' ? updateInfo() : null
							}
							placeholder="new task"></textarea>
					) : (
						<div
							className="ti-title-hover"
							onDoubleClick={toggleEditMode}>
							<span className="ti-title-span">{data.title}</span>
						</div>
					)}

					{listStyle === 'list' &&
						data.tags.map((t, i) => (
							<TaskTag
								id={t}
								list={
									projects.filter(
										(item) => item._id === data.project_id
									)[0].tags
								}
								key={i}
								deleteTag={() => handleDelTag(t)}
							/>
						))}
				</div>
			)}

			{listStyle !== 'list' && (
				<div className="ti-tags">
					{data.tags.map((t, i) => (
						<TaskTag
							id={t}
							list={
								projects.filter(
									(item) => item._id === data.project_id
								)[0].tags
							}
							key={i}
							deleteTag={() => handleDelTag(t)}
						/>
					))}
				</div>
			)}

			<div className="ti-bottom">
				<div className="ti-dashed-con">
					{data.assigned && openedProject ? (
						<AppToolTip
							title={projects
								.filter((i) => i._id === openedProject)[0]
								.members.filter(
									(m) => m.user_id === data.assigned
								)}>
							<UserIcon
								rounded
								name={projects
									.filter((i) => i._id === openedProject)[0]
									.members.filter(
										(m) => m.user_id === data.assigned
									)}
								size={25}
							/>
						</AppToolTip>
					) : (
						<span
							aria-controls="assign-menu"
							onClick={(e) => setAssignEl(e.currentTarget)}>
							<AppToolTip title="Assign">
								<span className="ti-dashed">
									<IoPersonAddOutline />
								</span>
							</AppToolTip>
						</span>
					)}

					<Menu
						id="assign-menu"
						open={assignOpen}
						anchorEl={assignEl}
						onClose={() => setAssignEl(null)}
						sx={{
							'& .css-6hp17o-MuiList-root-MuiMenu-list': {
								padding: '8px 4px',
								'& li': {
									padding: '2px 5px',
									fontSize: 13,
									letterSpacing: '.3px',
									cursor: 'pointer',
									transition: 'all .1s linear',
									borderRadius: '5px',
									'&:hover': {
										background: '#e2e2e2',
									},
								},
							},
						}}>
						{openedProject &&
							projects
								.filter((i) => i._id === openedProject)[0]
								.members.map((v, i) => (
									<li
										key={i}
										onClick={() => assignTask(v._id)}>
										{v.fullname}
									</li>
								))}
					</Menu>

					<span
						aria-controls="tag-menu"
						onClick={(e) => setAEl(e.currentTarget)}>
						<AppToolTip title="Add tag">
							<span className="ti-dashed">
								<IoPricetagsOutline />
							</span>
						</AppToolTip>
					</span>

					<Menu
						id="tag-menu"
						open={tagOpen}
						anchorEl={aEl}
						onClose={() => setAEl(null)}
						sx={{
							'& .css-6hp17o-MuiList-root-MuiMenu-list': {
								padding: '8px 4px',
								'& li': {
									padding: '2px 5px',
									fontSize: 13,
									letterSpacing: '.3px',
									cursor: 'pointer',
									transition: 'all .1s linear',
									borderRadius: '5px',
									'&:hover': {
										background: '#e2e2e2',
									},
								},
							},
						}}>
						<input
							type="text"
							placeholder="Enter new tag"
							value={newTag}
							onChange={(e) => setNewTag(e.target.value)}
							onKeyPress={(e) =>
								e.key === 'Enter' ? genNewTag() : null
							}
						/>
						{openedProject &&
							projects
								.filter((i) => i._id === openedProject)[0]
								.tags.map((t, i) => (
									<li key={i} onClick={() => handleNewTag(t)}>
										{t.title}
									</li>
								))}
					</Menu>
				</div>

				<LocalizationProvider dateAdapter={DateAdapter}>
					<DatePicker
						open={dPickerOpen}
						label="date-picker"
						value={taskInfo.due_date}
						onChange={(val) => {
							updateTask(data._id, { due_date: val });
							setDPickerOpen(false);
						}}
						onClose={() => setDPickerOpen(false)}
						renderInput={(inputProps) => null}
						PopperProps={{
							anchorEl: dateAnchor,
						}}
					/>
				</LocalizationProvider>

				<div>
					<span
						onClick={(e) => {
							setDateAnchor(e.currentTarget);
							setDPickerOpen(true);
						}}>
						<AppToolTip
							title={data.due_date ? 'Due date' : 'Set due date'}
							placement="top">
							<span className="ti-due">
								<IoCalendarClearOutline />
								{data.due_date &&
									` ${moment(data.due_date).format(
										'MMM DD'
									)}`}
							</span>
						</AppToolTip>
					</span>

					{data.status !== 2 && listStyle !== 'list' && (
						<AppToolTip title="Mark complete" placement="top">
							<span className="ti-check" onClick={markComplete}>
								<IoCheckmark />
							</span>
						</AppToolTip>
					)}

					<span
						className="ti-settings-btn"
						aria-label="settings"
						aria-controls="settings-menu"
						aria-expanded={settOpen ? 'true' : undefined}
						aria-haspopup="true"
						onClick={(e) => setAnchorEl(e.currentTarget)}>
						<AppToolTip title="Settings">
							<IconButton id="icon-button" size="small">
								<IoEllipsisHorizontal />
							</IconButton>
						</AppToolTip>
					</span>

					<Menu
						id="settings-menu"
						open={settOpen}
						anchorEl={anchorEl}
						onClose={() => setAnchorEl(null)}
						sx={{
							'& .css-6hp17o-MuiList-root-MuiMenu-list': {
								padding: '8px 4px',
								'& li': {
									padding: '4px 5px',
									fontSize: 14,
									letterSpacing: '.3px',
									cursor: 'pointer',
									transition: 'all .1s linear',
									borderRadius: '5px',
									display: 'flex',
									alignItems: 'center',
									'& svg': {
										marginRight: '5px',
									},
								},
								'& li.ti-setting-delete': {
									color: colors.red,
									'&:hover': {
										background: colors.redLight,
									},
								},
							},
						}}>
						<li
							className="ti-setting-delete"
							onClick={() => deleteTask(data._id)}>
							<IoTrashOutline /> Delete
						</li>
					</Menu>
				</div>
			</div>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	box-shadow: 0px 1px 10px #e2e2e2;
	padding: 8px 5px;
	margin-bottom: 10px;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.1s linear;
	user-select: none;
	background: white;

	display: ${({ list }) => list && 'flex'};
	align-items: ${({ list }) => list && 'center'};

	&:hover {
		box-shadow: 0px 1px 10px #d6d6d6;
		transform: scale(1.015);
	}
	.ti-check {
		margin: 0 5px;
	}

	.ti-title {
		flex: 1;
		overflow: hidden;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		.ti-title-hover {
			padding: 3px;
			border-radius: 5px;
			transition: all 0.2s linear;
			border: 1px dashed transparent;
			cursor: text;
			&:hover {
				border: 1px dashed ${colors.primaryLight};
			}
		}
		textarea {
			padding: 3px;
			width: 100%;
			font-size: inherit;
			border: 1px dashed ${colors.primaryLight};
			border-radius: 5px;
			resize: vertical;
		}
	}

	.ti-tags {
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;
	}

	.ti-bottom {
		display: ${({ quickView }) => (quickView ? 'none' : 'flex')};
		/* display: flex; */
		justify-content: space-between;
		align-items: flex-end;
		padding: ${({ list }) => !list && '10px 5px 0'};
		margin-left: ${({ list }) => list && 'auto'};
		opacity: 0.7;
		min-width: ${({ list }) => list && '150px'};
		.ti-dashed-con {
			padding: ${({ list }) => list && '0 6px'};
		}

		.ti-dashed {
			border: 1px dashed black;
			width: 24px;
			height: 24px;
			border-radius: 15px;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 2px;
			svg {
				font-size: 13px;
			}
			&:hover {
				border: 1px dashed ${colors.primary};
				color: ${colors.primary};
			}
		}
		div {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			.ti-check {
				margin-left: 5px;
				&:hover {
					color: ${colors.primary};
				}
			}
			.ti-setting {
				padding: 2px 0 2px 5px;
				&:hover {
					color: ${colors.primary};
				}
			}
		}
		.ti-due {
			font-size: 13px;
			display: flex;
			align-items: center;
			justify-content: center;
			/* margin-right: ${({ quickView }) => quickView && '5px'}; */
			svg {
				margin-right: 5px;
			}
			&:hover {
				color: ${colors.primary};
			}
		}
		.ti-settings-btn {
			display: ${({ quickView }) => quickView && 'none'};
		}
	}
`;

const Empty = styled.div`
	.dt-empty {
		height: 100%;
		min-height: 100px;
		div {
			display: flex;
			flex-direction: column;
			font-weight: 600;
			opacity: 0.3;
			img {
				width: 50px;
			}
		}
	}
`;

const mapStateToProps = ({ openedProject, projects }) => ({
	openedProject,
	projects,
});

export default connect(mapStateToProps, {
	updateTask,
	deleteTask,
	updateProject,
})(TaskItem);
