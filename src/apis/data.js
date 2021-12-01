export const projects = [
	{
		id: 1,
		title: 'Freedom',
		type: 'Mobile App',
		chats: 12,
		color: 'purple',
		members: [3],
		due_date: 'Thu Oct 1 2021 14:17:23 GMT+0300',
		tags: [],
	},
	{
		id: 2,
		title: 'Apparent',
		type: 'Web App',
		chats: 3,
		color: 'orange',
		members: [1, 2, 3],
		due_date: 'Thu Oct 2 2021 14:17:23 GMT+0300',
		tags: [],
	},
	{
		id: 3,
		title: 'Notera',
		type: 'Mobile App',
		chats: 0,
		color: 'deepOrange',
		members: [1, 2],
		due_date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
		tags: [],
	},
	{
		id: 4,
		title: 'StayKE',
		type: 'Web App',
		chats: 7,
		color: 'brown',
		members: [2, 7, 8, 3],
		due_date: 'Thu Oct 19 2021 14:17:23 GMT+0300',
		tags: [],
	},
];

export const tasks = [
	{
		_id: 1,
		title: 'Make site responsive',
		status: 0,
		due_date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
		project_id: 2,
		assigned: null,
		tags: [],

		// start: new Date(2020, 1, 2),
		// end: new Date(2020, 1, 2),
		// name: 'Antoh',
		type: 'task',

		start_date: 'Thu Oct 23 2021 14:17:23 GMT+0300',
		duration: 2,
		// text: 'Some text',
	},
	{
		_id: 2,
		title: 'Creating a responsive version of the site',
		status: 1,
		due_date: 'Thu Oct 22 2021 14:17:23 GMT+0300',
		project_id: 2,
		assigned: null,
		tags: [],

		// start: new Date(2020, 1, 2),
		// end: new Date(2020, 1, 2),
		// name: 'Antoh',
		type: 'task',

		start_date: 'Thu Oct 24 2021 14:17:23 GMT+0300',
		duration: 2,
		// text: 'Some text',
	},
	{
		_id: 4,
		title: 'todo3',
		status: 2,
		due_date: 'Thu Oct 27 2021 14:17:23 GMT+0300',
		project_id: 2,
		assigned: null,
		tags: [],

		// start: new Date(2020, 1, 2),
		// end: new Date(2020, 1, 2),
		// name: 'Antoh',
		type: 'task',

		start_date: 'Thu Oct 28 2021 14:17:23 GMT+0300',
		duration: 2,
		// text: 'Some text',
	},
	{
		_id: 5,
		title: 'todo3',
		status: 2,
		due_date: 'Thu Oct 29 2021 14:17:23 GMT+0300',
		project_id: 2,
		assigned: null,
		tags: [],

		// start: new Date(2020, 1, 2),
		// end: new Date(2020, 1, 2),
		// name: 'Antoh',
		type: 'task',

		start_date: 'Thu Oct 30 2021 14:17:23 GMT+0300',
		duration: 2,
		// text: 'Some text',
	},
	{
		_id: 6,
		title: 'todo3',
		status: 2,
		due_date: 'Thu Oct 23 2021 14:17:23 GMT+0300',
		project_id: 2,
		assigned: null,
		tags: [],

		// start: new Date(2020, 1, 2),
		// end: new Date(2020, 1, 2),
		// name: 'Antoh',
		type: 'task',

		start_date: 'Thu Oct 31 2021 14:17:23 GMT+0300',
		duration: 2,
		// text: 'Some text',
	},
];

export const chats = [
	{
		id: 1,
		text: 'Hello 1',
		name: 'brian',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
	{
		id: 2,
		text: 'Hello you 2',
		name: 'brian',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
	{
		id: 3,
		text: 'Hello 3',
		name: 'brian',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
	{
		id: 4,
		text: '4 Lorem ipsum for an an ipsum for an an',
		name: 'me',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
	{
		id: 5,
		text: 'Hello 5',
		name: 'me',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
	{
		id: 6,
		text: 'Hello 6',
		name: 'Joe',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
	{
		id: 7,
		text: 'Hello 7',
		name: 'brian',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
	{
		id: 8,
		text: 'Hello 8',
		name: 'Leat',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
	{
		id: 9,
		text: 'Hello 9',
		name: 'brian',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
	{
		id: 10,
		text: 'Lorem ipsum for an an ipsum for an an ipsum for an an ipsum for an an',
		name: 'Leat',
		date: 'Thu Oct 21 2021 14:17:23 GMT+0300',
	},
];

export const users = [
	{ id: 1, fullname: 'Random1', email: 'email.gmail.com' },
	{ id: 2, fullname: 'Another Ra', email: 'email.gmail.com' },
	{ id: 3, fullname: 'Brian', email: 'email.gmail.com' },
	{ id: 4, fullname: 'Someone', email: 'email.gmail.com' },
	{ id: 5, fullname: 'Jugjug', email: 'email.gmail.com' },
	{ id: 6, fullname: 'Book', email: 'email.gmail.com' },
	{ id: 7, fullname: 'Laptop', email: 'email.gmail.com' },
	{ id: 8, fullname: 'me', email: 'email.gmail.com' },
];
