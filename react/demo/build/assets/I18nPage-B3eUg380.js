import{j as e,fg as r,cd as x,bX as g,eT as h,A as f,cc as y,dk as d,fh as m,fi as u,eN as k}from"./index-gt012o8E.js";import{P as v}from"./PageHeader-CzVhyXQL.js";import{E as o}from"./ExampleCard-V3REeYJ5.js";import{P as b}from"./PlaygroundPanel-Czrs7oXC.js";const i={en:{greeting:"Hello, {name}!",items:"{count, plural, one {# item in your cart} other {# items in your cart}}","welcome.title":"Welcome to the ui-kit i18n demo","welcome.body":"Everything on this page renders through the same engine the kit components use."},fr:{greeting:"Bonjour, {name} !",items:"{count, plural, one {# article dans votre panier} other {# articles dans votre panier}}","welcome.title":"Bienvenue dans la démo i18n du ui-kit","welcome.body":"Tout sur cette page est rendu par le même moteur que les composants du kit."},es:{greeting:"¡Hola, {name}!",items:"{count, plural, one {# artículo en tu carrito} other {# artículos en tu carrito}}","welcome.title":"Bienvenido a la demo i18n del ui-kit","welcome.body":"Todo en esta página se renderiza con el mismo motor que usan los componentes del kit."},ar:{greeting:"مرحبًا، {name}!",items:"{count, plural, zero {لا توجد عناصر في سلة التسوق} one {عنصر واحد في سلة التسوق} two {عنصران في سلة التسوق} few {# عناصر في سلة التسوق} many {# عنصرًا في سلة التسوق} other {# عنصر في سلة التسوق}}","welcome.title":"مرحبًا بك في العرض التجريبي","welcome.body":"كل شيء في هذه الصفحة يُعرض من خلال نفس المحرك الذي تستخدمه مكونات الكيت."}},N=Object.keys(i),j=()=>{const t=r();return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(y,{"aria-label":"Locale",value:t.locale,onChange:n=>t.setLocale(n.target.value),className:"w-28",children:N.map(n=>e.jsx("option",{value:n,children:n},n))}),e.jsx("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"setLocale() — persisted to localStorage, updates <html lang/dir>"})]})},w=()=>{const t=r();return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-wrap items-end gap-5",children:[e.jsxs("div",{className:"w-64",children:[e.jsx("p",{className:"mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"DatePicker"}),e.jsx(x,{"aria-label":"Date"})]}),e.jsxs("div",{className:"w-64",children:[e.jsx("p",{className:"mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"SearchBar"}),e.jsx(g,{"aria-label":"Search",onSearch:()=>{}})]})]}),e.jsxs("div",{className:"grid w-full grid-cols-1 gap-5 sm:grid-cols-2",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Combobox — no matches (empty state)"}),e.jsx(h,{"aria-label":"Fruit",options:[],onChange:()=>{}})]}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-1.5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Accordion — empty state"}),e.jsx(f,{items:[]})]})]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Current locale: ",e.jsx("code",{className:"font-mono",children:t.locale})," — every label, placeholder and aria-label above is a"," ",e.jsx("code",{className:"font-mono",children:"kit.*"})," message resolved from the built-in catalog (user content would sit alongside in the provider)."]})]})},C=()=>e.jsx(b,{controls:e.jsx(j,{}),preview:e.jsx(w,{})}),I=()=>{const t=r();return e.jsxs("div",{className:"flex flex-col gap-2 text-sm",children:[e.jsx("p",{children:t.t("greeting",{name:"Ada"})}),e.jsx("p",{children:t.t("items",{count:3})}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["locale: ",e.jsx("code",{className:"font-mono",children:t.locale})," — switch it in the playground above."]})]})},D=`import React from "react";
import { useI18n } from "@cjlapao/ui-kit";

/**
 * Interpolation — one message, four locales, driven by the page switcher.
 * \`{name}\` is a plain argument; \`#\` inside the plural is the live count.
 */
export const Interpolation: React.FC = () => {
  const i18n = useI18n();
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>{i18n.t("greeting", { name: "Ada" })}</p>
      <p>{i18n.t("items", { count: 3 })}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        locale: <code className="font-mono">{i18n.locale}</code> — switch it in
        the playground above.
      </p>
    </div>
  );
};

