import { Chat, createRestChatStorage } from "@cjlapao/ui-kit";

/**
 * The REST recipe — the same component, a different store. Metas page from
 * `{baseUrl}/chats?$top&$skip`, transcripts from `/messages` with OData
 * ordering, folders are their own resource. Only the windowed page is in
 * memory; "Load earlier" asks the server for the previous `$skip` slice.
 *
 * ```tsx
 * const storage = createRestChatStorage({
 *   baseUrl: "https://api.acme.test/v1",
 *   headers: () => ({ Authorization: `Bearer ${token()}` }),
 * });
 * ```
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
      id: `srv-${chats.size + 1}`,
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
