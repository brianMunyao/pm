import moment from 'moment';
import colors from '../config/colors';
import { randomColors } from './constants';

export const getColor = (color) => colors[color];
export const getLightColor = (color) => colors[`${color}Light`];

export const ourColors = [
	'green',
	'deepOrange',
	'brown',
	'greyBlue',
	'amber',
	'teal',
	'pink',
	'deepPurple',
	'red',
	'orange',
	// 'indigo',
	// 'blue',
	// 'purple',
	// 'lightGreen',
	// 'lime',
];

export const projectTypes = [
	'Web App',
	'Mobile App',
	'IoT',
	'Blockchain',
	'Finance',
];

export const getByID = (id = 0, list = []) => {
	return list.filter((l) => l.id === id)[0] || null;
};

export const addEllipsis = (num, word) => {
	return word.length > num ? word.substring(0, num - 2) + '..' : word;
};

export const filterByDate = (arr, mode, date) => {
	if (mode === 'none') return arr;

	return arr.filter((i) => moment(i.date).isSame(moment(date), mode));
};

export const getUniqueDates = (arr) => {
	const _arr = [],
		_arrRaw = [];

	for (let i = 0; i < arr.length; i++) {
		const foundItem = moment(arr[i].due_date).format('DD-MM-YYYY');

		if (!_arr.includes(foundItem)) {
			_arr.push(foundItem);
			_arrRaw.push(arr[i].due_date);
		}
	}
	return _arrRaw;
};

export const getDatedTransactions = (arr) => {
	const finalArr = [];
	let uniqueDates = getUniqueDates(arr);

	uniqueDates = uniqueDates.sort((a, b) => moment(a).diff(b));

	for (let i = 0; i < uniqueDates.length; i++) {
		finalArr.push({
			date: uniqueDates[i],
			data: arr.filter((item) =>
				moment(item.due_date).isSame(uniqueDates[i], 'date')
			),
		});
	}
	return finalArr;
};

export const getProgress = (tasks, num) => {
	const progress =
		Math.floor(
			(tasks.filter((t) => t.status === 2).length / tasks.length) * 100 //!CHANGE THIS
		) || 0;
	return num ? progress === 100 : progress + '%';
};

export const getRandomColor = () => {
	const rand = Math.floor(Math.random() * randomColors.length);
	return randomColors[rand];
	// map(
	// (t, i) =>
	// 	!data.tags.includes(t) && (
	// 		<li key={i} onClick={() => handleNewTag(t)}>
	// 			{t}
	// 		</li>
	// 	)
	// )}
};