export default Interpolation;
`,L={en:{items:"{count, plural, one {# item in your cart} other {# items in your cart}}"},fr:{items:"{count, plural, one {# article dans votre panier} many {# articles dans votre panier} other {# articles dans votre panier}}"},ar:{items:"{count, plural, zero {لا توجد عناصر} one {عنصر واحد} two {عنصران} few {# عناصر} many {# عنصرًا} other {# عنصر}}"}},S=[0,1,2,3,11],l=["en","fr","ar"],M=()=>{const t=d.useMemo(()=>l.map(n=>m({locales:{[n]:L[n]},locale:n,storageKey:null,updateDocument:!1})),[]);return e.jsx("div",{className:"flex flex-col gap-3",children:t.map((n,a)=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:l[a]}),e.jsx("ul",{className:"grid grid-cols-5 gap-2 text-xs sm:grid-cols-5",children:S.map(s=>e.jsxs("li",{className:"rounded-md border border-neutral-200 px-2 py-1.5 dark:border-neutral-700",children:[e.jsx("span",{className:"mb-0.5 block font-mono text-[10px] text-neutral-400",children:s}),n.t("items",{count:s})]},s))})]},l[a]))})},R=`import React from "react";
import { createI18n, type MessageCatalog } from "@cjlapao/ui-kit";

/**
 * Pluralization side by side — English (one/other), French (one/many) and
 * Arabic (zero/one/two/few/many/other). Each column runs its own engine; the
 * categories come from the same \`Intl.PluralRules\` the kit uses, so a single
 * message source serves every category.
 */
const CATALOGS: Record<string, MessageCatalog> = {
  en: {
    items:
      "{count, plural, one {# item in your cart} other {# items in your cart}}",
  },
  fr: {
    items:
      "{count, plural, one {# article dans votre panier} many {# articles dans votre panier} other {# articles dans votre panier}}",
  },
  ar: {
    items:
      "{count, plural, zero {لا توجد عناصر} one {عنصر واحد} two {عنصران} few {# عناصر} many {# عنصرًا} other {# عنصر}}",
  },
};

const COUNTS = [0, 1, 2, 3, 11];
const LOCALES = ["en", "fr", "ar"] as const;

