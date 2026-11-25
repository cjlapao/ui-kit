import{ha as ne,j as n,hb as un,V as N,r as i,fe as Be,hc as ct,gJ as ut,hd as Ut,he as Wt,hf as Vt,hg as mt,hh as Kt,N as mn,c as Ve,C as Gt,Y as pn,p as hn,B as ge,hi as fn,hj as qt,a as pt,hk as Yt,gb as gn,hl as bn,hm as Ke,hn as kn,u as xn,P as yn,fc as vn,ho as Cn,hp as wt,gf as wn,hq as Sn,I as jn,U as Tn,t as fe,hr as Xt,hs as Nn,w as Bn,ga as Mn,ht as In,bf as Rn}from"./index-CQwZVYnB.js";import{A as En,a as St,C as Y,b as An,K as Ln,P as Dn}from"./A11ySections-BXfanEck.js";import{P as Pn}from"./PageHeader-BhZxEVHt.js";import{E as ie}from"./ExampleCard-BZsKA5_g.js";import{S as On}from"./SurfaceToneControl-LH37fS9y.js";import{P as zn,C as Je,S as he,a as Ze,T as ee}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as $n}from"./ControlAccordion-C7vC6faF.js";import{u as _n,E as Fn}from"./EventLog-B3ejPngN.js";import{aj as Hn,ak as Un,c as Wn,al as Vn,f as jt,p as Kn,e as Gn}from"./options-Byh1yOHz.js";function X(e,t){return`${e}::${t??""}`}function ht(e,t){return!t||t.length===0?null:e.lane&&t.some(a=>a.id===e.lane)?e.lane:t[0].id}function De(e,t,a){const s=new Map,o=a&&a.length?a.map(r=>r.id):[null];for(const r of t)for(const l of o)s.set(X(r.id,l),[]);for(const r of e){const l=s.get(X(r.column,ht(r,a)));l&&l.push(r)}return s}function Le(e,t){let a=0;for(const s of e)s.column===t&&a++;return a}function qn(e,t,a){let s=0;for(const o of e)(a?ht(o,a):o.lane)===t&&s++;return s}function Qt(e,t){return t==null?"none":e>t?"over":e===t?"full":"ok"}const Tt=[{id:"sw",name:"Sara Walsh",color:"indigo"},{id:"jc",name:"Jonah Cole",color:"teal"},{id:"mg",name:"Maya Grant",color:"indigo"},{id:"ak",name:"Arjun Kapoor",color:"violet"},{id:"lb",name:"Lena Brandt",color:"teal"},{id:"rp",name:"Rui Pereira",color:"orange"}],Nt=[{id:"nk",name:"Nadia Khan",color:"rose"},{id:"ml",name:"Marco Lund",color:"orange"},{id:"ps",name:"Priya Shah",color:"violet"},{id:"ob",name:"Owen Baker",color:"blue"},{id:"er",name:"Elif Reyes",color:"amber"},{id:"vc",name:"Victor Chen",color:"amber"},{id:"mp",name:"Mia Park",color:"green"},{id:"sc",name:"Sofia Costa",color:"fuchsia"}],Jt=(e,t)=>e.find(a=>a.id===t);function Yn(){const e=s=>Jt(Tt,s),t=new Date().getFullYear(),a=(s,o)=>new Date(t,s-1,o).toISOString().slice(0,10);return{priorities:[{id:"p1",label:"P1",color:"red"},{id:"p2",label:"P2",color:"orange"},{id:"p3",label:"P3",color:"blue"},{id:"p4",label:"P4",color:"slate"}],users:Tt.map(s=>({...s})),columns:[{id:"ideas",title:"Ideas",color:"blue"},{id:"discovery",title:"Discovery",color:"blue"},{id:"ready",title:"Ready",color:"blue"},{id:"building",title:"Building",color:"amber",wipLimit:5},{id:"blocked",title:"Blocked",color:"red"}],cards:[{id:"r1",column:"ideas",title:"Persona-based onboarding paths",tags:["activation","research"],priority:"p2",description:"Branch the first-run flow by role.",assignees:[e("sw")]},{id:"r2",column:"ideas",title:"Usage-based pricing meters",tags:["billing","platform"],priority:"p1",checklist:{done:2,total:5},due:a(11,6),assignees:[e("jc")],subtasks:[{id:"r2a",title:"Meter schema",done:!0},{id:"r2b",title:"Ingest pipeline",done:!0},{id:"r2c",title:"Idempotent events"},{id:"r2d",title:"Usage → invoice bridge"},{id:"r2e",title:"Overage emails"},{id:"r2f",title:"Meter backfill tool"},{id:"r2g",title:"Quota guardrail tests"}]},{id:"r3",column:"ideas",title:"Enterprise SSO buying signal",tags:["enterprise","research"],priority:"p3",description:"Track SSO page visits per account."},{id:"r4",column:"ideas",title:"AI summary opt-in",tags:["research","platform"],priority:"p4",description:"Workspace-level toggle."},{id:"r5",column:"discovery",title:"Mobile trial activation",tags:[{label:"mobile",color:"fuchsia"},"activation"],priority:"p2",checklist:{done:1,total:3},due:a(10,30),assignees:[e("mg")]},{id:"r6",column:"discovery",title:"Account health score",tags:["analytics","growth"],priority:"p3",description:"Blend usage, seats and tickets.",assignees:[e("ak")],subtasks:[{id:"r6a",title:"Factor weights draft",done:!0},{id:"r6b",title:"Ticket sentiment feed"},{id:"r6c",title:"Churn backtest"}]},{id:"r7",column:"discovery",title:"Partner API discovery",tags:["platform"],priority:"p4"},{id:"r8",column:"ready",title:"Customer import wizard",tags:["activation","platform"],priority:"p3",assignees:[e("lb")]},{id:"r9",column:"ready",title:"Self-serve plan downgrade",tags:["billing","trust"],priority:"p2",description:"Keep data, drop seats.",due:a(10,28),assignees:[e("rp")]},{id:"r10",column:"ready",title:"Warehouse sync beta",tags:["analytics","enterprise"],priority:"p1",due:a(11,2),assignees:[e("jc")]},{id:"r11",column:"building",title:"Checkout recovery campaign",tags:["checkout","growth"],priority:"p1",checklist:{done:3,total:5},due:a(10,26),assignees:[e("sw")],subtasks:[{id:"r11a",title:"Abandonment triggers",status:"completed"},{id:"r11b",title:"Email + SMS copy",status:"completed"},{id:"r11c",title:"Discount ladder",status:"active"},{id:"r11d",title:"Frequency caps",status:"pending"}]},{id:"r12",column:"building",title:"Admin audit log",tags:["enterprise","trust"],priority:"p2",checklist:{done:1,total:3},description:"Every admin action, exportable.",assignees:[e("lb")],subtasks:[{id:"r12a",title:"Event taxonomy",done:!0},{id:"r12b",title:"Retention job",status:"error"},{id:"r12c",title:"CSV export"},{id:"r12d",title:"Per-space filters"}]},{id:"r13",column:"building",title:"Saved dashboard templates",tags:["analytics","platform"],priority:"p3",assignees:[e("jc")]},{id:"r14",column:"building",title:"Expansion signal pipeline",tags:["analytics","growth"],priority:"p3",due:a(10,29),assignees:[e("ak")]},{id:"r15",column:"blocked",title:"App store review fixes",tags:["checkout","mobile"],priority:"p2",assignees:[e("mg")]},{id:"r16",column:"blocked",title:"Data residency (EU)",tags:["enterprise"],priority:"p3",description:"Waiting on legal sign-off."}]}}function Xn(){const e=t=>Jt(Nt,t);return{priorities:[{id:"critical",label:"Critical",color:"red"},{id:"high",label:"High",color:"orange"},{id:"medium",label:"Medium",color:"blue"},{id:"low",label:"Low",color:"slate"}],users:Nt.map(t=>({...t})),columns:[{id:"intake",title:"Intake"},{id:"scheduled",title:"Scheduled"},{id:"onsite",title:"On site"},{id:"review",title:"Review"},{id:"closed",title:"Closed"}],lanes:[{id:"north",title:"North Region"},{id:"downtown",title:"Downtown Retail"},{id:"airport",title:"Airport Terminal"},{id:"harbor",title:"Harbor Logistics"}],cards:[{id:"f1",lane:"north",column:"intake",title:"Quote backup generator service",priority:"medium",points:2,tags:["quote"],assignees:[e("ps")]},{id:"f2",lane:"north",column:"scheduled",title:"Replace freezer controller",priority:"high",points:2,tags:["cold-chain"],assignees:[e("nk")]},{id:"f3",lane:"north",column:"onsite",title:"Investigate gate sensor loop",priority:"critical",points:3,tags:["access"],assignees:[e("ml")],subtasks:[{id:"f3a",title:"Loop resistance test",done:!0},{id:"f3b",title:"Swap reader head"},{id:"f3c",title:"Log to maintenance"}]},{id:"f4",lane:"north",column:"onsite",title:"Refit loading dock camera",priority:"high",points:5,tags:["security"],assignees:[e("nk")]},{id:"f5",lane:"north",column:"review",title:"Verify night crew handoff",priority:"medium",points:1,tags:["handoff"],assignees:[e("sc")]},{id:"f6",lane:"north",column:"closed",title:"Close HVAC inspection",priority:"low",points:1,tags:["hvac"],assignees:[e("ob")]},{id:"f7",lane:"downtown",column:"intake",title:"Book signage replacement",priority:"high",points:2,tags:["retail"],assignees:[e("er")]},{id:"f8",lane:"downtown",column:"intake",title:"Repair stockroom door strike",priority:"high",points:2,tags:["access"],assignees:[e("vc")]},{id:"f9",lane:"downtown",column:"scheduled",title:"Stage weekend cleaning crew",priority:"medium",points:1,tags:["crew"],assignees:[e("vc")]},{id:"f10",lane:"downtown",column:"onsite",title:"Escalator brake fault",priority:"critical",points:3,tags:["safety"],assignees:[e("ob")]},{id:"f11",lane:"downtown",column:"review",title:"Approve storefront glass work",priority:"critical",points:2,tags:["vendor"],assignees:[e("ob")]},{id:"f12",lane:"downtown",column:"closed",title:"Close retrofit lighting",priority:"medium",points:2,tags:["lighting"],assignees:[e("er")]},{id:"f13",lane:"airport",column:"intake",title:"Triage baggage belt alarm",priority:"critical",points:5,tags:["baggage"],assignees:[e("mp")]},{id:"f14",lane:"airport",column:"onsite",title:"Repair kiosk printer cluster",priority:"high",points:2,tags:["kiosk"],assignees:[e("mp")]},{id:"f15",lane:"airport",column:"closed",title:"Close alarm panel audit",priority:"high",points:1,tags:["alarm"],assignees:[e("ps")]},{id:"f16",lane:"harbor",column:"scheduled",title:"Calibrate crane load cells",priority:"high",points:3,tags:["crane"],assignees:[e("ml")]},{id:"f17",lane:"harbor",column:"review",title:"Sign off reefer plug repair",priority:"medium",points:2,tags:["cold-chain"],assignees:[e("nk")]}]}}const be={roadmap:Yn,fieldOps:Xn},Qn={ok:!0},le=e=>({ok:!1,reason:e});function Zt(e,t){const a=e.cards.find(d=>d.id===t.cardId);if(!a||a.locked)return le("locked-card");const s=e.heldBy?.get(a.id);if(s&&s!==e.selfId)return le("held");const o=e.columns.find(d=>d.id===t.from.column),r=e.columns.find(d=>d.id===t.to.column);if(!r||o?.locked||r.locked)return le("locked-column");const l=e.lanes?.find(d=>d.id===t.from.lane),u=e.lanes?.find(d=>d.id===t.to.lane);if(l?.locked||u?.locked)return le("locked-lane");const m=t.from.column!==t.to.column;if(m&&r.accepts&&!r.accepts.includes(t.from.column))return le("not-accepted");const h=Ge(r,e.maxItems);return m&&h!==void 0&&e.cards.filter(p=>p.column===r.id&&p.id!==a.id).length>=h?le("max-items"):m&&r.wipLimit!==void 0&&e.cards.filter(p=>p.column===r.id&&p.id!==a.id).length>=r.wipLimit?le("wip-column"):t.from.lane!==t.to.lane&&u?.wipLimit!==void 0&&e.cards.filter(p=>p.id!==a.id&&ht(p,e.lanes)===u.id).length>=u.wipLimit?le("wip-lane"):Qn}function Ge(e,t){return e.maxItems??t}function Jn(e,t,a){const s=Ge(t,a);if(s===void 0)return!1;let o=0;for(const r of e)r.column===t.id&&o++;return o>=s}function Pe(e,t,a,s){const o=e.find(d=>d.id===t.cardId);if(!o)return e;const r=e.filter(d=>d.id!==t.cardId),l={...o,column:t.to.column};t.to.lane!==null&&(l.lane=t.to.lane);const u=De(r,a,s).get(X(t.to.column,t.to.lane))??[],m=Math.max(0,Math.min(t.to.index,u.length));if(u.length===0)return[...r,l];if(m<u.length){const d=r.indexOf(u[m]);return[...r.slice(0,d),l,...r.slice(d)]}const h=r.indexOf(u[u.length-1])+1;return[...r.slice(0,h),l,...r.slice(h)]}function Zn(e,t,a,s){const o=e.filter(l=>l.id!==a),r=e.find(l=>l.id===a);if(r&&t>=r.top&&t<=r.top+r.height)return s??o.filter(l=>l.top<r.top).length;for(let l=0;l<o.length;l++){const u=o[l];if(t<u.top+u.height/2)return l}return o.length}function ea(e,t,a,s){const o=e.cards.filter(d=>d.id!==a),r=De(o,e.columns,e.lanes),l=(d,p)=>r.get(X(d,p))?.length??0,u=d=>Zt(e,{cardId:a,from:t,to:d}).ok;if(s==="up"||s==="down"){const d=t.index+(s==="down"?1:-1);if(d<0||d>l(t.column,t.lane))return null;const p={...t,index:d};return u(p)?p:null}if(s==="left"||s==="right"){const d=e.columns,p=s==="right"?1:-1;for(let y=d.findIndex(j=>j.id===t.column)+p;y>=0&&y<d.length;y+=p){const j=d[y];if(j.collapsed)continue;const S={column:j.id,lane:t.lane,index:Math.min(t.index,l(j.id,t.lane))};if(u(S))return S}return null}const m=e.lanes??[],h=s==="lane-down"?1:-1;for(let d=m.findIndex(p=>p.id===t.lane)+h;d>=0&&d<m.length;d+=h){const p=m[d];if(p.collapsed)continue;const y={column:t.column,lane:p.id,index:Math.min(t.index,l(t.column,p.id))};if(u(y))return y}return null}const ta=5e3,Bt=8e3,na=50;function Mt(){return{peers:new Map,holds:new Map}}const te=e=>typeof e=="string",It=e=>typeof e=="number"&&Number.isFinite(e);function aa(e){if(!e||typeof e!="object")return null;const t=e;if(!It(t.at))return null;switch(t.type){case"presence":{const a=t.user;return a&&te(a.id)&&te(a.name)?t:null}case"leave":return te(t.userId)?t:null;case"grab":return te(t.userId)&&te(t.cardId)?t:null;case"release":return te(t.userId)&&te(t.cardId)?t:null;case"hover":return te(t.userId)&&te(t.cardId)&&te(t.column)&&(t.lane===null||te(t.lane))&&It(t.index)?t:null;default:return null}}function He(e,t,a){const s=e.peers.get(t);if(!s)return e.peers;const o=new Map(e.peers);return o.set(t,{...s,lastSeen:a}),o}function sa(e,t){return e.at<t.at||e.at===t.at&&e.userId<t.userId}function oa(e,t,a){const s=aa(t);if(!s)return e;switch(s.type){case"presence":{const o=new Map(e.peers);o.set(s.user.id,{user:s.user,lastSeen:a});let r=e.holds;for(const[l,u]of e.holds)u.userId===s.user.id&&(r===e.holds&&(r=new Map(e.holds)),r.set(l,{...u,seen:a}));return{peers:o,holds:r}}case"leave":{const o=new Map(e.peers);o.delete(s.userId);const r=new Map(e.holds);for(const[l,u]of e.holds)u.userId===s.userId&&r.delete(l);return{peers:o,holds:r}}case"grab":{const o=e.holds.get(s.cardId);if(o&&o.userId!==s.userId&&!sa(s,o))return{...e,peers:He(e,s.userId,a)};const r=new Map(e.holds);return r.set(s.cardId,{userId:s.userId,at:s.at,seen:a}),{peers:He(e,s.userId,a),holds:r}}case"hover":{const o=e.holds.get(s.cardId);if(!o||o.userId!==s.userId)return e;const r=new Map(e.holds);return r.set(s.cardId,{...o,seen:a,hover:{column:s.column,lane:s.lane,index:s.index}}),{peers:He(e,s.userId,a),holds:r}}case"release":{const o=e.holds.get(s.cardId);if(!o||o.userId!==s.userId)return e;const r=new Map(e.holds);return r.delete(s.cardId),{peers:He(e,s.userId,a),holds:r}}}}function ra(e,t){let a=e.peers,s=e.holds;for(const[o,r]of e.peers)t-r.lastSeen<=Bt||(a===e.peers&&(a=new Map(e.peers)),a.delete(o));for(const[o,r]of e.holds)t-r.seen<=Bt||(s===e.holds&&(s=new Map(e.holds)),s.delete(o));return a===e.peers&&s===e.holds?e:{peers:a,holds:s}}function ia(e){const t=new BroadcastChannel(`taskboard:${e}`),a=new Set;let s=!1;return t.onmessage=o=>{for(const r of a)r(o.data)},{publish:o=>{s||t.postMessage(o)},subscribe(o){return a.add(o),()=>{a.delete(o)}},close(){s=!0,a.clear(),t.close()}}}const la=e=>({cardId:e.cardId,from:e.to,to:e.from});function da(e=100){let t=[],a=[];return{push(s){t=[...t,s].slice(-e),a=[]},undo(s,o,r){const l=t[t.length-1];return l?(t=t.slice(0,-1),a=[...a,l],Pe(s,la(l),o,r)):null},redo(s,o,r){const l=a[a.length-1];return l?(a=a.slice(0,-1),t=[...t,l],Pe(s,l,o,r)):null},get canUndo(){return t.length>0},get canRedo(){return a.length>0},get size(){return t.length},clear(){t=[],a=[]}}}function Rt(e,t,a){const s=e.findIndex(l=>l.id===t);if(s===-1)return e;const o=e.filter(l=>l.id!==t),r=Math.max(0,Math.min(a,o.length));return[...o.slice(0,r),e[s],...o.slice(r)]}function ca(e,t,a,s,o,r=!1){const l=e.findIndex(S=>S.id===a);if(l===-1||o===0||e.length===0)return s;const u=r?o<0:o>0,m=e.length-1,h=e.findIndex(S=>t>=S.left&&t<=S.left+S.width);if(h!==-1)return h===l?s:h>l&&u?Math.min(h,m):h<l&&!u?h:s;const d=Math.min(...e.map(S=>S.left)),p=Math.max(...e.map(S=>S.left+S.width)),y=r?t<d:t>p,j=r?t>p:t<d;return y&&u?m:j&&!u?0:s}function ua(e,t){const a=e.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"column",s=new Set(t.map(r=>r.id));if(!s.has(a))return a;let o=2;for(;s.has(`${a}-${o}`);)o++;return`${a}-${o}`}const en=({column:e,lane:t,cards:a,className:s,label:o})=>{const{cardState:r,cardProps:l,dropTarget:u,size:m,text:h}=ne(),d=X(e,t),p=u&&u.bucket===d?u:null;return n.jsx("div",{role:"group","aria-label":o,"data-bucket":d,"data-bucket-column":e,"data-bucket-lane":t??"","data-drop":p?p.valid?"valid":"invalid":void 0,title:p&&!p.valid?h("notAllowed"):void 0,className:N("flex min-h-12 flex-col rounded-lg transition-colors",m.gap,s),children:a.map((y,j)=>n.jsx(un,{card:y,column:e,lane:t,index:j,state:r(y),...l?.(y,{column:e,lane:t,index:j})},y.id))})},ot=200;function rt(e,t=ot){const[a,s]=i.useState(e);return i.useEffect(()=>{if(e){s(!0);return}if(typeof window<"u"&&window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||t<=0){s(!1);return}const r=setTimeout(()=>s(!1),t);return()=>clearTimeout(r)},[e,t]),e||a}const it=({column:e,index:t})=>{const{columnGripProps:a,surface:s,color:o}=ne();if(!a)return null;const r=Be(o);return n.jsx("button",{type:"button",...a(e,t),className:N("shrink-0 cursor-grab touch-none rounded p-1 active:cursor-grabbing",s.muted,r.hover,r.focusRing),children:n.jsx(Ut,{className:"h-3.5 w-3.5","aria-hidden":"true"})})},tn=({onAdd:e,variant:t})=>{const{text:a,surface:s,color:o,size:r,columnCornerClass:l}=ne(),[u,m]=i.useState(!1),[h,d]=i.useState(""),p=Be(o),y=()=>{m(!1),d("")},j=()=>{const S=h.trim();S&&e(S),y()};return n.jsx("div",{"data-taskboard-add-column":!0,style:t==="column"?{width:Math.round(r.columnWidth*.75)}:void 0,className:N("flex shrink-0 flex-col",t==="column"&&N("border-2 border-dashed p-2",s.divider,l),t==="header"&&"px-2 py-1.5"),children:u?n.jsx("input",{autoFocus:!0,"aria-label":a("columnName"),placeholder:a("columnName"),value:h,onChange:S=>d(S.target.value),onKeyDown:S=>{S.key==="Enter"?(S.preventDefault(),j()):S.key==="Escape"&&(S.preventDefault(),y())},onBlur:j,className:N("w-full rounded-md border bg-transparent px-2 py-1.5 text-sm outline-none",s.divider,s.heading,p.focusRing)}):n.jsxs("button",{type:"button",onClick:()=>m(!0),className:N("flex items-center justify-center gap-1 rounded-md py-1.5 text-sm",s.muted,p.hover,p.focusRing),children:[n.jsx(ct,{className:"h-3.5 w-3.5","aria-hidden":"true"}),a("addColumn")]})})},ma=({drag:e,column:t,cards:a,count:s})=>{const{color:o,surface:r,size:l,cardSurface:u,columnCornerClass:m,renderCard:h}=ne();if(!e||e.keyboard||!t||typeof document>"u")return null;const d=t.color??o;return ut.createPortal(n.jsxs("div",{"data-taskboard-column-clone":!0,"aria-hidden":"true",className:N("pointer-events-none fixed top-0 left-0 z-[1000] flex rotate-1 flex-col overflow-hidden border-t-[3px] bg-neutral-100 shadow-2xl motion-reduce:rotate-0 dark:bg-neutral-800",m,mt(d).edge,Kt(d).clone),style:{width:e.width||void 0,height:e.height||void 0,transform:`translate3d(${e.x-e.grabOffset.x}px, ${e.y-e.grabOffset.y}px, 0)`},children:[n.jsxs("div",{className:"flex items-center gap-2 px-3 pt-3 pb-2",children:[n.jsx(Ut,{className:N("h-3.5 w-3.5 shrink-0",r.muted),"aria-hidden":"true"}),n.jsx("span",{className:N("truncate text-sm font-semibold",r.heading),children:t.title}),n.jsx("span",{className:N("text-xs font-semibold tabular-nums",r.muted),children:s})]}),!t.collapsed&&n.jsx("div",{className:N("flex min-h-0 flex-col px-2 pb-2",l.gap),children:a.map(p=>n.jsx("div",{className:N("rounded-lg",l.cardPad,p.tone?N("shadow-sm ring-1",Vt(p.tone).solid):u),children:h?h(p,{dragging:!1,selected:!1,pending:!1}):n.jsx(Wt,{card:p})},p.id))})]}),document.body)},Et=e=>({title:e.title,color:e.color,wip:e.wipLimit===void 0?"":String(e.wipLimit),max:e.maxItems===void 0?"":String(e.maxItems),locked:!!e.locked,accepts:e.accepts??[]});function pa(e,t){const{wipLimit:a,maxItems:s,locked:o,accepts:r,color:l,...u}=e,m={...u,title:t.title.trim()};return t.color&&(m.color=t.color),t.wip.trim()!==""&&(m.wipLimit=Number(t.wip)),t.max.trim()!==""&&(m.maxItems=Number(t.max)),t.locked&&(m.locked=!0),t.accepts.length&&(m.accepts=t.accepts),m}const Ue=e=>e.trim()===""||Number.isInteger(Number(e))&&Number(e)>=1,lt=({column:e})=>{const{onEditColumn:t,allColumns:a,text:s,surface:o,color:r}=ne(),[l,u]=i.useState(!1),[m,h]=i.useState(()=>Et(e)),d=i.useId();if(!t)return null;const p=Be(r),y=m.title.trim()!==""&&Ue(m.wip)&&Ue(m.max),j=(a??[]).filter(w=>w.id!==e.id),S=()=>{y&&(t(pa(e,m)),u(!1))};return n.jsx(mn,{visible:l,onOpenChange:w=>{w&&h(Et(e)),u(w)},placement:"bottom",maxWidth:300,trigger:n.jsx("button",{type:"button","aria-label":s("editColumn",{name:e.title}),className:N("shrink-0 rounded p-1",o.muted,p.hover,p.focusRing),children:n.jsx(fn,{className:"h-3.5 w-3.5","aria-hidden":"true"})}),children:n.jsxs("form",{className:"flex w-64 flex-col gap-3",onSubmit:w=>{w.preventDefault(),S()},children:[n.jsx(Ve,{size:"sm","aria-label":s("columnName"),placeholder:s("columnName"),value:m.title,onChange:w=>h({...m,title:w.target.value}),onKeyDown:w=>{w.key==="Enter"&&(w.preventDefault(),S())}}),n.jsxs("div",{className:"flex flex-col gap-1.5",children:[n.jsx("span",{className:N("text-xs font-semibold",o.muted),children:s("columnColor")}),n.jsx(Gt,{selectable:!0,size:"sm",defaultExpanded:!0,value:m.color,onSelect:w=>h({...m,color:w})})]}),n.jsxs("div",{className:"flex flex-col gap-1",children:[n.jsx("label",{htmlFor:`${d}-wip`,className:N("text-xs font-semibold",o.muted),children:s("wipLimit")}),n.jsx(Ve,{id:`${d}-wip`,size:"sm",type:"number",min:1,inputMode:"numeric",placeholder:s("wipLimitHint"),value:m.wip,onChange:w=>h({...m,wip:w.target.value}),"aria-invalid":!Ue(m.wip)||void 0})]}),n.jsxs("div",{className:"flex flex-col gap-1",children:[n.jsx("label",{htmlFor:`${d}-max`,className:N("text-xs font-semibold",o.muted),children:s("maxItems")}),n.jsx(Ve,{id:`${d}-max`,size:"sm",type:"number",min:1,inputMode:"numeric",placeholder:s("maxItemsHint"),value:m.max,onChange:w=>h({...m,max:w.target.value}),"aria-invalid":!Ue(m.max)||void 0})]}),n.jsx(pn,{size:"sm",label:s("lockColumn"),description:s("lockColumnHint"),checked:m.locked,onChange:w=>h({...m,locked:w.target.checked})}),j.length>0&&n.jsxs("fieldset",{className:"flex flex-col gap-1.5",children:[n.jsx("legend",{className:N("mb-1 text-xs font-semibold",o.muted),children:s("acceptsFrom")}),j.map(w=>n.jsx(hn,{size:"sm",label:w.title,checked:m.accepts.includes(w.id),onChange:C=>h({...m,accepts:C.target.checked?[...m.accepts,w.id]:m.accepts.filter(k=>k!==w.id)})},w.id)),n.jsx("span",{className:N("text-[11px]",o.muted),children:s("acceptsAny")})]}),n.jsxs("div",{className:"flex justify-end gap-2 pt-1",children:[n.jsx(ge,{type:"button",size:"sm",variant:"soft",color:"slate",onClick:()=>u(!1),children:s("cancel")}),n.jsx(ge,{type:"submit",size:"sm",color:r,disabled:!y,children:s("save")})]})]})})},dt=44;function nn(e,t){return t===void 0?String(e):`${e} / ${t}`}const ha=({column:e,cards:t,count:a,index:s=0,onToggle:o})=>{const{surface:r,text:l,color:u,columnWidth:m,wellSurface:h,columnCornerClass:d,onAddCard:p,canAddCard:y,draggingColumnId:j,boardMaxItems:S,dropTarget:w}=ne(),C=!!(w&&!w.valid&&w.bucket===X(e.id,null)),k=Ge(e,S),x=k!==void 0&&a>=k,g=y?.({column:e.id,lane:null})!==!1,B=j===e.id,D=e.color??u,_=mt(D),P=Qt(a,e.wipLimit),O=rt(!e.collapsed),F=rt(!!e.collapsed),V=Be(D),c=o&&n.jsx("button",{type:"button",onClick:o,"aria-expanded":!e.collapsed,"aria-label":l(e.collapsed?"expand":"collapse",{name:e.title}),className:N("rounded p-1",r.muted,V.hover,V.focusRing),children:n.jsx(qt,{className:N("h-3 w-3 transition-transform motion-reduce:transition-none",!e.collapsed&&"rotate-90")})}),b=n.jsx("span",{"data-column-count":!0,title:e.wipLimit!==void 0?l("wip",{count:a,limit:e.wipLimit}):void 0,className:N("select-none text-xs font-semibold tabular-nums",P==="full"||P==="over"||x?_.wipFull:r.muted),children:nn(a,e.wipLimit??k)});return n.jsxs("div",{"data-column-id":e.id,"data-column-target":e.id,"data-flip-key":e.id,"data-column-dragging":B||void 0,"data-full":x||void 0,"data-drop":C?"invalid":void 0,"data-collapsed":e.collapsed?"true":void 0,"data-wip":P,"data-drop-zone":e.collapsed?void 0:!0,style:{width:e.collapsed?dt:m},className:N("relative flex min-h-40 shrink-0 flex-col overflow-hidden border-t-[3px]",d,"transition-[width] duration-200 ease-out motion-reduce:transition-none",_.edge,C?Yt:h,B&&"opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30"),children:[F&&n.jsxs("div",{"aria-hidden":!e.collapsed,inert:!e.collapsed,className:N("absolute inset-y-0 left-0 flex flex-col items-center gap-3 py-3 transition-opacity duration-200 motion-reduce:transition-none",e.collapsed?"opacity-100":"pointer-events-none opacity-0"),style:{width:dt},children:[n.jsx(it,{column:e,index:s}),n.jsx(lt,{column:e}),c,b,n.jsx("span",{className:N("text-sm font-semibold whitespace-nowrap [writing-mode:vertical-rl] select-none",r.heading),children:e.title})]}),O&&n.jsxs("div",{"data-column-body":!0,"aria-hidden":e.collapsed||void 0,inert:e.collapsed,style:{width:m},className:N("flex min-h-0 flex-1 flex-col transition-opacity duration-200 motion-reduce:transition-none",e.collapsed&&"opacity-0"),children:[n.jsxs("div",{className:"flex items-center gap-2 px-3 pt-3 pb-2",children:[n.jsx(it,{column:e,index:s}),n.jsx("span",{className:N("truncate text-sm font-semibold select-none",r.heading),children:e.title}),b,n.jsx("span",{className:"flex-1"}),n.jsx(lt,{column:e}),c]}),n.jsx(pt,{"data-taskboard-scroll":!0,variant:"hover",horizontal:!1,tabIndex:-1,className:"min-h-0 flex-1",contentClassName:"px-2 pt-1 pb-2",children:n.jsx(en,{column:e.id,lane:null,cards:t,label:`${e.title}, ${l("cardCount",{count:t.length})}`})}),p&&g&&!x&&n.jsxs("button",{type:"button",onClick:()=>p({column:e.id,lane:null}),className:N("mx-2 mb-2 flex items-center justify-center gap-1 rounded-lg py-1.5 text-sm",r.muted,V.hover,V.focusRing),children:[n.jsx(ct,{className:"h-3.5 w-3.5","aria-hidden":"true"}),l("addCard")]})]})]})},fa=5,xe=e=>e!=null&&e!==!1,ga=({icon:e,title:t,subtitle:a,summary:s,actions:o,people:r,variant:l})=>{const{surface:u,text:m}=ne();return n.jsxs("div",{"data-taskboard-header":!0,className:N("flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b px-4 py-3",u.divider),children:[xe(e)&&n.jsx("div",{className:N("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",gn(l,"neutral"),u.body),children:e}),(xe(t)||xe(a))&&n.jsxs("div",{className:"min-w-0",children:[xe(t)&&n.jsx("div",{className:N("truncate text-lg font-bold leading-tight",u.heading),children:t}),xe(a)&&n.jsx("div",{className:N("truncate text-xs",u.muted),children:a})]}),n.jsx("div",{className:"flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2",children:xe(s)&&s}),r&&r.length>0&&n.jsx(bn,{"data-taskboard-people":!0,role:"group","aria-label":m("online",{count:r.length}),className:"shrink-0",size:"sm",maxVisible:fa,items:r.map(h=>({name:h.name,image:h.avatarUrl,tone:h.color??Ke(h.id)}))}),xe(o)&&n.jsx("div",{className:"flex items-center gap-1",children:o})]})},ba=220,ka=180,xa=({cards:e,columns:t,lanes:a,buckets:s,onToggleLane:o,onToggleColumn:r,onAddColumn:l})=>{const{surface:u,text:m,color:h,columnWidth:d,stickySurface:p,draggingColumnId:y,boardMaxItems:j}=ne(),S=new Set(t.filter(g=>Jn(e,g,j)).map(g=>g.id)),w=Be(h),C=[`${ba}px`,...t.map(g=>{const B=g.collapsed?dt:d;return typeof B=="number"?`${B}px`:B}),...l?[`${ka}px`]:[]].join(" "),k=N("border-b border-r",u.divider),x=(g,B,D)=>n.jsx("button",{type:"button",onClick:D,"aria-expanded":!g,"aria-label":m(g?"expand":"collapse",{name:B}),className:N("rounded p-1",u.muted,w.hover,w.focusRing),children:n.jsx(qt,{className:N("h-3 w-3 transition-transform motion-reduce:transition-none",!g&&"rotate-90")})});return n.jsx(pt,{"data-taskboard-scroll":!0,variant:"hover",tabIndex:-1,className:"min-h-0 flex-1",children:n.jsxs("div",{"data-lane-grid":!0,className:"grid w-max transition-[grid-template-columns] duration-200 ease-out motion-reduce:transition-none",style:{gridTemplateColumns:C},children:[n.jsx("div",{className:N("sticky top-0 left-0 z-30",p,k)}),t.map((g,B)=>{const D=Le(e,g.id),_=Qt(D,g.wipLimit);return n.jsxs("div",{"data-lane-column-header":g.id,"data-column-target":g.id,"data-flip-key":g.id,"data-column-dragging":y===g.id||void 0,"data-wip":_,className:N("sticky top-0 z-20 flex items-center gap-2 overflow-hidden px-3 py-2.5",p,k,y===g.id&&"opacity-50 outline-2 -outline-offset-2 outline-dashed outline-black/25 dark:outline-white/30"),children:[n.jsx(it,{column:g,index:B}),!g.collapsed&&n.jsx("span",{className:N("truncate text-xs font-semibold uppercase tracking-wider select-none",u.body),children:g.title}),n.jsx("span",{className:"flex-1"}),n.jsx("span",{"data-column-count":!0,className:N("select-none rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",_==="full"||_==="over"||S.has(g.id)?mt(g.color??h).wipFull:u.muted),children:nn(D,g.wipLimit??Ge(g,j))}),n.jsx(lt,{column:g}),r&&x(g.collapsed,g.title,()=>r(g.id))]},g.id)}),l&&n.jsx("div",{className:N("sticky top-0 z-20",p,k),children:n.jsx(tn,{variant:"header",onAdd:l})}),a.map(g=>n.jsx(ya,{lane:g,count:qn(e,g.id,a),columns:t,buckets:s,cellBorder:k,trailingCell:!!l,fullColumns:S,caret:o&&x(g.collapsed,g.title,()=>o(g.id))},g.id))]})})},ya=({lane:e,count:t,columns:a,buckets:s,cellBorder:o,caret:r,trailingCell:l,fullColumns:u})=>{const{surface:m,text:h,color:d,stickySurface:p,onAddCard:y,canAddCard:j,dropTarget:S}=ne(),w=S&&!S.valid?S.bucket:null,C=Be(d),k=!e.collapsed,x=rt(k);return n.jsxs("div",{"data-lane-id":e.id,"data-collapsed":e.collapsed?"true":void 0,className:"contents",children:[n.jsxs("div",{className:N("sticky left-0 z-10 flex items-start gap-2 px-3 py-3",p,o),children:[r,n.jsx("span",{className:N("min-w-0 flex-1 truncate pt-0.5 text-sm font-semibold",m.heading),children:e.title}),n.jsx("span",{"data-lane-count":!0,className:N("rounded-full bg-black/5 px-1.5 text-[11px] font-semibold tabular-nums dark:bg-white/10",m.muted),children:t})]}),a.map(g=>n.jsx("div",{"data-flip-key":`${g.id}:${e.id}`,"data-drop-zone":k&&!g.collapsed?!0:void 0,"data-drop":w===X(g.id,e.id)?"invalid":void 0,className:N(o,w===X(g.id,e.id)&&Yt),children:n.jsx("div",{"data-lane-cell":!0,className:N("grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",k?"grid-rows-[1fr]":"grid-rows-[0fr]"),children:n.jsx("div",{className:"min-h-0 overflow-hidden",inert:!k,"aria-hidden":!k||void 0,children:x&&!g.collapsed&&n.jsxs("div",{className:"flex flex-col gap-1 p-2",children:[n.jsx(en,{column:g.id,lane:e.id,cards:s.get(X(g.id,e.id))??[],label:`${g.title}, ${e.title}`}),y&&!u.has(g.id)&&j?.({column:g.id,lane:e.id})!==!1&&n.jsx("button",{type:"button",onClick:()=>y({column:g.id,lane:e.id}),"aria-label":`${h("addCard")} — ${g.title}, ${e.title}`,className:N("flex items-center justify-center rounded-md py-1 opacity-60 hover:opacity-100 focus-visible:opacity-100",m.muted,C.hover,C.focusRing),children:n.jsx(ct,{className:"h-3.5 w-3.5","aria-hidden":"true"})})]})})})},g.id)),l&&n.jsx("div",{"aria-hidden":"true",className:o})]})},va="bg-white shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",Ca=({drag:e,card:t})=>{const{renderCard:a,size:s,color:o}=ne();return!e||e.keyboard||!t||typeof document>"u"?null:ut.createPortal(n.jsx("div",{"data-taskboard-clone":!0,"aria-hidden":"true",className:N("pointer-events-none fixed top-0 left-0 z-[1000] rotate-1 rounded-lg motion-reduce:rotate-0",t.tone?N("shadow-2xl ring-1",Vt(t.tone).solid):va,Kt(o).clone,s.cardPad,!e.valid&&e.to&&"cursor-not-allowed opacity-80"),style:{width:e.width||void 0,transform:`translate3d(${e.x-e.grabOffset.x}px, ${e.y-e.grabOffset.y}px, 0)`},children:a?a(t,{dragging:!0,selected:!1,pending:!1}):n.jsx(Wt,{card:t})}),document.body)},wa=4,Sa=250,ja=8,Ne=48,Ta=16,At=(e,t)=>e.column===t.column&&e.lane===t.lane&&e.index===t.index;function Na(e){const t=e?.closest("[data-bucket]")??e?.closest("[data-drop-zone]")?.querySelector("[data-bucket]");if(!t)return null;const a=t.getAttribute("data-bucket-column"),s=t.getAttribute("data-bucket-lane");return a===null?null:{column:a,lane:s||null,el:t}}function Ba(e){const[t,a]=i.useState(null),[s,o]=i.useState(null),r=i.useRef(e);r.current=e;const l=i.useRef(null),u=i.useRef(null),m=i.useRef(!1),h=i.useRef({x:0,y:0}),d=i.useRef(null),p=i.useRef(null),y=i.useRef(null),j=i.useCallback(c=>{l.current=c,a(c)},[]),S=()=>{const c=r.current;return{cards:c.cards,columns:c.columns,lanes:c.lanes,heldBy:c.heldBy,selfId:c.selfId,maxItems:c.maxItems}},w=i.useCallback((c,b)=>{const f=l.current;if(!f)return;const T=Na(document.elementFromPoint?.(c,b)??null);let M=null,I=!1;if(T){const L=[...T.el.querySelectorAll("[data-card-id]")].map(K=>{const G=K.getBoundingClientRect();return{id:K.getAttribute("data-card-id"),top:G.top,height:G.height}}),z=f.to&&f.to.column===T.column&&f.to.lane===T.lane?f.to.index:null,U=Zn(L,b,f.cardId,z);M={column:T.column,lane:T.lane,index:U},I=Zt(S(),{cardId:f.cardId,from:f.from,to:M}).ok}const A=!f.to!=!M||f.to&&M&&!At(f.to,M)||f.valid!==I;j({...f,x:c,y:b,to:M,valid:I}),A&&r.current.onDragTarget?.(f.cardId,I?M:null)},[j]),C=i.useCallback(()=>{if(d.current=null,!l.current)return;const{x:c,y:b}=h.current;let f=!1;for(const T of document.querySelectorAll("[data-taskboard-scroll]")){const M=T.matches('[data-slot="scrollarea"]')?T.querySelector(':scope > [data-slot="scrollarea-viewport"]'):T;if(!M)continue;const I=M.getBoundingClientRect();if(c<I.left||c>I.right||b<I.top||b>I.bottom)continue;const A=U=>Math.ceil((Ne-U)/Ne*Ta);let L=0,z=0;c-I.left<Ne?L=-A(c-I.left):I.right-c<Ne&&(L=A(I.right-c)),b-I.top<Ne?z=-A(b-I.top):I.bottom-b<Ne&&(z=A(I.bottom-b)),L&&M.scrollWidth>M.clientWidth&&(M.scrollLeft+=L,f=!0),z&&M.scrollHeight>M.clientHeight&&(M.scrollTop+=z,f=!0)}f&&(w(c,b),d.current=requestAnimationFrame(C))},[w]),k=i.useCallback(()=>{const c=u.current;c?.timer&&clearTimeout(c.timer),u.current=null,d.current!==null&&cancelAnimationFrame(d.current),d.current=null,p.current?.(),p.current=null,y.current!==null&&(document.body.style.userSelect=y.current,y.current=null)},[]),x=i.useCallback(c=>{const b=l.current;k(),b&&(j(null),r.current.onDragEnd?.(b.cardId,!1))},[k,j]),g=i.useCallback(async()=>{const c=l.current;if(k(),!c)return!1;j(null),c.keyboard||(m.current=!0,setTimeout(()=>{m.current=!1},0));const b=r.current;if(!c.to||!c.valid||At(c.from,c.to))return b.onDragEnd?.(c.cardId,!1),!1;const f={cardId:c.cardId,from:c.from,to:c.to};if(!b.onBeforeMove)return b.onCommit(f),b.onDragEnd?.(c.cardId,!0),!0;o(f);let T=!1;try{T=await b.onBeforeMove(f)}catch{T=!1}return o(null),T&&r.current.onCommit(f),r.current.onDragEnd?.(c.cardId,T),T},[k,j]),B=i.useCallback((c,b)=>{const f=r.current;if(!f.editable||c.locked||l.current)return!1;const T=f.heldBy?.get(c.id);return T&&T!==f.selfId?!1:(j({cardId:c.id,from:b,to:b,valid:!0,x:0,y:0,grabOffset:{x:0,y:0},width:0,keyboard:!0}),f.onDragStart?.(c.id),f.onDragTarget?.(c.id,b),!0)},[j]),D=i.useCallback(c=>{const b=l.current;b&&(j({...b,to:c,valid:!0}),r.current.onDragTarget?.(b.cardId,c))},[j]),_=i.useCallback((c,b,f)=>{y.current===null&&(y.current=document.body.style.userSelect,document.body.style.userSelect="none"),window.getSelection?.()?.removeAllRanges(),j({cardId:c.cardId,from:c.from,to:c.from,valid:!0,x:b,y:f,grabOffset:c.grabOffset,width:c.width}),r.current.onDragStart?.(c.cardId),w(b,f)},[w,j]),P=i.useCallback(c=>{const b=u.current;if(!b)return;const{clientX:f,clientY:T}=c;if(h.current={x:f,y:T},!l.current){const M=Math.hypot(f-b.startX,T-b.startY);if(b.touch){if(!b.armed){M>ja&&k();return}_(b,f,T);return}if(M<wa)return;_(b,f,T);return}w(f,T),d.current===null&&typeof requestAnimationFrame=="function"&&(d.current=requestAnimationFrame(C))},[C,k,_,w]),O=i.useCallback((c,b,f)=>{const T=r.current;if(!T.editable||f.button!==0||c.locked)return;const M=T.heldBy?.get(c.id);if(M&&M!==T.selfId)return;k();const I=f.currentTarget.getBoundingClientRect(),A=f.pointerType==="touch",L={cardId:c.id,from:b,startX:f.clientX,startY:f.clientY,touch:A,armed:!1,timer:null,grabOffset:{x:f.clientX-I.left,y:f.clientY-I.top},width:I.width};A&&(L.timer=setTimeout(()=>{L.armed=!0,L.timer=null},Sa)),u.current=L,h.current={x:f.clientX,y:f.clientY};const z=()=>{l.current?g():k()},U=()=>x("pointercancel"),K=Q=>{Q.key==="Escape"&&l.current&&(Q.preventDefault(),x("escape"))},G=Q=>{l.current&&Q.preventDefault()};window.addEventListener("pointermove",P),window.addEventListener("pointerup",z),window.addEventListener("pointercancel",U),window.addEventListener("keydown",K),window.addEventListener("touchmove",G,{passive:!1}),p.current=()=>{window.removeEventListener("pointermove",P),window.removeEventListener("pointerup",z),window.removeEventListener("pointercancel",U),window.removeEventListener("keydown",K),window.removeEventListener("touchmove",G)}},[x,k,g,P]);i.useEffect(()=>{const c=l.current;c&&!e.cards.some(b=>b.id===c.cardId)&&x("removed")},[e.cards,x]),i.useEffect(()=>()=>k(),[k]);const F=i.useMemo(()=>{const{cards:c,columns:b,lanes:f}=e;return s?Pe(c,s,b,f):t?.to&&t.valid?Pe(c,{cardId:t.cardId,from:t.from,to:t.to},b,f):c},[e.cards,e.columns,e.lanes,t,s]),V=i.useCallback((c,b)=>({onPointerDown:f=>O(c,b,f),onClickCapture:f=>{m.current&&(m.current=!1,f.preventDefault(),f.stopPropagation())}}),[O]);return{drag:t,pending:s,previewCards:F,cardHandlers:V,cancel:x,finish:g,keyboardGrab:B,keyboardMove:D}}const Ma=e=>e?.closest("[dir]")?.getAttribute("dir")==="rtl";function Ia(e){const{rootRef:t,cards:a,viewCards:s,columns:o,lanes:r,text:l,drag:u}=e,[m,h]=i.useState(""),[d,p]=i.useState(null),[y,j]=i.useState([]),S=e.selectedIds??y,w=i.useRef(null),C=i.useRef(null),k=i.useMemo(()=>De(s,o,r),[s,o,r]),x=i.useMemo(()=>{for(const c of k.values())if(c.length)return c[0].id;return null},[k]),g=d&&s.some(c=>c.id===d)?d:x;i.useLayoutEffect(()=>{const c=C.current;c&&(C.current=null,t.current?.querySelector(`[data-card-id="${CSS.escape(c)}"]`)?.focus())});const B=i.useCallback(c=>h(c),[]),D=i.useCallback(c=>o.find(b=>b.id===c)?.title??c,[o]),_=i.useCallback((c,b)=>{const T=(De(a.filter(A=>A.id!==c),o,r).get(X(b.column,b.lane))?.length??0)+1,M={column:D(b.column),index:b.index+1,total:T},I=b.lane?r?.find(A=>A.id===b.lane)?.title:void 0;B(I?l("movedLane",{...M,lane:I}):l("moved",M))},[B,a,o,r,D,l]),P=i.useCallback(c=>{e.selectedIds===void 0&&j(c),e.onSelectionChange?.(c)},[e]),O=i.useCallback((c,b)=>{const f=t.current,T=c.closest("[data-bucket]");if(!f||!T)return;const M=[...T.querySelectorAll("[data-card-id]")],I=M.indexOf(c);let A;if(b==="up"||b==="down")A=M[I+(b==="down"?1:-1)];else{const z=b==="left"||b==="right"?"data-bucket-lane":"data-bucket-column",U=T.getAttribute(z)??"",K=[...f.querySelectorAll(`[data-bucket][${z}="${CSS.escape(U)}"]`)],G=b==="right"||b==="lane-down"?1:-1;for(let Q=K.indexOf(T)+G;Q>=0&&Q<K.length;Q+=G){const de=K[Q].querySelectorAll("[data-card-id]");if(de.length){A=de[Math.min(I,de.length-1)];break}}}A?.focus()},[t]),F=(c,b)=>{const f=Ma(b);switch(c.key){case"ArrowUp":return c.altKey?"lane-up":"up";case"ArrowDown":return c.altKey?"lane-down":"down";case"ArrowLeft":return f?"right":"left";case"ArrowRight":return f?"left":"right";default:return null}};return{cardProps:i.useCallback((c,b)=>({tabIndex:c.id===g?0:-1,onFocus:()=>p(c.id),onClick:f=>{const T=S;if(f.ctrlKey||f.metaKey){f.preventDefault(),w.current=c.id,P(T.includes(c.id)?T.filter(M=>M!==c.id):[...T,c.id]);return}if(f.shiftKey&&w.current){f.preventDefault();const M=k.get(X(b.column,b.lane))??[],I=M.findIndex(L=>L.id===w.current),A=M.findIndex(L=>L.id===c.id);if(I!==-1&&A!==-1){const L=M.slice(Math.min(I,A),Math.max(I,A)+1).map(z=>z.id);P([...T.filter(z=>!L.includes(z)),...L]);return}}w.current=c.id,P([c.id])},onKeyDown:f=>{const T=u?.keyboard&&u.cardId===c.id,M=f.currentTarget;if(T){const A=F(f,M);if(A){f.preventDefault();const L=ea({cards:a,columns:o,lanes:r,heldBy:e.heldBy,selfId:e.selfId,maxItems:e.maxItems},u.to??u.from,c.id,A);L&&(e.keyboardMove(L),C.current=c.id,_(c.id,L))}else if(f.key===" "||f.key==="Spacebar"){f.preventDefault();const L=u.to??u.from;C.current=c.id,B(l("dropped",{title:c.title,column:D(L.column)})),e.finish().then(z=>{!z&&(L.column!==u.from.column||L.lane!==u.from.lane||L.index!==u.from.index)&&B(l("cancelled"))})}else f.key==="Escape"?(f.preventDefault(),C.current=c.id,e.cancel("escape"),B(l("cancelled"))):f.key==="Tab"?(e.cancel("blur"),B(l("cancelled"))):f.key==="Enter"&&f.preventDefault();return}if(f.key===" "||f.key==="Spacebar"){f.preventDefault(),e.keyboardGrab(c,b)&&(C.current=c.id,B(l("grabbed",{title:c.title})));return}if(f.key==="F10"&&f.shiftKey||f.key==="ContextMenu"){if(!e.onCardContextMenu)return;f.preventDefault();const A=M.getBoundingClientRect();e.onCardContextMenu({card:c,column:b.column,lane:b.lane,index:b.index,x:A.left+A.width/2,y:A.top+A.height/2,event:f});return}const I=F(f,M);I&&(f.preventDefault(),O(M,I))}}),[g,S,P,k,u,a,o,r,e,_,B,l,D,O]),message:m,selection:S,announce:B}}const Ra=4,Lt=e=>e?.closest("[dir]")?.getAttribute("dir")==="rtl";function Ea(e){const[t,a]=i.useState(null),s=i.useRef(e);s.current=e;const o=i.useRef(null),r=i.useRef(null),l=i.useRef(null),u=i.useRef(null),m=i.useCallback(C=>{o.current=C,a(C)},[]),h=i.useCallback(()=>{r.current?.(),r.current=null,l.current!==null&&(document.body.style.userSelect=l.current,l.current=null)},[]),d=i.useCallback(()=>{h(),m(null)},[h,m]),p=i.useCallback(()=>{const C=o.current;return h(),m(null),!C||C.to===C.from?!1:(s.current.onCommit(Rt(s.current.columns,C.id,C.to)),!0)},[h,m]);i.useLayoutEffect(()=>{const C=u.current;C&&(u.current=null,e.rootRef.current?.querySelector(`[data-column-grip="${CSS.escape(C)}"]`)?.focus())}),i.useEffect(()=>()=>h(),[h]);const y=i.useCallback((C,k,x)=>{if(!s.current.enabled||x.button!==0)return;x.preventDefault(),h();const B=(x.currentTarget.closest("[data-column-target]")??x.currentTarget).getBoundingClientRect(),D={x:x.clientX,y:x.clientY},_={x:x.clientX-B.left,y:x.clientY-B.top};let P=x.clientX;const O=c=>{const{clientX:b,clientY:f}=c;let T=o.current;if(!T){if(Math.hypot(b-D.x,f-D.y)<Ra)return;l.current===null&&(l.current=document.body.style.userSelect,document.body.style.userSelect="none"),T={id:C.id,from:k,to:k,x:b,y:f,grabOffset:_,width:B.width,height:B.height}}const M=Math.sign(b-P);P=b;const I=s.current.rootRef.current,A=I?[...I.querySelectorAll("[data-column-target]")].map(z=>{const U=z.getBoundingClientRect();return{id:z.getAttribute("data-column-target"),left:U.left,width:U.width}}):[],L=ca(A,b,T.id,T.to,M,Lt(I));m({...T,x:b,y:f,to:L})},F=()=>{o.current?p():h()},V=c=>{c.key==="Escape"&&o.current&&(c.preventDefault(),d())};window.addEventListener("pointermove",O),window.addEventListener("pointerup",F),window.addEventListener("pointercancel",d),window.addEventListener("keydown",V),r.current=()=>{window.removeEventListener("pointermove",O),window.removeEventListener("pointerup",F),window.removeEventListener("pointercancel",d),window.removeEventListener("keydown",V)}},[d,p,h,m]),j=i.useCallback((C,k,x)=>{const g=s.current;if(!g.enabled)return;const B=o.current,D=g.columns.length;if(!B||!B.keyboard||B.id!==C.id){(x.key===" "||x.key==="Enter")&&(x.preventDefault(),m({id:C.id,from:k,to:k,x:0,y:0,grabOffset:{x:0,y:0},width:0,height:0,keyboard:!0}),u.current=C.id,g.announce(g.text("columnGrabbed",{name:C.title})));return}if(x.key==="ArrowLeft"||x.key==="ArrowRight"){x.preventDefault();const _=x.key==="ArrowRight"!==Lt(x.currentTarget),P=Math.max(0,Math.min(D-1,B.to+(_?1:-1)));if(P===B.to)return;m({...B,to:P}),u.current=C.id,g.announce(g.text("columnMoved",{name:C.title,index:P+1,total:D}))}else x.key===" "||x.key==="Enter"?(x.preventDefault(),u.current=C.id,p()):(x.key==="Escape"||x.key==="Tab")&&(x.key==="Escape"&&x.preventDefault(),u.current=x.key==="Escape"?C.id:null,d(),g.announce(g.text("cancelled")))},[d,p,m]),S=i.useMemo(()=>t&&t.to!==t.from?Rt(e.columns,t.id,t.to):e.columns,[t,e.columns]),w=i.useCallback((C,k)=>({"data-column-grip":C.id,"aria-label":e.text("moveColumn",{name:C.title}),onPointerDown:x=>y(C,k,x),onKeyDown:x=>j(C,k,x)}),[e.text,y,j]);return{drag:t,previewColumns:S,gripProps:w}}function Aa(e,t){const a=i.useRef(new Map),s=i.useRef(t);i.useLayoutEffect(()=>{const o=e.current;if(!o)return;const r=s.current!==t;s.current=t;const l=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,u=new Map;for(const m of o.querySelectorAll("[data-flip-key]")){const h=m.getAttribute("data-flip-key"),d=m.offsetLeft;u.set(h,d);const p=a.current.get(h);!r||l||p===void 0||p===d||(m.style.transition="none",m.style.transform=`translateX(${p-d}px)`,requestAnimationFrame(()=>{m.style.transition=`transform ${ot}ms ease-out`,m.style.transform="",window.setTimeout(()=>{m.style.transform===""&&(m.style.transition="")},ot+50)}))}a.current=u})}const La=1e3;function Da(e,t){const[a,s]=i.useState(Mt),o=!!(e&&t),r=i.useRef(!1),l=i.useRef(t);l.current=t;const u=i.useRef({last:0,timer:null}),m=i.useCallback(k=>{if(!r.current)return;const x=Date.now();s(g=>oa(g,k,x))},[]),h=i.useCallback(k=>{e&&(Dt(e,k),m(k))},[e,m]),d=t?.id;i.useEffect(()=>{if(!e||!d)return;r.current=!0;const k=()=>{const O=l.current;O&&h({type:"presence",user:O,at:Date.now()})},x=new Set,g=e.subscribe(O=>{if(!r.current)return;const F=O;F?.type==="presence"&&typeof F.user?.id=="string"&&F.user.id!==d?x.has(F.user.id)||(x.add(F.user.id),k()):F?.type==="leave"&&typeof F.userId=="string"&&x.delete(F.userId),m(O)}),B=()=>Dt(e,{type:"leave",userId:d,at:Date.now()});k();const D=setInterval(k,ta),_=setInterval(()=>{r.current&&s(O=>ra(O,Date.now()))},La);window.addEventListener("pagehide",B);const P=u.current;return()=>{r.current=!1,clearInterval(D),clearInterval(_),P.timer&&clearTimeout(P.timer),window.removeEventListener("pagehide",B),B(),g(),s(Mt())}},[e,d,m,h]);const p=i.useCallback(k=>{d&&h({type:"grab",userId:d,cardId:k,at:Date.now()})},[h,d]),y=i.useCallback((k,x)=>{if(!d)return;const g=u.current,B=()=>{g.last=Date.now(),g.timer=null,h({type:"hover",userId:d,cardId:k,column:x.column,lane:x.lane,index:x.index,at:g.last})};g.timer&&clearTimeout(g.timer);const D=na-(Date.now()-g.last);D<=0?B():g.timer=setTimeout(B,D)},[h,d]),j=i.useCallback((k,x)=>{if(!d)return;const g=u.current;g.timer&&clearTimeout(g.timer),g.timer=null,h({type:"release",userId:d,cardId:k,dropped:x,at:Date.now()})},[h,d]),S=i.useMemo(()=>[...a.peers.values()].map(k=>k.user).filter(k=>k.id!==d),[a.peers,d]),w=i.useMemo(()=>{const k=new Map;for(const[x,g]of a.holds)k.set(x,g.userId);return k},[a.holds]),C=i.useCallback(k=>a.peers.get(k)?.user??{id:k,name:k},[a.peers]);return o?{presence:a,peers:S,heldBy:w,userById:C,grab:p,hover:y,release:j}:{presence:a,peers:[],heldBy:w,userById:C,grab:et,hover:et,release:et}}function et(){}function Dt(e,t){try{e.publish(t)}catch{}}const Pt=40,Pa=({rootRef:e,holds:t,selfId:a,cards:s,userById:o})=>{const[r,l]=i.useState([]),[u,m]=i.useState(0);return i.useLayoutEffect(()=>{const h=e.current;if(!h)return;const d=()=>m(p=>p+1);return h.addEventListener("scroll",d,!0),window.addEventListener("resize",d),()=>{h.removeEventListener("scroll",d,!0),window.removeEventListener("resize",d)}},[e]),i.useLayoutEffect(()=>{const h=e.current;if(!h)return;const d=[];for(const[p,y]of t){if(y.userId===a||!y.hover)continue;const j=X(y.hover.column,y.hover.lane),S=h.querySelector(`[data-bucket="${CSS.escape(j)}"]`);if(!S)continue;const w=[...S.querySelectorAll("[data-card-id]")].filter(B=>B.getAttribute("data-card-id")!==p),C=S.getBoundingClientRect(),k=w[y.hover.index],x=w[w.length-1],g=k?k.getBoundingClientRect().top-Pt/2:x?x.getBoundingClientRect().bottom+4:C.top;d.push({key:`${y.userId}:${p}`,peer:o(y.userId),bucket:j,title:s.find(B=>B.id===p)?.title??"",top:g,left:C.left,width:C.width})}l(d)},[e,t,a,s,o,u]),!r.length||typeof document>"u"?null:ut.createPortal(n.jsx(n.Fragment,{children:r.map(h=>{const d=kn(h.peer.color??Ke(h.peer.id));return n.jsxs("div",{"data-taskboard-ghost":!0,"data-peer-id":h.peer.id,"data-ghost-bucket":h.bucket,"aria-hidden":"true",className:N("pointer-events-none fixed z-[900] flex items-center rounded-lg border-2 border-dashed px-3 text-xs font-medium shadow-sm backdrop-blur-sm transition-transform duration-150 ease-out motion-reduce:transition-none",d.ghost),style:{top:0,left:0,width:h.width,height:Pt,transform:`translate3d(${h.left}px, ${h.top}px, 0)`},children:[n.jsx("span",{className:"truncate opacity-80",children:h.title}),n.jsx("span",{className:N("absolute -top-2.5 right-2 rounded px-1.5 py-0.5 text-[10px] leading-none",d.label),children:h.peer.name})]},h.key)})}),document.body)},Ot=[[72,96,64],[88,64],[64,104,72],[96,72,88,64],[72]],Oa=({columns:e,columnWidth:t,wellSurface:a,cornerClass:s})=>n.jsx("div",{"data-taskboard-skeleton":!0,"aria-hidden":"true",className:"flex min-h-0 flex-1 gap-3 overflow-hidden p-3",children:Array.from({length:Math.max(1,e)},(o,r)=>n.jsxs("div",{style:{width:t},className:N("flex shrink-0 flex-col gap-2 p-3",s,a),children:[n.jsx("div",{className:"mb-1 h-3.5 w-24 animate-pulse rounded bg-black/10 motion-reduce:animate-none dark:bg-white/10"}),Ot[r%Ot.length].map((l,u)=>n.jsx("div",{style:{height:l},className:"animate-pulse rounded-lg bg-black/[0.06] motion-reduce:animate-none dark:bg-white/[0.08]"},u))]},r))}),za={root:"kit.taskboard.root",loading:"kit.taskboard.loading",empty:"kit.taskboard.empty",error:"kit.taskboard.error",retry:"kit.taskboard.retry",addCard:"kit.taskboard.addCard",collapse:"kit.taskboard.collapse",expand:"kit.taskboard.expand",cardCount:"kit.taskboard.cardCount",wip:"kit.taskboard.wip",grabbed:"kit.taskboard.grabbed",moved:"kit.taskboard.moved",movedLane:"kit.taskboard.movedLane",dropped:"kit.taskboard.dropped",cancelled:"kit.taskboard.cancelled",held:"kit.taskboard.held",heldShort:"kit.taskboard.heldShort",notAllowed:"kit.taskboard.notAllowed",pending:"kit.taskboard.pending",online:"kit.taskboard.online",notes:"kit.taskboard.notes",checklist:"kit.taskboard.checklist",subtasks:"kit.taskboard.subtasks",due:"kit.taskboard.due",addColumn:"kit.taskboard.addColumn",columnName:"kit.taskboard.columnName",moveColumn:"kit.taskboard.moveColumn",columnGrabbed:"kit.taskboard.columnGrabbed",columnMoved:"kit.taskboard.columnMoved",editColumn:"kit.taskboard.editColumn",columnColor:"kit.taskboard.columnColor",wipLimit:"kit.taskboard.wipLimit",wipLimitHint:"kit.taskboard.wipLimitHint",lockColumn:"kit.taskboard.lockColumn",lockColumnHint:"kit.taskboard.lockColumnHint",acceptsFrom:"kit.taskboard.acceptsFrom",acceptsAny:"kit.taskboard.acceptsAny",save:"kit.taskboard.save",cancel:"kit.taskboard.cancel",maxItems:"kit.taskboard.maxItems",maxItemsHint:"kit.taskboard.maxItemsHint"},$a=(e,t)=>t?e.replace(/\{(\w+)\}/g,(a,s)=>s in t?String(t[s]):a):e;function _a(e){const t=xn();return i.useCallback((a,s)=>{const o=e?.[a];return o!==void 0?$a(o,s):t(za[a],s)},[t,e])}const Fa=2e3,Ha="bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10",Ua="bg-white/70 shadow-sm ring-1 ring-white/60 backdrop-blur-md dark:bg-white/10 dark:ring-white/10",Wa="bg-black/[0.03] dark:bg-white/[0.04]",Va="bg-white/25 dark:bg-white/5",Ka="bg-white dark:bg-neutral-900",Ga="bg-white/80 backdrop-blur-md dark:bg-neutral-900/70",zt=e=>{const{cards:t,columns:a,lanes:s,layout:o="columns",priorities:r,cardLayout:l="detailed",subtaskMaxVisible:u=3,renderCard:m,onCardsChange:h,onColumnsChange:d,onLanesChange:p,onBeforeMove:y,editable:j,editMode:S=!1,autoCollapseEmpty:w=!1,maxItems:C,onCardOpen:k,onCardContextMenu:x,onAddCard:g,canAddCard:B,selectedIds:D,onSelectionChange:_,transport:P,currentUser:O,icon:F,title:V,subtitle:c,summary:b,actions:f,loading:T,loaderType:M="skeleton",error:I,onRetry:A,emptyState:L,color:z="blue",size:U="md",columnWidth:K="auto",labels:G,columnCorner:Q="rounded-md",surfaceVariant:de}=e,se=vn(),q=_a(G),{locale:Oe}=Cn(),ye=wt[U]??wt.md,ce=typeof K=="string"?K.trim():K,ve=ce==="auto"||ce===""||typeof ce=="number"&&(!Number.isFinite(ce)||ce<=0)?ye.columnWidth:ce,Ce=se.translucent?Va:Wa,we=wn(Q),ke=i.useRef(null),ue=j??!!h,me=o==="lanes"&&!!s?.length,oe=me?s:void 0,ze=v=>h?.(Pe(t,v,a,oe),v),W=Da(P,O),J=O?.id,{drag:H,pending:pe,previewCards:re,cardHandlers:Se,cancel:je,finish:Me,keyboardGrab:$e,keyboardMove:R}=Ba({cards:t,columns:a,lanes:oe,editable:ue,heldBy:W.heldBy,selfId:J,maxItems:C,onBeforeMove:y,onCommit:ze,onDragStart:W.grab,onDragTarget:(v,E)=>E&&W.hover(v,E),onDragEnd:W.release}),[$,Ie]=i.useState(null);i.useEffect(()=>{if(!H||!J)return;const v=W.heldBy.get(H.cardId);if(!v||v===J)return;const E=W.userById(v);je("held"),Ie({cardId:H.cardId,text:q("heldShort",{name:E.name}),color:E.color??Ke(E.id)})},[W,H,J,je,q]),i.useEffect(()=>{if(!$)return;const v=setTimeout(()=>Ie(null),Fa);return()=>clearTimeout(v)},[$]);const Re=Ia({rootRef:ke,cards:t,viewCards:re,columns:a,lanes:oe,text:q,drag:H,keyboardGrab:$e,keyboardMove:R,finish:Me,cancel:je,heldBy:W.heldBy,selfId:J,maxItems:C,onCardContextMenu:x,selectedIds:D,onSelectionChange:_}),ft=i.useMemo(()=>new Set(Re.selection),[Re.selection]),Te=!!(S&&d),Z=Ea({rootRef:ke,columns:a,enabled:Te,text:q,announce:Re.announce,onCommit:v=>d?.(v)}),_e=Z.previewColumns;Aa(ke,_e.map(v=>v.id).join("|"));const gt=i.useCallback(v=>d?.(a.map(E=>E.id===v.id?v:E)),[a,d]),bt=v=>d?.([...a,{id:ua(v,a),title:v}]),kt=Re.cardProps,xt=i.useCallback(v=>{const E=W.heldBy.get(v);return E&&E!==J?W.userById(E):void 0},[W,J]),an=i.useMemo(()=>({text:q,surface:se,color:z,size:ye,columnWidth:ve,controlSize:U,cardLayout:l,priorities:new Map((r??[]).map(v=>[v.id,v])),locale:Oe,editable:ue,renderCard:m,onCardOpen:k,onCardContextMenu:x,onAddCard:g,canAddCard:B,cardSurface:se.translucent?Ua:Ha,wellSurface:Ce,columnCornerClass:we,columnGripProps:Te?Z.gripProps:void 0,draggingColumnId:Z.drag?.id??null,onEditColumn:Te?gt:void 0,allColumns:a,boardMaxItems:C,subtaskMaxVisible:u,stickySurface:se.translucent?Ga:Ka,cardState:v=>({held:xt(v.id),notice:$?.cardId===v.id?$.text:void 0,noticeColor:$?.cardId===v.id?$.color:void 0,dragging:H?.cardId===v.id&&!H.keyboard,grabbed:H?.cardId===v.id&&!!H.keyboard,selected:ft.has(v.id),pending:pe?.cardId===v.id}),cardProps:(v,E)=>({...ue?Se(v,E):{},...kt(v,E)}),dropTarget:H?.to&&!H.valid?{bucket:X(H.to.column,H.to.lane),index:H.to.index,valid:!1}:null}),[q,se,z,ye,ve,U,l,u,r,Oe,ue,m,k,x,g,Ce,we,Te,Z.gripProps,Z.drag,gt,a,C,ft,H,pe,Se,kt,xt,$]),yt=i.useMemo(()=>De(re,a,oe),[re,a,oe]),sn=H?t.find(v=>v.id===H.cardId):void 0,qe=w&&!me,[vt,on]=i.useState(()=>new Set),Ct=(v,E)=>on(Xe=>{if(Xe.has(v)===E)return Xe;const Qe=new Set(Xe);return E?Qe.add(v):Qe.delete(v),Qe}),Ye=d||qe?v=>{if(qe&&Le(t,v)===0){vt.has(v)?Ct(v,!1):(Ct(v,!0),a.some(E=>E.id===v&&E.collapsed)&&d?.(a.map(E=>E.id===v?{...E,collapsed:!1}:E)));return}d?.(a.map(E=>E.id===v?{...E,collapsed:!E.collapsed}:E))}:void 0,rn=qe?_e.map(v=>({...v,collapsed:vt.has(v.id)?!1:!!v.collapsed||Le(t,v.id)===0})):_e,ln=p&&s?v=>p(s.map(E=>E.id===v?{...E,collapsed:!E.collapsed}:E)):void 0,dn=T&&M==="skeleton",cn=[F,V,c,b,f].some(v=>v!=null&&v!==!1)||!!(P&&O);let Fe;return dn?Fe=n.jsx(Oa,{columns:a.length||4,columnWidth:ve,wellSurface:Ce,cornerClass:we}):I?Fe=n.jsxs("div",{role:"alert",className:"flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center",children:[n.jsx("p",{className:N("text-sm font-medium",se.body),children:I===!0?q("error"):I}),A&&n.jsx(ge,{size:"sm",variant:"outline",color:z,onClick:A,children:q("retry")})]}):Fe=n.jsxs("div",{className:"flex min-h-0 flex-1 flex-col",children:[t.length===0&&n.jsx("div",{"data-taskboard-empty":!0,className:N("px-4 pt-4 text-center text-sm",se.muted),children:L??q("empty")}),me?n.jsx(xa,{cards:re,columns:_e,onAddColumn:Te?bt:void 0,lanes:s,buckets:yt,onToggleLane:ln,onToggleColumn:Ye}):n.jsx(pt,{"data-taskboard-scroll":!0,variant:"hover",tabIndex:-1,className:"min-h-0 flex-1",contentClassName:"flex! h-full",children:n.jsxs("div",{"data-taskboard-columns":!0,className:"flex w-max items-stretch gap-3 p-3",children:[rn.map((v,E)=>n.jsx(ha,{column:v,index:E,cards:yt.get(X(v.id,null))??[],count:Le(re,v.id),onToggle:Ye&&(()=>Ye(v.id))},v.id)),Te&&n.jsx(tn,{variant:"column",onAdd:bt})]})})]}),n.jsxs(Sn.Provider,{value:an,children:[n.jsxs("div",{ref:ke,"data-taskboard":!0,role:"application","aria-roledescription":"task board","aria-busy":T?!0:void 0,"aria-label":q("root"),className:"flex h-full min-h-0 flex-col",children:[n.jsx("div",{"data-taskboard-live":!0,"aria-live":"polite","aria-atomic":"true",className:"sr-only",children:Re.message}),cn&&n.jsx(ga,{icon:F,title:V,subtitle:c,summary:b,actions:f,people:P&&O?[O,...W.peers]:void 0,variant:de}),Fe]}),n.jsx(Ca,{drag:H,card:sn}),n.jsx(ma,{drag:Z.drag,column:a.find(v=>v.id===Z.drag?.id),count:Z.drag?Le(t,Z.drag.id):0,cards:Z.drag?t.filter(v=>v.column===Z.drag.id):[]}),P&&n.jsx(Pa,{rootRef:ke,holds:W.presence.holds,selfId:J,cards:t,userById:W.userById})]})},ae=e=>{const{variant:t="elevated",tone:a,corner:s="rounded-md",padding:o="none",glassOpacity:r,vibrancy:l,specularMode:u,raisedSurface:m=!1,loading:h,loaderType:d="skeleton",className:p,height:y}=e;return t==="plain"?n.jsx("div",{className:N("flex min-h-0 flex-col",p),style:{height:y},children:n.jsx(zt,{...e,surfaceVariant:"elevated"})}):n.jsx(yn,{variant:t,tone:a,corner:s,padding:o,glassOpacity:r,vibrancy:l,specularMode:u,raisedSurface:m,loading:!!h&&d!=="skeleton",loaderType:d,flexBody:!0,scrollable:!1,className:p,style:{height:y},children:n.jsx(zt,{...e,surfaceVariant:t})})},tt=be.roadmap(),$t=be.fieldOps(),qa={activation:"sky",billing:"amber",enterprise:"violet",analytics:"teal",research:"fuchsia",checkout:"rose",mobile:"indigo",platform:"slate",quote:"sky",retail:"amber",access:"violet","cold-chain":"cyan",security:"rose",handoff:"teal",crew:"lime",safety:"red",baggage:"orange"};function Ya(e){const t=e.tags?.[0],a=typeof t=="string"?t:t?.label;return a?qa[a]??"emerald":void 0}const Xa=[{label:"No limit",value:"none"},...[3,4,5,6].map(e=>({label:String(e),value:String(e)}))],Qa=[{label:"Auto (from size)",value:"auto"},{label:"240 px",value:"240"},{label:"320 px",value:"320"},{label:"400 px",value:"400"}],Ja=[1,2,3,4,5,6].map(e=>({label:String(e),value:String(e)})),Za=new Set(["blocked","closed"]);function es(e,t,a){return e.map(s=>({...s,wipLimit:t&&(s.id==="building"||s.id==="onsite")?s.id==="building"?4:5:void 0,accepts:a&&s.id==="ready"?["discovery"]:void 0,locked:a&&(s.id==="blocked"||s.id==="closed")?!0:void 0}))}const ts=()=>{const[e,t]=_n(),[a,s]=i.useState("columns"),[o,r]=i.useState("detailed"),[l,u]=i.useState("none"),[m,h]=i.useState("elevated"),[d,p]=i.useState("rounded-md"),[y,j]=i.useState(!1),[S,w]=i.useState("rounded-md"),[C,k]=i.useState(!1),[x,g]=i.useState(!1),[B,D]=i.useState(!1),[_,P]=i.useState("none"),[O,F]=i.useState("none"),[V,c]=i.useState("blue"),[b,f]=i.useState("md"),[T,M]=i.useState("auto"),[I,A]=i.useState("3"),[L,z]=i.useState(!0),[U,K]=i.useState(!0),[G,Q]=i.useState(!1),[de,se]=i.useState(!1),[q,Oe]=i.useState(!1),[ye,ce]=i.useState("skeleton"),[ve,Ce]=i.useState(!1),[we,ke]=i.useState(!1),ue=a==="lanes"?$t:tt,[me,oe]=i.useState(tt.cards),[ze,W]=i.useState(tt.columns),[J,H]=i.useState($t.lanes),pe=i.useRef(da()).current,[re,Se]=i.useState(0);i.useEffect(()=>{oe(ue.cards),W(ue.columns),r(a==="lanes"?"compact":"detailed"),pe.clear(),Se(0)},[a]);const je=i.useMemo(()=>es(ze,U,G),[ze,U,G]),Me=()=>{const R=pe.undo(me,je,a==="lanes"?J:void 0);R&&(oe(R),Se(pe.size),t("undo"))},$e=i.useRef(Me);return $e.current=Me,i.useEffect(()=>{const R=$=>{if(($.ctrlKey||$.metaKey)&&!$.shiftKey&&$.key.toLowerCase()==="z"){if($.target?.closest("input, textarea, [contenteditable]"))return;$.preventDefault(),$e.current()}};return window.addEventListener("keydown",R),()=>window.removeEventListener("keydown",R)},[]),n.jsx(zn,{controls:n.jsxs("div",{className:"space-y-3",children:[n.jsx($n,{groups:[{id:"layout",title:"Layout",controls:n.jsxs(n.Fragment,{children:[n.jsx(Je,{label:"Layout",options:Hn,value:a,onChange:R=>s(R)}),n.jsx(Je,{label:"Cards",options:Un,value:o,onChange:R=>r(R)}),n.jsx(he,{label:"Size",options:Wn,value:b,onChange:R=>f(R)}),n.jsx(he,{label:"Subtask dots",options:Ja,value:I,onChange:A}),n.jsx(he,{label:"Column width",options:Qa,value:T,onChange:M})]})},{id:"surface",title:"Surface",controls:n.jsxs(n.Fragment,{children:[n.jsx(On,{label:"Surface tone",value:l,onChange:u}),n.jsx(he,{label:"Variant",options:Vn,value:m,onChange:R=>h(R)}),n.jsx(he,{label:"Corner",options:jt,value:d,onChange:R=>p(R)}),n.jsx(he,{label:"Column corner",options:jt,value:S,onChange:R=>w(R)}),n.jsx(he,{label:"Padding",options:Kn,value:O,onChange:R=>F(R)}),n.jsx(Ze,{label:"Accent",children:n.jsx(Gt,{selectable:!0,size:"sm",value:V,onSelect:c,defaultExpanded:!0})}),n.jsx(ee,{label:"Raised surface",checked:y,onChange:j})]})},{id:"rules",title:"Rules",controls:n.jsx(Ze,{label:"Rules",children:n.jsxs("div",{className:"space-y-1.5",children:[n.jsx(ee,{label:"Editable",checked:L,onChange:z}),n.jsx(ee,{label:"Card tones",checked:C,onChange:k}),n.jsx(ee,{label:"Edit mode (columns)",checked:x,onChange:g}),n.jsx(ee,{label:"Auto-collapse empty",checked:B,onChange:D}),n.jsx(ee,{label:"WIP limits",checked:U,onChange:K}),n.jsx(ee,{label:"Transition rules + locks",checked:G,onChange:Q}),n.jsx(ee,{label:"No add in Blocked / Closed",checked:de,onChange:se}),n.jsx(he,{label:"Max items per column",options:Xa,value:_,onChange:P})]})})},{id:"states",title:"States",controls:n.jsxs(n.Fragment,{children:[n.jsx(Ze,{label:"State",children:n.jsxs("div",{className:"space-y-1.5",children:[n.jsx(ee,{label:"Loading",checked:q,onChange:Oe}),n.jsx(ee,{label:"Error",checked:ve,onChange:Ce}),n.jsx(ee,{label:"Empty",checked:we,onChange:ke})]})}),q&&n.jsx(Je,{label:"Loader type",options:Gn,value:ye,onChange:R=>ce(R)})]})}]}),n.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Drag a card, or focus one and press ",n.jsx("strong",{children:"Space"})," to pick it up, the ",n.jsx("strong",{children:"arrows"})," to move it and ",n.jsx("strong",{children:"Space"})," again to drop. ",n.jsx("strong",{children:"Ctrl/⌘+Z"})," undoes the last move."]})]}),preview:n.jsxs("div",{className:"flex w-full flex-col gap-2",children:[n.jsx(ae,{tone:l,layout:a,cardLayout:o,cards:we?[]:C?me.map(R=>({...R,tone:Ya(R)})):me,columns:je,lanes:J,priorities:ue.priorities,editable:L,editMode:x,autoCollapseEmpty:B,maxItems:_==="none"?void 0:Number(_),onCardsChange:(R,$)=>{oe(R),pe.push($),Se(pe.size),t(`onCardsChange → ${$.cardId}: ${$.from.column} → ${$.to.column}[${$.to.index}]`)},onColumnsChange:R=>{W(R),t(`onColumnsChange → [${R.map($=>$.id).join(", ")}]`)},onLanesChange:H,onCardOpen:R=>t(`onCardOpen → ${R.id}`),onCardContextMenu:({card:R,x:$,y:Ie})=>t(`onCardContextMenu → ${R.id} @ ${Math.round($)},${Math.round(Ie)}`),onAddCard:({column:R,lane:$})=>t(`onAddCard → ${R}${$?` / ${$}`:""}`),canAddCard:de?({column:R})=>!Za.has(R):void 0,onSelectionChange:R=>t(`onSelectionChange → [${R.join(", ")}]`),loading:q,loaderType:ye,error:ve||void 0,onRetry:()=>{Ce(!1),t("onRetry")},variant:m,corner:d,raisedSurface:y,columnCorner:S,padding:O,color:V,size:b,subtaskMaxVisible:Number(I),columnWidth:T==="auto"?"auto":Number(T),icon:n.jsx(Xt,{className:"h-5 w-5"}),title:a==="lanes"?"FieldOps Dispatch":"Horizon Roadmap",subtitle:a==="lanes"?"Regional service lanes · Today":"Q3 launch command center",summary:n.jsxs(fe,{size:"sm",variant:"soft",tone:"slate",children:[me.length," cards"]}),actions:n.jsxs("span",{className:"relative inline-flex",children:[n.jsx(jn,{icon:"Revert",size:"sm",variant:"ghost",srLabel:"Undo last move",onClick:Me,disabled:re===0}),re>0&&n.jsx(Tn,{count:re,size:"xs",tone:"slate",className:"pointer-events-none absolute -top-1 -right-1"})]}),height:540}),n.jsx(Fn,{log:e,emptyText:"No events yet — drag, click or right-click a card."})]})})},Ee=be.roadmap();function ns(){const[e,t]=i.useState(Ee.cards),[a,s]=i.useState(null),[o,r]=i.useState(null),l=i.useRef(null),u=e.filter(p=>p.column==="building").length,m=e.filter(p=>p.column==="blocked").length,h=o?[{value:"edit",label:"Edit card",icon:"Edit"},...Ee.columns.filter(p=>p.id!==o.column).map(p=>({value:`move:${p.id}`,label:`Move to ${p.title}`,icon:"ArrowRight"})),{value:"duplicate",label:"Duplicate",icon:"Copy"},{value:"delete",label:"Delete",icon:"Trash",danger:!0}]:[],d=p=>{if(!o)return;const{card:y}=o;if(p.value==="edit"&&s(y),p.value==="duplicate"&&t(j=>[...j,{...y,id:`${y.id}-copy-${j.length}`,title:`${y.title} (copy)`}]),p.value==="delete"&&t(j=>j.filter(S=>S.id!==y.id)),p.value.startsWith("move:")){const j=p.value.slice(5);t(S=>[...S.filter(w=>w.id!==y.id),{...y,column:j}])}r(null)};return n.jsxs("div",{className:"w-full",children:[n.jsx(ae,{cards:e,columns:Ee.columns,priorities:Ee.priorities,onCardsChange:t,onCardOpen:s,onCardContextMenu:r,onAddCard:({column:p})=>t(y=>[...y,{id:`new-${y.length}`,title:"Untitled initiative",column:p}]),icon:n.jsx(Xt,{className:"h-5 w-5"}),title:"Horizon Roadmap",subtitle:"Q3 launch command center",summary:n.jsxs(n.Fragment,{children:[n.jsxs(fe,{size:"sm",variant:"soft",tone:"slate",children:[e.length," initiatives"]}),n.jsxs(fe,{size:"sm",variant:"soft",tone:"emerald",children:[u," shipping"]}),n.jsxs(fe,{size:"sm",variant:"soft",tone:"orange",children:[m," blocked"]})]}),height:560}),n.jsx("div",{ref:l,className:"fixed h-0 w-0",style:{left:o?.x??0,top:o?.y??0}}),n.jsx(Nn,{anchorRef:l,open:o!==null,onClose:()=>r(null),items:h,onSelect:d}),n.jsx(Bn,{isOpen:a!==null,onClose:()=>s(null),title:"Edit initiative",subtitle:a?.id,footer:n.jsxs("div",{className:"flex justify-end gap-2",children:[n.jsx(ge,{variant:"soft",color:"slate",onClick:()=>s(null),children:"Cancel"}),n.jsx(ge,{onClick:()=>{a&&t(p=>p.map(y=>y.id===a.id?a:y)),s(null)},children:"Save"})]}),children:a&&n.jsxs("div",{className:"flex flex-col gap-4 p-1",children:[n.jsx(Ve,{"aria-label":"Title",value:a.title,onChange:p=>s({...a,title:p.target.value})}),n.jsxs(Mn,{"aria-label":"Priority",value:a.priority??"",onChange:p=>s({...a,priority:p.target.value||void 0}),children:[n.jsx("option",{value:"",children:"No priority"}),Ee.priorities.map(p=>n.jsx("option",{value:p.id,children:p.label},p.id))]})]})})]})}const as=`import { useRef, useState } from "react";
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
`,We=be.fieldOps();function ss(){const[e,t]=i.useState(We.cards),[a,s]=i.useState(We.lanes),o=(u="intake",m=a[0].id)=>t(h=>[...h,{id:`job-${h.length+1}`,title:"New service job",column:u,lane:m??void 0,priority:"medium",points:1}]),r=e.filter(u=>u.column==="onsite"||u.column==="scheduled").length,l=e.filter(u=>u.priority==="critical").length;return n.jsx("div",{className:"w-full",children:n.jsx(ae,{layout:"lanes",cardLayout:"compact",size:"sm",color:"emerald",cards:e,columns:We.columns,lanes:a,priorities:We.priorities,onCardsChange:t,onLanesChange:s,onAddCard:({column:u,lane:m})=>o(u,m),icon:n.jsx(In,{className:"h-5 w-5"}),title:"FieldOps Dispatch",subtitle:"Regional service lanes · Today",summary:n.jsxs(n.Fragment,{children:[n.jsxs(fe,{size:"sm",variant:"soft",tone:"slate",children:[a.length," regions"]}),n.jsxs(fe,{size:"sm",variant:"soft",tone:"sky",children:[r," active jobs"]}),n.jsxs(fe,{size:"sm",variant:"soft",tone:"rose",children:[l," priority"]})]}),actions:n.jsx(ge,{size:"sm",color:"emerald",leadingIcon:"Add",onClick:()=>o(),children:"New job"}),height:560})})}const os=`import { useState } from "react";
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
`,rs=[{id:"backlog",title:"Backlog",color:"slate"},{id:"ready",title:"Ready",color:"sky",accepts:["backlog"]},{id:"building",title:"Building",color:"amber",wipLimit:3},{id:"review",title:"Review",color:"violet"},{id:"shipped",title:"Shipped",color:"emerald",locked:!0}],Ae={id:"lb",name:"Lena Brandt",color:"teal"},is=[{id:"a",column:"backlog",title:"Rate-limit public API",assignees:[Ae]},{id:"b",column:"backlog",title:"Rotate signing keys"},{id:"c",column:"ready",title:"Billing webhooks retry",assignees:[Ae]},{id:"d",column:"building",title:"Org-level SSO",assignees:[Ae]},{id:"e",column:"building",title:"CSV export"},{id:"f",column:"building",title:"Audit log search",assignees:[Ae]},{id:"g",column:"shipped",title:"Usage dashboard",assignees:[Ae]}],ls=e=>new Promise(t=>setTimeout(t,e));function ds(){const[e,t]=i.useState(is),[a,s]=i.useState("Drag a card — refused targets turn red."),o=async r=>{if(r.to.column!=="review")return!0;const l=e.find(m=>m.id===r.cardId);s(`Asking for approval to review "${l?.title}"…`),await ls(800);const u=!!l?.assignees?.length;return s(u?"Approved.":`Refused: "${l?.title}" needs an owner before review.`),u};return n.jsxs("div",{className:"flex w-full flex-col gap-2",children:[n.jsx(ae,{cards:e,columns:rs,onCardsChange:t,onBeforeMove:o,size:"sm",variant:"outlined",height:420}),n.jsx("p",{"aria-live":"polite",className:"text-xs text-neutral-500 dark:text-neutral-400",children:a})]})}const cs=`import { useState } from "react";
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
`,us=[{id:"todo",title:"To do"},{id:"doing",title:"Doing"},{id:"done",title:"Done"}],ms=[{id:"s1",column:"doing",title:"Payments v2 rollout",subtasks:[{id:"s1a",title:"Schema migration",done:!0},{id:"s1b",title:"Dual-write shim",done:!0},{id:"s1c",title:"Read-path switch"},{id:"s1d",title:"Backfill job"},{id:"s1e",title:"Kill the legacy table"},{id:"s1f",title:"Update runbook"},{id:"s1g",title:"Vendor webhooks"},{id:"s1h",title:"Load test at 3× peak"}]},{id:"s2",column:"doing",title:"Import speed audit",subtasks:[{id:"s2a",title:"Profile the parser",status:"completed"},{id:"s2b",title:"Chunked inserts",status:"error"},{id:"s2c",title:"Parallel workers"},{id:"s2d",title:"Re-bench the suite"}]},{id:"s3",column:"todo",title:"Weekly digest email",subtasks:[{id:"s3a",title:"Draft the template",done:!0},{id:"s3b",title:"Quiet-hours logic"},{id:"s3c",title:"Unsubscribe copy"}]},{id:"s4",column:"done",title:"Retire the beta flag",subtasks:[{id:"s4a",title:"Flip the default",done:!0},{id:"s4b",title:"Drop the flag reads",done:!0},{id:"s4c",title:"Announce",done:!0},{id:"s4d",title:"Purge old code",done:!0}]}];function ps(){const[e,t]=i.useState(ms),[a,s]=i.useState(3);return n.jsxs("div",{className:"flex w-full flex-col gap-3",children:[n.jsxs("div",{className:"flex items-center gap-1.5",role:"group","aria-label":"Dots per card",children:[[2,3,4,6].map(o=>n.jsxs(ge,{size:"xs",variant:a===o?"solid":"outline",onClick:()=>s(o),"aria-pressed":a===o,children:[o," dots"]},o)),n.jsx("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"— the rest stack into a tooltip."})]}),n.jsx(ae,{cards:e,columns:us,onCardsChange:t,subtaskMaxVisible:a,size:"sm",height:380})]})}const hs=`import { useState } from "react";
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
`,_t=be.roadmap();function fs({card:e,dragging:t}){const a=e.checklist?e.checklist.done/e.checklist.total:0;return n.jsxs("div",{className:"flex flex-col gap-2",children:[n.jsxs("div",{className:"flex items-center justify-between gap-2",children:[n.jsx("span",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-100",children:e.title}),t&&n.jsx("span",{className:"text-[10px] uppercase tracking-wide text-sky-600",children:"moving"})]}),n.jsx("div",{className:"h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700",children:n.jsx("div",{className:"h-full rounded-full bg-sky-500",style:{width:`${Math.round(a*100)}%`}})}),n.jsx("span",{className:"text-[11px] text-neutral-500 dark:text-neutral-400",children:e.checklist?`${e.checklist.done} of ${e.checklist.total} tasks`:"No checklist"})]})}function gs(){const[e,t]=i.useState(_t.cards.filter(a=>a.column!=="blocked"));return n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:e,columns:_t.columns.filter(a=>a.id!=="blocked"),onCardsChange:t,renderCard:(a,s)=>n.jsx(fs,{card:a,dragging:s.dragging}),color:"sky",size:"sm",height:460})})}const bs=`import { useState } from "react";
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
`,nt=be.roadmap(),ks=[{label:"Ready",value:"ready"},{label:"Loading",value:"loading"},{label:"Empty",value:"empty"},{label:"Error",value:"error"}];function xs(){const[e,t]=i.useState("loading");return n.jsxs("div",{className:"flex w-full flex-col gap-3",children:[n.jsx(Rn,{size:"sm",options:ks,value:e,onChange:t}),n.jsx(ae,{cards:e==="empty"?[]:nt.cards,columns:nt.columns,priorities:nt.priorities,loading:e==="loading",error:e==="error"?"The board service did not answer.":void 0,onRetry:()=>t("loading"),onAddCard:()=>t("ready"),emptyState:"Nothing planned yet — add the first initiative to any column.",title:"Horizon Roadmap",size:"sm",height:400})]})}const ys=`import { useState } from "react";
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
`,at=be.roadmap();function vs(){const[e,t]=i.useState(at.cards),[a,s]=i.useState(at.columns),[o,r]=i.useState(!1);return n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:e,columns:a,priorities:at.priorities,onCardsChange:t,onColumnsChange:s,editMode:o,title:"Horizon Roadmap",subtitle:o?"Editing the layout — drag a grip to reorder":"Q3 launch command center",actions:n.jsx(ge,{size:"sm",variant:o?"solid":"soft",onClick:()=>r(l=>!l),children:o?"Done":"Edit board"}),size:"sm",height:460})})}const Cs=`import { useState } from "react";
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
`,ws=[{id:"todo",title:"To do",color:"slate"},{id:"doing",title:"Doing",color:"sky"},{id:"done",title:"Done",color:"emerald"}],Ss=[{id:"1",column:"todo",title:"Crash on empty workspace",tone:"rose",tags:["bug"]},{id:"2",column:"todo",title:"Bulk archive",tone:"sky",tags:["feature"]},{id:"3",column:"todo",title:"Rename 'Spaces' to 'Teams'",tone:"amber",tags:["copy"]},{id:"4",column:"doing",title:"Timezone drift in reports",tone:"rose",tags:["bug"]},{id:"5",column:"doing",title:"Saved filters",tone:"sky",tags:["feature"]},{id:"6",column:"done",title:"Upgrade the date library",tone:"violet",tags:["chore"]},{id:"7",column:"done",title:"Keyboard shortcuts sheet",tone:"sky",tags:["feature"]}];function js(){const[e,t]=i.useState(Ss);return n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:e,columns:ws,onCardsChange:t,size:"sm",corner:"rounded-md",columnCorner:"rounded-sm",height:360})})}const Ts=`import { useState } from "react";
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
`,st=be.roadmap(),Ft=["Ana","Ben","Chloé","Dev","Eli","Femi","Gus","Hana"],Ht="kit-docs-demo";function Ns(){const e=i.useMemo(()=>{const u=`tab-${Math.random().toString(36).slice(2,8)}`,m=Ft[Math.floor(Math.random()*Ft.length)];return{id:u,name:m,color:Ke(u)}},[]),[t,a]=i.useState(st.cards),[s,o]=i.useState(),[r,l]=i.useState();return i.useEffect(()=>{if(typeof BroadcastChannel>"u")return;const u=ia(Ht),m=new BroadcastChannel(`${Ht}:cards`);return m.onmessage=h=>a(h.data),o(u),l(m),()=>{u.close(),m.close()}},[]),n.jsx("div",{className:"w-full",children:n.jsx(ae,{cards:t,columns:st.columns,priorities:st.priorities,onCardsChange:u=>{a(u),r?.postMessage(u)},transport:s,currentUser:e,title:"Live board",subtitle:"Open this page in a second tab and drag a card",summary:n.jsxs(fe,{size:"sm",variant:"soft",tone:e.color,children:["You are ",e.name]}),height:520})})}const Bs=`import { useEffect, useMemo, useState } from "react";
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
`,Ms=`import type { TaskBoardTransport } from "@cjlapao/ui-kit";

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
/>`,$s=()=>n.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[n.jsx(Pn,{name:"Task Board",description:"A kanban board in two layouts — columns, or columns crossed with swimlanes — with real-time drag and drop by pointer, touch and keyboard. Locks, WIP limits and transition rules are enforced before a card moves, a guarded move can wait on your server, and a collaboration channel shows teammates' drags live: the card they hold is locked on your screen and a ghost shows where it is going. The board is a Panel, so every surface variant, corner and glass setting comes with it. React ships first; the Vue kit is a step behind."}),n.jsx(ts,{}),n.jsxs("section",{className:"flex flex-col gap-5",children:[n.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),n.jsx(ie,{title:"Product roadmap",description:"The columns view with detailed cards. Click or press Enter to open the editor (a SidePanel the app owns); right-click or Shift+F10 for a menu anchored at the payload's x / y. Summary pills and the add-card buttons are plain props.",code:as,filename:"ProductRoadmap.tsx",children:n.jsx(ns,{})}),n.jsx(ie,{title:"Field operations (swimlanes)",description:'`layout="lanes"` crosses the columns with `lanes`. Cards move across lanes as freely as across columns, each lane collapses on its own, and the column header and lane labels stay put while the grid scrolls.',code:os,filename:"FieldOperations.tsx",children:n.jsx(ss,{})}),n.jsx(ie,{title:"Sub tasks",description:"`subtasks` ride on the card and read as a read-only DotStepper row: one dot per sub task (done · active · pending · error), a `done/total` fraction beside them, and `subtaskMaxVisible` (3 by default) dots at most — the rest stack into a tooltip, one per hidden sub task. A plain `done: true` list is enough to drive it; explicit `status` overrides the inference. The dots never take focus — the card stays the only control, and `onCardOpen` still opens the editor that owns them.",code:hs,filename:"Subtasks.tsx",children:n.jsx(ps,{})}),n.jsx(ie,{title:"Rules and guarded moves",description:"`accepts`, `wipLimit` and `locked` are checked by the engine, so a refused bucket turns red and never previews the card. `onBeforeMove` adds your own check — sync or async — and a refusal puts the card back with no rollback code.",code:cs,filename:"Rules.tsx",children:n.jsx(ds,{})}),n.jsx(ie,{title:"Edit the board",description:"`editMode` unlocks the layout: every column header gets a grip to drag it to a new position (or Space, arrows, Space from the keyboard) and an edit button for its properties — name, colour, WIP limit, max items, lock, and which columns it accepts cards from — and an Add column slot follows the last column. Both report through `onColumnsChange`. Outside edit mode the layout is fixed — cards still move as usual.",code:Cs,filename:"EditMode.tsx",children:n.jsx(vs,{})}),n.jsx(ie,{title:"Card tones and corners",description:"`tone` on a card tints its surface, so every card can carry its own colour — status, type, owner. It survives glass (a translucent tint) and the drag clone. `columnCorner` rounds the column wells on the same container scale as the board's `corner`; both default to md.",code:Ts,filename:"CardTones.tsx",children:n.jsx(js,{})}),n.jsx(ie,{title:"Custom cards",description:"`renderCard` swaps a card's body; the shell (drag, focus, selection, teammate ring) stays the board's, and the state argument tells the body what is happening to it.",code:bs,filename:"CustomCards.tsx",children:n.jsx(gs,{})}),n.jsx(ie,{title:"Loading, empty and error",description:"Loading draws a skeleton shaped like the board. Error replaces the columns with the message and a Retry. An empty board keeps its columns, so Add card is still there.",code:ys,filename:"States.tsx",children:n.jsx(xs,{})}),n.jsx(ie,{title:"Live collaboration",description:"Open this page in a second tab and drag a card. The other tab locks it, shows your name on it, and moves a ghost to wherever you are pointing; drop, and the card lands there. Whoever grabbed first wins, on every screen, and a tab that closes mid-drag lets go after eight seconds.",code:Bs,filename:"LiveCollaboration.tsx",children:n.jsx(Ns,{})})]}),n.jsxs(En,{children:[n.jsxs(St,{title:"Screen reader",children:[n.jsxs("p",{children:["The board is a ",n.jsx(Y,{children:'role="application"'})," region named by ",n.jsx(Y,{children:"kit.taskboard.root"})," with"," ",n.jsx(Y,{children:'aria-roledescription="task board"'}),". Each column (or column × lane cell) is a ",n.jsx(Y,{children:'role="group"'})," named by its title and card count, and each card is a ",n.jsx(Y,{children:'role="button"'})," with"," ",n.jsx(Y,{children:'aria-roledescription="card"'}),", named by its title."]}),n.jsxs("p",{children:['Moves are spoken through a polite live region: picking a card up, every step ("Moved to Discovery, position 1 of 4"), the drop and a cancel. A card a teammate holds gets ',n.jsx(Y,{children:"aria-disabled"}),' and a visually hidden "',"{name}",' is moving this"; a pending guarded move sets ',n.jsx(Y,{children:"aria-busy"})," on the card."]}),n.jsxs("p",{children:["Sub task dots are read-only: each is a ",n.jsx(Y,{children:'role="img"'}),' named "',"{title}, step i of n, {status}",'"'," ","inside a ",n.jsx(Y,{children:'role="group"'})," named by ",n.jsx(Y,{children:"kit.taskboard.subtasks"}),' ("',"2 of 7 subtasks",'"), never a button — so a card stays one tab stop and a click on a dot still opens the card.']}),n.jsx(An,{code:Ms,filename:"transport.tsx"})]}),n.jsx(Ln,{bindings:[{keys:["Tab"],action:"Moves into the board — one card is in the tab order at a time (roving tabindex)."},{keys:["↑ / ↓"],action:"Moves focus to the previous / next card in the column."},{keys:["← / →"],action:"Moves focus to the nearest card in the previous / next column (mirrored in RTL)."},{keys:["Alt","↑ / ↓"],action:"Moves focus to the previous / next lane."},{keys:["Space"],action:"Picks the focused card up; with a card held, drops it."},{keys:["Arrows (held)"],action:"Moves the held card through valid slots only — full, locked and refused columns are skipped. Alt+↑/↓ crosses lanes."},{keys:["Esc"],action:"Cancels the move; the card goes back where it was."},{keys:["Enter"],action:"Opens the card (onCardOpen)."},{keys:["Shift","F10"],action:"Opens the context menu (onCardContextMenu); the Menu key does the same."},{keys:["Space (grip)"],action:"Edit mode: picks the column up; ← / → move it one position (mirrored in RTL); Space drops; Esc or Tab cancels."}]}),n.jsx(St,{title:"Internationalization",children:n.jsxs("p",{children:['Every built-in string — "Add card", the counts, the announcements, "',"{name}",' is moving this" — is a'," ",n.jsx(Y,{children:"kit.taskboard.*"})," key in the kit catalogs (en, de, es, fr, pt), and ",n.jsx(Y,{children:"labels"})," overrides any of them per board. Card titles, column titles and lane titles are your data. Due dates format with the kit locale. Inside a ",n.jsx(Y,{children:'dir="rtl"'})," container the columns run right to left and the arrow keys follow."]})})]}),n.jsx(Dn,{props:[{name:"cards / columns / lanes",type:"TaskBoardCard[] / TaskBoardColumn[] / TaskBoardLane[]",description:"The data, controlled. Order inside a column × lane is the order of the cards array — there is no second ordering to keep in sync."},{name:"onCardsChange",type:"(next, move) => void",description:"The single commit event: the next cards array, and the move that produced it (ready for your undo history or your API)."},{name:"onColumnsChange / onLanesChange",type:"(next) => void",description:"Collapse changes — and, in edit mode, column reorders and added columns. Omit one and its carets disappear (a column's caret stays while autoCollapseEmpty shows empty columns collapsed)."},{name:"maxItems",type:"number",description:"Board-wide hard cap on cards per column; a column's own `maxItems` overrides it. At the cap the column's Add card button disappears and drops into it are refused (the header reads count / max when there is no WIP limit)."},{name:"column.maxItems",type:"number",description:"Per column: overrides the board's maxItems. Editable in edit mode's column editor; empty falls back to the board default."},{name:"editMode",type:"boolean",default:"false",description:"Layout editing: a drag grip and an edit button (name, colour, WIP limit, lock, accepted sources) on every column header, and an Add column slot after the last column (columns and lanes layouts). Needs onColumnsChange; the new column's id is slugged from its name and kept unique."},{name:"autoCollapseEmpty",type:"boolean",default:"false",description:"Shows columns with no cards collapsed — the default view, columns layout only. Nothing is emitted for the auto state; your collapsed flags stay as you set them. Clicking a collapsed column's caret expands it for the rest of the session (a real collapsed: true flag is undone once, like any caret click); a remount restores the default view."},{name:"onBeforeMove",type:"(move) => boolean | Promise<boolean>",description:"Guard a move after the engine rules pass. While it is pending the card waits in its new slot; false or a throw puts it back."},{name:"editable",type:"boolean",default:"!!onCardsChange",description:"Pointer and keyboard moves. Selection, focus and opening still work on a read-only board."},{name:"layout",type:"TaskBoardLayout",default:'"columns"',description:'"lanes" crosses the columns with `lanes`.'},{name:"cardLayout / renderCard",type:"TaskBoardCardLayout / (card, state) => ReactNode",default:'"detailed"',description:"A preset card body, or your own. The card shell stays the board's."},{name:"priorities",type:"TaskBoardPriority[]",description:"What `card.priority` ids resolve to: label and colour."},{name:"card.subtasks",type:"TaskBoardSubtask[]",description:'Per card: rendered as a read-only DotStepper row — one dot per sub task — with a `done/total` fraction. `{ id, title, done }` is the simple form (the first unchecked sub task reads as active); `status: "pending" | "active" | "completed" | "error"` overrides the inference. Presentational: editing them happens in your `onCardOpen` editor.'},{name:"subtaskMaxVisible",type:"number",default:"3",description:'How many sub task dots a card shows; the rest stack into "more" markers whose tooltip names every hidden sub task.'},{name:"onCardOpen / onCardContextMenu / onAddCard",type:"callbacks",description:"App-owned surfaces. The context-menu payload carries the card, column, lane, index, x / y and the event."},{name:"canAddCard",type:"({ column, lane }) => boolean",description:"Filter the Add card button per column — or per column × lane cell, in the lanes layout. Only consulted with onAddCard set: it says where a card may be created, never gates a drop or a move (that is onBeforeMove, locked, accepts and the caps). Called during render with the same target onAddCard receives; omitted allows every column."},{name:"selectedIds / onSelectionChange",type:"string[] / (ids) => void",description:"Click, Ctrl/⌘-click and Shift-click (range within a column). Uncontrolled when selectedIds is omitted."},{name:"transport / currentUser",type:"TaskBoardTransport / TaskBoardUser",description:"The collaboration channel: presence, grabs and drag targets only — never card data. Without both, nothing runs."},{name:"icon / title / subtitle / summary / actions",type:"ReactNode",description:"The header strip. Online teammates appear between summary and actions."},{name:"loading / loaderType",type:"boolean / PanelLoaderType",default:'false / "skeleton"',description:"The skeleton is shaped like the board; any other type overlays Panel's loader."},{name:"error / onRetry / emptyState",type:"ReactNode | boolean / () => void / ReactNode",description:"true shows the built-in message. The empty state sits above the columns, which stay."},{name:"card.tone",type:"TrueColor",description:"Per card: tints that card's surface (a solid tint, or a translucent one on glass boards), so cards can be told apart by colour. Omitted keeps the neutral card."},{name:"columnCorner",type:"SurfaceCorner",default:'"rounded-md"',description:"Radius of the column wells, collapsed strips and skeleton included — the container scale `corner` uses."},{name:"variant",type:"TaskBoardVariant",default:'"elevated"',description:"Any Panel surface, or plain for no chrome. Translucent surfaces switch the wells, cards and sticky headers to glass."},{name:"tone / corner / padding / glassOpacity / vibrancy / specularMode",type:"Panel props",default:'corner "rounded-md", padding "none"',description:"Passed to the Panel the board renders, `raisedSurface` included — it forces the first nested-panels depth step, the tinted-card-on-matching-background fix."},{name:"color",type:"TrueColor",default:'"blue"',description:"Accent for focus, selection, the drag clone, and the column edge when a column has no colour of its own."},{name:"size",type:"ControlSize",default:'"md"',description:"Column width and card density, from xs (232 px) to xl (352 px)."},{name:"columnWidth",type:"number | string",default:'"auto"',description:"Overrides the shared expanded-column width. Numbers are pixels; CSS lengths such as `20rem` are accepted. `auto` keeps the width from size without changing card density."},{name:"labels",type:"Partial<TaskBoardLabels>",description:"Per-board overrides of the kit.taskboard strings."},{name:"height / className",type:"number | string / string",description:"The columns scroll inside the height."}]})]});export{$s as TaskBoardPage,$s as default};
