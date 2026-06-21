export type NazayaRuntime = "hosted" | "static";

export function getNazayaRuntime(): NazayaRuntime {
  return process.env.NEXT_PUBLIC_NAZAYA_RUNTIME === "hosted"
    ? "hosted"
    : "static";
}

export function isStaticNazayaRuntime(): boolean {
  return getNazayaRuntime() !== "hosted";
}
