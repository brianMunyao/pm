import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import {
	IoAdd,
	IoAddCircleOutline,
	IoAddOutline,
	IoChatbubbleEllipses,
	IoChatbubbles,
	IoChevronBack,
	IoGridOutline,
	IoPaperPlaneOutline,
	IoReorderFour,
} from 'react-icons/io5';
import { BsBarChartSteps } from 'react-icons/bs';
import { connect } from 'react-redux';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router';
import { useCookies } from 'react-cookie';

import ProjectCard from '../components/ProjectCard';
import AppGantt from '../components/AppGantt';
import RadioGroup from '../components/RadioGroup';
import colors from '../config/colors';
import {
	openPModal,
	openPEdit,
	closePEdit,
	openProject,
	closeProject,
	deleteProject,
	addTask,
	updateTask,
	sendMsg,
} from '../store/actions';
import empty from '../assets/empty.png';
import AppToolTip from '../components/AppToolTip';
import AddMemberModal from '../components/AddMemberModal';
import UserIcon from '../components/UserIcon';
import { getColor, getLightColor, getProgress } from '../apis/funcs';
import DnD from '../components/DnD';

const ProjectsTab = ({
	chats,
	tasks,
	projects,
	openPModal,
	openPEdit,
	closePEdit,
	openedProject,
	openProject,
	closeProject,
	deleteProject,
	updateTask,
	sendMsg,
	socket,
}) => {
	const [cookies] = useCookies(['user']);

	const [backlog, setBacklog] = useState([]);
	const [inprogress, setInprogress] = useState([]);
	const [completed, setCompleted] = useState([]);
	const [msg, setMsg] = useState('');

	const [chatOpen, setChatOpen] = useState(false);
	const [listStyle, setListStyle] = useState('grid');
	const getListStyle = (val) => setListStyle(val);

	const [memberModal, setMemberModal] = useState(false);
	const handleOpenMember = () => setMemberModal(true);
	const handleCloseMember = () => setMemberModal(false);

	const [p_complete, setP_complete] = useState([]);
	const [p_incomplete, setP_incomplete] = useState([]);

	const location = useLocation();
	const history = useHistory();

	const handleMsg = () => {
		if (msg.trim().length > 0) {
			setMsg('');
			socket.emit('chats', {
				text: msg,
				date: moment().toLocaleString(),
				fullname: cookies.user.fullname,
				user_id: cookies.user._id,
				project_id: openedProject,
			});
		}
		updateScroll();
	};

	const toggleChat = () => setChatOpen(!chatOpen);

	const getProject = (id) => projects.filter((item) => item._id === id)[0];

	const getTaskByID = (id) => tasks.filter((t) => t._id === id)[0];

	const handleOpenProject = (id) => openProject(id);
	const handleCloseProject = () => closeProject();

	const updateScroll = useCallback(() => {
		if (openedProject) {
			const elem = document.querySelector('.pt-chats');
			elem.scrollTop = elem.scrollHeight;
		}
	}, [openedProject]);

	const groupProjects = useCallback(
		(arr) => {
			const isProjectComplete = (id) =>
				getProgress(
					tasks.filter((t) => t.project_id === id),
					1
				);

			const c_arr = [],
				i_arr = [];

			arr.forEach((p) => {
				if (isProjectComplete(p._id)) {
					c_arr.push(p);
					setP_complete(c_arr);
				} else {
					i_arr.push(p);
					setP_incomplete(i_arr);
				}
			});
		},
		[tasks]
	);

	useEffect(() => {
		const ptasks = tasks.filter((t) => t.project_id === openedProject);
		setBacklog(ptasks.filter((t) => t.status === 0));
		setInprogress(ptasks.filter((t) => t.status === 1));
		setCompleted(ptasks.filter((t) => t.status === 2));
		updateScroll();

		groupProjects(projects);

		if (location.state) {
			openProject(location.state);
			history.replace(location.pathname);
		}
	}, [
		tasks,
		sendMsg,
		openedProject,
		updateScroll,
		location.state,
		openProject,
		history,
		location.pathname,
		groupProjects,
		projects,
	]);

	const SideChat = () => (
		<div className="pt-side-chat">
			<p className="pt-chat-title">Group Chat</p>
			<div className="pt-chats">
				{Boolean(chats[openedProject]) ? (
					chats[openedProject].length > 0 ? (
						chats[openedProject].map((c, i) => (
							<Chat me={c.user_id === cookies.user._id} key={i}>
								<div className="pt-chat-inner">
									{c.user_id !== cookies.user._id && (
										<span className="pt-chat-name">
											{c.fullname}
										</span>
									)}
									<span className="pt-chat-text">
										{c.text}
									</span>
									<span className="pt-chat-date">
										{moment(c.date).format('HH:MM')}
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

			<div className="pt-chats-input">
				<input
					autoFocus
					type="text"
					placeholder="Enter a message"
					value={msg}
					onChange={(e) => setMsg(e.target.value)}
					onKeyPress={(e) => e.key === 'Enter' && handleMsg()}
				/>

				<span className="pt-chats-send fja" onClick={handleMsg}>
					<IoPaperPlaneOutline />
				</span>
			</div>
		</div>
	);

	const onDragEnd = (result) => {
		const { draggableId, source, destination } = result;

		// dropped outside the list
		if (!destination) return;

		if (source.droppableId !== destination.droppableId) {
			updateTask(draggableId, {
				status: Number(destination.droppableId),
			});
		}
	};

	return (
		<Container
			chatOpen={chatOpen}
			color={openedProject && getProject(openedProject).color}>
			{openedProject ? (
				<div className="pt-top-alt">
					<span className="pt-back fja" onClick={handleCloseProject}>
						<IoChevronBack /> Back to projects
					</span>

					<div className="pt-top-name">
						<h2 className="pt-title">
							{getProject(openedProject).title}
						</h2>
						<div>
							<RadioGroup
								defaultValue={0}
								data={[
									// {
									// 	icon: <BsBarChartSteps />,
									// 	value: 'gantt',
									// 	label: 'Gantt Chart',
									// },
									{
										icon: <IoGridOutline />,
										value: 'grid',
										label: 'Grid View',
									},
									{
										icon: <IoReorderFour />,
										value: 'list',
										label: 'List View',
									},
								]}
								onChange={getListStyle}
							/>
							<IoChatbubbles
								className="chat-icon"
								onClick={toggleChat}
							/>
						</div>
					</div>
					<div className="pt-members">
						<AppToolTip title="Add Member">
							<span
								className="pt-add-member fja"
								onClick={handleOpenMember}>
								<IoAdd />
							</span>
						</AppToolTip>

						{getProject(openedProject).members.map((m) => (
							<AppToolTip
								title={
									m._id === cookies.user._id
										? 'Lead'
										: 'Member'
								}
								placement="top">
								<div className="pt-member fja">
									<UserIcon
										rounded
										name={m.fullname}
										size={18}
									/>
									<span>{m.fullname}</span>
								</div>
							</AppToolTip>
						))}
					</div>
				</div>
			) : (
				<div className="pt-top">
					<div>
						<h2 className="pt-title">Projects</h2>
					</div>

					<div className="pt-add-btn fja" onClick={openPModal}>
						<IoAddOutline /> Add Project
					</div>
				</div>
			)}

			{openedProject ? (
				<div className="pt-open-con">
					{listStyle === 'gantt' ? (
						<AppGantt
							tasks={tasks.filter(
								(t) => t.project_id === openedProject
							)}
						/>
					) : (
						<DragDropContext onDragEnd={onDragEnd}>
							<div
								className={`pt-open ${
									listStyle === 'list'
										? 'pt-list-view'
										: 'pt-kanban-view'
								}`}>
								<DnD
									_class="pt-cols pt-backlog"
									title="Backlog"
									list={backlog}
									id="0"
									lStyle={listStyle}
								/>
								<DnD
									_class="pt-cols pt-inprogress"
									title="In Progress"
									list={inprogress}
									id="1"
									lStyle={listStyle}
								/>
								<DnD
									_class="pt-cols pt-complete"
									title="Complete"
									list={completed}
									id="2"
									lStyle={listStyle}
								/>
							</div>
						</DragDropContext>
					)}

					<SideChat />
					<AddMemberModal
						open={memberModal}
						handleClose={handleCloseMember}
					/>
				</div>
			) : projects.length > 0 ? (
				<div className="pt-list-con">
					<div className="pt-list-title">
						Ongoing <span>{p_incomplete.length}</span>
					</div>
					<div className="pt-list">
						{p_incomplete.map((p, i) => (
							<ProjectCard
								data={p}
								key={i}
								onClick={() => handleOpenProject(p._id)}
								openUpdate={() => openPEdit(p)}
								closeUpdate={closePEdit}
								deleteProject={() => deleteProject(p._id)}
							/>
						))}
					</div>
					<div className="pt-complete-title pt-list-title">
						Completed <span>{p_complete.length}</span>
					</div>
					<div className="pt-list">
						{p_complete.map((p, i) => (
							<ProjectCard
								data={p}
								key={i}
								onClick={() => handleOpenProject(p._id)}
								openUpdate={() => openPEdit(p)}
								closeUpdate={closePEdit}
								deleteProject={() => deleteProject(p._id)}
							/>
						))}
					</div>
				</div>
			) : (
				<div className="pt-empty fja" onClick={openPModal}>
					<img src={empty} alt="empty" />
					<p>No projects added</p>
				</div>
			)}
		</Container>
	);
};
const Container = styled.div`
	overflow: hidden;
	display: flex;
	flex-flow: column;
	height: 100%;

	.pt-title {
		letter-spacing: 0.3px;
		opacity: 0.8;
		padding: 5px 0;
	}

	.pt-top {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 15px 10px;

		.pt-add-btn {
			background: ${colors.secondaryBlue};
			color: white;
			padding: 5px 10px;
			font-size: 14px;
			border-radius: 7px;
			user-select: none;
			cursor: pointer;
			svg {
				margin-right: 5px;
				font-size: 19px;
			}
		}
	}
	.pt-top-alt {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		padding: 10px 15px 5px;

		.pt-back {
			font-size: 14px;
			opacity: 0.6;
			cursor: pointer;
			user-select: none;
			transition: all 0.1s linear;
			padding: 3px 0;
			&:hover {
				opacity: 0.8;
			}
			svg {
				margin-right: 4px;
				margin-top: 2px;
			}
		}
		.pt-top-name {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.chat-icon {
				cursor: pointer;
				font-size: 20px;
				color: ${({ chatOpen }) =>
					chatOpen ? colors.primaryLighter : colors.primaryLight};
			}
			div {
				display: flex;
				align-items: center;
			}
		}
		.pt-members {
			display: flex;
			width: 100%;
			padding: 5px 0;
			align-items: center;
			.pt-add-member {
				border-radius: 10px;
				cursor: pointer;
				width: 24px;
				height: 24px;
				color: ${({ color }) => getColor(color)};
				background: ${({ color }) => getLightColor(color)};
				transition: all 0.2s linear;
				&:hover {
					background: ${({ color }) => getColor(color)};
					color: white;
				}
			}
			.pt-member {
				cursor: pointer;
				user-select: none;
				background-color: #eeeeee;
				font-size: 12px;
				border: 1.3px solid ${colors.primaryLighter};
				padding: 2px 8px 2px 2px;
				border-radius: 30px;
				margin: 0 0 0 10px;
				span {
					margin-left: 3px;
				}
			}
		}
	}

	.pt-open-con {
		flex: 1;
		overflow: hidden;
		display: grid;
		grid-template-columns: ${({ chatOpen }) =>
			chatOpen ? '1fr 300px' : '1fr 0'};
		grid-template-rows: 100%;

		.pt-side-chat,
		.pt-open {
			width: 100%;
			height: 100%;
		}

		.pt-open {
			padding: 10px;
			overflow-y: auto;

			.pt-cols {
				padding: 10px;
				border-radius: 10px;
				/* overflow-y: auto; */
			}
			/* .pt-backlog {
				background: ${colors.errorLight};
			}
			.pt-inprogress {
				background: ${colors.amberLight};
			}
			.pt-complete {
				background: ${colors.greenLight};
			} */

			.pt-todos-title {
				padding: 0 10px 10px;
				font-weight: 600;
				font-size: 17px;
				letter-spacing: 0.2px;
				opacity: 0.7;
			}
			.pt-add {
				background: ${colors.primaryLightest};
				padding: 7px 10px;
				border-radius: 8px;
				user-select: none;
				cursor: pointer;
				transition: all 0.1s linear;
				&:hover {
					transform: scale(1.015);
				}
				svg {
					margin-right: 5px;
				}
			}
		}

		.pt-open.pt-kanban-view {
			display: grid;
			grid-template-columns: repeat(3, minmax(220px, 1fr));
			column-gap: 18px;
			flex: 1;
		}
		.pt-open.pt-list-view {
			padding: 18px;
			.pt-todos-title {
				padding: 10px;
				font-size: 16px;
			}
			.pt-add {
				padding: 5px;
				width: 120px;
				&:hover {
					transform: translateX(2px);
				}
			}
		}
		.pt-open.pt-list-view .pt-cols {
			margin-bottom: 10px;
		}

		.pt-side-chat {
			overflow: hidden;
			border-left: 2px solid #ecececce;
			background: #f0f0f0ce;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: auto 1fr 56px;
			row-gap: 10px;
			padding: 0 0 10px;
			.pt-chat-title {
				font-weight: 600;
				opacity: 0.8;
				padding: 5px 5px 0;
			}

			.pt-chats {
				flex: 1;
				display: flex;
				flex-direction: column;
				overflow-y: auto;
				padding: 0 5px;
				.chat-empty {
					opacity: 0.6;
					flex: 1;
					flex-direction: column;
					svg {
						font-size: 50px;
					}
				}
			}
			.pt-chats-input {
				background: white;
				height: 100%;
				display: flex;
				color: #3f3f3f;
				margin: 0 10px;
				border-radius: 8px;
				box-shadow: 2px 3px 10px #9e9e9e4b;
				overflow: hidden;

				input {
					padding: 5px 10px;
					font-size: inherit;
					flex: 1;
				}
				.pt-chats-send {
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
		}
	}
	.pt-list-con {
		padding: 10px 15px;
		flex: 1;
		overflow-y: auto;
		.pt-complete-title {
			margin-top: 15px;
		}
		.pt-list-title {
			padding: 10px 5px;
			font-weight: 600;
			span {
				opacity: 0.6;
				margin-left: 5px;
				color: ${colors.secondaryGreen};
			}
		}
		.pt-list {
			/* margin: 10px 15px; */
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
			grid-auto-rows: min-content;
			gap: 20px;
			/* height: fit-content; */
			overflow-y: auto;
		}
	}
	.pt-empty {
		flex: 1;
		flex-direction: column;
		opacity: 0.5;
		border: 1.5px dashed #69696996;
		margin: 10px;
		border-radius: 10px;
		cursor: pointer;
		transition: all.2s linear;
		&:hover {
			background: #eeeeee;
		}
		img {
			height: 80px;
		}
	}

	@media (max-width: 850px) {
		.pt-open-con {
			.pt-open {
				column-gap: 15px;
			}
		}
	}
`;

const Chat = styled.div`
	display: flex;
	justify-content: ${({ me }) => (me ? 'flex-end' : 'flex-start')};

	.pt-chat-inner {
		position: relative;
		display: flex;
		flex-direction: column;
		background: ${({ me }) => (me ? colors.primaryLight : 'white')};
		color: ${({ me }) => me && 'white'};
		border-radius: 7px;
		padding: 4px 8px;
		margin: 4px 0;
		box-shadow: 2px 3px 10px #eeeeee;
		max-width: 80%;
		min-width: 100px;
		width: fit-content;
		.pt-chat-name {
			font-size: 13px;
			font-weight: 600;
			opacity: 0.8;
			letter-spacing: 0.3px;
			color: ${colors.primary};
		}
		.pt-chat-date {
			margin-left: auto;
			letter-spacing: 0.5px;
			font-size: 10px;
			font-weight: 600;
			opacity: 0.7;
		}
	}
`;

const mapStateToProps = ({
	openedProject,
	projects,
	tasks,
	chats,
	socket,
}) => ({
	chats,
	openedProject,
	projects,
	tasks,
	socket,
});

export default connect(mapStateToProps, {
	openPModal,
	openPEdit,
	closePEdit,
	openProject,
	closeProject,
	deleteProject,
	addTask,
	updateTask,
	sendMsg,
})(ProjectsTab);
