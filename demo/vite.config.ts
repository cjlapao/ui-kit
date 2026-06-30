// @ts-check
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const demoRoot = __dirname;
const demoNodeModules = path.join(demoRoot, "node_modules");
const uiKitSrcDir = path.resolve(demoRoot, "../src");
const uiKitNodeModules = path.join(demoRoot, "..", "node_modules");

// Resolve bare specifiers from demo/node_modules when source files
// live outside demo/ (e.g. ui-kit/src/) which Rollup can't reach.
// Falls back to ui-kit/node_modules if not found in demo's.
function demoNodeModulesPlugin() {
  return {
    name: "demo-node-modules-resolver",
    resolveId(source: string, importer: string | undefined) {
      if (
        !source.startsWith(".") &&
        !source.startsWith("/") &&
        importer &&
        !importer.startsWith(demoRoot)
      ) {
        // Try demo's node_modules first
        let resolved = resolveFromModule(demoNodeModules, source);
        // Fall back to ui-kit's node_modules (if packages were removed from demo deps)
        if (!resolved) {
          resolved = resolveFromModule(uiKitNodeModules, source);
        }
        if (resolved) {
          return resolved;
        }
      }
      return null;
    },
  };
}

/**
 * Resolve a bare specifier to a file path within a given node_modules directory.
 * Supports package.json exports map, "module", "main", and fallback index.js resolution.
 */
function resolveFromModule(baseNodeModules: string, source: string): string | null {
  const pkgJsonPath = path.join(baseNodeModules, source, "package.json");
  if (!fs.existsSync(pkgJsonPath)) return null;

  const pkgJson = JSON.parse(
    fs.readFileSync(pkgJsonPath, "utf-8"),
  ) as {
    exports?: any;
    main?: string;
    module?: string;
  };

  let resolvedPath: string | null = null;

  // 1) Simple string exports
  if (typeof pkgJson.exports === "string") {
    resolvedPath = path.join(baseNodeModules, source, pkgJson.exports);
  }
  // 2) Object exports
  else if (pkgJson.exports && pkgJson.exports["."]) {
    const rootExport = pkgJson.exports["."];
    if (typeof rootExport === "string") {
      resolvedPath = path.join(baseNodeModules, source, rootExport);
    } else if (typeof rootExport === "object") {
      resolvedPath =
        typeof rootExport.default === "string"
          ? path.join(baseNodeModules, source, rootExport.default)
          : typeof rootExport.import === "string"
            ? path.join(baseNodeModules, source, rootExport.import)
            : typeof rootExport.node?.default === "string"
              ? path.join(baseNodeModules, source, rootExport.node.default)
              : path.join(baseNodeModules, source);
    }
  }
  // 3) package.module
  else if (pkgJson.module) {
    resolvedPath = path.join(baseNodeModules, source, pkgJson.module);
  }
  // 4) package.main
  else if (pkgJson.main) {
    resolvedPath = path.join(baseNodeModules, source, pkgJson.main);
  }
  // 5) fallback: package directory (for packages with index.js)
  if (!resolvedPath) {
    resolvedPath = path.join(baseNodeModules, source);
  }

  // Make sure the resolved file actually exists
  if (resolvedPath && fs.statSync(resolvedPath).isDirectory()) {
    const fallbackIndex = path.join(resolvedPath, "index.js");
    if (fs.existsSync(fallbackIndex)) resolvedPath = fallbackIndex;
    else return null;
  }
  if (resolvedPath && fs.existsSync(resolvedPath)) {
    return resolvedPath;
  }
  return null;
}

export default defineConfig({
  root: demoRoot,
  plugins: [demoNodeModulesPlugin(), react()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@cjlapao/ui-kit": path.resolve(demoRoot, "../src/index.ts"),
    },
  },
  build: {
    outDir: "build",
  },
  server: {
    port: 5174,
    host: "0.0.0.0"
  },
});
