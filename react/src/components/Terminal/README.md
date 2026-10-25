# Terminal

`Terminal` embeds xterm.js in a kit Panel. `TerminalTabs` keeps independent
sessions mounted while tabs are switched. Both accept `variant`, `tone`,
`corner`, `padding`, `glassOpacity`, `vibrancy`, `specularMode`, `borderColor`,
`backgroundColor`, `maxWidth`, `className`, and `style` from Panel.

Include `@cjlapao/ui-kit/styles.css` as usual; it includes xterm's stylesheet.
The engine loads on the client when a terminal mounts.

```tsx
const terminal = useRef<TerminalHandle>(null);

<Terminal
  ref={terminal}
  height={320}
  variant="outlined"
  corner="rounded-md"
  initialData="\x1b[32mConnected\x1b[0m\r\n"
  onData={data => transport.send(data)}
  onResize={size => transport.resize(size)}
  onReady={handle => transport.subscribe(data => handle.write(data))}
  onDispose={() => transport.close()}
  onError={error => reportError(error)}
/>
```

Consumers own the transport and its subscriptions. `onDispose` runs for an
initialized terminal when it unmounts; release the subscription there too.
No shell or network connection is created by these components. Input has no
local echo: a connected shell normally sends echoed output back to `write`.

The ref exposes `write`, `writeln`, `clear` (scrollback), `reset` (terminal),
`focus`, and `fit`. Writes made before initialization are queued. `initialData`
is a one-time seed, not a controlled output string. `readOnly` disables input.

`scheme="auto"` follows the kit's ancestor `.dark` class; `light` and `dark`
pin the palette. `terminalTheme` overrides ANSI colors, foreground, background,
cursor, and selection colors. `options` takes xterm options such as `fontSize`,
`fontFamily`, `cursorStyle`, `cursorBlink`, `scrollback`, and `convertEol`.
Dimensions are managed by the fit addon. Use `height="100%"` in a sized parent.

```tsx
const tabs = useRef<TerminalTabsHandle>(null);
<TerminalTabs
  ref={tabs}
  sessions={sessions}
  value={activeId}
  onValueChange={setActiveId}
  onAdd={createSession}
  onClose={removeSession}
  onData={(id, data) => transports[id].send(data)}
  onReady={(id, handle) => transports[id].subscribe(data => handle.write(data))}
  onDispose={id => transports[id].close()}
/>
```

Sessions require unique, stable `id` and `label`; optional fields are `icon`,
`metadata`, `initialData`, `readOnly`, and `closable`. The consumer owns the list
and add/close behavior. Omit `value` and use `defaultValue` for internal tab
selection. Removing the active session falls back to the first remaining one.
`getSession(id)` returns the handle, including for a background tab. Removing a
session disposes its engine; changing labels or theme does not recreate it.

`ariaLabel`, `addLabel`, `closeLabel`, and `emptyState` customize built-in copy.
The tab strip uses the kit Tabs keyboard navigation; xterm owns input, selection,
clipboard shortcuts, accessibility output, and scrolling within the terminal.

The terminal uses the kit ScrollArea's hover-only scrollbar, synchronized with
xterm's virtual scrollback through public APIs. Wheel scrolling, scrollbar
dragging, streaming output, and resizing all update the same scroll position.
Every closable session has a close button inside its tab header; closing an
inactive session does not select it first.
