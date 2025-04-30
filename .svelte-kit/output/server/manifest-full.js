export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico"]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.HWP6r5Zx.js",app:"_app/immutable/entry/app.Ce4xd_MG.js",imports:["_app/immutable/entry/start.HWP6r5Zx.js","_app/immutable/chunks/BMc8ARJA.js","_app/immutable/chunks/D8Zr53n5.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/B51PyqUg.js","_app/immutable/chunks/DyX_nzx0.js","_app/immutable/entry/app.Ce4xd_MG.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/D8Zr53n5.js","_app/immutable/chunks/DIeogL5L.js","_app/immutable/chunks/UpSy6tP0.js","_app/immutable/chunks/CCLz0Z0F.js","_app/immutable/chunks/ByokzzJe.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BAqAra_5.js","_app/immutable/chunks/BM8m5GYV.js","_app/immutable/chunks/D0guHZRM.js","_app/immutable/chunks/CYIMW-vo.js","_app/immutable/chunks/B51PyqUg.js","_app/immutable/chunks/DyX_nzx0.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:true},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js')),
			__memo(() => import('./nodes/15.js')),
			__memo(() => import('./nodes/16.js')),
			__memo(() => import('./nodes/17.js')),
			__memo(() => import('./nodes/18.js')),
			__memo(() => import('./nodes/19.js')),
			__memo(() => import('./nodes/20.js')),
			__memo(() => import('./nodes/21.js')),
			__memo(() => import('./nodes/22.js')),
			__memo(() => import('./nodes/23.js')),
			__memo(() => import('./nodes/24.js')),
			__memo(() => import('./nodes/25.js')),
			__memo(() => import('./nodes/26.js')),
			__memo(() => import('./nodes/27.js')),
			__memo(() => import('./nodes/28.js')),
			__memo(() => import('./nodes/29.js')),
			__memo(() => import('./nodes/30.js')),
			__memo(() => import('./nodes/31.js')),
			__memo(() => import('./nodes/32.js')),
			__memo(() => import('./nodes/33.js')),
			__memo(() => import('./nodes/34.js')),
			__memo(() => import('./nodes/35.js')),
			__memo(() => import('./nodes/36.js')),
			__memo(() => import('./nodes/37.js')),
			__memo(() => import('./nodes/38.js')),
			__memo(() => import('./nodes/39.js')),
			__memo(() => import('./nodes/40.js')),
			__memo(() => import('./nodes/41.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin/courses",
				pattern: /^\/admin\/courses\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/admin/forums",
				pattern: /^\/admin\/forums\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/admin/forums/category/[id]/edit",
				pattern: /^\/admin\/forums\/category\/([^/]+?)\/edit\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/admin/forums/topic/[id]/edit",
				pattern: /^\/admin\/forums\/topic\/([^/]+?)\/edit\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/admin/users",
				pattern: /^\/admin\/users\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/api/activities",
				pattern: /^\/api\/activities\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/activities/_server.ts.js'))
			},
			{
				id: "/api/activities/end",
				pattern: /^\/api\/activities\/end\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/activities/end/_server.ts.js'))
			},
			{
				id: "/api/activities/event",
				pattern: /^\/api\/activities\/event\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/activities/event/_server.ts.js'))
			},
			{
				id: "/api/activities/recent",
				pattern: /^\/api\/activities\/recent\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/activities/recent/_server.ts.js'))
			},
			{
				id: "/api/activities/start",
				pattern: /^\/api\/activities\/start\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/activities/start/_server.ts.js'))
			},
			{
				id: "/api/csrf/init",
				pattern: /^\/api\/csrf\/init\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/csrf/init/_server.ts.js'))
			},
			{
				id: "/api/csrf/refresh",
				pattern: /^\/api\/csrf\/refresh\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/csrf/refresh/_server.ts.js'))
			},
			{
				id: "/api/forum/categories",
				pattern: /^\/api\/forum\/categories\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/forum/categories/_server.ts.js'))
			},
			{
				id: "/api/forum/categories/[id]",
				pattern: /^\/api\/forum\/categories\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/forum/categories/_id_/_server.ts.js'))
			},
			{
				id: "/api/forum/posts",
				pattern: /^\/api\/forum\/posts\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/forum/posts/_server.ts.js'))
			},
			{
				id: "/api/forum/topics",
				pattern: /^\/api\/forum\/topics\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/forum/topics/_server.ts.js'))
			},
			{
				id: "/api/forum/topics/[id]",
				pattern: /^\/api\/forum\/topics\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/forum/topics/_id_/_server.ts.js'))
			},
			{
				id: "/api/forum/topics/[id]/vote",
				pattern: /^\/api\/forum\/topics\/([^/]+?)\/vote\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/forum/topics/_id_/vote/_server.ts.js'))
			},
			{
				id: "/api/groups",
				pattern: /^\/api\/groups\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/groups/_server.ts.js'))
			},
			{
				id: "/api/groups/join",
				pattern: /^\/api\/groups\/join\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/groups/join/_server.ts.js'))
			},
			{
				id: "/api/groups/leave",
				pattern: /^\/api\/groups\/leave\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/groups/leave/_server.ts.js'))
			},
			{
				id: "/api/groups/[id]",
				pattern: /^\/api\/groups\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/groups/_id_/_server.ts.js'))
			},
			{
				id: "/api/recommendations",
				pattern: /^\/api\/recommendations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/recommendations/_server.ts.js'))
			},
			{
				id: "/api/score",
				pattern: /^\/api\/score\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/score/_server.ts.js'))
			},
			{
				id: "/calendar",
				pattern: /^\/calendar\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/category/[slug]",
				pattern: /^\/category\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/courses",
				pattern: /^\/courses\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/courses/[slug]",
				pattern: /^\/courses\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/courses/[slug]/[lessonId]",
				pattern: /^\/courses\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false},{"name":"lessonId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/events",
				pattern: /^\/events\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/exercises",
				pattern: /^\/exercises\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/exercises/[slug]",
				pattern: /^\/exercises\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/forums",
				pattern: /^\/forums\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/forums/category/[id]",
				pattern: /^\/forums\/category\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/forums/tag/[tag]",
				pattern: /^\/forums\/tag\/([^/]+?)\/?$/,
				params: [{"name":"tag","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/forums/topic/[id]",
				pattern: /^\/forums\/topic\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/groups",
				pattern: /^\/groups\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/groups/create",
				pattern: /^\/groups\/create\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/groups/[id]",
				pattern: /^\/groups\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/my-learning",
				pattern: /^\/my-learning\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/progress",
				pattern: /^\/progress\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 29 },
				endpoint: null
			},
			{
				id: "/reset-password",
				pattern: /^\/reset-password\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 30 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 31 },
				endpoint: null
			},
			{
				id: "/statistics",
				pattern: /^\/statistics\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 32 },
				endpoint: null
			},
			{
				id: "/tools",
				pattern: /^\/tools\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 33 },
				endpoint: null
			},
			{
				id: "/tools/calculator",
				pattern: /^\/tools\/calculator\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 34 },
				endpoint: null
			},
			{
				id: "/tools/chat",
				pattern: /^\/tools\/chat\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 35 },
				endpoint: null
			},
			{
				id: "/tools/dictionary",
				pattern: /^\/tools\/dictionary\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 36 },
				endpoint: null
			},
			{
				id: "/tools/flashcards",
				pattern: /^\/tools\/flashcards\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 37 },
				endpoint: null
			},
			{
				id: "/tools/notepad",
				pattern: /^\/tools\/notepad\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 38 },
				endpoint: null
			},
			{
				id: "/tools/pomodoro",
				pattern: /^\/tools\/pomodoro\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 39 },
				endpoint: null
			},
			{
				id: "/tools/tasks",
				pattern: /^\/tools\/tasks\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 40 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
