import { execSync } from "node:child_process";

export function getSubmoduleCommit(vendorDir: string): string {
  const stdout = execSync(`git -C ${JSON.stringify(vendorDir)} rev-parse HEAD`, {
    encoding: "utf8",
  });
  return stdout.trim();
}
