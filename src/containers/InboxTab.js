import React, { useCallback, useEffect, useState } from 'react';
import {
	IoChatbubbleEllipses,
	IoPaperPlaneOutline,
	IoTrailSignOutline,
} from 'react-icons/io5';
import styled from 'styled-components';
import { connect } from 'react-redux';
import moment from 'moment';
import { useCookies } from 'react-cookie';

import { getColor, getLightColor } from '../apis/funcs';
import colors from '../config/colors';

const InboxTab = ({ projects, chats, socket }) => {
	const [cookies] = useCookies(['user']);

	const [projectID, setProjectID] = useState(null);
	const [msg, setMsg] = useState('');

	const getProject = (id) => projects.filter((item) => item._id === id)[0];

	const updateScroll = useCallback(() => {
		if (projectID) {
			const elem = document.querySelector('.it-chats');
			elem.scrollTop = elem.scrollHeight;
		}
	}, [projectID]);

	const handleMsg = () => {
		if (msg.trim().length > 0) {
			setMsg('');
			socket.emit('chats', {
				text: msg,
				date: moment().toLocaleString(),
				fullname: cookies.user.fullname,
				user_id: cookies.user._id,
				project_id: projectID,
			});
		}
	};

	useEffect(() => {
		updateScroll();
	}, [updateScroll, chats]);

	return (
		<Container>
			<div className="it-sidebar it-parts">
				<div className="it-groups">
					<div className="it-title">GROUPS</div>

					{projects.map((p, i) => (
						<InboxTitle
							active={p._id === projectID}
							color={p.color}
							key={i}
							onClick={() => {
								setProjectID(p._id);
							}}>
							<span className="it-group-title"># {p.title}</span>
							{p.chats > 0 ? (
								<span className="it-group-chats fja">
									{p.chats}
								</span>
							) : (
								<span></span>
							)}
						</InboxTitle>
					))}
				</div>
			</div>
			<div className="it-main it-parts">
				{projectID ? (
					<>
						<p className="it-chats-title">
							{getProject(projectID).title}
						</p>
						<div className="it-chats">
							{Boolean(chats[projectID]) ? (
								chats[projectID].length > 0 ? (
									chats[projectID].map((c, i) => (
										<Chat
											me={c.user_id === cookies.user._id}
											key={i}>
											<div className="it-chat-inner">
												{c.user_id !==
													cookies.user._id && (
													<span className="it-chat-name">
														{c.fullname}
													</span>
												)}
												<span className="it-chat-text">
													{c.text}
												</span>
												<span className="it-chat-date">
													{moment(c.date).format(
														'HH:MM'
													)}
												</span>
											</div>
										</Chat>
									))
								) : (
									<div className="chat-empty fja">
										<IoChatbubbleEllipses />
										<span>No chats</span>
									</div>
								)
							) : (
								<div className="chat-empty fja">
									<IoChatbubbleEllipses />
									<span>No chats</span>
								</div>
							)}
						</div>
						<div className="it-chats-input">
							<input
								type="text"
								placeholder="Enter a message"
								value={msg}
								onChange={(e) => setMsg(e.target.value)}
								onKeyPress={(e) =>
									e.key === 'Enter' && handleMsg()
								}
							/>

							<span
								className="it-chats-send fja"
								onClick={handleMsg}>
								<IoPaperPlaneOutline />
							</span>
						</div>
					</>
				) : (
					<div className="it-chats-unopen fja">
						<div className="fja">
							<IoTrailSignOutline />
							<p>Open a chat</p>
						</div>
					</div>
				)}
			</div>
		</Container>
	);
};

const Container = styled.div`
	display: relative;
	width: 100%;
	height: 100vh;
	.it-parts {
		position: absolute;
		top: 0;
		bottom: 0;
		overflow-y: auto;
	}

	.it-sidebar {
		left: 0;
		width: 180px;
		background: white;
		.it-title {
			font-size: 12px;
			font-weight: 600;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 8px 2px;
		}
	}
	.it-main {
		left: 180px;
		right: 0;
		padding: 15px 0 0;
		display: flex;
		flex-direction: column;
		.it-chats-unopen {
			height: 100vh;
			div {
				flex-direction: column;
				svg {
					font-size: 120px;
					opacity: 0.2;
				}
				p {
					margin-top: 15px;
					opacity: 0.8;
				}
			}
		}

		.it-chats-title {
			padding: 0 10px 10px;
			/* font-size: 12px; */
			font-weight: 600;
			box-shadow: 0 10px 5px #e6e6e6;
		}

		.it-chats {
			display: flex;
			flex-direction: column;
			flex: 1;
			overflow: auto;
			padding: 10px 50px;
			@media (max-width: 880px) {
				padding: 10px;
			}
		}
		.it-chats-input {
			background: white;
			height: 56px;
			display: flex;
			color: #3f3f3f;
			margin: 10px;
			border-radius: 8px;
			box-shadow: 2px 3px 10px #9e9e9e4b;
			overflow: hidden;

			input {
				padding: 5px 10px;
				font-size: inherit;
				flex: 1;
			}
			.it-chats-send {
				background: ${colors.primary};
				color: white;
				height: 43px;
				width: 43px;
				margin: 7px;
				font-size: 22px;
				border-radius: 8px;
				cursor: pointer;
			}
		}
		.chat-empty {
			opacity: 0.6;
			flex: 1;
			flex-direction: column;
			svg {
				font-size: 50px;
			}
		}
	}
`;

const InboxTitle = styled.div`
	font-weight: 600;
	letter-spacing: 0.4px;
	opacity: 0.8;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 10px;
	margin: 2px 5px;
	border-radius: 10px;
	user-select: none;
	cursor: pointer;
	transition: all 0.2s linear;
	background: ${({ active, color }) => (active ? getColor(color) : 'white')};
	color: ${({ active }) => (active ? 'white' : 'inherit')};
	&:hover {
		background: ${({ color }) => getLightColor(color)};
		color: inherit;
	}
	.it-group-chats {
		width: 22px;
		height: 22px;
		border-radius: 11px;
		font-size: 13px;
		background: ${({ color }) => getLightColor(color)};
		color: ${({ color }) => getColor(color)};
	}
`;

const Chat = styled.div`
	display: flex;
	justify-content: ${({ me }) => (me ? 'flex-end' : 'flex-start')};

	.it-chat-inner {
		position: relative;
		display: flex;
		flex-direction: column;
		background: ${({ me }) => (me ? colors.primaryLight : 'white')};
		color: ${({ me }) => me && 'white'};
		border-radius: 7px;
		padding: 4px 8px;
		margin: 4px 10px;
		box-shadow: 2px 3px 10px #eeeeee;
		max-width: 280px;
		min-width: 100px;
		width: fit-content;
		.it-chat-name {
			font-size: 13px;
			font-weight: 600;
			opacity: 0.8;
			letter-spacing: 0.3px;
			color: ${colors.primary};
		}
		.it-chat-date {
			margin-left: auto;
			letter-spacing: 0.5px;
			font-size: 10px;
			font-weight: 600;
			opacity: 0.7;
		}
	}
`;

const mapStateToProps = ({ projects, chats, socket }) => ({
	projects,
	chats,
	socket,
});
export default connect(mapStateToProps, {})(InboxTab);
