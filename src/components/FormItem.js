import React, { useState } from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import { IoEye, IoEyeOff } from 'react-icons/io5';

import colors from '../config/colors';
import animation from '../assets/circle_loader.json';

const FormItem = ({
	width,
	id,
	Icon,
	inputType,
	label,
	list,
	textarea,
	placeholder,
	value,
	error,
	disabled,
	submitting,
	onChange,
	onClick,
	onBlur,
}) => {
	const [visible, setVisible] = useState(false);
	if (inputType === 'submit') {
		return (
			<FormButton
				type={onClick ? 'button' : 'submit'}
				width={width}
				submitting={submitting}
				disabled={disabled || submitting}
				onClick={onClick}>
				{submitting ? (
					<Lottie
						isClickToPauseDisabled={true}
						options={{
							loop: true,
							autoplay: true,
							animationData: animation,
						}}
						height={25}
					/>
				) : (
					label
				)}
			</FormButton>
		);
	} else if (list) {
		return (
			<FormInput icon={Icon} width={width} disabled={disabled}>
				<label htmlFor={id}>{label}</label>
				<div>
					<span className="icon">{Icon && <Icon />}</span>
					<input
						name={id}
						list={id}
						value={value}
						placeholder={placeholder ? placeholder : label}
						onChange={onChange}
						onBlur={onBlur}
						disabled={disabled}
					/>
					<datalist id={id}>
						{list.map((val, i) => (
							<option value={val} key={i} />
						))}
					</datalist>
				</div>
				<p>{error}</p>
			</FormInput>
		);
	} else if (textarea) {
		return (
			<FormInput width={width} textarea disabled={disabled}>
				<label htmlFor={id}>{label}</label>
				<div className="textarea">
					<textarea
						name={id}
						id={id}
						value={value}
						placeholder={placeholder ? placeholder : label}
						onChange={onChange}
						onBlur={onBlur}
						disabled={disabled}></textarea>
				</div>
				<p>{error}</p>
			</FormInput>
		);
	} else {
		return (
			<FormInput icon={Icon} width={width} disabled={disabled}>
				<label htmlFor={id}>{label}</label>
				<div>
					<span className="icon">{Icon && <Icon />}</span>
					<input
						id={id}
						name={id}
						type={
							inputType === 'password'
								? visible
									? 'text'
									: inputType
								: inputType || 'text'
						}
						min={0}
						value={value}
						placeholder={placeholder ? placeholder : label}
						onChange={onChange}
						onBlur={onBlur}
						disabled={disabled}
					/>

					{inputType === 'password' && (
						<span
							className="see"
							onClick={() => setVisible(!visible)}>
							{visible ? <IoEye /> : <IoEyeOff />}
						</span>
					)}
				</div>
				<p>{error}</p>
			</FormInput>
		);
	}
};

const FormInput = styled.div`
	width: ${({ width }) => (width ? width : '100%')};
	height: ${({ textarea }) => (textarea ? '82px' : '75px')};
	margin: 4px 0;
	overflow: hidden;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 18px 1fr 15px;
	opacity: ${({ disabled }) => disabled && 0.8};
	* {
		cursor: ${({ disabled }) => disabled && 'not-allowed'};
	}

	label {
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0.1px;
		transform: translateX(10px);
		color: #585858;
	}
	div {
		position: relative;
		overflow: hidden;
		span.icon svg {
			opacity: 0.6;
			position: absolute;
			z-index: 1;
			top: 50%;
			transform: translate(10px, -50%);
			pointer-events: none;
		}
		input,
		textarea {
			width: 100%;
			height: 100%;
			border-radius: 10px;
			font-size: 14px;
			transition: all 0.1s linear;
			border: 1.5px solid rgb(246, 246, 246);
			background: rgb(246, 246, 246);
			&:focus {
				border: 1.5px solid ${colors.primaryLighter};
			}
		}
		input {
			padding: ${({ icon }) => (icon ? '0 10px 0 32px' : '0 10px 0')};
		}
		textarea {
			padding: 3px 10px;
		}
		span.see {
			position: absolute;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
			z-index: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 8px;
			font-size: 17px;
			opacity: 0.6;
			cursor: pointer;
		}
	}
	p {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.1px;
		color: ${colors.error};
		text-align: right;
	}
`;

const FormButton = styled.button`
	width: ${({ width }) => (width ? width : '100%')};
	font-size: 15px;
	margin: 5px 0;
	height: 35px;
	cursor: pointer;
	background: ${colors.primary};
	color: rgb(240, 240, 240);
	transition: all 0.1s linear;
	border-radius: 8px;
	border: none;
	&:hover {
		background: ${colors.primaryDark};
	}
	&:active {
		background: ${colors.primaryDarker};
	}
	&:disabled {
		background: ${colors.primaryLight};
		opacity: 0.7;
		cursor: not-allowed;
	}
`;

export default FormItem;
