export interface FileRejection {
  file: File;
  code: "type" | "size" | "count";
  message: string;
}
const imageTypes: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml",
  webp: "image/webp", gif: "image/gif", avif: "image/avif",
};
export function acceptsFile(file: File, accept?: string): boolean {
  if (!accept?.trim()) return true;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mime = file.type.toLowerCase() || imageTypes[extension] || "";
  return accept.split(",").map(part => part.trim().toLowerCase()).filter(Boolean).some(rule =>
    rule.startsWith(".") ? file.name.toLowerCase().endsWith(rule)
      : rule.endsWith("/*") ? mime.startsWith(rule.slice(0, -1)) : mime === rule,
  );
}
export function selectFiles(files: File[], options: { accept?: string; maxSize?: number; capacity: number }) {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of files) {
    if (!acceptsFile(file, options.accept)) rejected.push({ file, code: "type", message: `${file.name}: file type is not accepted.` });
    else if (options.maxSize !== undefined && file.size > options.maxSize) rejected.push({ file, code: "size", message: `${file.name}: file is too large.` });
    else if (accepted.length >= options.capacity) rejected.push({ file, code: "count", message: `${file.name}: file limit reached.` });
    else accepted.push(file);
  }
  return { accepted, rejected };
}
