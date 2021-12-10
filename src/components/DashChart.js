import React from 'react';
import { Cell, Legend, PieChart, Pie } from 'recharts';
import styled from 'styled-components';

const DashChart = ({ data }) => {
	return (
		<Container>
			<PieChart width={250} height={250}>
				<Pie
					paddingAngle={3}
					cornerRadius={5}
					data={data}
					cx="50%"
					cy="50%"
					innerRadius={40}
					startAngle={0}
					endAngle={180}
					label>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
				</Pie>
				<Legend
					payload={data.map((item) => ({
						...item,
						value: item.name,
					}))}
					wrapperStyle={{ position: 'relative', marginTop: -80 }}
				/>
			</PieChart>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	opacity: 0.8;
`;

export default DashChart;
