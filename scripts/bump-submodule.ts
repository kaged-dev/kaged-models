import { execSync } from "node:child_process";

const VENDOR_DIR = "./vendor/models.dev";

async function main() {
  console.log(`bumping submodule at ${VENDOR_DIR}...`);
  execSync(`git -C ${JSON.stringify(VENDOR_DIR)} fetch origin dev`, { stdio: "inherit" });
  const latest = execSync(
    `git -C ${JSON.stringify(VENDOR_DIR)} rev-parse origin/dev`,
    { encoding: "utf8" },
  ).trim();
  execSync(`git -C ${JSON.stringify(VENDOR_DIR)} checkout ${latest}`, { stdio: "inherit" });
  execSync(`git add ${JSON.stringify(VENDOR_DIR)}`, { stdio: "inherit" });

  const status = execSync("git status --short", { encoding: "utf8" }).trim();
  if (status === "") {
    console.log("submodule already at latest commit; nothing to commit");
    return;
  }

  execSync(`git commit -m "bump models.dev to ${latest}"`, { stdio: "inherit" });
  console.log(`committed submodule bump to ${latest}`);
}

await main();
