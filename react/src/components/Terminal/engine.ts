/** Keep the browser engine out of server evaluation and load it on demand. */
export async function loadTerminalEngine() {
  const [{ Terminal }, { FitAddon }] = await Promise.all([
    import("@xterm/xterm"),
    import("@xterm/addon-fit"),
  ]);
  return { Terminal, FitAddon };
}
