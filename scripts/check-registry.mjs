// Fails when public/r (the published registry JSON that apps install from) is out of date with registry.json
// and the source files. Run `npm run registry` to rebuild it, then commit public/r.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const tmp = ".build/r-check";
rmSync(tmp, { recursive: true, force: true });
execFileSync("npx", ["shadcn", "build", "-o", tmp], { stdio: "ignore" });
const list = (dir) => readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
const built = list(tmp);
let published = [];
try { published = list("public/r"); } catch { /* missing */ }
const stale = [
  ...built.filter((f) => !published.includes(f) || readFileSync(join(tmp, f), "utf8") !== readFileSync(join("public/r", f), "utf8")),
  ...published.filter((f) => !built.includes(f)),
];
if (stale.length) {
  console.error(`public/r is out of date: ${stale.join(", ")}. Run npm run registry and commit public/r.`);
  process.exit(1);
}
console.log(`public/r up to date (${built.length} items).`);
