import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import LocalChat from "./examples/LocalChat";
import localChatCode from "./examples/LocalChat.tsx?raw";
import Streaming from "./examples/Streaming";
import streamingCode from "./examples/Streaming.tsx?raw";
import PagedArchive from "./examples/PagedArchive";
import pagedArchiveCode from "./examples/PagedArchive.tsx?raw";
import RestRecipe from "./examples/RestRecipe";
import restRecipeCode from "./examples/RestRecipe.tsx?raw";

export const ChatPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Chat"
      description="Chat, self-sustained — like the Smart Grid Layout of the kit, it owns its rail, its folders, its storage and its streaming. Given nothing it runs on localStorage; given an endpoint it streams real completions; given a REST store it pages transcripts OData-style and keeps only a window in memory. Folders are first-class citizens, and every seam — storage, slots, events — is left open on purpose."
    />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Local Chat" description="Zero config: localStorage, folders, searching memory — it just remembers." code={localChatCode} filename="LocalChat.tsx"><LocalChat /></ExampleCard>
      <ExampleCard title="Streaming" description="OpenAI-compatible SSE behind a scripted endpoint — tokens land one by one, usage lands at the end." code={streamingCode} filename="Streaming.tsx"><Streaming /></ExampleCard>
      <ExampleCard title="Paged Archive" description="Two hundred sixty stored messages, forty in memory, and a Load earlier that pages like a REST archive would." code={pagedArchiveCode} filename="PagedArchive.tsx"><PagedArchive /></ExampleCard>
      <ExampleCard title="REST Recipe" description="createRestChatStorage against an API that speaks $top/$skip — same component, server-side everything." code={restRecipeCode} filename="RestRecipe.tsx"><RestRecipe /></ExampleCard>
    </section>
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">API</h2>
      <div className="max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
        <p>
          Props are <code>storage</code> (<code>ChatStorage</code>; default{" "}
          <code>createLocalChatStorage()</code>), <code>baseUrl</code> /{" "}
          <code>apiKey</code> (OpenAI-compatible completions; without them the
          chat honestly says it stores but does not answer), <code>models</code>{" "}
          (a pinned list, <code>false</code> to hide the picker, or omit to
          discover <code>baseUrl/models</code>), <code>keepInMemory</code>{" "}
          (<code>200</code>) and <code>pageSize</code> (<code>50</code>) — the
          memory window and the page it refills with — <code>height</code>,{" "}
          <code>showRail</code>, <code>placeholder</code>, and the usual card
          surface. <code>renderMessage</code> (the <code>message</code> slot in
          Vue) replaces any bubble; <code>onEvent</code> (the <code>event</code>{" "}
          emit) reports every creation, send, receipt, abort and storage
          failure — the seam the component grows through.
        </p>
        <p className="mt-3">
          The <code>ChatStorage</code> contract — <code>listChats</code>,{" "}
          <code>getChat</code>, <code>createChat</code>, <code>updateChat</code>,{" "}
          <code>deleteChat</code>, <code>listMessages</code>,{" "}
          <code>appendMessage</code>, folder CRUD — is the whole integration
          surface. Both built-ins honour OData-flavoured paging: the REST one
          maps it onto <code>$top</code>/<code>$skip</code>/<code>$count</code>{" "}
          with <code>$filter</code> for folders; the local one slices its
          index. Folders delete cleanly (their chats survive, unfiled) and the
          Unfiled shelf is just <code>folderId: null</code>.
        </p>
      </div>
    </section>
  </div>
);

export default ChatPage;
