import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
	IoAddCircleOutline,
	IoAddOutline,
	IoChevronBack,
	IoPaperPlaneOutline,
} from 'react-icons/io5';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import ioClient from 'socket.io-client';
import { useHistory, useLocation } from 'react-router';

import ProjectCard from '../components/ProjectCard';
import BasicTab from './BasicTab';
import TaskItem from '../components/TaskItem';
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

const socket = ioClient.connect('http://localhost:8000');

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
	addTask,
	updateTask,
	sendMsg,
}) => {
	const [backlog, setBacklog] = useState([]);
	const [inprogress, setInprogress] = useState([]);
	const [completed, setCompleted] = useState([]);
	const [msg, setMsg] = useState('');

	const location = useLocation();
	const history = useHistory();

	const handleMsg = () => {
		if (msg.trim().length > 0) {
			sendMsg({
				text: msg,
				date: moment().toLocaleString(),
				name: 'me',
			});
			setMsg('');
			// axios
			// 	.post('http://localhost:8000/api/chats', {
			// 		text: msg,
			// 		date: moment().toLocaleString(),
			// 		name: 'me',
			// 	})
			// 	.then((res) => {
			// 		sendMsg({
			// 			text: msg,
			// 			date: moment().toLocaleString(),
			// 			name: 'me',
			// 		});
			// 	}).then
			// 	.catch((e) => setMsg(e));
		}
		updateScroll();
	};

	const getProject = (id) => projects.filter((item) => item.id === id)[0];

	const getTaskByID = (id) => tasks.filter((t) => t.id === id)[0];

	const handleOpenProject = (id) => openProject(id);
	const handleCloseProject = () => closeProject();

	const updateScroll = useCallback(async () => {
		if (openedProject) {
			const elem = await document.querySelector('.pt-chats');
			elem.scrollTop = elem.scrollHeight;
		}
	}, [chats]);

	useEffect(() => {
		// socket.on('chat', (res) => {
		// 	console.log(10);
		// 	// handleMsg
		// 	// return sendMsg({
		// 	// 	text: res.chat,
		// 	// 	date: moment().toLocaleString(),
		// 	// 	name: 'server',
		// 	// });
		// });

		const ptasks = tasks.filter((t) => t.project_id === openedProject);
		setBacklog(ptasks.filter((t) => t.status === 0));
		setInprogress(ptasks.filter((t) => t.status === 1));
		setCompleted(ptasks.filter((t) => t.status === 2));
		updateScroll();

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
	]);

	const DnD = ({ list, id }) => (
		<Droppable droppableId={id}>
			{(provided, sn) => (
				<div {...provided.droppableProps} ref={provided.innerRef}>
					{list.map((t, i) => (
						<Draggable
							key={t.id}
							index={i}
							draggableId={t.id.toString()}>
							{(p, s) => (
								<div
									ref={p.innerRef}
									{...p.draggableProps}
									{...p.dragHandleProps}>
									<TaskItem data={t} />
								</div>
							)}
						</Draggable>
					))}

					{provided.placeholder}

					<div
						className="pt-add fja"
						onClick={() => {
							addTask({
								title: 'new task',
								status: Number(id),
								project_id: openedProject,
							});
						}}>
						<IoAddCircleOutline /> Add
					</div>
				</div>
			)}
		</Droppable>
	);

	const move = (
		source,
		destination,
		droppableSource,
		droppableDestination
	) => {
		const sourceClone = Array.from(source);
		const destClone = Array.from(destination);
		const [removed] = sourceClone.splice(droppableSource.index, 1);

		destClone.splice(droppableDestination.index, 0, removed);

		const result = {};
		result[droppableSource.droppableId] = sourceClone;
		result[droppableDestination.droppableId] = destClone;

		return result;
	};

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const onDragEnd = (result) => {
		const { draggableId, source, destination } = result;

		// dropped outside the list
		if (!destination) return;

		if (source.droppableId === destination.droppableId) {
			let myList;
			if (source.droppableId === '0') {
				myList = backlog;
			} else if (source.droppableId === '1') {
				myList = inprogress;
			} else {
				myList = completed;
			}

			const items = reorder(myList, source.index, destination.index);

			if (source.droppableId === '0') {
				setBacklog(items);
			} else if (source.droppableId === '1') {
				setInprogress(items);
			} else {
				setCompleted(items);
			}
		} else {
			updateTask({
				...getTaskByID(Number(draggableId)),
				status: Number(destination.droppableId),
			});

			// let backlogFlag = null,
			// 	inprogressFlag = null,
			// 	completedFlag = null;
			// let toList, fromList;

			// if (source.droppableId === '0') {
			// 	fromList = backlog;
			// 	backlogFlag = 'src';
			// } else if (source.droppableId === '1') {
			// 	fromList = inprogress;
			// 	inprogressFlag = 'src';
			// } else {
			// 	fromList = completed;
			// 	completedFlag = 'src';
			// }

			// if (destination.droppableId === '0') {
			// 	toList = backlog;
			// 	backlogFlag = 'dest';
			// } else if (destination.droppableId === '1') {
			// 	toList = inprogress;
			// 	inprogressFlag = 'dest';
			// } else {
			// 	toList = completed;
			// 	completedFlag = 'dest';
			// }

			// const res = move(fromList, toList, source, destination);

			// if (backlogFlag === 'src') {
			// 	setBacklog(res[source.droppableId]);
			// } else if (backlogFlag === 'dest') {
			// 	setBacklog(res[destination.droppableId]);
			// }
			// if (inprogressFlag === 'src') {
			// 	setInprogress(res[source.droppableId]);
			// } else if (inprogressFlag === 'dest') {
			// 	setInprogress(res[destination.droppableId]);
			// }
			// if (completedFlag === 'src') {
			// 	setCompleted(res[source.droppableId]);
			// } else if (completedFlag === 'dest') {
			// 	setCompleted(res[destination.droppableId]);
			// }
		}
	};

	return (
		<Container>
			{openedProject ? (
				<div className="pt-top-alt">
					<span className="pt-back fja" onClick={handleCloseProject}>
						<IoChevronBack /> Back to projects
					</span>

					<h2 className="pt-title">
						{getProject(openedProject).title}
					</h2>
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
					<DragDropContext onDragEnd={onDragEnd}>
						<div className="pt-open">
							<div className="pt-backlog">
								<div className="pt-todos-title">
									Backlog ({backlog.length})
								</div>
								<DnD list={backlog} id="0" />
							</div>
							<div className="pt-inprogress">
								<div className="pt-todos-title">
									In Progress ({inprogress.length})
								</div>
								<DnD list={inprogress} id="1" />
							</div>
							<div className="pt-complete">
								<div className="pt-todos-title">
									Complete ({completed.length})
								</div>
								<DnD list={completed} id="2" />
							</div>
						</div>
					</DragDropContext>

					<div className="pt-side-chat">
						<p className="pt-chat-title">Group Chat</p>
						<div className="pt-chats">
							{[...chats].slice(0).map((c, i) => (
								<Chat me={c.name === 'me'} key={i}>
									{/** //! CHANGE THIS TO USERID */}
									<div className="pt-chat-inner">
										{c.name !== 'me' && (
											<span className="pt-chat-name">
												{c.name}
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
							))}
						</div>

						<div className="pt-chats-input">
							<input
								autoFocus
								type="text"
								placeholder="Enter a message"
								value={msg}
								onChange={(e) => setMsg(e.target.value)}
								onKeyPress={(e) =>
									e.key === 'Enter' && handleMsg()
								}
							/>

							<span
								className="pt-chats-send fja"
								onClick={handleMsg}>
								<IoPaperPlaneOutline />
							</span>
						</div>
					</div>
				</div>
			) : (
				<div className="pt-list">
					{projects.map((p, i) => (
						<ProjectCard
							data={p}
							key={i}
							onClick={() => handleOpenProject(p.id)}
							openUpdate={() => openPEdit(p)}
							closeUpdate={closePEdit}
							deleteProject={() => deleteProject(p.id)}
						/>
					))}
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
	}

	.pt-open-con {
		flex: 1;
		/*display: flex;
		flex-flow: row;
		flex-direction: row; */
		overflow: auto;
		display: grid;
		grid-template-columns: 1fr 300px;
		grid-template-rows: 100%;

		.pt-side-chat,
		.pt-open {
			width: 100%;
			height: 100%;
		}

		.pt-open {
			display: grid;
			grid-template-columns: repeat(3, minmax(200px, 1fr));
			column-gap: 25px;
			flex: 1;
			padding: 10px;
			overflow-y: auto;

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

		.pt-side-chat {
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

	.pt-list {
		padding: 10px 15px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 20px;
		height: 100%;
		overflow-y: auto;
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

const mapStateToProps = ({ openedProject, projects, tasks, chats }) => ({
	chats,
	openedProject,
	projects,
	tasks,
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
