/* eslint-disable no-restricted-syntax -- the fixtures below contain banned classes on purpose. */
import { ESLint } from "eslint";
import tseslint from "typescript-eslint";
import { amaRules } from "../registry/ama/lint/eslint.ama.mjs";

// Guards the brand rules shipped to consuming apps: each banned pattern must be reported, the
// approved pattern must pass, signal is allowed only in chrome files, and compat mode only warns.
const lint = async (code: string, filePath = "components/page.tsx", compat = false) => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [
      { files: ["**/*.tsx"], languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } } },
      ...amaRules({ entryPoint: "app/globals.css", files: ["**/*.tsx"], compat }),
    ],
  });
  const [result] = await eslint.lintText(code, { filePath });
  return result.messages;
};
const ruleHits = (msgs: { ruleId: string | null; message: string }[], text: string) => msgs.filter((m) => m.message.includes(text));

describe("amaRules", () => {
  it("passes on-brand code", async () => {
    const msgs = await lint(`export const A = () => <div className="bg-card text-foreground rounded-md"><StatusChip status="delivered" /><Logo /></div>;`);
    expect(msgs).toEqual([]);
  });
  it("blocks Tailwind palette classes and arbitrary values", async () => {
    const msgs = await lint(`export const A = () => <div className="bg-blue-500 text-[13px]" />;`);
    expect(msgs.some((m) => m.ruleId === "better-tailwindcss/no-unknown-classes")).toBe(true);
    expect(ruleHits(msgs, "Arbitrary value").length).toBe(1);
  });
  it("blocks status colours outside StatusChip, in JSX and in cva strings", async () => {
    expect(ruleHits(await lint(`export const A = () => <span className="bg-status-delivered-swatch" />;`), "StatusChip status").length).toBe(1);
    expect(ruleHits(await lint("const v = `px-2 text-status-ifa-ink`; export default v;"), "StatusChip status").length).toBe(1);
  });
  it("blocks signal outside chrome files and allows it in them", async () => {
    const code = `export const A = () => <a className="text-signal" />;`;
    expect(ruleHits(await lint(code, "components/board/toolbar.tsx"), "Website yellow").length).toBe(1);
    expect(ruleHits(await lint(code, "components/sidebar.tsx"), "Website yellow").length).toBe(0);
    expect(ruleHits(await lint(code, "components/shell/user-menu.tsx"), "Website yellow").length).toBe(0);
  });
  it("blocks logo images and imported logo files", async () => {
    expect(ruleHits(await lint(`export const A = () => <img src="/brand/ama-logo.svg" alt="" />;`), "<Logo />").length).toBe(1);
    expect(ruleHits(await lint(`import logo from "@/public/brand/ama-logo.svg"; export default logo;`), "<Logo />").length).toBe(1);
  });
  it("compat mode reports the same violations as warnings, never errors", async () => {
    const msgs = await lint(`export const A = () => <div className="bg-blue-500 bg-status-ifa-swatch text-signal text-sm" />;`, "components/page.tsx", true);
    expect(msgs.length).toBeGreaterThan(0);
    expect(msgs.every((m) => m.severity === 1)).toBe(true);
  });
});
