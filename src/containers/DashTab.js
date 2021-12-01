import React, { useCallback, useEffect, useState } from 'react';
import { LocalizationProvider, PickersDay, StaticDatePicker } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterMoment';
import styled from 'styled-components';
import moment from 'moment';
import { TextField } from '@mui/material';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { PieChart, Pie } from 'recharts';
import { IoAddOutline, IoFileTrayStackedOutline } from 'react-icons/io5';

import colors from '../config/colors';
import {
	getColor,
	getDatedTransactions,
	getLightColor,
	getProgress,
} from '../apis/funcs';
import empty from '../assets/empty.png';
import ProjectCardAlt from '../components/ProjectCardAlt';
import TaskItem from '../components/TaskItem';
import { openPModal } from '../store/actions';

const DashTab = ({ projects, tasks, openPModal }) => {
	const [dateValue, setDateValue] = useState(moment());

	const [projectsDue, setProjectsDue] = useState([]);
	const [tasksDue, setTasksDue] = useState([]);

	const [p_complete, setP_complete] = useState(0);
	const [p_incomplete, setP_incomplete] = useState(0);

	const [pView, setPView] = useState([]);
	const [cookies] = useCookies(['user']);

	const history = useHistory();

	const handleRenderDay = useCallback(
		(day, selected, pickersDayProps) => {
			const arr = [...projects, ...tasks];
			const task = arr.filter((a) =>
				moment(a.due_date).isSame(day, 'date')
			);

			return (
				<PickersDay {...pickersDayProps} className="dt-date">
					{moment(day).date()}
					<DateMarker marked={task[0] || false} />
				</PickersDay>
			);
		},
		[projects, tasks]
	);

	const handleMonthChange = useCallback(
		(newMonth) => {
			const pDue = projects.filter((p) =>
					moment(p.due_date).isSame(newMonth, 'month')
				),
				tDue = tasks.filter((t) =>
					moment(t.due_date).isSame(newMonth, 'month')
				);

			setProjectsDue(pDue);
			setTasksDue(tDue);
			const res = getDatedTransactions([...pDue, ...tDue]);
			setPView(res);
		},
		[projects, tasks]
	);

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
					// setP_complete(c_arr);
				} else {
					i_arr.push(p);
					// setP_incomplete(i_arr);
				}
			});

			setP_complete(c_arr.length);
			setP_incomplete(i_arr.length);
		},
		[tasks]
	);

	const goToProject = (id) => history.push('/m/projects', id);

	useEffect(() => {
		handleMonthChange(dateValue);
		groupProjects(projects);
	}, [handleMonthChange, dateValue, projects, groupProjects]);

	return (
		<Container>
			<div className="dt-main">
				<div className="dt-header">
					<p className="dt-header-title">
						Welcome {cookies.user.fullname}
					</p>
					<p className="dt-header-subtitle">
						Let's Organize Your Project Tasks
					</p>
				</div>

				{projects.length > 0 ? (
					<>
						<div className="dt-projects">
							<div className="dt-projects-title">
								<span className="dt-pt-left">
									Recent projects
								</span>
								<Link to="/m/projects">
									<span className="dt-pt-right">
										View all
									</span>
								</Link>
							</div>
							<div className="dt-projects-list">
								{projects.map((p) => (
									<ProjectCardAlt
										data={p}
										key={p.id}
										onClick={() => goToProject(p._id)}
									/>
								))}
							</div>
						</div>

						<div className="dt-bottom">
							<div className="dt-mytasks">
								<p className="dt-mytasks-title">
									My Upcoming Tasks
								</p>
								{tasks.length > 0 ? (
									tasks
										.slice(0, 4)
										.map((t, i) => (
											<TaskItem
												data={t}
												key={i}
												listStyle="list"
												quickView
												onClick={() =>
													goToProject(t.project_id)
												}
											/>
										))
								) : (
									<TaskItem empty />
								)}
							</div>

							{/* <PieChart>
								<Pie
									data={[
										{
											name: 'Incomplete projects',
											value: p_incomplete,
										},
										{
											name: 'Complete projects',
											value: p_complete,
										},
									]}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									innerRadius={40}
									fill="#f00"
								/>
							</PieChart> */}

							<div className="dt-stats">
								<div className="dt-stat">
									<span className="dt-stat-icon  fja">
										<IoFileTrayStackedOutline />
									</span>

									<div className="dt-stat-names">
										<span className="dt-stat-title">
											Active Projects
										</span>
										<span className="dt-stat-subtitle">
											{projects.length}
										</span>
									</div>
								</div>
							</div>
						</div>
					</>
				) : (
					<div className="dt-empty-alt fja" onClick={openPModal}>
						<IoAddOutline />
						<p>Add Your First Project</p>
					</div>
				)}
			</div>

			<div className="dt-side">
				<LocalizationProvider dateAdapter={DateAdapter}>
					<StaticDatePicker
						className="dt-calendar"
						displayStaticWrapperAs="desktop"
						openTo="day"
						value={dateValue}
						onChange={(newValue) => setDateValue(newValue)}
						onMonthChange={handleMonthChange}
						onYearChange={handleMonthChange}
						renderDay={handleRenderDay}
						renderInput={(params) => <TextField {...params} />}
					/>
				</LocalizationProvider>

				<div className="dt-side-list">
					{pView.length > 0 ? (
						pView.map((item) => (
							<SideItem>
								<p className="si-date">
									{moment(item.date).format('DD MMMM')}
								</p>
								<div>
									{item.data.map((v, i) => (
										<SItem
											color={v.color}
											key={i}
											onClick={() => goToProject(v.id)}>
											<div className="si-top">
												<span className="si-dot"></span>
												<span className="si-type">
													{v.type
														? 'project'
														: 'task'}
												</span>
											</div>
											<div className="si-title">
												{v.title}
											</div>
										</SItem>
									))}
								</div>
							</SideItem>
						))
					) : (
						<div className="dt-empty fja">
							<div className="fja">
								<img src={empty} alt="empty" />
								<span>No tasks</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</Container>
	);
};

const Container = styled.div`
	overflow: hidden;
	display: flex;
	flex-flow: row;
	height: 100%;

	.dt-main,
	.dt-side {
		height: 100%;
	}

	.dt-main {
		flex: 1;
		overflow-y: auto;
		padding: 10px;

		.dt-header {
			padding: 10px;
			letter-spacing: 0.3px;
			color: ${colors.secondaryGreen};
			.dt-header-title {
				font-size: 20px;
				font-weight: 700;
				margin-bottom: 3px;
			}
			.dt-header-subtitle {
				font-size: 14px;
			}
		}

		.dt-projects {
			.dt-projects-title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				letter-spacing: 0.4px;
				padding: 10px 0;
				.dt-pt-left {
					font-weight: 700;
				}
				.dt-pt-right {
					color: grey;
					font-size: 15px;
					cursor: pointer;
				}
			}
			.dt-projects-list {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
				grid-gap: 20px;
				padding: 10px;
				height: 260px;
				overflow: hidden;
			}
		}
		.dt-bottom {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
			.dt-mytasks {
				.dt-mytasks-title {
					letter-spacing: 0.4px;
					padding: 10px 0;
					font-weight: 700;
				}
			}
			.dt-stats {
				padding: 20px;
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
				grid-auto-rows: 100px;
				.dt-stat {
					background: white;
					box-shadow: 1px 2px 10px #d8d8d8;
					padding: 15px;
					border-radius: 10px;
					display: flex;
					align-items: center;
					.dt-stat-icon {
						background: ${colors.primaryLightest};
						color: ${colors.primary};
						width: 50px;
						height: 50px;
						border-radius: 30px;
						font-size: 20px;
						margin-right: 15px;
					}
					.dt-stat-names {
						display: flex;
						flex-direction: column;
						color: ${colors.primary};
						.dt-stat-title {
							font-weight: 600;
							font-size: 17px;
							padding-bottom: 10px;
						}
					}
				}
			}
			/* <div className="dt-stats">
		<div className="dt-stat">
			<span className="dt-stat-icon">
				<IoFileTrayStackedOutline />
			</span>
			<div className="dt-stat-names">
				<span className="dt-stat-title">
					Active Projects
				</span>
				<span className="dt-stat-subtitle">
					{projects.length}
				</span>
			</div>
		</div>
	</div> */
		}
		.dt-empty-alt {
			flex-direction: column;
			/* flex: 1; */
			height: 150px;
			opacity: 0.5;
			border: 1.5px dashed #69696996;
			margin: 10px;
			border-radius: 10px;
			cursor: pointer;
			transition: all.2s linear;
			padding: 10px;
			&:hover {
				background: #eeeeee;
			}
			svg {
				font-size: 30px;
			}
		}
	}

	.dt-side {
		width: auto;
		background: #ffffff;
		overflow: hidden;
		display: flex;
		flex-flow: column;
		height: 100%;

		@media (max-width: 740px) {
			display: none;
		}

		.css-dhopo2 {
			min-height: 235px;
		}
		.dt-date {
			position: relative;
		}
		.dt-side-list {
			flex: 1;
			overflow-y: auto;
			.dt-empty {
				height: 100%;
				min-height: 100px;
				background: #ececec;
				div {
					flex-direction: column;
					font-weight: 600;
					opacity: 0.6;
					img {
						width: 50px;
					}
				}
			}
		}
	}
`;

const DateMarker = styled.span`
	position: absolute;
	width: 5px;
	height: 5px;
	border-radius: 10px;
	bottom: 3px;
	left: 50%;
	transform: translateX(-50%);
	background: ${({ marked }) =>
		marked ? colors.primaryLight : 'transparent'};
`;

const SideItem = styled.div`
	flex: 1;
	background: #ffffff;
	padding: 5px 10px;
	.si-date {
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.1px;
		opacity: 0.6;
		padding: 3px 13px;
	}
`;

const SItem = styled.div`
	padding: 0 0 0 5px;
	/* border-left: 2px solid
		${({ color }) => getLightColor(color) || colors.primaryLight}; */
	margin: 6px 0;
	user-select: none;
	cursor: pointer;
	&:hover {
		.si-dot {
			transform: scale(1.5);
		}
	}
	.si-top {
		display: flex;
		flex-direction: row;
		align-items: center;
		opacity: 0.6;

		.si-dot {
			width: 6px;
			height: 6px;
			border-radius: 10px;
			margin-right: 3px;
			transition: all 0.2s linear;
			background: ${({ color }) => getColor(color) || colors.primary};
		}
		.si-type {
			font-size: 11px;
			font-weight: 600;
			letter-spacing: 0.3px;
			margin-bottom: 2px;
		}
	}
`;

const mapStateToProps = ({ projects, tasks }) => ({ projects, tasks });
export default connect(mapStateToProps, { openPModal })(DashTab);
