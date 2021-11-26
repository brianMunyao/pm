import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoLockClosed, IoPerson } from 'react-icons/io5';

import { isLoggedIn } from '../apis/users';
import FormItem from '../components/FormItem';
import FormContainer from './FormContainer';
import { loginUser } from '../store/actions';

const LoginScreen = () => {
	const [formError, setFormError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [cookies, setCookie] = useCookies(['user']);

	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validationSchema: Yup.object({
			email: Yup.string().required('Email is required'),
			password: Yup.string().required('Password is required'),
		}),
		onSubmit: async (values) => {
			setSubmitting(true);
			setFormError('');
			try {
				const res = await loginUser(values);
				if (res.data) {
					setCookie('user', res.data);
				} else {
					setFormError(res.error);
					setSubmitting(false);
				}
			} catch (e) {
				setFormError('Submittion error.');
				setSubmitting(false);
			}
		},
	});

	if (isLoggedIn(cookies)) return <Redirect to="/" />;

	return (
		<FormContainer
			submitting={submitting}
			btnText="Login"
			title="Login"
			formError={formError}
			onSubmit={formik.handleSubmit}>
			<FormItem
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
				value={formik.values.password}
				error={formik.errors.password}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
			/>
		</FormContainer>
	);
};

export default LoginScreen;
