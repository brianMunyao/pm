import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';
import {
	IoAddCircleOutline,
	IoAddOutline,
	IoChevronBack,
} from 'react-icons/io5';
import { connect } from 'react-redux';

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
} from '../store/actions';

const ProjectsTab = ({
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
}) => {
	const [backlog, setBacklog] = useState([]);
	const [inprogress, setInprogress] = useState([]);
	const [completed, setCompleted] = useState([]);

	const getProject = (id) => projects.filter((item) => item.id === id)[0];

	const getTaskByID = (id) => tasks.filter((t) => t.id === id)[0];

	useEffect(() => {
		const ptasks = tasks.filter((t) => t.project_id === openedProject);
		setBacklog(ptasks.filter((t) => t.status === 0));
		setInprogress(ptasks.filter((t) => t.status === 1));
		setCompleted(ptasks.filter((t) => t.status === 2));
	}, [tasks, openedProject]);

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
						className="pt-add"
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

		// console.log(list);
		// console.log(result);

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
		<BasicTab>
			<Container>
				{openedProject ? (
					<div className="pt-top-alt">
						<span className="pt-back fja" onClick={closeProject}>
							<IoChevronBack /> Back to projects
						</span>

						<h2 className="pt-title">
							{getProject(openedProject).title}
						</h2>
					</div>
				) : (
					<div className="pt-top">
						<div>
							<h2 className="pt-title" onClick={closeProject}>
								Projects
							</h2>
						</div>

						<div className="pt-add-btn fja" onClick={openPModal}>
							<IoAddOutline /> Add Project
						</div>
					</div>
				)}

				{openedProject ? (
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
				) : (
					<div className="pt-list">
						{projects.map((p, i) => (
							<ProjectCard
								data={p}
								key={i}
								onClick={() => openProject(p.id)}
								openUpdate={() => openPEdit(p)}
								closeUpdate={closePEdit}
								deleteProject={() => deleteProject(p.id)}
							/>
						))}
					</div>
				)}
			</Container>
		</BasicTab>
	);
};
const Container = styled.div`
	padding: 10px;

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

	.pt-open {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(3, minmax(250px, 1fr));
		column-gap: 10px;
		.pt-backlog,
		.pt-inprogress,
		.pt-complete {
			padding: 10px;
		}

		.pt-todos-title {
			padding: 0 10px 10px;
			font-weight: 600;
			font-size: 17px;
			letter-spacing: 0.2px;
			opacity: 0.7;
		}
		.pt-add {
			background: ${colors.primaryLightest};
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 7px 10px;
			border-radius: 8px;
			user-select: none;
			cursor: pointer;
			transition: all 0.1s linear;
			&:hover {
				transform: scale(1.05);
			}
			svg {
				margin-right: 5px;
			}
		}
	}

	.pt-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 20px;
	}
`;

const matchStateToProps = ({ openedProject, projects, tasks }) => ({
	openedProject,
	projects,
	tasks,
});

export default connect(matchStateToProps, {
	openPModal,
	openPEdit,
	closePEdit,
	openProject,
	closeProject,
	deleteProject,
	addTask,
	updateTask,
})(ProjectsTab);
