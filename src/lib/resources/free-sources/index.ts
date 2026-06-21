import { curatedSource } from "./curated";
import { hrsaSource } from "./hrsa";
import { samhsaSource } from "./samhsa";
import { ohanaSMCSource } from "./ohana-smc";

export { curatedSource } from "./curated";
export { hrsaSource } from "./hrsa";
export { samhsaSource } from "./samhsa";
export { ohanaSMCSource } from "./ohana-smc";
export type { FreeResourceSource } from "./types";

/**
 * All available free resource sources, in priority order.
 * Curated is first (always works), then public APIs.
 */
export const allFreeSources = [curatedSource, hrsaSource, samhsaSource, ohanaSMCSource];
