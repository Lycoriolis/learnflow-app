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
	() => import('./nodes/22')
];

export const server_loads = [];

export const dictionary = {
		"/": [4],
		"/admin": [5,[3]],
		"/admin/courses": [6,[3]],
		"/admin/courses/new": [8,[3]],
		"/admin/courses/[courseId]": [7,[3]],
		"/admin/settings": [9,[3]],
		"/admin/statistics": [10,[3]],
		"/admin/users": [11,[3]],
		"/admin/users/new": [12,[3]],
		"/category/[slug]": [13],
		"/courses": [14],
		"/courses/[courseId]": [15],
		"/exercises": [16],
		"/login": [17],
		"/progress": [18],
		"/register": [19],
		"/reset-password": [20],
		"/settings": [21],
		"/statistics": [22]
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