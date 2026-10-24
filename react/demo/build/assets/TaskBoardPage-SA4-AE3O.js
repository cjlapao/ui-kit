import{dJ as te,j as n,dK as Jt,f as N,r as i,cu as ye,dL as Je,cj as Qe,dM as Mt,dN as Rt,dO as Et,dP as Ze,dQ as Lt,dR as Qt,I as Ee,C as At,T as Zt,t as en,i as pe,dS as tn,dT as Pt,dl as et,dU as nn,dV as dt,dW as Le,dX as an,cf as sn,P as on,ct as rn,dY as ln,dA as dn,dZ as ct,d_ as cn,p as un,e as mn,b$ as de,d$ as Dt,e0 as pn,e1 as hn,cc as fn,e2 as gn,M as bn}from"./index-gt012o8E.js";import{A as kn,a as ut,C as Q,b as xn,K as yn,P as vn}from"./A11ySections-zw3_3X-2.js";import{P as wn}from"./PageHeader-CzVhyXQL.js";import{E as ie}from"./ExampleCard-V3REeYJ5.js";import{P as Cn,C as $e,S as ke,a as ze,T as le}from"./PlaygroundPanel-Czrs7oXC.js";import{C as Sn}from"./ControlAccordion-DIXHht2n.js";import{u as jn,E as Tn}from"./EventLog-Dx0vbma4.js";import{a8 as Nn,a9 as Bn,d as In,aa as Mn,p as mt,f as Rn,j as En}from"./options-CtADNKbm.js";function ee(e,t){return`${e}::${t??""}`}function tt(e,t){return!t||t.length===0?null:e.lane&&t.some(a=>a.id===e.lane)?e.lane:t[0].id}function Te(e,t,a){const s=new Map,r=a&&a.length?a.map(o=>o.id):[null];for(const o of t)for(const l of r)s.set(ee(o.id,l),[]);for(const o of e){const l=s.get(ee(o.column,tt(o,a)));l&&l.push(o)}return s}function Ge(e,t){let a=0;for(const s of e)s.column===t&&a++;return a}function Ln(e,t,a){let s=0;for(const r of e)(a?tt(r,a):r.lane)===t&&s++;return s}function Ot(e,t){return t==null?"none":e>t?"over":e===t?"full":"ok"}const pt=[{id:"sw",name:"Sara Walsh",color:"indigo"},{id:"jc",name:"Jonah Cole",color:"teal"},{id:"mg",name:"Maya Grant",color:"indigo"},{id:"ak",name:"Arjun Kapoor",color:"violet"},{id:"lb",name:"Lena Brandt",color:"teal"},{id:"rp",name:"Rui Pereira",color:"orange"}],ht=[{id:"nk",name:"Nadia Khan",color:"rose"},{id:"ml",name:"Marco Lund",color:"orange"},{id:"ps",name:"Priya Shah",color:"violet"},{id:"ob",name:"Owen Baker",color:"blue"},{id:"er",name:"Elif Reyes",color:"amber"},{id:"vc",name:"Victor Chen",color:"amber"},{id:"mp",name:"Mia Park",color:"green"},{id:"sc",name:"Sofia Costa",color:"fuchsia"}],$t=(e,t)=>e.find(a=>a.id===t);function An(){const e=s=>$t(pt,s),t=new Date().getFullYear(),a=(s,r)=>new Date(t,s-1,r).toISOString().slice(0,10);return{priorities:[{id:"p1",label:"P1",color:"red"},{id:"p2",label:"P2",color:"orange"},{id:"p3",label:"P3",color:"blue"},{id:"p4",label:"P4",color:"slate"}],users:pt.map(s=>({...s})),columns:[{id:"ideas",title:"Ideas",color:"blue"},{id:"discovery",title:"Discovery",color:"blue"},{id:"ready",title:"Ready",color:"blue"},{id:"building",title:"Building",color:"amber",wipLimit:5},{id:"blocked",title:"Blocked",color:"red"}],cards:[{id:"r1",column:"ideas",title:"Persona-based onboarding paths",tags:["activation","research"],priority:"p2",description:"Branch the first-run flow by role.",assignees:[e("sw")]},{id:"r2",column:"ideas",title:"Usage-based pricing meters",tags:["billing","platform"],priority:"p1",checklist:{done:2,total:5},due:a(11,6),assignees:[e("jc")]},{id:"r3",column:"ideas",title:"Enterprise SSO buying signal",tags:["enterprise","research"],priority:"p3",description:"Track SSO page visits per account."},{id:"r4",column:"ideas",title:"AI summary opt-in",tags:["research","platform"],priority:"p4",description:"Workspace-level toggle."},{id:"r5",column:"discovery",title:"Mobile trial activation",tags:[{label:"mobile",color:"fuchsia"},"activation"],priority:"p2",checklist:{done:1,total:3},due:a(10,30),assignees:[e("mg")]},{id:"r6",column:"discovery",title:"Account health score",tags:["analytics","growth"],priority:"p3",description:"Blend usage, seats and tickets.",assignees:[e("ak")]},{id:"r7",column:"discovery",title:"Partner API discovery",tags:["platform"],priority:"p4"},{id:"r8",column:"ready",title:"Customer import wizard",tags:["activation","platform"],priority:"p3",assignees:[e("lb")]},{id:"r9",column:"ready",title:"Self-serve plan downgrade",tags:["billing","trust"],priority:"p2",description:"Keep data, drop seats.",due:a(10,28),assignees:[e("rp")]},{id:"r10",column:"ready",title:"Warehouse sync beta",tags:["analytics","enterprise"],priority:"p1",due:a(11,2),assignees:[e("jc")]},{id:"r11",column:"building",title:"Checkout recovery campaign",tags:["checkout","growth"],priority:"p1",checklist:{done:3,total:5},due:a(10,26),assignees:[e("sw")]},{id:"r12",column:"building",title:"Admin audit log",tags:["enterprise","trust"],priority:"p2",checklist:{done:1,total:3},description:"Every admin action, exportable.",assignees:[e("lb")]},{id:"r13",column:"building",title:"Saved dashboard templates",tags:["analytics","platform"],priority:"p3",assignees:[e("jc")]},{id:"r14",column:"building",title:"Expansion signal pipeline",tags:["analytics","growth"],priority:"p3",due:a(10,29),assignees:[e("ak")]},{id:"r15",column:"blocked",title:"App store review fixes",tags:["checkout","mobile"],priority:"p2",assignees:[e("mg")]},{id:"r16",column:"blocked",title:"Data residency (EU)",tags:["enterprise"],priority:"p3",description:"Waiting on legal sign-off."}]}}function Pn(){const e=t=>$t(ht,t);return{priorities:[{id:"critical",label:"Critical",color:"red"},{id:"high",label:"High",color:"orange"},{id:"medium",label:"Medium",color:"blue"},{id:"low",label:"Low",color:"slate"}],users:ht.map(t=>({...t})),columns:[{id:"intake",title:"Intake"},{id:"scheduled",title:"Scheduled"},{id:"onsite",title:"On site"},{id:"review",title:"Review"},{id:"closed",title:"Closed"}],lanes:[{id:"north",title:"North Region"},{id:"downtown",title:"Downtown Retail"},{id:"airport",title:"Airport Terminal"},{id:"harbor",title:"Harbor Logistics"}],cards:[{id:"f1",lane:"north",column:"intake",title:"Quote backup generator service",priority:"medium",points:2,tags:["quote"],assignees:[e("ps")]},{id:"f2",lane:"north",column:"scheduled",title:"Replace freezer controller",priority:"high",points:2,tags:["cold-chain"],assignees:[e("nk")]},{id:"f3",lane:"north",column:"onsite",title:"Investigate gate sensor loop",priority:"critical",points:3,tags:["access"],assignees:[e("ml")]},{id:"f4",lane:"north",column:"onsite",title:"Refit loading dock camera",priority:"high",points:5,tags:["security"],assignees:[e("nk")]},{id:"f5",lane:"north",column:"review",title:"Verify night crew handoff",priority:"medium",points:1,tags:["handoff"],assignees:[e("sc")]},{id:"f6",lane:"north",column:"closed",title:"Close HVAC inspection",priority:"low",points:1,tags:["hvac"],assignees:[e("ob")]},{id:"f7",lane:"downtown",column:"intake",title:"Book signage replacement",priority:"high",points:2,tags:["retail"],assignees:[e("er")]},{id:"f8",lane:"downtown",column:"intake",title:"Repair stockroom door strike",priority:"high",points:2,tags:["access"],assignees:[e("vc")]},{id:"f9",lane:"downtown",column:"scheduled",title:"Stage weekend cleaning crew",priority:"medium",points:1,tags:["crew"],assignees:[e("vc")]},{id:"f10",lane:"downtown",column:"onsite",title:"Escalator brake fault",priority:"critical",points:3,tags:["safety"],assignees:[e("ob")]},{id:"f11",lane:"downtown",column:"review",title:"Approve storefront glass work",priority:"critical",points:2,tags:["vendor"],assignees:[e("ob")]},{id:"f12",lane:"downtown",column:"closed",title:"Close retrofit lighting",priority:"medium",points:2,tags:["lighting"],assignees:[e("er")]},{id:"f13",lane:"airport",column:"intake",title:"Triage baggage belt alarm",priority:"critical",points:5,tags:["baggage"],assignees:[e("mp")]},{id:"f14",lane:"airport",column:"onsite",title:"Repair kiosk printer cluster",priority:"high",points:2,tags:["kiosk"],assignees:[e("mp")]},{id:"f15",lane:"airport",column:"closed",title:"Close alarm panel audit",priority:"high",points:1,tags:["alarm"],assignees:[e("ps")]},{id:"f16",lane:"harbor",column:"scheduled",title:"Calibrate crane load cells",priority:"high",points:3,tags:["crane"],assignees:[e("ml")]},{id:"f17",lane:"harbor",column:"review",title:"Sign off reefer plug repair",priority:"medium",points:2,tags:["cold-chain"],assignees:[e("nk")]}]}}const ce={roadmap:An,fieldOps:Pn},Dn={ok:!0},ae=e=>({ok:!1,reason:e});function zt(e,t){const a=e.cards.find(d=>d.id===t.cardId);if(!a||a.locked)return ae("locked-card");const s=e.heldBy?.get(a.id);if(s&&s!==e.selfId)return ae("held");const r=e.columns.find(d=>d.id===t.from.column),o=e.columns.find(d=>d.id===t.to.column);if(!o||r?.locked||o.locked)return ae("locked-column");const l=e.lanes?.find(d=>d.id===t.from.lane),u=e.lanes?.find(d=>d.id===t.to.lane);if(l?.locked||u?.locked)return ae("locked-lane");const p=t.from.column!==t.to.column;if(p&&o.accepts&&!o.accepts.includes(t.from.column))return ae("not-accepted");const h=Ae(o,e.maxItems);return p&&h!==void 0&&e.cards.filter(m=>m.column===o.id&&m.id!==a.id).length>=h?ae("max-items"):p&&o.wipLimit!==void 0&&e.cards.filter(m=>m.column===o.id&&m.id!==a.id).length>=o.wipLimit?ae("wip-column"):t.from.lane!==t.to.lane&&u?.wipLimit!==void 0&&e.cards.filter(m=>m.id!==a.id&&tt(m,e.lanes)===u.id).length>=u.wipLimit?ae("wip-lane"):Dn}function Ae(e,t){return e.maxItems??t}function On(e,t,a){const s=Ae(t,a);if(s===void 0)return!1;let r=0;for(const o of e)o.column===t.id&&r++;return r>=s}function Ne(e,t,a,s){const r=e.find(d=>d.id===t.cardId);if(!r)return e;const o=e.filter(d=>d.id!==t.cardId),l={...r,column:t.to.column};t.to.lane!==null&&(l.lane=t.to.lane);const u=Te(o,a,s).get(ee(t.to.column,t.to.lane))??[],p=Math.max(0,Math.min(t.to.index,u.length));if(u.length===0)return[...o,l];if(p<u.length){const d=o.indexOf(u[p]);return[...o.slice(0,d),l,...o.slice(d)]}const h=o.indexOf(u[u.length-1])+1;return[...o.slice(0,h),l,...o.slice(h)]}function $n(e,t,a,s){const r=e.filter(l=>l.id!==a),o=e.find(l=>l.id===a);if(o&&t>=o.top&&t<=o.top+o.height)return s??r.filter(l=>l.top<o.top).length;for(let l=0;l<r.length;l++){const u=r[l];if(t<u.top+u.height/2)return l}return r.length}function zn(e,t,a,s){const r=e.cards.filter(d=>d.id!==a),o=Te(r,e.columns,e.lanes),l=(d,m)=>o.get(ee(d,m))?.length??0,u=d=>zt(e,{cardId:a,from:t,to:d}).ok;if(s==="up"||s==="down"){const d=t.index+(s==="down"?1:-1);if(d<0||d>l(t.column,t.lane))return null;const m={...t,index:d};return u(m)?m:null}if(s==="left"||s==="right"){const d=e.columns,m=s==="right"?1:-1;for(let y=d.findIndex(S=>S.id===t.column)+m;y>=0&&y<d.length;y+=m){const S=d[y];if(S.collapsed)continue;const w={column:S.id,lane:t.lane,index:Math.min(t.index,l(S.id,t.lane))};if(u(w))return w}return null}const p=e.lanes??[],h=s==="lane-down"?1:-1;for(let d=p.findIndex(m=>m.id===t.lane)+h;d>=0&&d<p.length;d+=h){const m=p[d];if(m.collapsed)continue;const y={column:t.column,lane:m.id,index:Math.min(t.index,l(t.column,m.id))};if(u(y))return y}return null}const _n=5e3,ft=8e3,Hn=50;function gt(){return{peers:new Map,holds:new Map}}const Z=e=>typeof e=="string",bt=e=>typeof e=="number"&&Number.isFinite(e);function Fn(e){if(!e||typeof e!="object")return null;const t=e;if(!bt(t.at))return null;switch(t.type){case"presence":{const a=t.user;return a&&Z(a.id)&&Z(a.name)?t:null}case"leave":return Z(t.userId)?t:null;case"grab":return Z(t.userId)&&Z(t.cardId)?t:null;case"release":return Z(t.userId)&&Z(t.cardId)?t:null;case"hover":return Z(t.userId)&&Z(t.cardId)&&Z(t.column)&&(t.lane===null||Z(t.lane))&&bt(t.index)?t:null;default:return null}}function Ie(e,t,a){const s=e.peers.get(t);if(!s)return e.peers;const r=new Map(e.peers);return r.set(t,{...s,lastSeen:a}),r}function Un(e,t){return e.at<t.at||e.at===t.at&&e.userId<t.userId}function Kn(e,t,a){const s=Fn(t);if(!s)return e;switch(s.type){case"presence":{const r=new Map(e.peers);r.set(s.user.id,{user:s.user,lastSeen:a});let o=e.holds;for(const[l,u]of e.holds)u.userId===s.user.id&&(o===e.holds&&(o=new Map(e.holds)),o.set(l,{...u,seen:a}));return{peers:r,holds:o}}case"leave":{const r=new Map(e.peers);r.delete(s.userId);const o=new Map(e.holds);for(const[l,u]of e.holds)u.userId===s.userId&&o.delete(l);return{peers:r,holds:o}}case"grab":{const r=e.holds.get(s.cardId);if(r&&r.userId!==s.userId&&!Un(s,r))return{...e,peers:Ie(e,s.userId,a)};const o=new Map(e.holds);return o.set(s.cardId,{userId:s.userId,at:s.at,seen:a}),{peers:Ie(e,s.userId,a),holds:o}}case"hover":{const r=e.holds.get(s.cardId);if(!r||r.userId!==s.userId)return e;const o=new Map(e.holds);return o.set(s.cardId,{...r,seen:a,hover:{column:s.column,lane:s.lane,index:s.index}}),{peers:Ie(e,s.userId,a),holds:o}}case"release":{const r=e.holds.get(s.cardId);if(!r||r.userId!==s.userId)return e;const o=new Map(e.holds);return o.delete(s.cardId),{peers:Ie(e,s.userId,a),holds:o}}}}function Gn(e,t){let a=e.peers,s=e.holds;for(const[r,o]of e.peers)t-o.lastSeen<=ft||(a===e.peers&&(a=new Map(e.peers)),a.delete(r));for(const[r,o]of e.holds)t-o.seen<=ft||(s===e.holds&&(s=new Map(e.holds)),s.delete(r));return a===e.peers&&s===e.holds?e:{peers:a,holds:s}}function Wn(e){const t=new BroadcastChannel(`taskboard:${e}`),a=new Set;let s=!1;return t.onmessage=r=>{for(const o of a)o(r.data)},{publish:r=>{s||t.postMessage(r)},subscribe(r){return a.add(r),()=>{a.delete(r)}},close(){s=!0,a.clear(),t.close()}}}const Vn=e=>({cardId:e.cardId,from:e.to,to:e.from});function qn(e=100){let t=[],a=[];return{push(s){t=[...t,s].slice(-e),a=[]},undo(s,r,o){const l=t[t.length-1];return l?(t=t.slice(0,-1),a=[...a,l],Ne(s,Vn(l),r,o)):null},redo(s,r,o){const l=a[a.length-1];return l?(a=a.slice(0,-1),t=[...t,l],Ne(s,l,r,o)):null},get canUndo(){return t.length>0},get canRedo(){return a.length>0},get size(){return t.length},clear(){t=[],a=[]}}}function kt(e,t,a){const s=e.findIndex(l=>l.id===t);if(s===-1)return e;const r=e.filter(l=>l.id!==t),o=Math.max(0,Math.min(a,r.length));return[...r.slice(0,o),e[s],...r.slice(o)]}function Xn(e,t,a,s,r,o=!1){const l=e.findIndex(w=>w.id===a);if(l===-1||r===0||e.length===0)return s;const u=o?r<0:r>0,p=e.length-1,h=e.findIndex(w=>t>=w.left&&t<=w.left+w.width);if(h!==-1)return h===l?s:h>l&&u?Math.min(h,p):h<l&&!u?h:s;const d=Math.min(...e.map(w=>w.left)),m=Math.max(...e.map(w=>w.left+w.width)),y=o?t<d:t>m,S=o?t>m:t<d;return y&&u?p:S&&!u?0:s}function Yn(e,t){const a=e.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"column",s=new Set(t.map(o=>o.id));if(!s.has(a))return a;let r=2;for(;s.has(`${a}-${r}`);)r++;return`${a}-${r}`}const _t=({column:e,lane:t,cards:a,className:s,label:r})=>{const{cardState:o,cardProps:l,dropTarget:u,size:p,text:h}=te(),d=ee(e,t),m=u&&u.bucket===d?u:null;return n.jsx("div",{role:"group","aria-label":r,"data-bucket":d,"data-bucket-column":e,"data-bucket-lane":t??"","data-drop":m?m.valid?"valid":"invalid":void 0,title:m&&!m.valid?h("notAllowed"):void 0,className:N("flex min-h-12 flex-col rounded-lg transition-colors",p.gap,m&&!m.valid&&"cursor-not-allowed bg-red-500/5 ring-1 ring-inset ring-red-500/30",s),children:a.map((y,S)=>n.jsx(Jt,{card:y,column:e,lane:t,index:S,state:o(y),...l?.(y,{column:e,lane:t,index:S})},y.id))})},We=200;function Ve(e,t=We){const[a,s]=i.useState(e);return i.useEffect(()=>{if(e){s(!0);return}if(typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||t<=0){s(!1);return}const o=setTimeout(()=>s(!1),t);return()=>clearTimeout(o)},[e,t]),e||a}const qe=({column:e,index:t})=>{const{columnGripProps:a,surface:s,color:r}=te();if(!a)return null;const o=ye(r);return n.jsx("button",{type:"button",...a(e,t),className:N("shrink-0 cursor-grab touch-none rounded p-1 active:cursor-grabbing",s.muted,o.hover,o.focusRing),children:n.jsx(Mt,{className:"h-3.5 w-3.5","aria-hidden":"true"})})},Ht=({onAdd:e,variant:t})=>{const{text:a,surface:s,color:r,size:o,columnCornerClass:l}=te(),[u,p]=i.useState(!1),[h,d]=i.useState(""),m=ye(r),y=()=>{p(!1),d("")},S=()=>{const w=h.trim();w&&e(w),y()};return n.jsx("div",{"data-taskboard-add-column":!0,style:t==="column"?{width:Math.round(o.columnWidth*.75)}:void 0,className:N("flex shrink-0 flex-col",t==="column"&&N("border-2 border-dashed p-2",s.divider,l),t==="header"&&"px-2 py-1.5"),children:u?n.jsx("input",{autoFocus:!0,"aria-label":a("columnName"),placeholder:a("columnName"),value:h,onChange:w=>d(w.target.value),onKeyDown:w=>{w.key==="Enter"?(w.preventDefault(),S()):w.key==="Escape"&&(w.preventDefault(),y())},onBlur:S,className:N("w-full rounded-md border bg-transparent px-2 py-1.5 text-sm outline-none",s.divider,s.heading,m.focusRing)}):n.jsxs("button",{type:"button",onClick:()=>p(!0),className:N("flex items-center justify-center gap-1 rounded-md py-1.5 text-sm",s.muted,m.hover,m.focusRing),children:[n.jsx(Je,{className:"h-3.5 w-3.5","aria-hidden":"true"}),a("addColumn")]})})},Jn=({drag:e,column:t,cards:a,count:s})=>{const{color:r,surface:o,size:l,cardSurface:u,columnCornerClass:p,renderCard:h}=te();if(!e||e.keyboard||!t||typeof document>"u")return null;const d=t.color??r;return Qe.createPortal(n.jsxs("div",{"data-taskboard-column-clone":!0,"aria-hidden":"true",className:N("pointer-events-none fixed top-0 left-0 z-[1000] flex rotate-1 flex-col overflow-hidden border-t-[3px] bg-neutral-100 shadow-2xl motion-reduce:rotate-0 dark:bg-neutral-800",p,Ze(d).edge,Lt(d).clone),style:{width:e.width||void 0,height:e.height||void 0,transform:`translate3d(${e.x-e.grabOffset.x}px, ${e.y-e.grabOffset.y}px, 0)`},children:[n.jsxs("div",{className:"flex items-center gap-2 px-3 pt-3 pb-2",children:[n.jsx(Mt,{className:N("h-3.5 w-3.5 shrink-0",o.muted),"aria-hidden":"true"}),n.jsx("span",{className:N("truncate text-sm font-semibold",o.heading),children:t.title}),n.jsx("span",{className:N("text-xs font-semibold tabular-nums",o.muted),children:s})]}),!t.collapsed&&n.jsx("div",{className:N("flex min-h-0 flex-col px-2 pb-2",l.gap),children:a.map(m=>n.jsx("div",{className:N("rounded-lg",l.cardPad,m.tone?N("shadow-sm ring-1",Et(m.tone).solid):u),children:h?h(m,{dragging:!1,selected:!1,pending:!1}):n.jsx(Rt,{card:m})},m.id))})]}),document.body)},xt=e=>({title:e.title,color:e.color,wip:e.wipLimit===void 0?"":String(e.wipLimit),max:e.maxItems===void 0?"":String(e.maxItems),locked:!!e.locked,accepts:e.accepts??[]});function Qn(e,t){const{wipLimit:a,maxItems:s,locked:r,accepts:o,color:l,...u}=e,p={...u,title:t.title.trim()};return t.color&&(p.color=t.color),t.wip.trim()!==""&&(p.wipLimit=Number(t.wip)),t.max.trim()!==""&&(p.maxItems=Number(t.max)),t.locked&&(p.locked=!0),t.accepts.length&&(p.accepts=t.accepts),p}const Me=e=>e.trim()===""||Number.isInteger(Number(e))&&Number(e)>=1,Xe=({column:e})=>{const{onEditColumn:t,allColumns:a,text:s,surface:r,color:o}=te(),[l,u]=i.useState(!1),[p,h]=i.useState(()=>xt(e)),d=i.useId();if(!t)return null;const m=ye(o),y=p.title.trim()!==""&&Me(p.wip)&&Me(p.max),S=(a??[]).filter(C=>C.id!==e.id),w=()=>{y&&(t(Qn(e,p)),u(!1))};return n.jsx(Qt,{visible:l,onOpenChange:C=>{C&&h(xt(e)),u(C)},placement:"bottom",maxWidth:300,trigger:n.jsx("button",{type:"button","aria-label":s("editColumn",{name:e.title}),className:N("shrink-0 rounded p-1",r.muted,m.hover,m.focusRing),children:n.jsx(tn,{className:"h-3.5 w-3.5","aria-hidden":"true"})}),children:n.jsxs("form",{className:"flex w-64 flex-col gap-3",onSubmit:C=>{C.preventDefault(),w()},children:[n.jsx(Ee,{size:"sm","aria-label":s("columnName"),placeholder:s("columnName"),value:p.title,onChange:C=>h({...p,title:C.target.value}),onKeyDown:C=>{C.key==="Enter"&&(C.preventDefault(),w())}}),n.jsxs("div",{className:"flex flex-col gap-1.5",children:[n.jsx("span",{className:N("text-xs font-semibold",r.muted),children:s("columnColor")}),n.jsx(At,{selectable:!0,size:"sm",defaultExpanded:!0,value:p.color,onSelect:C=>h({...p,color:C})})]}),n.jsxs("div",{className:"flex flex-col gap-1",children:[n.jsx("label",{htmlFor:`${d}-wip`,className:N("text-xs font-semibold",r.muted),children:s("wipLimit")}),n.jsx(Ee,{id:`${d}-wip`,size:"sm",type:"number",min:1,inputMode:"numeric",placeholder:s("wipLimitHint"),value:p.wip,onChange:C=>h({...p,wip:C.target.value}),"aria-invalid":!Me(p.wip)||void 0})]}),n.jsxs("div",{className:"flex flex-col gap-1",children:[n.jsx("label",{htmlFor:`${d}-max`,className:N("text-xs font-semibold",r.muted),children:s("maxItems")}),n.jsx(Ee,{id:`${d}-max`,size:"sm",type:"number",min:1,inputMode:"numeric",placeholder:s("maxItemsHint"),value:p.max,onChange:C=>h({...p,max:C.target.value}),"aria-invalid":!Me(p.max)||void 0})]}),n.jsx(Zt,{size:"sm",label:s("lockColumn"),description:s("lockColumnHint"),checked:p.locked,onChange:C=>h({...p,locked:C.target.checked})}),S.length>0&&n.jsxs("fieldset",{className:"flex flex-col gap-1.5",children:[n.jsx("legend",{className:N("mb-1 text-xs font-semibold",r.muted),children:s("acceptsFrom")}),S.map(C=>n.jsx(en,{size:"sm",label:C.title,checked:p.accepts.includes(C.id),onChange:k=>h({...p,accepts:k.target.checked?[...p.accepts,C.id]:p.accepts.filter(x=>x!==C.id)})},C.id)),n.jsx("span",{className:N("text-[11px]",r.muted),children:s("acceptsAny")})]}),n.jsxs("div",{className:"flex justify-end gap-2 pt-1",children:[n.jsx(pe,{type:"button",size:"sm",variant:"soft",color:"slate",onClick:()=>u(!1),children:s("cancel")}),n.jsx(pe,{type:"submit",size:"sm",color:o,disabled:!y,children:s("save")})]})]})})},Ye=44;function Ft(e,t){return t===void 0?String(e):`${e} / ${t}`}const Zn=({column:e,cards:t,count:a,index:s=0,onToggle:r})=>{const{surface:o,text:l,color:u,size:p,wellSurface:h,columnCornerClass:d,onAddCard:m,draggingColumnId:y,boardMaxItems:S}=te(),w=Ae(e,S),C=w!==void 0&&a>=w,k=y===e.id,x=e.color??u,v=Ze(x),b=Ot(a,e.wipLimit),B=Ve(!e.collapsed),A=Ve(!!e.collapsed),D=ye(x),O=r&&n.jsx("button",{type:"button",onClick:r,"aria-expanded":!e.collapsed,"aria-label":l(e.collapsed?"expand":"collapse",{name:e.title}),className:N("rounded p-1",o.muted,D.hover,D.focusRing),children:n.jsx(Pt,{className:N("h-3 w-3 transition-transform motion-reduce:transition-none",!e.collapsed&&"rotate-90")})}),z=n.jsx("span",{"data-column-count":!0,title:e.wipLimit!==void 0?l("wip",{count:a,limit:e.wipLimit}):void 0,className:N("text-xs font-semibold tabular-nums",b==="full"||b==="over"||C?v.wipFull:o.muted),children:Ft(a,e.wipLimit??w)});return n.jsxs("div",{"data-column-id":e.id,"data-column-target":e.id,"data-flip-key":e.id,"data-column-dragging":k||void 0,"data-full":C||void 0,"data-collapsed":e.collapsed?"true":void 0,"data-wip":b,"data-drop-zone":e.collapsed?void 0:!0,style:{width:e.collapsed?Ye:p.columnWidth},className:N("relative flex min-h-40 shrink-0 flex-col overflow-hidden border-t-[3px]",d,"transition-[width] duration-200 ease-out motion-reduce:transition-none",v.edge,h,k&&"opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30"),children:[A&&n.jsxs("div",{"aria-hidden":!e.collapsed,inert:!e.collapsed,className:N("absolute inset-y-0 left-0 flex flex-col items-center gap-3 py-3 transition-opacity duration-200 motion-reduce:transition-none",e.collapsed?"opacity-100":"pointer-events-none opacity-0"),style:{width:Ye},children:[n.jsx(qe,{column:e,index:s}),n.jsx(Xe,{column:e}),O,z,n.jsx("span",{className:N("text-sm font-semibold whitespace-nowrap [writing-mode:vertical-rl]",o.heading),children:e.title})]}),B&&n.jsxs("div",{"data-column-body":!0,"aria-hidden":e.collapsed||void 0,inert:e.collapsed,style:{width:p.columnWidth},className:N("flex min-h-0 flex-1 flex-col transition-opacity duration-200 motion-reduce:transition-none",e.collapsed&&"opacity-0"),children:[n.jsxs("div",{className:"flex items-center gap-2 px-3 pt-3 pb-2",children:[n.jsx(qe,{column:e,index:s}),n.jsx("span",{className:N("truncate text-sm font-semibold",o.heading),children:e.title}),z,n.jsx("span",{className:"flex-1"}),n.jsx(Xe,{column:e}),O]}),n.jsx(et,{"data-taskboard-scroll":!0,variant:"hover",horizontal:!1,tabIndex:-1,className:"min-h-0 flex-1",contentClassName:"px-2 pb-2",children:n.jsx(_t,{column:e.id,lane:null,cards:t,label:`${e.title}, ${l("cardCount",{count:t.length})}`})}),m&&!C&&n.jsxs("button",{type:"button",onClick:()=>m({column:e.id,lane:null}),className:N("mx-2 mb-2 flex items-center justify-center gap-1 rounded-lg py-1.5 text-sm",o.muted,D.hover,D.focusRing),children:[n.jsx(Je,{className:"h-3.5 w-3.5","aria-hidden":"true"}),l("addCard")]})]})]})},ea=5,me=e=>e!=null&&e!==!1,ta=({icon:e,title:t,subtitle:a,summary:s,actions:r,people:o,variant:l})=>{const{surface:u,text:p}=te(),h=o?.slice(0,ea)??[],d=(o?.length??0)-h.length;return n.jsxs("div",{"data-taskboard-header":!0,className:N("flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3",u.divider),children:[me(e)&&n.jsx("div",{className:N("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",nn(l,"neutral"),u.body),children:e}),(me(t)||me(a))&&n.jsxs("div",{className:"min-w-0",children:[me(t)&&n.jsx("div",{className:N("truncate text-lg font-bold leading-tight",u.heading),children:t}),me(a)&&n.jsx("div",{className:N("truncate text-xs",u.muted),children:a})]}),n.jsx("div",{className:"flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2",children:me(s)&&s}),h.length>0&&n.jsxs("div",{"data-taskboard-people":!0,role:"group","aria-label":p("online",{count:o.length}),className:"flex items-center -space-x-2",children:[h.map(m=>n.jsx(dt,{user:{name:m.name,avatarUrl:m.avatarUrl},tone:m.color??Le(m.id),size:"sm",title:m.name,className:"ring-2 ring-white dark:ring-neutral-900"},m.id)),d>0&&n.jsx(dt,{label:`+${d}`,size:"sm",className:"ring-2 ring-white dark:ring-neutral-900"})]}),me(r)&&n.jsx("div",{className:"flex items-center gap-1",children:r})]})},na=220,aa=180,sa=({cards:e,columns:t,lanes:a,buckets:s,onToggleLane:r,onToggleColumn:o,onAddColumn:l})=>{const{surface:u,text:p,color:h,size:d,stickySurface:m,draggingColumnId:y,boardMaxItems:S}=te(),w=new Set(t.filter(b=>On(e,b,S)).map(b=>b.id)),C=ye(h),k=[`${na}px`,...t.map(b=>`${b.collapsed?Ye:d.columnWidth}px`),...l?[`${aa}px`]:[]].join(" "),x=N("border-b border-r",u.divider),v=(b,B,A)=>n.jsx("button",{type:"button",onClick:A,"aria-expanded":!b,"aria-label":p(b?"expand":"collapse",{name:B}),className:N("rounded p-1",u.muted,C.hover,C.focusRing),children:n.jsx(Pt,{className:N("h-3 w-3 transition-transform motion-reduce:transition-none",!b&&"rotate-90")})});return n.jsx(et,{"data-taskboard-scroll":!0,variant:"hover",tabIndex:-1,className:"min-h-0 flex-1",children:n.jsxs("div",{"data-lane-grid":!0,className:"grid w-max transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none",style:{gridTemplateColumns:k},children:[n.jsx("div",{className:N("sticky top-0 left-0 z-30",m,x)}),t.map((b,B)=>{const A=Ge(e,b.id),D=Ot(A,b.wipLimit);return n.jsxs("div",{"data-lane-column-header":b.id,"data-column-target":b.id,"data-flip-key":b.id,"data-column-dragging":y===b.id||void 0,"data-wip":D,className:N("sticky top-0 z-20 flex items-center gap-2 overflow-hidden px-3 py-2.5",m,x,y===b.id&&"opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30"),children:[n.jsx(qe,{column:b,index:B}),!b.collapsed&&n.jsx("span",{className:N("truncate text-xs font-semibold uppercase tracking-wider",u.body),children:b.title}),n.jsx("span",{className:"flex-1"}),n.jsx("span",{"data-column-count":!0,className:N("rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",D==="full"||D==="over"||w.has(b.id)?Ze(b.color??h).wipFull:u.muted),children:Ft(A,b.wipLimit??Ae(b,S))}),n.jsx(Xe,{column:b}),o&&v(b.collapsed,b.title,()=>o(b.id))]},b.id)}),l&&n.jsx("div",{className:N("sticky top-0 z-20",m,x),children:n.jsx(Ht,{variant:"header",onAdd:l})}),a.map(b=>n.jsx(oa,{lane:b,count:Ln(e,b.id,a),columns:t,buckets:s,cellBorder:x,trailingCell:!!l,fullColumns:w,caret:r&&v(b.collapsed,b.title,()=>r(b.id))},b.id))]})})},oa=({lane:e,count:t,columns:a,buckets:s,cellBorder:r,caret:o,trailingCell:l,fullColumns:u})=>{const{surface:p,text:h,color:d,stickySurface:m,onAddCard:y}=te(),S=ye(d),w=!e.collapsed,C=Ve(w);return n.jsxs("div",{"data-lane-id":e.id,"data-collapsed":e.collapsed?"true":void 0,className:"contents",children:[n.jsxs("div",{className:N("sticky left-0 z-10 flex items-start gap-2 px-3 py-3",m,r),children:[o,n.jsx("span",{className:N("min-w-0 flex-1 truncate pt-0.5 text-sm font-semibold",p.heading),children:e.title}),n.jsx("span",{"data-lane-count":!0,className:N("rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",p.muted),children:t})]}),a.map(k=>n.jsx("div",{"data-flip-key":`${k.id}:${e.id}`,"data-drop-zone":w&&!k.collapsed?!0:void 0,className:r,children:n.jsx("div",{"data-lane-cell":!0,className:N("grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",w?"grid-rows-[1fr]":"grid-rows-[0fr]"),children:n.jsx("div",{className:"min-h-0 overflow-hidden",inert:!w,"aria-hidden":!w||void 0,children:C&&!k.collapsed&&n.jsxs("div",{className:"flex flex-col gap-1 p-2",children:[n.jsx(_t,{column:k.id,lane:e.id,cards:s.get(ee(k.id,e.id))??[],label:`${k.title}, ${e.title}`}),y&&!u.has(k.id)&&n.jsx("button",{type:"button",onClick:()=>y({column:k.id,lane:e.id}),"aria-label":`${h("addCard")} — ${k.title}, ${e.title}`,className:N("flex items-center justify-center rounded-md py-1 opacity-60 hover:opacity-100 focus-visible:opacity-100",p.muted,S.hover,S.focusRing),children:n.jsx(Je,{className:"h-3.5 w-3.5","aria-hidden":"true"})})]})})})},k.id)),l&&n.jsx("div",{"aria-hidden":"true",className:r})]})},ra="bg-white shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",ia=({drag:e,card:t})=>{const{renderCard:a,size:s,color:r}=te();return!e||e.keyboard||!t||typeof document>"u"?null:Qe.createPortal(n.jsx("div",{"data-taskboard-clone":!0,"aria-hidden":"true",className:N("pointer-events-none fixed top-0 left-0 z-[1000] rotate-1 rounded-lg motion-reduce:rotate-0",t.tone?N("shadow-2xl ring-1",Et(t.tone).solid):ra,Lt(r).clone,s.cardPad,!e.valid&&e.to&&"cursor-not-allowed opacity-80"),style:{width:e.width||void 0,transform:`translate3d(${e.x-e.grabOffset.x}px, ${e.y-e.grabOffset.y}px, 0)`},children:a?a(t,{dragging:!0,selected:!1,pending:!1}):n.jsx(Rt,{card:t})}),document.body)},la=4,da=250,ca=8,xe=48,ua=16,yt=(e,t)=>e.column===t.column&&e.lane===t.lane&&e.index===t.index;function ma(e){const t=e?.closest("[data-bucket]")??e?.closest("[data-drop-zone]")?.querySelector("[data-bucket]");if(!t)return null;const a=t.getAttribute("data-bucket-column"),s=t.getAttribute("data-bucket-lane");return a===null?null:{column:a,lane:s||null,el:t}}function pa(e){const[t,a]=i.useState(null),[s,r]=i.useState(null),o=i.useRef(e);o.current=e;const l=i.useRef(null),u=i.useRef(null),p=i.useRef(!1),h=i.useRef({x:0,y:0}),d=i.useRef(null),m=i.useRef(null),y=i.useRef(null),S=i.useCallback(c=>{l.current=c,a(c)},[]),w=()=>{const c=o.current;return{cards:c.cards,columns:c.columns,lanes:c.lanes,heldBy:c.heldBy,selfId:c.selfId,maxItems:c.maxItems}},C=i.useCallback((c,g)=>{const f=l.current;if(!f)return;const j=ma(document.elementFromPoint?.(c,g)??null);let I=null,M=!1;if(j){const L=[...j.el.querySelectorAll("[data-card-id]")].map(K=>{const H=K.getBoundingClientRect();return{id:K.getAttribute("data-card-id"),top:H.top,height:H.height}}),$=f.to&&f.to.column===j.column&&f.to.lane===j.lane?f.to.index:null,V=$n(L,g,f.cardId,$);I={column:j.column,lane:j.lane,index:V},M=zt(w(),{cardId:f.cardId,from:f.from,to:I}).ok}const E=!f.to!=!I||f.to&&I&&!yt(f.to,I)||f.valid!==M;S({...f,x:c,y:g,to:I,valid:M}),E&&o.current.onDragTarget?.(f.cardId,M?I:null)},[S]),k=i.useCallback(()=>{if(d.current=null,!l.current)return;const{x:c,y:g}=h.current;let f=!1;for(const j of document.querySelectorAll("[data-taskboard-scroll]")){const I=j.matches('[data-slot="scrollarea"]')?j.querySelector(':scope > [data-slot="scrollarea-viewport"]'):j;if(!I)continue;const M=I.getBoundingClientRect();if(c<M.left||c>M.right||g<M.top||g>M.bottom)continue;const E=V=>Math.ceil((xe-V)/xe*ua);let L=0,$=0;c-M.left<xe?L=-E(c-M.left):M.right-c<xe&&(L=E(M.right-c)),g-M.top<xe?$=-E(g-M.top):M.bottom-g<xe&&($=E(M.bottom-g)),L&&I.scrollWidth>I.clientWidth&&(I.scrollLeft+=L,f=!0),$&&I.scrollHeight>I.clientHeight&&(I.scrollTop+=$,f=!0)}f&&(C(c,g),d.current=requestAnimationFrame(k))},[C]),x=i.useCallback(()=>{const c=u.current;c?.timer&&clearTimeout(c.timer),u.current=null,d.current!==null&&cancelAnimationFrame(d.current),d.current=null,m.current?.(),m.current=null,y.current!==null&&(document.body.style.userSelect=y.current,y.current=null)},[]),v=i.useCallback(c=>{const g=l.current;x(),g&&(S(null),o.current.onDragEnd?.(g.cardId,!1))},[x,S]),b=i.useCallback(async()=>{const c=l.current;if(x(),!c)return!1;S(null),c.keyboard||(p.current=!0,setTimeout(()=>{p.current=!1},0));const g=o.current;if(!c.to||!c.valid||yt(c.from,c.to))return g.onDragEnd?.(c.cardId,!1),!1;const f={cardId:c.cardId,from:c.from,to:c.to};if(!g.onBeforeMove)return g.onCommit(f),g.onDragEnd?.(c.cardId,!0),!0;r(f);let j=!1;try{j=await g.onBeforeMove(f)}catch{j=!1}return r(null),j&&o.current.onCommit(f),o.current.onDragEnd?.(c.cardId,j),j},[x,S]),B=i.useCallback((c,g)=>{const f=o.current;if(!f.editable||c.locked||l.current)return!1;const j=f.heldBy?.get(c.id);return j&&j!==f.selfId?!1:(S({cardId:c.id,from:g,to:g,valid:!0,x:0,y:0,grabOffset:{x:0,y:0},width:0,keyboard:!0}),f.onDragStart?.(c.id),f.onDragTarget?.(c.id,g),!0)},[S]),A=i.useCallback(c=>{const g=l.current;g&&(S({...g,to:c,valid:!0}),o.current.onDragTarget?.(g.cardId,c))},[S]),D=i.useCallback((c,g,f)=>{y.current===null&&(y.current=document.body.style.userSelect,document.body.style.userSelect="none"),window.getSelection?.()?.removeAllRanges(),S({cardId:c.cardId,from:c.from,to:c.from,valid:!0,x:g,y:f,grabOffset:c.grabOffset,width:c.width}),o.current.onDragStart?.(c.cardId),C(g,f)},[C,S]),O=i.useCallback(c=>{const g=u.current;if(!g)return;const{clientX:f,clientY:j}=c;if(h.current={x:f,y:j},!l.current){const I=Math.hypot(f-g.startX,j-g.startY);if(g.touch){if(!g.armed){I>ca&&x();return}D(g,f,j);return}if(I<la)return;D(g,f,j);return}C(f,j),d.current===null&&typeof requestAnimationFrame=="function"&&(d.current=requestAnimationFrame(k))},[k,x,D,C]),z=i.useCallback((c,g,f)=>{const j=o.current;if(!j.editable||f.button!==0||c.locked)return;const I=j.heldBy?.get(c.id);if(I&&I!==j.selfId)return;x();const M=f.currentTarget.getBoundingClientRect(),E=f.pointerType==="touch",L={cardId:c.id,from:g,startX:f.clientX,startY:f.clientY,touch:E,armed:!1,timer:null,grabOffset:{x:f.clientX-M.left,y:f.clientY-M.top},width:M.width};E&&(L.timer=setTimeout(()=>{L.armed=!0,L.timer=null},da)),u.current=L,h.current={x:f.clientX,y:f.clientY};const $=()=>{l.current?b():x()},V=()=>v("pointercancel"),K=G=>{G.key==="Escape"&&l.current&&(G.preventDefault(),v("escape"))},H=G=>{l.current&&G.preventDefault()};window.addEventListener("pointermove",O),window.addEventListener("pointerup",$),window.addEventListener("pointercancel",V),window.addEventListener("keydown",K),window.addEventListener("touchmove",H,{passive:!1}),m.current=()=>{window.removeEventListener("pointermove",O),window.removeEventListener("pointerup",$),window.removeEventListener("pointercancel",V),window.removeEventListener("keydown",K),window.removeEventListener("touchmove",H)}},[v,x,b,O]);i.useEffect(()=>{const c=l.current;c&&!e.cards.some(g=>g.id===c.cardId)&&v("removed")},[e.cards,v]),i.useEffect(()=>()=>x(),[x]);const F=i.useMemo(()=>{const{cards:c,columns:g,lanes:f}=e;return s?Ne(c,s,g,f):t?.to&&t.valid?Ne(c,{cardId:t.cardId,from:t.from,to:t.to},g,f):c},[e.cards,e.columns,e.lanes,t,s]),q=i.useCallback((c,g)=>({onPointerDown:f=>z(c,g,f),onClickCapture:f=>{p.current&&(p.current=!1,f.preventDefault(),f.stopPropagation())}}),[z]);return{drag:t,pending:s,previewCards:F,cardHandlers:q,cancel:v,finish:b,keyboardGrab:B,keyboardMove:A}}const ha=e=>e?.closest("[dir]")?.getAttribute("dir")==="rtl";function fa(e){const{rootRef:t,cards:a,viewCards:s,columns:r,lanes:o,text:l,drag:u}=e,[p,h]=i.useState(""),[d,m]=i.useState(null),[y,S]=i.useState([]),w=e.selectedIds??y,C=i.useRef(null),k=i.useRef(null),x=i.useMemo(()=>Te(s,r,o),[s,r,o]),v=i.useMemo(()=>{for(const c of x.values())if(c.length)return c[0].id;return null},[x]),b=d&&s.some(c=>c.id===d)?d:v;i.useLayoutEffect(()=>{const c=k.current;c&&(k.current=null,t.current?.querySelector(`[data-card-id="${CSS.escape(c)}"]`)?.focus())});const B=i.useCallback(c=>h(c),[]),A=i.useCallback(c=>r.find(g=>g.id===c)?.title??c,[r]),D=i.useCallback((c,g)=>{const j=(Te(a.filter(E=>E.id!==c),r,o).get(ee(g.column,g.lane))?.length??0)+1,I={column:A(g.column),index:g.index+1,total:j},M=g.lane?o?.find(E=>E.id===g.lane)?.title:void 0;B(M?l("movedLane",{...I,lane:M}):l("moved",I))},[B,a,r,o,A,l]),O=i.useCallback(c=>{e.selectedIds===void 0&&S(c),e.onSelectionChange?.(c)},[e]),z=i.useCallback((c,g)=>{const f=t.current,j=c.closest("[data-bucket]");if(!f||!j)return;const I=[...j.querySelectorAll("[data-card-id]")],M=I.indexOf(c);let E;if(g==="up"||g==="down")E=I[M+(g==="down"?1:-1)];else{const $=g==="left"||g==="right"?"data-bucket-lane":"data-bucket-column",V=j.getAttribute($)??"",K=[...f.querySelectorAll(`[data-bucket][${$}="${CSS.escape(V)}"]`)],H=g==="right"||g==="lane-down"?1:-1;for(let G=K.indexOf(j)+H;G>=0&&G<K.length;G+=H){const Y=K[G].querySelectorAll("[data-card-id]");if(Y.length){E=Y[Math.min(M,Y.length-1)];break}}}E?.focus()},[t]),F=(c,g)=>{const f=ha(g);switch(c.key){case"ArrowUp":return c.altKey?"lane-up":"up";case"ArrowDown":return c.altKey?"lane-down":"down";case"ArrowLeft":return f?"right":"left";case"ArrowRight":return f?"left":"right";default:return null}};return{cardProps:i.useCallback((c,g)=>({tabIndex:c.id===b?0:-1,onFocus:()=>m(c.id),onClick:f=>{const j=w;if(f.ctrlKey||f.metaKey){f.preventDefault(),C.current=c.id,O(j.includes(c.id)?j.filter(I=>I!==c.id):[...j,c.id]);return}if(f.shiftKey&&C.current){f.preventDefault();const I=x.get(ee(g.column,g.lane))??[],M=I.findIndex(L=>L.id===C.current),E=I.findIndex(L=>L.id===c.id);if(M!==-1&&E!==-1){const L=I.slice(Math.min(M,E),Math.max(M,E)+1).map($=>$.id);O([...j.filter($=>!L.includes($)),...L]);return}}C.current=c.id,O([c.id])},onKeyDown:f=>{const j=u?.keyboard&&u.cardId===c.id,I=f.currentTarget;if(j){const E=F(f,I);if(E){f.preventDefault();const L=zn({cards:a,columns:r,lanes:o,heldBy:e.heldBy,selfId:e.selfId,maxItems:e.maxItems},u.to??u.from,c.id,E);L&&(e.keyboardMove(L),k.current=c.id,D(c.id,L))}else if(f.key===" "||f.key==="Spacebar"){f.preventDefault();const L=u.to??u.from;k.current=c.id,B(l("dropped",{title:c.title,column:A(L.column)})),e.finish().then($=>{!$&&(L.column!==u.from.column||L.lane!==u.from.lane||L.index!==u.from.index)&&B(l("cancelled"))})}else f.key==="Escape"?(f.preventDefault(),k.current=c.id,e.cancel("escape"),B(l("cancelled"))):f.key==="Tab"?(e.cancel("blur"),B(l("cancelled"))):f.key==="Enter"&&f.preventDefault();return}if(f.key===" "||f.key==="Spacebar"){f.preventDefault(),e.keyboardGrab(c,g)&&(k.current=c.id,B(l("grabbed",{title:c.title})));return}if(f.key==="F10"&&f.shiftKey||f.key==="ContextMenu"){if(!e.onCardContextMenu)return;f.preventDefault();const E=I.getBoundingClientRect();e.onCardContextMenu({card:c,column:g.column,lane:g.lane,index:g.index,x:E.left+E.width/2,y:E.top+E.height/2,event:f});return}const M=F(f,I);M&&(f.preventDefault(),z(I,M))}}),[b,w,O,x,u,a,r,o,e,D,B,l,A,z]),message:p,selection:w,announce:B}}const ga=4,vt=e=>e?.closest("[dir]")?.getAttribute("dir")==="rtl";function ba(e){const[t,a]=i.useState(null),s=i.useRef(e);s.current=e;const r=i.useRef(null),o=i.useRef(null),l=i.useRef(null),u=i.useRef(null),p=i.useCallback(k=>{r.current=k,a(k)},[]),h=i.useCallback(()=>{o.current?.(),o.current=null,l.current!==null&&(document.body.style.userSelect=l.current,l.current=null)},[]),d=i.useCallback(()=>{h(),p(null)},[h,p]),m=i.useCallback(()=>{const k=r.current;return h(),p(null),!k||k.to===k.from?!1:(s.current.onCommit(kt(s.current.columns,k.id,k.to)),!0)},[h,p]);i.useLayoutEffect(()=>{const k=u.current;k&&(u.current=null,e.rootRef.current?.querySelector(`[data-column-grip="${CSS.escape(k)}"]`)?.focus())}),i.useEffect(()=>()=>h(),[h]);const y=i.useCallback((k,x,v)=>{if(!s.current.enabled||v.button!==0)return;v.preventDefault(),h();const B=(v.currentTarget.closest("[data-column-target]")??v.currentTarget).getBoundingClientRect(),A={x:v.clientX,y:v.clientY},D={x:v.clientX-B.left,y:v.clientY-B.top};let O=v.clientX;const z=c=>{const{clientX:g,clientY:f}=c;let j=r.current;if(!j){if(Math.hypot(g-A.x,f-A.y)<ga)return;l.current===null&&(l.current=document.body.style.userSelect,document.body.style.userSelect="none"),j={id:k.id,from:x,to:x,x:g,y:f,grabOffset:D,width:B.width,height:B.height}}const I=Math.sign(g-O);O=g;const M=s.current.rootRef.current,E=M?[...M.querySelectorAll("[data-column-target]")].map($=>{const V=$.getBoundingClientRect();return{id:$.getAttribute("data-column-target"),left:V.left,width:V.width}}):[],L=Xn(E,g,j.id,j.to,I,vt(M));p({...j,x:g,y:f,to:L})},F=()=>{r.current?m():h()},q=c=>{c.key==="Escape"&&r.current&&(c.preventDefault(),d())};window.addEventListener("pointermove",z),window.addEventListener("pointerup",F),window.addEventListener("pointercancel",d),window.addEventListener("keydown",q),o.current=()=>{window.removeEventListener("pointermove",z),window.removeEventListener("pointerup",F),window.removeEventListener("pointercancel",d),window.removeEventListener("keydown",q)}},[d,m,h,p]),S=i.useCallback((k,x,v)=>{const b=s.current;if(!b.enabled)return;const B=r.current,A=b.columns.length;if(!B||!B.keyboard||B.id!==k.id){(v.key===" "||v.key==="Enter")&&(v.preventDefault(),p({id:k.id,from:x,to:x,x:0,y:0,grabOffset:{x:0,y:0},width:0,height:0,keyboard:!0}),u.current=k.id,b.announce(b.text("columnGrabbed",{name:k.title})));return}if(v.key==="ArrowLeft"||v.key==="ArrowRight"){v.preventDefault();const D=v.key==="ArrowRight"!==vt(v.currentTarget),O=Math.max(0,Math.min(A-1,B.to+(D?1:-1)));if(O===B.to)return;p({...B,to:O}),u.current=k.id,b.announce(b.text("columnMoved",{name:k.title,index:O+1,total:A}))}else v.key===" "||v.key==="Enter"?(v.preventDefault(),u.current=k.id,m()):(v.key==="Escape"||v.key==="Tab")&&(v.key==="Escape"&&v.preventDefault(),u.current=v.key==="Escape"?k.id:null,d(),b.announce(b.text("cancelled")))},[d,m,p]),w=i.useMemo(()=>t&&t.to!==t.from?kt(e.columns,t.id,t.to):e.columns,[t,e.columns]),C=i.useCallback((k,x)=>({"data-column-grip":k.id,"aria-label":e.text("moveColumn",{name:k.title}),onPointerDown:v=>y(k,x,v),onKeyDown:v=>S(k,x,v)}),[e.text,y,S]);return{drag:t,previewColumns:w,gripProps:C}}function ka(e,t){const a=i.useRef(new Map),s=i.useRef(t);i.useLayoutEffect(()=>{const r=e.current;if(!r)return;const o=s.current!==t;s.current=t;const l=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,u=new Map;for(const p of r.querySelectorAll("[data-flip-key]")){const h=p.getAttribute("data-flip-key"),d=p.offsetLeft;u.set(h,d);const m=a.current.get(h);!o||l||m===void 0||m===d||(p.style.transition="none",p.style.transform=`translateX(${m-d}px)`,requestAnimationFrame(()=>{p.style.transition=`transform ${We}ms ease-out`,p.style.transform="",window.setTimeout(()=>{p.style.transform===""&&(p.style.transition="")},We+50)}))}a.current=u})}const xa=1e3;function ya(e,t){const[a,s]=i.useState(gt),r=!!(e&&t),o=i.useRef(!1),l=i.useRef(t);l.current=t;const u=i.useRef({last:0,timer:null}),p=i.useCallback(x=>{if(!o.current)return;const v=Date.now();s(b=>Kn(b,x,v))},[]),h=i.useCallback(x=>{e&&(wt(e,x),p(x))},[e,p]),d=t?.id;i.useEffect(()=>{if(!e||!d)return;o.current=!0;const x=()=>{const z=l.current;z&&h({type:"presence",user:z,at:Date.now()})},v=new Set,b=e.subscribe(z=>{if(!o.current)return;const F=z;F?.type==="presence"&&typeof F.user?.id=="string"&&F.user.id!==d?v.has(F.user.id)||(v.add(F.user.id),x()):F?.type==="leave"&&typeof F.userId=="string"&&v.delete(F.userId),p(z)}),B=()=>wt(e,{type:"leave",userId:d,at:Date.now()});x();const A=setInterval(x,_n),D=setInterval(()=>{o.current&&s(z=>Gn(z,Date.now()))},xa);window.addEventListener("pagehide",B);const O=u.current;return()=>{o.current=!1,clearInterval(A),clearInterval(D),O.timer&&clearTimeout(O.timer),window.removeEventListener("pagehide",B),B(),b(),s(gt())}},[e,d,p,h]);const m=i.useCallback(x=>{d&&h({type:"grab",userId:d,cardId:x,at:Date.now()})},[h,d]),y=i.useCallback((x,v)=>{if(!d)return;const b=u.current,B=()=>{b.last=Date.now(),b.timer=null,h({type:"hover",userId:d,cardId:x,column:v.column,lane:v.lane,index:v.index,at:b.last})};b.timer&&clearTimeout(b.timer);const A=Hn-(Date.now()-b.last);A<=0?B():b.timer=setTimeout(B,A)},[h,d]),S=i.useCallback((x,v)=>{if(!d)return;const b=u.current;b.timer&&clearTimeout(b.timer),b.timer=null,h({type:"release",userId:d,cardId:x,dropped:v,at:Date.now()})},[h,d]),w=i.useMemo(()=>[...a.peers.values()].map(x=>x.user).filter(x=>x.id!==d),[a.peers,d]),C=i.useMemo(()=>{const x=new Map;for(const[v,b]of a.holds)x.set(v,b.userId);return x},[a.holds]),k=i.useCallback(x=>a.peers.get(x)?.user??{id:x,name:x},[a.peers]);return r?{presence:a,peers:w,heldBy:C,userById:k,grab:m,hover:y,release:S}:{presence:a,peers:[],heldBy:C,userById:k,grab:_e,hover:_e,release:_e}}function _e(){}function wt(e,t){try{e.publish(t)}catch{}}const Ct=40,va=({rootRef:e,holds:t,selfId:a,cards:s,userById:r})=>{const[o,l]=i.useState([]),[u,p]=i.useState(0);return i.useLayoutEffect(()=>{const h=e.current;if(!h)return;const d=()=>p(m=>m+1);return h.addEventListener("scroll",d,!0),window.addEventListener("resize",d),()=>{h.removeEventListener("scroll",d,!0),window.removeEventListener("resize",d)}},[e]),i.useLayoutEffect(()=>{const h=e.current;if(!h)return;const d=[];for(const[m,y]of t){if(y.userId===a||!y.hover)continue;const S=ee(y.hover.column,y.hover.lane),w=h.querySelector(`[data-bucket="${CSS.escape(S)}"]`);if(!w)continue;const C=[...w.querySelectorAll("[data-card-id]")].filter(B=>B.getAttribute("data-card-id")!==m),k=w.getBoundingClientRect(),x=C[y.hover.index],v=C[C.length-1],b=x?x.getBoundingClientRect().top-Ct/2:v?v.getBoundingClientRect().bottom+4:k.top;d.push({key:`${y.userId}:${m}`,peer:r(y.userId),bucket:S,title:s.find(B=>B.id===m)?.title??"",top:b,left:k.left,width:k.width})}l(d)},[e,t,a,s,r,u]),!o.length||typeof document>"u"?null:Qe.createPortal(n.jsx(n.Fragment,{children:o.map(h=>{const d=an(h.peer.color??Le(h.peer.id));return n.jsxs("div",{"data-taskboard-ghost":!0,"data-peer-id":h.peer.id,"data-ghost-bucket":h.bucket,"aria-hidden":"true",className:N("pointer-events-none fixed z-[900] flex items-center rounded-lg border-2 border-dashed px-3 text-xs font-medium shadow-sm backdrop-blur-sm transition-transform duration-150 ease-out motion-reduce:transition-none",d.ghost),style:{top:0,left:0,width:h.width,height:Ct,transform:`translate3d(${h.left}px, ${h.top}px, 0)`},children:[n.jsx("span",{className:"truncate opacity-80",children:h.title}),n.jsx("span",{className:N("absolute -top-2.5 right-2 rounded px-1.5 py-0.5 text-[10px] leading-none",d.label),children:h.peer.name})]},h.key)})}),document.body)},St=[[72,96,64],[88,64],[64,104,72],[96,72,88,64],[72]],wa=({columns:e,columnWidth:t,wellSurface:a,cornerClass:s})=>n.jsx("div",{"data-taskboard-skeleton":!0,"aria-hidden":"true",className:"flex min-h-0 flex-1 gap-3 overflow-hidden p-3",children:Array.from({length:Math.max(1,e)},(r,o)=>n.jsxs("div",{style:{width:t},className:N("flex shrink-0 flex-col gap-2 p-3",s,a),children:[n.jsx("div",{className:"mb-1 h-3.5 w-24 animate-pulse rounded bg-black/10 motion-reduce:animate-none dark:bg-white/10"}),St[o%St.length].map((l,u)=>n.jsx("div",{style:{height:l},className:"animate-pulse rounded-lg bg-black/[0.06] motion-reduce:animate-none dark:bg-white/[0.08]"},u))]},o))}),Ca={root:"kit.taskboard.root",loading:"kit.taskboard.loading",empty:"kit.taskboard.empty",error:"kit.taskboard.error",retry:"kit.taskboard.retry",addCard:"kit.taskboard.addCard",collapse:"kit.taskboard.collapse",expand:"kit.taskboard.expand",cardCount:"kit.taskboard.cardCount",wip:"kit.taskboard.wip",grabbed:"kit.taskboard.grabbed",moved:"kit.taskboard.moved",movedLane:"kit.taskboard.movedLane",dropped:"kit.taskboard.dropped",cancelled:"kit.taskboard.cancelled",held:"kit.taskboard.held",heldShort:"kit.taskboard.heldShort",notAllowed:"kit.taskboard.notAllowed",pending:"kit.taskboard.pending",online:"kit.taskboard.online",notes:"kit.taskboard.notes",checklist:"kit.taskboard.checklist",due:"kit.taskboard.due",addColumn:"kit.taskboard.addColumn",columnName:"kit.taskboard.columnName",moveColumn:"kit.taskboard.moveColumn",columnGrabbed:"kit.taskboard.columnGrabbed",columnMoved:"kit.taskboard.columnMoved",editColumn:"kit.taskboard.editColumn",columnColor:"kit.taskboard.columnColor",wipLimit:"kit.taskboard.wipLimit",wipLimitHint:"kit.taskboard.wipLimitHint",lockColumn:"kit.taskboard.lockColumn",lockColumnHint:"kit.taskboard.lockColumnHint",acceptsFrom:"kit.taskboard.acceptsFrom",acceptsAny:"kit.taskboard.acceptsAny",save:"kit.taskboard.save",cancel:"kit.taskboard.cancel",maxItems:"kit.taskboard.maxItems",maxItemsHint:"kit.taskboard.maxItemsHint"},Sa=(e,t)=>t?e.replace(/\{(\w+)\}/g,(a,s)=>s in t?String(t[s]):a):e;function ja(e){const t=sn();return i.useCallback((a,s)=>{const r=e?.[a];return r!==void 0?Sa(r,s):t(Ca[a],s)},[t,e])}const Ta=2e3,Na="bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",Ba="bg-white/70 shadow-sm ring-1 ring-white/60 backdrop-blur-md dark:bg-white/10 dark:ring-white/10",Ia="bg-black/[0.03] dark:bg-white/[0.04]",Ma="bg-white/25 dark:bg-white/5",Ra="bg-white dark:bg-neutral-900",Ea="bg-white/80 backdrop-blur-md dark:bg-neutral-900/70",jt=e=>{const{cards:t,columns:a,lanes:s,layout:r="columns",priorities:o,cardLayout:l="detailed",renderCard:u,onCardsChange:p,onColumnsChange:h,onLanesChange:d,onBeforeMove:m,editable:y,editMode:S=!1,maxItems:w,onCardOpen:C,onCardContextMenu:k,onAddCard:x,selectedIds:v,onSelectionChange:b,transport:B,currentUser:A,icon:D,title:O,subtitle:z,summary:F,actions:q,loading:c,loaderType:g="skeleton",error:f,onRetry:j,emptyState:I,color:M="blue",size:E="md",labels:L,columnCorner:$="rounded-md",surfaceVariant:V}=e,K=rn(),H=ja(L),{locale:G}=ln(),Y=ct[E]??ct.md,he=K.translucent?Ma:Ia,fe=dn($),oe=i.useRef(null),ge=y??!!p,re=r==="lanes"&&!!s?.length,ne=re?s:void 0,ve=T=>p?.(Ne(t,T,a,ne),T),W=ya(B,A),X=A?.id,{drag:U,pending:R,previewCards:_,cardHandlers:we,cancel:Pe,finish:Ut,keyboardGrab:Kt,keyboardMove:Gt}=pa({cards:t,columns:a,lanes:ne,editable:ge,heldBy:W.heldBy,selfId:X,maxItems:w,onBeforeMove:m,onCommit:ve,onDragStart:W.grab,onDragTarget:(T,P)=>P&&W.hover(T,P),onDragEnd:W.release}),[ue,nt]=i.useState(null);i.useEffect(()=>{if(!U||!X)return;const T=W.heldBy.get(U.cardId);if(!T||T===X)return;const P=W.userById(T);Pe("held"),nt({cardId:U.cardId,text:H("heldShort",{name:P.name}),color:P.color??Le(P.id)})},[W,U,X,Pe,H]),i.useEffect(()=>{if(!ue)return;const T=setTimeout(()=>nt(null),Ta);return()=>clearTimeout(T)},[ue]);const Ce=fa({rootRef:oe,cards:t,viewCards:_,columns:a,lanes:ne,text:H,drag:U,keyboardGrab:Kt,keyboardMove:Gt,finish:Ut,cancel:Pe,heldBy:W.heldBy,selfId:X,maxItems:w,onCardContextMenu:k,selectedIds:v,onSelectionChange:b}),at=i.useMemo(()=>new Set(Ce.selection),[Ce.selection]),be=!!(S&&h),J=ba({rootRef:oe,columns:a,enabled:be,text:H,announce:Ce.announce,onCommit:T=>h?.(T)}),De=J.previewColumns;ka(oe,De.map(T=>T.id).join("|"));const st=i.useCallback(T=>h?.(a.map(P=>P.id===T.id?T:P)),[a,h]),ot=T=>h?.([...a,{id:Yn(T,a),title:T}]),rt=Ce.cardProps,it=i.useCallback(T=>{const P=W.heldBy.get(T);return P&&P!==X?W.userById(P):void 0},[W,X]),Wt=i.useMemo(()=>({text:H,surface:K,color:M,size:Y,cardLayout:l,priorities:new Map((o??[]).map(T=>[T.id,T])),locale:G,editable:ge,renderCard:u,onCardOpen:C,onCardContextMenu:k,onAddCard:x,cardSurface:K.translucent?Ba:Na,wellSurface:he,columnCornerClass:fe,columnGripProps:be?J.gripProps:void 0,draggingColumnId:J.drag?.id??null,onEditColumn:be?st:void 0,allColumns:a,boardMaxItems:w,stickySurface:K.translucent?Ea:Ra,cardState:T=>({held:it(T.id),notice:ue?.cardId===T.id?ue.text:void 0,noticeColor:ue?.cardId===T.id?ue.color:void 0,dragging:U?.cardId===T.id&&!U.keyboard,grabbed:U?.cardId===T.id&&!!U.keyboard,selected:at.has(T.id),pending:R?.cardId===T.id}),cardProps:(T,P)=>({...ge?we(T,P):{},...rt(T,P)}),dropTarget:U?.to&&!U.valid?{bucket:ee(U.to.column,U.to.lane),index:U.to.index,valid:!1}:null}),[H,K,M,Y,l,o,G,ge,u,C,k,x,he,fe,be,J.gripProps,J.drag,st,a,w,at,U,R,we,rt,it,ue]),lt=i.useMemo(()=>Te(_,a,ne),[_,a,ne]),Vt=U?t.find(T=>T.id===U.cardId):void 0,Oe=h?T=>h(a.map(P=>P.id===T?{...P,collapsed:!P.collapsed}:P)):void 0,qt=d&&s?T=>d(s.map(P=>P.id===T?{...P,collapsed:!P.collapsed}:P)):void 0,Xt=c&&g==="skeleton",Yt=[D,O,z,F,q].some(T=>T!=null&&T!==!1)||!!(B&&A);let Be;return Xt?Be=n.jsx(wa,{columns:a.length||4,columnWidth:Y.columnWidth,wellSurface:he,cornerClass:fe}):f?Be=n.jsxs("div",{role:"alert",className:"flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center",children:[n.jsx("p",{className:N("text-sm font-medium",K.body),children:f===!0?H("error"):f}),j&&n.jsx(pe,{size:"sm",variant:"outline",color:M,onClick:j,children:H("retry")})]}):Be=n.jsxs("div",{className:"flex min-h-0 flex-1 flex-col",children:[t.length===0&&n.jsx("div",{"data-taskboard-empty":!0,className:N("px-4 pt-4 text-center text-sm",K.muted),children:I??H("empty")}),re?n.jsx(sa,{cards:_,columns:De,onAddColumn:be?ot:void 0,lanes:s,buckets:lt,onToggleLane:qt,onToggleColumn:Oe}):n.jsx(et,{"data-taskboard-scroll":!0,variant:"hover",tabIndex:-1,className:"min-h-0 flex-1",contentClassName:"flex! h-full",children:n.jsxs("div",{"data-taskboard-columns":!0,className:"flex w-max items-stretch gap-3 p-3",children:[De.map((T,P)=>n.jsx(Zn,{column:T,index:P,cards:lt.get(ee(T.id,null))??[],count:Ge(_,T.id),onToggle:Oe&&(()=>Oe(T.id))},T.id)),be&&n.jsx(Ht,{variant:"column",onAdd:ot})]})})]}),n.jsxs(cn.Provider,{value:Wt,children:[n.jsxs("div",{ref:oe,"data-taskboard":!0,role:"application","aria-roledescription":"task board","aria-busy":c?!0:void 0,"aria-label":H("root"),className:"flex h-full min-h-0 flex-col",children:[n.jsx("div",{"data-taskboard-live":!0,"aria-live":"polite","aria-atomic":"true",className:"sr-only",children:Ce.message}),Yt&&n.jsx(ta,{icon:D,title:O,subtitle:z,summary:F,actions:q,people:B&&A?[A,...W.peers]:void 0,variant:V}),Be]}),n.jsx(ia,{drag:U,card:Vt}),n.jsx(Jn,{drag:J.drag,column:a.find(T=>T.id===J.drag?.id),count:J.drag?Ge(t,J.drag.id):0,cards:J.drag?t.filter(T=>T.column===J.drag.id):[]}),B&&n.jsx(va,{rootRef:oe,holds:W.presence.holds,selfId:X,cards:t,userById:W.userById})]})},se=e=>{const{variant:t="elevated",tone:a,corner:s="rounded-md",padding:r="none",glassOpacity:o,vibrancy:l,specularMode:u,loading:p,loaderType:h="skeleton",className:d,height:m}=e;return t==="plain"?n.jsx("div",{className:N("flex min-h-0 flex-col",d),style:{height:m},children:n.jsx(jt,{...e,surfaceVariant:"elevated"})}):n.jsx(on,{variant:t,tone:a,corner:s,padding:r,glassOpacity:o,vibrancy:l,specularMode:u,loading:!!p&&h!=="skeleton",loaderType:h,flexBody:!0,scrollable:!1,className:d,style:{height:m},children:n.jsx(jt,{...e,surfaceVariant:t})})},He=ce.roadmap(),Tt=ce.fieldOps(),La={activation:"sky",billing:"amber",enterprise:"violet",analytics:"teal",research:"fuchsia",checkout:"rose",mobile:"indigo",platform:"slate",quote:"sky",retail:"amber",access:"violet","cold-chain":"cyan",security:"rose",handoff:"teal",crew:"lime",safety:"red",baggage:"orange"};function Aa(e){const t=e.tags?.[0],a=typeof t=="string"?t:t?.label;return a?La[a]??"emerald":void 0}const Pa=[{label:"No limit",value:"none"},...[3,4,5,6].map(e=>({label:String(e),value:String(e)}))];function Da(e,t,a){return e.map(s=>({...s,wipLimit:t&&(s.id==="building"||s.id==="onsite")?s.id==="building"?4:5:void 0,accepts:a&&s.id==="ready"?["discovery"]:void 0,locked:a&&(s.id==="blocked"||s.id==="closed")?!0:void 0}))}const Oa=()=>{const[e,t]=jn(),[a,s]=i.useState("columns"),[r,o]=i.useState("detailed"),[l,u]=i.useState("elevated"),[p,h]=i.useState("rounded-md"),[d,m]=i.useState("rounded-md"),[y,S]=i.useState(!1),[w,C]=i.useState(!1),[k,x]=i.useState("none"),[v,b]=i.useState("none"),[B,A]=i.useState("blue"),[D,O]=i.useState("md"),[z,F]=i.useState(!0),[q,c]=i.useState(!0),[g,f]=i.useState(!1),[j,I]=i.useState(!1),[M,E]=i.useState("skeleton"),[L,$]=i.useState(!1),[V,K]=i.useState(!1),H=a==="lanes"?Tt:He,[G,Y]=i.useState(He.cards),[he,fe]=i.useState(He.columns),[oe,ge]=i.useState(Tt.lanes),re=i.useRef(qn()).current,[ne,ve]=i.useState(0);i.useEffect(()=>{Y(H.cards),fe(H.columns),o(a==="lanes"?"compact":"detailed"),re.clear(),ve(0)},[a]);const W=i.useMemo(()=>Da(he,q,g),[he,q,g]),X=()=>{const R=re.undo(G,W,a==="lanes"?oe:void 0);R&&(Y(R),ve(re.size),t("undo"))},U=i.useRef(X);return U.current=X,i.useEffect(()=>{const R=_=>{if((_.ctrlKey||_.metaKey)&&!_.shiftKey&&_.key.toLowerCase()==="z"){if(_.target?.closest("input, textarea, [contenteditable]"))return;_.preventDefault(),U.current()}};return window.addEventListener("keydown",R),()=>window.removeEventListener("keydown",R)},[]),n.jsx(Cn,{controls:n.jsxs("div",{className:"space-y-3",children:[n.jsx(Sn,{groups:[{id:"layout",title:"Layout",controls:n.jsxs(n.Fragment,{children:[n.jsx($e,{label:"Layout",options:Nn,value:a,onChange:R=>s(R)}),n.jsx($e,{label:"Cards",options:Bn,value:r,onChange:R=>o(R)}),n.jsx(ke,{label:"Size",options:In,value:D,onChange:R=>O(R)})]})},{id:"surface",title:"Surface",controls:n.jsxs(n.Fragment,{children:[n.jsx(ke,{label:"Variant",options:Mn,value:l,onChange:R=>u(R)}),n.jsx(ke,{label:"Corner",options:mt,value:p,onChange:R=>h(R)}),n.jsx(ke,{label:"Column corner",options:mt,value:d,onChange:R=>m(R)}),n.jsx(ke,{label:"Padding",options:Rn,value:v,onChange:R=>b(R)}),n.jsx(ze,{label:"Accent",children:n.jsx(At,{selectable:!0,size:"sm",value:B,onSelect:A,defaultExpanded:!0})})]})},{id:"rules",title:"Rules",controls:n.jsx(ze,{label:"Rules",children:n.jsxs("div",{className:"space-y-1.5",children:[n.jsx(le,{label:"Editable",checked:z,onChange:F}),n.jsx(le,{label:"Card tones",checked:y,onChange:S}),n.jsx(le,{label:"Edit mode (columns)",checked:w,onChange:C}),n.jsx(le,{label:"WIP limits",checked:q,onChange:c}),n.jsx(le,{label:"Transition rules + locks",checked:g,onChange:f}),n.jsx(ke,{label:"Max items per column",options:Pa,value:k,onChange:x})]})})},{id:"states",title:"States",controls:n.jsxs(n.Fragment,{children:[n.jsx(ze,{label:"State",children:n.jsxs("div",{className:"space-y-1.5",children:[n.jsx(le,{label:"Loading",checked:j,onChange:I}),n.jsx(le,{label:"Error",checked:L,onChange:$}),n.jsx(le,{label:"Empty",checked:V,onChange:K})]})}),j&&n.jsx($e,{label:"Loader type",options:En,value:M,onChange:R=>E(R)})]})}]}),n.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Drag a card, or focus one and press ",n.jsx("strong",{children:"Space"})," to pick it up, the ",n.jsx("strong",{children:"arrows"})," to move it and ",n.jsx("strong",{children:"Space"})," again to drop. ",n.jsx("strong",{children:"Ctrl/⌘+Z"})," undoes the last move."]})]}),preview:n.jsxs("div",{className:"flex w-full flex-col gap-2",children:[n.jsx(se,{layout:a,cardLayout:r,cards:V?[]:y?G.map(R=>({...R,tone:Aa(R)})):G,columns:W,lanes:oe,priorities:H.priorities,editable:z,editMode:w,maxItems:k==="none"?void 0:Number(k),onCardsChange:(R,_)=>{Y(R),re.push(_),ve(re.size),t(`onCardsChange → ${_.cardId}: ${_.from.column} → ${_.to.column}[${_.to.index}]`)},onColumnsChange:R=>{fe(R),t(`onColumnsChange → [${R.map(_=>_.id).join(", ")}]`)},onLanesChange:ge,onCardOpen:R=>t(`onCardOpen → ${R.id}`),onCardContextMenu:({card:R,x:_,y:we})=>t(`onCardContextMenu → ${R.id} @ ${Math.round(_)},${Math.round(we)}`),onAddCard:({column:R,lane:_})=>t(`onAddCard → ${R}${_?` / ${_}`:""}`),onSelectionChange:R=>t(`onSelectionChange → [${R.join(", ")}]`),loading:j,loaderType:M,error:L||void 0,onRetry:()=>{$(!1),t("onRetry")},variant:l,corner:p,columnCorner:d,padding:v,color:B,size:D,icon:n.jsx(Dt,{className:"h-5 w-5"}),title:a==="lanes"?"FieldOps Dispatch":"Horizon Roadmap",subtitle:a==="lanes"?"Regional service lanes · Today":"Q3 launch command center",summary:n.jsxs(de,{size:"sm",variant:"soft",tone:"slate",children:[G.length," cards"]}),actions:n.jsxs("span",{className:"relative inline-flex",children:[n.jsx(un,{icon:"Revert",size:"sm",variant:"ghost",srLabel:"Undo last move",onClick:X,disabled:ne===0}),ne>0&&n.jsx(mn,{count:ne,size:"xs",tone:"slate",className:"pointer-events-none absolute -top-1 -right-1"})]}),height:540}),n.jsx(Tn,{log:e,emptyText:"No events yet — drag, click or right-click a card."})]})})},Se=ce.roadmap();function $a(){const[e,t]=i.useState(Se.cards),[a,s]=i.useState(null),[r,o]=i.useState(null),l=i.useRef(null),u=e.filter(m=>m.column==="building").length,p=e.filter(m=>m.column==="blocked").length,h=r?[{value:"edit",label:"Edit card",icon:"Edit"},...Se.columns.filter(m=>m.id!==r.column).map(m=>({value:`move:${m.id}`,label:`Move to ${m.title}`,icon:"ArrowRight"})),{value:"duplicate",label:"Duplicate",icon:"Copy"},{value:"delete",label:"Delete",icon:"Trash",danger:!0}]:[],d=m=>{if(!r)return;const{card:y}=r;if(m.value==="edit"&&s(y),m.value==="duplicate"&&t(S=>[...S,{...y,id:`${y.id}-copy-${S.length}`,title:`${y.title} (copy)`}]),m.value==="delete"&&t(S=>S.filter(w=>w.id!==y.id)),m.value.startsWith("move:")){const S=m.value.slice(5);t(w=>[...w.filter(C=>C.id!==y.id),{...y,column:S}])}o(null)};return n.jsxs("div",{className:"w-full",children:[n.jsx(se,{cards:e,columns:Se.columns,priorities:Se.priorities,onCardsChange:t,onCardOpen:s,onCardContextMenu:o,onAddCard:({column:m})=>t(y=>[...y,{id:`new-${y.length}`,title:"Untitled initiative",column:m}]),icon:n.jsx(Dt,{className:"h-5 w-5"}),title:"Horizon Roadmap",subtitle:"Q3 launch command center",summary:n.jsxs(n.Fragment,{children:[n.jsxs(de,{size:"sm",variant:"soft",tone:"slate",children:[e.length," initiatives"]}),n.jsxs(de,{size:"sm",variant:"soft",tone:"emerald",children:[u," shipping"]}),n.jsxs(de,{size:"sm",variant:"soft",tone:"orange",children:[p," blocked"]})]}),height:560}),n.jsx("div",{ref:l,className:"fixed h-0 w-0",style:{left:r?.x??0,top:r?.y??0}}),n.jsx(pn,{anchorRef:l,open:r!==null,onClose:()=>o(null),items:h,onSelect:d}),n.jsx(hn,{isOpen:a!==null,onClose:()=>s(null),title:"Edit initiative",subtitle:a?.id,footer:n.jsxs("div",{className:"flex justify-end gap-2",children:[n.jsx(pe,{variant:"soft",color:"slate",onClick:()=>s(null),children:"Cancel"}),n.jsx(pe,{onClick:()=>{a&&t(m=>m.map(y=>y.id===a.id?a:y)),s(null)},children:"Save"})]}),children:a&&n.jsxs("div",{className:"flex flex-col gap-4 p-1",children:[n.jsx(Ee,{"aria-label":"Title",value:a.title,onChange:m=>s({...a,title:m.target.value})}),n.jsxs(fn,{"aria-label":"Priority",value:a.priority??"",onChange:m=>s({...a,priority:m.target.value||void 0}),children:[n.jsx("option",{value:"",children:"No priority"}),Se.priorities.map(m=>n.jsx("option",{value:m.id,children:m.label},m.id))]})]})})]})}const za=`import { useRef, useState } from "react";
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
`,Re=ce.fieldOps();function _a(){const[e,t]=i.useState(Re.cards),[a,s]=i.useState(Re.lanes),r=(u="intake",p=a[0].id)=>t(h=>[...h,{id:`job-${h.length+1}`,title:"New service job",column:u,lane:p??void 0,priority:"medium",points:1}]),o=e.filter(u=>u.column==="onsite"||u.column==="scheduled").length,l=e.filter(u=>u.priority==="critical").length;return n.jsx("div",{className:"w-full",children:n.jsx(se,{layout:"lanes",cardLayout:"compact",size:"sm",color:"emerald",cards:e,columns:Re.columns,lanes:a,priorities:Re.priorities,onCardsChange:t,onLanesChange:s,onAddCard:({column:u,lane:p})=>r(u,p),icon:n.jsx(gn,{className:"h-5 w-5"}),title:"FieldOps Dispatch",subtitle:"Regional service lanes · Today",summary:n.jsxs(n.Fragment,{children:[n.jsxs(de,{size:"sm",variant:"soft",tone:"slate",children:[a.length," regions"]}),n.jsxs(de,{size:"sm",variant:"soft",tone:"sky",children:[o," active jobs"]}),n.jsxs(de,{size:"sm",variant:"soft",tone:"rose",children:[l," priority"]})]}),actions:n.jsx(pe,{size:"sm",color:"emerald",leadingIcon:"Add",onClick:()=>r(),children:"New job"}),height:560})})}const Ha=`import { useState } from "react";
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
`,Fa=[{id:"backlog",title:"Backlog",color:"slate"},{id:"ready",title:"Ready",color:"sky",accepts:["backlog"]},{id:"building",title:"Building",color:"amber",wipLimit:3},{id:"review",title:"Review",color:"violet"},{id:"shipped",title:"Shipped",color:"emerald",locked:!0}],je={id:"lb",name:"Lena Brandt",color:"teal"},Ua=[{id:"a",column:"backlog",title:"Rate-limit public API",assignees:[je]},{id:"b",column:"backlog",title:"Rotate signing keys"},{id:"c",column:"ready",title:"Billing webhooks retry",assignees:[je]},{id:"d",column:"building",title:"Org-level SSO",assignees:[je]},{id:"e",column:"building",title:"CSV export"},{id:"f",column:"building",title:"Audit log search",assignees:[je]},{id:"g",column:"shipped",title:"Usage dashboard",assignees:[je]}],Ka=e=>new Promise(t=>setTimeout(t,e));function Ga(){const[e,t]=i.useState(Ua),[a,s]=i.useState("Drag a card — refused targets turn red."),r=async o=>{if(o.to.column!=="review")return!0;const l=e.find(p=>p.id===o.cardId);s(`Asking for approval to review "${l?.title}"…`),await Ka(800);const u=!!l?.assignees?.length;return s(u?"Approved.":`Refused: "${l?.title}" needs an owner before review.`),u};return n.jsxs("div",{className:"flex w-full flex-col gap-2",children:[n.jsx(se,{cards:e,columns:Fa,onCardsChange:t,onBeforeMove:r,size:"sm",variant:"outlined",height:420}),n.jsx("p",{"aria-live":"polite",className:"text-xs text-neutral-500 dark:text-neutral-400",children:a})]})}const Wa=`import { useState } from "react";
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
`,Nt=ce.roadmap();function Va({card:e,dragging:t}){const a=e.checklist?e.checklist.done/e.checklist.total:0;return n.jsxs("div",{className:"flex flex-col gap-2",children:[n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-100",children:e.title}),t&&n.jsx("span",{className:"text-[10px] uppercase tracking-wide text-sky-600",children:"moving"})]}),n.jsx("div",{className:"h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",children:n.jsx("div",{className:"h-full rounded-full bg-sky-500",style:{width:`${Math.round(a*100)}%`}})}),n.jsx("span",{className:"text-[11px] text-neutral-500 dark:text-neutral-400",children:e.checklist?`${e.checklist.done} of ${e.checklist.total} tasks`:"No checklist"})]})}function qa(){const[e,t]=i.useState(Nt.cards.filter(a=>a.column!=="blocked"));return n.jsx("div",{className:"w-full",children:n.jsx(se,{cards:e,columns:Nt.columns.filter(a=>a.id!=="blocked"),onCardsChange:t,renderCard:(a,s)=>n.jsx(Va,{card:a,dragging:s.dragging}),color:"sky",size:"sm",height:460})})}const Xa=`import { useState } from "react";
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
`,Fe=ce.roadmap(),Ya=[{label:"Ready",value:"ready"},{label:"Loading",value:"loading"},{label:"Empty",value:"empty"},{label:"Error",value:"error"}];function Ja(){const[e,t]=i.useState("loading");return n.jsxs("div",{className:"flex w-full flex-col gap-3",children:[n.jsx(bn,{size:"sm",options:Ya,value:e,onChange:t}),n.jsx(se,{cards:e==="empty"?[]:Fe.cards,columns:Fe.columns,priorities:Fe.priorities,loading:e==="loading",error:e==="error"?"The board service did not answer.":void 0,onRetry:()=>t("loading"),onAddCard:()=>t("ready"),emptyState:"Nothing planned yet — add the first initiative to any column.",title:"Horizon Roadmap",size:"sm",height:400})]})}const Qa=`import { useState } from "react";
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
`,Ue=ce.roadmap();function Za(){const[e,t]=i.useState(Ue.cards),[a,s]=i.useState(Ue.columns),[r,o]=i.useState(!1);return n.jsx("div",{className:"w-full",children:n.jsx(se,{cards:e,columns:a,priorities:Ue.priorities,onCardsChange:t,onColumnsChange:s,editMode:r,title:"Horizon Roadmap",subtitle:r?"Editing the layout — drag a grip to reorder":"Q3 launch command center",actions:n.jsx(pe,{size:"sm",variant:r?"solid":"soft",onClick:()=>o(l=>!l),children:r?"Done":"Edit board"}),size:"sm",height:460})})}const es=`import { useState } from "react";
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
`,ts=[{id:"todo",title:"To do",color:"slate"},{id:"doing",title:"Doing",color:"sky"},{id:"done",title:"Done",color:"emerald"}],ns=[{id:"1",column:"todo",title:"Crash on empty workspace",tone:"rose",tags:["bug"]},{id:"2",column:"todo",title:"Bulk archive",tone:"sky",tags:["feature"]},{id:"3",column:"todo",title:"Rename 'Spaces' to 'Teams'",tone:"amber",tags:["copy"]},{id:"4",column:"doing",title:"Timezone drift in reports",tone:"rose",tags:["bug"]},{id:"5",column:"doing",title:"Saved filters",tone:"sky",tags:["feature"]},{id:"6",column:"done",title:"Upgrade the date library",tone:"violet",tags:["chore"]},{id:"7",column:"done",title:"Keyboard shortcuts sheet",tone:"sky",tags:["feature"]}];function as(){const[e,t]=i.useState(ns);return n.jsx("div",{className:"w-full",children:n.jsx(se,{cards:e,columns:ts,onCardsChange:t,size:"sm",corner:"rounded-md",columnCorner:"rounded-sm",height:360})})}const ss=`import { useState } from "react";
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
`,Ke=ce.roadmap(),Bt=["Ana","Ben","Chloé","Dev","Eli","Femi","Gus","Hana"],It="kit-docs-demo";function os(){const e=i.useMemo(()=>{const u=`tab-${Math.random().toString(36).slice(2,8)}`,p=Bt[Math.floor(Math.random()*Bt.length)];return{id:u,name:p,color:Le(u)}},[]),[t,a]=i.useState(Ke.cards),[s,r]=i.useState(),[o,l]=i.useState();return i.useEffect(()=>{if(typeof BroadcastChannel>"u")return;const u=Wn(It),p=new BroadcastChannel(`${It}:cards`);return p.onmessage=h=>a(h.data),r(u),l(p),()=>{u.close(),p.close()}},[]),n.jsx("div",{className:"w-full",children:n.jsx(se,{cards:t,columns:Ke.columns,priorities:Ke.priorities,onCardsChange:u=>{a(u),o?.postMessage(u)},transport:s,currentUser:e,title:"Live board",subtitle:"Open this page in a second tab and drag a card",summary:n.jsxs(de,{size:"sm",variant:"soft",tone:e.color,children:["You are ",e.name]}),height:520})})}const rs=`import { useEffect, useMemo, useState } from "react";
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
`,is=`import type { TaskBoardTransport } from "@cjlapao/ui-kit";

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
/>`,gs=()=>n.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[n.jsx(wn,{name:"Task Board",description:"A kanban board in two layouts — columns, or columns crossed with swimlanes — with real-time drag and drop by pointer, touch and keyboard. Locks, WIP limits and transition rules are enforced before a card moves, a guarded move can wait on your server, and a collaboration channel shows teammates' drags live: the card they hold is locked on your screen and a ghost shows where it is going. The board is a Panel, so every surface variant, corner and glass setting comes with it. React ships first; the Vue kit is a step behind."}),n.jsx(Oa,{}),n.jsxs("section",{className:"flex flex-col gap-5",children:[n.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),n.jsx(ie,{title:"Product roadmap",description:"The columns view with detailed cards. Click or press Enter to open the editor (a SidePanel the app owns); right-click or Shift+F10 for a menu anchored at the payload's x / y. Summary pills and the add-card buttons are plain props.",code:za,filename:"ProductRoadmap.tsx",children:n.jsx($a,{})}),n.jsx(ie,{title:"Field operations (swimlanes)",description:'`layout="lanes"` crosses the columns with `lanes`. Cards move across lanes as freely as across columns, each lane collapses on its own, and the column header and lane labels stay put while the grid scrolls.',code:Ha,filename:"FieldOperations.tsx",children:n.jsx(_a,{})}),n.jsx(ie,{title:"Rules and guarded moves",description:"`accepts`, `wipLimit` and `locked` are checked by the engine, so a refused bucket turns red and never previews the card. `onBeforeMove` adds your own check — sync or async — and a refusal puts the card back with no rollback code.",code:Wa,filename:"Rules.tsx",children:n.jsx(Ga,{})}),n.jsx(ie,{title:"Edit the board",description:"`editMode` unlocks the layout: every column header gets a grip to drag it to a new position (or Space, arrows, Space from the keyboard) and an edit button for its properties — name, colour, WIP limit, max items, lock, and which columns it accepts cards from — and an Add column slot follows the last column. Both report through `onColumnsChange`. Outside edit mode the layout is fixed — cards still move as usual.",code:es,filename:"EditMode.tsx",children:n.jsx(Za,{})}),n.jsx(ie,{title:"Card tones and corners",description:"`tone` on a card tints its surface, so every card can carry its own colour — status, type, owner. It survives glass (a translucent tint) and the drag clone. `columnCorner` rounds the column wells on the same container scale as the board's `corner`; both default to md.",code:ss,filename:"CardTones.tsx",children:n.jsx(as,{})}),n.jsx(ie,{title:"Custom cards",description:"`renderCard` swaps a card's body; the shell (drag, focus, selection, teammate ring) stays the board's, and the state argument tells the body what is happening to it.",code:Xa,filename:"CustomCards.tsx",children:n.jsx(qa,{})}),n.jsx(ie,{title:"Loading, empty and error",description:"Loading draws a skeleton shaped like the board. Error replaces the columns with the message and a Retry. An empty board keeps its columns, so Add card is still there.",code:Qa,filename:"States.tsx",children:n.jsx(Ja,{})}),n.jsx(ie,{title:"Live collaboration",description:"Open this page in a second tab and drag a card. The other tab locks it, shows your name on it, and moves a ghost to wherever you are pointing; drop, and the card lands there. Whoever grabbed first wins, on every screen, and a tab that closes mid-drag lets go after eight seconds.",code:rs,filename:"LiveCollaboration.tsx",children:n.jsx(os,{})})]}),n.jsxs(kn,{children:[n.jsxs(ut,{title:"Screen reader",children:[n.jsxs("p",{children:["The board is a ",n.jsx(Q,{children:'role="application"'})," region named by ",n.jsx(Q,{children:"kit.taskboard.root"})," with"," ",n.jsx(Q,{children:'aria-roledescription="task board"'}),". Each column (or column × lane cell) is a ",n.jsx(Q,{children:'role="group"'})," named by its title and card count, and each card is a ",n.jsx(Q,{children:'role="button"'})," with"," ",n.jsx(Q,{children:'aria-roledescription="card"'}),", named by its title."]}),n.jsxs("p",{children:['Moves are spoken through a polite live region: picking a card up, every step ("Moved to Discovery, position 1 of 4"), the drop and a cancel. A card a teammate holds gets ',n.jsx(Q,{children:"aria-disabled"}),' and a visually hidden "',"{name}",' is moving this"; a pending guarded move sets ',n.jsx(Q,{children:"aria-busy"})," on the card."]}),n.jsx(xn,{code:is,filename:"transport.tsx"})]}),n.jsx(yn,{bindings:[{keys:["Tab"],action:"Moves into the board — one card is in the tab order at a time (roving tabindex)."},{keys:["↑ / ↓"],action:"Moves focus to the previous / next card in the column."},{keys:["← / →"],action:"Moves focus to the nearest card in the previous / next column (mirrored in RTL)."},{keys:["Alt","↑ / ↓"],action:"Moves focus to the previous / next lane."},{keys:["Space"],action:"Picks the focused card up; with a card held, drops it."},{keys:["Arrows (held)"],action:"Moves the held card through valid slots only — full, locked and refused columns are skipped. Alt+↑/↓ crosses lanes."},{keys:["Esc"],action:"Cancels the move; the card goes back where it was."},{keys:["Enter"],action:"Opens the card (onCardOpen)."},{keys:["Shift","F10"],action:"Opens the context menu (onCardContextMenu); the Menu key does the same."},{keys:["Space (grip)"],action:"Edit mode: picks the column up; ← / → move it one position (mirrored in RTL); Space drops; Esc or Tab cancels."}]}),n.jsx(ut,{title:"Internationalization",children:n.jsxs("p",{children:['Every built-in string — "Add card", the counts, the announcements, "',"{name}",' is moving this" — is a'," ",n.jsx(Q,{children:"kit.taskboard.*"})," key in the kit catalogs (en, de, es, fr, pt), and ",n.jsx(Q,{children:"labels"})," overrides any of them per board. Card titles, column titles and lane titles are your data. Due dates format with the kit locale. Inside a ",n.jsx(Q,{children:'dir="rtl"'})," container the columns run right to left and the arrow keys follow."]})})]}),n.jsx(vn,{props:[{name:"cards / columns / lanes",type:"TaskBoardCard[] / TaskBoardColumn[] / TaskBoardLane[]",description:"The data, controlled. Order inside a column × lane is the order of the cards array — there is no second ordering to keep in sync."},{name:"onCardsChange",type:"(next, move) => void",description:"The single commit event: the next cards array, and the move that produced it (ready for your undo history or your API)."},{name:"onColumnsChange / onLanesChange",type:"(next) => void",description:"Collapse changes — and, in edit mode, column reorders and added columns. Omit one and its carets disappear."},{name:"maxItems",type:"number",description:"Board-wide hard cap on cards per column; a column's own `maxItems` overrides it. At the cap the column's Add card button disappears and drops into it are refused (the header reads count / max when there is no WIP limit)."},{name:"column.maxItems",type:"number",description:"Per column: overrides the board's maxItems. Editable in edit mode's column editor; empty falls back to the board default."},{name:"editMode",type:"boolean",default:"false",description:"Layout editing: a drag grip and an edit button (name, colour, WIP limit, lock, accepted sources) on every column header, and an Add column slot after the last column (columns and lanes layouts). Needs onColumnsChange; the new column's id is slugged from its name and kept unique."},{name:"onBeforeMove",type:"(move) => boolean | Promise<boolean>",description:"Guard a move after the engine rules pass. While it is pending the card waits in its new slot; false or a throw puts it back."},{name:"editable",type:"boolean",default:"!!onCardsChange",description:"Pointer and keyboard moves. Selection, focus and opening still work on a read-only board."},{name:"layout",type:"TaskBoardLayout",default:'"columns"',description:'"lanes" crosses the columns with `lanes`.'},{name:"cardLayout / renderCard",type:"TaskBoardCardLayout / (card, state) => ReactNode",default:'"detailed"',description:"A preset card body, or your own. The card shell stays the board's."},{name:"priorities",type:"TaskBoardPriority[]",description:"What `card.priority` ids resolve to: label and colour."},{name:"onCardOpen / onCardContextMenu / onAddCard",type:"callbacks",description:"App-owned surfaces. The context-menu payload carries the card, column, lane, index, x / y and the event."},{name:"selectedIds / onSelectionChange",type:"string[] / (ids) => void",description:"Click, Ctrl/⌘-click and Shift-click (range within a column). Uncontrolled when selectedIds is omitted."},{name:"transport / currentUser",type:"TaskBoardTransport / TaskBoardUser",description:"The collaboration channel: presence, grabs and drag targets only — never card data. Without both, nothing runs."},{name:"icon / title / subtitle / summary / actions",type:"ReactNode",description:"The header strip. Online teammates appear between summary and actions."},{name:"loading / loaderType",type:"boolean / PanelLoaderType",default:'false / "skeleton"',description:"The skeleton is shaped like the board; any other type overlays Panel's loader."},{name:"error / onRetry / emptyState",type:"ReactNode | boolean / () => void / ReactNode",description:"true shows the built-in message. The empty state sits above the columns, which stay."},{name:"card.tone",type:"TrueColor",description:"Per card: tints that card's surface (a solid tint, or a translucent one on glass boards), so cards can be told apart by colour. Omitted keeps the neutral card."},{name:"columnCorner",type:"SurfaceCorner",default:'"rounded-md"',description:"Radius of the column wells, collapsed strips and skeleton included — the container scale `corner` uses."},{name:"variant",type:"TaskBoardVariant",default:'"elevated"',description:"Any Panel surface, or plain for no chrome. Translucent surfaces switch the wells, cards and sticky headers to glass."},{name:"tone / corner / padding / glassOpacity / vibrancy / specularMode",type:"Panel props",default:'corner "rounded-md", padding "none"',description:"Passed to the Panel the board renders."},{name:"color",type:"TrueColor",default:'"blue"',description:"Accent for focus, selection, the drag clone, and the column edge when a column has no colour of its own."},{name:"size",type:"ControlSize",default:'"md"',description:"Column width and card density, from xs (232 px) to xl (352 px)."},{name:"labels",type:"Partial<TaskBoardLabels>",description:"Per-board overrides of the kit.taskboard strings."},{name:"height / className",type:"number | string / string",description:"The columns scroll inside the height."}]})]});export{gs as TaskBoardPage,gs as default};
