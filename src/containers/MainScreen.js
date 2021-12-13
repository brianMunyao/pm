import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
	IoAdd,
	IoChatbubbleEllipsesOutline,
	IoFileTrayFullOutline,
	IoGridOutline,
	IoPower,
	IoSettingsOutline,
} from 'react-icons/io5';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { useCookies } from 'react-cookie';

import Logo from '../components/Logo';
import colors from '../config/colors';
import ProjectsTab from './ProjectsTab';
import {
	maximizeNav,
	minimizeNav,
	closeProject,
	fetchData,
	openPModal,
	resetStore,
	updateChats,
} from '../store/actions';
import ProjectModal from '../components/ProjectModal';
import InboxTab from './InboxTab';
import AppToolTip from '../components/AppToolTip';
import DashTab from './DashTab';
import { isLoggedIn } from '../apis/users';
import SettingsTab from './SettingsTab';
import Loader from '../components/Loader';
import NavItem from '../components/NavItem';

const navs = [
	{ title: 'Dashboard', Icon: IoGridOutline, to: '/m' },
	{ title: 'Projects', Icon: IoFileTrayFullOutline, to: '/m/projects' },
	{ title: 'Inbox', Icon: IoChatbubbleEllipsesOutline, to: '/m/inbox' },
	{ title: 'Settings', Icon: IoSettingsOutline, to: '/m/settings' },
];

const MainScreen = ({
	appLoaded,
	fetchData,
	navMini,
	navLock,
	openedProject,
	maximizeNav,
	minimizeNav,
	closeProject,
	openPModal,
	resetStore,
	socket,
	updateChats,
}) => {
	const [activeNav, setActiveNav] = useState(0);
	const [cookies, removeCookie] = useCookies(['user']);

	const switchTabs = (id) => {
		if (id !== openedProject) {
			setActiveNav(id);
			if (openedProject) closeProject();
		}
	};

	const getWidth = useCallback(() => {
		if (!navLock) {
			if (window.innerWidth < 740 && !navMini) minimizeNav();
			else if (window.innerWidth > 740 && navMini) maximizeNav();
		}
	}, [maximizeNav, minimizeNav, navMini, navLock]);

	const logout = () => {
		removeCookie('user');
		resetStore();
	};

	const location = useLocation();
	useEffect(() => {
		if (isLoggedIn(cookies)) {
			getWidth();
			setActiveNav(navs.findIndex(({ to }) => to === location.pathname));
			window.addEventListener('resize', getWidth);
			if (!appLoaded) fetchData(cookies.user._id);

			if (socket) {
				socket.on('newchats', (res) => {
					console.log('newchats');
					if (res.data) {
						updateChats(res.p_id, res.data);
					} else {
						console.log(res.error);
					}
				});
			}
		}
	}, [
		location,
		getWidth,
		appLoaded,
		fetchData,
		cookies,
		socket,
		updateChats,
	]);

	if (!isLoggedIn(cookies)) return <Redirect to="/login" />;

	if (!appLoaded) return <Loader />;

	return (
		<Main navMini={navMini}>
			<nav>
				<div>
					<Logo size={35} align="center" />

					<NavItem
						_class="add-project"
						data={{ Icon: IoAdd, title: 'Create Project' }}
						onClick={openPModal}
					/>

					{navs.map((n, i) => (
						<NavItem
							id={i}
							data={n}
							key={i}
							activeNav={activeNav}
							switchTabs={switchTabs}
						/>
					))}
				</div>

				<div className="nav-logout">
					<NavItem
						_class="logout"
						data={{ Icon: IoPower, title: 'Logout' }}
						onClick={logout}
					/>
				</div>
			</nav>

			<main>
				<Switch>
					<Route path="/m" exact component={() => <DashTab />} />
					<Route
						path="/m/projects"
						component={() => <ProjectsTab />}
					/>
					<Route path="/m/inbox" component={() => <InboxTab />} />
					<Route
						path="/m/settings"
						component={() => <SettingsTab />}
					/>
				</Switch>
			</main>

			<ProjectModal />
		</Main>
	);
};

const Main = styled.div`
	width: 100%;
	height: 100vh;
	min-height: 400px;
	position: relative;

	main,
	nav {
		height: 100%;
		position: absolute;
		top: 0;
		bottom: 0;
		transition: all 0.1s linear;
	}

	nav {
		left: 0;
		width: ${({ navMini }) => (navMini ? '70px' : '200px')};
		border-right: 2px solid #f0f0f0ce;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: 30px;

		.nav-item {
			height: ${({ navMini }) => (navMini ? '50px' : '40px')};
			display: flex;
			justify-content: ${({ navMini }) => navMini && 'center'};
			align-items: center;
			margin: ${({ navMini }) => (navMini ? '5px 12%' : '5px 5%')};
			padding: 0 10px;
			border-radius: 10px;
			user-select: none;
			cursor: pointer;
			transition: all 0.2s linear;
			span {
				display: ${({ navMini }) => (navMini ? 'none' : 'block')};
			}

			svg {
				margin-right: ${({ navMini }) => !navMini && '9px'};
				font-size: ${({ navMini }) => (navMini ? '21px' : '18px')};
				opacity: ${({ navMini }) => navMini && 0.9};
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

		.nav-item.logout {
			background: ${colors.errorLight};
			color: ${colors.error};
			&:hover {
				color: white;
				background: ${colors.error};
			}
		}
		.nav-item.add-project {
			margin-bottom: 30px;
			background: ${colors.secondaryLight};
			color: ${colors.secondaryGreen};
			&:hover {
				color: white;
				background: ${colors.secondaryBlue};
			}
		}

		.logo {
			margin: ${({ navMini }) => (navMini ? '10px 0 20px' : '10px 0')};
		}
	}
	main {
		right: 0;
		left: ${({ navMini }) => (navMini ? '70px' : '200px')};
		background: #f7f7f7;
	}
`;

const mapStateToProps = ({
	navMini,
	navLock,
	openedProject,
	socket,
	appLoaded,
}) => ({
	navMini,
	navLock,
	openedProject,
	appLoaded,
	socket,
});

export default connect(mapStateToProps, {
	minimizeNav,
	maximizeNav,
	closeProject,
	fetchData,
	openPModal,
	resetStore,
	updateChats,
})(MainScreen);
