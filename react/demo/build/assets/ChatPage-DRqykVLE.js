import{j as e,e4 as l,e5 as m,r as g,e6 as x}from"./index-gt012o8E.js";import{P as w}from"./PageHeader-CzVhyXQL.js";import{E as c}from"./ExampleCard-V3REeYJ5.js";const S=m({prefix:"demo.chat.local"});function y(){return e.jsx(l,{storage:S,height:420})}const j=`import { Chat, createLocalChatStorage } from "@cjlapao/ui-kit";

/**
 * The zero-config life: a Chat that persists to localStorage, folders and
 * all. No endpoint, no setup — it just remembers. (A private storage prefix
 * keeps this demo's threads from meeting the next example's.)
 */
const storage = createLocalChatStorage({ prefix: "demo.chat.local" });

export default function LocalChat() {
  return <Chat storage={storage} height={420} />;
}
`,b=m({prefix:"demo.chat.stream"});globalThis.__demoModelStubbed||(globalThis.__demoModelStubbed=!0,globalThis.fetch=(async a=>{if(String(a).endsWith("/models"))return new Response(JSON.stringify({data:[{id:"demo-nova"}]}),{headers:{"Content-Type":"application/json"}});const n=["The ","quick ","brown ","fox ","jumps ","— ","streamed, ","token ","by ","token."].map(s=>`data: ${JSON.stringify({choices:[{delta:{content:s}}]})}
`);n.push(`data: ${JSON.stringify({choices:[],usage:{prompt_tokens:12,completion_tokens:13,total_tokens:25}})}
`,`data: [DONE]
`);const t=new ReadableStream({start(s){for(const r of n)s.enqueue(new TextEncoder().encode(r));s.close()}});return new Response(t)}));function k(){return e.jsx(l,{storage:b,baseUrl:"https://demo.invalid",models:[{id:"demo-nova"}],height:420})}const R=`import { Chat, createLocalChatStorage } from "@cjlapao/ui-kit";

/**
 * Streaming against a stand-in endpoint. The wire protocol is OpenAI's —
 * \`POST {baseUrl}/chat/completions\` with SSE deltas — so pointing
 * \`baseUrl\`/\`apiKey\` at any compatible gateway is the whole integration.
 * This example stubs \`fetch\` with a scripted reply to stay offline.
 */
const storage = createLocalChatStorage({ prefix: "demo.chat.stream" });

if (!(globalThis as Record<string, unknown>).__demoModelStubbed) {
  (globalThis as Record<string, unknown>).__demoModelStubbed = true;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    if (String(input).endsWith("/models")) {
      return new Response(JSON.stringify({ data: [{ id: "demo-nova" }] }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    const body = [
      "The ", "quick ", "brown ", "fox ", "jumps ", "— ", "streamed, ", "token ", "by ", "token.",
    ].map((t) => \`data: \${JSON.stringify({ choices: [{ delta: { content: t } }] })}\\n\`);
    body.push(
      \`data: \${JSON.stringify({ choices: [], usage: { prompt_tokens: 12, completion_tokens: 13, total_tokens: 25 } })}\\n\`,
      "data: [DONE]\\n",
    );
    const stream = new ReadableStream({
      start(controller) {
        for (const line of body) controller.enqueue(new TextEncoder().encode(line));
        controller.close();
      },
    });
    return new Response(stream);
  }) as typeof fetch;
}

export default function Streaming() {
  return (
    <Chat
      storage={storage}
      baseUrl="https://demo.invalid"
      models={[{ id: "demo-nova" }]}
      height={420}
    />
  );
}
`,d=m({prefix:"demo.chat.archive"});async function C(){const a=await d.listChats({top:1});if(a.items.length>0)return a.items[0].id;const n=await d.createChat();for(let t=0;t<260;t++)await d.appendMessage(n.id,{id:`seed-${t}`,chatId:n.id,role:t%2===0?"user":"assistant",content:t%2===0?`Question ${Math.floor(t/2)+1} — a note from the archive.`:`Answer ${Math.floor(t/2)+1}: the archive is patient, and the component only keeps what it shows.`,createdAt:new Date(Date.UTC(2026,0,1+Math.floor(t/12),9,t%12*5)).toISOString(),status:"done"});return n.id}function v(){const[a,n]=g.useState(!1),t=g.useRef(!1);return g.useEffect(()=>{t.current||(t.current=!0,C().then(()=>n(!0)))},[]),a?e.jsx(l,{storage:d,keepInMemory:40,pageSize:40,height:360}):e.jsx("div",{className:"h-[360px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800"})}const T=`import { useEffect, useRef, useState } from "react";
import { Chat, createLocalChatStorage } from "@cjlapao/ui-kit";

/**
 * The windowing story: a chat with 260 stored messages where the component
 * keeps only \`keepInMemory\` of them — "Load earlier" pulls another page
 * from storage, exactly the dance a REST archive does with \`$skip\`.
 */
const storage = createLocalChatStorage({ prefix: "demo.chat.archive" });

async function seed(): Promise<string> {
  const existing = await storage.listChats({ top: 1 });
  if (existing.items.length > 0) return existing.items[0].id;
  const chat = await storage.createChat();
  for (let i = 0; i < 260; i++) {
    await storage.appendMessage(chat.id, {
      id: \`seed-\${i}\`,
      chatId: chat.id,
      role: i % 2 === 0 ? "user" : "assistant",
      content:
        i % 2 === 0
          ? \`Question \${Math.floor(i / 2) + 1} — a note from the archive.\`
          : \`Answer \${Math.floor(i / 2) + 1}: the archive is patient, and the component only keeps what it shows.\`,
      createdAt: new Date(Date.UTC(2026, 0, 1 + Math.floor(i / 12), 9, (i % 12) * 5)).toISOString(),
      status: "done",
    });
  }
  return chat.id;
}

export default function PagedArchive() {
  const [ready, setReady] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void seed().then(() => setReady(true));
  }, []);
  if (!ready) return <div className="h-[360px] animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />;
  return <Chat storage={storage} keepInMemory={40} pageSize={40} height={360} />;
}
`,i=new Map,u=new Map,f=(a,n)=>{const t=Number(n.searchParams.get("$skip")??0),s=Number(n.searchParams.get("$top")??50);return Response.json({value:a.slice(t,t+s),"@odata.count":a.length})},O=async(a,n)=>{const t=new URL(String(a)),s=(n?.method??"GET").toUpperCase(),r=t.pathname,h=n?.body?JSON.parse(String(n.body)):{};if(r.endsWith("/messages")){const o=r.split("/")[2],p=u.get(o)??[];return s==="POST"&&p.push({createdAt:new Date().toISOString(),...h}),u.set(o,p),s==="GET"?f(p,t):new Response(null,{status:204})}if(s==="POST"){const o={id:`srv-${i.size+1}`,title:"New chat",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),...h};return i.set(o.id,o),u.set(o.id,[]),Response.json({...o,messages:[]})}if(s==="PATCH"){const o=i.get(r.split("/")[2]);return o&&Object.assign(o,h,{updatedAt:new Date().toISOString()}),new Response(null,{status:204})}return s==="DELETE"?(i.delete(r.split("/")[2]),new Response(null,{status:204})):f([...i.values()],t)},E=x({baseUrl:"https://api.acme.test/v1",fetch:O});function A(){return e.jsx(l,{storage:E,height:360})}const $=`import { Chat, createRestChatStorage } from "@cjlapao/ui-kit";

/**
 * The REST recipe — the same component, a different store. Metas page from
 * \`{baseUrl}/chats?$top&$skip\`, transcripts from \`/messages\` with OData
 * ordering, folders are their own resource. Only the windowed page is in
 * memory; "Load earlier" asks the server for the previous \`$skip\` slice.
 *
 * \`\`\`tsx
 * const storage = createRestChatStorage({
 *   baseUrl: "https://api.acme.test/v1",
 *   headers: () => ({ Authorization: \`Bearer \${token()}\` }),
 * });
 * \`\`\`
 *
 * (Rendered here against a miniature in-memory API that speaks the same
 * protocol, so the demo behaves like the real thing.)
 */
interface Row {
  id: string;
  [key: string]: unknown;
}

const chats = new Map<string, Row>();
const messages = new Map<string, Row[]>();

const page = <T extends Row>(items: T[], url: URL) => {
  const skip = Number(url.searchParams.get("$skip") ?? 0);
  const top = Number(url.searchParams.get("$top") ?? 50);
  return Response.json({ value: items.slice(skip, skip + top), "@odata.count": items.length });
};

const fakeApi: typeof fetch = async (input, init) => {
  const url = new URL(String(input));
  const method = (init?.method ?? "GET").toUpperCase();
  const path = url.pathname;
  const body = init?.body ? JSON.parse(String(init.body)) : {};

  if (path.endsWith("/messages")) {
    const id = path.split("/")[2];
    const list = messages.get(id) ?? [];
    if (method === "POST") list.push({ createdAt: new Date().toISOString(), ...body });
    messages.set(id, list);
    return method === "GET" ? page(list, url) : new Response(null, { status: 204 });
  }
  if (method === "POST") {
    const row: Row = {
      id: \`srv-\${chats.size + 1}\`,
      title: "New chat",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...body,
    };
    chats.set(row.id, row);
    messages.set(row.id, []);
    return Response.json({ ...row, messages: [] });
  }
  if (method === "PATCH") {
    const row = chats.get(path.split("/")[2]);
    if (row) Object.assign(row, body, { updatedAt: new Date().toISOString() });
    return new Response(null, { status: 204 });
  }
  if (method === "DELETE") {
    chats.delete(path.split("/")[2]);
    return new Response(null, { status: 204 });
  }
  return page([...chats.values()], url);
};

const storage = createRestChatStorage({ baseUrl: "https://api.acme.test/v1", fetch: fakeApi });

export default function RestRecipe() {
  return <Chat storage={storage} height={360} />;
}
`,P=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(w,{name:"Chat",description:"Chat, self-sustained — like the Smart Grid Layout of the kit, it owns its rail, its folders, its storage and its streaming. Given nothing it runs on localStorage; given an endpoint it streams real completions; given a REST store it pages transcripts OData-style and keeps only a window in memory. Folders are first-class citizens, and every seam — storage, slots, events — is left open on purpose."}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Local Chat",description:"Zero config: localStorage, folders, searching memory — it just remembers.",code:j,filename:"LocalChat.tsx",children:e.jsx(y,{})}),e.jsx(c,{title:"Streaming",description:"OpenAI-compatible SSE behind a scripted endpoint — tokens land one by one, usage lands at the end.",code:R,filename:"Streaming.tsx",children:e.jsx(k,{})}),e.jsx(c,{title:"Paged Archive",description:"Two hundred sixty stored messages, forty in memory, and a Load earlier that pages like a REST archive would.",code:T,filename:"PagedArchive.tsx",children:e.jsx(v,{})}),e.jsx(c,{title:"REST Recipe",description:"createRestChatStorage against an API that speaks $top/$skip — same component, server-side everything.",code:$,filename:"RestRecipe.tsx",children:e.jsx(A,{})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsxs("div",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:[e.jsxs("p",{children:["Props are ",e.jsx("code",{children:"storage"})," (",e.jsx("code",{children:"ChatStorage"}),"; default"," ",e.jsx("code",{children:"createLocalChatStorage()"}),"), ",e.jsx("code",{children:"baseUrl"})," /"," ",e.jsx("code",{children:"apiKey"})," (OpenAI-compatible completions; without them the chat honestly says it stores but does not answer), ",e.jsx("code",{children:"models"})," ","(a pinned list, ",e.jsx("code",{children:"false"})," to hide the picker, or omit to discover ",e.jsx("code",{children:"baseUrl/models"}),"), ",e.jsx("code",{children:"keepInMemory"})," ","(",e.jsx("code",{children:"200"}),") and ",e.jsx("code",{children:"pageSize"})," (",e.jsx("code",{children:"50"}),") — the memory window and the page it refills with — ",e.jsx("code",{children:"height"}),","," ",e.jsx("code",{children:"showRail"}),", ",e.jsx("code",{children:"placeholder"}),", and the usual card surface. ",e.jsx("code",{children:"renderMessage"})," (the ",e.jsx("code",{children:"message"})," slot in Vue) replaces any bubble; ",e.jsx("code",{children:"onEvent"})," (the ",e.jsx("code",{children:"event"})," ","emit) reports every creation, send, receipt, abort and storage failure — the seam the component grows through."]}),e.jsxs("p",{className:"mt-3",children:["The ",e.jsx("code",{children:"ChatStorage"})," contract — ",e.jsx("code",{children:"listChats"}),","," ",e.jsx("code",{children:"getChat"}),", ",e.jsx("code",{children:"createChat"}),", ",e.jsx("code",{children:"updateChat"}),","," ",e.jsx("code",{children:"deleteChat"}),", ",e.jsx("code",{children:"listMessages"}),","," ",e.jsx("code",{children:"appendMessage"}),", folder CRUD — is the whole integration surface. Both built-ins honour OData-flavoured paging: the REST one maps it onto ",e.jsx("code",{children:"$top"}),"/",e.jsx("code",{children:"$skip"}),"/",e.jsx("code",{children:"$count"})," ","with ",e.jsx("code",{children:"$filter"})," for folders; the local one slices its index. Folders delete cleanly (their chats survive, unfiled) and the Unfiled shelf is just ",e.jsx("code",{children:"folderId: null"}),"."]})]})]})]});export{P as ChatPage,P as default};
