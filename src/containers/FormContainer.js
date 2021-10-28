import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import FormItem from '../components/FormItem';
import colors from '../config/colors';
import Logo from '../components/Logo';

const FormContainer = ({
	title,
	btnText,
	submitting,
	formError,
	children,
	onSubmit,
}) => {
	return (
		<Container>
			<FormNav>
				<Logo link size={40} />
				<FormSwitch>
					{btnText.toLowerCase() === 'login' ? (
						<>
							Don't have an account?{' '}
							<Link to="/signup">Sign Up</Link>
						</>
					) : (
						<>
							Already have an account?{' '}
							<Link to="/login">Login</Link>
						</>
					)}
				</FormSwitch>
			</FormNav>

			<FormParent>
				<form onSubmit={onSubmit}>
					<FormInner>
						<FormTitle>{title}</FormTitle>
						<FormError>{formError}</FormError>
						{children}
						<FormItem
							disabled={submitting}
							inputType="submit"
							label={btnText}
						/>
					</FormInner>
				</form>
			</FormParent>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	height: 100vh;
	min-height: 450px;
	display: flex;
	flex-direction: column;
`;

const FormParent = styled.div`
	width: 100%;
	background: rgb(255, 255, 255);
	overflow: auto;
	align-items: center;
	justify-content: center;
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const FormNav = styled.div`
	width: 100%;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
`;

const FormInner = styled.div`
	width: 340px;
`;

const FormTitle = styled.h2`
	padding: 5px 20px;
	text-align: center;
`;

const FormSwitch = styled.div`
	font-size: 15px;
	a {
		color: ${colors.primary};
		&:hover {
			text-decoration: underline;
		}
	}
`;
const FormError = styled.p`
	color: ${colors.error};
	text-align: center;
	font-size: 14px;
`;

export default FormContainer;
