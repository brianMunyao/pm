import React, { useState } from 'react';
import styled from 'styled-components';
import Lottie from 'react-lottie';
import { IoEye, IoEyeOff } from 'react-icons/io5';

import colors from '../config/colors';
import animation from '../assets/circle_loader.json';

const FormItemAlt = ({
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
	onChange,
	onBlur,
}) => {
	const [visible, setVisible] = useState(false);
	if (inputType === 'submit') {
		return (
			<FormButton type="submit" disabled={disabled}>
				{disabled ? (
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
			<FormInput icon={Icon} width={width}>
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
			<FormInput width={width} textarea>
				<label htmlFor={id}>{label}</label>
				<div className="textarea">
					<textarea
						name={id}
						id={id}
						value={value}
						placeholder={placeholder ? placeholder : label}
						onChange={onChange}
						onBlur={onBlur}></textarea>
				</div>
				<p>{error}</p>
			</FormInput>
		);
	} else {
		return (
			<FormInput icon={Icon} width={width}>
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
	width: ${(props) => (props.width ? props.width : '100%')};
	height: ${(props) => (props.textarea ? '82px' : '75px')};
	margin: 4px 0;
	overflow: hidden;
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: 18px 1fr 15px;

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
	font-size: 15px;
	margin: 5px 0;
	height: 35px;
	width: 100%;
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
		cursor: not-allowed;
	}
`;

export default FormItemAlt;
