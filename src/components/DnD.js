import moment from 'moment';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useCookies } from 'react-cookie';
import { IoAddCircleOutline } from 'react-icons/io5';
import { connect } from 'react-redux';
import styled from 'styled-components';

import colors from '../config/colors';
import { addTask } from '../store/actions';
import TaskItem from './TaskItem';

const DnD = ({ list, id, lStyle, openedProject, addTask, _class, title }) => {
	const [cookies] = useCookies(['user']);

	return (
		<div className={_class}>
			<div className="pt-todos-title">
				{title} ({list.length})
			</div>
			<Droppable droppableId={id}>
				{(provided, sn) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{list.length > 0 ? (
							list.map((t, i) => (
								<Draggable
									key={t._id}
									index={i}
									draggableId={t._id.toString()}>
									{(p, s) => (
										<div
											ref={p.innerRef}
											{...p.draggableProps}
											{...p.dragHandleProps}>
											{/* {listStyle === 'list' ? (
										<TaskItemList data={t} />
									) : (
										<TaskItem data={t} />
									)} */}
											<TaskItem
												data={t}
												listStyle={lStyle}
											/>
										</div>
									)}
								</Draggable>
							))
						) : (
							<TaskItem empty />
						)}

						{provided.placeholder}

						<div
							className="pt-add fja"
							onClick={() => {
								addTask({
									title: 'new task',
									status: Number(id),
									project_id: openedProject,
									start_date: moment().toLocaleString(),
									due_date: moment()
										.add(7, 'days')
										.toLocaleString(),
									created_by: cookies.user._id,
								});
							}}>
							<IoAddCircleOutline /> Add
						</div>
					</div>
				)}
			</Droppable>
		</div>
	);
};

const mapStateToProps = ({ openedProject }) => ({ openedProject });

export default connect(mapStateToProps, { addTask })(DnD);
