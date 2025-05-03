var l=(e,t,n)=>new Promise((a,s)=>{var r=c=>{try{o(n.next(c))}catch(u){s(u)}},i=c=>{try{o(n.throw(c))}catch(u){s(u)}},o=c=>c.done?a(c.value):Promise.resolve(c.value).then(r,i);o((n=n.apply(e,t)).next())});import{r as k,_ as C,C as R,k as O,E as pe,m as $e,F as ge,L as Ve,n as he,p as Be,t as ze,v as Ge,x as Z,y as We,z as Ke,A as He,B as Ye,a as Qe,g as me,ad as Je,ae as Xe,af as Ze,ag as et,ah as tt,ai as nt,aj as at,ak as st,i as rt,al as it,am as ot,G as ct,H as lt,I as ut,J as dt,K as ft,M as pt,N as gt,O as ht,P as mt,Q as wt,R as yt,S as It,U as bt,V as Tt,W as At,X as vt,Y as _t,Z as Pt,$ as Et,T as St,a0 as kt,a1 as Ct,a2 as Rt,a3 as Dt,a4 as Ft,a5 as Ot,a6 as Mt,a7 as Nt,a8 as Lt,a9 as xt,f as jt,c as qt,aa as Ut,h as $t,d as Vt,ab as Bt,ac as zt,e as Gt,b as Wt,j as Kt,l as Ht,o as Yt,q as Qt,s as Jt,u as Xt,w as Zt}from"./D8i9UXqZ.js";import{w as _,d as en}from"./CToUoAZH.js";import{_ as P}from"./Dp1pzeXC.js";var tn="firebase",nn="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */k(tn,nn,"app");const we="@firebase/installations",z="0.6.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ye=1e4,Ie=`w:${z}`,be="FIS_v2",an="https://firebaseinstallations.googleapis.com/v1",sn=60*60*1e3,rn="installations",on="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},A=new pe(rn,on,cn);function Te(e){return e instanceof ge&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ae({projectId:e}){return`${an}/projects/${e}/installations`}function ve(e){return{token:e.token,requestStatus:2,expiresIn:un(e.expiresIn),creationTime:Date.now()}}function _e(e,t){return l(this,null,function*(){const a=(yield t.json()).error;return A.create("request-failed",{requestName:e,serverCode:a.code,serverMessage:a.message,serverStatus:a.status})})}function Pe({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function ln(e,{refreshToken:t}){const n=Pe(e);return n.append("Authorization",dn(t)),n}function Ee(e){return l(this,null,function*(){const t=yield e();return t.status>=500&&t.status<600?e():t})}function un(e){return Number(e.replace("s","000"))}function dn(e){return`${be} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fn(a,s){return l(this,arguments,function*({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const r=Ae(e),i=Pe(e),o=t.getImmediate({optional:!0});if(o){const d=yield o.getHeartbeatsHeader();d&&i.append("x-firebase-client",d)}const c={fid:n,authVersion:be,appId:e.appId,sdkVersion:Ie},u={method:"POST",headers:i,body:JSON.stringify(c)},f=yield Ee(()=>fetch(r,u));if(f.ok){const d=yield f.json();return{fid:d.fid||n,registrationStatus:2,refreshToken:d.refreshToken,authToken:ve(d.authToken)}}else throw yield _e("Create Installation",f)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pn(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gn=/^[cdef][\w-]{21}$/,V="";function hn(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=mn(e);return gn.test(n)?n:V}catch(e){return V}}function mn(e){return pn(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ke=new Map;function Ce(e,t){const n=M(e);Re(n,t),wn(n,t)}function Re(e,t){const n=ke.get(e);if(n)for(const a of n)a(t)}function wn(e,t){const n=yn();n&&n.postMessage({key:e,fid:t}),In()}let b=null;function yn(){return!b&&"BroadcastChannel"in self&&(b=new BroadcastChannel("[Firebase] FID Change"),b.onmessage=e=>{Re(e.data.key,e.data.fid)}),b}function In(){ke.size===0&&b&&(b.close(),b=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bn="firebase-installations-database",Tn=1,v="firebase-installations-store";let x=null;function G(){return x||(x=$e(bn,Tn,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(v)}}})),x}function D(e,t){return l(this,null,function*(){const n=M(e),s=(yield G()).transaction(v,"readwrite"),r=s.objectStore(v),i=yield r.get(n);return yield r.put(t,n),yield s.done,(!i||i.fid!==t.fid)&&Ce(e,t.fid),t})}function De(e){return l(this,null,function*(){const t=M(e),a=(yield G()).transaction(v,"readwrite");yield a.objectStore(v).delete(t),yield a.done})}function N(e,t){return l(this,null,function*(){const n=M(e),s=(yield G()).transaction(v,"readwrite"),r=s.objectStore(v),i=yield r.get(n),o=t(i);return o===void 0?yield r.delete(n):yield r.put(o,n),yield s.done,o&&(!i||i.fid!==o.fid)&&Ce(e,o.fid),o})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(e){return l(this,null,function*(){let t;const n=yield N(e.appConfig,a=>{const s=An(a),r=vn(e,s);return t=r.registrationPromise,r.installationEntry});return n.fid===V?{installationEntry:yield t}:{installationEntry:n,registrationPromise:t}})}function An(e){const t=e||{fid:hn(),registrationStatus:0};return Fe(t)}function vn(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(A.create("app-offline"));return{installationEntry:t,registrationPromise:s}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},a=_n(e,n);return{installationEntry:n,registrationPromise:a}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:Pn(e)}:{installationEntry:t}}function _n(e,t){return l(this,null,function*(){try{const n=yield fn(e,t);return D(e.appConfig,n)}catch(n){throw Te(n)&&n.customData.serverCode===409?yield De(e.appConfig):yield D(e.appConfig,{fid:t.fid,registrationStatus:0}),n}})}function Pn(e){return l(this,null,function*(){let t=yield ee(e.appConfig);for(;t.registrationStatus===1;)yield Se(100),t=yield ee(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:a}=yield W(e);return a||n}return t})}function ee(e){return N(e,t=>{if(!t)throw A.create("installation-not-found");return Fe(t)})}function Fe(e){return En(e)?{fid:e.fid,registrationStatus:0}:e}function En(e){return e.registrationStatus===1&&e.registrationTime+ye<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sn(a,s){return l(this,arguments,function*({appConfig:e,heartbeatServiceProvider:t},n){const r=kn(e,n),i=ln(e,n),o=t.getImmediate({optional:!0});if(o){const d=yield o.getHeartbeatsHeader();d&&i.append("x-firebase-client",d)}const c={installation:{sdkVersion:Ie,appId:e.appId}},u={method:"POST",headers:i,body:JSON.stringify(c)},f=yield Ee(()=>fetch(r,u));if(f.ok){const d=yield f.json();return ve(d)}else throw yield _e("Generate Auth Token",f)})}function kn(e,{fid:t}){return`${Ae(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(e,t=!1){return l(this,null,function*(){let n;const a=yield N(e.appConfig,r=>{if(!Oe(r))throw A.create("not-registered");const i=r.authToken;if(!t&&Dn(i))return r;if(i.requestStatus===1)return n=Cn(e,t),r;{if(!navigator.onLine)throw A.create("app-offline");const o=On(r);return n=Rn(e,o),o}});return n?yield n:a.authToken})}function Cn(e,t){return l(this,null,function*(){let n=yield te(e.appConfig);for(;n.authToken.requestStatus===1;)yield Se(100),n=yield te(e.appConfig);const a=n.authToken;return a.requestStatus===0?K(e,t):a})}function te(e){return N(e,t=>{if(!Oe(t))throw A.create("not-registered");const n=t.authToken;return Mn(n)?Object.assign(Object.assign({},t),{authToken:{requestStatus:0}}):t})}function Rn(e,t){return l(this,null,function*(){try{const n=yield Sn(e,t),a=Object.assign(Object.assign({},t),{authToken:n});return yield D(e.appConfig,a),n}catch(n){if(Te(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))yield De(e.appConfig);else{const a=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});yield D(e.appConfig,a)}throw n}})}function Oe(e){return e!==void 0&&e.registrationStatus===2}function Dn(e){return e.requestStatus===2&&!Fn(e)}function Fn(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+sn}function On(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}function Mn(e){return e.requestStatus===1&&e.requestTime+ye<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nn(e){return l(this,null,function*(){const t=e,{installationEntry:n,registrationPromise:a}=yield W(t);return a?a.catch(console.error):K(t).catch(console.error),n.fid})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ln(e,t=!1){return l(this,null,function*(){const n=e;return yield xn(n),(yield K(n,t)).token})}function xn(e){return l(this,null,function*(){const{registrationPromise:t}=yield W(e);t&&(yield t)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jn(e){if(!e||!e.options)throw j("App Configuration");if(!e.name)throw j("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw j(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function j(e){return A.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me="installations",qn="installations-internal",Un=e=>{const t=e.getProvider("app").getImmediate(),n=jn(t),a=O(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:a,_delete:()=>Promise.resolve()}},$n=e=>{const t=e.getProvider("app").getImmediate(),n=O(t,Me).getImmediate();return{getId:()=>Nn(n),getToken:s=>Ln(n,s)}};function Vn(){C(new R(Me,Un,"PUBLIC")),C(new R(qn,$n,"PRIVATE"))}Vn();k(we,z);k(we,z,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const F="analytics",Bn="firebase_id",zn="origin",Gn=60*1e3,Wn="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",H="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const g=new Ve("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kn={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},h=new pe("analytics","Analytics",Kn);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hn(e){if(!e.startsWith(H)){const t=h.create("invalid-gtag-resource",{gtagURL:e});return g.warn(t.message),""}return e}function Ne(e){return Promise.all(e.map(t=>t.catch(n=>n)))}function Yn(e,t){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(e,t)),n}function Qn(e,t){const n=Yn("firebase-js-sdk-policy",{createScriptURL:Hn}),a=document.createElement("script"),s=`${H}?l=${e}&id=${t}`;a.src=n?n==null?void 0:n.createScriptURL(s):s,a.async=!0,document.head.appendChild(a)}function Jn(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}function Xn(e,t,n,a,s,r){return l(this,null,function*(){const i=a[s];try{if(i)yield t[i];else{const c=(yield Ne(n)).find(u=>u.measurementId===s);c&&(yield t[c.appId])}}catch(o){g.error(o)}e("config",s,r)})}function Zn(e,t,n,a,s){return l(this,null,function*(){try{let r=[];if(s&&s.send_to){let i=s.send_to;Array.isArray(i)||(i=[i]);const o=yield Ne(n);for(const c of i){const u=o.find(d=>d.measurementId===c),f=u&&t[u.appId];if(f)r.push(f);else{r=[];break}}}r.length===0&&(r=Object.values(t)),yield Promise.all(r),e("event",a,s||{})}catch(r){g.error(r)}})}function ea(e,t,n,a){function s(r,...i){return l(this,null,function*(){try{if(r==="event"){const[o,c]=i;yield Zn(e,t,n,o,c)}else if(r==="config"){const[o,c]=i;yield Xn(e,t,n,a,o,c)}else if(r==="consent"){const[o,c]=i;e("consent",o,c)}else if(r==="get"){const[o,c,u]=i;e("get",o,c,u)}else if(r==="set"){const[o]=i;e("set",o)}else e(r,...i)}catch(o){g.error(o)}})}return s}function ta(e,t,n,a,s){let r=function(...i){window[a].push(arguments)};return window[s]&&typeof window[s]=="function"&&(r=window[s]),window[s]=ea(r,e,t,n),{gtagCore:r,wrappedGtag:window[s]}}function na(e){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(H)&&n.src.includes(e))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const aa=30,sa=1e3;class ra{constructor(t={},n=sa){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const Le=new ra;function ia(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}function oa(e){return l(this,null,function*(){var t;const{appId:n,apiKey:a}=e,s={method:"GET",headers:ia(a)},r=Wn.replace("{app-id}",n),i=yield fetch(r,s);if(i.status!==200&&i.status!==304){let o="";try{const c=yield i.json();!((t=c.error)===null||t===void 0)&&t.message&&(o=c.error.message)}catch(c){}throw h.create("config-fetch-failed",{httpStatus:i.status,responseMessage:o})}return i.json()})}function ca(a){return l(this,arguments,function*(e,t=Le,n){const{appId:s,apiKey:r,measurementId:i}=e.options;if(!s)throw h.create("no-app-id");if(!r){if(i)return{measurementId:i,appId:s};throw h.create("no-api-key")}const o=t.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new da;return setTimeout(()=>l(null,null,function*(){c.abort()}),Gn),xe({appId:s,apiKey:r,measurementId:i},o,c,t)})}function xe(r,i,o){return l(this,arguments,function*(e,{throttleEndTimeMillis:t,backoffCount:n},a,s=Le){var c;const{appId:u,measurementId:f}=e;try{yield la(a,t)}catch(d){if(f)return g.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${f} provided in the "measurementId" field in the local Firebase config. [${d==null?void 0:d.message}]`),{appId:u,measurementId:f};throw d}try{const d=yield oa(e);return s.deleteThrottleMetadata(u),d}catch(d){const p=d;if(!ua(p)){if(s.deleteThrottleMetadata(u),f)return g.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${f} provided in the "measurementId" field in the local Firebase config. [${p==null?void 0:p.message}]`),{appId:u,measurementId:f};throw d}const y=Number((c=p==null?void 0:p.customData)===null||c===void 0?void 0:c.httpStatus)===503?Z(n,s.intervalMillis,aa):Z(n,s.intervalMillis),X={throttleEndTimeMillis:Date.now()+y,backoffCount:n+1};return s.setThrottleMetadata(u,X),g.debug(`Calling attemptFetch again in ${y} millis`),xe(e,X,a,s)}})}function la(e,t){return new Promise((n,a)=>{const s=Math.max(t-Date.now(),0),r=setTimeout(n,s);e.addEventListener(()=>{clearTimeout(r),a(h.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function ua(e){if(!(e instanceof ge)||!e.customData)return!1;const t=Number(e.customData.httpStatus);return t===429||t===500||t===503||t===504}class da{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}function fa(e,t,n,a,s){return l(this,null,function*(){if(s&&s.global){e("event",n,a);return}else{const r=yield t,i=Object.assign(Object.assign({},a),{send_to:r});e("event",n,i)}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pa(){return l(this,null,function*(){if(ze())try{yield Ge()}catch(e){return g.warn(h.create("indexeddb-unavailable",{errorInfo:e==null?void 0:e.toString()}).message),!1}else return g.warn(h.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0})}function ga(e,t,n,a,s,r,i){return l(this,null,function*(){var o;const c=ca(e);c.then(y=>{n[y.measurementId]=y.appId,e.options.measurementId&&y.measurementId!==e.options.measurementId&&g.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${y.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(y=>g.error(y)),t.push(c);const u=pa().then(y=>{if(y)return a.getId()}),[f,d]=yield Promise.all([c,u]);na(r)||Qn(r,f.measurementId),s("js",new Date);const p=(o=i==null?void 0:i.config)!==null&&o!==void 0?o:{};return p[zn]="firebase",p.update=!0,d!=null&&(p[Bn]=d),s("config",f.measurementId,p),f.measurementId})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ha{constructor(t){this.app=t}_delete(){return delete S[this.app.options.appId],Promise.resolve()}}let S={},ne=[];const ae={};let q="dataLayer",ma="gtag",se,je,re=!1;function wa(){const e=[];if(Be()&&e.push("This is a browser extension environment."),He()||e.push("Cookies are not available."),e.length>0){const t=e.map((a,s)=>`(${s+1}) ${a}`).join(" "),n=h.create("invalid-analytics-context",{errorInfo:t});g.warn(n.message)}}function ya(e,t,n){wa();const a=e.options.appId;if(!a)throw h.create("no-app-id");if(!e.options.apiKey)if(e.options.measurementId)g.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw h.create("no-api-key");if(S[a]!=null)throw h.create("already-exists",{id:a});if(!re){Jn(q);const{wrappedGtag:r,gtagCore:i}=ta(S,ne,ae,q,ma);je=r,se=i,re=!0}return S[a]=ga(e,ne,ae,t,se,q,n),new ha(e)}function Ia(e=We()){e=he(e);const t=O(e,F);return t.isInitialized()?t.getImmediate():ba(e)}function ba(e,t={}){const n=O(e,F);if(n.isInitialized()){const s=n.getImmediate();if(Ke(t,n.getOptions()))return s;throw h.create("already-initialized")}return n.initialize({options:t})}function Ta(e,t,n,a){e=he(e),fa(je,S[e.app.options.appId],t,n,a).catch(s=>g.error(s))}const ie="@firebase/analytics",oe="0.10.8";function Aa(){C(new R(F,(t,{options:n})=>{const a=t.getProvider("app").getImmediate(),s=t.getProvider("installations-internal").getImmediate();return ya(a,s,n)},"PUBLIC")),C(new R("analytics-internal",e,"PRIVATE")),k(ie,oe),k(ie,oe,"esm2017");function e(t){try{const n=t.getProvider(F).getImmediate();return{logEvent:(a,s,r)=>Ta(n,a,s,r)}}catch(n){throw h.create("interop-component-reg-failed",{reason:n})}}}Aa();const Y=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:ct,Bytes:lt,CollectionReference:ut,DocumentReference:dt,DocumentSnapshot:ft,FieldPath:pt,FieldValue:gt,Firestore:ht,FirestoreError:mt,GeoPoint:wt,Query:yt,QueryCompositeFilterConstraint:It,QueryConstraint:bt,QueryDocumentSnapshot:Tt,QueryFieldFilterConstraint:At,QueryLimitConstraint:vt,QueryOrderByConstraint:_t,QuerySnapshot:Pt,SnapshotMetadata:Et,Timestamp:St,VectorValue:kt,_AutoId:Ct,_ByteString:Rt,_DatabaseId:Dt,_DocumentKey:Ft,_EmptyAuthCredentialsProvider:Ot,_FieldPath:Mt,_cast:Nt,_logWarn:Lt,_validateIsNotUsedTogether:xt,addDoc:jt,collection:qt,connectFirestoreEmulator:Ut,deleteDoc:$t,doc:Vt,ensureFirestoreConfigured:Bt,executeWrite:zt,getDoc:Gt,getDocs:Wt,getFirestore:me,increment:Kt,limit:Ht,orderBy:Yt,query:Qt,setDoc:Jt,updateDoc:Xt,where:Zt},Symbol.toStringTag,{value:"Module"})),va={apiKey:"your-api-key",authDomain:"your-app.firebaseapp.com",projectId:"your-project-id",storageBucket:"your-app.appspot.com",messagingSenderId:"123456789",appId:"1:123456789:web:abcdef123456",measurementId:"G-ABCDEFGHIJ"},ce=!1,U=(e,t)=>{};let E,I,qe=null,Ue;try{U("Initializing Firebase app"),E=Ye(va),I=Qe(E),Ue=me(E);try{qe=Ia(E),U("Firebase analytics initialized")}catch(e){}U("Firebase initialized successfully")}catch(e){console.error("Error initializing Firebase:",e)}const Q=Object.freeze(Object.defineProperty({__proto__:null,get analytics(){return qe},get app(){return E},get auth(){return I},get db(){return Ue}},Symbol.toStringTag,{value:"Module"}));class T extends Error{constructor(t,n,a){super(t),this.code=n,this.originalError=a,this.name="UserServiceError"}}function _a(e){return l(this,null,function*(){try{if(!e)throw new T("User ID is required","invalid-argument");if(typeof window=="undefined")return null;const{getFirestore:t,doc:n,getDoc:a}=yield P(()=>l(null,null,function*(){const{getFirestore:c,doc:u,getDoc:f}=yield Promise.resolve().then(()=>Y);return{getFirestore:c,doc:u,getDoc:f}}),void 0,import.meta.url),{app:s}=yield P(()=>l(null,null,function*(){const{app:c}=yield Promise.resolve().then(()=>Q);return{app:c}}),void 0,import.meta.url),r=t(s),i=n(r,"users",e),o=yield a(i);return o.exists()?o.data():null}catch(t){console.error("Error getting user profile:",t);const n=t.code||"unknown",a=t.message||"Failed to get user profile";throw new T(a,n,t)}})}function Pa(e){return l(this,null,function*(){try{if(!e||!e.uid)throw new T("Valid user profile with UID is required","invalid-argument");if(typeof window=="undefined")return;const{getFirestore:t,doc:n,setDoc:a}=yield P(()=>l(null,null,function*(){const{getFirestore:o,doc:c,setDoc:u}=yield Promise.resolve().then(()=>Y);return{getFirestore:o,doc:c,setDoc:u}}),void 0,import.meta.url),{app:s}=yield P(()=>l(null,null,function*(){const{app:o}=yield Promise.resolve().then(()=>Q);return{app:o}}),void 0,import.meta.url),r=t(s),i=n(r,"users",e.uid);yield a(i,e),console.log(`User profile created: ${e.uid}`)}catch(t){console.error("Error creating user profile:",t);const n=t.code||"unknown",a=t.message||"Failed to create user profile";throw new T(a,n,t)}})}function Ea(e,t){return l(this,null,function*(){try{if(!e)throw new T("User ID is required","invalid-argument");if(!t||Object.keys(t).length===0)throw new T("Update data is required","invalid-argument");if(typeof window=="undefined")return;const{getFirestore:n,doc:a,updateDoc:s}=yield P(()=>l(null,null,function*(){const{getFirestore:c,doc:u,updateDoc:f}=yield Promise.resolve().then(()=>Y);return{getFirestore:c,doc:u,updateDoc:f}}),void 0,import.meta.url),{app:r}=yield P(()=>l(null,null,function*(){const{app:c}=yield Promise.resolve().then(()=>Q);return{app:c}}),void 0,import.meta.url),i=n(r),o=a(i,"users",e);yield s(o,t),console.log(`User profile updated: ${e}`)}catch(n){console.error("Error updating user profile:",n);const a=n.code||"unknown",s=n.message||"Failed to update user profile";throw new T(s,a,n)}})}const le=_(null),ue=_(!1),de=_(null);function Sa(e,t,n){return l(this,null,function*(){ue.set(!0),de.set(null);try{let a=yield _a(e);if(!a){const s=Date.now();a={uid:e,email:t,displayName:n,createdAt:s,preferences:{enrollments:[],focusSessions:[],tasks:[],notes:""}},yield Pa(a)}le.set(a)}catch(a){console.error("Error loading user profile:",a),de.set(a.message),le.set(null)}finally{ue.set(!1)}})}const Ma=Ea;let $=!1;function Na(){if($){console.log("Auth already initialized, skipping");return}return m.set(!0),console.log("Initializing auth listener"),Je(I,t=>{t?(console.log("Auth state changed: User authenticated",{uid:t.uid,email:t.email,displayName:t.displayName}),fe.set(!0),B.set(t),Sa(t.uid,t.email||"",t.displayName||void 0).catch(n=>{console.error("Failed to load user profile:",n),w.set("Your profile information could not be loaded. Some features may be limited.")})):(console.log("Auth state changed: User not authenticated"),fe.set(!1),B.set(null)),m.set(!1),$=!0},t=>{console.error("Auth state change error:",t),w.set(`Authentication error: ${t.message}`),m.set(!1),$=!0})}function J(e){return l(this,null,function*(){try{yield at(I,e?tt:nt),console.log(`Auth persistence set to: ${e?"LOCAL":"SESSION"}`)}catch(t){console.error("Failed to set auth persistence:",t)}})}function L(e){let t=(e==null?void 0:e.code)||"",n="An unexpected error occurred. Please try again.";const a={"auth/email-already-in-use":"This email is already registered. Please use a different email or try logging in.","auth/invalid-email":"The email address is not valid.","auth/weak-password":"Password is too weak. Please use a stronger password.","auth/user-not-found":"Invalid email or password. Please try again.","auth/wrong-password":"Invalid email or password. Please try again.","auth/invalid-credential":"Invalid email or password. Please try again.","auth/user-disabled":"This account has been disabled. Please contact support.","auth/too-many-requests":"Too many unsuccessful login attempts. Please try again later or reset your password.","auth/popup-closed-by-user":"Sign-in popup was closed before completion. Please try again.","auth/popup-blocked":"Sign-in popup was blocked by your browser. Please allow popups for this site and try again.","auth/cancelled-popup-request":"Multiple popup requests were detected. Please try again.","auth/account-exists-with-different-credential":"An account already exists with the same email but different sign-in credentials. Try signing in with a different method.","auth/missing-email":"Please enter an email address.","auth/network-request-failed":"Network error. Please check your connection and try again.",default:"An unexpected error occurred. Please try again."};return n=a[t]||a.default,{code:t,message:n,original:e}}function La(e,t,n,a=!0){return l(this,null,function*(){m.set(!0),w.set(""),console.log("Attempting to register user:",{email:e,displayName:n});try{yield J(a);const s=yield st(I,e,t);s.user&&(yield rt(s.user,{displayName:n}),console.log("User registered successfully"))}catch(s){console.error("Registration error:",s);const r=L(s);throw w.set(r.message),s}finally{m.set(!1)}})}function xa(e,t,n=!0){return l(this,null,function*(){m.set(!0),w.set(""),console.log("Attempting to login user:",{email:e});try{yield J(n);const a=yield Xe(I,e,t);console.log("Login successful:",{uid:a.user.uid,email:a.user.email,displayName:a.user.displayName,emailVerified:a.user.emailVerified})}catch(a){console.error("Login error:",a);const s=L(a);throw w.set(s.message),a}finally{m.set(!1)}})}function ja(e=!0){return l(this,null,function*(){m.set(!0),w.set(""),console.log("Attempting Google sign-in");try{yield J(e);const t=new Ze,n=yield et(I,t);console.log("Google sign-in successful:",{uid:n.user.uid,email:n.user.email,displayName:n.user.displayName})}catch(t){console.error("Google sign-in error:",t);const n=L(t);throw w.set(n.message),t}finally{m.set(!1)}})}function ka(){return l(this,null,function*(){m.set(!0),w.set(""),console.log("Logging out user");try{yield ot(I),console.log("Logout successful")}catch(e){throw console.error("Logout error:",e),w.set("Failed to log out. Please try again."),e}finally{m.set(!1)}})}function qa(e){return l(this,null,function*(){m.set(!0),w.set(""),console.log("Requesting password reset for:",{email:e});try{yield it(I,e),console.log("Password reset email sent")}catch(t){console.error("Password reset error:",t);const n=L(t);throw w.set(n.message),t}finally{m.set(!1)}})}function Ua(){const e=I.currentUser;return console.log("Getting current user:",e?{uid:e.uid,email:e.email,displayName:e.displayName}:"No user"),e}const fe=_(!1),B=_(null),m=_(!0),w=_(null),$a=en(B,e=>e?e.email==="admin@example.com"||(e==null?void 0:e.isAdmin)===!0:!1),Va=ka;export{w as a,$a as b,xa as c,Ue as d,le as e,ue as f,Ua as g,Va as h,fe as i,Ma as j,ja as k,m as l,qa as m,I as n,ka as o,Na as p,La as r,B as u};
//# sourceMappingURL=BRK8y73W.js.map
