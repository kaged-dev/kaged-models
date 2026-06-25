import fs from "node:fs/promises";
import path from "node:path";
import { generateCatalog } from "../vendor/models.dev/packages/core/src/index.ts";
import { getSubmoduleCommit } from "./git.ts";
import { renderIndex } from "./site.ts";

const OUT_DIR = "./dist";
const VENDOR_DIR = "./vendor/models.dev";
const SCHEMA_VERSION = "1.0";

async function main() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const { providers, models } = await generateCatalog(VENDOR_DIR);

  await Bun.write(path.join(OUT_DIR, "api.json"), JSON.stringify(providers, null, 2));
  await Bun.write(path.join(OUT_DIR, "models.json"), JSON.stringify(models, null, 2));
  await Bun.write(
    path.join(OUT_DIR, "catalog.json"),
    JSON.stringify({ providers, models }, null, 2),
  );

  const sourceCommit = await getSubmoduleCommit(VENDOR_DIR);
  const manifest = {
    source_commit: sourceCommit,
    fetched_at: new Date().toISOString(),
    schema_version: SCHEMA_VERSION,
  };
  await Bun.write(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

  await copyLogos(VENDOR_DIR, OUT_DIR);
  await Bun.write(path.join(OUT_DIR, "index.html"), renderIndex(providers, models, manifest));
  await Bun.write(path.join(OUT_DIR, "404.html"), renderIndex(providers, models, manifest));

  console.log(`built ${OUT_DIR}:`);
  console.log(`  providers: ${Object.keys(providers).length}`);
  console.log(`  models:    ${Object.keys(models).length}`);
  console.log(`  source:    ${sourceCommit}`);
}

async function copyLogos(vendorDir: string, outDir: string) {
  const logosDir = path.join(outDir, "logos");
  await fs.mkdir(logosDir, { recursive: true });

  const defaultLogoPath = path.join(vendorDir, "providers", "logo.svg");
  const defaultLogo = Bun.file(defaultLogoPath);
  if (await defaultLogo.exists()) {
    await Bun.write(path.join(logosDir, "default.svg"), defaultLogo);
  }

  const providersDir = path.join(vendorDir, "providers");
  const entries = await fs.readdir(providersDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const logoPath = path.join(providersDir, entry.name, "logo.svg");
    const logoFile = Bun.file(logoPath);
    if (await logoFile.exists()) {
      await Bun.write(path.join(logosDir, `${entry.name}.svg`), logoFile);
    }
  }

  const labsDir = path.join(vendorDir, "labs");
  try {
    const labEntries = await fs.readdir(labsDir, { withFileTypes: true });
    const labsLogosDir = path.join(logosDir, "labs");
    await fs.mkdir(labsLogosDir, { recursive: true });
    for (const entry of labEntries) {
      if (!entry.isDirectory()) continue;

      const logoPath = path.join(labsDir, entry.name, "logo.svg");
      const logoFile = Bun.file(logoPath);
      if (await logoFile.exists()) {
        await Bun.write(path.join(labsLogosDir, `${entry.name}.svg`), logoFile);
      }
    }
  } catch (error) {
    if (isErrno(error) && error.code === "ENOENT") return;
    throw error;
  }
}

function isErrno(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

await main();
