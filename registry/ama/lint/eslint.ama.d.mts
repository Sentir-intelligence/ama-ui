import type { Linter } from "eslint";

export interface AmaRulesOptions {
  /** CSS entry that imports the AMA theme, e.g. "app/globals.css". */
  entryPoint: string;
  /** Files the rules apply to. Default: all JS/TS files. */
  files?: string[];
  /** ama-os migration only: every rule warns instead of erroring. */
  compat?: boolean;
  /** Files that render on navy chrome and may use the signal colour. */
  chromeFiles?: string[];
}

export function amaRules(options: AmaRulesOptions): Linter.Config[];
