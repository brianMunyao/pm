import React, { useState } from 'react';
import {
	IoChatbubbleEllipsesOutline,
	IoCreateOutline,
	IoEllipsisVertical,
	IoTrashOutline,
} from 'react-icons/io5';
import styled from 'styled-components';
import { Avatar, AvatarGroup, Menu } from '@mui/material';
import moment from 'moment';
import { connect } from 'react-redux';

import ProgressBar from './ProgressBar';
import { getByID, getColor, getLightColor, getProgress } from '../apis/funcs';
import AppToolTip from './AppToolTip';
import UserIcon from './UserIcon';
import colors from '../config/colors';
import { users } from '../apis/data';

const ProjectCard = ({
	tasks,
	data,
	onClick,
	openUpdate,
	closeUpdate,
	deleteProject,
}) => {
	const { title, type, chats, color, members, due_date } = data;

	const [anchorEl, setAnchorEl] = useState(null);
	const settOpen = Boolean(anchorEl);

	const checkDate = (d) => {
		if (moment().diff(d) > 0) {
			return 'Due ' + moment(due_date).fromNow();
		}
		return moment(due_date).fromNow(true) + ' left';
	};

	return (
		<Container onClick={onClick} color={color}>
			<div className="pc-top">
				<span className="pc-chats">
					<IoChatbubbleEllipsesOutline /> {chats}
				</span>

				<span
					className="pc-settings fja"
					onClick={(e) => {
						e.stopPropagation();
						setAnchorEl(e.currentTarget);
					}}>
					<AppToolTip title="Settings">
						<span>
							<IoEllipsisVertical />
						</span>
					</AppToolTip>
				</span>
			</div>

			<Menu
				id="settings-menu"
				open={settOpen}
				anchorEl={anchorEl}
				onClick={(e) => e.stopPropagation()}
				onClose={() => {
					setAnchorEl(null);
					closeUpdate();
				}}
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
							'&:hover': {
								background: '#e2e2e2',
							},
						},
						'& li.pc-setting-delete': {
							color: colors.red,
							'&:hover': {
								background: colors.redLight,
							},
						},
					},
				}}>
				<li className="pc-setting-all" onClick={openUpdate}>
					<IoCreateOutline /> Update
				</li>
				<li
					className="pc-setting-all pc-setting-delete"
					onClick={() => {
						deleteProject();
						setAnchorEl(null);
					}}>
					<IoTrashOutline /> Delete
				</li>
			</Menu>

			<p className="pc-title">{title}</p>
			<p className="pc-type">{type}</p>
			<div className="pc-progress">
				<p className="pc-progress-title">Progress</p>
				<ProgressBar
					width={getProgress(
						tasks.filter((t) => t.project_id === data._id)
					)}
					color={getColor(color)}
				/>
				<p className="pc-progress-pge">
					{getProgress(
						tasks.filter((t) => t.project_id === data._id)
					)}
				</p>
			</div>
			<div className="pc-separator"></div>
			<div className="pc-bottom">
				<div>
					<AvatarGroup max={3}>
						{members.map((m, i) => (
							<UserIcon
								key={i}
								name={m}
								// name={getByID(m, users).fullname} //!EDIT THIS
								size={23}
								rounded
							/>
						))}
					</AvatarGroup>
				</div>

				<div className="pc-left">{checkDate(due_date)}</div>
			</div>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	max-width: 300px;
	background: ${({ color }) => getLightColor(color)};
	padding: 15px;
	border-radius: 30px;
	cursor: pointer;
	margin: auto;

	.pc-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.pc-chats {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 15px;
			font-weight: 600;
			opacity: 0.7;
			svg {
				margin-right: 3px;
			}
		}
		.pc-settings {
			width: 23px;
			height: 23px;
		}
	}
	.pc-title,
	.pc-type {
		text-align: center;
	}
	.pc-title {
		font-size: 18px;
		font-weight: 600;
		margin: 20px 0 5px;
		letter-spacing: 0.5px;
	}
	.pc-type {
		margin: 5px 0;
		font-size: 14px;
		opacity: 0.7;
		letter-spacing: 0.3px;
	}
	.pc-progress {
		& > * {
			margin: 5px 0;
			font-size: 14px;
			font-weight: 600;
		}
		.pc-progress-pge {
			text-align: right;
		}
	}
	.pc-separator {
		background: #ffffff52;
		height: 2px;
		margin: 2px 0 10px;
	}
	.pc-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.pc-left {
			background: white;
			padding: 4px 12px;
			border-radius: 30px;
			font-size: 13px;
			font-weight: 600;
			color: ${({ color }) => getColor(color)};
		}
	}
	.MuiAvatarGroup-avatar {
		width: 23px;
		height: 23px;
		font-size: 14px;
		background: ${({ color }) => getColor(color)};
		opacity: 0.9;
	}
`;

const mapStateToProps = ({ tasks }) => ({ tasks });
export default connect(mapStateToProps, {})(ProjectCard);
