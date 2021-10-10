import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	IoChatbubbleEllipsesOutline,
	IoEnterOutline,
	IoFileTrayFullOutline,
	IoGridOutline,
	IoSettingsOutline,
} from 'react-icons/io5';
import { Link, Route, Switch, useLocation } from 'react-router-dom';

import Logo from '../components/Logo';
import colors from '../config/colors';
import ProjectsTab from './ProjectsTab';

const MainScreen = () => {
	const [activeNav, setActiveNav] = useState(0);

	const navs = [
		{ title: 'Dashboard', Icon: IoGridOutline, to: '/m' },
		{ title: 'Projects', Icon: IoFileTrayFullOutline, to: '/m/projects' },
		{ title: 'Inbox', Icon: IoChatbubbleEllipsesOutline, to: '/m/inbox' },
		{ title: 'Settings', Icon: IoSettingsOutline, to: '/m/settings' },
	];

	const NavItem = ({ id, data: { title, Icon, to } }) => {
		return (
			<Link to={to}>
				<div
					className={`nav-item ${
						id === activeNav ? 'nav-active' : 'nav-inactive'
					}`}
					onClick={() => setActiveNav(id)}>
					<Icon />
					<span>{title}</span>
				</div>
			</Link>
		);
	};

	const location = useLocation();
	useEffect(() => {
		setActiveNav(navs.findIndex(({ to }) => to === location.pathname));
	}, [navs, location]);

	return (
		<Main>
			<nav>
				<Logo size={35} align="center" />
				{}

				{navs.map((n, i) => (
					<NavItem id={i} data={n} key={i} />
				))}

				{/* <div className="nav-logout">
					<IoPower /> Logout
				</div> */}
			</nav>

			<main>
				<Switch>
					<Route path="/m" exact component={() => <div>dash</div>} />
					<Route
						path="/m/projects"
						component={() => <ProjectsTab />}
					/>
					<Route path="/m/inbox" component={() => <div>inbox</div>} />
					<Route
						path="/m/settings"
						component={() => <div>settings</div>}
					/>
				</Switch>
			</main>
		</Main>
	);
};

const Main = styled.div`
	width: 100%;
	height: 100vh;
	position: relative;

	main,
	nav {
		height: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		transition: all 0.2s linear;
	}

	nav {
		left: 0;
		width: 220px;
		border-right: 2px solid #f0f0f0ce;

		.nav-item {
			height: 40px;
			display: flex;
			align-items: center;
			margin: 5px 5%;
			padding: 0 10px;
			border-radius: 10px;
			user-select: none;
			cursor: pointer;
			transition: all 0.2s linear;

			svg {
				margin-right: 9px;
				font-size: 18px;
			}
		}

		.nav-active {
			background: ${colors.primary};
			color: white;
			&:hover {
				background: ${colors.primaryDark};
			}
			&:active {
				background: ${colors.primaryDarker};
			}
			opacity: 1;
		}
		.nav-inactive {
			&:hover {
				background: ${colors.primaryLightest};
			}
			opacity: 0.8;
		}
		.logo {
			margin: 10px 0;
		}
	}
	main {
		right: 0;
		left: 220px;
		background: #f7f7f7;
	}

	@media (max-width: 740px) {
		nav {
			width: 70px;
			.nav-item {
				justify-content: center;
				margin: 5px 12%;
				height: 50px;
				span {
					display: none;
				}
				svg {
					margin-right: 0;
					font-size: 21px;
					opacity: 0.9;
				}
			}
			.logo {
				margin: 10px 0 20px;
			}
		}
		main {
			left: 70px;
		}
	}
`;

export default MainScreen;
