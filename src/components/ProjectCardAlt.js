import React from 'react';
import { Avatar, AvatarGroup } from '@mui/material';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { getByID, getColor, getLightColor, getProgress } from '../apis/funcs';
import colors from '../config/colors';
import ProgressBar from './ProgressBar';
import UserIcon from './UserIcon';
import { users } from '../apis/data';

const ProjectCardAlt = ({ tasks, data, onClick }) => {
	const { title, type, chats, color, members } = data;

	return (
		<Container color={color} onClick={onClick}>
			<div className="pca-members">
				{/* <Avatar key={i} alt={m} src="./e.js" /> */}
				<AvatarGroup max={5}>
					{members.map((m, i) => (
						<UserIcon
							rounded
							key={i}
							name={getByID(m, users).fullname}
							size={25}
						/>
					))}
				</AvatarGroup>
				<span></span>
			</div>

			<div className="pca-info">
				<p className="pca-title">{title}</p>
				<p className="pca-type">{type}</p>
			</div>

			<div className="pca-progress">
				<p className="pca-progress-title">Progress</p>
				<ProgressBar
					width={getProgress(
						tasks.filter((t) => t.project_id === data.id)
					)}
					color="white"
					// bgColor={getLightColor(color)}
					bgColor="#86868663"
				/>
				<div className="pca-chats">
					<span className="fja">
						<IoChatbubbleEllipsesOutline /> {chats}
					</span>
				</div>
			</div>
		</Container>
	);
};

const Container = styled.div`
	background: ${({ color }) => getColor(color)};
	color: #f0f0f0;
	padding: 30px 15px 15px;
	border-radius: 10px;
	letter-spacing: 0.2px;
	cursor: pointer;
	transition: all 0.2s linear;
	width: 100%;
	min-width: 220px;
	max-width: 240px;
	margin: 0 auto;

	&:hover {
		transform: scale(1.03);
	}

	.pca-members {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.pca-info {
		.pca-title {
			font-weight: 700;
			font-size: 20px;
		}
		.pca-type {
			font-size: 15px;
			margin: 2px 0 40px;
		}
	}

	.pca-progress {
		& > * {
			margin: 10px 0;
			font-size: 14px;
			font-weight: 600;
		}
		.pca-chats {
			font-size: 15px;
			font-weight: 600;
			display: flex;
			justify-content: flex-end;
			/* opacity: 0.7; */
			svg {
				margin-right: 3px;
			}
		}
	}
	.MuiAvatarGroup-avatar {
		width: 20px;
		height: 20px;
		font-size: 12px;
		/* background: ${({ color }) => getColor(color)}; */
	}
`;
const mapStateToProps = ({ tasks }) => ({ tasks });
export default connect(mapStateToProps, {})(ProjectCardAlt);
