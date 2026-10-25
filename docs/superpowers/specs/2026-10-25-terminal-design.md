# Terminal components

Approved in chat: wrap xterm.js with the kit's Panel, Tabs, and IconButton.

Terminal provides ANSI output, keyboard input, resizing, configurable font,
cursor, read-only mode, and theme. Its imperative ref exposes write, writeln,
clear, reset, focus, and fit. onReady gives the same handle; onData and onResize
connect to consumer-owned PTY transport. It never starts a shell itself.

Both Terminal and TerminalTabs accept Panel surface properties: variant, tone,
corner, padding, glassOpacity, vibrancy, specularMode. Terminal content uses a
transparent xterm background so glass surfaces remain visible; foreground and
ANSI colors follow light/dark mode or an explicit terminal theme. Size defaults
to a useful fixed height and can fill a parent through height="100%".

TerminalTabs accepts sessions with unique ids, labels, optional icon, metadata,
initial output, and readOnly. Selection supports controlled/uncontrolled state;
add and close callbacks let consumers own the session list. All sessions stay
mounted with stable keys until removed, preserving output and connections.
Inactive sessions are hidden and refit when selected. A forwarded ref routes
writes and imperative actions by session id, including background sessions.

The xterm engine loads only on the client, asynchronously. Dispose subscriptions,
resize/theme observers and terminal instances on unmount, including React Strict
Mode and async import cancellation. Theme/font changes update an existing
instance rather than losing its scrollback. Include xterm CSS in the kit styles.

Add a docs page with a live local echo demo, ANSI colors, tabs, surface controls,
and a read-only example. Validate lifecycle, callbacks, session persistence,
selection/closing, styling passthrough, TypeScript, and actual browser rendering.

## ScrollArea and per-tab closing

Terminal uses ScrollArea's optional controlled `virtualScroll` adapter. xterm
owns rendering, input, and scrollback; the kit scrollbar reads total rows,
visible rows, and viewport offset through public buffer APIs. Dragging it calls
`scrollToLine`. Scroll, parsed-output, and resize events synchronize the thumb.
xterm's own scrollbar is hidden. The kit bar appears only on hover.

Tabs now accepts `TabItem.trailingAction`, positioned beside that individual
tab as a sibling of its button, preventing nested interactive elements.
TerminalTabs uses it for every closable session. Closing a background tab does
not activate it. Add and active-session metadata remain in the toolbar.
