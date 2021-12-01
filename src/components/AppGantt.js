import React, { useEffect } from 'react';
import { GanttComponent } from '@syncfusion/ej2-react-gantt';
import styled from 'styled-components';
import moment from 'moment';

import { getColor } from '../apis/funcs';

const taskFields = {
	id: '_id',
	name: 'title',
	startDate: 'start_date',
	duration: 'duration',
	// progress: 'progress',
	child: 'subtasks',
};

const AppGantt = ({ tasks }) => {
	useEffect(() => {
		const cols = document.getElementsByTagName('colgroup');
		console.log([...cols][0]);
		[...cols].slice(0, 1).forEach((elem, i) => {
			// elem.pop();
		});
	}, []);

	return (
		<Container>
			{/* <Gantt tasks={tasks} /> */}
			{/* <DefaultTheme>
				<Gantt
					scales={scales}
					columns={columns}
					tasks={tasks}
					links={links}
				/>
			</DefaultTheme> */}
			{/* <GG tasks={tasks} /> */}

			<GanttComponent
				dataSource={tasks.map((t) => {
					const obj = { ...t };
					obj.duration = moment(t.due_date).diff(
						t.start_date,
						'days'
					);
					return obj;
				})}
				height="86.43%"
				taskFields={taskFields}
			/>
		</Container>
	);
};

const Container = styled.div`
	height: 100%;
	.e-gantt {
		.e-table {
			/* width: auto; */
			.e-columnheader {
				th:first-child {
					display: none;
				}
				th:nth-child(2) {
					/* min-width: 100px;
					max-width: 150px; */
					width: 150px;
					background: violet;
				}
			}
		}
		.e-gridcontent .e-content {
			.e-row {
				.e-rowcell:first-child {
					display: none;
				}
				.e-rowcell:nth-child(2) {
					/* min-width: 100px;
					max-width: 150px; */
					width: 150px;
					background: violet;
				}
			}
		}
	}

	/* ._WuQ0f {
		display: flex;
	} */
`;

export default AppGantt;