export const Pluralization: React.FC = () => {
  const engines = React.useMemo(
    () =>
      LOCALES.map(
        (locale) =>
          createI18n({
            locales: { [locale]: CATALOGS[locale] },
            locale,
            storageKey: null,
            updateDocument: false,
          }),
      ),
    [],
  );
  return (
    <div className="flex flex-col gap-3">
      {engines.map((engine, index) => (
        <div key={LOCALES[index]} className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            {LOCALES[index]}
          </span>
          <ul className="grid grid-cols-5 gap-2 text-xs sm:grid-cols-5">
            {COUNTS.map((count) => (
              <li
                key={count}
                className="rounded-md border border-neutral-200 px-2 py-1.5 dark:border-neutral-700"
              >
                <span className="mb-0.5 block font-mono text-[10px] text-neutral-400">
                  {count}
                </span>
                {engine.t("items", { count })}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Pluralization;
`,O=()=>{const t=r(),n=1234.56,a=new Date(2026,7,29,15,30),s=[["i18n.formatNumber(1234.56)",t.formatNumber(n)],['i18n.formatNumber(1234567, { notation: "compact" })',t.formatNumber(1234567,{notation:"compact"})],['i18n.formatNumber(0.87, { style: "percent" })',t.formatNumber(.87,{style:"percent"})],["i18n.formatDate(date)",t.formatDate(a)],['i18n.formatDate(date, { weekday: "long", day: "numeric", month: "long" })',t.formatDate(a,{weekday:"long",day:"numeric",month:"long"})]];return e.jsx("table",{className:"w-full text-left text-sm",children:e.jsx("tbody",{children:s.map(([c,p])=>e.jsxs("tr",{className:"border-b border-neutral-100 last:border-b-0 dark:border-neutral-800",children:[e.jsx("td",{className:"py-2 pr-4 font-mono text-xs text-neutral-500 dark:text-neutral-400",children:c}),e.jsx("td",{className:"py-2 font-medium",children:p})]},c))})})},A=`import React from "react";
import { useI18n } from "@cjlapao/ui-kit";

/**
 * Formatting — Intl.NumberFormat / Intl.DateTimeFormat under the hood,
 * bound to the active locale (the same binding the kit components use for
 * their date panels).
 */
export const Formatting: React.FC = () => {
  const i18n = useI18n();
  const price = 1234.56;
  const date = new Date(2026, 7, 29, 15, 30);
  const rows: Array<[string, string]> = [
    ["i18n.formatNumber(1234.56)", i18n.formatNumber(price)],
    [
      "i18n.formatNumber(1234567, { notation: \\"compact\\" })",
      i18n.formatNumber(1234567, { notation: "compact" }),
    ],
    [
      'i18n.formatNumber(0.87, { style: "percent" })',
      i18n.formatNumber(0.87, { style: "percent" }),
    ],
    [
      "i18n.formatDate(date)",
      i18n.formatDate(date),
    ],
    [
      'i18n.formatDate(date, { weekday: "long", day: "numeric", month: "long" })',
      i18n.formatDate(date, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    ],
  ];
  return (
    <table className="w-full text-left text-sm">
      <tbody>
        {rows.map(([call, out]) => (
          <tr
            key={call}
            className="border-b border-neutral-100 last:border-b-0 dark:border-neutral-800"
          >
            <td className="py-2 pr-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {call}
            </td>
            <td className="py-2 font-medium">{out}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Formatting;
`,P=()=>{const t=typeof navigator<"u"?navigator.languages??[]:[],n=d.useMemo(()=>m({locales:i,storageKey:null,updateDocument:!1}),[]);return e.jsxs("div",{className:"flex flex-col gap-2 text-sm",children:[e.jsxs("p",{children:[e.jsx("code",{className:"font-mono text-xs",children:"navigator.languages"})," ="," ",e.jsx("code",{className:"font-mono",children:JSON.stringify(t)})]}),e.jsxs("p",{children:["The engine picked ",e.jsx("code",{className:"font-mono",children:n.locale})," — exact or base-language match against the catalog tags, else the fallback."]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Pass ",e.jsx("code",{className:"font-mono",children:'locale: "fr"'})," to the provider to pin it, or ",e.jsx("code",{className:"font-mono",children:"detect: false"})," to skip detection entirely (SSR is always a no-op)."]})]})},E=`import React from "react";
import { createI18n } from "@cjlapao/ui-kit";
import { DEMO_LOCALES } from "../catalog";

/**
 * Detection — the engine reads \`navigator.languages\` on mount when no
 * explicit locale is set. This example shows what the browser offers and
 * the locale the engine picked (base-language match: \`pt-BR\` → \`pt\`).
 */
export const Detection: React.FC = () => {
  const languages: readonly string[] =
    typeof navigator !== "undefined" ? (navigator.languages ?? []) : [];
  const engine = React.useMemo(
    () =>
      createI18n({
        locales: DEMO_LOCALES,
        storageKey: null,
        updateDocument: false,
      }),
    [],
  );
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>
        <code className="font-mono text-xs">navigator.languages</code> ={" "}
        <code className="font-mono">{JSON.stringify(languages)}</code>
      </p>
      <p>
        The engine picked <code className="font-mono">{engine.locale}</code> —
        exact or base-language match against the catalog tags, else the
        fallback.
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Pass <code className="font-mono">locale: "fr"</code> to the provider to
        pin it, or <code className="font-mono">detect: false</code> to skip
        detection entirely (SSR is always a no-op).
      </p>
    </div>
  );
};

export default Detection;
`,F=()=>{const t=r();return e.jsxs("div",{className:"flex flex-col gap-2 text-sm",children:[e.jsxs("p",{children:[e.jsx("code",{className:"font-mono text-xs",children:'t("no.such.key")'})," renders"," ",e.jsx("code",{className:"font-mono",children:t.t("no.such.key")})," — check the dev console for the one-time warning."]}),e.jsxs("p",{children:[e.jsx("code",{className:"font-mono text-xs",children:'t("kit.modal.cancel")'})," ","(user did not override it) renders the kit message for the active locale:"," ",e.jsx("code",{className:"font-mono",children:t.t("kit.modal.cancel")})]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{className:"font-mono",children:"has(key)"})," returns whether the key resolves at all — useful for hiding optional UI."]})]})},z=`import React from "react";
import { useI18n } from "@cjlapao/ui-kit";

/**
 * Missing keys — resolution is \`user[locale] → kit[locale] → kit[en] → key\`.
 * In dev, an unknown user key logs a warning once (console) while rendering
 * the key itself, so gaps are loud in development and silent in production.
 */
export const MissingKeys: React.FC = () => {
  const i18n = useI18n();
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>
        <code className="font-mono text-xs">t("no.such.key")</code> renders{" "}
        <code className="font-mono">{i18n.t("no.such.key")}</code> — check the
        dev console for the one-time warning.
      </p>
      <p>
        <code className="font-mono text-xs">t("kit.modal.cancel")</code>{" "}
        (user did not override it) renders the kit message for the active
        locale:{" "}
        <code className="font-mono">{i18n.t("kit.modal.cancel")}</code>
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        <code className="font-mono">has(key)</code> returns whether the key
        resolves at all — useful for hiding optional UI.
      </p>
    </div>
  );
};

export default MissingKeys;
`,K=()=>{const t=r(),n=t.t("greeting",{name:"Grace"}),a=t.t({id:"orders.shipped",defaultMessage:"{count} orders shipped to {city}"}),s=t.t({id:"orders.shipped",defaultMessage:"{count} orders shipped to {city}",values:{count:42,city:"Lisbon"}});return e.jsxs("div",{className:"flex flex-col gap-2 text-sm",children:[e.jsxs("p",{children:["Registered key (in the demo catalog):"," ",e.jsx("code",{className:"font-mono",children:n})]}),e.jsxs("p",{children:["Unregistered key, no values — the default message itself:"," ",e.jsx("code",{className:"font-mono",children:a})]}),e.jsxs("p",{children:["Unregistered key with values:"," ",e.jsx("code",{className:"font-mono",children:s})]})]})},T=`import React from "react";
import { useI18n } from "@cjlapao/ui-kit";

/**
 * Default messages — \`t({ id, defaultMessage })\` renders the message inline
 * (with its values) when the key is not found, so callers can write
 * self-documenting calls without pre-registering every string.
 */
export const DefaultMessages: React.FC = () => {
  const i18n = useI18n();
  const registered = i18n.t("greeting", { name: "Grace" });
  const defaulted = i18n.t({
    id: "orders.shipped",
    defaultMessage: "{count} orders shipped to {city}",
  });
  const defaultedWithValues = i18n.t({
    id: "orders.shipped",
    defaultMessage: "{count} orders shipped to {city}",
    values: { count: 42, city: "Lisbon" },
  });
  return (
    <div className="flex flex-col gap-2 text-sm">
      <p>
        Registered key (in the demo catalog):{" "}
        <code className="font-mono">{registered}</code>
      </p>
      <p>
        Unregistered key, no values — the default message itself:{" "}
        <code className="font-mono">{defaulted}</code>
      </p>
      <p>
        Unregistered key with values:{" "}
        <code className="font-mono">{defaultedWithValues}</code>
      </p>
    </div>
  );
};

export default DefaultMessages;
`,G={"kit.smartgrid.editLayout":"Layout anpassen","kit.smartgrid.done":"Fertig","kit.smartgrid.undo":"Verwerfen","kit.smartgrid.addNewItem":"Kachel hinzufügen"},U=[{id:"uptime",title:"Uptime",active:!0,single:!1,render:()=>e.jsx("span",{className:"text-xl font-semibold tabular-nums",children:"99.98%"})},{id:"calls",title:"Calls",active:!0,single:!1,render:()=>e.jsx("span",{className:"text-xl font-semibold tabular-nums",children:"1.2M/h"})}],B=[{title:"Übersicht",rows:[{itemIds:["uptime","calls"]}]}],V=()=>e.jsx(u,{locale:"de",detect:!1,storageKey:null,updateDocument:!1,locales:{de:G},children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Four ",e.jsx("code",{className:"font-mono",children:"kit.smartgrid.*"})," keys overridden in the provider above — the toolbar and palette pick them up;"," ",e.jsx("em",{children:"Redo"}),", the drop zone and the screen-reader narration fall through to the kit’s own German catalog."]}),e.jsx(k,{items:U,defaultLayout:B,maxColumns:6,defaultEditMode:!0})]})}),W=`import React from "react";
import { I18nProvider, SmartGridLayout } from "@cjlapao/ui-kit";
import type {
  MessageCatalog,
  SmartGridItemDefinition,
  SmartGridSectionDefinition,
} from "@cjlapao/ui-kit";

/**
 * Tuning the kit's own strings. Resolution is \`user[locale] → kit[locale] →
 * kit[en] → the key\`, so a handful of \`kit.*\` keys in your catalog replaces
 * exactly the words a component says without forking its catalog — and every
 * string you leave alone keeps shipping with the kit's five translations.
 * The grid below overrides four of its 54 keys; the rest of the German
 * chrome falls through to the built-in catalog.
 */
const german: MessageCatalog = {
  "kit.smartgrid.editLayout": "Layout anpassen",
  "kit.smartgrid.done": "Fertig",
  "kit.smartgrid.undo": "Verwerfen",
  "kit.smartgrid.addNewItem": "Kachel hinzufügen",
};

const items: SmartGridItemDefinition[] = [
  {
    id: "uptime",
    title: "Uptime",
    active: true,
    single: false,
    render: () => (
      <span className="text-xl font-semibold tabular-nums">99.98%</span>
    ),
  },
  {
    id: "calls",
    title: "Calls",
    active: true,
    single: false,
    render: () => (
      <span className="text-xl font-semibold tabular-nums">1.2M/h</span>
    ),
  },
];

const layout: SmartGridSectionDefinition[] = [
  { title: "Übersicht", rows: [{ itemIds: ["uptime", "calls"] }] },
];

export const KitOverrides: React.FC = () => (
  <I18nProvider
    locale="de"
    detect={false}
    storageKey={null}
    updateDocument={false}
    locales={{ de: german }}
  >
    <div className="flex flex-col gap-3">
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Four <code className="font-mono">kit.smartgrid.*</code> keys overridden
        in the provider above — the toolbar and palette pick them up;{" "}
        <em>Redo</em>, the drop zone and the screen-reader narration fall
        through to the kit&rsquo;s own German catalog.
      </p>
      <SmartGridLayout
        items={items}
        defaultLayout={layout}
        maxColumns={6}
        defaultEditMode
      />
    </div>
  </I18nProvider>
);

export default KitOverrides;
`,X=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(v,{name:"I18n",description:"A zero-dependency internationalization engine bundled with the kit: ICU-subset messages (interpolation, number/date, plural via Intl.PluralRules, select), built-in kit.* catalogs for en/fr/es/de/pt, locale detection + persistence, and byte-identical no-provider rendering. User catalogs layer on top and can override any kit.* key per locale."}),e.jsxs(u,{locales:i,storageKey:"ui-kit-demo:i18n-locale",children:[e.jsx(C,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Interpolation",description:"One message source, every locale — the switcher above drives the whole page through a single setLocale().",code:D,filename:"Interpolation.tsx",children:e.jsx(I,{})}),e.jsx(o,{title:"Pluralization",description:"English, French and Arabic side by side: the plural categories (one/other, one/many, zero/one/two/few/many/other) come from Intl.PluralRules, so one ICU message source serves them all — Arabic renders right-to-left.",code:R,filename:"Pluralization.tsx",children:e.jsx(M,{})}),e.jsx(o,{title:"Number & date formatting",description:"formatNumber/formatDate are Intl.NumberFormat/DateTimeFormat bound to the active locale — the same binding the kit's date panels use.",code:A,filename:"Formatting.tsx",children:e.jsx(O,{})}),e.jsx(o,{title:"Language detection",description:"With no explicit locale the engine reads navigator.languages on mount and matches exact or base-language tags against the catalogs (pt-BR → pt); SSR detection is a no-op.",code:E,filename:"Detection.tsx",children:e.jsx(P,{})}),e.jsx(o,{title:"Missing keys",description:"Resolution is user[locale] → kit[locale] → kit[en] → the key itself. In development an unknown user key warns once in the console and renders the key, so gaps are loud where it matters.",code:z,filename:"MissingKeys.tsx",children:e.jsx(F,{})}),e.jsx(o,{title:"Tuning the kit's strings",description:"Component copy is catalog-resolved like any other string, so a user catalog entry for kit.smartgrid.editLayout replaces exactly what the grid's toolbar says — leaving the other fifty-three keys, in all five locales, to ship with the kit. Nest a provider (as here) to scope an override to part of the tree.",code:W,filename:"KitOverrides.tsx",children:e.jsx(V,{})}),e.jsx(o,{title:"Default messages",description:"t({ id, defaultMessage, values }) renders the message inline when the id is unregistered — self-documenting calls without pre-registering every string.",code:T,filename:"DefaultMessages.tsx",children:e.jsx(K,{})})]})]})]});export{X as I18nPage,X as default};
