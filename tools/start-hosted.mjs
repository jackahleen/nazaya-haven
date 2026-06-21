import { spawnSync } from "node:child_process";

const port = process.env.HOSTED_TEST_PORT ?? process.env.PORT ?? "3001";

const result = spawnSync("next", ["start", "-H", "127.0.0.1", "-p", port], {
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
