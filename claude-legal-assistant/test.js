import { askLegalAI } from "./services/claude.js";

async function run() {
  const res = await askLegalAI("Can a landlord evict without notice in California?");
  console.log(res.content);
}

run();
