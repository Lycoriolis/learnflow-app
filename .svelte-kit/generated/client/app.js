export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25'),
	() => import('./nodes/26'),
	() => import('./nodes/27')
];

export const server_loads = [];

export const dictionary = {
		"/": [3],
		"/calendar": [4],
		"/category/[slug]": [5],
		"/courses": [6],
		"/courses/[courseId]": [7],
		"/courses/[courseId]/lesson/[lessonId]": [8],
		"/events": [9],
		"/exercises": [10],
		"/exercises/[id]": [11],
		"/forums": [~12],
		"/forums/topic/[id]": [~13],
		"/groups": [14],
		"/help": [15],
		"/login": [16],
		"/my-learning": [17],
		"/progress": [18],
		"/register": [19],
		"/reset-password": [20],
		"/settings": [21],
		"/statistics": [22],
		"/tools": [23],
		"/tools/chat": [24],
		"/tools/notepad": [25],
		"/tools/pomodoro": [26],
		"/tools/tasks": [27]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';