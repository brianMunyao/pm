import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoChevronForward, IoLockClosed, IoPerson } from 'react-icons/io5';
import { Link, Route, Switch } from 'react-router-dom';

import UserIcon from '../components/UserIcon';
import FormItem from '../components/FormItem';
import colors from '../config/colors';
import { updateUser } from '../store/actions';

const SettingsTab = () => {
	const [formError, setFormError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [changed, setChanged] = useState(false);
	const [selTab, setSelTab] = useState(0);
	const [cookies, setCookie] = useCookies(['user']);

	const [fName, setFName] = useState(cookies.user.fullname);
	const [pass, setPass] = useState('');

	// const [user, setUser] = useState({ fullname: cookies.user.fullname });

	const formik = useFormik({
		initialValues: {
			fullname: cookies.user.fullname,
			email: cookies.user.email,
			password: '',
		},
		validationSchema: Yup.object({
			fullname: Yup.string().min(
				4,
				'Fullname must be more than 3 characters'
			),
			email: Yup.string().required('Email is required'),
			password: Yup.string().min(
				8,
				'Password must be more than 8 characters'
			),
		}),
		onSubmit: async (values) => {
			setSubmitting(true);
			setFormError('');
			try {
				const obj = {};
				if (values.fullname !== cookies.user.fullname) {
					obj['fullname'] = values.fullname;
				}
				if (values.password.length > 0) {
					obj['password'] = values.password;
				}

				setCookie('user', { ...cookies.user, ...obj }); //!CHANGE THIS
				// setCookie('user', values);
				// const res = await loginUser({
				// 	...values,
				// 	password: encrypt(values.password),
				// });
				// if (res.data) {
				// 	setCookie('user', res.data);
				// } else {
				// 	setFormError(res.error);
				// 	setSubmitting(false);
				// }
			} catch (e) {
				setFormError('Submittion error.');
				setSubmitting(false);
			}
		},
	});

	const handleSubmit = async () => {
		setSubmitting(true);
		setFormError('');
		try {
			const obj = {};
			if (fName !== cookies.user.fullname) {
				obj['fullname'] = fName;
			}
			if (pass.length >= 8) {
				obj['password'] = pass;
			}

			const res = await updateUser(cookies.user._id, obj);
			if (res.data) {
				setCookie('user', res.data);
			} else {
				setFormError(res.error);
			}
			setSubmitting(false);
			// setCookie('user', { ...cookies.user, ...obj }); //!CHANGE THIS
		} catch (e) {
			setFormError('Submittion error.');
			setSubmitting(false);
		}
	};

	useEffect(() => {
		// const { fullname, password } = formik.values;
		if (cookies.user.fullname !== fName || pass.length > 0) {
			setChanged(true);
		} else {
			setChanged(false);
		}
	}, [cookies.user, fName, pass.length]);

	return (
		<Container>
			<div className="st-main">
				<div className="st-profile">
					<UserIcon name={cookies.user.fullname} size={140} rounded />

					<p className="error">{formError}</p>

					<FormItem
						id="fullname"
						Icon={IoPerson}
						inputType="text"
						label="Fullname"
						value={fName}
						onChange={(v) => setFName(v.target.value)}
						// error={formik.errors.fullname}
						// onChange={formik.handleChange}
						// onBlur={formik.handleBlur}
					/>
					<FormItem
						disabled
						id="email"
						Icon={IoPerson}
						inputType="text"
						label="Email Address"
						value={cookies.user.email}
						// error={formik.errors.email}
						// onChange={formik.handleChange}
						// onBlur={formik.handleBlur}
					/>
					<FormItem
						id="password"
						Icon={IoLockClosed}
						inputType="password"
						label="Password"
						placeholder="Enter New Password"
						value={pass}
						onChange={(v) => setPass(v.target.value)}
						// value={formik.values.password}
						// error={formik.errors.password}
						// onChange={formik.handleChange}
						// onBlur={formik.handleBlur}
					/>

					<FormItem
						width="200px"
						submitting={submitting}
						disabled={!changed}
						inputType="submit"
						label="Save Changes"
						onClick={handleSubmit}
					/>
				</div>
			</div>
			{/* <div className="st-sidebar">
				{[{ to: '/m/settings', title: 'Edit profile' }].map((v, i) => (
					<Link to={v.to}>
						<SelTab active={selTab === i} key={i}>
							<span>{v.title}</span>
							<span>{selTab === i && <IoChevronForward />}</span>
						</SelTab>
					</Link>
				))}
			</div>
			<div className="st-main">
				<Switch>
					<Route
						path="/m/settings"
						component={() => (
							<>
								<form onSubmit={formik.handleSubmit}>
									<div className="st-profile">
										<UserIcon
											name={cookies.user.fullname}
											size={140}
											rounded
										/>

										<FormItem
											id="fullname"
											Icon={IoPerson}
											inputType="text"
											label="Fullname"
											value={formik.values.fullname}
											error={formik.errors.fullname}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										<FormItem
											disabled
											id="email"
											Icon={IoPerson}
											inputType="text"
											label="Email Address"
											value={formik.values.email}
											error={formik.errors.email}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>
										<FormItem
											id="password"
											Icon={IoLockClosed}
											inputType="password"
											label="Password"
											placeholder="Enter New Password"
											value={formik.values.password}
											error={formik.errors.password}
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
										/>

										<FormItem
											width="200px"
											submitting={submitting}
											disabled={!changed}
											inputType="submit"
											label="Save Changes"
										/>
									</div>
								</form>

								<FormItem
									id="password"
									Icon={IoLockClosed}
									inputType="password"
									label="Password"
									placeholder="Enter New Password"
									// value={formik.values.password}
									// error={formik.errors.password}
									// onChange={formik.handleChange}
									// onBlur={formik.handleBlur}
								/>
							</>
						)}
					/>
				</Switch>
			</div> */}
		</Container>
	);
};

const Container = styled.div`
	overflow: hidden;
	display: flex;
	flex-flow: row;
	height: 100%;
	.error {
		color: ${colors.error};
	}

	.st-sidebar,
	.st-main {
		height: 100%;
	}
	.st-sidebar {
		width: 150px;
		background: white;
		border-right: 1px solid #f0f0f0ce;
		padding: 20px 5px;
	}
	.st-main {
		background: #fefefe;
		flex: 1;
		overflow-y: auto;

		.st-profile {
			max-width: 600px;
			margin: 0 auto;
			padding: 30px;
			display: flex;
			flex-direction: column;
			align-items: center;
			& > * {
				margin: 10px 0;
			}
		}
	}
`;

const SelTab = styled.div`
	background: ${colors.secondaryLight};
	color: ${colors.secondaryGreen};
	padding: 6px 10px;
	opacity: 0.9;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	&:hover {
		opacity: 1;
	}
`;

export default SettingsTab;
