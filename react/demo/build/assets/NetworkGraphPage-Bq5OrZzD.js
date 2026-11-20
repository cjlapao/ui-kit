import{r as n,hv as Ee,u as at,j as e,bj as Xe,g as je,S as it,B as Ue,P as Pe,fU as rt,p as Ce,C as lt}from"./index-dkEsqyUy.js";import{P as ct,A as dt,a as Re,C as W}from"./A11ySections-Ciyz8RbP.js";import{P as ut}from"./PageHeader-Cqxw9jAs.js";import{E as de}from"./ExampleCard-SmeeyhOh.js";import{a as Ae}from"./SurfaceToneControl-CptLUoZR.js";import{P as ht,S as K,C as Ne,T as F}from"./PlaygroundPanel-CD4VThIT.js";import{C as mt}from"./ControlAccordion-BM7PEMt8.js";import{u as pt,E as gt}from"./EventLog-CkW2wQ_v.js";import{s as Be,f as ft,D as bt}from"./options-DH3jBuHJ.js";const me=64,xt=(l,b)=>`${Math.floor(l/me)},${Math.floor(b/me)}`;function yt(l,b,d=[]){const s=new Map(d.map(h=>[h.id,h]));for(const h of l)h.community&&!s.has(h.community)&&s.set(h.community,{id:h.community,label:h.community});const u=[...s.keys()],f=new Map(u.map((h,z)=>[h,z])),S=new Map,p=new Map,g=new Map,w=u.length>1?Math.max(160,Math.sqrt(l.length)*12):0;for(const h of l){if(p.has(h.id))continue;const z=h.community??"",G=S.get(z)??0;S.set(z,G+1);const m=G*Math.PI*(3-Math.sqrt(5)),c=(f.get(z)??0)/Math.max(1,u.length)*Math.PI*2,C=Math.sqrt(G)*16,E={...h,x:Number.isFinite(h.x)&&Number.isFinite(h.y)?h.x:Math.cos(c)*w+Math.cos(m)*C,y:Number.isFinite(h.x)&&Number.isFinite(h.y)?h.y:Math.sin(c)*w+Math.sin(m)*C,radius:Number.isFinite(h.radius)?Math.max(1,Math.min(40,h.radius)):4};p.set(h.id,E);const A=xt(E.x,E.y),x=g.get(A)??[];x.push(E),g.set(A,x)}const y=new Set,j=[],M=new Map;for(const h of b){const z=p.get(h.source),G=p.get(h.target);if(!(!z||!G||y.has(h.id))){y.add(h.id),j.push({...h,from:z,to:G});for(const[m,c]of[[z.id,G.id],[G.id,z.id]]){const C=M.get(m)??new Set;C.add(c),M.set(m,C)}}}return{nodes:[...p.values()],edges:j,byId:p,groups:[...s.values()],adjacency:M,buckets:g}}const Ye=l=>Math.max(.05,Math.min(8,l));function wt(l,b,d,s){const u=Ye(l.zoom*b),f=u/l.zoom;return{x:d-(d-l.x)*f,y:s-(s-l.y)*f,zoom:u}}function kt(l,b,d){if(!l.length)return{x:b/2,y:d/2,zoom:1};let s=1/0,u=1/0,f=-1/0,S=-1/0;for(const g of l)s=Math.min(s,g.x-g.radius),f=Math.max(f,g.x+g.radius),u=Math.min(u,g.y-g.radius),S=Math.max(S,g.y+g.radius);const p=Ye(Math.min(Math.max(1,b-64)/Math.max(1,f-s),Math.max(1,d-64)/Math.max(1,S-u),2));return{x:b/2-(s+f)/2*p,y:d/2-(u+S)/2*p,zoom:p}}function vt(l,b,d,s,u){const f=Math.max(40,8/u);let S,p=1/0;for(let g=Math.floor((d-f)/me);g<=Math.floor((d+f)/me);g++)for(let w=Math.floor((s-f)/me);w<=Math.floor((s+f)/me);w++)for(const y of l.buckets.get(`${g},${w}`)??[]){if(!b.has(y.id))continue;const j=Math.hypot(y.x-d,y.y-s);j<=Math.max(y.radius,8/u)&&j<p&&(S=y,p=j)}return S}function Ke(l,b,d){const s=new Map;for(const p of l)for(const[g,w]of[[p.source,p.target],[p.target,p.source]]){const y=s.get(g)??[];y.push({node:w,edge:p.id}),s.set(g,y)}const u=new Map,f=[b],S=new Set(f);for(let p=0;p<f.length;p++){const g=f[p];if(g===d){const w=[];let y=d;for(;y!==b;){const j=u.get(y);w.push(j.edge),y=j.node}return w.reverse()}for(const w of s.get(g)??[])S.has(w.node)||(S.add(w.node),u.set(w.node,{node:g,edge:w.edge}),f.push(w.node))}return[]}function jt(l){const b=n.useRef(null),d=n.useRef({x:0,y:0,zoom:1}),s=n.useRef({width:1,height:1}),u=n.useRef(l),f=n.useRef(null),[S,p]=n.useState(1),g=n.useRef(new Map),w=n.useRef("#737373"),y=n.useCallback(()=>{const m=b.current,c=m?.getContext("2d");if(!m||!c)return;const{model:C,nodes:E,visible:A,selected:x,focused:R,highlighted:B,tone:Q,showLabels:he}=u.current,{width:H,height:Z}=s.current,N=d.current,$=Math.min(window.devicePixelRatio||1,2);(m.width!==Math.round(H*$)||m.height!==Math.round(Z*$))&&(m.width=Math.round(H*$),m.height=Math.round(Z*$)),c.setTransform($,0,0,$,0,0),c.clearRect(0,0,H,Z),c.translate(N.x,N.y),c.scale(N.zoom,N.zoom);const ne=new Map(C.groups.map(o=>[o.id,o.tone])),oe=o=>g.current.get(o)??Ee[o],V=o=>o.tone??ne.get(o.community??"")??Q,se=x!==null?C.adjacency.get(x):void 0,X=new Set;if(B.size)for(const o of C.edges)B.has(o.id)&&(X.add(o.source),X.add(o.target));const q=new Map;for(const o of C.edges){if(!A.has(o.source)||!A.has(o.target))continue;const P=B.has(o.id)||x!==null&&(o.source===x||o.target===x),r=oe(o.tone??V(o.from)),U=`${r}:${P}`,J=q.get(U)??{color:r,active:P,edges:[]};J.edges.push(o),q.set(U,J)}for(const o of[!1,!0])for(const P of q.values())if(P.active===o){c.beginPath(),c.strokeStyle=P.color,c.globalAlpha=o?.95:x!==null||B.size?.08:.28,c.lineWidth=(o?1.8:.7)/N.zoom;for(const r of P.edges)r.source===r.target?(c.moveTo(r.from.x+12,r.from.y-10),c.arc(r.from.x,r.from.y-10,12,0,Math.PI*2)):(c.moveTo(r.from.x,r.from.y),c.lineTo(r.to.x,r.to.y));c.stroke()}for(const o of E){const P=o.x*N.zoom+N.x,r=o.y*N.zoom+N.y;if(P<-50||P>H+50||r<-50||r>Z+50)continue;const U=o.id===x||o.id===R||se?.has(o.id)||X.has(o.id);c.globalAlpha=x!==null||B.size?U?1:.22:1,c.fillStyle=oe(V(o)),c.beginPath(),c.arc(o.x,o.y,Math.max(o.radius,1.5/N.zoom),0,Math.PI*2),c.fill(),(o.id===x||o.id===R)&&(c.strokeStyle=oe(V(o)),c.lineWidth=1.5/N.zoom,c.beginPath(),c.arc(o.x,o.y,o.radius+4/N.zoom,0,Math.PI*2),c.stroke()),(o.id===x||o.id===R||he&&N.zoom>=.8&&E.length<=250)&&(c.globalAlpha=1,c.fillStyle=w.current,c.font=`${12/N.zoom}px sans-serif`,c.fillText(o.label??o.id,o.x+o.radius+7/N.zoom,o.y+4/N.zoom))}c.globalAlpha=1},[]),j=n.useCallback(()=>{f.current===null&&(f.current=requestAnimationFrame(()=>{f.current=null,y()}))},[y]),M=n.useCallback(m=>{d.current=m,p(m.zoom),j(),u.current.onViewportChange?.({...m})},[j]),h=n.useCallback(()=>M(kt(u.current.nodes,s.current.width,s.current.height)),[M]),z=n.useCallback((m,c=s.current.width/2,C=s.current.height/2)=>M(wt(d.current,m,c,C)),[M]),G=n.useCallback(m=>{M({...d.current,x:s.current.width/2-m.x*d.current.zoom,y:s.current.height/2-m.y*d.current.zoom})},[M]);return n.useEffect(()=>{u.current=l,j()},[l,j]),n.useEffect(()=>{h()},[l.model,h]),n.useEffect(()=>{const m=b.current;if(!m)return;const c=()=>{const x=m.getBoundingClientRect(),R=s.current;s.current={width:Math.max(1,x.width),height:Math.max(1,x.height)},R.width===1?h():M({...d.current,x:d.current.x+(s.current.width-R.width)/2,y:d.current.y+(s.current.height-R.height)/2})},C=()=>{const x=getComputedStyle(m),R=!!m.closest(".dark");g.current=new Map(Object.keys(Ee).map(B=>[B,x.getPropertyValue(`--color-${B}-${R?400:600}`).trim()||Ee[B]])),w.current=x.color,j()},E=new ResizeObserver(c);E.observe(m),c(),C();const A=new MutationObserver(C);for(let x=m;x;x=x.parentElement)A.observe(x,{attributes:!0,attributeFilter:["class","style"]});return window.addEventListener("resize",c),()=>{E.disconnect(),A.disconnect(),window.removeEventListener("resize",c),f.current!==null&&cancelAnimationFrame(f.current),f.current=null}},[h,M,j,l.active]),{canvasRef:b,view:d,zoom:S,update:M,fit:h,zoomBy:z,focusNode:G}}const Ct=[],Nt=[],St=16,Qe=280,Mt=180,It=480,zt=320,Gt=l=>Math.max(Mt,Math.min(It,Number.isFinite(l)?l:Qe));function ue({nodes:l,edges:b,communities:d=Ct,height:s=480,selectedNodeId:u,defaultSelectedNodeId:f=null,onNodeSelect:S,visibleCommunityIds:p,onVisibleCommunitiesChange:g,highlightedEdgeIds:w=Nt,showCommunities:y=!0,legendPosition:j="auto",legendPanel:M=!1,legendVariant:h="auto",legendTone:z="auto",inspector:G=!1,inspectorVariant:m="auto",inspectorTone:c="auto",inspectorWidth:C=Qe,inspectorMinMainWidth:E=zt,inspectorStackBelow:A,inspectorTitle:x,inspectorButtonVariant:R="solid",inspectorButtonTone:B="slate",inspectorButtonWeight:Q,renderInspectorBody:he,renderInspectorActions:H,showLabels:Z=!1,showControls:N=!0,ariaLabel:$,emptyMessage:ne,onViewportChange:oe,tone:V="none",variant:se="elevated",disabled:X=!1,loading:q=!1,...o}){const P=je(V),r=at(),U=n.useId(),J=n.useRef(null),xe=n.useRef(null),[ye,Me]=n.useState(!0),[Ie,we]=n.useState(!1),ae=j==="right"||j==="auto"&&ye,pe=Gt(C);n.useEffect(()=>{const t=J.current;if(!t||j!=="auto")return;const a=()=>Me(t.getBoundingClientRect().width>=600);a();const k=new ResizeObserver(a);return k.observe(t),()=>k.disconnect()},[j,q]),n.useEffect(()=>{const t=xe.current;if(!t||!G)return;const a=A??pe+St+E,k=()=>we(t.getBoundingClientRect().width<a);k();const I=new ResizeObserver(k);return I.observe(t),()=>I.disconnect()},[G,pe,E,A]);const i=n.useMemo(()=>yt(l,b,d),[l,b,d]),[ie,ge]=n.useState(f),[Oe,Ze]=n.useState(()=>new Set),[ze,re]=n.useState(null),[Ge,$e]=n.useState(""),ee=n.useMemo(()=>new Set(p??i.groups.filter(t=>!Oe.has(t.id)).map(t=>t.id)),[p,i,Oe]),_=n.useMemo(()=>i.nodes.filter(t=>!t.community||ee.has(t.community)),[i,ee]),te=n.useMemo(()=>new Set(_.map(t=>t.id)),[_]),Te=u===void 0?ie:u,fe=Te!==null&&te.has(Te)?Te:null,be=ze!==null&&te.has(ze)?ze:null,Je=n.useMemo(()=>new Set(w),[w]),et=n.useMemo(()=>{const t=new Map;for(const a of i.nodes)a.community&&t.set(a.community,(t.get(a.community)??0)+1);return t},[i]),L=fe!==null?i.byId.get(fe):void 0,D=n.useMemo(()=>{if(!L)return null;const t=i.adjacency.get(L.id),a=[];if(t){for(const I of t)if(te.has(I)){const Y=i.byId.get(I);Y&&a.push(Y)}}const k=L.community?i.groups.find(I=>I.id===L.community):void 0;return{label:L.label??L.id,community:k,connectionCount:t?.size??0,neighbors:a}},[L,i,te]),v=jt({active:!q,model:i,nodes:_,visible:te,selected:fe,focused:be,highlighted:Je,tone:P,showLabels:Z,onViewportChange:oe}),T=X||q,le=n.useRef(null),ce=t=>{T||(u===void 0&&ge(t),S?.(t===null?null:i.byId.get(t)??null))},Ve=t=>{T||(p===void 0&&Ze(new Set(i.groups.filter(a=>!t.includes(a.id)).map(a=>a.id))),g?.(t))};n.useEffect(()=>{const t=v.canvasRef.current;if(!t||T)return;const a=k=>{if(!k.ctrlKey)return;k.preventDefault();const I=t.getBoundingClientRect();v.zoomBy(Math.exp(-Math.max(-100,Math.min(100,k.deltaY))*.008),k.clientX-I.left,k.clientY-I.top)};return t.addEventListener("wheel",a,{passive:!1}),()=>t.removeEventListener("wheel",a)},[v.canvasRef,v.zoomBy,T]);const tt=t=>{if(T||t.altKey||t.ctrlKey||t.metaKey)return;const a=_.findIndex(k=>k.id===(be??fe));if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(t.key)){t.preventDefault();const k=t.key==="ArrowLeft"||t.key==="ArrowUp"?-1:1,I=a<0?k>0?0:_.length-1:(a+k+_.length)%_.length,Y=_[I];Y&&(re(Y.id),v.focusNode(Y))}else t.key==="Enter"||t.key===" "?(t.preventDefault(),be!==null&&ce(be)):t.key==="Escape"?(t.preventDefault(),re(null),ce(null)):t.key==="Home"?(t.preventDefault(),v.fit()):t.key==="+"||t.key==="="?(t.preventDefault(),v.zoomBy(1.25)):t.key==="-"&&(t.preventDefault(),v.zoomBy(.8))},ke=i.byId.get(be??fe??""),nt=n.useMemo(()=>{const t=Ge.toLocaleLowerCase();return _.filter(a=>(a.label??a.id).toLocaleLowerCase().includes(t)).slice(0,50).map(a=>({value:a.id,label:a.label??a.id}))},[_,Ge]),ve=Number.isFinite(s)?Math.max(160,s):480,Le=z==="auto"?V:z,De=e.jsxs("fieldset",{disabled:T,className:"flex min-w-0 shrink-0 flex-col gap-3 overflow-auto",style:{maxHeight:M?Math.max(96,ve-64):ve},children:[e.jsx("legend",{className:"mb-3 text-xs font-semibold uppercase tracking-widest",children:r("kit.networkGraph.communities")}),e.jsx(Xe,{size:"sm",tone:je(Le),label:r("kit.networkGraph.selectAll"),checked:i.groups.every(t=>ee.has(t.id)),indeterminate:i.groups.some(t=>ee.has(t.id))&&!i.groups.every(t=>ee.has(t.id)),onChange:t=>Ve(t.target.checked?i.groups.map(a=>a.id):[])}),i.groups.map(t=>e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(Xe,{size:"sm",tone:t.tone??je(Le),label:t.label,checked:ee.has(t.id),onChange:a=>Ve(a.target.checked?[...ee,t.id]:[...ee].filter(k=>k!==t.id))}),e.jsx("span",{className:"text-xs tabular-nums opacity-60",children:et.get(t.id)??0})]},t.id))]}),ot=m==="auto"?se:m,Fe=c==="auto"?V:c,He=je(Fe),qe=()=>{if(!L)return;const t=i.byId.get(L.id);t&&v.focusNode(t)},We=()=>{ce(null),re(null)},st=L&&D?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"cj-network-graph__body",children:[e.jsx("div",{className:"cj-network-graph__eyebrow",children:x??r("kit.networkGraph.inspector")}),e.jsx("h3",{children:D.label}),D.community&&e.jsxs("span",{className:"cj-network-graph__chip",style:{"--chip-color":`var(--color-${D.community.tone??L.tone??He}-500)`},children:[e.jsx("i",{}),D.community.label]}),e.jsxs("dl",{className:"cj-network-graph__meta",children:[e.jsx("dt",{children:r("kit.networkGraph.nodeId")}),e.jsx("dd",{children:e.jsx("code",{children:L.id})}),e.jsx("dt",{children:r("kit.networkGraph.connections")}),e.jsx("dd",{children:D.connectionCount})]}),he?he(L,D):D.neighbors.length>0&&e.jsxs("div",{className:"cj-network-graph__neighbors",children:[e.jsx("small",{children:r("kit.networkGraph.neighbors")}),e.jsx(it,{variant:"auto",horizontal:!1,className:"cj-network-graph__neighbor-scroll","aria-label":r("kit.networkGraph.neighbors"),children:e.jsx("div",{className:"cj-network-graph__neighbor-rows",children:D.neighbors.map(t=>e.jsxs("button",{type:"button",className:"cj-network-graph__neighbor",style:{"--node-color":`var(--color-${t.tone??D.community?.tone??He}-500)`},onClick:()=>{ce(t.id),re(t.id);const a=i.byId.get(t.id);a&&v.focusNode(a)},children:[e.jsx("i",{}),e.jsx("span",{children:t.label??t.id})]},t.id))})})]})]}),e.jsx("div",{className:"cj-network-graph__actions",children:H?H(L,D,{centerOnNode:qe,close:We}):e.jsxs(e.Fragment,{children:[e.jsx(Ue,{size:"sm",fullWidth:!0,variant:R,color:B,weight:Q,onClick:qe,children:r("kit.networkGraph.centerOnNode")}),e.jsx(Ue,{size:"sm",fullWidth:!0,variant:R,color:B,weight:Q,onClick:We,children:r("kit.networkGraph.close")})]})})]}):null;return e.jsxs("div",{ref:xe,className:G?["cj-network-graph",L&&"cj-network-graph--inspector-open",Ie&&"cj-network-graph--stacked"].filter(Boolean).join(" "):void 0,style:G?{"--cj-network-graph-inspector-width":`${pe}px`}:void 0,children:[e.jsx("div",{className:"cj-network-graph__main",children:e.jsx(Pe,{...o,tone:V,variant:se,padding:"sm",disabled:X,loading:q,clickable:!1,scrollable:!1,children:e.jsxs("div",{className:"flex min-w-0 flex-col gap-3",role:"group","aria-label":$??r("kit.networkGraph.name"),"aria-disabled":T||void 0,children:[N&&e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:e.jsx("div",{className:"min-w-40 flex-1",children:e.jsx(rt,{size:"sm",tone:P,value:Ge,onChange:$e,disabled:T,options:nt,"aria-label":r("kit.networkGraph.findNode"),placeholder:r("kit.networkGraph.findNode"),onSelect:t=>{const a=i.byId.get(t.value);a&&(ce(a.id),re(a.id),$e(a.label??a.id),v.focusNode(a))}})})}),e.jsxs("div",{ref:J,className:"flex min-w-0 gap-4",style:{flexDirection:ae?"row":"column"},"data-legend-position":ae?"right":"bottom",children:[e.jsxs("div",{className:"relative min-w-0 flex-1",style:{height:ve,minHeight:ve},children:[e.jsx("canvas",{ref:v.canvasRef,className:`block h-full w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-${P}-500 ${T?"":"cursor-grab active:cursor-grabbing"}`,style:{touchAction:T?"auto":"none"},tabIndex:T?-1:0,role:"application","aria-roledescription":r("kit.networkGraph.name"),"aria-label":$??r("kit.networkGraph.name"),"aria-describedby":U,onKeyDown:tt,onPointerDown:t=>{T||t.button!==0||le.current||(t.currentTarget.focus(),t.currentTarget.setPointerCapture(t.pointerId),le.current={id:t.pointerId,x:t.clientX,y:t.clientY,originX:t.clientX,originY:t.clientY,moved:!1})},onPointerMove:t=>{const a=le.current;if(T||!a||a.id!==t.pointerId)return;const k=t.clientX-a.x,I=t.clientY-a.y;a.moved||=Math.hypot(t.clientX-a.originX,t.clientY-a.originY)>4,a.moved&&v.update({...v.view.current,x:v.view.current.x+k,y:v.view.current.y+I}),a.x=t.clientX,a.y=t.clientY},onPointerUp:t=>{const a=le.current;if(!a||a.id!==t.pointerId||(le.current=null,t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId),T||a.moved))return;const k=t.currentTarget.getBoundingClientRect(),I=v.view.current,Y=vt(i,te,(t.clientX-k.left-I.x)/I.zoom,(t.clientY-k.top-I.y)/I.zoom,I.zoom);re(Y?.id??null),ce(Y?.id??null)},onPointerCancel:()=>{le.current=null},onLostPointerCapture:()=>{le.current=null}}),N&&e.jsxs("div",{className:"absolute bottom-3 right-3 z-10 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90",children:[e.jsx(Ce,{icon:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[e.jsx("path",{d:"M4 9V5a1 1 0 0 1 1-1h4"}),e.jsx("path",{d:"M15 4h4a1 1 0 0 1 1 1v4"}),e.jsx("path",{d:"M20 15v4a1 1 0 0 1-1 1h-4"}),e.jsx("path",{d:"M9 20H5a1 1 0 0 1-1-1v-4"})]}),size:"xs",variant:"ghost",color:"slate",disabled:T,srLabel:r("kit.networkGraph.fit"),tooltip:r("kit.networkGraph.fit"),onClick:v.fit}),e.jsx(Ce,{icon:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round","aria-hidden":"true",children:e.jsx("path",{d:"M6 12h12"})}),size:"xs",variant:"ghost",color:"slate",disabled:T||v.zoom<=.05,srLabel:r("kit.networkGraph.zoomOut"),tooltip:r("kit.networkGraph.zoomOut"),onClick:()=>v.zoomBy(.8)}),e.jsxs("span",{className:"min-w-[3.5ch] px-1 text-center text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400","aria-label":r("kit.networkGraph.zoom"),children:[Math.round(v.zoom*100),"%"]}),e.jsx(Ce,{icon:"Add",size:"xs",variant:"ghost",color:"slate",disabled:T||v.zoom>=8,srLabel:r("kit.networkGraph.zoomIn"),tooltip:r("kit.networkGraph.zoomIn"),onClick:()=>v.zoomBy(1.25)}),e.jsx(Ce,{icon:"Reset",size:"xs",variant:"ghost",color:"slate",disabled:T,srLabel:r("kit.networkGraph.reset"),tooltip:r("kit.networkGraph.reset"),onClick:()=>{ce(null),re(null),v.fit()}})]}),!_.length&&e.jsx("div",{className:"pointer-events-none absolute inset-0 flex items-center justify-center text-sm",children:ne??r("kit.networkGraph.empty")})]}),y&&i.groups.length>0&&e.jsx("div",{className:"min-w-0 shrink-0",style:{width:ae?M?224:192:"100%"},children:M?e.jsx(Pe,{variant:h==="auto"?se:h,tone:Le,padding:"xs",corner:o.corner,glassOpacity:o.glassOpacity,vibrancy:o.vibrancy,specularMode:o.specularMode,scrollable:!1,children:De}):De})]}),e.jsx("p",{id:U,className:"text-xs opacity-70",children:r("kit.networkGraph.instructions")}),e.jsx("p",{role:"status","aria-live":"polite","aria-atomic":"true",className:"text-xs",children:ke?r("kit.networkGraph.nodeStatus",{label:ke.label??ke.id,count:i.adjacency.get(ke.id)?.size??0}):r("kit.networkGraph.summary",{nodes:_.length,edges:i.edges.filter(t=>te.has(t.source)&&te.has(t.target)).length})})]})})}),G&&e.jsx("aside",{className:"cj-network-graph__inspector","aria-hidden":!L||void 0,inert:!L||void 0,children:e.jsx("div",{className:"cj-network-graph__inspector-inner",children:e.jsx(Pe,{variant:ot,tone:Fe,padding:"sm",corner:o.corner,glassOpacity:o.glassOpacity,vibrancy:o.vibrancy,specularMode:o.specularMode,clickable:!1,scrollable:!1,flexBody:!0,className:"cj-network-graph__details",children:st})})})]})}const O=[{id:"routing",label:"Routing",tone:"blue"},{id:"security",label:"Security",tone:"orange"},{id:"models",label:"Models",tone:"teal"},{id:"validation",label:"Validation",tone:"rose"},{id:"events",label:"Events",tone:"violet"},{id:"storage",label:"Storage",tone:"amber"}];function Se(l){const b=Array.from({length:l},(s,u)=>({id:`node-${u}`,label:`${O[u%O.length].label} ${Math.floor(u/O.length)+1}`,community:O[u%O.length].id,radius:u<O.length?9:u%17===0?6:3})),d=[];for(let s=1;s<l;s++){const u=s<6?0:s%6+Math.floor(Math.floor(s/6)/3)*6;d.push({id:`edge-${s}`,source:`node-${s}`,target:`node-${Math.min(s-1,u)}`}),s>12&&s%3===0&&d.push({id:`bridge-${s}`,source:`node-${s}`,target:`node-${Math.floor(s*.61)}`})}return{nodes:b,edges:d}}const _e=Se(180);function Tt(){const[l,b]=n.useState("glass"),[d,s]=n.useState("none"),[u,f]=n.useState("rounded-md"),[S,p]=n.useState("frosted"),[g,w]=n.useState("medium"),[y,j]=n.useState("180"),[M,h]=n.useState("auto"),[z,G]=n.useState(!1),[m,c]=n.useState("auto"),[C,E]=n.useState("auto"),[A,x]=n.useState(!0),[R,B]=n.useState(!1),[Q,he]=n.useState(!1),[H,Z]=n.useState(!1),[N,$]=n.useState(!1),[ne,oe]=n.useState(!1),[V,se]=n.useState(!0),[X,q]=n.useState("auto"),[o,P]=n.useState("auto"),[r,U]=n.useState("solid"),[J,xe]=n.useState("sky"),[ye,Me]=n.useState(!1),[Ie,we]=pt(),ae=n.useMemo(()=>Se(ne?0:Number(y)),[y,ne]),pe=n.useMemo(()=>Q?Ke(ae.edges,"node-22",`node-${Number(y)-1}`):[],[Q,ae,y]);return e.jsx(ht,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(mt,{groups:[{id:"appearance",title:"Appearance",controls:e.jsxs(e.Fragment,{children:[e.jsx(K,{label:"Variant",value:l,options:Be,onChange:i=>b(i)}),e.jsx(Ne,{label:"Tone",children:e.jsx(Ae,{value:d,onSelect:s})}),e.jsx(K,{label:"Corner",value:u,options:ft,onChange:i=>f(i)}),e.jsx(K,{label:"Glass opacity",value:String(S),options:[{label:"Clear",value:"clear"},{label:"Frosted",value:"frosted"},{label:"Light",value:"light"}],onChange:i=>p(i)}),e.jsx(K,{label:"Vibrancy",value:String(g),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}],onChange:i=>w(i)})]})},{id:"network",title:"Network",controls:e.jsxs(e.Fragment,{children:[e.jsx(K,{label:"Nodes",value:y,options:[{label:"60 nodes",value:"60"},{label:"180 nodes",value:"180"},{label:"2,000 nodes",value:"2000"}],onChange:j}),e.jsx(F,{label:"Legend panel",checked:z,onChange:G}),e.jsx(K,{label:"Legend variant",value:m,options:[{label:"Auto (parent)",value:"auto"},...Be],onChange:i=>c(i)}),e.jsxs(Ne,{label:"Legend tone",children:[e.jsx(F,{label:"Follow parent tone",checked:C==="auto",onChange:i=>E(i?"auto":d)}),C!=="auto"&&e.jsx(Ae,{value:C,onSelect:E})]}),e.jsx(K,{label:"Legend position",value:M,options:[{label:"Auto",value:"auto"},{label:"Right",value:"right"},{label:"Bottom",value:"bottom"}],onChange:i=>h(i)}),e.jsx(F,{label:"Community legend",checked:A,onChange:x}),e.jsx(F,{label:"Node labels",checked:R,onChange:B}),e.jsx(F,{label:"Highlight a path",checked:Q,onChange:he})]})},{id:"inspector",title:"Inspector",controls:e.jsxs(e.Fragment,{children:[e.jsx(F,{label:"Inspector panel",checked:V,onChange:se}),e.jsx(K,{label:"Inspector variant",value:X,options:[{label:"Auto (parent)",value:"auto"},...Be],onChange:i=>q(i)}),e.jsxs(Ne,{label:"Inspector tone",children:[e.jsx(F,{label:"Follow parent tone",checked:o==="auto",onChange:i=>P(i?"auto":d)}),o!=="auto"&&e.jsx(Ae,{value:o,onSelect:P})]}),e.jsx(K,{label:"Button variant",value:r,options:bt,onChange:i=>U(i)}),e.jsx(Ne,{label:"Button tone",children:e.jsx(lt,{selectable:!0,size:"sm",value:J,onSelect:xe,defaultExpanded:!0})}),e.jsx(F,{label:"Custom body",checked:ye,onChange:Me})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(F,{label:"Disabled",checked:H,onChange:Z}),e.jsx(F,{label:"Loading",checked:N,onChange:$}),e.jsx(F,{label:"Empty",checked:ne,onChange:oe})]})}]}),e.jsx(gt,{log:Ie})]}),preview:e.jsx(ue,{...ae,communities:O,variant:l,tone:d,corner:u,glassOpacity:S,vibrancy:g,height:440,showCommunities:A,legendPosition:M,legendPanel:z,legendVariant:m,legendTone:C,inspector:V,inspectorVariant:X,inspectorTone:o,inspectorButtonVariant:r,inspectorButtonTone:J,renderInspectorBody:ye?(i,ie)=>e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Custom body · ",i.id]}),e.jsxs("p",{children:[ie.connectionCount," connection",ie.connectionCount===1?"":"s",ie.community?` in ${ie.community.label}`:""]}),e.jsx("div",{className:"flex flex-wrap gap-1",children:ie.neighbors.map(ge=>e.jsx("span",{className:"rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800",children:ge.label??ge.id},ge.id))})]}):void 0,showLabels:R,highlightedEdgeIds:pe,disabled:H,loading:N,onNodeSelect:i=>we(`Selected: ${i?.label??"none"}`),onVisibleCommunitiesChange:i=>we(`Communities: ${i.length}`)})})}const Lt=[{id:"input",label:"Input",x:-150,y:0,tone:"blue",radius:8},{id:"encode",label:"Encode",x:0,y:-70,tone:"teal"},{id:"context",label:"Context",x:0,y:70,tone:"amber"},{id:"output",label:"Output",x:150,y:0,tone:"violet",radius:8}],Et=[{id:"a",source:"input",target:"encode"},{id:"b",source:"input",target:"context"},{id:"c",source:"encode",target:"output"},{id:"d",source:"context",target:"output"}];function Pt(){return e.jsx(ue,{nodes:Lt,edges:Et,height:260,showLabels:!0,variant:"outlined",ariaLabel:"Encoding network"})}const Rt=`import { NetworkGraph } from "@cjlapao/ui-kit";

const nodes = [
  {
    id: "input",
    label: "Input",
    x: -150,
    y: 0,
    tone: "blue" as const,
    radius: 8,
  },
  { id: "encode", label: "Encode", x: 0, y: -70, tone: "teal" as const },
  { id: "context", label: "Context", x: 0, y: 70, tone: "amber" as const },
  {
    id: "output",
    label: "Output",
    x: 150,
    y: 0,
    tone: "violet" as const,
    radius: 8,
  },
];
const edges = [
  { id: "a", source: "input", target: "encode" },
  { id: "b", source: "input", target: "context" },
  { id: "c", source: "encode", target: "output" },
  { id: "d", source: "context", target: "output" },
];
export default function Basics() {
  return (
    <NetworkGraph
      nodes={nodes}
      edges={edges}
      height={260}
      showLabels
      variant="outlined"
      ariaLabel="Encoding network"
    />
  );
}
`;function At(){const[l,b]=n.useState(O.map(u=>u.id)),[d,s]=n.useState(null);return e.jsx(ue,{..._e,communities:O,height:380,variant:"glass",visibleCommunityIds:l,onVisibleCommunitiesChange:b,selectedNodeId:d,onNodeSelect:u=>s(u?.id??null)})}const Bt=`import { useState } from "react";
import { NetworkGraph } from "@cjlapao/ui-kit";
import { communities, sample } from "../data";

export default function Communities() {
  const [visible, setVisible] = useState(communities.map((c) => c.id));
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <NetworkGraph
      {...sample}
      communities={communities}
      height={380}
      variant="glass"
      visibleCommunityIds={visible}
      onVisibleCommunitiesChange={setVisible}
      selectedNodeId={selected}
      onNodeSelect={(node) => setSelected(node?.id ?? null)}
    />
  );
}
`;function _t(){const[l,b]=n.useState("node-179"),d=n.useMemo(()=>Ke(_e.edges,"node-22",l),[l]);return e.jsxs("div",{className:"space-y-3",children:[e.jsx("p",{className:"text-sm",children:"Select a destination to trace an unweighted, undirected shortest path from Models 4."}),e.jsx(ue,{..._e,communities:O,highlightedEdgeIds:d,selectedNodeId:null,onNodeSelect:s=>{s&&b(s.id)},height:360,variant:"tonal",tone:"teal"})]})}const Ot=`import { useMemo, useState } from "react";
import { NetworkGraph, findNetworkPath } from "@cjlapao/ui-kit";
import { communities, sample } from "../data";

export default function Paths() {
  const [target, setTarget] = useState("node-179");
  const path = useMemo(
    () => findNetworkPath(sample.edges, "node-22", target),
    [target],
  );
  return (
    <div className="space-y-3">
      <p className="text-sm">
        Select a destination to trace an unweighted, undirected shortest path
        from Models 4.
      </p>
      <NetworkGraph
        {...sample}
        communities={communities}
        highlightedEdgeIds={path}
        selectedNodeId={null}
        onNodeSelect={(node) => {
          if (node) setTarget(node.id);
        }}
        height={360}
        variant="tonal"
        tone="teal"
      />
    </div>
  );
}
`,$t=Se(48);function Vt(){return e.jsx("div",{className:"grid gap-4 md:grid-cols-2",children:["outlined","tonal","glass","liquid-glass"].map(l=>e.jsx(ue,{...$t,communities:O,title:l,variant:l,tone:"violet",height:220,showCommunities:!1,showControls:!1},l))})}const Dt=`import { NetworkGraph } from "@cjlapao/ui-kit";
import { communities, makeNetwork } from "../data";

const graph = makeNetwork(48);
export default function Variants() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {(["outlined", "tonal", "glass", "liquid-glass"] as const).map(
        (variant) => (
          <NetworkGraph
            key={variant}
            {...graph}
            communities={communities}
            title={variant}
            variant={variant}
            tone="violet"
            height={220}
            showCommunities={false}
            showControls={false}
          />
        ),
      )}
    </div>
  );
}
`,Ft=[{id:"gateway",label:"Gateway",community:"edge",tone:"sky",radius:8},{id:"cdn",label:"CDN",community:"edge",tone:"sky"},{id:"auth",label:"Auth",community:"core",tone:"violet"},{id:"users",label:"Users",community:"core",tone:"violet"},{id:"orders",label:"Orders",community:"core",tone:"violet"},{id:"search",label:"Search",community:"core",tone:"violet"},{id:"pg",label:"Postgres",community:"data",tone:"amber"},{id:"cache",label:"Cache",community:"data",tone:"amber"},{id:"queue",label:"Queue",community:"data",tone:"amber"}],Ht=[{id:"a",source:"cdn",target:"gateway"},{id:"b",source:"gateway",target:"auth"},{id:"c",source:"gateway",target:"users"},{id:"d",source:"gateway",target:"orders"},{id:"e",source:"gateway",target:"search"},{id:"f",source:"auth",target:"pg"},{id:"g",source:"users",target:"pg"},{id:"h",source:"orders",target:"pg"},{id:"i",source:"orders",target:"queue"},{id:"j",source:"search",target:"cache"},{id:"k",source:"users",target:"cache"}],qt=[{id:"edge",label:"Edge",tone:"sky"},{id:"core",label:"Core",tone:"violet"},{id:"data",label:"Data",tone:"amber"}];function Wt(){return e.jsx(ue,{nodes:Ft,edges:Ht,communities:qt,height:320,variant:"outlined",ariaLabel:"Service mesh",inspector:!0,defaultSelectedNodeId:"gateway",inspectorButtonVariant:"soft",inspectorButtonTone:"sky"})}const Xt=`import { NetworkGraph } from "@cjlapao/ui-kit";

const nodes = [
  { id: "gateway", label: "Gateway", community: "edge", tone: "sky" as const, radius: 8 },
  { id: "cdn", label: "CDN", community: "edge", tone: "sky" as const },
  { id: "auth", label: "Auth", community: "core", tone: "violet" as const },
  { id: "users", label: "Users", community: "core", tone: "violet" as const },
  { id: "orders", label: "Orders", community: "core", tone: "violet" as const },
  { id: "search", label: "Search", community: "core", tone: "violet" as const },
  { id: "pg", label: "Postgres", community: "data", tone: "amber" as const },
  { id: "cache", label: "Cache", community: "data", tone: "amber" as const },
  { id: "queue", label: "Queue", community: "data", tone: "amber" as const },
];
const edges = [
  { id: "a", source: "cdn", target: "gateway" },
  { id: "b", source: "gateway", target: "auth" },
  { id: "c", source: "gateway", target: "users" },
  { id: "d", source: "gateway", target: "orders" },
  { id: "e", source: "gateway", target: "search" },
  { id: "f", source: "auth", target: "pg" },
  { id: "g", source: "users", target: "pg" },
  { id: "h", source: "orders", target: "pg" },
  { id: "i", source: "orders", target: "queue" },
  { id: "j", source: "search", target: "cache" },
  { id: "k", source: "users", target: "cache" },
];
const communities = [
  { id: "edge", label: "Edge", tone: "sky" as const },
  { id: "core", label: "Core", tone: "violet" as const },
  { id: "data", label: "Data", tone: "amber" as const },
];

export default function Inspector() {
  return (
    <NetworkGraph
      nodes={nodes}
      edges={edges}
      communities={communities}
      height={320}
      variant="outlined"
      ariaLabel="Service mesh"
      inspector
      defaultSelectedNodeId="gateway"
      inspectorButtonVariant="soft"
      inspectorButtonTone="sky"
    />
  );
}
`,Ut=Se(2e3);function Yt(){return e.jsx(ue,{...Ut,communities:O,height:460,variant:"subtle"})}const Kt=`import { NetworkGraph } from "@cjlapao/ui-kit";
import { communities, makeNetwork } from "../data";

const graph = makeNetwork(2000);
export default function LargeNetwork() {
  return (
    <NetworkGraph
      {...graph}
      communities={communities}
      height={460}
      variant="subtle"
    />
  );
}
`,Qt=`import type {
  NetworkGraphCommunity,
  NetworkGraphEdge,
  NetworkGraphNode,
} from "@cjlapao/ui-kit";

export const communities: NetworkGraphCommunity[] = [
  { id: "routing", label: "Routing", tone: "blue" },
  { id: "security", label: "Security", tone: "orange" },
  { id: "models", label: "Models", tone: "teal" },
  { id: "validation", label: "Validation", tone: "rose" },
  { id: "events", label: "Events", tone: "violet" },
  { id: "storage", label: "Storage", tone: "amber" },
];

/** Stable data: no random layout changes when controls rerender the example. */
export function makeNetwork(count: number) {
  const nodes: NetworkGraphNode[] = Array.from({ length: count }, (_, i) => ({
    id: \`node-\${i}\`,
    label: \`\${communities[i % communities.length].label} \${Math.floor(i / communities.length) + 1}\`,
    community: communities[i % communities.length].id,
    radius: i < communities.length ? 9 : i % 17 === 0 ? 6 : 3,
  }));
  const edges: NetworkGraphEdge[] = [];
  for (let i = 1; i < count; i++) {
    const parent = i < 6 ? 0 : (i % 6) + Math.floor(Math.floor(i / 6) / 3) * 6;
    edges.push({
      id: \`edge-\${i}\`,
      source: \`node-\${i}\`,
      target: \`node-\${Math.min(i - 1, parent)}\`,
    });
    if (i > 12 && i % 3 === 0)
      edges.push({
        id: \`bridge-\${i}\`,
        source: \`node-\${i}\`,
        target: \`node-\${Math.floor(i * 0.61)}\`,
      });
  }
  return { nodes, edges };
}
export const sample = makeNetwork(180);
`;function ln(){return e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ut,{name:"Network Graph",description:"Explore connected systems: a fast Canvas network with zoom, pan, community filters and path highlighting. Panel provides the surface, from a crisp outline to liquid glass; nodes and connectors use the same Tailwind tones as the rest of the kit. React only."}),e.jsx(Tt,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(de,{title:"Basics",description:"Supply positions for a deliberate layout, or omit them for deterministic community clusters. Select a node to highlight its neighbours.",code:Rt,filename:"Basics.tsx",children:e.jsx(Pt,{})}),e.jsx(de,{title:"Communities and selection",description:"Controlled filters and selection let the graph drive the rest of your application. Hiding a community also hides its connections; ungrouped nodes remain visible.",code:Bt,filename:"Communities.tsx",children:e.jsx(At,{})}),e.jsx(de,{title:"Trace a path",description:"Pass edge IDs to highlight any route. The optional findNetworkPath helper finds an unweighted, undirected shortest path; disconnected endpoints return an empty array.",code:Ot,filename:"Paths.tsx",children:e.jsx(_t,{})}),e.jsx(de,{title:"Surface variants",description:"These are real Panel surfaces. Glass stays transparent so the playground background, tone, opacity and vibrancy work as elsewhere in the kit.",code:Dt,filename:"Variants.tsx",children:e.jsx(Vt,{})}),e.jsx(de,{title:"Inspector panel",description:"Opt in with inspector to slide in a details panel when a node is selected — the same animated side-column pattern as AgentMap: the inspector rides a grid-column transition beside the graph card and grows with the same 0fr→1fr reveal. The details scroll above a pinned footer, and the clickable neighbour list gets its own scroll area when a node has many connections. renderInspectorBody and renderInspectorActions replace the body and the Center/Close buttons, which are styled by inspectorButtonVariant and inspectorButtonTone.",code:Xt,filename:"Inspector.tsx",children:e.jsx(Wt,{})}),e.jsx(de,{title:"2,000 nodes",description:"One HiDPI Canvas, on-demand frames, batched connectors, and spatial node picking. Idle graphs do not run animation loops. Labels are suppressed above 250 visible nodes except for the active node.",code:Kt,filename:"LargeNetwork.tsx",children:e.jsx(Yt,{})}),e.jsx(de,{title:"Example data",description:"The shared fixture used by the examples above. Stable IDs preserve selection; memoize generated data to avoid rebuilding the layout on parent renders.",code:Qt,filename:"data.ts",children:e.jsx("p",{className:"text-sm",children:"Six communities with hubs, branches, and cross-community connections."})})]}),e.jsx(ct,{props:[{name:"legendPanel / legendVariant / legendTone",type:'boolean / "auto" | SurfaceVariant / "auto" | TrueColor',default:'false / "auto" / "auto"',description:"Optionally wrap the legend in a Panel. Auto inherits the graph variant and tone; explicit values style the legend independently. Community colors remain tied to their data. Glass settings and corners follow the graph."},{name:"legendPosition",type:'"auto" | "right" | "bottom"',default:'"auto"',description:"Auto places the legend right when the component has at least 600px available width, then moves it below on narrower containers. Right and bottom force that placement."},{name:"inspector",type:"boolean",default:"false",description:"Reveal an animated details column when a node is selected, mirroring the AgentMap inspector: it lives outside the graph card and rides the same grid-column + 0fr→1fr animation. Details scroll above a pinned footer and the neighbour list gets its own scroll area when long. It docks beside the graph while the graph keeps its floor width, stacks underneath below that (see inspectorMinMainWidth / inspectorStackBelow), and closes on Escape, Close, or clicking empty canvas."},{name:"inspectorVariant / inspectorTone",type:'"auto" | SurfaceVariant / "auto" | SurfaceTone',default:'"auto" / "auto"',description:"Inspector Panel surface; auto inherits the graph variant and tone. Glass settings and corners follow the graph, like the legend Panel."},{name:"inspectorWidth / inspectorTitle",type:"number / ReactNode",default:'280 / kit "Inspector"',description:"Column width in pixels (clamped 180–480) when the inspector sits beside the graph, and the eyebrow label above the node name."},{name:"inspectorMinMainWidth / inspectorStackBelow",type:"number / number",default:"320 / fit-derived",description:"Where the inspector stops fitting beside the graph. It docks while the component is at least inspectorWidth + 16 + inspectorMinMainWidth wide (616 by default) and stacks under that floor — raise the floor when the graph needs more room. inspectorStackBelow replaces that comparison outright: 0 always docks, a large value always stacks."},{name:"inspectorButtonVariant / inspectorButtonTone / inspectorButtonWeight",type:"ButtonVariant / TrueColor / ButtonWeight",default:'"solid" / "slate" / —',description:'Style the built-in "Center on node" and "Close" footer buttons. Ignored when renderInspectorActions supplies custom actions.'},{name:"renderInspectorBody / renderInspectorActions",type:"(node, info) => ReactNode / (node, info, helpers) => ReactNode",description:"Replace the standard details body (community chip, id, connections, clickable neighbours) or the footer buttons. info adds label, community, connectionCount and neighbors; helpers expose centerOnNode() and close()."},{name:"nodes / edges",type:"readonly NetworkGraphNode[] / readonly NetworkGraphEdge[]",description:"Nodes: id, label, community, tone, x/y, radius. Edges: id, source, target, tone. IDs must be unique; first duplicate wins and edges with missing endpoints are ignored. Inputs are never mutated."},{name:"communities",type:"readonly NetworkGraphCommunity[]",description:"id, label and optional TrueColor tone. Unknown node communities are inferred. Node tone overrides community tone, which overrides the component tone."},{name:"variant / tone / corner",type:"SurfaceVariant / TrueColor / SurfaceCorner",default:'"elevated" / "blue" / "rounded-md"',description:"Shared Panel surface tokens, including glass, liquid-glass, outlined, tonal, subtle, simple and default."},{name:"glassOpacity / vibrancy / specularMode",type:"GlassOpacity / GlassVibrancy / PanelSpecularMode",description:"Passed directly to Panel; the graph canvas remains transparent."},{name:"selectedNodeId / defaultSelectedNodeId / onNodeSelect",type:"string | null / string | null / (node | null) => void",description:"Controlled or internal selection. Selected nodes and their neighbours stand out. Filtering hides a selection without discarding it."},{name:"visibleCommunityIds / onVisibleCommunitiesChange",type:"readonly string[] / (ids: string[]) => void",description:"Omit visibleCommunityIds for internal filtering. An empty array hides all grouped nodes."},{name:"highlightedEdgeIds",type:"readonly string[]",description:"Explicit path highlight. Unrelated connectors and nodes dim; matching visible edges and endpoints stand out."},{name:"height / showCommunities / showLabels / showControls",type:"number / boolean / boolean / boolean",default:"480 / true / false / true",description:"Viewport height in pixels (minimum 160). Labels appear for small graphs at useful zoom levels. Controls include zoom, fit, reset and node search."},{name:"onViewportChange",type:"(viewport: NetworkGraphViewport) => void",description:"Receives { x, y, zoom } after navigation or fitting. Zoom is bounded to 0.05–8."},{name:"loading / disabled / emptyMessage / ariaLabel",type:"boolean / boolean / ReactNode / string",description:"Panel loading and disabled treatments; localized empty state and accessible graph name. No graph interaction while loading or disabled."}]}),e.jsxs(dt,{children:[e.jsx(Re,{title:"Keyboard and screen readers",children:e.jsxs("p",{children:["The focusable graph uses arrow keys to browse visible nodes,"," ",e.jsx(W,{children:"Enter"})," or ",e.jsx(W,{children:"Space"})," to select, ",e.jsx(W,{children:"Escape"})," to clear,"," ",e.jsx(W,{children:"Home"})," to fit, and ",e.jsx(W,{children:"+"}),"/",e.jsx(W,{children:"−"})," to zoom. A live status names the active node and connection count. The searchable combobox offers up to 50 matches; refine the query for larger graphs. Community filters use native checkboxes."]})}),e.jsx(Re,{title:"Pointer and motion",children:e.jsxs("p",{children:["Drag to pan, hold Ctrl and scroll to zoom around the pointer, and click to select. Touch supports dragging and tapping; use the buttons to zoom. No animated physics or transitions are required; the optional inspector uses a short slide that honours"," ",e.jsx(W,{children:"prefers-reduced-motion"}),". Canvas rendering does not expose each connector as a DOM element."]})}),e.jsx(Re,{title:"Internationalization and layout",children:e.jsxs("p",{children:["Controls, instructions and status messages use"," ",e.jsx(W,{children:"kit.networkGraph.*"})," in all five built-in catalogs. Supply localized node and community labels. Automatic layout creates stable clusters, not a force simulation; provide ",e.jsx(W,{children:"x"}),"/",e.jsx(W,{children:"y"})," from your own layout engine when graph topology needs a specialized arrangement."]})})]})]})}export{ln as default};
