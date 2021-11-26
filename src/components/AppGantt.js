import React, { useEffect } from 'react';
import {
	GanttComponent,
	ColumnsDirective,
	ColumnDirective,
} from '@syncfusion/ej2-react-gantt';

// import {
// 	Gantt as GG,
// 	Task,
// 	EventOption,
// 	StylingOption,
// 	ViewMode,
// 	DisplayOption,
// } from 'gantt-task-react';
// import 'gantt-task-react/dist/index.css';
// import { Gantt, DefaultTheme } from '@dhtmlx/trial-react-gantt';
import styled from 'styled-components';

import { getColor } from '../apis/funcs';

const list = [
	{
		start: new Date(2020, 1, 1),
		end: new Date(2020, 1, 2),
		name: 'Idea',
		id: 'Task 0',
		type: 'task',
		// progress: 45,
		// isDisabled: true,
		styles: {
			backgroundColor: getColor('lime'),
			progressColor: '#ffbb54',
			progressSelectedColor: '#ff9e0d',
		},
	},
	{
		start: new Date(2020, 1, 2),
		end: new Date(2020, 1, 4),
		name: 'Antoh',
		id: 'Task 1',
		type: 'task',
		// progress: 100,
		// isDisabled: true,
		styles: {
			backgroundColor: getColor('lime'),
			progressColor: '#943214',
			progressSelectedColor: '#4d3a1f',
		},
	},
	{
		start: new Date(2020, 1, 3),
		end: new Date(2020, 1, 4),
		name: 'ther',
		id: 'Task 3',
		type: 'task',
		// progress: 45,
		// isDisabled: true,
		styles: {
			backgroundColor: getColor('lime'),
			progressColor: '#27804f',
			progressSelectedColor: '#ff9e0d',
		},
	},
	{
		start: new Date(2020, 1, 1),
		end: new Date(2020, 1, 9),
		name: 'SOme other',
		id: 'Task 2',
		type: 'milestone',
		// progress: 100,
		// isDisabled: true,
		styles: {
			backgroundColor: getColor('lime'),
			progressColor: '#941469',
			progressSelectedColor: '#4d3a1f',
		},
	},
];

const scales = [
	{ unit: 'month', step: 1, format: 'MMMM yyy' },
	{ unit: 'day', step: 1, format: 'd' },
];

const columns = [
	{ name: 'text', label: 'Task name', width: '100%' },
	{ name: 'start', label: 'Start time', align: 'center' },
	{ name: 'duration', label: 'Duration', width: '70px', align: 'center' },
	{ name: 'add-task', label: '', width: '50px', align: 'center' },
];

// const tasks = [
// 	{
// 		id: 1,
// 		open: true,
// 		start_date: '2020-11-06',
// 		duration: 8,
// 		text: 'React Gantt Widget',
// 		progress: 60,
// 		type: 'project',
// 	},
// 	{
// 		id: 2,
// 		parent: 1,
// 		start_date: '2020-11-06',
// 		duration: 4,
// 		text: 'Lib-Gantt',
// 		progress: 80,
// 	},
// ];

const links = [{ source: 2, target: 1, type: 0 }];

const GanttData = [
	{
		TaskID: 1,
		TaskName: 'Project Initiation',
		StartDate: new Date('04/02/2019'),
		EndDate: new Date('04/21/2019'),
		subtasks: [
			{
				TaskID: 2,
				TaskName: 'Identify Site location',
				StartDate: new Date('04/02/2019'),
				Duration: 4,
				Progress: 50,
			},
			{
				TaskID: 3,
				TaskName: 'Perform Soil test',
				StartDate: new Date('04/02/2019'),
				Duration: 4,
				Progress: 50,
			},
			{
				TaskID: 4,
				TaskName: 'Soil test approval',
				StartDate: new Date('04/02/2019'),
				Duration: 4,
				Progress: 50,
			},
		],
	},
	{
		TaskID: 5,
		TaskName: 'Project Estimation',
		StartDate: new Date('04/02/2019'),
		EndDate: new Date('04/21/2019'),
		subtasks: [
			{
				TaskID: 6,
				TaskName: 'Develop floor plan for estimation',
				StartDate: new Date('04/04/2019'),
				Duration: 3,
				Progress: 50,
			},
			{
				TaskID: 7,
				TaskName: 'List materials',
				StartDate: new Date('04/04/2019'),
				Duration: 3,
				Progress: 50,
			},
			{
				TaskID: 8,
				TaskName: 'Estimation approval',
				StartDate: new Date('04/04/2019'),
				Duration: 3,
				Progress: 50,
			},
		],
	},
];

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
				dataSource={tasks}
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
