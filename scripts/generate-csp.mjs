import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const dist = path.resolve("dist");
const hashes = new Set();
const pages = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && file.endsWith(".html")) pages.push(file);
  }
}
function inlineScripts(html) {
  return html.split("<script").slice(1).map((chunk) => {
    const end = chunk.indexOf(">");
    const close = chunk.indexOf("</script>");
    return { attrs: chunk.slice(0, end), body: close < 0 ? "" : chunk.slice(end + 1, close) };
  });
}
if (!fs.existsSync(dist)) throw new Error("dist does not exist; run astro build first");
walk(dist);
for (const file of pages) {
  for (const script of inlineScripts(fs.readFileSync(file, "utf8"))) {
    if (script.attrs.includes("src=") || !script.body.trim()) continue;
    hashes.add("'sha256-" + crypto.createHash("sha256").update(script.body).digest("base64") + "'");
  }
}
const csp = [
  "default-src 'self'",
  "script-src 'self' " + [...hashes].sort().join(" "),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");
const headerLine = "  Content-Security-Policy: " + csp;
if (Buffer.byteLength(headerLine) > 2000) throw new Error("CSP header exceeds Cloudflare Pages 2,000-byte line limit");
fs.writeFileSync(path.join(dist, "_headers"), ["/*", headerLine, "  X-Content-Type-Options: nosniff", ""].join(String.fromCharCode(10)));
console.log("Generated dist/_headers from " + pages.length + " HTML pages and " + hashes.size + " inline script hashes");
