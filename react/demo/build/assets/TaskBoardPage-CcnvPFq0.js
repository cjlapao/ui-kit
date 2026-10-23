import{dJ as te,j as n,dK as Yt,f as N,r as i,cu as ke,dL as Ve,cj as qe,dM as Nt,dN as Rt,dO as Mt,dP as Ye,dQ as Et,dR as Xt,I as _e,C as Lt,T as Jt,t as Qt,i as pe,dS as Zt,dT as It,dl as Xe,dU as en,dV as rt,dW as Re,dX as tn,cf as nn,P as an,ct as sn,dY as on,dA as rn,dZ as it,d_ as ln,p as dn,e as cn,b$ as le,d$ as At,e0 as un,e1 as mn,cc as pn,e2 as hn,M as fn}from"./index-B9JeX19j.js";import{A as gn,a as lt,C as X,b as bn,K as kn,P as yn}from"./A11ySections-C9rTCDac.js";import{P as vn}from"./PageHeader-D-LFwZLT.js";import{E as oe}from"./ExampleCard-BwESxlwz.js";import{P as xn,C as Ie,S as ve,a as Ae,T as re}from"./PlaygroundPanel-CZvYEX_V.js";import{C as wn}from"./ControlAccordion-rp4gabXb.js";import{u as Cn,E as Sn}from"./EventLog-EYY1E4QF.js";import{a8 as jn,a9 as Tn,d as Bn,aa as Nn,p as dt,f as Rn,j as Mn}from"./options-Blq0niUd.js";function Q(e,t){return`${e}::${t??""}`}function Je(e,t){return!t||t.length===0?null:e.lane&&t.some(a=>a.id===e.lane)?e.lane:t[0].id}function Ce(e,t,a){const s=new Map,r=a&&a.length?a.map(o=>o.id):[null];for(const o of t)for(const l of r)s.set(Q(o.id,l),[]);for(const o of e){const l=s.get(Q(o.column,Je(o,a)));l&&l.push(o)}return s}function He(e,t){let a=0;for(const s of e)s.column===t&&a++;return a}function En(e,t,a){let s=0;for(const r of e)(a?Je(r,a):r.lane)===t&&s++;return s}function Dt(e,t){return t==null?"none":e>t?"over":e===t?"full":"ok"}const ct=[{id:"sw",name:"Sara Walsh",color:"indigo"},{id:"jc",name:"Jonah Cole",color:"teal"},{id:"mg",name:"Maya Grant",color:"indigo"},{id:"ak",name:"Arjun Kapoor",color:"violet"},{id:"lb",name:"Lena Brandt",color:"teal"},{id:"rp",name:"Rui Pereira",color:"orange"}],ut=[{id:"nk",name:"Nadia Khan",color:"rose"},{id:"ml",name:"Marco Lund",color:"orange"},{id:"ps",name:"Priya Shah",color:"violet"},{id:"ob",name:"Owen Baker",color:"blue"},{id:"er",name:"Elif Reyes",color:"amber"},{id:"vc",name:"Victor Chen",color:"amber"},{id:"mp",name:"Mia Park",color:"green"},{id:"sc",name:"Sofia Costa",color:"fuchsia"}],Pt=(e,t)=>e.find(a=>a.id===t);function Ln(){const e=s=>Pt(ct,s),t=new Date().getFullYear(),a=(s,r)=>new Date(t,s-1,r).toISOString().slice(0,10);return{priorities:[{id:"p1",label:"P1",color:"red"},{id:"p2",label:"P2",color:"orange"},{id:"p3",label:"P3",color:"blue"},{id:"p4",label:"P4",color:"slate"}],users:ct.map(s=>({...s})),columns:[{id:"ideas",title:"Ideas",color:"blue"},{id:"discovery",title:"Discovery",color:"blue"},{id:"ready",title:"Ready",color:"blue"},{id:"building",title:"Building",color:"amber",wipLimit:5},{id:"blocked",title:"Blocked",color:"red"}],cards:[{id:"r1",column:"ideas",title:"Persona-based onboarding paths",tags:["activation","research"],priority:"p2",description:"Branch the first-run flow by role.",assignees:[e("sw")]},{id:"r2",column:"ideas",title:"Usage-based pricing meters",tags:["billing","platform"],priority:"p1",checklist:{done:2,total:5},due:a(11,6),assignees:[e("jc")]},{id:"r3",column:"ideas",title:"Enterprise SSO buying signal",tags:["enterprise","research"],priority:"p3",description:"Track SSO page visits per account."},{id:"r4",column:"ideas",title:"AI summary opt-in",tags:["research","platform"],priority:"p4",description:"Workspace-level toggle."},{id:"r5",column:"discovery",title:"Mobile trial activation",tags:[{label:"mobile",color:"fuchsia"},"activation"],priority:"p2",checklist:{done:1,total:3},due:a(10,30),assignees:[e("mg")]},{id:"r6",column:"discovery",title:"Account health score",tags:["analytics","growth"],priority:"p3",description:"Blend usage, seats and tickets.",assignees:[e("ak")]},{id:"r7",column:"discovery",title:"Partner API discovery",tags:["platform"],priority:"p4"},{id:"r8",column:"ready",title:"Customer import wizard",tags:["activation","platform"],priority:"p3",assignees:[e("lb")]},{id:"r9",column:"ready",title:"Self-serve plan downgrade",tags:["billing","trust"],priority:"p2",description:"Keep data, drop seats.",due:a(10,28),assignees:[e("rp")]},{id:"r10",column:"ready",title:"Warehouse sync beta",tags:["analytics","enterprise"],priority:"p1",due:a(11,2),assignees:[e("jc")]},{id:"r11",column:"building",title:"Checkout recovery campaign",tags:["checkout","growth"],priority:"p1",checklist:{done:3,total:5},due:a(10,26),assignees:[e("sw")]},{id:"r12",column:"building",title:"Admin audit log",tags:["enterprise","trust"],priority:"p2",checklist:{done:1,total:3},description:"Every admin action, exportable.",assignees:[e("lb")]},{id:"r13",column:"building",title:"Saved dashboard templates",tags:["analytics","platform"],priority:"p3",assignees:[e("jc")]},{id:"r14",column:"building",title:"Expansion signal pipeline",tags:["analytics","growth"],priority:"p3",due:a(10,29),assignees:[e("ak")]},{id:"r15",column:"blocked",title:"App store review fixes",tags:["checkout","mobile"],priority:"p2",assignees:[e("mg")]},{id:"r16",column:"blocked",title:"Data residency (EU)",tags:["enterprise"],priority:"p3",description:"Waiting on legal sign-off."}]}}function In(){const e=t=>Pt(ut,t);return{priorities:[{id:"critical",label:"Critical",color:"red"},{id:"high",label:"High",color:"orange"},{id:"medium",label:"Medium",color:"blue"},{id:"low",label:"Low",color:"slate"}],users:ut.map(t=>({...t})),columns:[{id:"intake",title:"Intake"},{id:"scheduled",title:"Scheduled"},{id:"onsite",title:"On site"},{id:"review",title:"Review"},{id:"closed",title:"Closed"}],lanes:[{id:"north",title:"North Region"},{id:"downtown",title:"Downtown Retail"},{id:"airport",title:"Airport Terminal"},{id:"harbor",title:"Harbor Logistics"}],cards:[{id:"f1",lane:"north",column:"intake",title:"Quote backup generator service",priority:"medium",points:2,tags:["quote"],assignees:[e("ps")]},{id:"f2",lane:"north",column:"scheduled",title:"Replace freezer controller",priority:"high",points:2,tags:["cold-chain"],assignees:[e("nk")]},{id:"f3",lane:"north",column:"onsite",title:"Investigate gate sensor loop",priority:"critical",points:3,tags:["access"],assignees:[e("ml")]},{id:"f4",lane:"north",column:"onsite",title:"Refit loading dock camera",priority:"high",points:5,tags:["security"],assignees:[e("nk")]},{id:"f5",lane:"north",column:"review",title:"Verify night crew handoff",priority:"medium",points:1,tags:["handoff"],assignees:[e("sc")]},{id:"f6",lane:"north",column:"closed",title:"Close HVAC inspection",priority:"low",points:1,tags:["hvac"],assignees:[e("ob")]},{id:"f7",lane:"downtown",column:"intake",title:"Book signage replacement",priority:"high",points:2,tags:["retail"],assignees:[e("er")]},{id:"f8",lane:"downtown",column:"intake",title:"Repair stockroom door strike",priority:"high",points:2,tags:["access"],assignees:[e("vc")]},{id:"f9",lane:"downtown",column:"scheduled",title:"Stage weekend cleaning crew",priority:"medium",points:1,tags:["crew"],assignees:[e("vc")]},{id:"f10",lane:"downtown",column:"onsite",title:"Escalator brake fault",priority:"critical",points:3,tags:["safety"],assignees:[e("ob")]},{id:"f11",lane:"downtown",column:"review",title:"Approve storefront glass work",priority:"critical",points:2,tags:["vendor"],assignees:[e("ob")]},{id:"f12",lane:"downtown",column:"closed",title:"Close retrofit lighting",priority:"medium",points:2,tags:["lighting"],assignees:[e("er")]},{id:"f13",lane:"airport",column:"intake",title:"Triage baggage belt alarm",priority:"critical",points:5,tags:["baggage"],assignees:[e("mp")]},{id:"f14",lane:"airport",column:"onsite",title:"Repair kiosk printer cluster",priority:"high",points:2,tags:["kiosk"],assignees:[e("mp")]},{id:"f15",lane:"airport",column:"closed",title:"Close alarm panel audit",priority:"high",points:1,tags:["alarm"],assignees:[e("ps")]},{id:"f16",lane:"harbor",column:"scheduled",title:"Calibrate crane load cells",priority:"high",points:3,tags:["crane"],assignees:[e("ml")]},{id:"f17",lane:"harbor",column:"review",title:"Sign off reefer plug repair",priority:"medium",points:2,tags:["cold-chain"],assignees:[e("nk")]}]}}const de={roadmap:Ln,fieldOps:In},An={ok:!0},ie=e=>({ok:!1,reason:e});function Ot(e,t){const a=e.cards.find(u=>u.id===t.cardId);if(!a||a.locked)return ie("locked-card");const s=e.heldBy?.get(a.id);if(s&&s!==e.selfId)return ie("held");const r=e.columns.find(u=>u.id===t.from.column),o=e.columns.find(u=>u.id===t.to.column);if(!o||r?.locked||o.locked)return ie("locked-column");const l=e.lanes?.find(u=>u.id===t.from.lane),d=e.lanes?.find(u=>u.id===t.to.lane);if(l?.locked||d?.locked)return ie("locked-lane");const h=t.from.column!==t.to.column;return h&&o.accepts&&!o.accepts.includes(t.from.column)?ie("not-accepted"):h&&o.wipLimit!==void 0&&e.cards.filter(m=>m.column===o.id&&m.id!==a.id).length>=o.wipLimit?ie("wip-column"):t.from.lane!==t.to.lane&&d?.wipLimit!==void 0&&e.cards.filter(m=>m.id!==a.id&&Je(m,e.lanes)===d.id).length>=d.wipLimit?ie("wip-lane"):An}function Se(e,t,a,s){const r=e.find(m=>m.id===t.cardId);if(!r)return e;const o=e.filter(m=>m.id!==t.cardId),l={...r,column:t.to.column};t.to.lane!==null&&(l.lane=t.to.lane);const d=Ce(o,a,s).get(Q(t.to.column,t.to.lane))??[],h=Math.max(0,Math.min(t.to.index,d.length));if(d.length===0)return[...o,l];if(h<d.length){const m=o.indexOf(d[h]);return[...o.slice(0,m),l,...o.slice(m)]}const u=o.indexOf(d[d.length-1])+1;return[...o.slice(0,u),l,...o.slice(u)]}function Dn(e,t,a,s){const r=e.filter(l=>l.id!==a),o=e.find(l=>l.id===a);if(o&&t>=o.top&&t<=o.top+o.height)return s??r.filter(l=>l.top<o.top).length;for(let l=0;l<r.length;l++){const d=r[l];if(t<d.top+d.height/2)return l}return r.length}function Pn(e,t,a,s){const r=e.cards.filter(m=>m.id!==a),o=Ce(r,e.columns,e.lanes),l=(m,p)=>o.get(Q(m,p))?.length??0,d=m=>Ot(e,{cardId:a,from:t,to:m}).ok;if(s==="up"||s==="down"){const m=t.index+(s==="down"?1:-1);if(m<0||m>l(t.column,t.lane))return null;const p={...t,index:m};return d(p)?p:null}if(s==="left"||s==="right"){const m=e.columns,p=s==="right"?1:-1;for(let y=m.findIndex(x=>x.id===t.column)+p;y>=0&&y<m.length;y+=p){const x=m[y];if(x.collapsed)continue;const C={column:x.id,lane:t.lane,index:Math.min(t.index,l(x.id,t.lane))};if(d(C))return C}return null}const h=e.lanes??[],u=s==="lane-down"?1:-1;for(let m=h.findIndex(p=>p.id===t.lane)+u;m>=0&&m<h.length;m+=u){const p=h[m];if(p.collapsed)continue;const y={column:t.column,lane:p.id,index:Math.min(t.index,l(t.column,p.id))};if(d(y))return y}return null}const On=5e3,mt=8e3,$n=50;function pt(){return{peers:new Map,holds:new Map}}const J=e=>typeof e=="string",ht=e=>typeof e=="number"&&Number.isFinite(e);function zn(e){if(!e||typeof e!="object")return null;const t=e;if(!ht(t.at))return null;switch(t.type){case"presence":{const a=t.user;return a&&J(a.id)&&J(a.name)?t:null}case"leave":return J(t.userId)?t:null;case"grab":return J(t.userId)&&J(t.cardId)?t:null;case"release":return J(t.userId)&&J(t.cardId)?t:null;case"hover":return J(t.userId)&&J(t.cardId)&&J(t.column)&&(t.lane===null||J(t.lane))&&ht(t.index)?t:null;default:return null}}function Be(e,t,a){const s=e.peers.get(t);if(!s)return e.peers;const r=new Map(e.peers);return r.set(t,{...s,lastSeen:a}),r}function _n(e,t){return e.at<t.at||e.at===t.at&&e.userId<t.userId}function Hn(e,t,a){const s=zn(t);if(!s)return e;switch(s.type){case"presence":{const r=new Map(e.peers);r.set(s.user.id,{user:s.user,lastSeen:a});let o=e.holds;for(const[l,d]of e.holds)d.userId===s.user.id&&(o===e.holds&&(o=new Map(e.holds)),o.set(l,{...d,seen:a}));return{peers:r,holds:o}}case"leave":{const r=new Map(e.peers);r.delete(s.userId);const o=new Map(e.holds);for(const[l,d]of e.holds)d.userId===s.userId&&o.delete(l);return{peers:r,holds:o}}case"grab":{const r=e.holds.get(s.cardId);if(r&&r.userId!==s.userId&&!_n(s,r))return{...e,peers:Be(e,s.userId,a)};const o=new Map(e.holds);return o.set(s.cardId,{userId:s.userId,at:s.at,seen:a}),{peers:Be(e,s.userId,a),holds:o}}case"hover":{const r=e.holds.get(s.cardId);if(!r||r.userId!==s.userId)return e;const o=new Map(e.holds);return o.set(s.cardId,{...r,seen:a,hover:{column:s.column,lane:s.lane,index:s.index}}),{peers:Be(e,s.userId,a),holds:o}}case"release":{const r=e.holds.get(s.cardId);if(!r||r.userId!==s.userId)return e;const o=new Map(e.holds);return o.delete(s.cardId),{peers:Be(e,s.userId,a),holds:o}}}}function Fn(e,t){let a=e.peers,s=e.holds;for(const[r,o]of e.peers)t-o.lastSeen<=mt||(a===e.peers&&(a=new Map(e.peers)),a.delete(r));for(const[r,o]of e.holds)t-o.seen<=mt||(s===e.holds&&(s=new Map(e.holds)),s.delete(r));return a===e.peers&&s===e.holds?e:{peers:a,holds:s}}function Un(e){const t=new BroadcastChannel(`taskboard:${e}`),a=new Set;let s=!1;return t.onmessage=r=>{for(const o of a)o(r.data)},{publish:r=>{s||t.postMessage(r)},subscribe(r){return a.add(r),()=>{a.delete(r)}},close(){s=!0,a.clear(),t.close()}}}const Kn=e=>({cardId:e.cardId,from:e.to,to:e.from});function Gn(e=100){let t=[],a=[];return{push(s){t=[...t,s].slice(-e),a=[]},undo(s,r,o){const l=t[t.length-1];return l?(t=t.slice(0,-1),a=[...a,l],Se(s,Kn(l),r,o)):null},redo(s,r,o){const l=a[a.length-1];return l?(a=a.slice(0,-1),t=[...t,l],Se(s,l,r,o)):null},get canUndo(){return t.length>0},get canRedo(){return a.length>0},get size(){return t.length},clear(){t=[],a=[]}}}function ft(e,t,a){const s=e.findIndex(l=>l.id===t);if(s===-1)return e;const r=e.filter(l=>l.id!==t),o=Math.max(0,Math.min(a,r.length));return[...r.slice(0,o),e[s],...r.slice(o)]}function Wn(e,t,a,s,r,o=!1){const l=e.findIndex(C=>C.id===a);if(l===-1||r===0||e.length===0)return s;const d=o?r<0:r>0,h=e.length-1,u=e.findIndex(C=>t>=C.left&&t<=C.left+C.width);if(u!==-1)return u===l?s:u>l&&d?Math.min(u,h):u<l&&!d?u:s;const m=Math.min(...e.map(C=>C.left)),p=Math.max(...e.map(C=>C.left+C.width)),y=o?t<m:t>p,x=o?t>p:t<m;return y&&d?h:x&&!d?0:s}function Vn(e,t){const a=e.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"column",s=new Set(t.map(o=>o.id));if(!s.has(a))return a;let r=2;for(;s.has(`${a}-${r}`);)r++;return`${a}-${r}`}const $t=({column:e,lane:t,cards:a,className:s,label:r})=>{const{cardState:o,cardProps:l,dropTarget:d,size:h,text:u}=te(),m=Q(e,t),p=d&&d.bucket===m?d:null;return n.jsx("div",{role:"group","aria-label":r,"data-bucket":m,"data-bucket-column":e,"data-bucket-lane":t??"","data-drop":p?p.valid?"valid":"invalid":void 0,title:p&&!p.valid?u("notAllowed"):void 0,className:N("flex min-h-12 flex-col rounded-lg transition-colors",h.gap,p&&!p.valid&&"cursor-not-allowed bg-red-500/5 ring-1 ring-inset ring-red-500/30",s),children:a.map((y,x)=>n.jsx(Yt,{card:y,column:e,lane:t,index:x,state:o(y),...l?.(y,{column:e,lane:t,index:x})},y.id))})},Fe=200;function Ue(e,t=Fe){const[a,s]=i.useState(e);return i.useEffect(()=>{if(e){s(!0);return}if(typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||t<=0){s(!1);return}const o=setTimeout(()=>s(!1),t);return()=>clearTimeout(o)},[e,t]),e||a}const Ke=({column:e,index:t})=>{const{columnGripProps:a,surface:s,color:r}=te();if(!a)return null;const o=ke(r);return n.jsx("button",{type:"button",...a(e,t),className:N("shrink-0 cursor-grab touch-none rounded p-1 active:cursor-grabbing",s.muted,o.hover,o.focusRing),children:n.jsx(Nt,{className:"h-3.5 w-3.5","aria-hidden":"true"})})},zt=({onAdd:e,variant:t})=>{const{text:a,surface:s,color:r,size:o,columnCornerClass:l}=te(),[d,h]=i.useState(!1),[u,m]=i.useState(""),p=ke(r),y=()=>{h(!1),m("")},x=()=>{const C=u.trim();C&&e(C),y()};return n.jsx("div",{"data-taskboard-add-column":!0,style:t==="column"?{width:Math.round(o.columnWidth*.75)}:void 0,className:N("flex shrink-0 flex-col",t==="column"&&N("border-2 border-dashed p-2",s.divider,l),t==="header"&&"px-2 py-1.5"),children:d?n.jsx("input",{autoFocus:!0,"aria-label":a("columnName"),placeholder:a("columnName"),value:u,onChange:C=>m(C.target.value),onKeyDown:C=>{C.key==="Enter"?(C.preventDefault(),x()):C.key==="Escape"&&(C.preventDefault(),y())},onBlur:x,className:N("w-full rounded-md border bg-transparent px-2 py-1.5 text-sm outline-none",s.divider,s.heading,p.focusRing)}):n.jsxs("button",{type:"button",onClick:()=>h(!0),className:N("flex items-center justify-center gap-1 rounded-md py-1.5 text-sm",s.muted,p.hover,p.focusRing),children:[n.jsx(Ve,{className:"h-3.5 w-3.5","aria-hidden":"true"}),a("addColumn")]})})},qn=({drag:e,column:t,cards:a,count:s})=>{const{color:r,surface:o,size:l,cardSurface:d,columnCornerClass:h,renderCard:u}=te();if(!e||e.keyboard||!t||typeof document>"u")return null;const m=t.color??r;return qe.createPortal(n.jsxs("div",{"data-taskboard-column-clone":!0,"aria-hidden":"true",className:N("pointer-events-none fixed top-0 left-0 z-[1000] flex rotate-1 flex-col overflow-hidden border-t-[3px] bg-neutral-100 shadow-2xl motion-reduce:rotate-0 dark:bg-neutral-800",h,Ye(m).edge,Et(m).clone),style:{width:e.width||void 0,height:e.height||void 0,transform:`translate3d(${e.x-e.grabOffset.x}px, ${e.y-e.grabOffset.y}px, 0)`},children:[n.jsxs("div",{className:"flex items-center gap-2 px-3 pt-3 pb-2",children:[n.jsx(Nt,{className:N("h-3.5 w-3.5 shrink-0",o.muted),"aria-hidden":"true"}),n.jsx("span",{className:N("truncate text-sm font-semibold",o.heading),children:t.title}),n.jsx("span",{className:N("text-xs font-semibold tabular-nums",o.muted),children:s})]}),!t.collapsed&&n.jsx("div",{className:N("flex min-h-0 flex-col px-2 pb-2",l.gap),children:a.map(p=>n.jsx("div",{className:N("rounded-lg",l.cardPad,p.tone?N("shadow-sm ring-1",Mt(p.tone).solid):d),children:u?u(p,{dragging:!1,selected:!1,pending:!1}):n.jsx(Rt,{card:p})},p.id))})]}),document.body)},gt=e=>({title:e.title,color:e.color,wip:e.wipLimit===void 0?"":String(e.wipLimit),locked:!!e.locked,accepts:e.accepts??[]});function Yn(e,t){const{wipLimit:a,locked:s,accepts:r,color:o,...l}=e,d={...l,title:t.title.trim()};return t.color&&(d.color=t.color),t.wip.trim()!==""&&(d.wipLimit=Number(t.wip)),t.locked&&(d.locked=!0),t.accepts.length&&(d.accepts=t.accepts),d}const bt=e=>e.trim()===""||Number.isInteger(Number(e))&&Number(e)>=1,Ge=({column:e})=>{const{onEditColumn:t,allColumns:a,text:s,surface:r,color:o}=te(),[l,d]=i.useState(!1),[h,u]=i.useState(()=>gt(e)),m=i.useId();if(!t)return null;const p=ke(o),y=h.title.trim()!==""&&bt(h.wip),x=(a??[]).filter(k=>k.id!==e.id),C=()=>{y&&(t(Yn(e,h)),d(!1))};return n.jsx(Xt,{visible:l,onOpenChange:k=>{k&&u(gt(e)),d(k)},placement:"bottom",maxWidth:300,trigger:n.jsx("button",{type:"button","aria-label":s("editColumn",{name:e.title}),className:N("shrink-0 rounded p-1",r.muted,p.hover,p.focusRing),children:n.jsx(Zt,{className:"h-3.5 w-3.5","aria-hidden":"true"})}),children:n.jsxs("form",{className:"flex w-64 flex-col gap-3",onSubmit:k=>{k.preventDefault(),C()},children:[n.jsx(_e,{size:"sm","aria-label":s("columnName"),placeholder:s("columnName"),value:h.title,onChange:k=>u({...h,title:k.target.value}),onKeyDown:k=>{k.key==="Enter"&&(k.preventDefault(),C())}}),n.jsxs("div",{className:"flex flex-col gap-1.5",children:[n.jsx("span",{className:N("text-xs font-semibold",r.muted),children:s("columnColor")}),n.jsx(Lt,{selectable:!0,size:"sm",defaultExpanded:!0,value:h.color,onSelect:k=>u({...h,color:k})})]}),n.jsxs("div",{className:"flex flex-col gap-1",children:[n.jsx("label",{htmlFor:`${m}-wip`,className:N("text-xs font-semibold",r.muted),children:s("wipLimit")}),n.jsx(_e,{id:`${m}-wip`,size:"sm",type:"number",min:1,inputMode:"numeric",placeholder:s("wipLimitHint"),value:h.wip,onChange:k=>u({...h,wip:k.target.value}),"aria-invalid":!bt(h.wip)||void 0})]}),n.jsx(Jt,{size:"sm",label:s("lockColumn"),description:s("lockColumnHint"),checked:h.locked,onChange:k=>u({...h,locked:k.target.checked})}),x.length>0&&n.jsxs("fieldset",{className:"flex flex-col gap-1.5",children:[n.jsx("legend",{className:N("mb-1 text-xs font-semibold",r.muted),children:s("acceptsFrom")}),x.map(k=>n.jsx(Qt,{size:"sm",label:k.title,checked:h.accepts.includes(k.id),onChange:w=>u({...h,accepts:w.target.checked?[...h.accepts,k.id]:h.accepts.filter(g=>g!==k.id)})},k.id)),n.jsx("span",{className:N("text-[11px]",r.muted),children:s("acceptsAny")})]}),n.jsxs("div",{className:"flex justify-end gap-2 pt-1",children:[n.jsx(pe,{type:"button",size:"sm",variant:"soft",color:"slate",onClick:()=>d(!1),children:s("cancel")}),n.jsx(pe,{type:"submit",size:"sm",color:o,disabled:!y,children:s("save")})]})]})})},We=44;function _t(e,t){return t===void 0?String(e):`${e} / ${t}`}const Xn=({column:e,cards:t,count:a,index:s=0,onToggle:r})=>{const{surface:o,text:l,color:d,size:h,wellSurface:u,columnCornerClass:m,onAddCard:p,draggingColumnId:y}=te(),x=y===e.id,C=e.color??d,k=Ye(C),w=Dt(a,e.wipLimit),g=Ue(!e.collapsed),v=Ue(!!e.collapsed),B=ke(C),R=r&&n.jsx("button",{type:"button",onClick:r,"aria-expanded":!e.collapsed,"aria-label":l(e.collapsed?"expand":"collapse",{name:e.title}),className:N("rounded p-1",o.muted,B.hover,B.focusRing),children:n.jsx(It,{className:N("h-3 w-3 transition-transform motion-reduce:transition-none",!e.collapsed&&"rotate-90")})}),D=n.jsx("span",{"data-column-count":!0,title:e.wipLimit!==void 0?l("wip",{count:a,limit:e.wipLimit}):void 0,className:N("text-xs font-semibold tabular-nums",w==="full"||w==="over"?k.wipFull:o.muted),children:_t(a,e.wipLimit)});return n.jsxs("div",{"data-column-id":e.id,"data-column-target":e.id,"data-flip-key":e.id,"data-column-dragging":x||void 0,"data-collapsed":e.collapsed?"true":void 0,"data-wip":w,"data-drop-zone":e.collapsed?void 0:!0,style:{width:e.collapsed?We:h.columnWidth},className:N("relative flex min-h-40 shrink-0 flex-col overflow-hidden border-t-[3px]",m,"transition-[width] duration-200 ease-out motion-reduce:transition-none",k.edge,u,x&&"opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30"),children:[v&&n.jsxs("div",{"aria-hidden":!e.collapsed,inert:!e.collapsed,className:N("absolute inset-y-0 left-0 flex flex-col items-center gap-3 py-3 transition-opacity duration-200 motion-reduce:transition-none",e.collapsed?"opacity-100":"pointer-events-none opacity-0"),style:{width:We},children:[n.jsx(Ke,{column:e,index:s}),n.jsx(Ge,{column:e}),R,D,n.jsx("span",{className:N("text-sm font-semibold whitespace-nowrap [writing-mode:vertical-rl]",o.heading),children:e.title})]}),g&&n.jsxs("div",{"data-column-body":!0,"aria-hidden":e.collapsed||void 0,inert:e.collapsed,style:{width:h.columnWidth},className:N("flex min-h-0 flex-1 flex-col transition-opacity duration-200 motion-reduce:transition-none",e.collapsed&&"opacity-0"),children:[n.jsxs("div",{className:"flex items-center gap-2 px-3 pt-3 pb-2",children:[n.jsx(Ke,{column:e,index:s}),n.jsx("span",{className:N("truncate text-sm font-semibold",o.heading),children:e.title}),D,n.jsx("span",{className:"flex-1"}),n.jsx(Ge,{column:e}),R]}),n.jsx(Xe,{"data-taskboard-scroll":!0,variant:"hover",horizontal:!1,tabIndex:-1,className:"min-h-0 flex-1",contentClassName:"px-2 pb-2",children:n.jsx($t,{column:e.id,lane:null,cards:t,label:`${e.title}, ${l("cardCount",{count:t.length})}`})}),p&&n.jsxs("button",{type:"button",onClick:()=>p({column:e.id,lane:null}),className:N("mx-2 mb-2 flex items-center justify-center gap-1 rounded-lg py-1.5 text-sm",o.muted,B.hover,B.focusRing),children:[n.jsx(Ve,{className:"h-3.5 w-3.5","aria-hidden":"true"}),l("addCard")]})]})]})},Jn=5,me=e=>e!=null&&e!==!1,Qn=({icon:e,title:t,subtitle:a,summary:s,actions:r,people:o,variant:l})=>{const{surface:d,text:h}=te(),u=o?.slice(0,Jn)??[],m=(o?.length??0)-u.length;return n.jsxs("div",{"data-taskboard-header":!0,className:N("flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3",d.divider),children:[me(e)&&n.jsx("div",{className:N("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",en(l,"neutral"),d.body),children:e}),(me(t)||me(a))&&n.jsxs("div",{className:"min-w-0",children:[me(t)&&n.jsx("div",{className:N("truncate text-lg font-bold leading-tight",d.heading),children:t}),me(a)&&n.jsx("div",{className:N("truncate text-xs",d.muted),children:a})]}),n.jsx("div",{className:"flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2",children:me(s)&&s}),u.length>0&&n.jsxs("div",{"data-taskboard-people":!0,role:"group","aria-label":h("online",{count:o.length}),className:"flex items-center -space-x-2",children:[u.map(p=>n.jsx(rt,{user:{name:p.name,avatarUrl:p.avatarUrl},tone:p.color??Re(p.id),size:"sm",title:p.name,className:"ring-2 ring-white dark:ring-neutral-900"},p.id)),m>0&&n.jsx(rt,{label:`+${m}`,size:"sm",className:"ring-2 ring-white dark:ring-neutral-900"})]}),me(r)&&n.jsx("div",{className:"flex items-center gap-1",children:r})]})},Zn=220,ea=180,ta=({cards:e,columns:t,lanes:a,buckets:s,onToggleLane:r,onToggleColumn:o,onAddColumn:l})=>{const{surface:d,text:h,color:u,size:m,stickySurface:p,draggingColumnId:y}=te(),x=ke(u),C=[`${Zn}px`,...t.map(g=>`${g.collapsed?We:m.columnWidth}px`),...l?[`${ea}px`]:[]].join(" "),k=N("border-b border-r",d.divider),w=(g,v,B)=>n.jsx("button",{type:"button",onClick:B,"aria-expanded":!g,"aria-label":h(g?"expand":"collapse",{name:v}),className:N("rounded p-1",d.muted,x.hover,x.focusRing),children:n.jsx(It,{className:N("h-3 w-3 transition-transform motion-reduce:transition-none",!g&&"rotate-90")})});return n.jsx(Xe,{"data-taskboard-scroll":!0,variant:"hover",tabIndex:-1,className:"min-h-0 flex-1",children:n.jsxs("div",{"data-lane-grid":!0,className:"grid w-max transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none",style:{gridTemplateColumns:C},children:[n.jsx("div",{className:N("sticky top-0 left-0 z-30",p,k)}),t.map((g,v)=>{const B=He(e,g.id),R=Dt(B,g.wipLimit);return n.jsxs("div",{"data-lane-column-header":g.id,"data-column-target":g.id,"data-flip-key":g.id,"data-column-dragging":y===g.id||void 0,"data-wip":R,className:N("sticky top-0 z-20 flex items-center gap-2 overflow-hidden px-3 py-2.5",p,k,y===g.id&&"opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30"),children:[n.jsx(Ke,{column:g,index:v}),!g.collapsed&&n.jsx("span",{className:N("truncate text-xs font-semibold uppercase tracking-wider",d.body),children:g.title}),n.jsx("span",{className:"flex-1"}),n.jsx("span",{"data-column-count":!0,className:N("rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",R==="full"||R==="over"?Ye(g.color??u).wipFull:d.muted),children:_t(B,g.wipLimit)}),n.jsx(Ge,{column:g}),o&&w(g.collapsed,g.title,()=>o(g.id))]},g.id)}),l&&n.jsx("div",{className:N("sticky top-0 z-20",p,k),children:n.jsx(zt,{variant:"header",onAdd:l})}),a.map(g=>n.jsx(na,{lane:g,count:En(e,g.id,a),columns:t,buckets:s,cellBorder:k,trailingCell:!!l,caret:r&&w(g.collapsed,g.title,()=>r(g.id))},g.id))]})})},na=({lane:e,count:t,columns:a,buckets:s,cellBorder:r,caret:o,trailingCell:l})=>{const{surface:d,text:h,color:u,stickySurface:m,onAddCard:p}=te(),y=ke(u),x=!e.collapsed,C=Ue(x);return n.jsxs("div",{"data-lane-id":e.id,"data-collapsed":e.collapsed?"true":void 0,className:"contents",children:[n.jsxs("div",{className:N("sticky left-0 z-10 flex items-start gap-2 px-3 py-3",m,r),children:[o,n.jsx("span",{className:N("min-w-0 flex-1 truncate pt-0.5 text-sm font-semibold",d.heading),children:e.title}),n.jsx("span",{"data-lane-count":!0,className:N("rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",d.muted),children:t})]}),a.map(k=>n.jsx("div",{"data-flip-key":`${k.id}:${e.id}`,"data-drop-zone":x&&!k.collapsed?!0:void 0,className:r,children:n.jsx("div",{"data-lane-cell":!0,className:N("grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",x?"grid-rows-[1fr]":"grid-rows-[0fr]"),children:n.jsx("div",{className:"min-h-0 overflow-hidden",inert:!x,"aria-hidden":!x||void 0,children:C&&!k.collapsed&&n.jsxs("div",{className:"flex flex-col gap-1 p-2",children:[n.jsx($t,{column:k.id,lane:e.id,cards:s.get(Q(k.id,e.id))??[],label:`${k.title}, ${e.title}`}),p&&n.jsx("button",{type:"button",onClick:()=>p({column:k.id,lane:e.id}),"aria-label":`${h("addCard")} — ${k.title}, ${e.title}`,className:N("flex items-center justify-center rounded-md py-1 opacity-60 hover:opacity-100 focus-visible:opacity-100",d.muted,y.hover,y.focusRing),children:n.jsx(Ve,{className:"h-3.5 w-3.5","aria-hidden":"true"})})]})})})},k.id)),l&&n.jsx("div",{"aria-hidden":"true",className:r})]})},aa="bg-white shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",sa=({drag:e,card:t})=>{const{renderCard:a,size:s,color:r}=te();return!e||e.keyboard||!t||typeof document>"u"?null:qe.createPortal(n.jsx("div",{"data-taskboard-clone":!0,"aria-hidden":"true",className:N("pointer-events-none fixed top-0 left-0 z-[1000] rotate-1 rounded-lg motion-reduce:rotate-0",t.tone?N("shadow-2xl ring-1",Mt(t.tone).solid):aa,Et(r).clone,s.cardPad,!e.valid&&e.to&&"cursor-not-allowed opacity-80"),style:{width:e.width||void 0,transform:`translate3d(${e.x-e.grabOffset.x}px, ${e.y-e.grabOffset.y}px, 0)`},children:a?a(t,{dragging:!0,selected:!1,pending:!1}):n.jsx(Rt,{card:t})}),document.body)},oa=4,ra=250,ia=8,be=48,la=16,kt=(e,t)=>e.column===t.column&&e.lane===t.lane&&e.index===t.index;function da(e){const t=e?.closest("[data-bucket]")??e?.closest("[data-drop-zone]")?.querySelector("[data-bucket]");if(!t)return null;const a=t.getAttribute("data-bucket-column"),s=t.getAttribute("data-bucket-lane");return a===null?null:{column:a,lane:s||null,el:t}}function ca(e){const[t,a]=i.useState(null),[s,r]=i.useState(null),o=i.useRef(e);o.current=e;const l=i.useRef(null),d=i.useRef(null),h=i.useRef(!1),u=i.useRef({x:0,y:0}),m=i.useRef(null),p=i.useRef(null),y=i.useRef(null),x=i.useCallback(c=>{l.current=c,a(c)},[]),C=()=>{const c=o.current;return{cards:c.cards,columns:c.columns,lanes:c.lanes,heldBy:c.heldBy,selfId:c.selfId}},k=i.useCallback((c,b)=>{const f=l.current;if(!f)return;const T=da(document.elementFromPoint?.(c,b)??null);let M=null,E=!1;if(T){const I=[...T.el.querySelectorAll("[data-card-id]")].map(O=>{const W=O.getBoundingClientRect();return{id:O.getAttribute("data-card-id"),top:W.top,height:W.height}}),P=f.to&&f.to.column===T.column&&f.to.lane===T.lane?f.to.index:null,_=Dn(I,b,f.cardId,P);M={column:T.column,lane:T.lane,index:_},E=Ot(C(),{cardId:f.cardId,from:f.from,to:M}).ok}const L=!f.to!=!M||f.to&&M&&!kt(f.to,M)||f.valid!==E;x({...f,x:c,y:b,to:M,valid:E}),L&&o.current.onDragTarget?.(f.cardId,E?M:null)},[x]),w=i.useCallback(()=>{if(m.current=null,!l.current)return;const{x:c,y:b}=u.current;let f=!1;for(const T of document.querySelectorAll("[data-taskboard-scroll]")){const M=T.matches('[data-slot="scrollarea"]')?T.querySelector(':scope > [data-slot="scrollarea-viewport"]'):T;if(!M)continue;const E=M.getBoundingClientRect();if(c<E.left||c>E.right||b<E.top||b>E.bottom)continue;const L=_=>Math.ceil((be-_)/be*la);let I=0,P=0;c-E.left<be?I=-L(c-E.left):E.right-c<be&&(I=L(E.right-c)),b-E.top<be?P=-L(b-E.top):E.bottom-b<be&&(P=L(E.bottom-b)),I&&M.scrollWidth>M.clientWidth&&(M.scrollLeft+=I,f=!0),P&&M.scrollHeight>M.clientHeight&&(M.scrollTop+=P,f=!0)}f&&(k(c,b),m.current=requestAnimationFrame(w))},[k]),g=i.useCallback(()=>{const c=d.current;c?.timer&&clearTimeout(c.timer),d.current=null,m.current!==null&&cancelAnimationFrame(m.current),m.current=null,p.current?.(),p.current=null,y.current!==null&&(document.body.style.userSelect=y.current,y.current=null)},[]),v=i.useCallback(c=>{const b=l.current;g(),b&&(x(null),o.current.onDragEnd?.(b.cardId,!1))},[g,x]),B=i.useCallback(async()=>{const c=l.current;if(g(),!c)return!1;x(null),c.keyboard||(h.current=!0,setTimeout(()=>{h.current=!1},0));const b=o.current;if(!c.to||!c.valid||kt(c.from,c.to))return b.onDragEnd?.(c.cardId,!1),!1;const f={cardId:c.cardId,from:c.from,to:c.to};if(!b.onBeforeMove)return b.onCommit(f),b.onDragEnd?.(c.cardId,!0),!0;r(f);let T=!1;try{T=await b.onBeforeMove(f)}catch{T=!1}return r(null),T&&o.current.onCommit(f),o.current.onDragEnd?.(c.cardId,T),T},[g,x]),R=i.useCallback((c,b)=>{const f=o.current;if(!f.editable||c.locked||l.current)return!1;const T=f.heldBy?.get(c.id);return T&&T!==f.selfId?!1:(x({cardId:c.id,from:b,to:b,valid:!0,x:0,y:0,grabOffset:{x:0,y:0},width:0,keyboard:!0}),f.onDragStart?.(c.id),f.onDragTarget?.(c.id,b),!0)},[x]),D=i.useCallback(c=>{const b=l.current;b&&(x({...b,to:c,valid:!0}),o.current.onDragTarget?.(b.cardId,c))},[x]),U=i.useCallback((c,b,f)=>{y.current===null&&(y.current=document.body.style.userSelect,document.body.style.userSelect="none"),window.getSelection?.()?.removeAllRanges(),x({cardId:c.cardId,from:c.from,to:c.from,valid:!0,x:b,y:f,grabOffset:c.grabOffset,width:c.width}),o.current.onDragStart?.(c.cardId),k(b,f)},[k,x]),$=i.useCallback(c=>{const b=d.current;if(!b)return;const{clientX:f,clientY:T}=c;if(u.current={x:f,y:T},!l.current){const M=Math.hypot(f-b.startX,T-b.startY);if(b.touch){if(!b.armed){M>ia&&g();return}U(b,f,T);return}if(M<oa)return;U(b,f,T);return}k(f,T),m.current===null&&typeof requestAnimationFrame=="function"&&(m.current=requestAnimationFrame(w))},[w,g,U,k]),z=i.useCallback((c,b,f)=>{const T=o.current;if(!T.editable||f.button!==0||c.locked)return;const M=T.heldBy?.get(c.id);if(M&&M!==T.selfId)return;g();const E=f.currentTarget.getBoundingClientRect(),L=f.pointerType==="touch",I={cardId:c.id,from:b,startX:f.clientX,startY:f.clientY,touch:L,armed:!1,timer:null,grabOffset:{x:f.clientX-E.left,y:f.clientY-E.top},width:E.width};L&&(I.timer=setTimeout(()=>{I.armed=!0,I.timer=null},ra)),d.current=I,u.current={x:f.clientX,y:f.clientY};const P=()=>{l.current?B():g()},_=()=>v("pointercancel"),O=G=>{G.key==="Escape"&&l.current&&(G.preventDefault(),v("escape"))},W=G=>{l.current&&G.preventDefault()};window.addEventListener("pointermove",$),window.addEventListener("pointerup",P),window.addEventListener("pointercancel",_),window.addEventListener("keydown",O),window.addEventListener("touchmove",W,{passive:!1}),p.current=()=>{window.removeEventListener("pointermove",$),window.removeEventListener("pointerup",P),window.removeEventListener("pointercancel",_),window.removeEventListener("keydown",O),window.removeEventListener("touchmove",W)}},[v,g,B,$]);i.useEffect(()=>{const c=l.current;c&&!e.cards.some(b=>b.id===c.cardId)&&v("removed")},[e.cards,v]),i.useEffect(()=>()=>g(),[g]);const F=i.useMemo(()=>{const{cards:c,columns:b,lanes:f}=e;return s?Se(c,s,b,f):t?.to&&t.valid?Se(c,{cardId:t.cardId,from:t.from,to:t.to},b,f):c},[e.cards,e.columns,e.lanes,t,s]),V=i.useCallback((c,b)=>({onPointerDown:f=>z(c,b,f),onClickCapture:f=>{h.current&&(h.current=!1,f.preventDefault(),f.stopPropagation())}}),[z]);return{drag:t,pending:s,previewCards:F,cardHandlers:V,cancel:v,finish:B,keyboardGrab:R,keyboardMove:D}}const ua=e=>e?.closest("[dir]")?.getAttribute("dir")==="rtl";function ma(e){const{rootRef:t,cards:a,viewCards:s,columns:r,lanes:o,text:l,drag:d}=e,[h,u]=i.useState(""),[m,p]=i.useState(null),[y,x]=i.useState([]),C=e.selectedIds??y,k=i.useRef(null),w=i.useRef(null),g=i.useMemo(()=>Ce(s,r,o),[s,r,o]),v=i.useMemo(()=>{for(const c of g.values())if(c.length)return c[0].id;return null},[g]),B=m&&s.some(c=>c.id===m)?m:v;i.useLayoutEffect(()=>{const c=w.current;c&&(w.current=null,t.current?.querySelector(`[data-card-id="${CSS.escape(c)}"]`)?.focus())});const R=i.useCallback(c=>u(c),[]),D=i.useCallback(c=>r.find(b=>b.id===c)?.title??c,[r]),U=i.useCallback((c,b)=>{const T=(Ce(a.filter(L=>L.id!==c),r,o).get(Q(b.column,b.lane))?.length??0)+1,M={column:D(b.column),index:b.index+1,total:T},E=b.lane?o?.find(L=>L.id===b.lane)?.title:void 0;R(E?l("movedLane",{...M,lane:E}):l("moved",M))},[R,a,r,o,D,l]),$=i.useCallback(c=>{e.selectedIds===void 0&&x(c),e.onSelectionChange?.(c)},[e]),z=i.useCallback((c,b)=>{const f=t.current,T=c.closest("[data-bucket]");if(!f||!T)return;const M=[...T.querySelectorAll("[data-card-id]")],E=M.indexOf(c);let L;if(b==="up"||b==="down")L=M[E+(b==="down"?1:-1)];else{const P=b==="left"||b==="right"?"data-bucket-lane":"data-bucket-column",_=T.getAttribute(P)??"",O=[...f.querySelectorAll(`[data-bucket][${P}="${CSS.escape(_)}"]`)],W=b==="right"||b==="lane-down"?1:-1;for(let G=O.indexOf(T)+W;G>=0&&G<O.length;G+=W){const Z=O[G].querySelectorAll("[data-card-id]");if(Z.length){L=Z[Math.min(E,Z.length-1)];break}}}L?.focus()},[t]),F=(c,b)=>{const f=ua(b);switch(c.key){case"ArrowUp":return c.altKey?"lane-up":"up";case"ArrowDown":return c.altKey?"lane-down":"down";case"ArrowLeft":return f?"right":"left";case"ArrowRight":return f?"left":"right";default:return null}};return{cardProps:i.useCallback((c,b)=>({tabIndex:c.id===B?0:-1,onFocus:()=>p(c.id),onClick:f=>{const T=C;if(f.ctrlKey||f.metaKey){f.preventDefault(),k.current=c.id,$(T.includes(c.id)?T.filter(M=>M!==c.id):[...T,c.id]);return}if(f.shiftKey&&k.current){f.preventDefault();const M=g.get(Q(b.column,b.lane))??[],E=M.findIndex(I=>I.id===k.current),L=M.findIndex(I=>I.id===c.id);if(E!==-1&&L!==-1){const I=M.slice(Math.min(E,L),Math.max(E,L)+1).map(P=>P.id);$([...T.filter(P=>!I.includes(P)),...I]);return}}k.current=c.id,$([c.id])},onKeyDown:f=>{const T=d?.keyboard&&d.cardId===c.id,M=f.currentTarget;if(T){const L=F(f,M);if(L){f.preventDefault();const I=Pn({cards:a,columns:r,lanes:o,heldBy:e.heldBy,selfId:e.selfId},d.to??d.from,c.id,L);I&&(e.keyboardMove(I),w.current=c.id,U(c.id,I))}else if(f.key===" "||f.key==="Spacebar"){f.preventDefault();const I=d.to??d.from;w.current=c.id,R(l("dropped",{title:c.title,column:D(I.column)})),e.finish().then(P=>{!P&&(I.column!==d.from.column||I.lane!==d.from.lane||I.index!==d.from.index)&&R(l("cancelled"))})}else f.key==="Escape"?(f.preventDefault(),w.current=c.id,e.cancel("escape"),R(l("cancelled"))):f.key==="Tab"?(e.cancel("blur"),R(l("cancelled"))):f.key==="Enter"&&f.preventDefault();return}if(f.key===" "||f.key==="Spacebar"){f.preventDefault(),e.keyboardGrab(c,b)&&(w.current=c.id,R(l("grabbed",{title:c.title})));return}if(f.key==="F10"&&f.shiftKey||f.key==="ContextMenu"){if(!e.onCardContextMenu)return;f.preventDefault();const L=M.getBoundingClientRect();e.onCardContextMenu({card:c,column:b.column,lane:b.lane,index:b.index,x:L.left+L.width/2,y:L.top+L.height/2,event:f});return}const E=F(f,M);E&&(f.preventDefault(),z(M,E))}}),[B,C,$,g,d,a,r,o,e,U,R,l,D,z]),message:h,selection:C,announce:R}}const pa=4,yt=e=>e?.closest("[dir]")?.getAttribute("dir")==="rtl";function ha(e){const[t,a]=i.useState(null),s=i.useRef(e);s.current=e;const r=i.useRef(null),o=i.useRef(null),l=i.useRef(null),d=i.useRef(null),h=i.useCallback(w=>{r.current=w,a(w)},[]),u=i.useCallback(()=>{o.current?.(),o.current=null,l.current!==null&&(document.body.style.userSelect=l.current,l.current=null)},[]),m=i.useCallback(()=>{u(),h(null)},[u,h]),p=i.useCallback(()=>{const w=r.current;return u(),h(null),!w||w.to===w.from?!1:(s.current.onCommit(ft(s.current.columns,w.id,w.to)),!0)},[u,h]);i.useLayoutEffect(()=>{const w=d.current;w&&(d.current=null,e.rootRef.current?.querySelector(`[data-column-grip="${CSS.escape(w)}"]`)?.focus())}),i.useEffect(()=>()=>u(),[u]);const y=i.useCallback((w,g,v)=>{if(!s.current.enabled||v.button!==0)return;v.preventDefault(),u();const R=(v.currentTarget.closest("[data-column-target]")??v.currentTarget).getBoundingClientRect(),D={x:v.clientX,y:v.clientY},U={x:v.clientX-R.left,y:v.clientY-R.top};let $=v.clientX;const z=c=>{const{clientX:b,clientY:f}=c;let T=r.current;if(!T){if(Math.hypot(b-D.x,f-D.y)<pa)return;l.current===null&&(l.current=document.body.style.userSelect,document.body.style.userSelect="none"),T={id:w.id,from:g,to:g,x:b,y:f,grabOffset:U,width:R.width,height:R.height}}const M=Math.sign(b-$);$=b;const E=s.current.rootRef.current,L=E?[...E.querySelectorAll("[data-column-target]")].map(P=>{const _=P.getBoundingClientRect();return{id:P.getAttribute("data-column-target"),left:_.left,width:_.width}}):[],I=Wn(L,b,T.id,T.to,M,yt(E));h({...T,x:b,y:f,to:I})},F=()=>{r.current?p():u()},V=c=>{c.key==="Escape"&&r.current&&(c.preventDefault(),m())};window.addEventListener("pointermove",z),window.addEventListener("pointerup",F),window.addEventListener("pointercancel",m),window.addEventListener("keydown",V),o.current=()=>{window.removeEventListener("pointermove",z),window.removeEventListener("pointerup",F),window.removeEventListener("pointercancel",m),window.removeEventListener("keydown",V)}},[m,p,u,h]),x=i.useCallback((w,g,v)=>{const B=s.current;if(!B.enabled)return;const R=r.current,D=B.columns.length;if(!R||!R.keyboard||R.id!==w.id){(v.key===" "||v.key==="Enter")&&(v.preventDefault(),h({id:w.id,from:g,to:g,x:0,y:0,grabOffset:{x:0,y:0},width:0,height:0,keyboard:!0}),d.current=w.id,B.announce(B.text("columnGrabbed",{name:w.title})));return}if(v.key==="ArrowLeft"||v.key==="ArrowRight"){v.preventDefault();const U=v.key==="ArrowRight"!==yt(v.currentTarget),$=Math.max(0,Math.min(D-1,R.to+(U?1:-1)));if($===R.to)return;h({...R,to:$}),d.current=w.id,B.announce(B.text("columnMoved",{name:w.title,index:$+1,total:D}))}else v.key===" "||v.key==="Enter"?(v.preventDefault(),d.current=w.id,p()):(v.key==="Escape"||v.key==="Tab")&&(v.key==="Escape"&&v.preventDefault(),d.current=v.key==="Escape"?w.id:null,m(),B.announce(B.text("cancelled")))},[m,p,h]),C=i.useMemo(()=>t&&t.to!==t.from?ft(e.columns,t.id,t.to):e.columns,[t,e.columns]),k=i.useCallback((w,g)=>({"data-column-grip":w.id,"aria-label":e.text("moveColumn",{name:w.title}),onPointerDown:v=>y(w,g,v),onKeyDown:v=>x(w,g,v)}),[e.text,y,x]);return{drag:t,previewColumns:C,gripProps:k}}function fa(e,t){const a=i.useRef(new Map),s=i.useRef(t);i.useLayoutEffect(()=>{const r=e.current;if(!r)return;const o=s.current!==t;s.current=t;const l=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,d=new Map;for(const h of r.querySelectorAll("[data-flip-key]")){const u=h.getAttribute("data-flip-key"),m=h.offsetLeft;d.set(u,m);const p=a.current.get(u);!o||l||p===void 0||p===m||(h.style.transition="none",h.style.transform=`translateX(${p-m}px)`,requestAnimationFrame(()=>{h.style.transition=`transform ${Fe}ms ease-out`,h.style.transform="",window.setTimeout(()=>{h.style.transform===""&&(h.style.transition="")},Fe+50)}))}a.current=d})}const ga=1e3;function ba(e,t){const[a,s]=i.useState(pt),r=!!(e&&t),o=i.useRef(!1),l=i.useRef(t);l.current=t;const d=i.useRef({last:0,timer:null}),h=i.useCallback(g=>{if(!o.current)return;const v=Date.now();s(B=>Hn(B,g,v))},[]),u=i.useCallback(g=>{e&&(vt(e,g),h(g))},[e,h]),m=t?.id;i.useEffect(()=>{if(!e||!m)return;o.current=!0;const g=()=>{const z=l.current;z&&u({type:"presence",user:z,at:Date.now()})},v=new Set,B=e.subscribe(z=>{if(!o.current)return;const F=z;F?.type==="presence"&&typeof F.user?.id=="string"&&F.user.id!==m?v.has(F.user.id)||(v.add(F.user.id),g()):F?.type==="leave"&&typeof F.userId=="string"&&v.delete(F.userId),h(z)}),R=()=>vt(e,{type:"leave",userId:m,at:Date.now()});g();const D=setInterval(g,On),U=setInterval(()=>{o.current&&s(z=>Fn(z,Date.now()))},ga);window.addEventListener("pagehide",R);const $=d.current;return()=>{o.current=!1,clearInterval(D),clearInterval(U),$.timer&&clearTimeout($.timer),window.removeEventListener("pagehide",R),R(),B(),s(pt())}},[e,m,h,u]);const p=i.useCallback(g=>{m&&u({type:"grab",userId:m,cardId:g,at:Date.now()})},[u,m]),y=i.useCallback((g,v)=>{if(!m)return;const B=d.current,R=()=>{B.last=Date.now(),B.timer=null,u({type:"hover",userId:m,cardId:g,column:v.column,lane:v.lane,index:v.index,at:B.last})};B.timer&&clearTimeout(B.timer);const D=$n-(Date.now()-B.last);D<=0?R():B.timer=setTimeout(R,D)},[u,m]),x=i.useCallback((g,v)=>{if(!m)return;const B=d.current;B.timer&&clearTimeout(B.timer),B.timer=null,u({type:"release",userId:m,cardId:g,dropped:v,at:Date.now()})},[u,m]),C=i.useMemo(()=>[...a.peers.values()].map(g=>g.user).filter(g=>g.id!==m),[a.peers,m]),k=i.useMemo(()=>{const g=new Map;for(const[v,B]of a.holds)g.set(v,B.userId);return g},[a.holds]),w=i.useCallback(g=>a.peers.get(g)?.user??{id:g,name:g},[a.peers]);return r?{presence:a,peers:C,heldBy:k,userById:w,grab:p,hover:y,release:x}:{presence:a,peers:[],heldBy:k,userById:w,grab:De,hover:De,release:De}}function De(){}function vt(e,t){try{e.publish(t)}catch{}}const xt=40,ka=({rootRef:e,holds:t,selfId:a,cards:s,userById:r})=>{const[o,l]=i.useState([]),[d,h]=i.useState(0);return i.useLayoutEffect(()=>{const u=e.current;if(!u)return;const m=()=>h(p=>p+1);return u.addEventListener("scroll",m,!0),window.addEventListener("resize",m),()=>{u.removeEventListener("scroll",m,!0),window.removeEventListener("resize",m)}},[e]),i.useLayoutEffect(()=>{const u=e.current;if(!u)return;const m=[];for(const[p,y]of t){if(y.userId===a||!y.hover)continue;const x=Q(y.hover.column,y.hover.lane),C=u.querySelector(`[data-bucket="${CSS.escape(x)}"]`);if(!C)continue;const k=[...C.querySelectorAll("[data-card-id]")].filter(R=>R.getAttribute("data-card-id")!==p),w=C.getBoundingClientRect(),g=k[y.hover.index],v=k[k.length-1],B=g?g.getBoundingClientRect().top-xt/2:v?v.getBoundingClientRect().bottom+4:w.top;m.push({key:`${y.userId}:${p}`,peer:r(y.userId),bucket:x,title:s.find(R=>R.id===p)?.title??"",top:B,left:w.left,width:w.width})}l(m)},[e,t,a,s,r,d]),!o.length||typeof document>"u"?null:qe.createPortal(n.jsx(n.Fragment,{children:o.map(u=>{const m=tn(u.peer.color??Re(u.peer.id));return n.jsxs("div",{"data-taskboard-ghost":!0,"data-peer-id":u.peer.id,"data-ghost-bucket":u.bucket,"aria-hidden":"true",className:N("pointer-events-none fixed z-[900] flex items-center rounded-lg border-2 border-dashed px-3 text-xs font-medium shadow-sm backdrop-blur-sm transition-transform duration-150 ease-out motion-reduce:transition-none",m.ghost),style:{top:0,left:0,width:u.width,height:xt,transform:`translate3d(${u.left}px, ${u.top}px, 0)`},children:[n.jsx("span",{className:"truncate opacity-80",children:u.title}),n.jsx("span",{className:N("absolute -top-2.5 right-2 rounded px-1.5 py-0.5 text-[10px] leading-none",m.label),children:u.peer.name})]},u.key)})}),document.body)},wt=[[72,96,64],[88,64],[64,104,72],[96,72,88,64],[72]],ya=({columns:e,columnWidth:t,wellSurface:a,cornerClass:s})=>n.jsx("div",{"data-taskboard-skeleton":!0,"aria-hidden":"true",className:"flex min-h-0 flex-1 gap-3 overflow-hidden p-3",children:Array.from({length:Math.max(1,e)},(r,o)=>n.jsxs("div",{style:{width:t},className:N("flex shrink-0 flex-col gap-2 p-3",s,a),children:[n.jsx("div",{className:"mb-1 h-3.5 w-24 animate-pulse rounded bg-black/10 motion-reduce:animate-none dark:bg-white/10"}),wt[o%wt.length].map((l,d)=>n.jsx("div",{style:{height:l},className:"animate-pulse rounded-lg bg-black/[0.06] motion-reduce:animate-none dark:bg-white/[0.08]"},d))]},o))}),va={root:"kit.taskboard.root",loading:"kit.taskboard.loading",empty:"kit.taskboard.empty",error:"kit.taskboard.error",retry:"kit.taskboard.retry",addCard:"kit.taskboard.addCard",collapse:"kit.taskboard.collapse",expand:"kit.taskboard.expand",cardCount:"kit.taskboard.cardCount",wip:"kit.taskboard.wip",grabbed:"kit.taskboard.grabbed",moved:"kit.taskboard.moved",movedLane:"kit.taskboard.movedLane",dropped:"kit.taskboard.dropped",cancelled:"kit.taskboard.cancelled",held:"kit.taskboard.held",heldShort:"kit.taskboard.heldShort",notAllowed:"kit.taskboard.notAllowed",pending:"kit.taskboard.pending",online:"kit.taskboard.online",notes:"kit.taskboard.notes",checklist:"kit.taskboard.checklist",due:"kit.taskboard.due",addColumn:"kit.taskboard.addColumn",columnName:"kit.taskboard.columnName",moveColumn:"kit.taskboard.moveColumn",columnGrabbed:"kit.taskboard.columnGrabbed",columnMoved:"kit.taskboard.columnMoved",editColumn:"kit.taskboard.editColumn",columnColor:"kit.taskboard.columnColor",wipLimit:"kit.taskboard.wipLimit",wipLimitHint:"kit.taskboard.wipLimitHint",lockColumn:"kit.taskboard.lockColumn",lockColumnHint:"kit.taskboard.lockColumnHint",acceptsFrom:"kit.taskboard.acceptsFrom",acceptsAny:"kit.taskboard.acceptsAny",save:"kit.taskboard.save",cancel:"kit.taskboard.cancel"},xa=(e,t)=>t?e.replace(/\{(\w+)\}/g,(a,s)=>s in t?String(t[s]):a):e;function wa(e){const t=nn();return i.useCallback((a,s)=>{const r=e?.[a];return r!==void 0?xa(r,s):t(va[a],s)},[t,e])}const Ca=2e3,Sa="bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",ja="bg-white/70 shadow-sm ring-1 ring-white/60 backdrop-blur-md dark:bg-white/10 dark:ring-white/10",Ta="bg-black/[0.03] dark:bg-white/[0.04]",Ba="bg-white/25 dark:bg-white/5",Na="bg-white dark:bg-neutral-900",Ra="bg-white/80 backdrop-blur-md dark:bg-neutral-900/70",Ct=e=>{const{cards:t,columns:a,lanes:s,layout:r="columns",priorities:o,cardLayout:l="detailed",renderCard:d,onCardsChange:h,onColumnsChange:u,onLanesChange:m,onBeforeMove:p,editable:y,editMode:x=!1,onCardOpen:C,onCardContextMenu:k,onAddCard:w,selectedIds:g,onSelectionChange:v,transport:B,currentUser:R,icon:D,title:U,subtitle:$,summary:z,actions:F,loading:V,loaderType:c="skeleton",error:b,onRetry:f,emptyState:T,color:M="blue",size:E="md",labels:L,columnCorner:I="rounded-md",surfaceVariant:P}=e,_=sn(),O=wa(L),{locale:W}=on(),G=it[E]??it.md,Z=_.translucent?Ba:Ta,he=rn(I),ce=i.useRef(null),ee=y??!!h,fe=r==="lanes"&&!!s?.length,ne=fe?s:void 0,je=j=>h?.(Se(t,j,a,ne),j),K=ba(B,R),q=R?.id,{drag:S,pending:H,previewCards:se,cardHandlers:Qe,cancel:Me,finish:Ht,keyboardGrab:Ft,keyboardMove:Ut}=ca({cards:t,columns:a,lanes:ne,editable:ee,heldBy:K.heldBy,selfId:q,onBeforeMove:p,onCommit:je,onDragStart:K.grab,onDragTarget:(j,A)=>A&&K.hover(j,A),onDragEnd:K.release}),[ue,Ze]=i.useState(null);i.useEffect(()=>{if(!S||!q)return;const j=K.heldBy.get(S.cardId);if(!j||j===q)return;const A=K.userById(j);Me("held"),Ze({cardId:S.cardId,text:O("heldShort",{name:A.name}),color:A.color??Re(A.id)})},[K,S,q,Me,O]),i.useEffect(()=>{if(!ue)return;const j=setTimeout(()=>Ze(null),Ca);return()=>clearTimeout(j)},[ue]);const ye=ma({rootRef:ce,cards:t,viewCards:se,columns:a,lanes:ne,text:O,drag:S,keyboardGrab:Ft,keyboardMove:Ut,finish:Ht,cancel:Me,heldBy:K.heldBy,selfId:q,onCardContextMenu:k,selectedIds:g,onSelectionChange:v}),et=i.useMemo(()=>new Set(ye.selection),[ye.selection]),ge=!!(x&&u),Y=ha({rootRef:ce,columns:a,enabled:ge,text:O,announce:ye.announce,onCommit:j=>u?.(j)}),Ee=Y.previewColumns;fa(ce,Ee.map(j=>j.id).join("|"));const tt=i.useCallback(j=>u?.(a.map(A=>A.id===j.id?j:A)),[a,u]),nt=j=>u?.([...a,{id:Vn(j,a),title:j}]),at=ye.cardProps,st=i.useCallback(j=>{const A=K.heldBy.get(j);return A&&A!==q?K.userById(A):void 0},[K,q]),Kt=i.useMemo(()=>({text:O,surface:_,color:M,size:G,cardLayout:l,priorities:new Map((o??[]).map(j=>[j.id,j])),locale:W,editable:ee,renderCard:d,onCardOpen:C,onCardContextMenu:k,onAddCard:w,cardSurface:_.translucent?ja:Sa,wellSurface:Z,columnCornerClass:he,columnGripProps:ge?Y.gripProps:void 0,draggingColumnId:Y.drag?.id??null,onEditColumn:ge?tt:void 0,allColumns:a,stickySurface:_.translucent?Ra:Na,cardState:j=>({held:st(j.id),notice:ue?.cardId===j.id?ue.text:void 0,noticeColor:ue?.cardId===j.id?ue.color:void 0,dragging:S?.cardId===j.id&&!S.keyboard,grabbed:S?.cardId===j.id&&!!S.keyboard,selected:et.has(j.id),pending:H?.cardId===j.id}),cardProps:(j,A)=>({...ee?Qe(j,A):{},...at(j,A)}),dropTarget:S?.to&&!S.valid?{bucket:Q(S.to.column,S.to.lane),index:S.to.index,valid:!1}:null}),[O,_,M,G,l,o,W,ee,d,C,k,w,Z,he,ge,Y.gripProps,Y.drag,tt,a,et,S,H,Qe,at,st,ue]),ot=i.useMemo(()=>Ce(se,a,ne),[se,a,ne]),Gt=S?t.find(j=>j.id===S.cardId):void 0,Le=u?j=>u(a.map(A=>A.id===j?{...A,collapsed:!A.collapsed}:A)):void 0,Wt=m&&s?j=>m(s.map(A=>A.id===j?{...A,collapsed:!A.collapsed}:A)):void 0,Vt=V&&c==="skeleton",qt=[D,U,$,z,F].some(j=>j!=null&&j!==!1)||!!(B&&R);let Te;return Vt?Te=n.jsx(ya,{columns:a.length||4,columnWidth:G.columnWidth,wellSurface:Z,cornerClass:he}):b?Te=n.jsxs("div",{role:"alert",className:"flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center",children:[n.jsx("p",{className:N("text-sm font-medium",_.body),children:b===!0?O("error"):b}),f&&n.jsx(pe,{size:"sm",variant:"outline",color:M,onClick:f,children:O("retry")})]}):Te=n.jsxs("div",{className:"flex min-h-0 flex-1 flex-col",children:[t.length===0&&n.jsx("div",{"data-taskboard-empty":!0,className:N("px-4 pt-4 text-center text-sm",_.muted),children:T??O("empty")}),fe?n.jsx(ta,{cards:se,columns:Ee,onAddColumn:ge?nt:void 0,lanes:s,buckets:ot,onToggleLane:Wt,onToggleColumn:Le}):n.jsx(Xe,{"data-taskboard-scroll":!0,variant:"hover",tabIndex:-1,className:"min-h-0 flex-1",contentClassName:"flex! h-full",children:n.jsxs("div",{"data-taskboard-columns":!0,className:"flex w-max items-stretch gap-3 p-3",children:[Ee.map((j,A)=>n.jsx(Xn,{column:j,index:A,cards:ot.get(Q(j.id,null))??[],count:He(se,j.id),onToggle:Le&&(()=>Le(j.id))},j.id)),ge&&n.jsx(zt,{variant:"column",onAdd:nt})]})})]}),n.jsxs(ln.Provider,{value:Kt,children:[n.jsxs("div",{ref:ce,"data-taskboard":!0,role:"application","aria-roledescription":"task board","aria-busy":V?!0:void 0,"aria-label":O("root"),className:"flex h-full min-h-0 flex-col",children:[n.jsx("div",{"data-taskboard-live":!0,"aria-live":"polite","aria-atomic":"true",className:"sr-only",children:ye.message}),qt&&n.jsx(Qn,{icon:D,title:U,subtitle:$,summary:z,actions:F,people:B&&R?[R,...K.peers]:void 0,variant:P}),Te]}),n.jsx(sa,{drag:S,card:Gt}),n.jsx(qn,{drag:Y.drag,column:a.find(j=>j.id===Y.drag?.id),count:Y.drag?He(t,Y.drag.id):0,cards:Y.drag?t.filter(j=>j.column===Y.drag.id):[]}),B&&n.jsx(ka,{rootRef:ce,holds:K.presence.holds,selfId:q,cards:t,userById:K.userById})]})},ae=e=>{const{variant:t="elevated",tone:a,corner:s="rounded-md",padding:r="none",glassOpacity:o,vibrancy:l,specularMode:d,loading:h,loaderType:u="skeleton",className:m,height:p}=e;return t==="plain"?n.jsx("div",{className:N("flex min-h-0 flex-col",m),style:{height:p},children:n.jsx(Ct,{...e,surfaceVariant:"elevated"})}):n.jsx(an,{variant:t,tone:a,corner:s,padding:r,glassOpacity:o,vibrancy:l,specularMode:d,loading:!!h&&u!=="skeleton",loaderType:u,flexBody:!0,scrollable:!1,className:m,style:{height:p},children:n.jsx(Ct,{...e,surfaceVariant:t})})},Pe=de.roadmap(),St=de.fieldOps(),Ma={activation:"sky",billing:"amber",enterprise:"violet",analytics:"teal",research:"fuchsia",checkout:"rose",mobile:"indigo",platform:"slate",quote:"sky",retail:"amber",access:"violet","cold-chain":"cyan",security:"rose",handoff:"teal",crew:"lime",safety:"red",baggage:"orange"};function Ea(e){const t=e.tags?.[0],a=typeof t=="string"?t:t?.label;return a?Ma[a]??"emerald":void 0}function La(e,t,a){return e.map(s=>({...s,wipLimit:t&&(s.id==="building"||s.id==="onsite")?s.id==="building"?4:5:void 0,accepts:a&&s.id==="ready"?["discovery"]:void 0,locked:a&&(s.id==="blocked"||s.id==="closed")?!0:void 0}))}const Ia=()=>{const[e,t]=Cn(),[a,s]=i.useState("columns"),[r,o]=i.useState("detailed"),[l,d]=i.useState("elevated"),[h,u]=i.useState("rounded-md"),[m,p]=i.useState("rounded-md"),[y,x]=i.useState(!1),[C,k]=i.useState(!1),[w,g]=i.useState("none"),[v,B]=i.useState("blue"),[R,D]=i.useState("md"),[U,$]=i.useState(!0),[z,F]=i.useState(!0),[V,c]=i.useState(!1),[b,f]=i.useState(!1),[T,M]=i.useState("skeleton"),[E,L]=i.useState(!1),[I,P]=i.useState(!1),_=a==="lanes"?St:Pe,[O,W]=i.useState(Pe.cards),[G,Z]=i.useState(Pe.columns),[he,ce]=i.useState(St.lanes),ee=i.useRef(Gn()).current,[fe,ne]=i.useState(0);i.useEffect(()=>{W(_.cards),Z(_.columns),o(a==="lanes"?"compact":"detailed"),ee.clear(),ne(0)},[a]);const je=i.useMemo(()=>La(G,z,V),[G,z,V]),K=()=>{const S=ee.undo(O,je,a==="lanes"?he:void 0);S&&(W(S),ne(ee.size),t("undo"))},q=i.useRef(K);return q.current=K,i.useEffect(()=>{const S=H=>{if((H.ctrlKey||H.metaKey)&&!H.shiftKey&&H.key.toLowerCase()==="z"){if(H.target?.closest("input, textarea, [contenteditable]"))return;H.preventDefault(),q.current()}};return window.addEventListener("keydown",S),()=>window.removeEventListener("keydown",S)},[]),n.jsx(xn,{controls:n.jsxs("div",{className:"space-y-3",children:[n.jsx(wn,{groups:[{id:"layout",title:"Layout",controls:n.jsxs(n.Fragment,{children:[n.jsx(Ie,{label:"Layout",options:jn,value:a,onChange:S=>s(S)}),n.jsx(Ie,{label:"Cards",options:Tn,value:r,onChange:S=>o(S)}),n.jsx(ve,{label:"Size",options:Bn,value:R,onChange:S=>D(S)})]})},{id:"surface",title:"Surface",controls:n.jsxs(n.Fragment,{children:[n.jsx(ve,{label:"Variant",options:Nn,value:l,onChange:S=>d(S)}),n.jsx(ve,{label:"Corner",options:dt,value:h,onChange:S=>u(S)}),n.jsx(ve,{label:"Column corner",options:dt,value:m,onChange:S=>p(S)}),n.jsx(ve,{label:"Padding",options:Rn,value:w,onChange:S=>g(S)}),n.jsx(Ae,{label:"Accent",children:n.jsx(Lt,{selectable:!0,size:"sm",value:v,onSelect:B,defaultExpanded:!0})})]})},{id:"rules",title:"Rules",controls:n.jsx(Ae,{label:"Rules",children:n.jsxs("div",{className:"space-y-1.5",children:[n.jsx(re,{label:"Editable",checked:U,onChange:$}),n.jsx(re,{label:"Card tones",checked:y,onChange:x}),n.jsx(re,{label:"Edit mode (columns)",checked:C,onChange:k}),n.jsx(re,{label:"WIP limits",checked:z,onChange:F}),n.jsx(re,{label:"Transition rules + locks",checked:V,onChange:c})]})})},{id:"states",title:"States",controls:n.jsxs(n.Fragment,{children:[n.jsx(Ae,{label:"State",children:n.jsxs("div",{className:"space-y-1.5",children:[n.jsx(re,{label:"Loading",checked:b,onChange:f}),n.jsx(re,{label:"Error",checked:E,onChange:L}),n.jsx(re,{label:"Empty",checked:I,onChange:P})]})}),b&&n.jsx(Ie,{label:"Loader type",options:Mn,value:T,onChange:S=>M(S)})]})}]}),n.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Drag a card, or focus one and press ",n.jsx("strong",{children:"Space"})," to pick it up, the ",n.jsx("strong",{children:"arrows"})," to move it and ",n.jsx("strong",{children:"Space"})," again to drop. ",n.jsx("strong",{children:"Ctrl/⌘+Z"})," undoes the last move."]})]}),preview:n.jsxs("div",{className:"flex w-full flex-col gap-2",children:[n.jsx(ae,{layout:a,cardLayout:r,cards:I?[]:y?O.map(S=>({...S,tone:Ea(S)})):O,columns:je,lanes:he,priorities:_.priorities,editable:U,editMode:C,onCardsChange:(S,H)=>{W(S),ee.push(H),ne(ee.size),t(`onCardsChange → ${H.cardId}: ${H.from.column} → ${H.to.column}[${H.to.index}]`)},onColumnsChange:S=>{Z(S),t(`onColumnsChange → [${S.map(H=>H.id).join(", ")}]`)},onLanesChange:ce,onCardOpen:S=>t(`onCardOpen → ${S.id}`),onCardContextMenu:({card:S,x:H,y:se})=>t(`onCardContextMenu → ${S.id} @ ${Math.round(H)},${Math.round(se)}`),onAddCard:({column:S,lane:H})=>t(`onAddCard → ${S}${H?` / ${H}`:""}`),onSelectionChange:S=>t(`onSelectionChange → [${S.join(", ")}]`),loading:b,loaderType:T,error:E||void 0,onRetry:()=>{L(!1),t("onRetry")},variant:l,corner:h,columnCorner:m,padding:w,color:v,size:R,icon:n.jsx(At,{className:"h-5 w-5"}),title:a==="lanes"?"FieldOps Dispatch":"Horizon Roadmap",subtitle:a==="lanes"?"Regional service lanes · Today":"Q3 launch command center",summary:n.jsxs(le,{size:"sm",variant:"soft",tone:"slate",children:[O.length," cards"]}),actions:n.jsxs("span",{className:"relative inline-flex",children:[n.jsx(dn,{icon:"Revert",size:"sm",variant:"ghost",srLabel:"Undo last move",onClick:K,disabled:fe===0}),fe>0&&n.jsx(cn,{count:fe,size:"xs",tone:"slate",className:"pointer-events-none absolute -top-1 -right-1"})]}),height:540}),n.jsx(Sn,{log:e,emptyText:"No events yet — drag, click or right-click a card."})]})})},xe=de.roadmap();function Aa(){const[e,t]=i.useState(xe.cards),[a,s]=i.useState(null),[r,o]=i.useState(null),l=i.useRef(null),d=e.filter(p=>p.column==="building").length,h=e.filter(p=>p.column==="blocked").length,u=r?[{value:"edit",label:"Edit card",icon:"Edit"},...xe.columns.filter(p=>p.id!==r.column).map(p=>({value:`move:${p.id}`,label:`Move to ${p.title}`,icon:"ArrowRight"})),{value:"duplicate",label:"Duplicate",icon:"Copy"},{value:"delete",label:"Delete",icon:"Trash",danger:!0}]:[],m=p=>{if(!r)return;const{card:y}=r;if(p.value==="edit"&&s(y),p.value==="duplicate"&&t(x=>[...x,{...y,id:`${y.id}-copy-${x.length}`,title:`${y.title} (copy)`}]),p.value==="delete"&&t(x=>x.filter(C=>C.id!==y.id)),p.value.startsWith("move:")){const x=p.value.slice(5);t(C=>[...C.filter(k=>k.id!==y.id),{...y,column:x}])}o(null)};return n.jsxs("div",{className:"w-full",children:[n.jsx(ae,{cards:e,columns:xe.columns,priorities:xe.priorities,onCardsChange:t,onCardOpen:s,onCardContextMenu:o,onAddCard:({column:p})=>t(y=>[...y,{id:`new-${y.length}`,title:"Untitled initiative",column:p}]),icon:n.jsx(At,{className:"h-5 w-5"}),title:"Horizon Roadmap",subtitle:"Q3 launch command center",summary:n.jsxs(n.Fragment,{children:[n.jsxs(le,{size:"sm",variant:"soft",tone:"slate",children:[e.length," initiatives"]}),n.jsxs(le,{size:"sm",variant:"soft",tone:"emerald",children:[d," shipping"]}),n.jsxs(le,{size:"sm",variant:"soft",tone:"orange",children:[h," blocked"]})]}),height:560}),n.jsx("div",{ref:l,className:"fixed h-0 w-0",style:{left:r?.x??0,top:r?.y??0}}),n.jsx(un,{anchorRef:l,open:r!==null,onClose:()=>o(null),items:u,onSelect:m}),n.jsx(mn,{isOpen:a!==null,onClose:()=>s(null),title:"Edit initiative",subtitle:a?.id,footer:n.jsxs("div",{className:"flex justify-end gap-2",children:[n.jsx(pe,{variant:"soft",color:"slate",onClick:()=>s(null),children:"Cancel"}),n.jsx(pe,{onClick:()=>{a&&t(p=>p.map(y=>y.id===a.id?a:y)),s(null)},children:"Save"})]}),children:a&&n.jsxs("div",{className:"flex flex-col gap-4 p-1",children:[n.jsx(_e,{"aria-label":"Title",value:a.title,onChange:p=>s({...a,title:p.target.value})}),n.jsxs(pn,{"aria-label":"Priority",value:a.priority??"",onChange:p=>s({...a,priority:p.target.value||void 0}),children:[n.jsx("option",{value:"",children:"No priority"}),xe.priorities.map(p=>n.jsx("option",{value:p.id,children:p.label},p.id))]})]})})]})}const Da=`import { useRef, useState } from "react";
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
`,Ne=de.fieldOps();function Pa(){const[e,t]=i.useState(Ne.cards),[a,s]=i.useState(Ne.lanes),r=(d="intake",h=a[0].id)=>t(u=>[...u,{id:`job-${u.length+1}`,title:"New service job",column:d,lane:h??void 0,priority:"medium",points:1}]),o=e.filter(d=>d.column==="onsite"||d.column==="scheduled").length,l=e.filter(d=>d.priority==="critical").length;return n.jsx("div",{className:"w-full",children:n.jsx(ae,{layout:"lanes",cardLayout:"compact",size:"sm",color:"emerald",cards:e,columns:Ne.columns,lanes:a,priorities:Ne.priorities,onCardsChange:t,onLanesChange:s,onAddCard:({column:d,lane:h})=>r(d,h),icon:n.jsx(hn,{className:"h-5 w-5"}),title:"FieldOps Dispatch",subtitle:"Regional service lanes · Today",summary:n.jsxs(n.Fragment,{children:[n.jsxs(le,{size:"sm",variant:"soft",tone:"slate",children:[a.length," regions"]}),n.jsxs(le,{size:"sm",variant:"soft",tone:"sky",children:[o," active jobs"]}),n.jsxs(le,{size:"sm",variant:"soft",tone:"rose",children:[l," priority"]})]}),actions:n.jsx(pe,{size:"sm",color:"emerald",leadingIcon:"Add",onClick:()=>r(),children:"New job"}),height:560})})}const Oa=`import { useState } from "react";
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
`,$a=[{id:"backlog",title:"Backlog",color:"slate"},{id:"ready",title:"Ready",color:"sky",accepts:["backlog"]},{id:"building",title:"Building",color:"amber",wipLimit:3},{id:"review",title:"Review",color:"violet"},{id:"shipped",title:"Shipped",color:"emerald",locked:!0}],we={id:"lb",name:"Lena Brandt",color:"teal"},za=[{id:"a",column:"backlog",title:"Rate-limit public API",assignees:[we]},{id:"b",column:"backlog",title:"Rotate signing keys"},{id:"c",column:"ready",title:"Billing webhooks retry",assignees:[we]},{id:"d",column:"building",title:"Org-level SSO",assignees:[we]},{id:"e",column:"building",title:"CSV export"},{id:"f",column:"building",title:"Audit log search",assignees:[we]},{id:"g",column:"shipped",title:"Usage dashboard",assignees:[we]}],_a=e=>new Promise(t=>setTimeout(t,e));function Ha(){const[e,t]=i.useState(za),[a,s]=i.useState("Drag a card — refused targets turn red."),r=async o=>{if(o.to.column!=="review")return!0;const l=e.find(h=>h.id===o.cardId);s(`Asking for approval to review "${l?.title}"…`),await _a(800);const d=!!l?.assignees?.length;return s(d?"Approved.":`Refused: "${l?.title}" needs an owner before review.`),d};return n.jsxs("div",{className:"flex w-full flex-col gap-2",children:[n.jsx(ae,{cards:e,columns:$a,onCardsChange:t,onBeforeMove:r,size:"sm",variant:"outlined",height:420}),n.jsx("p",{"aria-live":"polite",className:"text-xs text-neutral-500 dark:text-neutral-400",children:a})]})}const Fa=`import { useState } from "react";
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
`,jt=de.roadmap();function Ua({card:e,dragging:t}){const a=e.checklist?e.checklist.done/e.checklist.total:0;return n.jsxs("div",{className:"flex flex-col gap-2",children:[n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-100",children:e.title}),t&&n.jsx("span",{className:"text-[10px] uppercase tracking-wide text-sky-600",children:"moving"})]}),n.jsx("div",{className:"h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",children:n.jsx("div",{className:"h-full rounded-full bg-sky-500",style:{width:`${Math.round(a*100)}%`}})}),n.jsx("span",{className:"text-[11px] text-neutral-500 dark:text-neutral-400",children:e.checklist?`${e.checklist.done} of ${e.checklist.total} tasks`:"No checklist"})]})}function Ka(){const[e,t]=i.useState(jt.cards.filter(a=>a.column!=="blocked"));return n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:e,columns:jt.columns.filter(a=>a.id!=="blocked"),onCardsChange:t,renderCard:(a,s)=>n.jsx(Ua,{card:a,dragging:s.dragging}),color:"sky",size:"sm",height:460})})}const Ga=`import { useState } from "react";
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
`,Oe=de.roadmap(),Wa=[{label:"Ready",value:"ready"},{label:"Loading",value:"loading"},{label:"Empty",value:"empty"},{label:"Error",value:"error"}];function Va(){const[e,t]=i.useState("loading");return n.jsxs("div",{className:"flex w-full flex-col gap-3",children:[n.jsx(fn,{size:"sm",options:Wa,value:e,onChange:t}),n.jsx(ae,{cards:e==="empty"?[]:Oe.cards,columns:Oe.columns,priorities:Oe.priorities,loading:e==="loading",error:e==="error"?"The board service did not answer.":void 0,onRetry:()=>t("loading"),onAddCard:()=>t("ready"),emptyState:"Nothing planned yet — add the first initiative to any column.",title:"Horizon Roadmap",size:"sm",height:400})]})}const qa=`import { useState } from "react";
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
`,$e=de.roadmap();function Ya(){const[e,t]=i.useState($e.cards),[a,s]=i.useState($e.columns),[r,o]=i.useState(!1);return n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:e,columns:a,priorities:$e.priorities,onCardsChange:t,onColumnsChange:s,editMode:r,title:"Horizon Roadmap",subtitle:r?"Editing the layout — drag a grip to reorder":"Q3 launch command center",actions:n.jsx(pe,{size:"sm",variant:r?"solid":"soft",onClick:()=>o(l=>!l),children:r?"Done":"Edit board"}),size:"sm",height:460})})}const Xa=`import { useState } from "react";
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
`,Ja=[{id:"todo",title:"To do",color:"slate"},{id:"doing",title:"Doing",color:"sky"},{id:"done",title:"Done",color:"emerald"}],Qa=[{id:"1",column:"todo",title:"Crash on empty workspace",tone:"rose",tags:["bug"]},{id:"2",column:"todo",title:"Bulk archive",tone:"sky",tags:["feature"]},{id:"3",column:"todo",title:"Rename 'Spaces' to 'Teams'",tone:"amber",tags:["copy"]},{id:"4",column:"doing",title:"Timezone drift in reports",tone:"rose",tags:["bug"]},{id:"5",column:"doing",title:"Saved filters",tone:"sky",tags:["feature"]},{id:"6",column:"done",title:"Upgrade the date library",tone:"violet",tags:["chore"]},{id:"7",column:"done",title:"Keyboard shortcuts sheet",tone:"sky",tags:["feature"]}];function Za(){const[e,t]=i.useState(Qa);return n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:e,columns:Ja,onCardsChange:t,size:"sm",corner:"rounded-md",columnCorner:"rounded-sm",height:360})})}const es=`import { useState } from "react";
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
`,ze=de.roadmap(),Tt=["Ana","Ben","Chloé","Dev","Eli","Femi","Gus","Hana"],Bt="kit-docs-demo";function ts(){const e=i.useMemo(()=>{const d=`tab-${Math.random().toString(36).slice(2,8)}`,h=Tt[Math.floor(Math.random()*Tt.length)];return{id:d,name:h,color:Re(d)}},[]),[t,a]=i.useState(ze.cards),[s,r]=i.useState(),[o,l]=i.useState();return i.useEffect(()=>{if(typeof BroadcastChannel>"u")return;const d=Un(Bt),h=new BroadcastChannel(`${Bt}:cards`);return h.onmessage=u=>a(u.data),r(d),l(h),()=>{d.close(),h.close()}},[]),n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:t,columns:ze.columns,priorities:ze.priorities,onCardsChange:d=>{a(d),o?.postMessage(d)},transport:s,currentUser:e,title:"Live board",subtitle:"Open this page in a second tab and drag a card",summary:n.jsxs(le,{size:"sm",variant:"soft",tone:e.color,children:["You are ",e.name]}),height:520})})}const ns=`import { useEffect, useMemo, useState } from "react";
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
`,as=`import type { TaskBoardTransport } from "@cjlapao/ui-kit";

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
/>`,ms=()=>n.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[n.jsx(vn,{name:"Task Board",description:"A kanban board in two layouts — columns, or columns crossed with swimlanes — with real-time drag and drop by pointer, touch and keyboard. Locks, WIP limits and transition rules are enforced before a card moves, a guarded move can wait on your server, and a collaboration channel shows teammates' drags live: the card they hold is locked on your screen and a ghost shows where it is going. The board is a Panel, so every surface variant, corner and glass setting comes with it. React ships first; the Vue kit is a step behind."}),n.jsx(Ia,{}),n.jsxs("section",{className:"flex flex-col gap-5",children:[n.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),n.jsx(oe,{title:"Product roadmap",description:"The columns view with detailed cards. Click or press Enter to open the editor (a SidePanel the app owns); right-click or Shift+F10 for a menu anchored at the payload's x / y. Summary pills and the add-card buttons are plain props.",code:Da,filename:"ProductRoadmap.tsx",children:n.jsx(Aa,{})}),n.jsx(oe,{title:"Field operations (swimlanes)",description:'`layout="lanes"` crosses the columns with `lanes`. Cards move across lanes as freely as across columns, each lane collapses on its own, and the column header and lane labels stay put while the grid scrolls.',code:Oa,filename:"FieldOperations.tsx",children:n.jsx(Pa,{})}),n.jsx(oe,{title:"Rules and guarded moves",description:"`accepts`, `wipLimit` and `locked` are checked by the engine, so a refused bucket turns red and never previews the card. `onBeforeMove` adds your own check — sync or async — and a refusal puts the card back with no rollback code.",code:Fa,filename:"Rules.tsx",children:n.jsx(Ha,{})}),n.jsx(oe,{title:"Edit the board",description:"`editMode` unlocks the layout: every column header gets a grip to drag it to a new position (or Space, arrows, Space from the keyboard) and an edit button for its properties — name, colour, WIP limit, lock, and which columns it accepts cards from — and an Add column slot follows the last column. Both report through `onColumnsChange`. Outside edit mode the layout is fixed — cards still move as usual.",code:Xa,filename:"EditMode.tsx",children:n.jsx(Ya,{})}),n.jsx(oe,{title:"Card tones and corners",description:"`tone` on a card tints its surface, so every card can carry its own colour — status, type, owner. It survives glass (a translucent tint) and the drag clone. `columnCorner` rounds the column wells on the same container scale as the board's `corner`; both default to md.",code:es,filename:"CardTones.tsx",children:n.jsx(Za,{})}),n.jsx(oe,{title:"Custom cards",description:"`renderCard` swaps a card's body; the shell (drag, focus, selection, teammate ring) stays the board's, and the state argument tells the body what is happening to it.",code:Ga,filename:"CustomCards.tsx",children:n.jsx(Ka,{})}),n.jsx(oe,{title:"Loading, empty and error",description:"Loading draws a skeleton shaped like the board. Error replaces the columns with the message and a Retry. An empty board keeps its columns, so Add card is still there.",code:qa,filename:"States.tsx",children:n.jsx(Va,{})}),n.jsx(oe,{title:"Live collaboration",description:"Open this page in a second tab and drag a card. The other tab locks it, shows your name on it, and moves a ghost to wherever you are pointing; drop, and the card lands there. Whoever grabbed first wins, on every screen, and a tab that closes mid-drag lets go after eight seconds.",code:ns,filename:"LiveCollaboration.tsx",children:n.jsx(ts,{})})]}),n.jsxs(gn,{children:[n.jsxs(lt,{title:"Screen reader",children:[n.jsxs("p",{children:["The board is a ",n.jsx(X,{children:'role="application"'})," region named by ",n.jsx(X,{children:"kit.taskboard.root"})," with"," ",n.jsx(X,{children:'aria-roledescription="task board"'}),". Each column (or column × lane cell) is a ",n.jsx(X,{children:'role="group"'})," named by its title and card count, and each card is a ",n.jsx(X,{children:'role="button"'})," with"," ",n.jsx(X,{children:'aria-roledescription="card"'}),", named by its title."]}),n.jsxs("p",{children:['Moves are spoken through a polite live region: picking a card up, every step ("Moved to Discovery, position 1 of 4"), the drop and a cancel. A card a teammate holds gets ',n.jsx(X,{children:"aria-disabled"}),' and a visually hidden "',"{name}",' is moving this"; a pending guarded move sets ',n.jsx(X,{children:"aria-busy"})," on the card."]}),n.jsx(bn,{code:as,filename:"transport.tsx"})]}),n.jsx(kn,{bindings:[{keys:["Tab"],action:"Moves into the board — one card is in the tab order at a time (roving tabindex)."},{keys:["↑ / ↓"],action:"Moves focus to the previous / next card in the column."},{keys:["← / →"],action:"Moves focus to the nearest card in the previous / next column (mirrored in RTL)."},{keys:["Alt","↑ / ↓"],action:"Moves focus to the previous / next lane."},{keys:["Space"],action:"Picks the focused card up; with a card held, drops it."},{keys:["Arrows (held)"],action:"Moves the held card through valid slots only — full, locked and refused columns are skipped. Alt+↑/↓ crosses lanes."},{keys:["Esc"],action:"Cancels the move; the card goes back where it was."},{keys:["Enter"],action:"Opens the card (onCardOpen)."},{keys:["Shift","F10"],action:"Opens the context menu (onCardContextMenu); the Menu key does the same."},{keys:["Space (grip)"],action:"Edit mode: picks the column up; ← / → move it one position (mirrored in RTL); Space drops; Esc or Tab cancels."}]}),n.jsx(lt,{title:"Internationalization",children:n.jsxs("p",{children:['Every built-in string — "Add card", the counts, the announcements, "',"{name}",' is moving this" — is a'," ",n.jsx(X,{children:"kit.taskboard.*"})," key in the kit catalogs (en, de, es, fr, pt), and ",n.jsx(X,{children:"labels"})," overrides any of them per board. Card titles, column titles and lane titles are your data. Due dates format with the kit locale. Inside a ",n.jsx(X,{children:'dir="rtl"'})," container the columns run right to left and the arrow keys follow."]})})]}),n.jsx(yn,{props:[{name:"cards / columns / lanes",type:"TaskBoardCard[] / TaskBoardColumn[] / TaskBoardLane[]",description:"The data, controlled. Order inside a column × lane is the order of the cards array — there is no second ordering to keep in sync."},{name:"onCardsChange",type:"(next, move) => void",description:"The single commit event: the next cards array, and the move that produced it (ready for your undo history or your API)."},{name:"onColumnsChange / onLanesChange",type:"(next) => void",description:"Collapse changes — and, in edit mode, column reorders and added columns. Omit one and its carets disappear."},{name:"editMode",type:"boolean",default:"false",description:"Layout editing: a drag grip and an edit button (name, colour, WIP limit, lock, accepted sources) on every column header, and an Add column slot after the last column (columns and lanes layouts). Needs onColumnsChange; the new column's id is slugged from its name and kept unique."},{name:"onBeforeMove",type:"(move) => boolean | Promise<boolean>",description:"Guard a move after the engine rules pass. While it is pending the card waits in its new slot; false or a throw puts it back."},{name:"editable",type:"boolean",default:"!!onCardsChange",description:"Pointer and keyboard moves. Selection, focus and opening still work on a read-only board."},{name:"layout",type:"TaskBoardLayout",default:'"columns"',description:'"lanes" crosses the columns with `lanes`.'},{name:"cardLayout / renderCard",type:"TaskBoardCardLayout / (card, state) => ReactNode",default:'"detailed"',description:"A preset card body, or your own. The card shell stays the board's."},{name:"priorities",type:"TaskBoardPriority[]",description:"What `card.priority` ids resolve to: label and colour."},{name:"onCardOpen / onCardContextMenu / onAddCard",type:"callbacks",description:"App-owned surfaces. The context-menu payload carries the card, column, lane, index, x / y and the event."},{name:"selectedIds / onSelectionChange",type:"string[] / (ids) => void",description:"Click, Ctrl/⌘-click and Shift-click (range within a column). Uncontrolled when selectedIds is omitted."},{name:"transport / currentUser",type:"TaskBoardTransport / TaskBoardUser",description:"The collaboration channel: presence, grabs and drag targets only — never card data. Without both, nothing runs."},{name:"icon / title / subtitle / summary / actions",type:"ReactNode",description:"The header strip. Online teammates appear between summary and actions."},{name:"loading / loaderType",type:"boolean / PanelLoaderType",default:'false / "skeleton"',description:"The skeleton is shaped like the board; any other type overlays Panel's loader."},{name:"error / onRetry / emptyState",type:"ReactNode | boolean / () => void / ReactNode",description:"true shows the built-in message. The empty state sits above the columns, which stay."},{name:"card.tone",type:"TrueColor",description:"Per card: tints that card's surface (a solid tint, or a translucent one on glass boards), so cards can be told apart by colour. Omitted keeps the neutral card."},{name:"columnCorner",type:"SurfaceCorner",default:'"rounded-md"',description:"Radius of the column wells, collapsed strips and skeleton included — the container scale `corner` uses."},{name:"variant",type:"TaskBoardVariant",default:'"elevated"',description:"Any Panel surface, or plain for no chrome. Translucent surfaces switch the wells, cards and sticky headers to glass."},{name:"tone / corner / padding / glassOpacity / vibrancy / specularMode",type:"Panel props",default:'corner "rounded-md", padding "none"',description:"Passed to the Panel the board renders."},{name:"color",type:"TrueColor",default:'"blue"',description:"Accent for focus, selection, the drag clone, and the column edge when a column has no colour of its own."},{name:"size",type:"ControlSize",default:'"md"',description:"Column width and card density, from xs (232 px) to xl (352 px)."},{name:"labels",type:"Partial<TaskBoardLabels>",description:"Per-board overrides of the kit.taskboard strings."},{name:"height / className",type:"number | string / string",description:"The columns scroll inside the height."}]})]});export{ms as TaskBoardPage,ms as default};
