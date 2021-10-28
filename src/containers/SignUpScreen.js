import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { IoLockClosed, IoMail, IoPerson } from 'react-icons/io5';

import { isLoggedIn } from '../apis/users';
import FormItem from '../components/FormItem';
import FormContainer from './FormContainer';

const SignUpScreen = () => {
	const [formError, setFormError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [cookies, setCookie] = useCookies(['user']);

	const formik = useFormik({
		initialValues: {
			fullname: '',
			email: '',
			password: '',
		},
		validationSchema: Yup.object({
			fullname: Yup.string()
				.min(4, 'Fullname must be more than 3 characters')
				.required('Fullname is required'),
			email: Yup.string()
				.email('Enter a valid email')
				.required('Email is required'),
			password: Yup.string()
				.min(8, 'Password must be more than 8 characters')
				.required('Password is required'),
		}),
		onSubmit: async (values) => {
			setSubmitting(true);
			setFormError('');
			try {
				setCookie('user', values);
				// const res = await registerUser({
				// 	...values,
				// 	password: encrypt(values.password),
				// });
				// if (res.data) {
				// 	setCookie('user', res.data);
				// } else {
				// 	setFormError(res.error);
				// setSubmitting(false);
				// }
			} catch (e) {
				setFormError('Submittion error. Try again later.');
				setSubmitting(false);
			}
		},
	});

	if (isLoggedIn(cookies)) return <Redirect to="/" />;

	return (
		<FormContainer
			submitting={submitting}
			title="Create Account"
			btnText="Register"
			formError={formError}
			onSubmit={formik.handleSubmit}>
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
				id="email"
				Icon={IoMail}
				inputType="email"
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

export default SignUpScreen;
