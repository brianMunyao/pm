import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AppToolTip from './AppToolTip';

const NavItem = ({
	id,
	data: { title, Icon, to },
	onClick,
	_class,
	navMini,
	activeNav,
	switchTabs,
}) => {
	if (_class) {
		const c = `nav-item ${_class}`;
		return (
			<div>
				{navMini ? (
					<AppToolTip title={title}>
						<div className={c} onClick={onClick}>
							<Icon />
							<span>{title}</span>
						</div>
					</AppToolTip>
				) : (
					<div className={c} onClick={onClick}>
						<Icon />
						<span>{title}</span>
					</div>
				)}
			</div>
		);
	}

	return (
		<Link to={to}>
			{navMini ? (
				<AppToolTip title={title}>
					<div
						className={`nav-item ${
							id === activeNav ? 'nav-active' : 'nav-inactive'
						}`}
						onClick={() => switchTabs(id)}>
						<Icon />
						<span>{title}</span>
					</div>
				</AppToolTip>
			) : (
				<div
					className={`nav-item ${
						id === activeNav ? 'nav-active' : 'nav-inactive'
					}`}
					onClick={() => switchTabs(id)}>
					<Icon />
					<span>{title}</span>
				</div>
			)}
		</Link>
	);
};

const mapStateToProps = ({ navMini }) => ({ navMini });

export default connect(mapStateToProps, {})(NavItem);
