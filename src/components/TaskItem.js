import React, { useEffect, useState } from 'react';
import { Avatar, IconButton, Menu } from '@mui/material';
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

import { tags } from '../apis/constants';
import colors from '../config/colors';
import { updateTask, deleteTask } from '../store/actions';
import TaskTag from './TaskTag';
import AppToolTip from './AppToolTip';

const TaskItem = ({ data, updateTask, deleteTask }) => {
	const [taskInfo, setTaskInfo] = useState({});
	const [editMode, setEditMode] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const settOpen = Boolean(anchorEl);

	const [aEl, setAEl] = useState(null);
	const tagOpen = Boolean(aEl);

	const [dateAnchor, setDateAnchor] = useState(null);
	const [dPickerOpen, setDPickerOpen] = useState(false);

	const handleUpdate = (label, value) => {
		const obj = { ...data };
		obj[label] = value;
		setTaskInfo(obj);
	};

	const updateInfo = (obj) => {
		toggleEditMode();
		updateTask(obj || { ...taskInfo, title: taskInfo.title || 'new task' });
	};

	const markComplete = () => updateTask({ ...taskInfo, status: 2 });

	const assignTask = () => updateTask({ ...taskInfo, assigned: 'Random' });

	const toggleEditMode = () => setEditMode(!editMode);

	const handleNewTag = (t) => {
		updateTask({ ...taskInfo, tags: [...taskInfo.tags, t] });
	};

	const handleDelTag = (t) => {
		updateTask({
			...taskInfo,
			tags: taskInfo.tags.filter((tg) => tg !== t),
		});
	};

	useEffect(() => {
		setTaskInfo(data);
	}, [data]);

	return (
		<Container>
			<div className="ti-title">
				{editMode ? (
					<textarea
						name="title"
						id="title"
						autoFocus
						value={taskInfo.title}
						onChange={(e) => handleUpdate('title', e.target.value)}
						onBlur={updateInfo}
						onKeyPress={(e) =>
							e.key === 'Enter' ? updateInfo() : null
						}
						placeholder="new task"></textarea>
				) : (
					<p onDoubleClick={toggleEditMode}>{data.title}</p>
				)}
			</div>

			<div className="ti-tags">
				{data.tags.map((t, i) => (
					<TaskTag
						title={t}
						key={i}
						deleteTag={() => handleDelTag(t)}
					/>
				))}
			</div>

			<div className="ti-bottom">
				<div>
					{data.assigned ? (
						<AppToolTip title={data.assigned}>
							<Avatar
								alt={data.assigned}
								src="./e.js"
								sx={{ width: 24, height: 24, fontSize: 14 }}
							/>
						</AppToolTip>
					) : (
						<AppToolTip title="Assign">
							<span className="ti-dashed" onClick={assignTask}>
								<IoPersonAddOutline />
							</span>
						</AppToolTip>
					)}
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
						<input type="text" name="q" id="q" />
						{Object.keys(tags).map(
							(t, i) =>
								!data.tags.includes(t) && (
									<li key={i} onClick={() => handleNewTag(t)}>
										{t}
									</li>
								)
						)}
					</Menu>
				</div>

				<LocalizationProvider dateAdapter={DateAdapter}>
					<DatePicker
						open={dPickerOpen}
						label="date-picker"
						value={taskInfo.due_date}
						onChange={(val) => {
							updateTask({ ...taskInfo, due_date: val });
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

					{data.status !== 2 && (
						<AppToolTip title="Mark complete" placement="top">
							<span className="ti-check" onClick={markComplete}>
								<IoCheckmark />
							</span>
						</AppToolTip>
					)}

					<span
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
							onClick={() => deleteTask(data.id)}>
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

	&:hover {
		box-shadow: 0px 1px 10px #d6d6d6;
		transform: scale(1.05);
	}

	.ti-title {
		width: 100%;
		* {
			padding: 3px;
		}
		p {
			cursor: text;
			border: 1px dashed transparent;
			border-radius: 5px;
			transition: all 0.2s linear;
			word-wrap: break-word;
			&:hover {
				border: 1px dashed ${colors.primaryLight};
			}
		}

		textarea {
			width: 100%;
			font-size: inherit;
			border: 1px dashed ${colors.primaryLight};
			border-radius: 5px;
		}
	}

	.ti-tags {
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;
	}

	.ti-bottom {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		padding: 10px 5px 0;
		opacity: 0.7;

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
			svg {
				margin-right: 5px;
			}
			&:hover {
				color: ${colors.primary};
			}
		}
	}

	.ti-setting-con {
		background-color: #ddd270;
		/* position: absolute; */
		width: 100px;
	}
`;

export default connect(null, { updateTask, deleteTask })(TaskItem);
