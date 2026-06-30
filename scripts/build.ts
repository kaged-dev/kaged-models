import fs from "node:fs/promises";
import path from "node:path";
import { generateCatalog } from "../vendor/models.dev/packages/core/src/index.ts";
import { getSubmoduleCommit } from "./git.ts";
import { renderIndex, renderProviderPage, renderModelPage } from "./site.ts";

const OUT_DIR = "./dist";
const VENDOR_DIR = "./vendor/models.dev";
const SCHEMA_VERSION = "1.0";

async function main() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  const { providers, models } = await generateCatalog(VENDOR_DIR);

  await mergeExtraProviders(providers, models);

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
  const logoMap = await buildLogoMap(VENDOR_DIR);
  const indexHtml = renderIndex(providers, models, manifest, logoMap);
  await Bun.write(path.join(OUT_DIR, "index.html"), indexHtml);
  await Bun.write(path.join(OUT_DIR, "404.html"), indexHtml);

  let providerPages = 0;
  for (const provider of Object.values(providers)) {
    const providerDir = path.join(OUT_DIR, "provider", provider.id);
    await fs.mkdir(providerDir, { recursive: true });
    const providerHtml = renderProviderPage(provider, providers, models, manifest, logoMap);
    await Bun.write(path.join(providerDir, "index.html"), providerHtml);
    providerPages++;
  }

  let modelPages = 0;
  for (const [globalModelId, globalModel] of Object.entries(models)) {
    const modelDir = path.join(OUT_DIR, "model", ...globalModelId.split("/"));
    await fs.mkdir(modelDir, { recursive: true });
    const modelHtml = renderModelPage(globalModelId, globalModel, providers, models, manifest, logoMap);
    await Bun.write(path.join(modelDir, "index.html"), modelHtml);
    modelPages++;
  }

  console.log(`built ${OUT_DIR}:`);
  console.log(`  providers: ${Object.keys(providers).length}`);
  console.log(`  models:    ${Object.keys(models).length}`);
  console.log(`  provider pages: ${providerPages}`);
  console.log(`  model pages:    ${modelPages}`);
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

  await copyExtraLogos(logosDir);

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

type LogoMap = Record<string, string>;

async function buildLogoMap(vendorDir: string): Promise<LogoMap> {
  const result: LogoMap = {};

  const defaultLogoPath = path.join(vendorDir, "providers", "logo.svg");
  const defaultLogo = Bun.file(defaultLogoPath);
  if (await defaultLogo.exists()) {
    result.default = await cleanSvg(await defaultLogo.text());
  }

  const providersDir = path.join(vendorDir, "providers");
  const entries = await fs.readdir(providersDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const logoPath = path.join(providersDir, entry.name, "logo.svg");
    const logoFile = Bun.file(logoPath);
    if (await logoFile.exists()) {
      result[entry.name] = await cleanSvg(await logoFile.text());
    }
  }

  await mergeExtraLogos(result);

  return result;
}

function cleanSvg(svg: string): string {
  return svg
    .replace(/\s+/g, " ")
    .replace(/ width="[^"]*"/g, "")
    .replace(/ height="[^"]*"/g, "")
    .replace(/fill="black"/g, 'fill="currentColor"')
    .replace(/fill="#000000"/g, 'fill="currentColor"')
    .replace(/fill="#000"/g, 'fill="currentColor"')
    .replace(/stroke="black"/g, 'stroke="currentColor"')
    .replace(/stroke="#000000"/g, 'stroke="currentColor"')
    .replace(/stroke="#000"/g, 'stroke="currentColor"');
}

function isErrno(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

type CatalogProviders = Record<string, any>;
type CatalogModels = Record<string, any>;

const EXTRA_DIR = path.join("vendor", "extra");

async function mergeExtraProviders(
  providers: CatalogProviders,
  models: CatalogModels,
): Promise<void> {
  let entries: fs.Dirent[];
  try {
    entries = await fs.readdir(EXTRA_DIR, { withFileTypes: true });
  } catch (error) {
    if (isErrno(error) && error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const providerJsonPath = path.join(EXTRA_DIR, entry.name, "provider.json");
    const file = Bun.file(providerJsonPath);
    if (!(await file.exists())) continue;

    const data = await file.json();
    if (data.provider) {
      const providerId = data.provider.id ?? entry.name;
      const providerEntry = { ...data.provider, id: providerId };
      if (data.models) {
        providerEntry.models = buildProviderModels(data.models);
      }
      providers[providerId] = providerEntry;
    }
    if (data.models) {
      Object.assign(models, data.models);
    }
  }
}

function buildProviderModels(models: CatalogModels): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, entry] of Object.entries(models)) {
    const meta = entry?.meta ?? {};
    const caps = meta.capabilities ?? {};
    const id = key.split("/").pop() ?? key;
    result[id] = {
      id,
      name: entry?.name ?? id,
      attachment: caps.vision ?? false,
      reasoning: caps.reasoning ?? false,
      tool_call: caps.functionCalling ?? false,
      structured_output: caps.responseSchema ?? false,
      temperature: true,
      streaming: caps.streaming ?? true,
    };
  }
  return result;
}

async function copyExtraLogos(logosDir: string): Promise<void> {  let entries: fs.Dirent[];
  try {
    entries = await fs.readdir(EXTRA_DIR, { withFileTypes: true });
  } catch (error) {
    if (isErrno(error) && error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const logoPath = path.join(EXTRA_DIR, entry.name, "logo.svg");
    const logoFile = Bun.file(logoPath);
    if (await logoFile.exists()) {
      await Bun.write(path.join(logosDir, `${entry.name}.svg`), logoFile);
    }
  }
}

async function mergeExtraLogos(logoMap: Record<string, string>): Promise<void> {
  let entries: fs.Dirent[];
  try {
    entries = await fs.readdir(EXTRA_DIR, { withFileTypes: true });
  } catch (error) {
    if (isErrno(error) && error.code === "ENOENT") return;
    throw error;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const logoPath = path.join(EXTRA_DIR, entry.name, "logo.svg");
    const logoFile = Bun.file(logoPath);
    if (await logoFile.exists()) {
      logoMap[entry.name] = await cleanSvg(await logoFile.text());
    }
  }
}

await main();
