import moment from 'moment';
import colors from '../config/colors';

export const getColor = (color) => colors[color];
export const getLightColor = (color) => colors[`${color}Light`];

export const ourColors = [
    'green',
    'orange',
    'deepOrange',
    'brown',
    'greyBlue',
    'amber',
    'teal',
    // 'deepPurple',
    // 'pink',
    // 'red',
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