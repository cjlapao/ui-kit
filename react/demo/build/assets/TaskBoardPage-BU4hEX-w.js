import{gq as ne,j as n,gr as cn,n as B,r as i,v as Se,gs as it,fu as lt,gt as Ht,gu as Ft,gv as Ut,gw as dt,gx as Wt,Q as un,I as He,C as Vt,Y as mn,bj as pn,B as he,gy as hn,gz as Kt,S as ct,gA as Gt,fO as fn,gB as gn,gC as Fe,gD as bn,u as kn,P as xn,eA as yn,gE as vn,gF as vt,o as Cn,gG as wn,p as Sn,V as jn,a1 as pe,gH as qt,gI as Tn,z as Bn,f as Nn,gJ as Mn,M as In}from"./index-dkEsqyUy.js";import{A as Rn,a as Ct,C as q,b as En,K as Ln,P as An}from"./A11ySections-Ciyz8RbP.js";import{P as Dn}from"./PageHeader-Cqxw9jAs.js";import{E as ie}from"./ExampleCard-SmeeyhOh.js";import{S as Pn}from"./SurfaceToneControl-CptLUoZR.js";import{P as On,a as Ye,S as me,C as Xe,T as le}from"./PlaygroundPanel-CD4VThIT.js";import{C as zn}from"./ControlAccordion-BM7PEMt8.js";import{u as $n,E as _n}from"./EventLog-CkW2wQ_v.js";import{ai as Hn,aj as Fn,c as Un,ak as Wn,f as wt,p as Vn,e as Kn}from"./options-DH3jBuHJ.js";function Y(e,t){return`${e}::${t??""}`}function ut(e,t){return!t||t.length===0?null:e.lane&&t.some(a=>a.id===e.lane)?e.lane:t[0].id}function Le(e,t,a){const s=new Map,o=a&&a.length?a.map(r=>r.id):[null];for(const r of t)for(const l of o)s.set(Y(r.id,l),[]);for(const r of e){const l=s.get(Y(r.column,ut(r,a)));l&&l.push(r)}return s}function Ee(e,t){let a=0;for(const s of e)s.column===t&&a++;return a}function Gn(e,t,a){let s=0;for(const o of e)(a?ut(o,a):o.lane)===t&&s++;return s}function Yt(e,t){return t==null?"none":e>t?"over":e===t?"full":"ok"}const St=[{id:"sw",name:"Sara Walsh",color:"indigo"},{id:"jc",name:"Jonah Cole",color:"teal"},{id:"mg",name:"Maya Grant",color:"indigo"},{id:"ak",name:"Arjun Kapoor",color:"violet"},{id:"lb",name:"Lena Brandt",color:"teal"},{id:"rp",name:"Rui Pereira",color:"orange"}],jt=[{id:"nk",name:"Nadia Khan",color:"rose"},{id:"ml",name:"Marco Lund",color:"orange"},{id:"ps",name:"Priya Shah",color:"violet"},{id:"ob",name:"Owen Baker",color:"blue"},{id:"er",name:"Elif Reyes",color:"amber"},{id:"vc",name:"Victor Chen",color:"amber"},{id:"mp",name:"Mia Park",color:"green"},{id:"sc",name:"Sofia Costa",color:"fuchsia"}],Xt=(e,t)=>e.find(a=>a.id===t);function qn(){const e=s=>Xt(St,s),t=new Date().getFullYear(),a=(s,o)=>new Date(t,s-1,o).toISOString().slice(0,10);return{priorities:[{id:"p1",label:"P1",color:"red"},{id:"p2",label:"P2",color:"orange"},{id:"p3",label:"P3",color:"blue"},{id:"p4",label:"P4",color:"slate"}],users:St.map(s=>({...s})),columns:[{id:"ideas",title:"Ideas",color:"blue"},{id:"discovery",title:"Discovery",color:"blue"},{id:"ready",title:"Ready",color:"blue"},{id:"building",title:"Building",color:"amber",wipLimit:5},{id:"blocked",title:"Blocked",color:"red"}],cards:[{id:"r1",column:"ideas",title:"Persona-based onboarding paths",tags:["activation","research"],priority:"p2",description:"Branch the first-run flow by role.",assignees:[e("sw")]},{id:"r2",column:"ideas",title:"Usage-based pricing meters",tags:["billing","platform"],priority:"p1",checklist:{done:2,total:5},due:a(11,6),assignees:[e("jc")],subtasks:[{id:"r2a",title:"Meter schema",done:!0},{id:"r2b",title:"Ingest pipeline",done:!0},{id:"r2c",title:"Idempotent events"},{id:"r2d",title:"Usage → invoice bridge"},{id:"r2e",title:"Overage emails"},{id:"r2f",title:"Meter backfill tool"},{id:"r2g",title:"Quota guardrail tests"}]},{id:"r3",column:"ideas",title:"Enterprise SSO buying signal",tags:["enterprise","research"],priority:"p3",description:"Track SSO page visits per account."},{id:"r4",column:"ideas",title:"AI summary opt-in",tags:["research","platform"],priority:"p4",description:"Workspace-level toggle."},{id:"r5",column:"discovery",title:"Mobile trial activation",tags:[{label:"mobile",color:"fuchsia"},"activation"],priority:"p2",checklist:{done:1,total:3},due:a(10,30),assignees:[e("mg")]},{id:"r6",column:"discovery",title:"Account health score",tags:["analytics","growth"],priority:"p3",description:"Blend usage, seats and tickets.",assignees:[e("ak")],subtasks:[{id:"r6a",title:"Factor weights draft",done:!0},{id:"r6b",title:"Ticket sentiment feed"},{id:"r6c",title:"Churn backtest"}]},{id:"r7",column:"discovery",title:"Partner API discovery",tags:["platform"],priority:"p4"},{id:"r8",column:"ready",title:"Customer import wizard",tags:["activation","platform"],priority:"p3",assignees:[e("lb")]},{id:"r9",column:"ready",title:"Self-serve plan downgrade",tags:["billing","trust"],priority:"p2",description:"Keep data, drop seats.",due:a(10,28),assignees:[e("rp")]},{id:"r10",column:"ready",title:"Warehouse sync beta",tags:["analytics","enterprise"],priority:"p1",due:a(11,2),assignees:[e("jc")]},{id:"r11",column:"building",title:"Checkout recovery campaign",tags:["checkout","growth"],priority:"p1",checklist:{done:3,total:5},due:a(10,26),assignees:[e("sw")],subtasks:[{id:"r11a",title:"Abandonment triggers",status:"completed"},{id:"r11b",title:"Email + SMS copy",status:"completed"},{id:"r11c",title:"Discount ladder",status:"active"},{id:"r11d",title:"Frequency caps",status:"pending"}]},{id:"r12",column:"building",title:"Admin audit log",tags:["enterprise","trust"],priority:"p2",checklist:{done:1,total:3},description:"Every admin action, exportable.",assignees:[e("lb")],subtasks:[{id:"r12a",title:"Event taxonomy",done:!0},{id:"r12b",title:"Retention job",status:"error"},{id:"r12c",title:"CSV export"},{id:"r12d",title:"Per-space filters"}]},{id:"r13",column:"building",title:"Saved dashboard templates",tags:["analytics","platform"],priority:"p3",assignees:[e("jc")]},{id:"r14",column:"building",title:"Expansion signal pipeline",tags:["analytics","growth"],priority:"p3",due:a(10,29),assignees:[e("ak")]},{id:"r15",column:"blocked",title:"App store review fixes",tags:["checkout","mobile"],priority:"p2",assignees:[e("mg")]},{id:"r16",column:"blocked",title:"Data residency (EU)",tags:["enterprise"],priority:"p3",description:"Waiting on legal sign-off."}]}}function Yn(){const e=t=>Xt(jt,t);return{priorities:[{id:"critical",label:"Critical",color:"red"},{id:"high",label:"High",color:"orange"},{id:"medium",label:"Medium",color:"blue"},{id:"low",label:"Low",color:"slate"}],users:jt.map(t=>({...t})),columns:[{id:"intake",title:"Intake"},{id:"scheduled",title:"Scheduled"},{id:"onsite",title:"On site"},{id:"review",title:"Review"},{id:"closed",title:"Closed"}],lanes:[{id:"north",title:"North Region"},{id:"downtown",title:"Downtown Retail"},{id:"airport",title:"Airport Terminal"},{id:"harbor",title:"Harbor Logistics"}],cards:[{id:"f1",lane:"north",column:"intake",title:"Quote backup generator service",priority:"medium",points:2,tags:["quote"],assignees:[e("ps")]},{id:"f2",lane:"north",column:"scheduled",title:"Replace freezer controller",priority:"high",points:2,tags:["cold-chain"],assignees:[e("nk")]},{id:"f3",lane:"north",column:"onsite",title:"Investigate gate sensor loop",priority:"critical",points:3,tags:["access"],assignees:[e("ml")],subtasks:[{id:"f3a",title:"Loop resistance test",done:!0},{id:"f3b",title:"Swap reader head"},{id:"f3c",title:"Log to maintenance"}]},{id:"f4",lane:"north",column:"onsite",title:"Refit loading dock camera",priority:"high",points:5,tags:["security"],assignees:[e("nk")]},{id:"f5",lane:"north",column:"review",title:"Verify night crew handoff",priority:"medium",points:1,tags:["handoff"],assignees:[e("sc")]},{id:"f6",lane:"north",column:"closed",title:"Close HVAC inspection",priority:"low",points:1,tags:["hvac"],assignees:[e("ob")]},{id:"f7",lane:"downtown",column:"intake",title:"Book signage replacement",priority:"high",points:2,tags:["retail"],assignees:[e("er")]},{id:"f8",lane:"downtown",column:"intake",title:"Repair stockroom door strike",priority:"high",points:2,tags:["access"],assignees:[e("vc")]},{id:"f9",lane:"downtown",column:"scheduled",title:"Stage weekend cleaning crew",priority:"medium",points:1,tags:["crew"],assignees:[e("vc")]},{id:"f10",lane:"downtown",column:"onsite",title:"Escalator brake fault",priority:"critical",points:3,tags:["safety"],assignees:[e("ob")]},{id:"f11",lane:"downtown",column:"review",title:"Approve storefront glass work",priority:"critical",points:2,tags:["vendor"],assignees:[e("ob")]},{id:"f12",lane:"downtown",column:"closed",title:"Close retrofit lighting",priority:"medium",points:2,tags:["lighting"],assignees:[e("er")]},{id:"f13",lane:"airport",column:"intake",title:"Triage baggage belt alarm",priority:"critical",points:5,tags:["baggage"],assignees:[e("mp")]},{id:"f14",lane:"airport",column:"onsite",title:"Repair kiosk printer cluster",priority:"high",points:2,tags:["kiosk"],assignees:[e("mp")]},{id:"f15",lane:"airport",column:"closed",title:"Close alarm panel audit",priority:"high",points:1,tags:["alarm"],assignees:[e("ps")]},{id:"f16",lane:"harbor",column:"scheduled",title:"Calibrate crane load cells",priority:"high",points:3,tags:["crane"],assignees:[e("ml")]},{id:"f17",lane:"harbor",column:"review",title:"Sign off reefer plug repair",priority:"medium",points:2,tags:["cold-chain"],assignees:[e("nk")]}]}}const fe={roadmap:qn,fieldOps:Yn},Xn={ok:!0},de=e=>({ok:!1,reason:e});function Qt(e,t){const a=e.cards.find(d=>d.id===t.cardId);if(!a||a.locked)return de("locked-card");const s=e.heldBy?.get(a.id);if(s&&s!==e.selfId)return de("held");const o=e.columns.find(d=>d.id===t.from.column),r=e.columns.find(d=>d.id===t.to.column);if(!r||o?.locked||r.locked)return de("locked-column");const l=e.lanes?.find(d=>d.id===t.from.lane),u=e.lanes?.find(d=>d.id===t.to.lane);if(l?.locked||u?.locked)return de("locked-lane");const m=t.from.column!==t.to.column;if(m&&r.accepts&&!r.accepts.includes(t.from.column))return de("not-accepted");const h=Ue(r,e.maxItems);return m&&h!==void 0&&e.cards.filter(p=>p.column===r.id&&p.id!==a.id).length>=h?de("max-items"):m&&r.wipLimit!==void 0&&e.cards.filter(p=>p.column===r.id&&p.id!==a.id).length>=r.wipLimit?de("wip-column"):t.from.lane!==t.to.lane&&u?.wipLimit!==void 0&&e.cards.filter(p=>p.id!==a.id&&ut(p,e.lanes)===u.id).length>=u.wipLimit?de("wip-lane"):Xn}function Ue(e,t){return e.maxItems??t}function Qn(e,t,a){const s=Ue(t,a);if(s===void 0)return!1;let o=0;for(const r of e)r.column===t.id&&o++;return o>=s}function Ae(e,t,a,s){const o=e.find(d=>d.id===t.cardId);if(!o)return e;const r=e.filter(d=>d.id!==t.cardId),l={...o,column:t.to.column};t.to.lane!==null&&(l.lane=t.to.lane);const u=Le(r,a,s).get(Y(t.to.column,t.to.lane))??[],m=Math.max(0,Math.min(t.to.index,u.length));if(u.length===0)return[...r,l];if(m<u.length){const d=r.indexOf(u[m]);return[...r.slice(0,d),l,...r.slice(d)]}const h=r.indexOf(u[u.length-1])+1;return[...r.slice(0,h),l,...r.slice(h)]}function Jn(e,t,a,s){const o=e.filter(l=>l.id!==a),r=e.find(l=>l.id===a);if(r&&t>=r.top&&t<=r.top+r.height)return s??o.filter(l=>l.top<r.top).length;for(let l=0;l<o.length;l++){const u=o[l];if(t<u.top+u.height/2)return l}return o.length}function Zn(e,t,a,s){const o=e.cards.filter(d=>d.id!==a),r=Le(o,e.columns,e.lanes),l=(d,p)=>r.get(Y(d,p))?.length??0,u=d=>Qt(e,{cardId:a,from:t,to:d}).ok;if(s==="up"||s==="down"){const d=t.index+(s==="down"?1:-1);if(d<0||d>l(t.column,t.lane))return null;const p={...t,index:d};return u(p)?p:null}if(s==="left"||s==="right"){const d=e.columns,p=s==="right"?1:-1;for(let v=d.findIndex(S=>S.id===t.column)+p;v>=0&&v<d.length;v+=p){const S=d[v];if(S.collapsed)continue;const j={column:S.id,lane:t.lane,index:Math.min(t.index,l(S.id,t.lane))};if(u(j))return j}return null}const m=e.lanes??[],h=s==="lane-down"?1:-1;for(let d=m.findIndex(p=>p.id===t.lane)+h;d>=0&&d<m.length;d+=h){const p=m[d];if(p.collapsed)continue;const v={column:t.column,lane:p.id,index:Math.min(t.index,l(t.column,p.id))};if(u(v))return v}return null}const ea=5e3,Tt=8e3,ta=50;function Bt(){return{peers:new Map,holds:new Map}}const te=e=>typeof e=="string",Nt=e=>typeof e=="number"&&Number.isFinite(e);function na(e){if(!e||typeof e!="object")return null;const t=e;if(!Nt(t.at))return null;switch(t.type){case"presence":{const a=t.user;return a&&te(a.id)&&te(a.name)?t:null}case"leave":return te(t.userId)?t:null;case"grab":return te(t.userId)&&te(t.cardId)?t:null;case"release":return te(t.userId)&&te(t.cardId)?t:null;case"hover":return te(t.userId)&&te(t.cardId)&&te(t.column)&&(t.lane===null||te(t.lane))&&Nt(t.index)?t:null;default:return null}}function ze(e,t,a){const s=e.peers.get(t);if(!s)return e.peers;const o=new Map(e.peers);return o.set(t,{...s,lastSeen:a}),o}function aa(e,t){return e.at<t.at||e.at===t.at&&e.userId<t.userId}function sa(e,t,a){const s=na(t);if(!s)return e;switch(s.type){case"presence":{const o=new Map(e.peers);o.set(s.user.id,{user:s.user,lastSeen:a});let r=e.holds;for(const[l,u]of e.holds)u.userId===s.user.id&&(r===e.holds&&(r=new Map(e.holds)),r.set(l,{...u,seen:a}));return{peers:o,holds:r}}case"leave":{const o=new Map(e.peers);o.delete(s.userId);const r=new Map(e.holds);for(const[l,u]of e.holds)u.userId===s.userId&&r.delete(l);return{peers:o,holds:r}}case"grab":{const o=e.holds.get(s.cardId);if(o&&o.userId!==s.userId&&!aa(s,o))return{...e,peers:ze(e,s.userId,a)};const r=new Map(e.holds);return r.set(s.cardId,{userId:s.userId,at:s.at,seen:a}),{peers:ze(e,s.userId,a),holds:r}}case"hover":{const o=e.holds.get(s.cardId);if(!o||o.userId!==s.userId)return e;const r=new Map(e.holds);return r.set(s.cardId,{...o,seen:a,hover:{column:s.column,lane:s.lane,index:s.index}}),{peers:ze(e,s.userId,a),holds:r}}case"release":{const o=e.holds.get(s.cardId);if(!o||o.userId!==s.userId)return e;const r=new Map(e.holds);return r.delete(s.cardId),{peers:ze(e,s.userId,a),holds:r}}}}function oa(e,t){let a=e.peers,s=e.holds;for(const[o,r]of e.peers)t-r.lastSeen<=Tt||(a===e.peers&&(a=new Map(e.peers)),a.delete(o));for(const[o,r]of e.holds)t-r.seen<=Tt||(s===e.holds&&(s=new Map(e.holds)),s.delete(o));return a===e.peers&&s===e.holds?e:{peers:a,holds:s}}function ra(e){const t=new BroadcastChannel(`taskboard:${e}`),a=new Set;let s=!1;return t.onmessage=o=>{for(const r of a)r(o.data)},{publish:o=>{s||t.postMessage(o)},subscribe(o){return a.add(o),()=>{a.delete(o)}},close(){s=!0,a.clear(),t.close()}}}const ia=e=>({cardId:e.cardId,from:e.to,to:e.from});function la(e=100){let t=[],a=[];return{push(s){t=[...t,s].slice(-e),a=[]},undo(s,o,r){const l=t[t.length-1];return l?(t=t.slice(0,-1),a=[...a,l],Ae(s,ia(l),o,r)):null},redo(s,o,r){const l=a[a.length-1];return l?(a=a.slice(0,-1),t=[...t,l],Ae(s,l,o,r)):null},get canUndo(){return t.length>0},get canRedo(){return a.length>0},get size(){return t.length},clear(){t=[],a=[]}}}function Mt(e,t,a){const s=e.findIndex(l=>l.id===t);if(s===-1)return e;const o=e.filter(l=>l.id!==t),r=Math.max(0,Math.min(a,o.length));return[...o.slice(0,r),e[s],...o.slice(r)]}function da(e,t,a,s,o,r=!1){const l=e.findIndex(j=>j.id===a);if(l===-1||o===0||e.length===0)return s;const u=r?o<0:o>0,m=e.length-1,h=e.findIndex(j=>t>=j.left&&t<=j.left+j.width);if(h!==-1)return h===l?s:h>l&&u?Math.min(h,m):h<l&&!u?h:s;const d=Math.min(...e.map(j=>j.left)),p=Math.max(...e.map(j=>j.left+j.width)),v=r?t<d:t>p,S=r?t>p:t<d;return v&&u?m:S&&!u?0:s}function ca(e,t){const a=e.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"column",s=new Set(t.map(r=>r.id));if(!s.has(a))return a;let o=2;for(;s.has(`${a}-${o}`);)o++;return`${a}-${o}`}const Jt=({column:e,lane:t,cards:a,className:s,label:o})=>{const{cardState:r,cardProps:l,dropTarget:u,size:m,text:h}=ne(),d=Y(e,t),p=u&&u.bucket===d?u:null;return n.jsx("div",{role:"group","aria-label":o,"data-bucket":d,"data-bucket-column":e,"data-bucket-lane":t??"","data-drop":p?p.valid?"valid":"invalid":void 0,title:p&&!p.valid?h("notAllowed"):void 0,className:B("flex min-h-12 flex-col rounded-lg transition-colors",m.gap,s),children:a.map((v,S)=>n.jsx(cn,{card:v,column:e,lane:t,index:S,state:r(v),...l?.(v,{column:e,lane:t,index:S})},v.id))})},nt=200;function at(e,t=nt){const[a,s]=i.useState(e);return i.useEffect(()=>{if(e){s(!0);return}if(typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||t<=0){s(!1);return}const r=setTimeout(()=>s(!1),t);return()=>clearTimeout(r)},[e,t]),e||a}const st=({column:e,index:t})=>{const{columnGripProps:a,surface:s,color:o}=ne();if(!a)return null;const r=Se(o);return n.jsx("button",{type:"button",...a(e,t),className:B("shrink-0 cursor-grab touch-none rounded p-1 active:cursor-grabbing",s.muted,r.hover,r.focusRing),children:n.jsx(Ht,{className:"h-3.5 w-3.5","aria-hidden":"true"})})},Zt=({onAdd:e,variant:t})=>{const{text:a,surface:s,color:o,size:r,columnCornerClass:l}=ne(),[u,m]=i.useState(!1),[h,d]=i.useState(""),p=Se(o),v=()=>{m(!1),d("")},S=()=>{const j=h.trim();j&&e(j),v()};return n.jsx("div",{"data-taskboard-add-column":!0,style:t==="column"?{width:Math.round(r.columnWidth*.75)}:void 0,className:B("flex shrink-0 flex-col",t==="column"&&B("border-2 border-dashed p-2",s.divider,l),t==="header"&&"px-2 py-1.5"),children:u?n.jsx("input",{autoFocus:!0,"aria-label":a("columnName"),placeholder:a("columnName"),value:h,onChange:j=>d(j.target.value),onKeyDown:j=>{j.key==="Enter"?(j.preventDefault(),S()):j.key==="Escape"&&(j.preventDefault(),v())},onBlur:S,className:B("w-full rounded-md border bg-transparent px-2 py-1.5 text-sm outline-none",s.divider,s.heading,p.focusRing)}):n.jsxs("button",{type:"button",onClick:()=>m(!0),className:B("flex items-center justify-center gap-1 rounded-md py-1.5 text-sm",s.muted,p.hover,p.focusRing),children:[n.jsx(it,{className:"h-3.5 w-3.5","aria-hidden":"true"}),a("addColumn")]})})},ua=({drag:e,column:t,cards:a,count:s})=>{const{color:o,surface:r,size:l,cardSurface:u,columnCornerClass:m,renderCard:h}=ne();if(!e||e.keyboard||!t||typeof document>"u")return null;const d=t.color??o;return lt.createPortal(n.jsxs("div",{"data-taskboard-column-clone":!0,"aria-hidden":"true",className:B("pointer-events-none fixed top-0 left-0 z-[1000] flex rotate-1 flex-col overflow-hidden border-t-[3px] bg-neutral-100 shadow-2xl motion-reduce:rotate-0 dark:bg-neutral-800",m,dt(d).edge,Wt(d).clone),style:{width:e.width||void 0,height:e.height||void 0,transform:`translate3d(${e.x-e.grabOffset.x}px, ${e.y-e.grabOffset.y}px, 0)`},children:[n.jsxs("div",{className:"flex items-center gap-2 px-3 pt-3 pb-2",children:[n.jsx(Ht,{className:B("h-3.5 w-3.5 shrink-0",r.muted),"aria-hidden":"true"}),n.jsx("span",{className:B("truncate text-sm font-semibold",r.heading),children:t.title}),n.jsx("span",{className:B("text-xs font-semibold tabular-nums",r.muted),children:s})]}),!t.collapsed&&n.jsx("div",{className:B("flex min-h-0 flex-col px-2 pb-2",l.gap),children:a.map(p=>n.jsx("div",{className:B("rounded-lg",l.cardPad,p.tone?B("shadow-sm ring-1",Ut(p.tone).solid):u),children:h?h(p,{dragging:!1,selected:!1,pending:!1}):n.jsx(Ft,{card:p})},p.id))})]}),document.body)},It=e=>({title:e.title,color:e.color,wip:e.wipLimit===void 0?"":String(e.wipLimit),max:e.maxItems===void 0?"":String(e.maxItems),locked:!!e.locked,accepts:e.accepts??[]});function ma(e,t){const{wipLimit:a,maxItems:s,locked:o,accepts:r,color:l,...u}=e,m={...u,title:t.title.trim()};return t.color&&(m.color=t.color),t.wip.trim()!==""&&(m.wipLimit=Number(t.wip)),t.max.trim()!==""&&(m.maxItems=Number(t.max)),t.locked&&(m.locked=!0),t.accepts.length&&(m.accepts=t.accepts),m}const $e=e=>e.trim()===""||Number.isInteger(Number(e))&&Number(e)>=1,ot=({column:e})=>{const{onEditColumn:t,allColumns:a,text:s,surface:o,color:r}=ne(),[l,u]=i.useState(!1),[m,h]=i.useState(()=>It(e)),d=i.useId();if(!t)return null;const p=Se(r),v=m.title.trim()!==""&&$e(m.wip)&&$e(m.max),S=(a??[]).filter(w=>w.id!==e.id),j=()=>{v&&(t(ma(e,m)),u(!1))};return n.jsx(un,{visible:l,onOpenChange:w=>{w&&h(It(e)),u(w)},placement:"bottom",maxWidth:300,trigger:n.jsx("button",{type:"button","aria-label":s("editColumn",{name:e.title}),className:B("shrink-0 rounded p-1",o.muted,p.hover,p.focusRing),children:n.jsx(hn,{className:"h-3.5 w-3.5","aria-hidden":"true"})}),children:n.jsxs("form",{className:"flex w-64 flex-col gap-3",onSubmit:w=>{w.preventDefault(),j()},children:[n.jsx(He,{size:"sm","aria-label":s("columnName"),placeholder:s("columnName"),value:m.title,onChange:w=>h({...m,title:w.target.value}),onKeyDown:w=>{w.key==="Enter"&&(w.preventDefault(),j())}}),n.jsxs("div",{className:"flex flex-col gap-1.5",children:[n.jsx("span",{className:B("text-xs font-semibold",o.muted),children:s("columnColor")}),n.jsx(Vt,{selectable:!0,size:"sm",defaultExpanded:!0,value:m.color,onSelect:w=>h({...m,color:w})})]}),n.jsxs("div",{className:"flex flex-col gap-1",children:[n.jsx("label",{htmlFor:`${d}-wip`,className:B("text-xs font-semibold",o.muted),children:s("wipLimit")}),n.jsx(He,{id:`${d}-wip`,size:"sm",type:"number",min:1,inputMode:"numeric",placeholder:s("wipLimitHint"),value:m.wip,onChange:w=>h({...m,wip:w.target.value}),"aria-invalid":!$e(m.wip)||void 0})]}),n.jsxs("div",{className:"flex flex-col gap-1",children:[n.jsx("label",{htmlFor:`${d}-max`,className:B("text-xs font-semibold",o.muted),children:s("maxItems")}),n.jsx(He,{id:`${d}-max`,size:"sm",type:"number",min:1,inputMode:"numeric",placeholder:s("maxItemsHint"),value:m.max,onChange:w=>h({...m,max:w.target.value}),"aria-invalid":!$e(m.max)||void 0})]}),n.jsx(mn,{size:"sm",label:s("lockColumn"),description:s("lockColumnHint"),checked:m.locked,onChange:w=>h({...m,locked:w.target.checked})}),S.length>0&&n.jsxs("fieldset",{className:"flex flex-col gap-1.5",children:[n.jsx("legend",{className:B("mb-1 text-xs font-semibold",o.muted),children:s("acceptsFrom")}),S.map(w=>n.jsx(pn,{size:"sm",label:w.title,checked:m.accepts.includes(w.id),onChange:C=>h({...m,accepts:C.target.checked?[...m.accepts,w.id]:m.accepts.filter(x=>x!==w.id)})},w.id)),n.jsx("span",{className:B("text-[11px]",o.muted),children:s("acceptsAny")})]}),n.jsxs("div",{className:"flex justify-end gap-2 pt-1",children:[n.jsx(he,{type:"button",size:"sm",variant:"soft",color:"slate",onClick:()=>u(!1),children:s("cancel")}),n.jsx(he,{type:"submit",size:"sm",color:r,disabled:!v,children:s("save")})]})]})})},rt=44;function en(e,t){return t===void 0?String(e):`${e} / ${t}`}const pa=({column:e,cards:t,count:a,index:s=0,onToggle:o})=>{const{surface:r,text:l,color:u,columnWidth:m,wellSurface:h,columnCornerClass:d,onAddCard:p,draggingColumnId:v,boardMaxItems:S,dropTarget:j}=ne(),w=!!(j&&!j.valid&&j.bucket===Y(e.id,null)),C=Ue(e,S),x=C!==void 0&&a>=C,b=v===e.id,k=e.color??u,N=dt(k),D=Yt(a,e.wipLimit),$=at(!e.collapsed),P=at(!!e.collapsed),O=Se(k),_=o&&n.jsx("button",{type:"button",onClick:o,"aria-expanded":!e.collapsed,"aria-label":l(e.collapsed?"expand":"collapse",{name:e.title}),className:B("rounded p-1",r.muted,O.hover,O.focusRing),children:n.jsx(Kt,{className:B("h-3 w-3 transition-transform motion-reduce:transition-none",!e.collapsed&&"rotate-90")})}),V=n.jsx("span",{"data-column-count":!0,title:e.wipLimit!==void 0?l("wip",{count:a,limit:e.wipLimit}):void 0,className:B("select-none text-xs font-semibold tabular-nums",D==="full"||D==="over"||x?N.wipFull:r.muted),children:en(a,e.wipLimit??C)});return n.jsxs("div",{"data-column-id":e.id,"data-column-target":e.id,"data-flip-key":e.id,"data-column-dragging":b||void 0,"data-full":x||void 0,"data-drop":w?"invalid":void 0,"data-collapsed":e.collapsed?"true":void 0,"data-wip":D,"data-drop-zone":e.collapsed?void 0:!0,style:{width:e.collapsed?rt:m},className:B("relative flex min-h-40 shrink-0 flex-col overflow-hidden border-t-[3px]",d,"transition-[width] duration-200 ease-out motion-reduce:transition-none",N.edge,w?Gt:h,b&&"opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30"),children:[P&&n.jsxs("div",{"aria-hidden":!e.collapsed,inert:!e.collapsed,className:B("absolute inset-y-0 left-0 flex flex-col items-center gap-3 py-3 transition-opacity duration-200 motion-reduce:transition-none",e.collapsed?"opacity-100":"pointer-events-none opacity-0"),style:{width:rt},children:[n.jsx(st,{column:e,index:s}),n.jsx(ot,{column:e}),_,V,n.jsx("span",{className:B("text-sm font-semibold whitespace-nowrap [writing-mode:vertical-rl] select-none",r.heading),children:e.title})]}),$&&n.jsxs("div",{"data-column-body":!0,"aria-hidden":e.collapsed||void 0,inert:e.collapsed,style:{width:m},className:B("flex min-h-0 flex-1 flex-col transition-opacity duration-200 motion-reduce:transition-none",e.collapsed&&"opacity-0"),children:[n.jsxs("div",{className:"flex items-center gap-2 px-3 pt-3 pb-2",children:[n.jsx(st,{column:e,index:s}),n.jsx("span",{className:B("truncate text-sm font-semibold select-none",r.heading),children:e.title}),V,n.jsx("span",{className:"flex-1"}),n.jsx(ot,{column:e}),_]}),n.jsx(ct,{"data-taskboard-scroll":!0,variant:"hover",horizontal:!1,tabIndex:-1,className:"min-h-0 flex-1",contentClassName:"px-2 pt-1 pb-2",children:n.jsx(Jt,{column:e.id,lane:null,cards:t,label:`${e.title}, ${l("cardCount",{count:t.length})}`})}),p&&!x&&n.jsxs("button",{type:"button",onClick:()=>p({column:e.id,lane:null}),className:B("mx-2 mb-2 flex items-center justify-center gap-1 rounded-lg py-1.5 text-sm",r.muted,O.hover,O.focusRing),children:[n.jsx(it,{className:"h-3.5 w-3.5","aria-hidden":"true"}),l("addCard")]})]})]})},ha=5,xe=e=>e!=null&&e!==!1,fa=({icon:e,title:t,subtitle:a,summary:s,actions:o,people:r,variant:l})=>{const{surface:u,text:m}=ne();return n.jsxs("div",{"data-taskboard-header":!0,className:B("flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3",u.divider),children:[xe(e)&&n.jsx("div",{className:B("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",fn(l,"neutral"),u.body),children:e}),(xe(t)||xe(a))&&n.jsxs("div",{className:"min-w-0",children:[xe(t)&&n.jsx("div",{className:B("truncate text-lg font-bold leading-tight",u.heading),children:t}),xe(a)&&n.jsx("div",{className:B("truncate text-xs",u.muted),children:a})]}),n.jsx("div",{className:"flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2",children:xe(s)&&s}),r&&r.length>0&&n.jsx(gn,{"data-taskboard-people":!0,role:"group","aria-label":m("online",{count:r.length}),className:"shrink-0",size:"sm",maxVisible:ha,items:r.map(h=>({name:h.name,image:h.avatarUrl,tone:h.color??Fe(h.id)}))}),xe(o)&&n.jsx("div",{className:"flex items-center gap-1",children:o})]})},ga=220,ba=180,ka=({cards:e,columns:t,lanes:a,buckets:s,onToggleLane:o,onToggleColumn:r,onAddColumn:l})=>{const{surface:u,text:m,color:h,columnWidth:d,stickySurface:p,draggingColumnId:v,boardMaxItems:S}=ne(),j=new Set(t.filter(k=>Qn(e,k,S)).map(k=>k.id)),w=Se(h),C=[`${ga}px`,...t.map(k=>{const N=k.collapsed?rt:d;return typeof N=="number"?`${N}px`:N}),...l?[`${ba}px`]:[]].join(" "),x=B("border-b border-r",u.divider),b=(k,N,D)=>n.jsx("button",{type:"button",onClick:D,"aria-expanded":!k,"aria-label":m(k?"expand":"collapse",{name:N}),className:B("rounded p-1",u.muted,w.hover,w.focusRing),children:n.jsx(Kt,{className:B("h-3 w-3 transition-transform motion-reduce:transition-none",!k&&"rotate-90")})});return n.jsx(ct,{"data-taskboard-scroll":!0,variant:"hover",tabIndex:-1,className:"min-h-0 flex-1",children:n.jsxs("div",{"data-lane-grid":!0,className:"grid w-max transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none",style:{gridTemplateColumns:C},children:[n.jsx("div",{className:B("sticky top-0 left-0 z-30",p,x)}),t.map((k,N)=>{const D=Ee(e,k.id),$=Yt(D,k.wipLimit);return n.jsxs("div",{"data-lane-column-header":k.id,"data-column-target":k.id,"data-flip-key":k.id,"data-column-dragging":v===k.id||void 0,"data-wip":$,className:B("sticky top-0 z-20 flex items-center gap-2 overflow-hidden px-3 py-2.5",p,x,v===k.id&&"opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30"),children:[n.jsx(st,{column:k,index:N}),!k.collapsed&&n.jsx("span",{className:B("truncate text-xs font-semibold uppercase tracking-wider select-none",u.body),children:k.title}),n.jsx("span",{className:"flex-1"}),n.jsx("span",{"data-column-count":!0,className:B("select-none rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",$==="full"||$==="over"||j.has(k.id)?dt(k.color??h).wipFull:u.muted),children:en(D,k.wipLimit??Ue(k,S))}),n.jsx(ot,{column:k}),r&&b(k.collapsed,k.title,()=>r(k.id))]},k.id)}),l&&n.jsx("div",{className:B("sticky top-0 z-20",p,x),children:n.jsx(Zt,{variant:"header",onAdd:l})}),a.map(k=>n.jsx(xa,{lane:k,count:Gn(e,k.id,a),columns:t,buckets:s,cellBorder:x,trailingCell:!!l,fullColumns:j,caret:o&&b(k.collapsed,k.title,()=>o(k.id))},k.id))]})})},xa=({lane:e,count:t,columns:a,buckets:s,cellBorder:o,caret:r,trailingCell:l,fullColumns:u})=>{const{surface:m,text:h,color:d,stickySurface:p,onAddCard:v,dropTarget:S}=ne(),j=S&&!S.valid?S.bucket:null,w=Se(d),C=!e.collapsed,x=at(C);return n.jsxs("div",{"data-lane-id":e.id,"data-collapsed":e.collapsed?"true":void 0,className:"contents",children:[n.jsxs("div",{className:B("sticky left-0 z-10 flex items-start gap-2 px-3 py-3",p,o),children:[r,n.jsx("span",{className:B("min-w-0 flex-1 truncate pt-0.5 text-sm font-semibold",m.heading),children:e.title}),n.jsx("span",{"data-lane-count":!0,className:B("rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",m.muted),children:t})]}),a.map(b=>n.jsx("div",{"data-flip-key":`${b.id}:${e.id}`,"data-drop-zone":C&&!b.collapsed?!0:void 0,"data-drop":j===Y(b.id,e.id)?"invalid":void 0,className:B(o,j===Y(b.id,e.id)&&Gt),children:n.jsx("div",{"data-lane-cell":!0,className:B("grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",C?"grid-rows-[1fr]":"grid-rows-[0fr]"),children:n.jsx("div",{className:"min-h-0 overflow-hidden",inert:!C,"aria-hidden":!C||void 0,children:x&&!b.collapsed&&n.jsxs("div",{className:"flex flex-col gap-1 p-2",children:[n.jsx(Jt,{column:b.id,lane:e.id,cards:s.get(Y(b.id,e.id))??[],label:`${b.title}, ${e.title}`}),v&&!u.has(b.id)&&n.jsx("button",{type:"button",onClick:()=>v({column:b.id,lane:e.id}),"aria-label":`${h("addCard")} — ${b.title}, ${e.title}`,className:B("flex items-center justify-center rounded-md py-1 opacity-60 hover:opacity-100 focus-visible:opacity-100",m.muted,w.hover,w.focusRing),children:n.jsx(it,{className:"h-3.5 w-3.5","aria-hidden":"true"})})]})})})},b.id)),l&&n.jsx("div",{"aria-hidden":"true",className:o})]})},ya="bg-white shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",va=({drag:e,card:t})=>{const{renderCard:a,size:s,color:o}=ne();return!e||e.keyboard||!t||typeof document>"u"?null:lt.createPortal(n.jsx("div",{"data-taskboard-clone":!0,"aria-hidden":"true",className:B("pointer-events-none fixed top-0 left-0 z-[1000] rotate-1 rounded-lg motion-reduce:rotate-0",t.tone?B("shadow-2xl ring-1",Ut(t.tone).solid):ya,Wt(o).clone,s.cardPad,!e.valid&&e.to&&"cursor-not-allowed opacity-80"),style:{width:e.width||void 0,transform:`translate3d(${e.x-e.grabOffset.x}px, ${e.y-e.grabOffset.y}px, 0)`},children:a?a(t,{dragging:!0,selected:!1,pending:!1}):n.jsx(Ft,{card:t})}),document.body)},Ca=4,wa=250,Sa=8,we=48,ja=16,Rt=(e,t)=>e.column===t.column&&e.lane===t.lane&&e.index===t.index;function Ta(e){const t=e?.closest("[data-bucket]")??e?.closest("[data-drop-zone]")?.querySelector("[data-bucket]");if(!t)return null;const a=t.getAttribute("data-bucket-column"),s=t.getAttribute("data-bucket-lane");return a===null?null:{column:a,lane:s||null,el:t}}function Ba(e){const[t,a]=i.useState(null),[s,o]=i.useState(null),r=i.useRef(e);r.current=e;const l=i.useRef(null),u=i.useRef(null),m=i.useRef(!1),h=i.useRef({x:0,y:0}),d=i.useRef(null),p=i.useRef(null),v=i.useRef(null),S=i.useCallback(c=>{l.current=c,a(c)},[]),j=()=>{const c=r.current;return{cards:c.cards,columns:c.columns,lanes:c.lanes,heldBy:c.heldBy,selfId:c.selfId,maxItems:c.maxItems}},w=i.useCallback((c,g)=>{const f=l.current;if(!f)return;const T=Ta(document.elementFromPoint?.(c,g)??null);let M=null,I=!1;if(T){const E=[...T.el.querySelectorAll("[data-card-id]")].map(X=>{const K=X.getBoundingClientRect();return{id:X.getAttribute("data-card-id"),top:K.top,height:K.height}}),z=f.to&&f.to.column===T.column&&f.to.lane===T.lane?f.to.index:null,W=Jn(E,g,f.cardId,z);M={column:T.column,lane:T.lane,index:W},I=Qt(j(),{cardId:f.cardId,from:f.from,to:M}).ok}const A=!f.to!=!M||f.to&&M&&!Rt(f.to,M)||f.valid!==I;S({...f,x:c,y:g,to:M,valid:I}),A&&r.current.onDragTarget?.(f.cardId,I?M:null)},[S]),C=i.useCallback(()=>{if(d.current=null,!l.current)return;const{x:c,y:g}=h.current;let f=!1;for(const T of document.querySelectorAll("[data-taskboard-scroll]")){const M=T.matches('[data-slot="scrollarea"]')?T.querySelector(':scope > [data-slot="scrollarea-viewport"]'):T;if(!M)continue;const I=M.getBoundingClientRect();if(c<I.left||c>I.right||g<I.top||g>I.bottom)continue;const A=W=>Math.ceil((we-W)/we*ja);let E=0,z=0;c-I.left<we?E=-A(c-I.left):I.right-c<we&&(E=A(I.right-c)),g-I.top<we?z=-A(g-I.top):I.bottom-g<we&&(z=A(I.bottom-g)),E&&M.scrollWidth>M.clientWidth&&(M.scrollLeft+=E,f=!0),z&&M.scrollHeight>M.clientHeight&&(M.scrollTop+=z,f=!0)}f&&(w(c,g),d.current=requestAnimationFrame(C))},[w]),x=i.useCallback(()=>{const c=u.current;c?.timer&&clearTimeout(c.timer),u.current=null,d.current!==null&&cancelAnimationFrame(d.current),d.current=null,p.current?.(),p.current=null,v.current!==null&&(document.body.style.userSelect=v.current,v.current=null)},[]),b=i.useCallback(c=>{const g=l.current;x(),g&&(S(null),r.current.onDragEnd?.(g.cardId,!1))},[x,S]),k=i.useCallback(async()=>{const c=l.current;if(x(),!c)return!1;S(null),c.keyboard||(m.current=!0,setTimeout(()=>{m.current=!1},0));const g=r.current;if(!c.to||!c.valid||Rt(c.from,c.to))return g.onDragEnd?.(c.cardId,!1),!1;const f={cardId:c.cardId,from:c.from,to:c.to};if(!g.onBeforeMove)return g.onCommit(f),g.onDragEnd?.(c.cardId,!0),!0;o(f);let T=!1;try{T=await g.onBeforeMove(f)}catch{T=!1}return o(null),T&&r.current.onCommit(f),r.current.onDragEnd?.(c.cardId,T),T},[x,S]),N=i.useCallback((c,g)=>{const f=r.current;if(!f.editable||c.locked||l.current)return!1;const T=f.heldBy?.get(c.id);return T&&T!==f.selfId?!1:(S({cardId:c.id,from:g,to:g,valid:!0,x:0,y:0,grabOffset:{x:0,y:0},width:0,keyboard:!0}),f.onDragStart?.(c.id),f.onDragTarget?.(c.id,g),!0)},[S]),D=i.useCallback(c=>{const g=l.current;g&&(S({...g,to:c,valid:!0}),r.current.onDragTarget?.(g.cardId,c))},[S]),$=i.useCallback((c,g,f)=>{v.current===null&&(v.current=document.body.style.userSelect,document.body.style.userSelect="none"),window.getSelection?.()?.removeAllRanges(),S({cardId:c.cardId,from:c.from,to:c.from,valid:!0,x:g,y:f,grabOffset:c.grabOffset,width:c.width}),r.current.onDragStart?.(c.cardId),w(g,f)},[w,S]),P=i.useCallback(c=>{const g=u.current;if(!g)return;const{clientX:f,clientY:T}=c;if(h.current={x:f,y:T},!l.current){const M=Math.hypot(f-g.startX,T-g.startY);if(g.touch){if(!g.armed){M>Sa&&x();return}$(g,f,T);return}if(M<Ca)return;$(g,f,T);return}w(f,T),d.current===null&&typeof requestAnimationFrame=="function"&&(d.current=requestAnimationFrame(C))},[C,x,$,w]),O=i.useCallback((c,g,f)=>{const T=r.current;if(!T.editable||f.button!==0||c.locked)return;const M=T.heldBy?.get(c.id);if(M&&M!==T.selfId)return;x();const I=f.currentTarget.getBoundingClientRect(),A=f.pointerType==="touch",E={cardId:c.id,from:g,startX:f.clientX,startY:f.clientY,touch:A,armed:!1,timer:null,grabOffset:{x:f.clientX-I.left,y:f.clientY-I.top},width:I.width};A&&(E.timer=setTimeout(()=>{E.armed=!0,E.timer=null},wa)),u.current=E,h.current={x:f.clientX,y:f.clientY};const z=()=>{l.current?k():x()},W=()=>b("pointercancel"),X=Q=>{Q.key==="Escape"&&l.current&&(Q.preventDefault(),b("escape"))},K=Q=>{l.current&&Q.preventDefault()};window.addEventListener("pointermove",P),window.addEventListener("pointerup",z),window.addEventListener("pointercancel",W),window.addEventListener("keydown",X),window.addEventListener("touchmove",K,{passive:!1}),p.current=()=>{window.removeEventListener("pointermove",P),window.removeEventListener("pointerup",z),window.removeEventListener("pointercancel",W),window.removeEventListener("keydown",X),window.removeEventListener("touchmove",K)}},[b,x,k,P]);i.useEffect(()=>{const c=l.current;c&&!e.cards.some(g=>g.id===c.cardId)&&b("removed")},[e.cards,b]),i.useEffect(()=>()=>x(),[x]);const _=i.useMemo(()=>{const{cards:c,columns:g,lanes:f}=e;return s?Ae(c,s,g,f):t?.to&&t.valid?Ae(c,{cardId:t.cardId,from:t.from,to:t.to},g,f):c},[e.cards,e.columns,e.lanes,t,s]),V=i.useCallback((c,g)=>({onPointerDown:f=>O(c,g,f),onClickCapture:f=>{m.current&&(m.current=!1,f.preventDefault(),f.stopPropagation())}}),[O]);return{drag:t,pending:s,previewCards:_,cardHandlers:V,cancel:b,finish:k,keyboardGrab:N,keyboardMove:D}}const Na=e=>e?.closest("[dir]")?.getAttribute("dir")==="rtl";function Ma(e){const{rootRef:t,cards:a,viewCards:s,columns:o,lanes:r,text:l,drag:u}=e,[m,h]=i.useState(""),[d,p]=i.useState(null),[v,S]=i.useState([]),j=e.selectedIds??v,w=i.useRef(null),C=i.useRef(null),x=i.useMemo(()=>Le(s,o,r),[s,o,r]),b=i.useMemo(()=>{for(const c of x.values())if(c.length)return c[0].id;return null},[x]),k=d&&s.some(c=>c.id===d)?d:b;i.useLayoutEffect(()=>{const c=C.current;c&&(C.current=null,t.current?.querySelector(`[data-card-id="${CSS.escape(c)}"]`)?.focus())});const N=i.useCallback(c=>h(c),[]),D=i.useCallback(c=>o.find(g=>g.id===c)?.title??c,[o]),$=i.useCallback((c,g)=>{const T=(Le(a.filter(A=>A.id!==c),o,r).get(Y(g.column,g.lane))?.length??0)+1,M={column:D(g.column),index:g.index+1,total:T},I=g.lane?r?.find(A=>A.id===g.lane)?.title:void 0;N(I?l("movedLane",{...M,lane:I}):l("moved",M))},[N,a,o,r,D,l]),P=i.useCallback(c=>{e.selectedIds===void 0&&S(c),e.onSelectionChange?.(c)},[e]),O=i.useCallback((c,g)=>{const f=t.current,T=c.closest("[data-bucket]");if(!f||!T)return;const M=[...T.querySelectorAll("[data-card-id]")],I=M.indexOf(c);let A;if(g==="up"||g==="down")A=M[I+(g==="down"?1:-1)];else{const z=g==="left"||g==="right"?"data-bucket-lane":"data-bucket-column",W=T.getAttribute(z)??"",X=[...f.querySelectorAll(`[data-bucket][${z}="${CSS.escape(W)}"]`)],K=g==="right"||g==="lane-down"?1:-1;for(let Q=X.indexOf(T)+K;Q>=0&&Q<X.length;Q+=K){const G=X[Q].querySelectorAll("[data-card-id]");if(G.length){A=G[Math.min(I,G.length-1)];break}}}A?.focus()},[t]),_=(c,g)=>{const f=Na(g);switch(c.key){case"ArrowUp":return c.altKey?"lane-up":"up";case"ArrowDown":return c.altKey?"lane-down":"down";case"ArrowLeft":return f?"right":"left";case"ArrowRight":return f?"left":"right";default:return null}};return{cardProps:i.useCallback((c,g)=>({tabIndex:c.id===k?0:-1,onFocus:()=>p(c.id),onClick:f=>{const T=j;if(f.ctrlKey||f.metaKey){f.preventDefault(),w.current=c.id,P(T.includes(c.id)?T.filter(M=>M!==c.id):[...T,c.id]);return}if(f.shiftKey&&w.current){f.preventDefault();const M=x.get(Y(g.column,g.lane))??[],I=M.findIndex(E=>E.id===w.current),A=M.findIndex(E=>E.id===c.id);if(I!==-1&&A!==-1){const E=M.slice(Math.min(I,A),Math.max(I,A)+1).map(z=>z.id);P([...T.filter(z=>!E.includes(z)),...E]);return}}w.current=c.id,P([c.id])},onKeyDown:f=>{const T=u?.keyboard&&u.cardId===c.id,M=f.currentTarget;if(T){const A=_(f,M);if(A){f.preventDefault();const E=Zn({cards:a,columns:o,lanes:r,heldBy:e.heldBy,selfId:e.selfId,maxItems:e.maxItems},u.to??u.from,c.id,A);E&&(e.keyboardMove(E),C.current=c.id,$(c.id,E))}else if(f.key===" "||f.key==="Spacebar"){f.preventDefault();const E=u.to??u.from;C.current=c.id,N(l("dropped",{title:c.title,column:D(E.column)})),e.finish().then(z=>{!z&&(E.column!==u.from.column||E.lane!==u.from.lane||E.index!==u.from.index)&&N(l("cancelled"))})}else f.key==="Escape"?(f.preventDefault(),C.current=c.id,e.cancel("escape"),N(l("cancelled"))):f.key==="Tab"?(e.cancel("blur"),N(l("cancelled"))):f.key==="Enter"&&f.preventDefault();return}if(f.key===" "||f.key==="Spacebar"){f.preventDefault(),e.keyboardGrab(c,g)&&(C.current=c.id,N(l("grabbed",{title:c.title})));return}if(f.key==="F10"&&f.shiftKey||f.key==="ContextMenu"){if(!e.onCardContextMenu)return;f.preventDefault();const A=M.getBoundingClientRect();e.onCardContextMenu({card:c,column:g.column,lane:g.lane,index:g.index,x:A.left+A.width/2,y:A.top+A.height/2,event:f});return}const I=_(f,M);I&&(f.preventDefault(),O(M,I))}}),[k,j,P,x,u,a,o,r,e,$,N,l,D,O]),message:m,selection:j,announce:N}}const Ia=4,Et=e=>e?.closest("[dir]")?.getAttribute("dir")==="rtl";function Ra(e){const[t,a]=i.useState(null),s=i.useRef(e);s.current=e;const o=i.useRef(null),r=i.useRef(null),l=i.useRef(null),u=i.useRef(null),m=i.useCallback(C=>{o.current=C,a(C)},[]),h=i.useCallback(()=>{r.current?.(),r.current=null,l.current!==null&&(document.body.style.userSelect=l.current,l.current=null)},[]),d=i.useCallback(()=>{h(),m(null)},[h,m]),p=i.useCallback(()=>{const C=o.current;return h(),m(null),!C||C.to===C.from?!1:(s.current.onCommit(Mt(s.current.columns,C.id,C.to)),!0)},[h,m]);i.useLayoutEffect(()=>{const C=u.current;C&&(u.current=null,e.rootRef.current?.querySelector(`[data-column-grip="${CSS.escape(C)}"]`)?.focus())}),i.useEffect(()=>()=>h(),[h]);const v=i.useCallback((C,x,b)=>{if(!s.current.enabled||b.button!==0)return;b.preventDefault(),h();const N=(b.currentTarget.closest("[data-column-target]")??b.currentTarget).getBoundingClientRect(),D={x:b.clientX,y:b.clientY},$={x:b.clientX-N.left,y:b.clientY-N.top};let P=b.clientX;const O=c=>{const{clientX:g,clientY:f}=c;let T=o.current;if(!T){if(Math.hypot(g-D.x,f-D.y)<Ia)return;l.current===null&&(l.current=document.body.style.userSelect,document.body.style.userSelect="none"),T={id:C.id,from:x,to:x,x:g,y:f,grabOffset:$,width:N.width,height:N.height}}const M=Math.sign(g-P);P=g;const I=s.current.rootRef.current,A=I?[...I.querySelectorAll("[data-column-target]")].map(z=>{const W=z.getBoundingClientRect();return{id:z.getAttribute("data-column-target"),left:W.left,width:W.width}}):[],E=da(A,g,T.id,T.to,M,Et(I));m({...T,x:g,y:f,to:E})},_=()=>{o.current?p():h()},V=c=>{c.key==="Escape"&&o.current&&(c.preventDefault(),d())};window.addEventListener("pointermove",O),window.addEventListener("pointerup",_),window.addEventListener("pointercancel",d),window.addEventListener("keydown",V),r.current=()=>{window.removeEventListener("pointermove",O),window.removeEventListener("pointerup",_),window.removeEventListener("pointercancel",d),window.removeEventListener("keydown",V)}},[d,p,h,m]),S=i.useCallback((C,x,b)=>{const k=s.current;if(!k.enabled)return;const N=o.current,D=k.columns.length;if(!N||!N.keyboard||N.id!==C.id){(b.key===" "||b.key==="Enter")&&(b.preventDefault(),m({id:C.id,from:x,to:x,x:0,y:0,grabOffset:{x:0,y:0},width:0,height:0,keyboard:!0}),u.current=C.id,k.announce(k.text("columnGrabbed",{name:C.title})));return}if(b.key==="ArrowLeft"||b.key==="ArrowRight"){b.preventDefault();const $=b.key==="ArrowRight"!==Et(b.currentTarget),P=Math.max(0,Math.min(D-1,N.to+($?1:-1)));if(P===N.to)return;m({...N,to:P}),u.current=C.id,k.announce(k.text("columnMoved",{name:C.title,index:P+1,total:D}))}else b.key===" "||b.key==="Enter"?(b.preventDefault(),u.current=C.id,p()):(b.key==="Escape"||b.key==="Tab")&&(b.key==="Escape"&&b.preventDefault(),u.current=b.key==="Escape"?C.id:null,d(),k.announce(k.text("cancelled")))},[d,p,m]),j=i.useMemo(()=>t&&t.to!==t.from?Mt(e.columns,t.id,t.to):e.columns,[t,e.columns]),w=i.useCallback((C,x)=>({"data-column-grip":C.id,"aria-label":e.text("moveColumn",{name:C.title}),onPointerDown:b=>v(C,x,b),onKeyDown:b=>S(C,x,b)}),[e.text,v,S]);return{drag:t,previewColumns:j,gripProps:w}}function Ea(e,t){const a=i.useRef(new Map),s=i.useRef(t);i.useLayoutEffect(()=>{const o=e.current;if(!o)return;const r=s.current!==t;s.current=t;const l=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,u=new Map;for(const m of o.querySelectorAll("[data-flip-key]")){const h=m.getAttribute("data-flip-key"),d=m.offsetLeft;u.set(h,d);const p=a.current.get(h);!r||l||p===void 0||p===d||(m.style.transition="none",m.style.transform=`translateX(${p-d}px)`,requestAnimationFrame(()=>{m.style.transition=`transform ${nt}ms ease-out`,m.style.transform="",window.setTimeout(()=>{m.style.transform===""&&(m.style.transition="")},nt+50)}))}a.current=u})}const La=1e3;function Aa(e,t){const[a,s]=i.useState(Bt),o=!!(e&&t),r=i.useRef(!1),l=i.useRef(t);l.current=t;const u=i.useRef({last:0,timer:null}),m=i.useCallback(x=>{if(!r.current)return;const b=Date.now();s(k=>sa(k,x,b))},[]),h=i.useCallback(x=>{e&&(Lt(e,x),m(x))},[e,m]),d=t?.id;i.useEffect(()=>{if(!e||!d)return;r.current=!0;const x=()=>{const O=l.current;O&&h({type:"presence",user:O,at:Date.now()})},b=new Set,k=e.subscribe(O=>{if(!r.current)return;const _=O;_?.type==="presence"&&typeof _.user?.id=="string"&&_.user.id!==d?b.has(_.user.id)||(b.add(_.user.id),x()):_?.type==="leave"&&typeof _.userId=="string"&&b.delete(_.userId),m(O)}),N=()=>Lt(e,{type:"leave",userId:d,at:Date.now()});x();const D=setInterval(x,ea),$=setInterval(()=>{r.current&&s(O=>oa(O,Date.now()))},La);window.addEventListener("pagehide",N);const P=u.current;return()=>{r.current=!1,clearInterval(D),clearInterval($),P.timer&&clearTimeout(P.timer),window.removeEventListener("pagehide",N),N(),k(),s(Bt())}},[e,d,m,h]);const p=i.useCallback(x=>{d&&h({type:"grab",userId:d,cardId:x,at:Date.now()})},[h,d]),v=i.useCallback((x,b)=>{if(!d)return;const k=u.current,N=()=>{k.last=Date.now(),k.timer=null,h({type:"hover",userId:d,cardId:x,column:b.column,lane:b.lane,index:b.index,at:k.last})};k.timer&&clearTimeout(k.timer);const D=ta-(Date.now()-k.last);D<=0?N():k.timer=setTimeout(N,D)},[h,d]),S=i.useCallback((x,b)=>{if(!d)return;const k=u.current;k.timer&&clearTimeout(k.timer),k.timer=null,h({type:"release",userId:d,cardId:x,dropped:b,at:Date.now()})},[h,d]),j=i.useMemo(()=>[...a.peers.values()].map(x=>x.user).filter(x=>x.id!==d),[a.peers,d]),w=i.useMemo(()=>{const x=new Map;for(const[b,k]of a.holds)x.set(b,k.userId);return x},[a.holds]),C=i.useCallback(x=>a.peers.get(x)?.user??{id:x,name:x},[a.peers]);return o?{presence:a,peers:j,heldBy:w,userById:C,grab:p,hover:v,release:S}:{presence:a,peers:[],heldBy:w,userById:C,grab:Qe,hover:Qe,release:Qe}}function Qe(){}function Lt(e,t){try{e.publish(t)}catch{}}const At=40,Da=({rootRef:e,holds:t,selfId:a,cards:s,userById:o})=>{const[r,l]=i.useState([]),[u,m]=i.useState(0);return i.useLayoutEffect(()=>{const h=e.current;if(!h)return;const d=()=>m(p=>p+1);return h.addEventListener("scroll",d,!0),window.addEventListener("resize",d),()=>{h.removeEventListener("scroll",d,!0),window.removeEventListener("resize",d)}},[e]),i.useLayoutEffect(()=>{const h=e.current;if(!h)return;const d=[];for(const[p,v]of t){if(v.userId===a||!v.hover)continue;const S=Y(v.hover.column,v.hover.lane),j=h.querySelector(`[data-bucket="${CSS.escape(S)}"]`);if(!j)continue;const w=[...j.querySelectorAll("[data-card-id]")].filter(N=>N.getAttribute("data-card-id")!==p),C=j.getBoundingClientRect(),x=w[v.hover.index],b=w[w.length-1],k=x?x.getBoundingClientRect().top-At/2:b?b.getBoundingClientRect().bottom+4:C.top;d.push({key:`${v.userId}:${p}`,peer:o(v.userId),bucket:S,title:s.find(N=>N.id===p)?.title??"",top:k,left:C.left,width:C.width})}l(d)},[e,t,a,s,o,u]),!r.length||typeof document>"u"?null:lt.createPortal(n.jsx(n.Fragment,{children:r.map(h=>{const d=bn(h.peer.color??Fe(h.peer.id));return n.jsxs("div",{"data-taskboard-ghost":!0,"data-peer-id":h.peer.id,"data-ghost-bucket":h.bucket,"aria-hidden":"true",className:B("pointer-events-none fixed z-[900] flex items-center rounded-lg border-2 border-dashed px-3 text-xs font-medium shadow-sm backdrop-blur-sm transition-transform duration-150 ease-out motion-reduce:transition-none",d.ghost),style:{top:0,left:0,width:h.width,height:At,transform:`translate3d(${h.left}px, ${h.top}px, 0)`},children:[n.jsx("span",{className:"truncate opacity-80",children:h.title}),n.jsx("span",{className:B("absolute -top-2.5 right-2 rounded px-1.5 py-0.5 text-[10px] leading-none",d.label),children:h.peer.name})]},h.key)})}),document.body)},Dt=[[72,96,64],[88,64],[64,104,72],[96,72,88,64],[72]],Pa=({columns:e,columnWidth:t,wellSurface:a,cornerClass:s})=>n.jsx("div",{"data-taskboard-skeleton":!0,"aria-hidden":"true",className:"flex min-h-0 flex-1 gap-3 overflow-hidden p-3",children:Array.from({length:Math.max(1,e)},(o,r)=>n.jsxs("div",{style:{width:t},className:B("flex shrink-0 flex-col gap-2 p-3",s,a),children:[n.jsx("div",{className:"mb-1 h-3.5 w-24 animate-pulse rounded bg-black/10 motion-reduce:animate-none dark:bg-white/10"}),Dt[r%Dt.length].map((l,u)=>n.jsx("div",{style:{height:l},className:"animate-pulse rounded-lg bg-black/[0.06] motion-reduce:animate-none dark:bg-white/[0.08]"},u))]},r))}),Oa={root:"kit.taskboard.root",loading:"kit.taskboard.loading",empty:"kit.taskboard.empty",error:"kit.taskboard.error",retry:"kit.taskboard.retry",addCard:"kit.taskboard.addCard",collapse:"kit.taskboard.collapse",expand:"kit.taskboard.expand",cardCount:"kit.taskboard.cardCount",wip:"kit.taskboard.wip",grabbed:"kit.taskboard.grabbed",moved:"kit.taskboard.moved",movedLane:"kit.taskboard.movedLane",dropped:"kit.taskboard.dropped",cancelled:"kit.taskboard.cancelled",held:"kit.taskboard.held",heldShort:"kit.taskboard.heldShort",notAllowed:"kit.taskboard.notAllowed",pending:"kit.taskboard.pending",online:"kit.taskboard.online",notes:"kit.taskboard.notes",checklist:"kit.taskboard.checklist",subtasks:"kit.taskboard.subtasks",due:"kit.taskboard.due",addColumn:"kit.taskboard.addColumn",columnName:"kit.taskboard.columnName",moveColumn:"kit.taskboard.moveColumn",columnGrabbed:"kit.taskboard.columnGrabbed",columnMoved:"kit.taskboard.columnMoved",editColumn:"kit.taskboard.editColumn",columnColor:"kit.taskboard.columnColor",wipLimit:"kit.taskboard.wipLimit",wipLimitHint:"kit.taskboard.wipLimitHint",lockColumn:"kit.taskboard.lockColumn",lockColumnHint:"kit.taskboard.lockColumnHint",acceptsFrom:"kit.taskboard.acceptsFrom",acceptsAny:"kit.taskboard.acceptsAny",save:"kit.taskboard.save",cancel:"kit.taskboard.cancel",maxItems:"kit.taskboard.maxItems",maxItemsHint:"kit.taskboard.maxItemsHint"},za=(e,t)=>t?e.replace(/\{(\w+)\}/g,(a,s)=>s in t?String(t[s]):a):e;function $a(e){const t=kn();return i.useCallback((a,s)=>{const o=e?.[a];return o!==void 0?za(o,s):t(Oa[a],s)},[t,e])}const _a=2e3,Ha="bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",Fa="bg-white/70 shadow-sm ring-1 ring-white/60 backdrop-blur-md dark:bg-white/10 dark:ring-white/10",Ua="bg-black/[0.03] dark:bg-white/[0.04]",Wa="bg-white/25 dark:bg-white/5",Va="bg-white dark:bg-neutral-900",Ka="bg-white/80 backdrop-blur-md dark:bg-neutral-900/70",Pt=e=>{const{cards:t,columns:a,lanes:s,layout:o="columns",priorities:r,cardLayout:l="detailed",subtaskMaxVisible:u=3,renderCard:m,onCardsChange:h,onColumnsChange:d,onLanesChange:p,onBeforeMove:v,editable:S,editMode:j=!1,autoCollapseEmpty:w=!1,maxItems:C,onCardOpen:x,onCardContextMenu:b,onAddCard:k,selectedIds:N,onSelectionChange:D,transport:$,currentUser:P,icon:O,title:_,subtitle:V,summary:c,actions:g,loading:f,loaderType:T="skeleton",error:M,onRetry:I,emptyState:A,color:E="blue",size:z="md",columnWidth:W="auto",labels:X,columnCorner:K="rounded-md",surfaceVariant:Q}=e,G=yn(),J=$a(X),{locale:je}=vn(),ye=vt[z]??vt.md,se=typeof W=="string"?W.trim():W,Te=se==="auto"||se===""||typeof se=="number"&&(!Number.isFinite(se)||se<=0)?ye.columnWidth:se,ge=G.translucent?Wa:Ua,ce=Cn(K),oe=i.useRef(null),be=S??!!h,ve=o==="lanes"&&!!s?.length,ue=ve?s:void 0,We=y=>h?.(Ae(t,y,a,ue),y),U=Aa($,P),Z=P?.id,{drag:H,pending:Be,previewCards:re,cardHandlers:Ne,cancel:R,finish:F,keyboardGrab:De,keyboardMove:tn}=Ba({cards:t,columns:a,lanes:ue,editable:be,heldBy:U.heldBy,selfId:Z,maxItems:C,onBeforeMove:v,onCommit:We,onDragStart:U.grab,onDragTarget:(y,L)=>L&&U.hover(y,L),onDragEnd:U.release}),[ke,mt]=i.useState(null);i.useEffect(()=>{if(!H||!Z)return;const y=U.heldBy.get(H.cardId);if(!y||y===Z)return;const L=U.userById(y);R("held"),mt({cardId:H.cardId,text:J("heldShort",{name:L.name}),color:L.color??Fe(L.id)})},[U,H,Z,R,J]),i.useEffect(()=>{if(!ke)return;const y=setTimeout(()=>mt(null),_a);return()=>clearTimeout(y)},[ke]);const Me=Ma({rootRef:oe,cards:t,viewCards:re,columns:a,lanes:ue,text:J,drag:H,keyboardGrab:De,keyboardMove:tn,finish:F,cancel:R,heldBy:U.heldBy,selfId:Z,maxItems:C,onCardContextMenu:b,selectedIds:N,onSelectionChange:D}),pt=i.useMemo(()=>new Set(Me.selection),[Me.selection]),Ce=!!(j&&d),ee=Ra({rootRef:oe,columns:a,enabled:Ce,text:J,announce:Me.announce,onCommit:y=>d?.(y)}),Pe=ee.previewColumns;Ea(oe,Pe.map(y=>y.id).join("|"));const ht=i.useCallback(y=>d?.(a.map(L=>L.id===y.id?y:L)),[a,d]),ft=y=>d?.([...a,{id:ca(y,a),title:y}]),gt=Me.cardProps,bt=i.useCallback(y=>{const L=U.heldBy.get(y);return L&&L!==Z?U.userById(L):void 0},[U,Z]),nn=i.useMemo(()=>({text:J,surface:G,color:E,size:ye,columnWidth:Te,controlSize:z,cardLayout:l,priorities:new Map((r??[]).map(y=>[y.id,y])),locale:je,editable:be,renderCard:m,onCardOpen:x,onCardContextMenu:b,onAddCard:k,cardSurface:G.translucent?Fa:Ha,wellSurface:ge,columnCornerClass:ce,columnGripProps:Ce?ee.gripProps:void 0,draggingColumnId:ee.drag?.id??null,onEditColumn:Ce?ht:void 0,allColumns:a,boardMaxItems:C,subtaskMaxVisible:u,stickySurface:G.translucent?Ka:Va,cardState:y=>({held:bt(y.id),notice:ke?.cardId===y.id?ke.text:void 0,noticeColor:ke?.cardId===y.id?ke.color:void 0,dragging:H?.cardId===y.id&&!H.keyboard,grabbed:H?.cardId===y.id&&!!H.keyboard,selected:pt.has(y.id),pending:Be?.cardId===y.id}),cardProps:(y,L)=>({...be?Ne(y,L):{},...gt(y,L)}),dropTarget:H?.to&&!H.valid?{bucket:Y(H.to.column,H.to.lane),index:H.to.index,valid:!1}:null}),[J,G,E,ye,Te,z,l,u,r,je,be,m,x,b,k,ge,ce,Ce,ee.gripProps,ee.drag,ht,a,C,pt,H,Be,Ne,gt,bt,ke]),kt=i.useMemo(()=>Le(re,a,ue),[re,a,ue]),an=H?t.find(y=>y.id===H.cardId):void 0,Ve=w&&!ve,[xt,sn]=i.useState(()=>new Set),yt=(y,L)=>sn(Ge=>{if(Ge.has(y)===L)return Ge;const qe=new Set(Ge);return L?qe.add(y):qe.delete(y),qe}),Ke=d||Ve?y=>{if(Ve&&Ee(t,y)===0){xt.has(y)?yt(y,!1):(yt(y,!0),a.some(L=>L.id===y&&L.collapsed)&&d?.(a.map(L=>L.id===y?{...L,collapsed:!1}:L)));return}d?.(a.map(L=>L.id===y?{...L,collapsed:!L.collapsed}:L))}:void 0,on=Ve?Pe.map(y=>({...y,collapsed:xt.has(y.id)?!1:!!y.collapsed||Ee(t,y.id)===0})):Pe,rn=p&&s?y=>p(s.map(L=>L.id===y?{...L,collapsed:!L.collapsed}:L)):void 0,ln=f&&T==="skeleton",dn=[O,_,V,c,g].some(y=>y!=null&&y!==!1)||!!($&&P);let Oe;return ln?Oe=n.jsx(Pa,{columns:a.length||4,columnWidth:Te,wellSurface:ge,cornerClass:ce}):M?Oe=n.jsxs("div",{role:"alert",className:"flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center",children:[n.jsx("p",{className:B("text-sm font-medium",G.body),children:M===!0?J("error"):M}),I&&n.jsx(he,{size:"sm",variant:"outline",color:E,onClick:I,children:J("retry")})]}):Oe=n.jsxs("div",{className:"flex min-h-0 flex-1 flex-col",children:[t.length===0&&n.jsx("div",{"data-taskboard-empty":!0,className:B("px-4 pt-4 text-center text-sm",G.muted),children:A??J("empty")}),ve?n.jsx(ka,{cards:re,columns:Pe,onAddColumn:Ce?ft:void 0,lanes:s,buckets:kt,onToggleLane:rn,onToggleColumn:Ke}):n.jsx(ct,{"data-taskboard-scroll":!0,variant:"hover",tabIndex:-1,className:"min-h-0 flex-1",contentClassName:"flex! h-full",children:n.jsxs("div",{"data-taskboard-columns":!0,className:"flex w-max items-stretch gap-3 p-3",children:[on.map((y,L)=>n.jsx(pa,{column:y,index:L,cards:kt.get(Y(y.id,null))??[],count:Ee(re,y.id),onToggle:Ke&&(()=>Ke(y.id))},y.id)),Ce&&n.jsx(Zt,{variant:"column",onAdd:ft})]})})]}),n.jsxs(wn.Provider,{value:nn,children:[n.jsxs("div",{ref:oe,"data-taskboard":!0,role:"application","aria-roledescription":"task board","aria-busy":f?!0:void 0,"aria-label":J("root"),className:"flex h-full min-h-0 flex-col",children:[n.jsx("div",{"data-taskboard-live":!0,"aria-live":"polite","aria-atomic":"true",className:"sr-only",children:Me.message}),dn&&n.jsx(fa,{icon:O,title:_,subtitle:V,summary:c,actions:g,people:$&&P?[P,...U.peers]:void 0,variant:Q}),Oe]}),n.jsx(va,{drag:H,card:an}),n.jsx(ua,{drag:ee.drag,column:a.find(y=>y.id===ee.drag?.id),count:ee.drag?Ee(t,ee.drag.id):0,cards:ee.drag?t.filter(y=>y.column===ee.drag.id):[]}),$&&n.jsx(Da,{rootRef:oe,holds:U.presence.holds,selfId:Z,cards:t,userById:U.userById})]})},ae=e=>{const{variant:t="elevated",tone:a,corner:s="rounded-md",padding:o="none",glassOpacity:r,vibrancy:l,specularMode:u,loading:m,loaderType:h="skeleton",className:d,height:p}=e;return t==="plain"?n.jsx("div",{className:B("flex min-h-0 flex-col",d),style:{height:p},children:n.jsx(Pt,{...e,surfaceVariant:"elevated"})}):n.jsx(xn,{variant:t,tone:a,corner:s,padding:o,glassOpacity:r,vibrancy:l,specularMode:u,loading:!!m&&h!=="skeleton",loaderType:h,flexBody:!0,scrollable:!1,className:d,style:{height:p},children:n.jsx(Pt,{...e,surfaceVariant:t})})},Je=fe.roadmap(),Ot=fe.fieldOps(),Ga={activation:"sky",billing:"amber",enterprise:"violet",analytics:"teal",research:"fuchsia",checkout:"rose",mobile:"indigo",platform:"slate",quote:"sky",retail:"amber",access:"violet","cold-chain":"cyan",security:"rose",handoff:"teal",crew:"lime",safety:"red",baggage:"orange"};function qa(e){const t=e.tags?.[0],a=typeof t=="string"?t:t?.label;return a?Ga[a]??"emerald":void 0}const Ya=[{label:"No limit",value:"none"},...[3,4,5,6].map(e=>({label:String(e),value:String(e)}))],Xa=[{label:"Auto (from size)",value:"auto"},{label:"240 px",value:"240"},{label:"320 px",value:"320"},{label:"400 px",value:"400"}],Qa=[1,2,3,4,5,6].map(e=>({label:String(e),value:String(e)}));function Ja(e,t,a){return e.map(s=>({...s,wipLimit:t&&(s.id==="building"||s.id==="onsite")?s.id==="building"?4:5:void 0,accepts:a&&s.id==="ready"?["discovery"]:void 0,locked:a&&(s.id==="blocked"||s.id==="closed")?!0:void 0}))}const Za=()=>{const[e,t]=$n(),[a,s]=i.useState("columns"),[o,r]=i.useState("detailed"),[l,u]=i.useState("none"),[m,h]=i.useState("elevated"),[d,p]=i.useState("rounded-md"),[v,S]=i.useState("rounded-md"),[j,w]=i.useState(!1),[C,x]=i.useState(!1),[b,k]=i.useState(!1),[N,D]=i.useState("none"),[$,P]=i.useState("none"),[O,_]=i.useState("blue"),[V,c]=i.useState("md"),[g,f]=i.useState("auto"),[T,M]=i.useState("3"),[I,A]=i.useState(!0),[E,z]=i.useState(!0),[W,X]=i.useState(!1),[K,Q]=i.useState(!1),[G,J]=i.useState("skeleton"),[je,ye]=i.useState(!1),[se,Te]=i.useState(!1),ge=a==="lanes"?Ot:Je,[ce,oe]=i.useState(Je.cards),[be,ve]=i.useState(Je.columns),[ue,We]=i.useState(Ot.lanes),U=i.useRef(la()).current,[Z,H]=i.useState(0);i.useEffect(()=>{oe(ge.cards),ve(ge.columns),r(a==="lanes"?"compact":"detailed"),U.clear(),H(0)},[a]);const Be=i.useMemo(()=>Ja(be,E,W),[be,E,W]),re=()=>{const R=U.undo(ce,Be,a==="lanes"?ue:void 0);R&&(oe(R),H(U.size),t("undo"))},Ne=i.useRef(re);return Ne.current=re,i.useEffect(()=>{const R=F=>{if((F.ctrlKey||F.metaKey)&&!F.shiftKey&&F.key.toLowerCase()==="z"){if(F.target?.closest("input, textarea, [contenteditable]"))return;F.preventDefault(),Ne.current()}};return window.addEventListener("keydown",R),()=>window.removeEventListener("keydown",R)},[]),n.jsx(On,{controls:n.jsxs("div",{className:"space-y-3",children:[n.jsx(zn,{groups:[{id:"layout",title:"Layout",controls:n.jsxs(n.Fragment,{children:[n.jsx(Ye,{label:"Layout",options:Hn,value:a,onChange:R=>s(R)}),n.jsx(Ye,{label:"Cards",options:Fn,value:o,onChange:R=>r(R)}),n.jsx(me,{label:"Size",options:Un,value:V,onChange:R=>c(R)}),n.jsx(me,{label:"Subtask dots",options:Qa,value:T,onChange:M}),n.jsx(me,{label:"Column width",options:Xa,value:g,onChange:f})]})},{id:"surface",title:"Surface",controls:n.jsxs(n.Fragment,{children:[n.jsx(Pn,{label:"Surface tone",value:l,onChange:u}),n.jsx(me,{label:"Variant",options:Wn,value:m,onChange:R=>h(R)}),n.jsx(me,{label:"Corner",options:wt,value:d,onChange:R=>p(R)}),n.jsx(me,{label:"Column corner",options:wt,value:v,onChange:R=>S(R)}),n.jsx(me,{label:"Padding",options:Vn,value:$,onChange:R=>P(R)}),n.jsx(Xe,{label:"Accent",children:n.jsx(Vt,{selectable:!0,size:"sm",value:O,onSelect:_,defaultExpanded:!0})})]})},{id:"rules",title:"Rules",controls:n.jsx(Xe,{label:"Rules",children:n.jsxs("div",{className:"space-y-1.5",children:[n.jsx(le,{label:"Editable",checked:I,onChange:A}),n.jsx(le,{label:"Card tones",checked:j,onChange:w}),n.jsx(le,{label:"Edit mode (columns)",checked:C,onChange:x}),n.jsx(le,{label:"Auto-collapse empty",checked:b,onChange:k}),n.jsx(le,{label:"WIP limits",checked:E,onChange:z}),n.jsx(le,{label:"Transition rules + locks",checked:W,onChange:X}),n.jsx(me,{label:"Max items per column",options:Ya,value:N,onChange:D})]})})},{id:"states",title:"States",controls:n.jsxs(n.Fragment,{children:[n.jsx(Xe,{label:"State",children:n.jsxs("div",{className:"space-y-1.5",children:[n.jsx(le,{label:"Loading",checked:K,onChange:Q}),n.jsx(le,{label:"Error",checked:je,onChange:ye}),n.jsx(le,{label:"Empty",checked:se,onChange:Te})]})}),K&&n.jsx(Ye,{label:"Loader type",options:Kn,value:G,onChange:R=>J(R)})]})}]}),n.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Drag a card, or focus one and press ",n.jsx("strong",{children:"Space"})," to pick it up, the ",n.jsx("strong",{children:"arrows"})," to move it and ",n.jsx("strong",{children:"Space"})," again to drop. ",n.jsx("strong",{children:"Ctrl/⌘+Z"})," undoes the last move."]})]}),preview:n.jsxs("div",{className:"flex w-full flex-col gap-2",children:[n.jsx(ae,{tone:l,layout:a,cardLayout:o,cards:se?[]:j?ce.map(R=>({...R,tone:qa(R)})):ce,columns:Be,lanes:ue,priorities:ge.priorities,editable:I,editMode:C,autoCollapseEmpty:b,maxItems:N==="none"?void 0:Number(N),onCardsChange:(R,F)=>{oe(R),U.push(F),H(U.size),t(`onCardsChange → ${F.cardId}: ${F.from.column} → ${F.to.column}[${F.to.index}]`)},onColumnsChange:R=>{ve(R),t(`onColumnsChange → [${R.map(F=>F.id).join(", ")}]`)},onLanesChange:We,onCardOpen:R=>t(`onCardOpen → ${R.id}`),onCardContextMenu:({card:R,x:F,y:De})=>t(`onCardContextMenu → ${R.id} @ ${Math.round(F)},${Math.round(De)}`),onAddCard:({column:R,lane:F})=>t(`onAddCard → ${R}${F?` / ${F}`:""}`),onSelectionChange:R=>t(`onSelectionChange → [${R.join(", ")}]`),loading:K,loaderType:G,error:je||void 0,onRetry:()=>{ye(!1),t("onRetry")},variant:m,corner:d,columnCorner:v,padding:$,color:O,size:V,subtaskMaxVisible:Number(T),columnWidth:g==="auto"?"auto":Number(g),icon:n.jsx(qt,{className:"h-5 w-5"}),title:a==="lanes"?"FieldOps Dispatch":"Horizon Roadmap",subtitle:a==="lanes"?"Regional service lanes · Today":"Q3 launch command center",summary:n.jsxs(pe,{size:"sm",variant:"soft",tone:"slate",children:[ce.length," cards"]}),actions:n.jsxs("span",{className:"relative inline-flex",children:[n.jsx(Sn,{icon:"Revert",size:"sm",variant:"ghost",srLabel:"Undo last move",onClick:re,disabled:Z===0}),Z>0&&n.jsx(jn,{count:Z,size:"xs",tone:"slate",className:"pointer-events-none absolute -top-1 -right-1"})]}),height:540}),n.jsx(_n,{log:e,emptyText:"No events yet — drag, click or right-click a card."})]})})},Ie=fe.roadmap();function es(){const[e,t]=i.useState(Ie.cards),[a,s]=i.useState(null),[o,r]=i.useState(null),l=i.useRef(null),u=e.filter(p=>p.column==="building").length,m=e.filter(p=>p.column==="blocked").length,h=o?[{value:"edit",label:"Edit card",icon:"Edit"},...Ie.columns.filter(p=>p.id!==o.column).map(p=>({value:`move:${p.id}`,label:`Move to ${p.title}`,icon:"ArrowRight"})),{value:"duplicate",label:"Duplicate",icon:"Copy"},{value:"delete",label:"Delete",icon:"Trash",danger:!0}]:[],d=p=>{if(!o)return;const{card:v}=o;if(p.value==="edit"&&s(v),p.value==="duplicate"&&t(S=>[...S,{...v,id:`${v.id}-copy-${S.length}`,title:`${v.title} (copy)`}]),p.value==="delete"&&t(S=>S.filter(j=>j.id!==v.id)),p.value.startsWith("move:")){const S=p.value.slice(5);t(j=>[...j.filter(w=>w.id!==v.id),{...v,column:S}])}r(null)};return n.jsxs("div",{className:"w-full",children:[n.jsx(ae,{cards:e,columns:Ie.columns,priorities:Ie.priorities,onCardsChange:t,onCardOpen:s,onCardContextMenu:r,onAddCard:({column:p})=>t(v=>[...v,{id:`new-${v.length}`,title:"Untitled initiative",column:p}]),icon:n.jsx(qt,{className:"h-5 w-5"}),title:"Horizon Roadmap",subtitle:"Q3 launch command center",summary:n.jsxs(n.Fragment,{children:[n.jsxs(pe,{size:"sm",variant:"soft",tone:"slate",children:[e.length," initiatives"]}),n.jsxs(pe,{size:"sm",variant:"soft",tone:"emerald",children:[u," shipping"]}),n.jsxs(pe,{size:"sm",variant:"soft",tone:"orange",children:[m," blocked"]})]}),height:560}),n.jsx("div",{ref:l,className:"fixed h-0 w-0",style:{left:o?.x??0,top:o?.y??0}}),n.jsx(Tn,{anchorRef:l,open:o!==null,onClose:()=>r(null),items:h,onSelect:d}),n.jsx(Bn,{isOpen:a!==null,onClose:()=>s(null),title:"Edit initiative",subtitle:a?.id,footer:n.jsxs("div",{className:"flex justify-end gap-2",children:[n.jsx(he,{variant:"soft",color:"slate",onClick:()=>s(null),children:"Cancel"}),n.jsx(he,{onClick:()=>{a&&t(p=>p.map(v=>v.id===a.id?a:v)),s(null)},children:"Save"})]}),children:a&&n.jsxs("div",{className:"flex flex-col gap-4 p-1",children:[n.jsx(He,{"aria-label":"Title",value:a.title,onChange:p=>s({...a,title:p.target.value})}),n.jsxs(Nn,{"aria-label":"Priority",value:a.priority??"",onChange:p=>s({...a,priority:p.target.value||void 0}),children:[n.jsx("option",{value:"",children:"No priority"}),Ie.priorities.map(p=>n.jsx("option",{value:p.id,children:p.label},p.id))]})]})})]})}const ts=`import { useRef, useState } from "react";
import {
  Button,
  DropdownMenu,
  Input,
  Pill,
  Select,
  SidePanel,
  TaskBoard,
  ViewGrid,
  sampleTaskBoard,
  type DropdownMenuOption,
  type TaskBoardCard,
  type TaskBoardContextMenuPayload,
} from "@cjlapao/ui-kit";

/**
 * The columns view. The board renders cards; the app owns every surface
 * around them — here a SidePanel editor on click / Enter, and a DropdownMenu
 * anchored where the right-click (or Shift+F10) happened.
 */
const sample = sampleTaskBoard.roadmap();

export default function ProductRoadmap() {
  const [cards, setCards] = useState(sample.cards);
  const [editing, setEditing] = useState<TaskBoardCard | null>(null);
  const [menu, setMenu] = useState<TaskBoardContextMenuPayload | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  const shipping = cards.filter((c) => c.column === "building").length;
  const blocked = cards.filter((c) => c.column === "blocked").length;

  const menuItems: DropdownMenuOption[] = menu
    ? [
        { value: "edit", label: "Edit card", icon: "Edit" },
        ...sample.columns
          .filter((c) => c.id !== menu.column)
          .map((c) => ({ value: \`move:\${c.id}\`, label: \`Move to \${c.title}\`, icon: "ArrowRight" })),
        { value: "duplicate", label: "Duplicate", icon: "Copy" },
        { value: "delete", label: "Delete", icon: "Trash", danger: true },
      ]
    : [];

  const onMenu = (item: DropdownMenuOption) => {
    if (!menu) return;
    const { card } = menu;
    if (item.value === "edit") setEditing(card);
    if (item.value === "duplicate") setCards((cs) => [...cs, { ...card, id: \`\${card.id}-copy-\${cs.length}\`, title: \`\${card.title} (copy)\` }]);
    if (item.value === "delete") setCards((cs) => cs.filter((c) => c.id !== card.id));
    if (item.value.startsWith("move:")) {
      const column = item.value.slice(5);
      setCards((cs) => [...cs.filter((c) => c.id !== card.id), { ...card, column }]);
    }
    setMenu(null);
  };

  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={sample.columns}
        priorities={sample.priorities}
        onCardsChange={setCards}
        onCardOpen={setEditing}
        onCardContextMenu={setMenu}
        onAddCard={({ column }) =>
          setCards((cs) => [...cs, { id: \`new-\${cs.length}\`, title: "Untitled initiative", column }])
        }
        icon={<ViewGrid className="h-5 w-5" />}
        title="Horizon Roadmap"
        subtitle="Q3 launch command center"
        summary={
          <>
            <Pill size="sm" variant="soft" tone="slate">{cards.length} initiatives</Pill>
            <Pill size="sm" variant="soft" tone="emerald">{shipping} shipping</Pill>
            <Pill size="sm" variant="soft" tone="orange">{blocked} blocked</Pill>
          </>
        }
        height={560}
      />

      {/* Zero-size anchor parked where the menu was asked for. */}
      <div ref={anchorRef} className="fixed h-0 w-0" style={{ left: menu?.x ?? 0, top: menu?.y ?? 0 }} />
      <DropdownMenu anchorRef={anchorRef} open={menu !== null} onClose={() => setMenu(null)} items={menuItems} onSelect={onMenu} />

      <SidePanel
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title="Edit initiative"
        subtitle={editing?.id}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="soft" color="slate" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => {
                if (editing) setCards((cs) => cs.map((c) => (c.id === editing.id ? editing : c)));
                setEditing(null);
              }}
            >
              Save
            </Button>
          </div>
        }
      >
        {editing && (
          <div className="flex flex-col gap-4 p-1">
            <Input
              aria-label="Title"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
            <Select
              aria-label="Priority"
              value={editing.priority ?? ""}
              onChange={(e) => setEditing({ ...editing, priority: e.target.value || undefined })}
            >
              <option value="">No priority</option>
              {sample.priorities.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </Select>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
`,_e=fe.fieldOps();function ns(){const[e,t]=i.useState(_e.cards),[a,s]=i.useState(_e.lanes),o=(u="intake",m=a[0].id)=>t(h=>[...h,{id:`job-${h.length+1}`,title:"New service job",column:u,lane:m??void 0,priority:"medium",points:1}]),r=e.filter(u=>u.column==="onsite"||u.column==="scheduled").length,l=e.filter(u=>u.priority==="critical").length;return n.jsx("div",{className:"w-full",children:n.jsx(ae,{layout:"lanes",cardLayout:"compact",size:"sm",color:"emerald",cards:e,columns:_e.columns,lanes:a,priorities:_e.priorities,onCardsChange:t,onLanesChange:s,onAddCard:({column:u,lane:m})=>o(u,m),icon:n.jsx(Mn,{className:"h-5 w-5"}),title:"FieldOps Dispatch",subtitle:"Regional service lanes · Today",summary:n.jsxs(n.Fragment,{children:[n.jsxs(pe,{size:"sm",variant:"soft",tone:"slate",children:[a.length," regions"]}),n.jsxs(pe,{size:"sm",variant:"soft",tone:"sky",children:[r," active jobs"]}),n.jsxs(pe,{size:"sm",variant:"soft",tone:"rose",children:[l," priority"]})]}),actions:n.jsx(he,{size:"sm",color:"emerald",leadingIcon:"Add",onClick:()=>o(),children:"New job"}),height:560})})}const as=`import { useState } from "react";
import { Button, Globe, Pill, TaskBoard, sampleTaskBoard } from "@cjlapao/ui-kit";

/**
 * The swimlane view: columns crossed with regions. Cards cross lanes freely,
 * each lane collapses on its own, and the compact card preset fits a dense
 * dispatch board. "New job" and the per-cell + both go through \`onAddCard\`.
 */
const sample = sampleTaskBoard.fieldOps();

export default function FieldOperations() {
  const [cards, setCards] = useState(sample.cards);
  const [lanes, setLanes] = useState(sample.lanes!);

  const addJob = (column = "intake", lane: string | null = lanes[0].id) =>
    setCards((cs) => [
      ...cs,
      { id: \`job-\${cs.length + 1}\`, title: "New service job", column, lane: lane ?? undefined, priority: "medium", points: 1 },
    ]);

  const active = cards.filter((c) => c.column === "onsite" || c.column === "scheduled").length;
  const critical = cards.filter((c) => c.priority === "critical").length;

  return (
    <div className="w-full">
      <TaskBoard
        layout="lanes"
        cardLayout="compact"
        size="sm"
        color="emerald"
        cards={cards}
        columns={sample.columns}
        lanes={lanes}
        priorities={sample.priorities}
        onCardsChange={setCards}
        onLanesChange={setLanes}
        onAddCard={({ column, lane }) => addJob(column, lane)}
        icon={<Globe className="h-5 w-5" />}
        title="FieldOps Dispatch"
        subtitle="Regional service lanes · Today"
        summary={
          <>
            <Pill size="sm" variant="soft" tone="slate">{lanes.length} regions</Pill>
            <Pill size="sm" variant="soft" tone="sky">{active} active jobs</Pill>
            <Pill size="sm" variant="soft" tone="rose">{critical} priority</Pill>
          </>
        }
        actions={
          <Button size="sm" color="emerald" leadingIcon="Add" onClick={() => addJob()}>
            New job
          </Button>
        }
        height={560}
      />
    </div>
  );
}
`,ss=[{id:"backlog",title:"Backlog",color:"slate"},{id:"ready",title:"Ready",color:"sky",accepts:["backlog"]},{id:"building",title:"Building",color:"amber",wipLimit:3},{id:"review",title:"Review",color:"violet"},{id:"shipped",title:"Shipped",color:"emerald",locked:!0}],Re={id:"lb",name:"Lena Brandt",color:"teal"},os=[{id:"a",column:"backlog",title:"Rate-limit public API",assignees:[Re]},{id:"b",column:"backlog",title:"Rotate signing keys"},{id:"c",column:"ready",title:"Billing webhooks retry",assignees:[Re]},{id:"d",column:"building",title:"Org-level SSO",assignees:[Re]},{id:"e",column:"building",title:"CSV export"},{id:"f",column:"building",title:"Audit log search",assignees:[Re]},{id:"g",column:"shipped",title:"Usage dashboard",assignees:[Re]}],rs=e=>new Promise(t=>setTimeout(t,e));function is(){const[e,t]=i.useState(os),[a,s]=i.useState("Drag a card — refused targets turn red."),o=async r=>{if(r.to.column!=="review")return!0;const l=e.find(m=>m.id===r.cardId);s(`Asking for approval to review "${l?.title}"…`),await rs(800);const u=!!l?.assignees?.length;return s(u?"Approved.":`Refused: "${l?.title}" needs an owner before review.`),u};return n.jsxs("div",{className:"flex w-full flex-col gap-2",children:[n.jsx(ae,{cards:e,columns:ss,onCardsChange:t,onBeforeMove:o,size:"sm",variant:"outlined",height:420}),n.jsx("p",{"aria-live":"polite",className:"text-xs text-neutral-500 dark:text-neutral-400",children:a})]})}const ls=`import { useState } from "react";
import { TaskBoard, type TaskBoardCard, type TaskBoardColumn, type TaskBoardMove } from "@cjlapao/ui-kit";

/**
 * Rules run in the engine before anything moves, so a refused slot never
 * lights up as a target:
 * - Ready only accepts cards from Backlog (\`accepts\`).
 * - Building has a WIP limit of 3 — full, it refuses newcomers.
 * - Shipped is \`locked\`: nothing goes in, nothing comes out.
 * - Review is guarded by \`onBeforeMove\`: an 800 ms "approval" that refuses
 *   any card with nobody assigned. The card waits in its new slot, then
 *   either stays or goes back on its own — no rollback code.
 */
const COLUMNS: TaskBoardColumn[] = [
  { id: "backlog", title: "Backlog", color: "slate" },
  { id: "ready", title: "Ready", color: "sky", accepts: ["backlog"] },
  { id: "building", title: "Building", color: "amber", wipLimit: 3 },
  { id: "review", title: "Review", color: "violet" },
  { id: "shipped", title: "Shipped", color: "emerald", locked: true },
];

const owner = { id: "lb", name: "Lena Brandt", color: "teal" as const };

const CARDS: TaskBoardCard[] = [
  { id: "a", column: "backlog", title: "Rate-limit public API", assignees: [owner] },
  { id: "b", column: "backlog", title: "Rotate signing keys" },
  { id: "c", column: "ready", title: "Billing webhooks retry", assignees: [owner] },
  { id: "d", column: "building", title: "Org-level SSO", assignees: [owner] },
  { id: "e", column: "building", title: "CSV export" },
  { id: "f", column: "building", title: "Audit log search", assignees: [owner] },
  { id: "g", column: "shipped", title: "Usage dashboard", assignees: [owner] },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Rules() {
  const [cards, setCards] = useState(CARDS);
  const [note, setNote] = useState("Drag a card — refused targets turn red.");

  const guard = async (move: TaskBoardMove) => {
    if (move.to.column !== "review") return true;
    const card = cards.find((c) => c.id === move.cardId);
    setNote(\`Asking for approval to review "\${card?.title}"…\`);
    await wait(800);
    const ok = Boolean(card?.assignees?.length);
    setNote(ok ? "Approved." : \`Refused: "\${card?.title}" needs an owner before review.\`);
    return ok;
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <TaskBoard
        cards={cards}
        columns={COLUMNS}
        onCardsChange={setCards}
        onBeforeMove={guard}
        size="sm"
        variant="outlined"
        height={420}
      />
      <p aria-live="polite" className="text-xs text-neutral-500 dark:text-neutral-400">
        {note}
      </p>
    </div>
  );
}
`,ds=[{id:"todo",title:"To do"},{id:"doing",title:"Doing"},{id:"done",title:"Done"}],cs=[{id:"s1",column:"doing",title:"Payments v2 rollout",subtasks:[{id:"s1a",title:"Schema migration",done:!0},{id:"s1b",title:"Dual-write shim",done:!0},{id:"s1c",title:"Read-path switch"},{id:"s1d",title:"Backfill job"},{id:"s1e",title:"Kill the legacy table"},{id:"s1f",title:"Update runbook"},{id:"s1g",title:"Vendor webhooks"},{id:"s1h",title:"Load test at 3× peak"}]},{id:"s2",column:"doing",title:"Import speed audit",subtasks:[{id:"s2a",title:"Profile the parser",status:"completed"},{id:"s2b",title:"Chunked inserts",status:"error"},{id:"s2c",title:"Parallel workers"},{id:"s2d",title:"Re-bench the suite"}]},{id:"s3",column:"todo",title:"Weekly digest email",subtasks:[{id:"s3a",title:"Draft the template",done:!0},{id:"s3b",title:"Quiet-hours logic"},{id:"s3c",title:"Unsubscribe copy"}]},{id:"s4",column:"done",title:"Retire the beta flag",subtasks:[{id:"s4a",title:"Flip the default",done:!0},{id:"s4b",title:"Drop the flag reads",done:!0},{id:"s4c",title:"Announce",done:!0},{id:"s4d",title:"Purge old code",done:!0}]}];function us(){const[e,t]=i.useState(cs),[a,s]=i.useState(3);return n.jsxs("div",{className:"flex w-full flex-col gap-3",children:[n.jsxs("div",{className:"flex items-center gap-1.5",role:"group","aria-label":"Dots per card",children:[[2,3,4,6].map(o=>n.jsxs(he,{size:"xs",variant:a===o?"solid":"outline",onClick:()=>s(o),"aria-pressed":a===o,children:[o," dots"]},o)),n.jsx("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"— the rest stack into a tooltip."})]}),n.jsx(ae,{cards:e,columns:ds,onCardsChange:t,subtaskMaxVisible:a,size:"sm",height:380})]})}const ms=`import { useState } from "react";
import { Button, TaskBoard, type TaskBoardCard, type TaskBoardColumn } from "@cjlapao/ui-kit";

/**
 * \`subtasks\` ride on the card and read as a DotStepper row: one dot per
 * sub task (done · active · pending · error), a \`done/total\` fraction, and
 * \`subtaskMaxVisible\` dots max — the rest stack behind a tooltip. A plain
 * \`done: true/false\` list is enough: the first unchecked sub task becomes
 * the active dot. Explicit \`status\` wins when you track real states.
 */
const COLUMNS: TaskBoardColumn[] = [
  { id: "todo", title: "To do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const CARDS: TaskBoardCard[] = [
  {
    id: "s1",
    column: "doing",
    title: "Payments v2 rollout",
    subtasks: [
      { id: "s1a", title: "Schema migration", done: true },
      { id: "s1b", title: "Dual-write shim", done: true },
      { id: "s1c", title: "Read-path switch" },
      { id: "s1d", title: "Backfill job" },
      { id: "s1e", title: "Kill the legacy table" },
      { id: "s1f", title: "Update runbook" },
      { id: "s1g", title: "Vendor webhooks" },
      { id: "s1h", title: "Load test at 3× peak" },
    ],
  },
  {
    id: "s2",
    column: "doing",
    title: "Import speed audit",
    subtasks: [
      { id: "s2a", title: "Profile the parser", status: "completed" },
      { id: "s2b", title: "Chunked inserts", status: "error" },
      { id: "s2c", title: "Parallel workers" },
      { id: "s2d", title: "Re-bench the suite" },
    ],
  },
  {
    id: "s3",
    column: "todo",
    title: "Weekly digest email",
    subtasks: [
      { id: "s3a", title: "Draft the template", done: true },
      { id: "s3b", title: "Quiet-hours logic" },
      { id: "s3c", title: "Unsubscribe copy" },
    ],
  },
  {
    id: "s4",
    column: "done",
    title: "Retire the beta flag",
    subtasks: [
      { id: "s4a", title: "Flip the default", done: true },
      { id: "s4b", title: "Drop the flag reads", done: true },
      { id: "s4c", title: "Announce", done: true },
      { id: "s4d", title: "Purge old code", done: true },
    ],
  },
];

export default function Subtasks() {
  const [cards, setCards] = useState(CARDS);
  const [maxVisible, setMaxVisible] = useState(3);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-1.5" role="group" aria-label="Dots per card">
        {[2, 3, 4, 6].map((n) => (
          <Button
            key={n}
            size="xs"
            variant={maxVisible === n ? "solid" : "outline"}
            onClick={() => setMaxVisible(n)}
            aria-pressed={maxVisible === n}
          >
            {n} dots
          </Button>
        ))}
        <span className="text-xs text-neutral-500 dark:text-neutral-400">— the rest stack into a tooltip.</span>
      </div>
      <TaskBoard cards={cards} columns={COLUMNS} onCardsChange={setCards} subtaskMaxVisible={maxVisible} size="sm" height={380} />
    </div>
  );
}
`,zt=fe.roadmap();function ps({card:e,dragging:t}){const a=e.checklist?e.checklist.done/e.checklist.total:0;return n.jsxs("div",{className:"flex flex-col gap-2",children:[n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-100",children:e.title}),t&&n.jsx("span",{className:"text-[10px] uppercase tracking-wide text-sky-600",children:"moving"})]}),n.jsx("div",{className:"h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",children:n.jsx("div",{className:"h-full rounded-full bg-sky-500",style:{width:`${Math.round(a*100)}%`}})}),n.jsx("span",{className:"text-[11px] text-neutral-500 dark:text-neutral-400",children:e.checklist?`${e.checklist.done} of ${e.checklist.total} tasks`:"No checklist"})]})}function hs(){const[e,t]=i.useState(zt.cards.filter(a=>a.column!=="blocked"));return n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:e,columns:zt.columns.filter(a=>a.id!=="blocked"),onCardsChange:t,renderCard:(a,s)=>n.jsx(ps,{card:a,dragging:s.dragging}),color:"sky",size:"sm",height:460})})}const fs=`import { useState } from "react";
import { TaskBoard, sampleTaskBoard, type TaskBoardCard } from "@cjlapao/ui-kit";

/**
 * \`renderCard\` replaces a card's body; the shell around it — drag, focus,
 * selection, the teammate ring — stays the board's. The second argument
 * says what state the card is in, so the body can react to it.
 */
const sample = sampleTaskBoard.roadmap();

function ProgressCard({ card, dragging }: { card: TaskBoardCard; dragging: boolean }) {
  const done = card.checklist ? card.checklist.done / card.checklist.total : 0;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{card.title}</span>
        {dragging && <span className="text-[10px] uppercase tracking-wide text-sky-600">moving</span>}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        <div className="h-full rounded-full bg-sky-500" style={{ width: \`\${Math.round(done * 100)}%\` }} />
      </div>
      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
        {card.checklist ? \`\${card.checklist.done} of \${card.checklist.total} tasks\` : "No checklist"}
      </span>
    </div>
  );
}

export default function CustomCards() {
  const [cards, setCards] = useState(sample.cards.filter((c) => c.column !== "blocked"));
  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={sample.columns.filter((c) => c.id !== "blocked")}
        onCardsChange={setCards}
        renderCard={(card, state) => <ProgressCard card={card} dragging={state.dragging} />}
        color="sky"
        size="sm"
        height={460}
      />
    </div>
  );
}
`,Ze=fe.roadmap(),gs=[{label:"Ready",value:"ready"},{label:"Loading",value:"loading"},{label:"Empty",value:"empty"},{label:"Error",value:"error"}];function bs(){const[e,t]=i.useState("loading");return n.jsxs("div",{className:"flex w-full flex-col gap-3",children:[n.jsx(In,{size:"sm",options:gs,value:e,onChange:t}),n.jsx(ae,{cards:e==="empty"?[]:Ze.cards,columns:Ze.columns,priorities:Ze.priorities,loading:e==="loading",error:e==="error"?"The board service did not answer.":void 0,onRetry:()=>t("loading"),onAddCard:()=>t("ready"),emptyState:"Nothing planned yet — add the first initiative to any column.",title:"Horizon Roadmap",size:"sm",height:400})]})}const ks=`import { useState } from "react";
import { MultiToggle, TaskBoard, sampleTaskBoard } from "@cjlapao/ui-kit";

/**
 * Loading shows a skeleton shaped like the board (columns of card blocks);
 * error swaps the columns for a message and a Retry; an empty board keeps its
 * columns — so "Add card" stays reachable — and says why it is empty.
 */
const sample = sampleTaskBoard.roadmap();
const STATES = [
  { label: "Ready", value: "ready" },
  { label: "Loading", value: "loading" },
  { label: "Empty", value: "empty" },
  { label: "Error", value: "error" },
];

export default function States() {
  const [state, setState] = useState("loading");
  return (
    <div className="flex w-full flex-col gap-3">
      <MultiToggle size="sm" options={STATES} value={state} onChange={setState} />
      <TaskBoard
        cards={state === "empty" ? [] : sample.cards}
        columns={sample.columns}
        priorities={sample.priorities}
        loading={state === "loading"}
        error={state === "error" ? "The board service did not answer." : undefined}
        onRetry={() => setState("loading")}
        onAddCard={() => setState("ready")}
        emptyState="Nothing planned yet — add the first initiative to any column."
        title="Horizon Roadmap"
        size="sm"
        height={400}
      />
    </div>
  );
}
`,et=fe.roadmap();function xs(){const[e,t]=i.useState(et.cards),[a,s]=i.useState(et.columns),[o,r]=i.useState(!1);return n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:e,columns:a,priorities:et.priorities,onCardsChange:t,onColumnsChange:s,editMode:o,title:"Horizon Roadmap",subtitle:o?"Editing the layout — drag a grip to reorder":"Q3 launch command center",actions:n.jsx(he,{size:"sm",variant:o?"solid":"soft",onClick:()=>r(l=>!l),children:o?"Done":"Edit board"}),size:"sm",height:460})})}const ys=`import { useState } from "react";
import { Button, TaskBoard, sampleTaskBoard } from "@cjlapao/ui-kit";

/**
 * The app owns the switch — here a header button. In edit mode each column
 * header gets a grip (drag it, or Space / arrows / Space) and an "Add column"
 * slot follows the last column; both come back through \`onColumnsChange\`.
 */
const sample = sampleTaskBoard.roadmap();

export default function EditMode() {
  const [cards, setCards] = useState(sample.cards);
  const [columns, setColumns] = useState(sample.columns);
  const [editing, setEditing] = useState(false);
  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={columns}
        priorities={sample.priorities}
        onCardsChange={setCards}
        onColumnsChange={setColumns}
        editMode={editing}
        title="Horizon Roadmap"
        subtitle={editing ? "Editing the layout — drag a grip to reorder" : "Q3 launch command center"}
        actions={
          <Button size="sm" variant={editing ? "solid" : "soft"} onClick={() => setEditing((e) => !e)}>
            {editing ? "Done" : "Edit board"}
          </Button>
        }
        size="sm"
        height={460}
      />
    </div>
  );
}
`,vs=[{id:"todo",title:"To do",color:"slate"},{id:"doing",title:"Doing",color:"sky"},{id:"done",title:"Done",color:"emerald"}],Cs=[{id:"1",column:"todo",title:"Crash on empty workspace",tone:"rose",tags:["bug"]},{id:"2",column:"todo",title:"Bulk archive",tone:"sky",tags:["feature"]},{id:"3",column:"todo",title:"Rename 'Spaces' to 'Teams'",tone:"amber",tags:["copy"]},{id:"4",column:"doing",title:"Timezone drift in reports",tone:"rose",tags:["bug"]},{id:"5",column:"doing",title:"Saved filters",tone:"sky",tags:["feature"]},{id:"6",column:"done",title:"Upgrade the date library",tone:"violet",tags:["chore"]},{id:"7",column:"done",title:"Keyboard shortcuts sheet",tone:"sky",tags:["feature"]}];function ws(){const[e,t]=i.useState(Cs);return n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:e,columns:vs,onCardsChange:t,size:"sm",corner:"rounded-md",columnCorner:"rounded-sm",height:360})})}const Ss=`import { useState } from "react";
import { TaskBoard, type TaskBoardCard, type TaskBoardColumn } from "@cjlapao/ui-kit";

/**
 * \`tone\` is per card — here it marks the kind of work, so a bug reads as a
 * bug from across the room. \`columnCorner\` rounds the column wells on the
 * container scale; \`corner\` rounds the board itself.
 */
const COLUMNS: TaskBoardColumn[] = [
  { id: "todo", title: "To do", color: "slate" },
  { id: "doing", title: "Doing", color: "sky" },
  { id: "done", title: "Done", color: "emerald" },
];

const CARDS: TaskBoardCard[] = [
  { id: "1", column: "todo", title: "Crash on empty workspace", tone: "rose", tags: ["bug"] },
  { id: "2", column: "todo", title: "Bulk archive", tone: "sky", tags: ["feature"] },
  { id: "3", column: "todo", title: "Rename 'Spaces' to 'Teams'", tone: "amber", tags: ["copy"] },
  { id: "4", column: "doing", title: "Timezone drift in reports", tone: "rose", tags: ["bug"] },
  { id: "5", column: "doing", title: "Saved filters", tone: "sky", tags: ["feature"] },
  { id: "6", column: "done", title: "Upgrade the date library", tone: "violet", tags: ["chore"] },
  { id: "7", column: "done", title: "Keyboard shortcuts sheet", tone: "sky", tags: ["feature"] },
];

export default function CardTones() {
  const [cards, setCards] = useState(CARDS);
  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={COLUMNS}
        onCardsChange={setCards}
        size="sm"
        corner="rounded-md"
        columnCorner="rounded-sm"
        height={360}
      />
    </div>
  );
}
`,tt=fe.roadmap(),$t=["Ana","Ben","Chloé","Dev","Eli","Femi","Gus","Hana"],_t="kit-docs-demo";function js(){const e=i.useMemo(()=>{const u=`tab-${Math.random().toString(36).slice(2,8)}`,m=$t[Math.floor(Math.random()*$t.length)];return{id:u,name:m,color:Fe(u)}},[]),[t,a]=i.useState(tt.cards),[s,o]=i.useState(),[r,l]=i.useState();return i.useEffect(()=>{if(typeof BroadcastChannel>"u")return;const u=ra(_t),m=new BroadcastChannel(`${_t}:cards`);return m.onmessage=h=>a(h.data),o(u),l(m),()=>{u.close(),m.close()}},[]),n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:t,columns:tt.columns,priorities:tt.priorities,onCardsChange:u=>{a(u),r?.postMessage(u)},transport:s,currentUser:e,title:"Live board",subtitle:"Open this page in a second tab and drag a card",summary:n.jsxs(pe,{size:"sm",variant:"soft",tone:e.color,children:["You are ",e.name]}),height:520})})}const Ts=`import { useEffect, useMemo, useState } from "react";
import {
  Pill,
  TaskBoard,
  createBroadcastChannelTransport,
  peerColor,
  sampleTaskBoard,
  type TaskBoardCard,
  type TaskBoardUser,
} from "@cjlapao/ui-kit";

/**
 * Two channels, two jobs — the split the board is built around:
 *
 * - \`transport\` (the board's) carries only who holds which card and where it
 *   is heading. Any pub/sub room fits; this one is a BroadcastChannel, so
 *   tabs of this browser are the "teammates".
 * - The cards themselves are the app's data. After a drop the app saves
 *   them its own way — here a second BroadcastChannel stands in for the
 *   backend, so every tab ends up with the same cards.
 */
const sample = sampleTaskBoard.roadmap();
const NAMES = ["Ana", "Ben", "Chloé", "Dev", "Eli", "Femi", "Gus", "Hana"];
const ROOM = "kit-docs-demo";

export default function LiveCollaboration() {
  const me = useMemo<TaskBoardUser>(() => {
    const id = \`tab-\${Math.random().toString(36).slice(2, 8)}\`;
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    return { id, name, color: peerColor(id) };
  }, []);
  const [cards, setCards] = useState<TaskBoardCard[]>(sample.cards);
  const [transport, setTransport] = useState<ReturnType<typeof createBroadcastChannelTransport>>();
  const [data, setData] = useState<BroadcastChannel>();

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const t = createBroadcastChannelTransport(ROOM);
    const d = new BroadcastChannel(\`\${ROOM}:cards\`);
    d.onmessage = (e: MessageEvent<TaskBoardCard[]>) => setCards(e.data);
    setTransport(t);
    setData(d);
    return () => {
      t.close();
      d.close();
    };
  }, []);

  return (
    <div className="w-full">
      <TaskBoard
        cards={cards}
        columns={sample.columns}
        priorities={sample.priorities}
        onCardsChange={(next) => {
          setCards(next);
          data?.postMessage(next);
        }}
        transport={transport}
        currentUser={me}
        title="Live board"
        subtitle="Open this page in a second tab and drag a card"
        summary={
          <Pill size="sm" variant="soft" tone={me.color}>
            You are {me.name}
          </Pill>
        }
        height={520}
      />
    </div>
  );
}
`,Bs=`import type { TaskBoardTransport } from "@cjlapao/ui-kit";

// Any pub/sub room fits. A WebSocket room, for example:
function socketTransport(socket: WebSocket): TaskBoardTransport {
  return {
    publish: (event) => socket.send(JSON.stringify(event)),
    subscribe(handler) {
      const onMessage = (e: MessageEvent) => handler(JSON.parse(e.data));
      socket.addEventListener("message", onMessage);
      return () => socket.removeEventListener("message", onMessage);
    },
  };
}

<TaskBoard
  cards={cards}                 // your data — saved through your backend
  columns={columns}
  onCardsChange={save}
  transport={socketTransport(socket)}
  currentUser={{ id: me.id, name: me.name }}
/>`,Os=()=>n.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[n.jsx(Dn,{name:"Task Board",description:"A kanban board in two layouts — columns, or columns crossed with swimlanes — with real-time drag and drop by pointer, touch and keyboard. Locks, WIP limits and transition rules are enforced before a card moves, a guarded move can wait on your server, and a collaboration channel shows teammates' drags live: the card they hold is locked on your screen and a ghost shows where it is going. The board is a Panel, so every surface variant, corner and glass setting comes with it. React ships first; the Vue kit is a step behind."}),n.jsx(Za,{}),n.jsxs("section",{className:"flex flex-col gap-5",children:[n.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),n.jsx(ie,{title:"Product roadmap",description:"The columns view with detailed cards. Click or press Enter to open the editor (a SidePanel the app owns); right-click or Shift+F10 for a menu anchored at the payload's x / y. Summary pills and the add-card buttons are plain props.",code:ts,filename:"ProductRoadmap.tsx",children:n.jsx(es,{})}),n.jsx(ie,{title:"Field operations (swimlanes)",description:'`layout="lanes"` crosses the columns with `lanes`. Cards move across lanes as freely as across columns, each lane collapses on its own, and the column header and lane labels stay put while the grid scrolls.',code:as,filename:"FieldOperations.tsx",children:n.jsx(ns,{})}),n.jsx(ie,{title:"Sub tasks",description:"`subtasks` ride on the card and read as a read-only DotStepper row: one dot per sub task (done · active · pending · error), a `done/total` fraction beside them, and `subtaskMaxVisible` (3 by default) dots at most — the rest stack into a tooltip, one per hidden sub task. A plain `done: true` list is enough to drive it; explicit `status` overrides the inference. The dots never take focus — the card stays the only control, and `onCardOpen` still opens the editor that owns them.",code:ms,filename:"Subtasks.tsx",children:n.jsx(us,{})}),n.jsx(ie,{title:"Rules and guarded moves",description:"`accepts`, `wipLimit` and `locked` are checked by the engine, so a refused bucket turns red and never previews the card. `onBeforeMove` adds your own check — sync or async — and a refusal puts the card back with no rollback code.",code:ls,filename:"Rules.tsx",children:n.jsx(is,{})}),n.jsx(ie,{title:"Edit the board",description:"`editMode` unlocks the layout: every column header gets a grip to drag it to a new position (or Space, arrows, Space from the keyboard) and an edit button for its properties — name, colour, WIP limit, max items, lock, and which columns it accepts cards from — and an Add column slot follows the last column. Both report through `onColumnsChange`. Outside edit mode the layout is fixed — cards still move as usual.",code:ys,filename:"EditMode.tsx",children:n.jsx(xs,{})}),n.jsx(ie,{title:"Card tones and corners",description:"`tone` on a card tints its surface, so every card can carry its own colour — status, type, owner. It survives glass (a translucent tint) and the drag clone. `columnCorner` rounds the column wells on the same container scale as the board's `corner`; both default to md.",code:Ss,filename:"CardTones.tsx",children:n.jsx(ws,{})}),n.jsx(ie,{title:"Custom cards",description:"`renderCard` swaps a card's body; the shell (drag, focus, selection, teammate ring) stays the board's, and the state argument tells the body what is happening to it.",code:fs,filename:"CustomCards.tsx",children:n.jsx(hs,{})}),n.jsx(ie,{title:"Loading, empty and error",description:"Loading draws a skeleton shaped like the board. Error replaces the columns with the message and a Retry. An empty board keeps its columns, so Add card is still there.",code:ks,filename:"States.tsx",children:n.jsx(bs,{})}),n.jsx(ie,{title:"Live collaboration",description:"Open this page in a second tab and drag a card. The other tab locks it, shows your name on it, and moves a ghost to wherever you are pointing; drop, and the card lands there. Whoever grabbed first wins, on every screen, and a tab that closes mid-drag lets go after eight seconds.",code:Ts,filename:"LiveCollaboration.tsx",children:n.jsx(js,{})})]}),n.jsxs(Rn,{children:[n.jsxs(Ct,{title:"Screen reader",children:[n.jsxs("p",{children:["The board is a ",n.jsx(q,{children:'role="application"'})," region named by ",n.jsx(q,{children:"kit.taskboard.root"})," with"," ",n.jsx(q,{children:'aria-roledescription="task board"'}),". Each column (or column × lane cell) is a ",n.jsx(q,{children:'role="group"'})," named by its title and card count, and each card is a ",n.jsx(q,{children:'role="button"'})," with"," ",n.jsx(q,{children:'aria-roledescription="card"'}),", named by its title."]}),n.jsxs("p",{children:['Moves are spoken through a polite live region: picking a card up, every step ("Moved to Discovery, position 1 of 4"), the drop and a cancel. A card a teammate holds gets ',n.jsx(q,{children:"aria-disabled"}),' and a visually hidden "',"{name}",' is moving this"; a pending guarded move sets ',n.jsx(q,{children:"aria-busy"})," on the card."]}),n.jsxs("p",{children:["Sub task dots are read-only: each is a ",n.jsx(q,{children:'role="img"'}),' named "',"{title}, step i of n, {status}",'"'," ","inside a ",n.jsx(q,{children:'role="group"'})," named by ",n.jsx(q,{children:"kit.taskboard.subtasks"}),' ("',"2 of 7 subtasks",'"), never a button — so a card stays one tab stop and a click on a dot still opens the card.']}),n.jsx(En,{code:Bs,filename:"transport.tsx"})]}),n.jsx(Ln,{bindings:[{keys:["Tab"],action:"Moves into the board — one card is in the tab order at a time (roving tabindex)."},{keys:["↑ / ↓"],action:"Moves focus to the previous / next card in the column."},{keys:["← / →"],action:"Moves focus to the nearest card in the previous / next column (mirrored in RTL)."},{keys:["Alt","↑ / ↓"],action:"Moves focus to the previous / next lane."},{keys:["Space"],action:"Picks the focused card up; with a card held, drops it."},{keys:["Arrows (held)"],action:"Moves the held card through valid slots only — full, locked and refused columns are skipped. Alt+↑/↓ crosses lanes."},{keys:["Esc"],action:"Cancels the move; the card goes back where it was."},{keys:["Enter"],action:"Opens the card (onCardOpen)."},{keys:["Shift","F10"],action:"Opens the context menu (onCardContextMenu); the Menu key does the same."},{keys:["Space (grip)"],action:"Edit mode: picks the column up; ← / → move it one position (mirrored in RTL); Space drops; Esc or Tab cancels."}]}),n.jsx(Ct,{title:"Internationalization",children:n.jsxs("p",{children:['Every built-in string — "Add card", the counts, the announcements, "',"{name}",' is moving this" — is a'," ",n.jsx(q,{children:"kit.taskboard.*"})," key in the kit catalogs (en, de, es, fr, pt), and ",n.jsx(q,{children:"labels"})," overrides any of them per board. Card titles, column titles and lane titles are your data. Due dates format with the kit locale. Inside a ",n.jsx(q,{children:'dir="rtl"'})," container the columns run right to left and the arrow keys follow."]})})]}),n.jsx(An,{props:[{name:"cards / columns / lanes",type:"TaskBoardCard[] / TaskBoardColumn[] / TaskBoardLane[]",description:"The data, controlled. Order inside a column × lane is the order of the cards array — there is no second ordering to keep in sync."},{name:"onCardsChange",type:"(next, move) => void",description:"The single commit event: the next cards array, and the move that produced it (ready for your undo history or your API)."},{name:"onColumnsChange / onLanesChange",type:"(next) => void",description:"Collapse changes — and, in edit mode, column reorders and added columns. Omit one and its carets disappear (a column's caret stays while autoCollapseEmpty shows empty columns collapsed)."},{name:"maxItems",type:"number",description:"Board-wide hard cap on cards per column; a column's own `maxItems` overrides it. At the cap the column's Add card button disappears and drops into it are refused (the header reads count / max when there is no WIP limit)."},{name:"column.maxItems",type:"number",description:"Per column: overrides the board's maxItems. Editable in edit mode's column editor; empty falls back to the board default."},{name:"editMode",type:"boolean",default:"false",description:"Layout editing: a drag grip and an edit button (name, colour, WIP limit, lock, accepted sources) on every column header, and an Add column slot after the last column (columns and lanes layouts). Needs onColumnsChange; the new column's id is slugged from its name and kept unique."},{name:"autoCollapseEmpty",type:"boolean",default:"false",description:"Shows columns with no cards collapsed — the default view, columns layout only. Nothing is emitted for the auto state; your collapsed flags stay as you set them. Clicking a collapsed column's caret expands it for the rest of the session (a real collapsed: true flag is undone once, like any caret click); a remount restores the default view."},{name:"onBeforeMove",type:"(move) => boolean | Promise<boolean>",description:"Guard a move after the engine rules pass. While it is pending the card waits in its new slot; false or a throw puts it back."},{name:"editable",type:"boolean",default:"!!onCardsChange",description:"Pointer and keyboard moves. Selection, focus and opening still work on a read-only board."},{name:"layout",type:"TaskBoardLayout",default:'"columns"',description:'"lanes" crosses the columns with `lanes`.'},{name:"cardLayout / renderCard",type:"TaskBoardCardLayout / (card, state) => ReactNode",default:'"detailed"',description:"A preset card body, or your own. The card shell stays the board's."},{name:"priorities",type:"TaskBoardPriority[]",description:"What `card.priority` ids resolve to: label and colour."},{name:"card.subtasks",type:"TaskBoardSubtask[]",description:'Per card: rendered as a read-only DotStepper row — one dot per sub task — with a `done/total` fraction. `{ id, title, done }` is the simple form (the first unchecked sub task reads as active); `status: "pending" | "active" | "completed" | "error"` overrides the inference. Presentational: editing them happens in your `onCardOpen` editor.'},{name:"subtaskMaxVisible",type:"number",default:"3",description:'How many sub task dots a card shows; the rest stack into "more" markers whose tooltip names every hidden sub task.'},{name:"onCardOpen / onCardContextMenu / onAddCard",type:"callbacks",description:"App-owned surfaces. The context-menu payload carries the card, column, lane, index, x / y and the event."},{name:"selectedIds / onSelectionChange",type:"string[] / (ids) => void",description:"Click, Ctrl/⌘-click and Shift-click (range within a column). Uncontrolled when selectedIds is omitted."},{name:"transport / currentUser",type:"TaskBoardTransport / TaskBoardUser",description:"The collaboration channel: presence, grabs and drag targets only — never card data. Without both, nothing runs."},{name:"icon / title / subtitle / summary / actions",type:"ReactNode",description:"The header strip. Online teammates appear between summary and actions."},{name:"loading / loaderType",type:"boolean / PanelLoaderType",default:'false / "skeleton"',description:"The skeleton is shaped like the board; any other type overlays Panel's loader."},{name:"error / onRetry / emptyState",type:"ReactNode | boolean / () => void / ReactNode",description:"true shows the built-in message. The empty state sits above the columns, which stay."},{name:"card.tone",type:"TrueColor",description:"Per card: tints that card's surface (a solid tint, or a translucent one on glass boards), so cards can be told apart by colour. Omitted keeps the neutral card."},{name:"columnCorner",type:"SurfaceCorner",default:'"rounded-md"',description:"Radius of the column wells, collapsed strips and skeleton included — the container scale `corner` uses."},{name:"variant",type:"TaskBoardVariant",default:'"elevated"',description:"Any Panel surface, or plain for no chrome. Translucent surfaces switch the wells, cards and sticky headers to glass."},{name:"tone / corner / padding / glassOpacity / vibrancy / specularMode",type:"Panel props",default:'corner "rounded-md", padding "none"',description:"Passed to the Panel the board renders."},{name:"color",type:"TrueColor",default:'"blue"',description:"Accent for focus, selection, the drag clone, and the column edge when a column has no colour of its own."},{name:"size",type:"ControlSize",default:'"md"',description:"Column width and card density, from xs (232 px) to xl (352 px)."},{name:"columnWidth",type:"number | string",default:'"auto"',description:"Overrides the shared expanded-column width. Numbers are pixels; CSS lengths such as `20rem` are accepted. `auto` keeps the width from size without changing card density."},{name:"labels",type:"Partial<TaskBoardLabels>",description:"Per-board overrides of the kit.taskboard strings."},{name:"height / className",type:"number | string / string",description:"The columns scroll inside the height."}]})]});export{Os as TaskBoardPage,Os as default};
