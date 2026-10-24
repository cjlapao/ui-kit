import{j as e,f as o,dA as fe,D as P,cb as _e,dB as $e,dC as We,i as Ee,b$ as be,dD as De,dk as Re,r as c,P as B,dl as Le,M as Z,c as Pe}from"./index-gt012o8E.js";import{P as Me}from"./PageHeader-CzVhyXQL.js";import{E as F}from"./ExampleCard-V3REeYJ5.js";import{P as Oe,a as J,S as W,T as E}from"./PlaygroundPanel-Czrs7oXC.js";import{C as Ve}from"./ControlAccordion-DIXHht2n.js";import{a7 as Fe,e as Ue,a0 as ue,p as me,f as Be,l as qe,m as ze,n as Ye}from"./options-CtADNKbm.js";const g=({width:t,className:n})=>e.jsx("span",{className:o("block h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800",n),style:{width:t}}),ke=()=>e.jsx("span",{className:"h-5 w-5 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800"}),Ge=({hasIcon:t=!1,iconCorner:n=P})=>e.jsxs("div",{className:"mb-5 flex animate-pulse flex-wrap items-start justify-between gap-3 motion-reduce:animate-none",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[t&&e.jsx(g,{width:"3rem",className:o("h-12",fe(n))}),e.jsxs("div",{className:"space-y-3",children:[e.jsx(g,{width:"11rem",className:"h-2"}),e.jsx(g,{width:"16rem",className:"h-6"})]})]}),e.jsx(g,{width:"9rem",className:"h-6 rounded-full"})]}),Qe=({rows:t=6})=>e.jsxs("div",{className:"animate-pulse motion-reduce:animate-none",children:[e.jsxs("div",{className:"border-b border-neutral-200 px-5 pb-4 pt-5 dark:border-neutral-800",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(g,{width:"4.5rem"}),e.jsx(g,{width:"2rem"})]}),e.jsx("span",{className:"mt-3 block h-1 w-full rounded-full bg-neutral-200 dark:bg-neutral-800"}),e.jsx(g,{width:"80%",className:"mt-3"})]}),e.jsx("div",{className:"space-y-5 px-5 py-5",children:Array.from({length:t}).map((n,s)=>e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx(ke,{}),e.jsxs("div",{className:"flex-1 space-y-2",children:[e.jsx(g,{width:s%2===0?"62%":"48%"}),e.jsx(g,{width:"34%",className:"h-2"})]})]},s))})]}),He=()=>e.jsxs("div",{className:"animate-pulse motion-reduce:animate-none",children:[e.jsxs("div",{className:"space-y-4 px-5 pb-6 pt-5 sm:px-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(g,{width:"6rem"}),e.jsx(g,{width:"4rem"})]}),e.jsx(g,{width:"45%",className:"h-5"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(g,{width:"92%",className:"h-2"}),e.jsx(g,{width:"70%",className:"h-2"})]}),e.jsxs("div",{className:"flex gap-10 pt-2",children:[e.jsx(g,{width:"5rem"}),e.jsx(g,{width:"6rem"}),e.jsx(g,{width:"4rem"})]})]}),e.jsx("div",{className:"border-y border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-white/5 sm:px-6",children:e.jsx(g,{width:"5rem"})}),e.jsx("div",{className:"divide-y divide-neutral-200 dark:divide-neutral-800",children:Array.from({length:3}).map((t,n)=>e.jsxs("div",{className:"flex items-center gap-3 px-5 py-4 sm:px-6",children:[e.jsx(ke,{}),e.jsx(g,{width:n===1?"38%":"30%"}),e.jsx("span",{className:"flex-1"}),e.jsx(g,{width:"3rem"})]},n))})]}),Ke=t=>_e(t).translucent,Ze={translucent:!1,border:"border-neutral-200 dark:border-neutral-800",divider:"divide-neutral-200 dark:divide-neutral-800",strip:"bg-neutral-50 dark:bg-white/5",nestedBox:"border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-white/5",nodeFill:"bg-white dark:bg-neutral-900",chip:"bg-white dark:bg-neutral-900",faintText:"text-neutral-400 dark:text-neutral-500",mutedText:"text-neutral-500 dark:text-neutral-400"},Je={translucent:!0,border:"border-white/30 dark:border-white/10",divider:"divide-white/25 dark:divide-white/10",strip:"bg-white/20 dark:bg-white/5",nestedBox:"border border-white/30 bg-white/20 dark:border-white/10 dark:bg-white/5",nodeFill:"bg-white/60 dark:bg-neutral-900/50",chip:"bg-white/70 dark:bg-neutral-900/60",faintText:"text-neutral-600 dark:text-neutral-200",mutedText:"text-neutral-700 dark:text-neutral-100"},re=t=>t?Je:Ze,Xe=(t,n)=>n?`bg-${t}-50/50 dark:bg-${t}-500/15`:`bg-${t}-50 dark:bg-white/5`,et=["done","in_progress","running","skipped","blocked","attention","not_started"],S=t=>et.includes(t)?t:"not_started",U=(t,n)=>`${n} border-2 ${t}`,oe=(t,n)=>{const{accent:s,attention:l,blocked:a,muted:r}=n,{nodeFill:i}=re(n.translucent);return{done:{tone:s,node:`bg-${s}-500 dark:bg-${s}-400 border-2 border-${s}-500 dark:border-${s}-500`,glyph:"check",glyphClass:"text-white",connector:`bg-${s}-500 dark:bg-${s}-500`,connectorDashed:!1,pulse:!1,pillTone:r,pillVariant:"outline",pillFill:""},in_progress:{tone:s,node:U(`border-${s}-500 dark:border-${s}-500`,i),glyph:"none",glyphClass:"",connector:`bg-${s}-500 dark:bg-${s}-500`,connectorDashed:!1,pulse:!1,pillTone:s,pillVariant:"outline",pillFill:`bg-${s}-100 dark:bg-${s}-900`},running:{tone:s,node:U(`border-${s}-500 dark:border-${s}-500`,i),glyph:"none",glyphClass:"",connector:`bg-${s}-500 dark:bg-${s}-500`,connectorDashed:!1,pulse:!0,pillTone:s,pillVariant:"outline",pillFill:`bg-${s}-100 dark:bg-${s}-900`},skipped:{tone:r,node:i,glyph:"dashed",glyphClass:`text-${r}-400 dark:text-${r}-500`,connector:`border-${r}-300 dark:border-${r}-500`,connectorDashed:!0,pulse:!1,pillTone:r,pillVariant:"outline",pillFill:""},blocked:{tone:a,node:U(`border-${a}-500 dark:border-${a}-500`,i),glyph:"pause",glyphClass:`text-${a}-600 dark:text-${a}-400`,connector:`bg-${a}-300 dark:bg-${a}-700`,connectorDashed:!1,pulse:!1,pillTone:a,pillVariant:"outline",pillFill:`bg-${a}-100 dark:bg-${a}-900`},attention:{tone:l,node:U(`border-${l}-500 dark:border-${l}-500`,i),glyph:"alert",glyphClass:`text-${l}-600 dark:text-${l}-400`,connector:`bg-${l}-300 dark:bg-${l}-700`,connectorDashed:!1,pulse:!1,pillTone:l,pillVariant:"outline",pillFill:`bg-${l}-100 dark:bg-${l}-900`},not_started:{tone:r,node:U(`border-${r}-300 dark:border-${r}-500`,i),glyph:"none",glyphClass:"",connector:`bg-${r}-200 dark:bg-${r}-700`,connectorDashed:!1,pulse:!1,pillTone:r,pillVariant:"outline",pillFill:""}}[t]},tt={sm:{node:"h-4 w-4",glyph:"h-2.5 w-2.5"},md:{node:"h-5 w-5",glyph:"h-3 w-3"},lg:{node:"h-9 w-9",glyph:"h-5 w-5"}},st=({className:t})=>e.jsx("svg",{viewBox:"0 0 20 20","aria-hidden":"true",className:t,children:e.jsx("circle",{cx:"10",cy:"10",r:"8.6",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeDasharray:"3 2.7",strokeLinecap:"round"})}),at=({className:t})=>e.jsx("svg",{viewBox:"0 0 24 24",fill:"none","aria-hidden":"true",className:t,children:e.jsx("path",{d:"M12 6.5a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1Zm0 9.25a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z",fill:"currentColor"})}),M=({status:t,palette:n,size:s="md",className:l})=>{const a=oe(t,n),{node:r,glyph:i}=tt[s];return e.jsxs("span",{"aria-hidden":"true",className:o("relative inline-flex shrink-0",r,l),children:[a.pulse&&e.jsx("span",{className:o("absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:hidden",`bg-${a.tone}-300 dark:bg-${a.tone}-500`)}),e.jsxs("span",{className:o("relative inline-flex h-full w-full items-center justify-center rounded-full",a.node),children:[a.glyph==="check"&&e.jsx($e,{className:o(i,a.glyphClass)}),a.glyph==="pause"&&e.jsx(We,{className:o(i,a.glyphClass)}),a.glyph==="alert"&&e.jsx(at,{className:o(i,a.glyphClass)}),a.glyph==="dashed"&&e.jsx(st,{className:o("h-full w-full",a.glyphClass)})]})]})},je=({stepId:t,actions:n,palette:s,groupLabel:l,onAction:a,className:r,style:i})=>!a||n.length===0?null:e.jsx("div",{role:"group","aria-label":l,className:o("flex flex-wrap gap-1.5",r),style:i,children:n.map(m=>e.jsx(Ee,{size:"xs",weight:"medium",variant:m.variant??"soft",color:m.tone??s.accent,leadingIcon:m.leadingIcon,disabled:m.disabled,onClick:()=>a(t,m.id),children:m.label},m.id))}),q=t=>t??re(!1),ve=({title:t,subtitle:n,palette:s,surfaces:l,className:a})=>e.jsxs("div",{className:o("flex flex-col items-center justify-center gap-3 px-6 py-10 text-center",a),children:[e.jsx(M,{status:"not_started",palette:s,size:"lg"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("p",{className:o("text-sm font-semibold",q(l).mutedText),children:t}),n&&e.jsx("p",{className:o("max-w-xs text-xs leading-5",q(l).faintText),children:n})]})]}),z=({children:t,surfaces:n,className:s})=>e.jsx("span",{className:o("text-[10px] font-semibold uppercase tracking-widest",q(n).faintText,s),children:t}),xe=({children:t,surfaces:n,className:s})=>e.jsx("span",{className:o("text-xs",q(n).mutedText,s),children:t}),ie=({children:t,status:n,palette:s,tone:l})=>{const a=oe(n,s);return e.jsx(be,{size:"xs",uppercase:!0,tone:l??a.pillTone,variant:"outline",className:o("shrink-0 font-medium",l?`bg-${l}-100 dark:bg-${l}-900`:a.pillFill),children:t})},nt=({label:t,value:n,surfaces:s})=>e.jsxs("div",{className:"min-w-0",children:[e.jsx(z,{surfaces:s,children:t}),e.jsx("p",{className:"mt-1 text-sm font-medium text-neutral-800 dark:text-neutral-100",children:n})]}),lt=({count:t,label:n,surfaces:s})=>e.jsxs("span",{className:"inline-flex items-center gap-1",children:[e.jsx("span",{className:"font-semibold text-neutral-900 dark:text-white",children:t}),e.jsx("span",{className:q(s).mutedText,children:n})]}),it=9,rt=24,ot=32,dt=["done","in_progress","skipped","blocked","attention","not_started"],ct=({stepId:t,subSteps:n,palette:s,surfaces:l,onSubStepSelect:a})=>e.jsx("div",{className:o("mt-3 rounded-lg p-3",l.nestedBox),style:{marginLeft:ot},children:e.jsx("ul",{className:"space-y-2.5",children:n.map(r=>{const i=S(r.status),m=i==="running"||i==="in_progress",d=e.jsxs(e.Fragment,{children:[e.jsx(M,{status:i,palette:s,size:"sm"}),e.jsx("span",{className:o("text-sm",m?"font-semibold text-neutral-900 dark:text-white":"text-neutral-600 dark:text-neutral-300"),children:r.label})]});return e.jsx("li",{children:a?e.jsx("button",{type:"button",onClick:()=>a(t,r.id),className:"flex w-full items-center gap-2.5 rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500",children:d}):e.jsx("div",{className:"flex items-center gap-2.5",children:d})},r.id)})})}),pt=({steps:t,activeStepId:n,palette:s,surfaces:l,labels:a,progress:r,tallies:i,showLegend:m,loading:d,loadingRows:b,emptyState:k,onStepSelect:h,onSubStepSelect:f,onStepAction:y})=>{if(d)return e.jsx(Qe,{rows:b});const u=t.length===0,N=[{count:i.done,label:a.done},{count:i.skipped,label:a.skipped},{count:i.flagged,label:a.flagged},{count:i.remaining,label:a.remaining}].filter(p=>p.count>0);return e.jsxs("div",{className:"flex flex-col",children:[!u&&e.jsxs("div",{className:o("border-b px-5 pb-4 pt-5",l.border),children:[e.jsxs("div",{className:"flex items-baseline justify-between gap-3",children:[e.jsx(z,{surfaces:l,children:a.progress}),e.jsxs("span",{className:"text-sm font-semibold text-neutral-900 dark:text-white",children:[r,"%"]})]}),e.jsx(De,{className:o("mt-2",l.translucent?"bg-white/40 dark:bg-white/15":"bg-neutral-200 dark:bg-neutral-700"),value:r,size:"xs",color:s.accent,motion:"none"}),N.length>0&&e.jsx("div",{className:"mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs",children:N.map((p,j)=>e.jsxs(Re.Fragment,{children:[j>0&&e.jsx("span",{"aria-hidden":"true",className:"text-neutral-300 dark:text-neutral-600",children:"·"}),e.jsx(lt,{count:p.count,label:p.label,surfaces:l})]},p.label))})]}),e.jsx("div",{className:o(u?"":"px-5 py-5"),children:u?k??e.jsx(ve,{title:a.empty,subtitle:a.emptySubtitle,palette:s,surfaces:l}):e.jsx("ol",{className:"m-0 list-none p-0",children:t.map((p,j)=>{const v=S(p.status),w=oe(v,s),T=p.id===n,I=j===t.length-1,_=T&&p.subSteps&&p.subSteps.length>0?p.subSteps:void 0,D=e.jsxs(e.Fragment,{children:[e.jsx(M,{status:v,palette:s,className:"mt-0.5"}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx("span",{className:o("text-sm",T?"font-semibold text-neutral-900 dark:text-white":"font-medium text-neutral-700 dark:text-neutral-200"),children:p.label}),p.badge&&e.jsx(ie,{status:v,palette:s,tone:p.badgeTone,children:p.badge})]}),p.meta&&e.jsx("p",{className:o("mt-1 text-xs leading-5",l.mutedText),children:p.meta})]})]});return e.jsxs("li",{className:o("relative",!I&&"pb-5"),"aria-current":T?"step":void 0,children:[!I&&e.jsx("span",{"aria-hidden":"true",className:o("absolute bottom-0",w.connectorDashed?`border-l-2 border-dashed ${w.connector}`:`w-0.5 rounded-full ${w.connector}`),style:{left:it,top:rt}}),h?e.jsx("button",{type:"button",onClick:()=>h(p.id),className:"flex w-full items-start gap-3 rounded-sm text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:focus-visible:ring-neutral-500",children:D}):e.jsx("div",{className:"flex items-start gap-3",children:D}),e.jsx(je,{stepId:p.id,actions:p.actions??[],palette:s,groupLabel:a.quickActions,onAction:y,className:"ml-8 mt-2"}),_&&e.jsx(ct,{stepId:p.id,subSteps:_,palette:s,surfaces:l,onSubStepSelect:f})]},p.id)})})}),m&&!u&&e.jsx("div",{className:o("mt-auto border-t px-5 py-4",l.border),children:e.jsx("ul",{className:"flex flex-wrap gap-x-4 gap-y-2",children:dt.map(p=>e.jsxs("li",{className:"flex items-center gap-2",children:[e.jsx(M,{status:p,palette:s,size:"sm"}),e.jsx("span",{className:o("text-xs",l.mutedText),children:a.statuses[p]})]},p))})})]})},le={progress:"Progress",done:"done",skipped:"skipped",flagged:"flagged",remaining:"remaining",step:"Step",of:"of",elapsed:"Elapsed",owner:"Owner",started:"Started",sla:"SLA",subSteps:"Sub-steps",accepted:"accepted",open:"open",needsAttention:"Needs attention",skippedSteps:"Skipped steps",live:"LIVE · read-only view",empty:"No steps yet",emptySubtitle:"Steps appear here as soon as the workflow starts.",noActiveStep:"No step selected",details:"Step details",quickActions:"Quick actions",statuses:{done:"Done",in_progress:"In progress",running:"Running",skipped:"Skipped",blocked:"Blocked",attention:"Attention",not_started:"Not started"}},X=({accentColor:t="blue",attentionColor:n="rose",blockedColor:s="amber",mutedColor:l="neutral",variant:a="outlined",translucentSurfaces:r})=>{const i=r??Ke(a),m=c.useMemo(()=>({accent:t,attention:n,blocked:s,muted:l,translucent:i}),[t,n,s,l,i]),d=c.useMemo(()=>re(i),[i]);return{translucent:i,palette:m,surfaces:d}},Y=t=>t?{...le,...t,statuses:{...le.statuses,...t.statuses}}:le,ee=({variant:t="outlined",cardTone:n="neutral",corner:s=P,glassOpacity:l="light",vibrancy:a,specularMode:r,padding:i="none"})=>({variant:t,tone:n,corner:s,glassOpacity:l,vibrancy:a,specularMode:r,padding:i,scrollable:!1}),ut=t=>{if(t.length===0)return 0;const n=t.filter(s=>S(s.status)==="done").length;return Math.round(n/t.length*100)},mt=t=>{const n={done:0,skipped:0,flagged:0,remaining:0};return t.forEach(s=>{switch(S(s.status)){case"done":n.done+=1;break;case"skipped":n.skipped+=1;break;case"attention":case"blocked":n.flagged+=1;break;default:n.remaining+=1}}),n},xt=(t=[])=>{const n={accepted:0,skipped:0,open:0};return t.forEach(s=>{switch(S(s.status)){case"done":n.accepted+=1;break;case"skipped":n.skipped+=1;break;default:n.open+=1}}),n},ht=t=>t.filter(n=>{const s=S(n.status);return s==="attention"||s==="blocked"}),gt=t=>t.filter(n=>S(n.status)==="skipped"),de=(t,n)=>{if(t.length===0)return;const s=t.findIndex(a=>a.id===n);if(s>=0)return{step:t[s],index:s+1};const l=t.findIndex(a=>S(a.status)==="in_progress");return l>=0?{step:t[l],index:l+1}:{step:t[0],index:1}},A={eyebrow:"VENDOR ONBOARDING · REQ-4128",title:"Northwind Logistics GmbH",live:!0,activeStepId:"security_questionnaire",steps:[{id:"request_submitted",label:"Request submitted",status:"done",meta:"2m"},{id:"duplicate_check",label:"Duplicate check",status:"skipped",badge:"Not needed",meta:"No match in registry"},{id:"business_verification",label:"Business verification",status:"done",meta:"12m · 3 of 3 sub-steps"},{id:"sanctions_screening",label:"Sanctions screening",status:"done",meta:"4m"},{id:"tax_documents",label:"Tax documents",status:"skipped",badge:"Skipped",meta:"Skipped by M. Reyes · resume anytime"},{id:"insurance_certificates",label:"Insurance certificates",status:"attention",badge:"Needs attention",meta:"1h 06m · Liability certificate expired 12 Aug",details:e.jsxs("div",{className:"space-y-3 px-5 py-4 sm:px-6",children:[e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The liability certificate expired on 12 Aug. A reminder went to the vendor’s compliance contact; the underwriter quote is still pending."}),e.jsx("ul",{className:"flex flex-wrap gap-2",children:["reminder-12-aug.pdf","underwriter-quote.pdf"].map(t=>e.jsx("li",{className:"rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400",children:t},t))})]}),actions:[{id:"review",label:"Review"},{id:"remind",label:"Remind vendor",tone:"amber"}]},{id:"contract_drafting",label:"Contract drafting",status:"done",meta:"1h 10m"},{id:"security_questionnaire",label:"Security questionnaire",status:"in_progress",badge:"In progress",meta:"24m · 3 of 6 sub-steps",elapsed:"24m",description:"Vendor is completing the long-form questionnaire. Each sub-step unlocks once its evidence file is accepted by the reviewer.",owner:"D. Okafor",startedAt:"19 Aug · 09:12",sla:"Due in 6h",details:e.jsxs("div",{className:"space-y-5 px-5 py-4 sm:px-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Review activity"}),e.jsx("p",{className:"mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"Reviewer A. Lindqvist is cross-checking the subprocessor list against the master agreement. Uploads appear here as the vendor submits them."})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Files received"}),e.jsx("ul",{className:"mt-2 flex flex-wrap gap-2",children:["data-handling-v3.pdf","pentest-2026.pdf","soc2-typeii.pdf"].map(t=>e.jsx("li",{className:"rounded-full border border-neutral-200 px-2.5 py-0.5 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400",children:t},t))})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Open findings"}),e.jsxs("ul",{className:"mt-2 space-y-2",children:[e.jsxs("li",{className:"flex items-start gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:[e.jsx("span",{"aria-hidden":"true",className:"mt-[9px] size-1.5 shrink-0 rounded-full bg-amber-400"}),"Subprocessor “CloudDot BV” is not covered by the DPA yet"]}),e.jsxs("li",{className:"flex items-start gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:[e.jsx("span",{"aria-hidden":"true",className:"mt-[9px] size-1.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-600"}),"Waiting on the incident-contact annex"]})]})]})]}),subSteps:[{id:"data_handling",label:"Data handling policy",status:"done",badge:"Accepted",duration:"5m"},{id:"pentest",label:"Penetration test report",status:"done",badge:"Accepted",duration:"8m"},{id:"soc2",label:"SOC 2 Type II evidence",status:"done",badge:"Accepted",duration:"11m"},{id:"subprocessor_list",label:"Subprocessor list",status:"running",badge:"Running",note:"Vendor uploading — 2 of 3 files received"},{id:"incident_response",label:"Incident response plan",status:"skipped",badge:"Skipped",note:"Covered by master agreement §7"},{id:"business_continuity",label:"Business continuity plan",status:"not_started"}]},{id:"legal_review",label:"Legal review",status:"blocked",badge:"Blocked",meta:"Waiting on Legal · queued 2d",actions:[{id:"nudge",label:"Nudge Legal",tone:"violet"}]},{id:"banking_details",label:"Banking details",status:"not_started"},{id:"system_provisioning",label:"System provisioning",status:"not_started"},{id:"go_live",label:"Go-live",status:"not_started"}]},we=({data:t=A,loading:n=!1,loadingRows:s=6,showLegend:l=!0,emptyState:a,labels:r,cardClassName:i,cardScrollable:m,onStepSelect:d,onSubStepSelect:b,onStepAction:k,className:h,style:f,...y})=>{const u=t?.steps??[],{palette:N,surfaces:p}=X(y),j=c.useMemo(()=>Y(r),[r]),v=ee(y),w=c.useMemo(()=>de(u,t?.activeStepId),[u,t?.activeStepId]),T=c.useMemo(()=>ut(u),[u]),I=c.useMemo(()=>mt(u),[u]);return e.jsx(B,{...v,scrollable:m??!1,className:o(h,i),style:f,children:e.jsx(pt,{steps:u,activeStepId:w?.step.id,palette:N,surfaces:p,labels:j,progress:T,tallies:I,showLegend:l&&!n,loading:n,loadingRows:s,emptyState:a,onStepSelect:d,onSubStepSelect:b,onStepAction:k})})},ft=({active:t,totalSteps:n,palette:s,surfaces:l,labels:a,loading:r,onSubStepSelect:i,onStepAction:m})=>{if(r)return e.jsx(He,{});if(!t)return e.jsx(ve,{title:a.noActiveStep,palette:s,surfaces:l});const{step:d,index:b}=t,k=S(d.status),h=d.subSteps??[],f=xt(h),y=[d.owner?{label:a.owner,value:d.owner}:void 0,d.startedAt?{label:a.started,value:d.startedAt}:void 0,d.sla?{label:a.sla,value:d.sla}:void 0].filter(Boolean);return e.jsxs("div",{className:"flex flex-col",children:[e.jsxs("div",{className:"px-5 pb-6 pt-5 sm:px-6",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-x-4 gap-y-2",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsxs(z,{surfaces:l,children:[a.step," ",b," ",a.of," ",n]}),d.badge&&e.jsx(ie,{status:k,palette:s,tone:d.badgeTone,children:d.badge})]}),e.jsxs("div",{className:"flex flex-wrap items-center justify-end gap-x-4 gap-y-2",children:[d.elapsed&&e.jsxs(xe,{surfaces:l,children:[a.elapsed," ",d.elapsed]}),e.jsx(je,{stepId:d.id,actions:d.actions??[],palette:s,groupLabel:a.quickActions,onAction:m})]})]}),e.jsx("h3",{className:"mt-3 text-xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-2xl",children:d.label}),d.description&&e.jsx("p",{className:o("mt-2 max-w-3xl text-sm leading-6",l.mutedText),children:d.description}),y.length>0&&e.jsx("div",{className:"mt-5 flex flex-wrap gap-x-10 gap-y-4",children:y.map(u=>e.jsx(nt,{label:u.label,value:u.value,surfaces:l},u.label))})]}),h.length>0&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:o("flex flex-wrap items-center justify-between gap-2 border-y px-5 py-2.5 sm:px-6",l.border,l.strip),children:[e.jsx(z,{surfaces:l,children:a.subSteps}),e.jsxs(xe,{surfaces:l,children:[f.accepted," ",a.accepted," · ",f.skipped," ",a.skipped," · ",f.open," ",a.open]})]}),e.jsx("ul",{className:o("m-0 list-none divide-y p-0",l.divider),children:h.map(u=>{const N=S(u.status),p=N==="running",j=e.jsxs(e.Fragment,{children:[e.jsx(M,{status:N,palette:s}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:"text-sm font-medium text-neutral-800 dark:text-neutral-100",children:u.label}),u.note&&e.jsx("p",{className:o("mt-0.5 text-xs leading-5",l.mutedText),children:u.note})]}),u.badge&&e.jsx(ie,{status:N,palette:s,tone:u.badgeTone,children:u.badge}),e.jsx("span",{className:o("w-10 shrink-0 text-right text-xs tabular-nums",l.faintText),children:u.duration??"—"})]}),v=o("flex w-full items-center gap-3 px-5 py-3 text-left sm:px-6",p&&Xe(s.accent,l.translucent));return e.jsx("li",{children:i?e.jsx("button",{type:"button",onClick:()=>i(d.id,u.id),className:o(v,"focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500"),children:j}):e.jsx("div",{className:v,children:j})},u.id)})})]})]})},Ne=({data:t=A,loading:n=!1,labels:s,cardClassName:l,onSubStepSelect:a,onStepAction:r,className:i,style:m,...d})=>{const b=t?.steps??[],{palette:k,surfaces:h}=X(d),f=c.useMemo(()=>Y(s),[s]),y=ee(d),u=c.useMemo(()=>de(b,t?.activeStepId),[b,t?.activeStepId]);return e.jsx(B,{...y,className:o(i,l),style:m,children:e.jsx(ft,{active:u,totalSteps:b.length,palette:k,surfaces:h,labels:f,loading:n,onSubStepSelect:a,onStepAction:r})})},bt=({details:t,ariaLabel:n,cardProps:s,className:l,style:a})=>e.jsx(B,{...s,flexBody:!0,className:o("flex-1",l),style:a,children:e.jsx(Le,{className:"h-full",mask:!0,role:"region","aria-label":n,children:t})}),ye=({data:t=A,loading:n=!1,labels:s,cardClassName:l,className:a,style:r,...i})=>{const m=t?.steps??[],d=c.useMemo(()=>Y(s),[s]),b=ee(i),h=c.useMemo(()=>de(m,t?.activeStepId),[m,t?.activeStepId])?.step.details;return n||h==null||h===""?null:e.jsx(bt,{details:h,ariaLabel:d.details,cardProps:b,className:o(a,l),style:r})},he=({title:t,steps:n,palette:s,surfaces:l})=>e.jsxs("div",{className:"px-5 py-4",children:[e.jsx(z,{surfaces:l,children:t}),e.jsx("ul",{className:"mt-3 space-y-3",children:n.map(a=>e.jsxs("li",{className:"flex items-start gap-3",children:[e.jsx(M,{status:S(a.status),palette:s,className:"mt-0.5"}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:"text-sm font-medium text-neutral-800 dark:text-neutral-100",children:a.label}),a.meta&&e.jsx("p",{className:o("mt-0.5 text-xs leading-5",l.mutedText),children:a.meta})]})]},a.id))})]}),Se=({data:t=A,loading:n=!1,labels:s,className:l,style:a,...r})=>{const i=t?.steps??[],{palette:m,surfaces:d}=X(r),b=c.useMemo(()=>Y(s),[s]),k=ee(r),h=c.useMemo(()=>ht(i),[i]),f=c.useMemo(()=>gt(i),[i]);return n||h.length===0&&f.length===0?null:e.jsxs("div",{className:o("grid grid-cols-1 gap-5 @xl:grid-cols-2",l),style:a,children:[h.length>0&&e.jsx(B,{...k,children:e.jsx(he,{title:b.needsAttention,steps:h,palette:m,surfaces:d})}),f.length>0&&e.jsx(B,{...k,children:e.jsx(he,{title:b.skippedSteps,steps:f,palette:m,surfaces:d})})]})},O=({data:t=A,accentColor:n="blue",attentionColor:s="rose",blockedColor:l="amber",mutedColor:a="neutral",variant:r="outlined",cardTone:i="neutral",translucentSurfaces:m,glassOpacity:d="light",vibrancy:b,specularMode:k,corner:h=P,iconCorner:f=P,padding:y="none",maxWidth:u=1180,railWidth:N=360,stickyRail:p=!1,fillHeight:j=!1,fillHeightOffset:v=0,loading:w=!1,loadingRows:T=6,emptyState:I,showHeader:_=!0,showLegend:D=!0,labels:C,onStepSelect:te,onSubStepSelect:R,onStepAction:G,className:Q,style:se,...H})=>{const $={accentColor:n,attentionColor:s,blockedColor:l,mutedColor:a,variant:r,cardTone:i,corner:h,glassOpacity:d,vibrancy:b,specularMode:k,padding:y,translucentSurfaces:m},{surfaces:L}=X($),ae=c.useMemo(()=>Y(C),[C]),K={"--wt-rail-width":typeof N=="number"?`${N}px`:N,"--wt-fill-offset":typeof v=="number"?`${v}px`:v};return e.jsxs("div",{className:o("@container w-full",Q),style:{maxWidth:u,...K,...se},"aria-busy":w||void 0,...H,children:[_&&w&&e.jsx(Ge,{hasIcon:!!t?.icon,iconCorner:f}),_&&!w&&e.jsxs("header",{className:"mb-5 flex flex-wrap items-start justify-between gap-3",children:[e.jsxs("div",{className:"flex min-w-0 items-center gap-3",children:[t?.icon&&e.jsx("span",{className:o("flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden [&>img]:h-full [&>img]:w-full [&>img]:object-cover",fe(f),L.chip),children:t.icon}),e.jsxs("div",{className:"min-w-0",children:[t?.eyebrow&&e.jsx("p",{className:o("text-[11px] font-semibold uppercase tracking-widest",L.faintText),children:t.eyebrow}),e.jsx("h2",{className:"mt-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl",children:t?.title})]})]}),t?.live&&e.jsxs(be,{size:"md",tone:a,variant:"outline",className:o("tracking-wide",L.chip),children:[e.jsx("span",{"aria-hidden":"true",className:o("mr-2 inline-block h-1.5 w-1.5 rounded-full",`bg-${n}-500 dark:bg-${n}-400`)}),ae.live]})]}),e.jsxs("div",{className:o("grid grid-cols-1 items-start gap-5 @4xl:grid-cols-[var(--wt-rail-width)_minmax(0,1fr)]",j&&"@4xl:h-[calc(100dvh-var(--wt-fill-offset))]"),children:[e.jsx(we,{...$,data:t,loading:w,loadingRows:T,showLegend:D,emptyState:I,labels:C,cardScrollable:j,cardClassName:o(p&&!j&&"@4xl:sticky @4xl:top-6",j&&"@4xl:min-h-0 @4xl:self-stretch"),onStepSelect:te,onSubStepSelect:R,onStepAction:G}),e.jsxs("div",{className:o("@container flex min-w-0 flex-col gap-5",j&&"@4xl:min-h-0 @4xl:self-stretch"),children:[e.jsx(Ne,{...$,data:t,loading:w,labels:C,onSubStepSelect:R,onStepAction:G}),e.jsx(ye,{...$,data:t,loading:w,labels:C}),e.jsx(Se,{...$,data:t,loading:w,labels:C})]})]})]})},kt=["glass","liquid-glass","default"],jt=[{label:"Vendor onboarding",value:"vendor"},{label:"Release pipeline",value:"release"},{label:"Empty",value:"empty"}],vt={eyebrow:"NO PIPELINE",title:"Nothing running",steps:[]},wt=[{label:"0",value:"0px"},{label:"88px",value:"88px"},{label:"10vh",value:"10vh"}],Nt=()=>{const[t,n]=c.useState("vendor"),[s,l]=c.useState("outlined"),[a,r]=c.useState("neutral"),[i,m]=c.useState("blue"),[d,b]=c.useState(P),[k,h]=c.useState(P),[f,y]=c.useState("none"),[u,N]=c.useState(!1),[p,j]=c.useState(!1),[v,w]=c.useState(!0),[T,I]=c.useState(!0),[_,D]=c.useState(!0),[C,te]=c.useState(!1),[R,G]=c.useState(!1),[Q,se]=c.useState("0px"),[H,$]=c.useState("classic"),[L,ae]=c.useState("medium"),[K,Te]=c.useState("light"),[ce,Ae]=c.useState({}),[pe,ne]=c.useState(null),Ce={...t==="vendor"?A:t==="release"?Fe:vt,...ce[t]?{activeStepId:ce[t]}:{},icon:v?e.jsx(Pe,{icon:"Rocket",customSize:22,tone:i}):void 0},Ie=kt.includes(s);return e.jsx(Oe,{controls:e.jsx(Ve,{groups:[{id:"content",title:"Content",controls:e.jsx(J,{label:"Data set",children:e.jsx(Z,{fullWidth:!0,size:"sm",options:jt,value:t,onChange:x=>n(x)})})},{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(W,{label:"Card variant",options:Ue,value:s,onChange:x=>l(x)}),e.jsx(W,{label:"Card tone",options:ue,value:a,onChange:x=>r(x)}),e.jsx(W,{label:"Accent",options:ue,value:i,onChange:x=>m(x)}),e.jsx(W,{label:"Corner",options:me,value:d,onChange:x=>b(x)}),e.jsx(W,{label:"Icon corner",options:me,value:k,onChange:x=>h(x)}),e.jsx(W,{label:"Padding",options:Be,value:f,onChange:x=>y(x)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(E,{label:"Loading",checked:u,onChange:N}),e.jsx(E,{label:"Interactive",checked:p,onChange:j}),e.jsx(E,{label:"Title icon",checked:v,onChange:w}),e.jsx(E,{label:"Legend",checked:T,onChange:I}),e.jsx(E,{label:"Header",checked:_,onChange:D}),e.jsx(E,{label:"Sticky rail",checked:C,onChange:te}),e.jsx(E,{label:"Fill height",checked:R,onChange:G}),R&&e.jsx(W,{label:"Fill offset",options:wt,value:Q,onChange:se})]})},...Ie?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(J,{label:"Specular",children:e.jsx(Z,{fullWidth:!0,size:"sm",options:qe,value:H,onChange:x=>$(x)})}),e.jsx(J,{label:"Vibrancy",children:e.jsx(Z,{fullWidth:!0,size:"sm",options:ze,value:L,onChange:x=>ae(x)})}),e.jsx(J,{label:"Glass opacity",children:e.jsx(Z,{fullWidth:!0,size:"sm",options:Ye,value:K,onChange:x=>Te(x)})})]})}]:[]]}),preview:e.jsxs("div",{className:"w-full",children:[e.jsx(O,{data:Ce,loading:u,accentColor:i,variant:s,cardTone:a,corner:d,iconCorner:k,padding:f,glassOpacity:K,vibrancy:L,specularMode:H,showLegend:T,showHeader:_,stickyRail:C,fillHeight:R,fillHeightOffset:Q,onStepSelect:p?x=>{Ae(V=>({...V,[t]:x})),ne(`step "${x}" selected`)}:void 0,onSubStepSelect:p?(x,V)=>ne(`sub-step "${V}" of "${x}"`):void 0,onStepAction:p?(x,V)=>ne(`action "${V}" on step "${x}"`):void 0}),pe&&e.jsx("p",{className:"mt-2 text-xs text-neutral-500 dark:text-neutral-400",children:pe})]})})};function yt(){const[t,n]=c.useState(A.activeStepId),s={...A,activeStepId:t};return e.jsx("div",{className:"w-full",children:e.jsx(O,{data:s,onStepSelect:n})})}const St=`import { useState } from "react";
import { sampleWorkflow, WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

export default function VendorOnboarding() {
  const [activeStepId, setActiveStepId] = useState<string | undefined>(
    sampleWorkflow.activeStepId,
  );
  const data: WorkflowData = { ...sampleWorkflow, activeStepId };

  return (
    <div className="w-full">
      <WorkflowTracker data={data} onStepSelect={setActiveStepId} />
    </div>
  );
}
`,Tt={eyebrow:"RELEASE PIPELINE · v2.14.0",title:"orchestrator-api",live:!0,activeStepId:"integration_tests",steps:[{id:"commit",label:"Commit pushed",status:"done",meta:"0m"},{id:"lint",label:"Lint & typecheck",status:"done",meta:"1m 12s"},{id:"unit_tests",label:"Unit tests",status:"done",meta:"3m 41s · 812 passed"},{id:"sbom",label:"SBOM generation",status:"skipped",badge:"Not needed",meta:"Unchanged dependency tree"},{id:"integration_tests",label:"Integration tests",status:"in_progress",badge:"In progress",meta:"6m · 2 of 4 suites",elapsed:"6m",description:"Suites run against an ephemeral stack. A suite is promoted only once its fixtures have been torn down cleanly.",owner:"CI · runner-07",startedAt:"19 Aug · 14:02",sla:"Budget 15m",subSteps:[{id:"api_suite",label:"API contract suite",status:"done",badge:"Passed",badgeTone:"emerald",duration:"2m"},{id:"db_suite",label:"Database migration suite",status:"done",badge:"Passed",badgeTone:"emerald",duration:"1m 50s"},{id:"e2e_suite",label:"End-to-end suite",status:"running",badge:"Running",note:"Shard 2 of 3 — 148 of 210 specs"},{id:"perf_suite",label:"Performance smoke",status:"not_started"}]},{id:"image_scan",label:"Container image scan",status:"attention",badge:"Needs attention",meta:"1 high CVE in base image"},{id:"approval",label:"Release approval",status:"blocked",badge:"Blocked",meta:"Waiting on release manager"},{id:"deploy_staging",label:"Deploy to staging",status:"not_started"},{id:"deploy_prod",label:"Deploy to production",status:"not_started"}]};function At(){return e.jsx("div",{className:"w-full",children:e.jsx(O,{data:Tt})})}const Ct=`import { WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

/** The same data shape in another domain — a CI release pipeline. */
const releaseWorkflow: WorkflowData = {
  eyebrow: "RELEASE PIPELINE · v2.14.0",
  title: "orchestrator-api",
  live: true,
  activeStepId: "integration_tests",
  steps: [
    { id: "commit", label: "Commit pushed", status: "done", meta: "0m" },
    { id: "lint", label: "Lint & typecheck", status: "done", meta: "1m 12s" },
    {
      id: "unit_tests",
      label: "Unit tests",
      status: "done",
      meta: "3m 41s · 812 passed",
    },
    {
      id: "sbom",
      label: "SBOM generation",
      status: "skipped",
      badge: "Not needed",
      meta: "Unchanged dependency tree",
    },
    {
      id: "integration_tests",
      label: "Integration tests",
      status: "in_progress",
      badge: "In progress",
      meta: "6m · 2 of 4 suites",
      elapsed: "6m",
      description:
        "Suites run against an ephemeral stack. A suite is promoted only once its fixtures have been torn down cleanly.",
      owner: "CI · runner-07",
      startedAt: "19 Aug · 14:02",
      sla: "Budget 15m",
      subSteps: [
        {
          id: "api_suite",
          label: "API contract suite",
          status: "done",
          badge: "Passed",
          badgeTone: "emerald",
          duration: "2m",
        },
        {
          id: "db_suite",
          label: "Database migration suite",
          status: "done",
          badge: "Passed",
          badgeTone: "emerald",
          duration: "1m 50s",
        },
        {
          id: "e2e_suite",
          label: "End-to-end suite",
          status: "running",
          badge: "Running",
          note: "Shard 2 of 3 — 148 of 210 specs",
        },
        { id: "perf_suite", label: "Performance smoke", status: "not_started" },
      ],
    },
    {
      id: "image_scan",
      label: "Container image scan",
      status: "attention",
      badge: "Needs attention",
      meta: "1 high CVE in base image",
    },
    {
      id: "approval",
      label: "Release approval",
      status: "blocked",
      badge: "Blocked",
      meta: "Waiting on release manager",
    },
    { id: "deploy_staging", label: "Deploy to staging", status: "not_started" },
    { id: "deploy_prod", label: "Deploy to production", status: "not_started" },
  ],
};

export default function ReleasePipeline() {
  return (
    <div className="w-full">
      <WorkflowTracker data={releaseWorkflow} />
    </div>
  );
}
`,ge=({files:t})=>e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Artifacts and changes"}),e.jsx("ul",{className:"mt-2 flex flex-wrap gap-2",children:t.map(n=>e.jsx("li",{className:"rounded-full border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300",children:n},n))})]}),It=[{id:"survey",label:"survey",status:"done",badge:"ok",meta:"Cost $0.001262 · Step time 13s",elapsed:"13s",description:"Model step · Outcome: ok · Produces: SURVEY.md",details:e.jsxs("div",{className:"space-y-4 px-5 py-4 sm:px-6",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-x-10 gap-y-4",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Status"}),e.jsx("p",{className:"mt-1 text-sm text-neutral-800 dark:text-neutral-100",children:"done · ok"})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Cost"}),e.jsx("p",{className:"mt-1 text-sm tabular-nums text-neutral-800 dark:text-neutral-100",children:"$0.001262"})]})]}),e.jsx(ge,{files:["SURVEY.md"]})]})},{id:"approve",label:"approve",status:"attention",badge:"Waiting",meta:"No model cost · queued 40m",elapsed:"40m",description:"Human gate · Outcome: pending",actions:[{id:"approve",label:"Approve",tone:"emerald"},{id:"decline",label:"Decline",tone:"rose"}],details:e.jsx("p",{className:"px-5 py-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:px-6",children:"The run owner is deciding on the digest. The gate carries no model cost and its wall time is measured by the runner, not the step. Approving releases the queued summarise step."})},{id:"summarise",label:"summarise",status:"not_started",meta:"Queued behind the gate",description:"Model step · Produces: SUMMARY.md",details:e.jsxs("div",{className:"space-y-4 px-5 py-4 sm:px-6",children:[e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"Will stream the digest from SURVEY.md once the gate approves. The final artifact appears in the list below when the model finishes."}),e.jsx(ge,{files:["SURVEY.md","SUMMARY.md (queued)"]})]})}];function _t(){const[t,n]=c.useState("approve"),[s,l]=c.useState(null);return e.jsxs("div",{className:"w-full",children:[e.jsx(O,{data:{eyebrow:"MODEL RUN · REQ-8841",title:"Quarterly digest",live:!0,activeStepId:t,steps:It},accentColor:"emerald",onStepSelect:n,onStepAction:(a,r)=>l(`"${r}" on step "${a}"`)}),s&&e.jsx("p",{className:"mt-2 text-xs text-neutral-500 dark:text-neutral-400",children:s})]})}const $t=`import { useState } from "react";
import { WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowStep } from "@cjlapao/ui-kit";

/** Chips row shared by the details nodes. */
const Artifacts = ({ files }: { files: string[] }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
      Artifacts and changes
    </p>
    <ul className="mt-2 flex flex-wrap gap-2">
      {files.map((file) => (
        <li
          key={file}
          className="rounded-full border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-700 dark:border-emerald-800 dark:text-emerald-300"
        >
          {file}
        </li>
      ))}
    </ul>
  </div>
);

const steps: WorkflowStep[] = [
  {
    id: "survey",
    label: "survey",
    status: "done",
    badge: "ok",
    meta: "Cost $0.001262 · Step time 13s",
    elapsed: "13s",
    description: "Model step · Outcome: ok · Produces: SURVEY.md",
    details: (
      <div className="space-y-4 px-5 py-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Status
            </p>
            <p className="mt-1 text-sm text-neutral-800 dark:text-neutral-100">
              done · ok
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Cost
            </p>
            <p className="mt-1 text-sm tabular-nums text-neutral-800 dark:text-neutral-100">
              $0.001262
            </p>
          </div>
        </div>
        <Artifacts files={["SURVEY.md"]} />
      </div>
    ),
  },
  {
    id: "approve",
    label: "approve",
    status: "attention",
    badge: "Waiting",
    meta: "No model cost · queued 40m",
    elapsed: "40m",
    description: "Human gate · Outcome: pending",
    actions: [
      { id: "approve", label: "Approve", tone: "emerald" },
      { id: "decline", label: "Decline", tone: "rose" },
    ],
    details: (
      <p className="px-5 py-4 text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:px-6">
        The run owner is deciding on the digest. The gate carries no model
        cost and its wall time is measured by the runner, not the step.
        Approving releases the queued summarise step.
      </p>
    ),
  },
  {
    id: "summarise",
    label: "summarise",
    status: "not_started",
    meta: "Queued behind the gate",
    description: "Model step · Produces: SUMMARY.md",
    details: (
      <div className="space-y-4 px-5 py-4 sm:px-6">
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Will stream the digest from SURVEY.md once the gate approves. The
          final artifact appears in the list below when the model finishes.
        </p>
        <Artifacts files={["SURVEY.md", "SUMMARY.md (queued)"]} />
      </div>
    ),
  },
];

export default function DetailsCard() {
  // The parent owns the active step; whichever one it picks shows its
  // \`details\` node in the scrollable card below the step card. The gate's
  // quick actions come from \`actions\` + \`onStepAction\` — supplied here,
  // so they render in the rail row and the step card header.
  const [activeStepId, setActiveStepId] = useState("approve");
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="w-full">
      <WorkflowTracker
        data={{
          eyebrow: "MODEL RUN · REQ-8841",
          title: "Quarterly digest",
          live: true,
          activeStepId,
          steps,
        }}
        accentColor="emerald"
        onStepSelect={setActiveStepId}
        onStepAction={(stepId, actionId) =>
          setLastAction(\`"\${actionId}" on step "\${stepId}"\`)
        }
      />
      {lastAction && (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {lastAction}
        </p>
      )}
    </div>
  );
}
`;function Wt(){const[t,n]=c.useState("insurance_certificates"),[s,l]=c.useState(null),a={...A,activeStepId:t};return e.jsxs("div",{className:"flex w-full flex-col gap-4 xl:flex-row xl:items-start",children:[e.jsx("div",{className:"w-full xl:w-80 xl:shrink-0",children:e.jsx(we,{data:a,showLegend:!1,onStepSelect:n,onStepAction:(r,i)=>l(`"${i}" on step "${r}"`)})}),e.jsxs("div",{className:"flex min-w-0 flex-1 flex-col gap-4",children:[e.jsx(Ne,{data:a,onStepAction:(r,i)=>l(`"${i}" on step "${r}"`)}),e.jsx(ye,{data:a}),e.jsx(Se,{data:a}),s&&e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:s})]})]})}const Et=`import { useState } from "react";
import {
  sampleWorkflow,
  WorkflowTrackerDetails,
  WorkflowTrackerRail,
  WorkflowTrackerRollups,
  WorkflowTrackerStepDetails,
} from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

/**
 * The composite is a layout of the same four parts exported individually:
 * the rail, the step details, the scrollable details body and the roll-up
 * grid. They are stateless — one \`activeStepId\` in the parent's state
 * drives all of them, so they can be drawn wherever the page wants them.
 */
export default function ComposableParts() {
  const [activeStepId, setActiveStepId] = useState<string | undefined>(
    "insurance_certificates",
  );
  const [lastAction, setLastAction] = useState<string | null>(null);

  const data: WorkflowData = { ...sampleWorkflow, activeStepId };

  return (
    <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-start">
      {/* The rail, as a compact sidebar card. */}
      <div className="w-full xl:w-80 xl:shrink-0">
        <WorkflowTrackerRail
          data={data}
          showLegend={false}
          onStepSelect={setActiveStepId}
          onStepAction={(stepId, actionId) =>
            setLastAction(\`"\${actionId}" on step "\${stepId}"\`)
          }
        />
      </div>

      {/* Step details and the details body, stacked wherever they fit. */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <WorkflowTrackerStepDetails
          data={data}
          onStepAction={(stepId, actionId) =>
            setLastAction(\`"\${actionId}" on step "\${stepId}"\`)
          }
        />
        <WorkflowTrackerDetails data={data} />
        <WorkflowTrackerRollups data={data} />
        {lastAction && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {lastAction}
          </p>
        )}
      </div>
    </div>
  );
}
`,Dt={eyebrow:"NO PIPELINE",title:"Nothing running",steps:[]};function Rt(){return e.jsxs("div",{className:"grid w-full gap-4 xl:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(O,{data:Dt}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Empty steps — the built-in placeholder."})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(O,{data:A,loading:!0}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Loading — the rail and cards swap for skeletons."})]})]})}const Lt=`import { sampleWorkflow, WorkflowTracker } from "@cjlapao/ui-kit";
import type { WorkflowData } from "@cjlapao/ui-kit";

const empty: WorkflowData = {
  eyebrow: "NO PIPELINE",
  title: "Nothing running",
  steps: [],
};

export default function States() {
  return (
    <div className="grid w-full gap-4 xl:grid-cols-2">
      <div className="flex flex-col gap-2">
        <WorkflowTracker data={empty} />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Empty steps — the built-in placeholder.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <WorkflowTracker data={sampleWorkflow} loading />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Loading — the rail and cards swap for skeletons.
        </p>
      </div>
    </div>
  );
}
`,qt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Me,{name:"Workflow Tracker",description:"A pipeline tracker driven by one data object: a status timeline rail, a detail panel for the active step with sub-steps, a scrollable details card under it for caller-supplied content, quick-action buttons for gate-type steps, and roll-up cards for progress, flagged and skipped steps. Usable as a whole or panel-by-panel through the standalone parts."}),e.jsx(Nt,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(F,{title:"Vendor onboarding",description:"The bundled sampleWorkflow: a live pipeline with a blocked step, an attention flag and an in-progress step whose sub-steps fill the detail panel. Rows are buttons — the parent owns `data.activeStepId`.",code:St,filename:"VendorOnboarding.tsx",children:e.jsx(yt,{})}),e.jsx(F,{title:"Release pipeline",description:"The same data shape in another domain — a CI release pipeline with running sub-steps, a skipped stage, an attention flag and a blocked approval.",code:Ct,filename:"ReleasePipeline.tsx",children:e.jsx(At,{})}),e.jsx(F,{title:"Step details card",description:"A step's `details` node renders in its own card below the step card, framed by the tracker and wrapped in a `ScrollArea`. The `approve` gate uses `actions` + `onStepAction` for its Approve/Decline quick actions — quiet `xs` soft buttons in the rail row and the step card header. `fillHeight` (see the playground) stretches the details card to the viewport bottom so the page never scrolls.",code:$t,filename:"DetailsCard.tsx",children:e.jsx(_t,{})}),e.jsx(F,{title:"Composable parts",description:"The composite is a layout of three parts the kit also exports on its own: `WorkflowTrackerRail`, `WorkflowTrackerStepDetails` and `WorkflowTrackerDetails`. Each derives from the same `data` object and stays stateless — one parent-owned `activeStepId` keeps them in sync wherever they are drawn.",code:Et,filename:"ComposableParts.tsx",children:e.jsx(Wt,{})}),e.jsx(F,{title:"States",description:"Empty steps show the built-in placeholder; `loading` swaps the rail and cards for skeletons.",code:Lt,filename:"States.tsx",children:e.jsx(Rt,{})})]})]});export{qt as WorkflowTrackerPage,qt as default};
