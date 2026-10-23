import{r as c,j as e,dl as t}from"./index-B9JeX19j.js";import{P as d}from"./PageHeader-D-LFwZLT.js";import{E as o}from"./ExampleCard-BwESxlwz.js";import{P as h,S as m,T as u}from"./PlaygroundPanel-CZvYEX_V.js";import{C as x}from"./ControlAccordion-rp4gabXb.js";import{b9 as p}from"./options-Blq0niUd.js";const b=["Tokyo","Delhi","Shanghai","Dhaka","São Paulo","Mexico City","Cairo","Beijing","Mumbai","Osaka","New York","Karachi","Chongqing","Kinshasa","Lagos","Bengaluru"],g=[["from-indigo-400 to-sky-400","North shore"],["from-fuchsia-400 to-rose-400","Salt flats"],["from-emerald-400 to-teal-500","Pine ridge"],["from-amber-400 to-orange-500","Canyon rim"],["from-violet-400 to-purple-500","Lavender fields"]],f=()=>{const[a,n]=c.useState("auto"),[s,l]=c.useState(!1);return e.jsx(h,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(x,{groups:[{id:"surface",title:"Behaviour",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Variant",options:p,value:a,onChange:r=>n(r)}),e.jsx(u,{label:"mask — edge fade",checked:s,onChange:l})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Scrolling itself stays native — wheel, touch and the keyboard (the viewport is focusable only while content overflows) behave exactly as the browser does; only the bars are drawn. Try ",e.jsx("code",{children:"auto"})," ","then drag inside, and the bar appears, lingers, and fades."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col items-center gap-6",children:[e.jsxs("div",{className:"w-full max-w-56",children:[e.jsx("div",{className:"mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400",children:"Vertical"}),e.jsx(t,{className:"h-56",variant:a,mask:s,children:e.jsx("div",{className:"space-y-2 pr-2",children:b.map(r=>e.jsx("span",{className:"block text-sm",children:r},r))})})]}),e.jsxs("div",{className:"w-full",children:[e.jsx("div",{className:"mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400",children:"Horizontal"}),e.jsx(t,{variant:a,mask:s,className:"w-full",children:e.jsx("div",{className:"flex gap-4 p-1",children:g.map(([r,i])=>e.jsxs("figure",{className:"shrink-0",children:[e.jsx("div",{className:`h-28 w-56 rounded-lg bg-gradient-to-br ${r}`}),e.jsx("figcaption",{className:"mt-1 text-xs opacity-60",children:i})]},i))})})]})]})})},k=[["Tokyo",37.1],["Delhi",32.9],["Shanghai",29.2],["Dhaka",23.2],["São Paulo",22.6],["Mexico City",22.3],["Cairo",22.1],["Beijing",21.8],["Mumbai",21.3],["Osaka",19],["New York",18.9],["Karachi",17.1],["Chongqing",16.9],["Kinshasa",16.3],["Lagos",15.9],["Bengaluru",14.8],["Istanbul",15.8],["Kolkata",15.1],["Manila",14.2],["Tianjin",13.9],["Rio de Janeiro",13.5],["Guangzhou",13.9],["Moscow",12.6],["Lima",11],["Jakarta",11.2],["London",9.6],["Paris",9],["Seoul",9.4],["Chicago",8.9],["Toronto",6.3]];function w(){return e.jsxs("div",{className:"w-full max-w-56",children:[e.jsx("div",{className:"mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400",children:"Metropolitan areas (millions)"}),e.jsx(t,{className:"h-72",children:e.jsx("div",{className:"space-y-2 pr-2",children:k.map(([a,n])=>e.jsxs("span",{className:"flex items-end gap-0.5",children:[e.jsx("span",{className:"text-sm",children:a}),e.jsxs("span",{className:"mb-px font-mono text-[11px] tracking-tighter text-neutral-400 dark:text-neutral-500",children:["(",n,")"]})]},a))})})]})}const j=`import { ScrollArea } from "@cjlapao/ui-kit";

const CITIES: Array<[string, number]> = [
  ["Tokyo", 37.1],
  ["Delhi", 32.9],
  ["Shanghai", 29.2],
  ["Dhaka", 23.2],
  ["São Paulo", 22.6],
  ["Mexico City", 22.3],
  ["Cairo", 22.1],
  ["Beijing", 21.8],
  ["Mumbai", 21.3],
  ["Osaka", 19.0],
  ["New York", 18.9],
  ["Karachi", 17.1],
  ["Chongqing", 16.9],
  ["Kinshasa", 16.3],
  ["Lagos", 15.9],
  ["Bengaluru", 14.8],
  ["Istanbul", 15.8],
  ["Kolkata", 15.1],
  ["Manila", 14.2],
  ["Tianjin", 13.9],
  ["Rio de Janeiro", 13.5],
  ["Guangzhou", 13.9],
  ["Moscow", 12.6],
  ["Lima", 11.0],
  ["Jakarta", 11.2],
  ["London", 9.6],
  ["Paris", 9.0],
  ["Seoul", 9.4],
  ["Chicago", 8.9],
  ["Toronto", 6.3],
];

/**
 * A scrollable region whose bars are drawn by the component, not the
 * browser: the native scrollbar is hidden, and a thin virtual bar tracks
 * the visible fraction — identical in every browser, and shown only when
 * wanted. Give the area a height with \`className\`.
 */
export default function Basic() {
  return (
    <div className="w-full max-w-56">
      <div className="mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
        Metropolitan areas (millions)
      </div>
      <ScrollArea className="h-72">
        <div className="space-y-2 pr-2">
          {CITIES.map(([city, people]) => (
            <span key={city} className="flex items-end gap-0.5">
              <span className="text-sm">{city}</span>
              <span className="mb-px font-mono text-[11px] tracking-tighter text-neutral-400 dark:text-neutral-500">
                ({people})
              </span>
            </span>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
`,y=[["from-indigo-400 to-sky-400","North shore"],["from-fuchsia-400 to-rose-400","Salt flats"],["from-emerald-400 to-teal-500","Pine ridge"],["from-amber-400 to-orange-500","Canyon rim"],["from-violet-400 to-purple-500","Lavender fields"],["from-cyan-400 to-blue-500","Harbour fog"]];function N(){return e.jsx(t,{className:"mx-auto w-full max-w-md",children:e.jsx("div",{className:"flex gap-4 p-3",children:y.map(([a,n])=>e.jsxs("figure",{className:"shrink-0",children:[e.jsx("div",{className:`h-40 w-72 rounded-lg bg-gradient-to-br ${a}`}),e.jsxs("figcaption",{className:"mt-2 text-xs",children:[e.jsx("span",{className:"opacity-60",children:"Shot at"})," ",e.jsx("span",{className:"font-medium",children:n})]})]},n))})})}const v=`import { ScrollArea } from "@cjlapao/ui-kit";

const TILES: Array<[string, string]> = [
  ["from-indigo-400 to-sky-400", "North shore"],
  ["from-fuchsia-400 to-rose-400", "Salt flats"],
  ["from-emerald-400 to-teal-500", "Pine ridge"],
  ["from-amber-400 to-orange-500", "Canyon rim"],
  ["from-violet-400 to-purple-500", "Lavender fields"],
  ["from-cyan-400 to-blue-500", "Harbour fog"],
];

/**
 * Content wider than the frame brings the horizontal bar to life — it
 * appears on the same rules as the vertical one, and the two share the
 * corner square when both are up.
 */
export default function Horizontal() {
  return (
    <ScrollArea className="mx-auto w-full max-w-md">
      <div className="flex gap-4 p-3">
        {TILES.map(([gradient, title]) => (
          <figure key={title} className="shrink-0">
            <div
              className={\`h-40 w-72 rounded-lg bg-gradient-to-br \${gradient}\`}
            />
            <figcaption className="mt-2 text-xs">
              <span className="opacity-60">Shot at</span>{" "}
              <span className="font-medium">{title}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </ScrollArea>
  );
}
`,S=[["New York","NY",8419600,783.8],["Los Angeles","CA",3980400,1214.9],["Chicago","IL",2716e3,589.6],["Houston","TX",2328e3,1651.1],["Phoenix","AZ",169e4,1340.6],["Philadelphia","PA",1584200,369.6],["San Antonio","TX",1547200,1194],["San Diego","CA",1423800,964.5],["Dallas","TX",1341100,882.9],["San Jose","CA",1035300,469.7],["Austin","TX",101e4,704],["Jacksonville","FL",949600,2265.3],["Columbus","OH",905700,577.9],["Charlotte","NC",885700,771],["Boston","MA",675600,232.1]];function C(){return e.jsx(t,{className:"mx-auto h-80 w-full max-w-sm rounded-lg border border-neutral-200 dark:border-neutral-800",children:e.jsxs("table",{className:"w-full min-w-[36rem] text-sm",children:[e.jsx("thead",{className:"sticky top-0 z-10 bg-neutral-100 dark:bg-neutral-800",children:e.jsx("tr",{children:["City","State","Population","Area (km²)"].map(a=>e.jsx("th",{className:"whitespace-nowrap border-b border-neutral-200 px-4 py-2 text-left font-mono text-xs font-light uppercase dark:border-neutral-700",children:a},a))})}),e.jsx("tbody",{children:S.map(([a,n,s,l])=>e.jsxs("tr",{className:"odd:bg-neutral-50 dark:odd:bg-neutral-800/40",children:[e.jsx("td",{className:"whitespace-nowrap border-b border-neutral-100 px-4 py-2 font-medium dark:border-neutral-800",children:a}),e.jsx("td",{className:"border-b border-neutral-100 px-4 py-2 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400",children:n}),e.jsx("td",{className:"border-b border-neutral-100 px-4 py-2 tabular-nums dark:border-neutral-800",children:s.toLocaleString()}),e.jsx("td",{className:"border-b border-neutral-100 px-4 py-2 tabular-nums dark:border-neutral-800",children:l.toLocaleString()})]},a))})]})})}const A=`import { ScrollArea } from "@cjlapao/ui-kit";

const CITIES: Array<[string, string, number, number]> = [
  ["New York", "NY", 8419600, 783.8],
  ["Los Angeles", "CA", 3980400, 1214.9],
  ["Chicago", "IL", 2716000, 589.6],
  ["Houston", "TX", 2328000, 1651.1],
  ["Phoenix", "AZ", 1690000, 1340.6],
  ["Philadelphia", "PA", 1584200, 369.6],
  ["San Antonio", "TX", 1547200, 1194.0],
  ["San Diego", "CA", 1423800, 964.5],
  ["Dallas", "TX", 1341100, 882.9],
  ["San Jose", "CA", 1035300, 469.7],
  ["Austin", "TX", 1010000, 704.0],
  ["Jacksonville", "FL", 949600, 2265.3],
  ["Columbus", "OH", 905700, 577.9],
  ["Charlotte", "NC", 885700, 771.0],
  ["Boston", "MA", 675600, 232.1],
];

/**
 * Content overflowing both axes gets both bars — and the corner square only
 * appears where they meet. The sticky header rides the vertical scroll while
 * the columns slide under it.
 */
export default function BothScrollbars() {
  return (
    <ScrollArea className="mx-auto h-80 w-full max-w-sm rounded-lg border border-neutral-200 dark:border-neutral-800">
      <table className="w-full min-w-[36rem] text-sm">
        <thead className="sticky top-0 z-10 bg-neutral-100 dark:bg-neutral-800">
          <tr>
            {["City", "State", "Population", "Area (km²)"].map((label) => (
              <th
                key={label}
                className="whitespace-nowrap border-b border-neutral-200 px-4 py-2 text-left font-mono text-xs font-light uppercase dark:border-neutral-700"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CITIES.map(([city, state, population, area]) => (
            <tr
              key={city}
              className="odd:bg-neutral-50 dark:odd:bg-neutral-800/40"
            >
              <td className="whitespace-nowrap border-b border-neutral-100 px-4 py-2 font-medium dark:border-neutral-800">
                {city}
              </td>
              <td className="border-b border-neutral-100 px-4 py-2 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                {state}
              </td>
              <td className="border-b border-neutral-100 px-4 py-2 tabular-nums dark:border-neutral-800">
                {population.toLocaleString()}
              </td>
              <td className="border-b border-neutral-100 px-4 py-2 tabular-nums dark:border-neutral-800">
                {area.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
`,T=[["Tokyo",37.1],["Delhi",32.9],["Shanghai",29.2],["Dhaka",23.2],["São Paulo",22.6],["Mexico City",22.3],["Cairo",22.1],["Beijing",21.8],["Mumbai",21.3],["Osaka",19],["New York",18.9],["Karachi",17.1],["Chongqing",16.9],["Kinshasa",16.3],["Lagos",15.9],["Bengaluru",14.8],["Istanbul",15.8],["Kolkata",15.1],["Manila",14.2],["Tianjin",13.9]];function I(){return e.jsxs("div",{className:"w-full max-w-56",children:[e.jsx("div",{className:"mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400",children:"Metropolitan areas (millions)"}),e.jsx(t,{className:"h-72",mask:!0,variant:"always",children:e.jsx("div",{className:"space-y-2 pr-2",children:T.map(([a,n])=>e.jsxs("span",{className:"flex items-end gap-0.5",children:[e.jsx("span",{className:"text-sm",children:a}),e.jsxs("span",{className:"mb-px font-mono text-[11px] tracking-tighter text-neutral-400 dark:text-neutral-500",children:["(",n,")"]})]},a))})})]})}const P=`import { ScrollArea } from "@cjlapao/ui-kit";

const CITIES: Array<[string, number]> = [
  ["Tokyo", 37.1],
  ["Delhi", 32.9],
  ["Shanghai", 29.2],
  ["Dhaka", 23.2],
  ["São Paulo", 22.6],
  ["Mexico City", 22.3],
  ["Cairo", 22.1],
  ["Beijing", 21.8],
  ["Mumbai", 21.3],
  ["Osaka", 19.0],
  ["New York", 18.9],
  ["Karachi", 17.1],
  ["Chongqing", 16.9],
  ["Kinshasa", 16.3],
  ["Lagos", 15.9],
  ["Bengaluru", 14.8],
  ["Istanbul", 15.8],
  ["Kolkata", 15.1],
  ["Manila", 14.2],
  ["Tianjin", 13.9],
];

/**
 * \`mask\` fades the content at the edges it can scroll toward — a clipped
 * row reads as clipped instead of finished, which is how a list promises
 * "there is more" without a bar in the way.
 */
export default function ScrollFade() {
  return (
    <div className="w-full max-w-56">
      <div className="mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
        Metropolitan areas (millions)
      </div>
      <ScrollArea className="h-72" mask variant="always">
        <div className="space-y-2 pr-2">
          {CITIES.map(([city, people]) => (
            <span key={city} className="flex items-end gap-0.5">
              <span className="text-sm">{city}</span>
              <span className="mb-px font-mono text-[11px] tracking-tighter text-neutral-400 dark:text-neutral-500">
                ({people})
              </span>
            </span>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
`,K=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(d,{name:"Scroll Area",description:"A scrollable region whose scrollbars are drawn by the kit instead of the browser — PrimeVue's ScrollArea. Scrolling itself stays completely native (wheel, touch, keyboard), so behaviour never surprises anyone; only the thin overlay bars are ours, sized by the visible fraction and shown only when wanted."}),e.jsx(f,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Basic",description:"The classic list: bars invisible until hovered or scrolled (the `auto` default), and the same thin rounded look the kit's native scrollbar hack faked webkit-only for years.",code:j,filename:"Basic.tsx",children:e.jsx(w,{})}),e.jsx(o,{title:"Horizontal",description:"Wide content brings the horizontal bar up on the same rules as the vertical one.",code:v,filename:"Horizontal.tsx",children:e.jsx(N,{})}),e.jsx(o,{title:"Both Scrollbars",description:"Overflow on both axes gets both bars and a corner square where they meet — a sticky header riding the vertical scroll while the columns slide under it.",code:A,filename:"BothScrollbars.tsx",children:e.jsx(C,{})}),e.jsx(o,{title:"Scroll Fade",description:"`mask` fades the content at the edges it can scroll toward, so a clipped row reads as clipped instead of finished.",code:P,filename:"ScrollFade.tsx",children:e.jsx(I,{})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsx("div",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:e.jsxs("p",{children:["Props are ",e.jsx("code",{children:"variant"})," (",e.jsx("code",{children:"auto"})," by default —"," ",e.jsx("code",{children:"hover"})," / ",e.jsx("code",{children:"scroll"})," / ",e.jsx("code",{children:"always"})," /"," ",e.jsx("code",{children:"hidden"}),"), ",e.jsx("code",{children:"mask"})," for the edge fade,"," ",e.jsx("code",{children:"horizontal={false}"})," for a region with one axis, and ",e.jsx("code",{children:"contentClassName"})," for the scrolling box. Say so when the region has one axis: ",e.jsx("code",{children:"scrollWidth"})," reports content clipped by ",e.jsx("code",{children:"overflow-x: hidden"})," as loudly as content that really scrolls, so a ",e.jsx("code",{children:"SideMenu"})," badge too wide for its panel would otherwise grow a bar over an axis with nothing to scroll (it clips instead). The height is just ",e.jsx("code",{children:"className"}),", like ",e.jsx("code",{children:"Panel"})," scrollables — a"," ",e.jsx("code",{children:"max-h-*"})," counts too, since the viewport inherits the cap and scrolls inside it rather than growing past it and silently clipping. Everything else lands on the root. Accessibility mirrors the viewport: it joins the tab order only while content overflows, so arrows / Page / Home / End scroll it natively, and each bar is a"," ",e.jsx("code",{children:'role="scrollbar"'})," with ",e.jsx("code",{children:"aria-controls"})," and a live ",e.jsx("code",{children:"aria-valuenow"}),". Where the kit used to repeat a"," ",e.jsx("code",{children:"[&::-webkit-scrollbar]"})," string (which only Chrome honoured), this is the scroll surface to migrate to."]})})]})]});export{K as ScrollAreaPage,K as default};
