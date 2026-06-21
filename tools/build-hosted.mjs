import { spawnSync } from "node:child_process";

const result = spawnSync("next", ["build"], {
  env: {
    ...process.env,
    NAZAYA_RUNTIME: "hosted",
  },
  shell: process.platform === "win32",
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
