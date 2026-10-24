import{r as s,eS as ge,cf as Ge,j as e,t as we,P as ke,eT as Ee,p as de,C as ve}from"./index-gt012o8E.js";import{P as Pe,A as Te,a as fe,C as K}from"./A11ySections-zw3_3X-2.js";import{P as Re}from"./PageHeader-CzVhyXQL.js";import{E as oe}from"./ExampleCard-V3REeYJ5.js";import{P as $e,S as J,a as je,T as U}from"./PlaygroundPanel-Czrs7oXC.js";import{C as Ae}from"./ControlAccordion-DIXHht2n.js";import{u as Ve,E as Oe}from"./EventLog-Dx0vbma4.js";import{e as Ce,p as De}from"./options-CtADNKbm.js";const se=64,Be=(r,g)=>`${Math.floor(r/se)},${Math.floor(g/se)}`;function Fe(r,g,c=[]){const o=new Map(c.map(d=>[d.id,d]));for(const d of r)d.community&&!o.has(d.community)&&o.set(d.community,{id:d.community,label:d.community});const l=[...o.keys()],p=new Map(l.map((d,I)=>[d,I])),N=new Map,h=new Map,m=new Map,y=l.length>1?Math.max(160,Math.sqrt(r.length)*12):0;for(const d of r){if(h.has(d.id))continue;const I=d.community??"",$=N.get(I)??0;N.set(I,$+1);const u=$*Math.PI*(3-Math.sqrt(5)),i=(p.get(I)??0)/Math.max(1,l.length)*Math.PI*2,v=Math.sqrt($)*16,P={...d,x:Number.isFinite(d.x)&&Number.isFinite(d.y)?d.x:Math.cos(i)*y+Math.cos(u)*v,y:Number.isFinite(d.x)&&Number.isFinite(d.y)?d.y:Math.sin(i)*y+Math.sin(u)*v,radius:Number.isFinite(d.radius)?Math.max(1,Math.min(40,d.radius)):4};h.set(d.id,P);const G=Be(P.x,P.y),f=m.get(G)??[];f.push(P),m.set(G,f)}const x=new Set,k=[],M=new Map;for(const d of g){const I=h.get(d.source),$=h.get(d.target);if(!(!I||!$||x.has(d.id))){x.add(d.id),k.push({...d,from:I,to:$});for(const[u,i]of[[I.id,$.id],[$.id,I.id]]){const v=M.get(u)??new Set;v.add(i),M.set(u,v)}}}return{nodes:[...h.values()],edges:k,byId:h,groups:[...o.values()],adjacency:M,buckets:m}}const Ne=r=>Math.max(.05,Math.min(8,r));function He(r,g,c,o){const l=Ne(r.zoom*g),p=l/r.zoom;return{x:c-(c-r.x)*p,y:o-(o-r.y)*p,zoom:l}}function qe(r,g,c){if(!r.length)return{x:g/2,y:c/2,zoom:1};let o=1/0,l=1/0,p=-1/0,N=-1/0;for(const m of r)o=Math.min(o,m.x-m.radius),p=Math.max(p,m.x+m.radius),l=Math.min(l,m.y-m.radius),N=Math.max(N,m.y+m.radius);const h=Ne(Math.min(Math.max(1,g-64)/Math.max(1,p-o),Math.max(1,c-64)/Math.max(1,N-l),2));return{x:g/2-(o+p)/2*h,y:c/2-(l+N)/2*h,zoom:h}}function Xe(r,g,c,o,l){const p=Math.max(40,8/l);let N,h=1/0;for(let m=Math.floor((c-p)/se);m<=Math.floor((c+p)/se);m++)for(let y=Math.floor((o-p)/se);y<=Math.floor((o+p)/se);y++)for(const x of r.buckets.get(`${m},${y}`)??[]){if(!g.has(x.id))continue;const k=Math.hypot(x.x-c,x.y-o);k<=Math.max(x.radius,8/l)&&k<h&&(N=x,h=k)}return N}function Me(r,g,c){const o=new Map;for(const h of r)for(const[m,y]of[[h.source,h.target],[h.target,h.source]]){const x=o.get(m)??[];x.push({node:y,edge:h.id}),o.set(m,x)}const l=new Map,p=[g],N=new Set(p);for(let h=0;h<p.length;h++){const m=p[h];if(m===c){const y=[];let x=c;for(;x!==g;){const k=l.get(x);y.push(k.edge),x=k.node}return y.reverse()}for(const y of o.get(m)??[])N.has(y.node)||(N.add(y.node),l.set(y.node,{node:m,edge:y.edge}),p.push(y.node))}return[]}function Ye(r){const g=s.useRef(null),c=s.useRef({x:0,y:0,zoom:1}),o=s.useRef({width:1,height:1}),l=s.useRef(r),p=s.useRef(null),[N,h]=s.useState(1),m=s.useRef(new Map),y=s.useRef("#737373"),x=s.useCallback(()=>{const u=g.current,i=u?.getContext("2d");if(!u||!i)return;const{model:v,nodes:P,visible:G,selected:f,focused:T,highlighted:E,tone:D,showLabels:w}=l.current,{width:F,height:X}=o.current,C=c.current,H=Math.min(window.devicePixelRatio||1,2);(u.width!==Math.round(F*H)||u.height!==Math.round(X*H))&&(u.width=Math.round(F*H),u.height=Math.round(X*H)),i.setTransform(H,0,0,H,0,0),i.clearRect(0,0,F,X),i.translate(C.x,C.y),i.scale(C.zoom,C.zoom);const Y=new Map(v.groups.map(n=>[n.id,n.tone])),b=n=>m.current.get(n)??ge[n],_=n=>n.tone??Y.get(n.community??"")??D,ee=f!==null?v.adjacency.get(f):void 0,q=new Set;if(E.size)for(const n of v.edges)E.has(n.id)&&(q.add(n.source),q.add(n.target));const W=new Map;for(const n of v.edges){if(!G.has(n.source)||!G.has(n.target))continue;const R=E.has(n.id)||f!==null&&(n.source===f||n.target===f),S=b(n.tone??_(n.from)),Z=`${S}:${R}`,B=W.get(Z)??{color:S,active:R,edges:[]};B.edges.push(n),W.set(Z,B)}for(const n of[!1,!0])for(const R of W.values())if(R.active===n){i.beginPath(),i.strokeStyle=R.color,i.globalAlpha=n?.95:f!==null||E.size?.08:.28,i.lineWidth=(n?1.8:.7)/C.zoom;for(const S of R.edges)S.source===S.target?(i.moveTo(S.from.x+12,S.from.y-10),i.arc(S.from.x,S.from.y-10,12,0,Math.PI*2)):(i.moveTo(S.from.x,S.from.y),i.lineTo(S.to.x,S.to.y));i.stroke()}for(const n of P){const R=n.x*C.zoom+C.x,S=n.y*C.zoom+C.y;if(R<-50||R>F+50||S<-50||S>X+50)continue;const Z=n.id===f||n.id===T||ee?.has(n.id)||q.has(n.id);i.globalAlpha=f!==null||E.size?Z?1:.22:1,i.fillStyle=b(_(n)),i.beginPath(),i.arc(n.x,n.y,Math.max(n.radius,1.5/C.zoom),0,Math.PI*2),i.fill(),(n.id===f||n.id===T)&&(i.strokeStyle=b(_(n)),i.lineWidth=1.5/C.zoom,i.beginPath(),i.arc(n.x,n.y,n.radius+4/C.zoom,0,Math.PI*2),i.stroke()),(n.id===f||n.id===T||w&&C.zoom>=.8&&P.length<=250)&&(i.globalAlpha=1,i.fillStyle=y.current,i.font=`${12/C.zoom}px sans-serif`,i.fillText(n.label??n.id,n.x+n.radius+7/C.zoom,n.y+4/C.zoom))}i.globalAlpha=1},[]),k=s.useCallback(()=>{p.current===null&&(p.current=requestAnimationFrame(()=>{p.current=null,x()}))},[x]),M=s.useCallback(u=>{c.current=u,h(u.zoom),k(),l.current.onViewportChange?.({...u})},[k]),d=s.useCallback(()=>M(qe(l.current.nodes,o.current.width,o.current.height)),[M]),I=s.useCallback((u,i=o.current.width/2,v=o.current.height/2)=>M(He(c.current,u,i,v)),[M]),$=s.useCallback(u=>{M({...c.current,x:o.current.width/2-u.x*c.current.zoom,y:o.current.height/2-u.y*c.current.zoom})},[M]);return s.useEffect(()=>{l.current=r,k()},[r,k]),s.useEffect(()=>{d()},[r.model,d]),s.useEffect(()=>{const u=g.current;if(!u)return;const i=()=>{const f=u.getBoundingClientRect(),T=o.current;o.current={width:Math.max(1,f.width),height:Math.max(1,f.height)},T.width===1?d():M({...c.current,x:c.current.x+(o.current.width-T.width)/2,y:c.current.y+(o.current.height-T.height)/2})},v=()=>{const f=getComputedStyle(u),T=!!u.closest(".dark");m.current=new Map(Object.keys(ge).map(E=>[E,f.getPropertyValue(`--color-${E}-${T?400:600}`).trim()||ge[E]])),y.current=f.color,k()},P=new ResizeObserver(i);P.observe(u),i(),v();const G=new MutationObserver(v);for(let f=u;f;f=f.parentElement)G.observe(f,{attributes:!0,attributeFilter:["class","style"]});return window.addEventListener("resize",i),()=>{P.disconnect(),G.disconnect(),window.removeEventListener("resize",i),p.current!==null&&cancelAnimationFrame(p.current),p.current=null}},[d,M,k,r.active]),{canvasRef:g,view:c,zoom:N,update:M,fit:d,zoomBy:I,focusNode:$}}const Ke=[],Ue=[];function ae({nodes:r,edges:g,communities:c=Ke,height:o=480,selectedNodeId:l,defaultSelectedNodeId:p=null,onNodeSelect:N,visibleCommunityIds:h,onVisibleCommunitiesChange:m,highlightedEdgeIds:y=Ue,showCommunities:x=!0,legendPosition:k="auto",legendPanel:M=!1,legendVariant:d="auto",legendTone:I="auto",showLabels:$=!1,showControls:u=!0,ariaLabel:i,emptyMessage:v,onViewportChange:P,tone:G="blue",variant:f="elevated",disabled:T=!1,loading:E=!1,...D}){const w=Ge(),F=s.useId(),X=s.useRef(null),[C,H]=s.useState(!0),Y=k==="right"||k==="auto"&&C;s.useEffect(()=>{const t=X.current;if(!t||k!=="auto")return;const a=()=>H(t.getBoundingClientRect().width>=600);a();const z=new ResizeObserver(a);return z.observe(t),()=>z.disconnect()},[k,E]);const b=s.useMemo(()=>Fe(r,g,c),[r,g,c]),[_,ee]=s.useState(p),[q,W]=s.useState(()=>new Set),[n,R]=s.useState(null),[S,Z]=s.useState(""),B=s.useMemo(()=>new Set(h??b.groups.filter(t=>!q.has(t.id)).map(t=>t.id)),[h,b,q]),A=s.useMemo(()=>b.nodes.filter(t=>!t.community||B.has(t.community)),[b,B]),te=s.useMemo(()=>new Set(A.map(t=>t.id)),[A]),he=l===void 0?_:l,me=he!==null&&te.has(he)?he:null,ie=n!==null&&te.has(n)?n:null,Se=s.useMemo(()=>new Set(y),[y]),ze=s.useMemo(()=>{const t=new Map;for(const a of b.nodes)a.community&&t.set(a.community,(t.get(a.community)??0)+1);return t},[b]),j=Ye({active:!E,model:b,nodes:A,visible:te,selected:me,focused:ie,highlighted:Se,tone:G,showLabels:$,onViewportChange:P}),L=T||E,Q=s.useRef(null),re=t=>{L||(l===void 0&&ee(t),N?.(t===null?null:b.byId.get(t)??null))},be=t=>{L||(h===void 0&&W(new Set(b.groups.filter(a=>!t.includes(a.id)).map(a=>a.id))),m?.(t))};s.useEffect(()=>{const t=j.canvasRef.current;if(!t||L)return;const a=z=>{if(!z.ctrlKey)return;z.preventDefault();const V=t.getBoundingClientRect();j.zoomBy(Math.exp(-Math.max(-100,Math.min(100,z.deltaY))*.008),z.clientX-V.left,z.clientY-V.top)};return t.addEventListener("wheel",a,{passive:!1}),()=>t.removeEventListener("wheel",a)},[j.canvasRef,j.zoomBy,L]);const Ie=t=>{if(L||t.altKey||t.ctrlKey||t.metaKey)return;const a=A.findIndex(z=>z.id===(ie??me));if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(t.key)){t.preventDefault();const z=t.key==="ArrowLeft"||t.key==="ArrowUp"?-1:1,V=a<0?z>0?0:A.length-1:(a+z+A.length)%A.length,ne=A[V];ne&&(R(ne.id),j.focusNode(ne))}else t.key==="Enter"||t.key===" "?(t.preventDefault(),ie!==null&&re(ie)):t.key==="Escape"?(t.preventDefault(),R(null),re(null)):t.key==="Home"?(t.preventDefault(),j.fit()):t.key==="+"||t.key==="="?(t.preventDefault(),j.zoomBy(1.25)):t.key==="-"&&(t.preventDefault(),j.zoomBy(.8))},le=b.byId.get(ie??me??""),Le=s.useMemo(()=>{const t=S.toLocaleLowerCase();return A.filter(a=>(a.label??a.id).toLocaleLowerCase().includes(t)).slice(0,50).map(a=>({value:a.id,label:a.label??a.id}))},[A,S]),ce=Number.isFinite(o)?Math.max(160,o):480,pe=I==="auto"?G:I,ye=e.jsxs("fieldset",{disabled:L,className:"flex min-w-0 shrink-0 flex-col gap-3 overflow-auto",style:{maxHeight:M?Math.max(96,ce-64):ce},children:[e.jsx("legend",{className:"mb-3 text-xs font-semibold uppercase tracking-widest",children:w("kit.networkGraph.communities")}),e.jsx(we,{size:"sm",tone:pe,label:w("kit.networkGraph.selectAll"),checked:b.groups.every(t=>B.has(t.id)),indeterminate:b.groups.some(t=>B.has(t.id))&&!b.groups.every(t=>B.has(t.id)),onChange:t=>be(t.target.checked?b.groups.map(a=>a.id):[])}),b.groups.map(t=>e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx(we,{size:"sm",tone:t.tone??pe,label:t.label,checked:B.has(t.id),onChange:a=>be(a.target.checked?[...B,t.id]:[...B].filter(z=>z!==t.id))}),e.jsx("span",{className:"text-xs tabular-nums opacity-60",children:ze.get(t.id)??0})]},t.id))]});return e.jsx(ke,{...D,tone:G,variant:f,padding:"sm",disabled:T,loading:E,clickable:!1,scrollable:!1,children:e.jsxs("div",{className:"flex min-w-0 flex-col gap-3",role:"group","aria-label":i??w("kit.networkGraph.name"),"aria-disabled":L||void 0,children:[u&&e.jsx("div",{className:"flex flex-wrap items-center gap-2",children:e.jsx("div",{className:"min-w-40 flex-1",children:e.jsx(Ee,{size:"sm",tone:G,value:S,onChange:Z,disabled:L,options:Le,"aria-label":w("kit.networkGraph.findNode"),placeholder:w("kit.networkGraph.findNode"),onSelect:t=>{const a=b.byId.get(t.value);a&&(re(a.id),R(a.id),Z(a.label??a.id),j.focusNode(a))}})})}),e.jsxs("div",{ref:X,className:"flex min-w-0 gap-4",style:{flexDirection:Y?"row":"column"},"data-legend-position":Y?"right":"bottom",children:[e.jsxs("div",{className:"relative min-w-0 flex-1",style:{height:ce,minHeight:ce},children:[e.jsx("canvas",{ref:j.canvasRef,className:`block h-full w-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-${G}-500 ${L?"":"cursor-grab active:cursor-grabbing"}`,style:{touchAction:L?"auto":"none"},tabIndex:L?-1:0,role:"application","aria-roledescription":w("kit.networkGraph.name"),"aria-label":i??w("kit.networkGraph.name"),"aria-describedby":F,onKeyDown:Ie,onPointerDown:t=>{L||t.button!==0||Q.current||(t.currentTarget.focus(),t.currentTarget.setPointerCapture(t.pointerId),Q.current={id:t.pointerId,x:t.clientX,y:t.clientY,originX:t.clientX,originY:t.clientY,moved:!1})},onPointerMove:t=>{const a=Q.current;if(L||!a||a.id!==t.pointerId)return;const z=t.clientX-a.x,V=t.clientY-a.y;a.moved||=Math.hypot(t.clientX-a.originX,t.clientY-a.originY)>4,a.moved&&j.update({...j.view.current,x:j.view.current.x+z,y:j.view.current.y+V}),a.x=t.clientX,a.y=t.clientY},onPointerUp:t=>{const a=Q.current;if(!a||a.id!==t.pointerId||(Q.current=null,t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId),L||a.moved))return;const z=t.currentTarget.getBoundingClientRect(),V=j.view.current,ne=Xe(b,te,(t.clientX-z.left-V.x)/V.zoom,(t.clientY-z.top-V.y)/V.zoom,V.zoom);R(ne?.id??null),re(ne?.id??null)},onPointerCancel:()=>{Q.current=null},onLostPointerCapture:()=>{Q.current=null}}),u&&e.jsxs("div",{className:"absolute bottom-3 right-3 z-10 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white/90 p-1 shadow-sm backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/90",children:[e.jsx(de,{icon:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[e.jsx("path",{d:"M4 9V5a1 1 0 0 1 1-1h4"}),e.jsx("path",{d:"M15 4h4a1 1 0 0 1 1 1v4"}),e.jsx("path",{d:"M20 15v4a1 1 0 0 1-1 1h-4"}),e.jsx("path",{d:"M9 20H5a1 1 0 0 1-1-1v-4"})]}),size:"xs",variant:"ghost",color:"slate",disabled:L,srLabel:w("kit.networkGraph.fit"),tooltip:w("kit.networkGraph.fit"),onClick:j.fit}),e.jsx(de,{icon:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round","aria-hidden":"true",children:e.jsx("path",{d:"M6 12h12"})}),size:"xs",variant:"ghost",color:"slate",disabled:L||j.zoom<=.05,srLabel:w("kit.networkGraph.zoomOut"),tooltip:w("kit.networkGraph.zoomOut"),onClick:()=>j.zoomBy(.8)}),e.jsxs("span",{className:"min-w-[3.5ch] px-1 text-center text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400","aria-label":w("kit.networkGraph.zoom"),children:[Math.round(j.zoom*100),"%"]}),e.jsx(de,{icon:"Add",size:"xs",variant:"ghost",color:"slate",disabled:L||j.zoom>=8,srLabel:w("kit.networkGraph.zoomIn"),tooltip:w("kit.networkGraph.zoomIn"),onClick:()=>j.zoomBy(1.25)}),e.jsx(de,{icon:"Reset",size:"xs",variant:"ghost",color:"slate",disabled:L,srLabel:w("kit.networkGraph.reset"),tooltip:w("kit.networkGraph.reset"),onClick:()=>{re(null),R(null),j.fit()}})]}),!A.length&&e.jsx("div",{className:"pointer-events-none absolute inset-0 flex items-center justify-center text-sm",children:v??w("kit.networkGraph.empty")})]}),x&&b.groups.length>0&&e.jsx("div",{className:"min-w-0 shrink-0",style:{width:Y?M?224:192:"100%"},children:M?e.jsx(ke,{variant:d==="auto"?f:d,tone:pe,padding:"xs",corner:D.corner,glassOpacity:D.glassOpacity,vibrancy:D.vibrancy,specularMode:D.specularMode,scrollable:!1,children:ye}):ye})]}),e.jsx("p",{id:F,className:"text-xs opacity-70",children:w("kit.networkGraph.instructions")}),e.jsx("p",{role:"status","aria-live":"polite","aria-atomic":"true",className:"text-xs",children:le?w("kit.networkGraph.nodeStatus",{label:le.label??le.id,count:b.adjacency.get(le.id)?.size??0}):w("kit.networkGraph.summary",{nodes:A.length,edges:b.edges.filter(t=>te.has(t.source)&&te.has(t.target)).length})})]})})}const O=[{id:"routing",label:"Routing",tone:"blue"},{id:"security",label:"Security",tone:"orange"},{id:"models",label:"Models",tone:"teal"},{id:"validation",label:"Validation",tone:"rose"},{id:"events",label:"Events",tone:"violet"},{id:"storage",label:"Storage",tone:"amber"}];function ue(r){const g=Array.from({length:r},(o,l)=>({id:`node-${l}`,label:`${O[l%O.length].label} ${Math.floor(l/O.length)+1}`,community:O[l%O.length].id,radius:l<O.length?9:l%17===0?6:3})),c=[];for(let o=1;o<r;o++){const l=o<6?0:o%6+Math.floor(Math.floor(o/6)/3)*6;c.push({id:`edge-${o}`,source:`node-${o}`,target:`node-${Math.min(o-1,l)}`}),o>12&&o%3===0&&c.push({id:`bridge-${o}`,source:`node-${o}`,target:`node-${Math.floor(o*.61)}`})}return{nodes:g,edges:c}}const xe=ue(180);function _e(){const[r,g]=s.useState("glass"),[c,o]=s.useState("blue"),[l,p]=s.useState("rounded-md"),[N,h]=s.useState("frosted"),[m,y]=s.useState("medium"),[x,k]=s.useState("180"),[M,d]=s.useState("auto"),[I,$]=s.useState(!1),[u,i]=s.useState("auto"),[v,P]=s.useState("auto"),[G,f]=s.useState(!0),[T,E]=s.useState(!1),[D,w]=s.useState(!1),[F,X]=s.useState(!1),[C,H]=s.useState(!1),[Y,b]=s.useState(!1),[_,ee]=Ve(),q=s.useMemo(()=>ue(Y?0:Number(x)),[x,Y]),W=s.useMemo(()=>D?Me(q.edges,"node-22",`node-${Number(x)-1}`):[],[D,q,x]);return e.jsx($e,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Ae,{groups:[{id:"appearance",title:"Appearance",controls:e.jsxs(e.Fragment,{children:[e.jsx(J,{label:"Variant",value:r,options:Ce,onChange:n=>g(n)}),e.jsx(je,{label:"Tone",children:e.jsx(ve,{selectable:!0,size:"sm",value:c,onSelect:o,defaultExpanded:!0})}),e.jsx(J,{label:"Corner",value:l,options:De,onChange:n=>p(n)}),e.jsx(J,{label:"Glass opacity",value:String(N),options:[{label:"Clear",value:"clear"},{label:"Frosted",value:"frosted"},{label:"Light",value:"light"}],onChange:n=>h(n)}),e.jsx(J,{label:"Vibrancy",value:String(m),options:[{label:"Low",value:"low"},{label:"Medium",value:"medium"},{label:"High",value:"high"}],onChange:n=>y(n)})]})},{id:"network",title:"Network",controls:e.jsxs(e.Fragment,{children:[e.jsx(J,{label:"Nodes",value:x,options:[{label:"60 nodes",value:"60"},{label:"180 nodes",value:"180"},{label:"2,000 nodes",value:"2000"}],onChange:k}),e.jsx(U,{label:"Legend panel",checked:I,onChange:$}),e.jsx(J,{label:"Legend variant",value:u,options:[{label:"Auto (parent)",value:"auto"},...Ce],onChange:n=>i(n)}),e.jsxs(je,{label:"Legend tone",children:[e.jsx(U,{label:"Follow parent tone",checked:v==="auto",onChange:n=>P(n?"auto":c)}),v!=="auto"&&e.jsx(ve,{selectable:!0,size:"sm",value:v,onSelect:P,defaultExpanded:!0})]}),e.jsx(J,{label:"Legend position",value:M,options:[{label:"Auto",value:"auto"},{label:"Right",value:"right"},{label:"Bottom",value:"bottom"}],onChange:n=>d(n)}),e.jsx(U,{label:"Community legend",checked:G,onChange:f}),e.jsx(U,{label:"Node labels",checked:T,onChange:E}),e.jsx(U,{label:"Highlight a path",checked:D,onChange:w})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(U,{label:"Disabled",checked:F,onChange:X}),e.jsx(U,{label:"Loading",checked:C,onChange:H}),e.jsx(U,{label:"Empty",checked:Y,onChange:b})]})}]}),e.jsx(Oe,{log:_})]}),preview:e.jsx(ae,{...q,communities:O,variant:r,tone:c,corner:l,glassOpacity:N,vibrancy:m,height:440,showCommunities:G,legendPosition:M,legendPanel:I,legendVariant:u,legendTone:v,showLabels:T,highlightedEdgeIds:W,disabled:F,loading:C,onNodeSelect:n=>ee(`Selected: ${n?.label??"none"}`),onVisibleCommunitiesChange:n=>ee(`Communities: ${n.length}`)})})}const We=[{id:"input",label:"Input",x:-150,y:0,tone:"blue",radius:8},{id:"encode",label:"Encode",x:0,y:-70,tone:"teal"},{id:"context",label:"Context",x:0,y:70,tone:"amber"},{id:"output",label:"Output",x:150,y:0,tone:"violet",radius:8}],Ze=[{id:"a",source:"input",target:"encode"},{id:"b",source:"input",target:"context"},{id:"c",source:"encode",target:"output"},{id:"d",source:"context",target:"output"}];function Qe(){return e.jsx(ae,{nodes:We,edges:Ze,height:260,showLabels:!0,variant:"outlined",ariaLabel:"Encoding network"})}const Je=`import { NetworkGraph } from "@cjlapao/ui-kit";

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
`;function et(){const[r,g]=s.useState(O.map(l=>l.id)),[c,o]=s.useState(null);return e.jsx(ae,{...xe,communities:O,height:380,variant:"glass",visibleCommunityIds:r,onVisibleCommunitiesChange:g,selectedNodeId:c,onNodeSelect:l=>o(l?.id??null)})}const tt=`import { useState } from "react";
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
`;function nt(){const[r,g]=s.useState("node-179"),c=s.useMemo(()=>Me(xe.edges,"node-22",r),[r]);return e.jsxs("div",{className:"space-y-3",children:[e.jsx("p",{className:"text-sm",children:"Select a destination to trace an unweighted, undirected shortest path from Models 4."}),e.jsx(ae,{...xe,communities:O,highlightedEdgeIds:c,selectedNodeId:null,onNodeSelect:o=>{o&&g(o.id)},height:360,variant:"tonal",tone:"teal"})]})}const ot=`import { useMemo, useState } from "react";
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
`,st=ue(48);function at(){return e.jsx("div",{className:"grid gap-4 md:grid-cols-2",children:["outlined","tonal","glass","liquid-glass"].map(r=>e.jsx(ae,{...st,communities:O,title:r,variant:r,tone:"violet",height:220,showCommunities:!1,showControls:!1},r))})}const it=`import { NetworkGraph } from "@cjlapao/ui-kit";
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
`,rt=ue(2e3);function lt(){return e.jsx(ae,{...rt,communities:O,height:460,variant:"subtle"})}const ct=`import { NetworkGraph } from "@cjlapao/ui-kit";
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
`,dt=`import type {
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
`;function yt(){return e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Re,{name:"Network Graph",description:"Explore connected systems: a fast Canvas network with zoom, pan, community filters and path highlighting. Panel provides the surface, from a crisp outline to liquid glass; nodes and connectors use the same Tailwind tones as the rest of the kit. React only."}),e.jsx(_e,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(oe,{title:"Basics",description:"Supply positions for a deliberate layout, or omit them for deterministic community clusters. Select a node to highlight its neighbours.",code:Je,filename:"Basics.tsx",children:e.jsx(Qe,{})}),e.jsx(oe,{title:"Communities and selection",description:"Controlled filters and selection let the graph drive the rest of your application. Hiding a community also hides its connections; ungrouped nodes remain visible.",code:tt,filename:"Communities.tsx",children:e.jsx(et,{})}),e.jsx(oe,{title:"Trace a path",description:"Pass edge IDs to highlight any route. The optional findNetworkPath helper finds an unweighted, undirected shortest path; disconnected endpoints return an empty array.",code:ot,filename:"Paths.tsx",children:e.jsx(nt,{})}),e.jsx(oe,{title:"Surface variants",description:"These are real Panel surfaces. Glass stays transparent so the playground background, tone, opacity and vibrancy work as elsewhere in the kit.",code:it,filename:"Variants.tsx",children:e.jsx(at,{})}),e.jsx(oe,{title:"2,000 nodes",description:"One HiDPI Canvas, on-demand frames, batched connectors, and spatial node picking. Idle graphs do not run animation loops. Labels are suppressed above 250 visible nodes except for the active node.",code:ct,filename:"LargeNetwork.tsx",children:e.jsx(lt,{})}),e.jsx(oe,{title:"Example data",description:"The shared fixture used by the examples above. Stable IDs preserve selection; memoize generated data to avoid rebuilding the layout on parent renders.",code:dt,filename:"data.ts",children:e.jsx("p",{className:"text-sm",children:"Six communities with hubs, branches, and cross-community connections."})})]}),e.jsx(Pe,{props:[{name:"legendPanel / legendVariant / legendTone",type:'boolean / "auto" | SurfaceVariant / "auto" | TrueColor',default:'false / "auto" / "auto"',description:"Optionally wrap the legend in a Panel. Auto inherits the graph variant and tone; explicit values style the legend independently. Community colors remain tied to their data. Glass settings and corners follow the graph."},{name:"legendPosition",type:'"auto" | "right" | "bottom"',default:'"auto"',description:"Auto places the legend right when the component has at least 600px available width, then moves it below on narrower containers. Right and bottom force that placement."},{name:"nodes / edges",type:"readonly NetworkGraphNode[] / readonly NetworkGraphEdge[]",description:"Nodes: id, label, community, tone, x/y, radius. Edges: id, source, target, tone. IDs must be unique; first duplicate wins and edges with missing endpoints are ignored. Inputs are never mutated."},{name:"communities",type:"readonly NetworkGraphCommunity[]",description:"id, label and optional TrueColor tone. Unknown node communities are inferred. Node tone overrides community tone, which overrides the component tone."},{name:"variant / tone / corner",type:"SurfaceVariant / TrueColor / SurfaceCorner",default:'"elevated" / "blue" / "rounded-md"',description:"Shared Panel surface tokens, including glass, liquid-glass, outlined, tonal, subtle, simple and default."},{name:"glassOpacity / vibrancy / specularMode",type:"GlassOpacity / GlassVibrancy / PanelSpecularMode",description:"Passed directly to Panel; the graph canvas remains transparent."},{name:"selectedNodeId / defaultSelectedNodeId / onNodeSelect",type:"string | null / string | null / (node | null) => void",description:"Controlled or internal selection. Selected nodes and their neighbours stand out. Filtering hides a selection without discarding it."},{name:"visibleCommunityIds / onVisibleCommunitiesChange",type:"readonly string[] / (ids: string[]) => void",description:"Omit visibleCommunityIds for internal filtering. An empty array hides all grouped nodes."},{name:"highlightedEdgeIds",type:"readonly string[]",description:"Explicit path highlight. Unrelated connectors and nodes dim; matching visible edges and endpoints stand out."},{name:"height / showCommunities / showLabels / showControls",type:"number / boolean / boolean / boolean",default:"480 / true / false / true",description:"Viewport height in pixels (minimum 160). Labels appear for small graphs at useful zoom levels. Controls include zoom, fit, reset and node search."},{name:"onViewportChange",type:"(viewport: NetworkGraphViewport) => void",description:"Receives { x, y, zoom } after navigation or fitting. Zoom is bounded to 0.05–8."},{name:"loading / disabled / emptyMessage / ariaLabel",type:"boolean / boolean / ReactNode / string",description:"Panel loading and disabled treatments; localized empty state and accessible graph name. No graph interaction while loading or disabled."}]}),e.jsxs(Te,{children:[e.jsx(fe,{title:"Keyboard and screen readers",children:e.jsxs("p",{children:["The focusable graph uses arrow keys to browse visible nodes,"," ",e.jsx(K,{children:"Enter"})," or ",e.jsx(K,{children:"Space"})," to select, ",e.jsx(K,{children:"Escape"})," to clear,"," ",e.jsx(K,{children:"Home"})," to fit, and ",e.jsx(K,{children:"+"}),"/",e.jsx(K,{children:"−"})," to zoom. A live status names the active node and connection count. The searchable combobox offers up to 50 matches; refine the query for larger graphs. Community filters use native checkboxes."]})}),e.jsx(fe,{title:"Pointer and motion",children:e.jsx("p",{children:"Drag to pan, hold Ctrl and scroll to zoom around the pointer, and click to select. Touch supports dragging and tapping; use the buttons to zoom. No animated physics or transitions are required. Canvas rendering does not expose each connector as a DOM element."})}),e.jsx(fe,{title:"Internationalization and layout",children:e.jsxs("p",{children:["Controls, instructions and status messages use"," ",e.jsx(K,{children:"kit.networkGraph.*"})," in all five built-in catalogs. Supply localized node and community labels. Automatic layout creates stable clusters, not a force simulation; provide ",e.jsx(K,{children:"x"}),"/",e.jsx(K,{children:"y"})," from your own layout engine when graph topology needs a specialized arrangement."]})})]})]})}export{yt as default};
