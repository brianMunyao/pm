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