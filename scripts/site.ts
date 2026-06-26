type Cost = {
  input?: number;
  output?: number;
  reasoning?: number;
  cache_read?: number;
  cache_write?: number;
};

type Limit = {
  context?: number;
  input?: number;
  output?: number;
};

type Modalities = {
  input?: string[];
  output?: string[];
};

type Model = {
  id: string;
  name: string;
  cost?: Cost;
  limit?: Limit;
  modalities?: Modalities;
  reasoning?: boolean;
  tool_call?: boolean;
  attachment?: boolean;
  structured_output?: boolean;
  temperature?: boolean;
  open_weights?: boolean;
  status?: string;
  knowledge?: string;
  release_date?: string;
  last_updated?: string;
};

type Provider = {
  id: string;
  name: string;
  npm: string;
  api?: string;
  env: string[];
  doc: string;
  models: Record<string, Model>;
};

type ModelMetadata = Model & {
  family?: string;
  benchmarks?: unknown[];
  weights?: unknown[];
  links?: unknown[];
  license?: string;
};

type Manifest = {
  source_commit: string;
  fetched_at: string;
  schema_version: string;
};

export type LogoMap = Record<string, string>;

const AMBER = "#FFB000";
const AMBER_BRIGHT = "#FFCC33";
const AMBER_DIM = "#806000";
const AMBER_FAINT = "#2A2010";
const MAGENTA = "#FF2E63";
const CYAN = "#00E0FF";
const BG_BASE = "#0A0A0B";
const BG_ELEVATED = "#111114";
const BG_OVERLAY = "#16161A";
const BG_INSET = "#08080A";
const BORDER_SUBTLE = "#1F1E1B";
const BORDER_DEFAULT = "#2B2924";
const BORDER_GLOW = "#3D3A33";
const TEXT = "#E8E6E1";
const TEXT_MUTED = "#8A8580";

function sharedStyles(): string {
  return `
    :root {
      --bg-base: ${BG_BASE};
      --bg-elevated: ${BG_ELEVATED};
      --bg-overlay: ${BG_OVERLAY};
      --bg-inset: ${BG_INSET};
      --border-subtle: ${BORDER_SUBTLE};
      --border-default: ${BORDER_DEFAULT};
      --border-glow: ${BORDER_GLOW};
      --amber: ${AMBER};
      --amber-bright: ${AMBER_BRIGHT};
      --amber-dim: ${AMBER_DIM};
      --amber-faint: ${AMBER_FAINT};
      --magenta: ${MAGENTA};
      --cyan: ${CYAN};
      --text: ${TEXT};
      --text-muted: ${TEXT_MUTED};
      --font-display: "Orbitron", sans-serif;
      --font-ui: "Rajdhani", system-ui, sans-serif;
      --font-mono: "JetBrains Mono", monospace;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg-base);
      color: var(--text);
      font-family: var(--font-ui);
      font-size: 16px;
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    a { color: var(--amber-bright); text-decoration: none; }
    a:hover { text-decoration: underline; }
    header {
      border-bottom: 1px solid var(--border-default);
      padding: 1.5rem 1rem;
      background: var(--bg-elevated);
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .brand {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .glyph {
      font-family: var(--font-display);
      color: var(--amber);
      font-size: 1.5rem;
    }
    h1 {
      font-family: var(--font-display);
      font-size: 1.5rem;
      margin: 0;
      color: var(--text);
      font-weight: 700;
      text-transform: lowercase;
      letter-spacing: 0.05em;
    }
    .badge {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--amber);
      background: var(--amber-faint);
      border: 1px solid var(--amber-dim);
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      text-transform: uppercase;
    }
    .nav-crumb {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin-top: 0.5rem;
    }
    .nav-crumb a {
      color: var(--amber-bright);
    }
    main {
      flex: 1;
      padding: 2rem 1rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat {
      background: var(--bg-elevated);
      border: 1px solid var(--border-default);
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .stat-number {
      font-family: var(--font-display);
      font-size: 2rem;
      color: var(--amber);
      margin: 0;
    }
    .stat-label {
      color: var(--text-muted);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .endpoints {
      background: var(--bg-inset);
      border: 1px solid var(--border-default);
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 2rem;
      font-family: var(--font-mono);
      font-size: 0.875rem;
    }
    .endpoints h2 {
      font-family: var(--font-ui);
      font-size: 1rem;
      margin: 0 0 0.75rem 0;
      color: var(--amber);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .endpoints ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .endpoints li {
      margin: 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .endpoints code {
      color: var(--cyan);
      background: var(--bg-base);
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
    }
    .providers h2, .provider-page h2, .model-page h2 {
      font-family: var(--font-ui);
      font-size: 1.25rem;
      color: var(--amber);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    .provider-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .provider-card {
      background: var(--bg-elevated);
      border: 1px solid var(--border-default);
      border-radius: 0.5rem;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .provider-card:hover {
      border-color: var(--border-glow);
      background: var(--bg-overlay);
    }
    .provider-card .logo {
      width: 2rem;
      height: 2rem;
      flex-shrink: 0;
      color: var(--amber);
    }
    .provider-card .logo svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .provider-card .name {
      font-weight: 600;
      color: var(--text);
    }
    .provider-card .models {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .provider-card a {
      display: contents;
    }
    .provider-info {
      background: var(--bg-inset);
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1.25rem;
      font-family: var(--font-mono);
      font-size: 0.875rem;
    }
    .provider-info a {
      color: var(--amber-bright);
      word-break: break-all;
    }
    .provider-info .row {
      margin: 0.35rem 0;
    }
    .provider-info .label {
      color: var(--text-muted);
    }
    .provider-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .provider-title .logo {
      width: 3rem;
      height: 3rem;
      color: var(--amber);
    }
    .provider-title .logo svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .provider-title h1 {
      font-size: 2rem;
      color: var(--amber);
    }
    .provider-title .meta {
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: 0.875rem;
    }
    .model-list {
      display: grid;
      gap: 0.75rem;
    }
    .model-row {
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .model-row a {
      color: var(--text);
    }
    .model-row a:hover {
      color: var(--amber-bright);
    }
    .model-row .model-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 0.5rem;
    }
    .model-row h3 {
      margin: 0;
      font-size: 1.125rem;
      color: var(--text);
    }
    .model-row .model-id {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .model-row .costs {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      margin: 0.75rem 0;
    }
    .model-row .cost {
      color: var(--cyan);
    }
    .model-row .cost span {
      color: var(--text-muted);
    }
    .model-row .limits {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      font-family: var(--font-mono);
      font-size: 0.8125rem;
      margin: 0.75rem 0;
      color: var(--text-muted);
    }
    .badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.75rem;
    }
    .badge-pill {
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid var(--border-default);
      color: var(--text-muted);
      white-space: nowrap;
    }
    .badge-pill.on {
      color: var(--amber);
      border-color: var(--amber-dim);
      background: var(--amber-faint);
    }
    .badge-pill.off {
      opacity: 0.5;
    }
    .model-page .global-meta {
      background: var(--bg-inset);
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      padding: 1rem;
      margin-bottom: 1.25rem;
    }
    .model-page .global-meta h3 {
      margin: 0 0 0.75rem 0;
      color: var(--amber);
      font-size: 1.25rem;
    }
    .model-page .global-meta .row {
      font-family: var(--font-mono);
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0.35rem 0;
    }
    .model-page .global-meta .row span {
      color: var(--text);
    }
    .offering-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9375rem;
      margin-bottom: 0.75rem;
    }
    .offering-table th {
      text-align: left;
      color: var(--text-muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-default);
      padding: 0.5rem 1rem;
      font-weight: 600;
    }
    .offering-table th.numeric {
      text-align: right;
    }
    .offering-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: middle;
    }
    .offering-table td:first-child {
      padding-left: 0;
    }
    .offering-table td:last-child {
      padding-right: 0;
    }
    .offering-table td.numeric {
      text-align: right;
      font-family: var(--font-mono);
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .offering-table td.numeric.cost {
      color: var(--cyan);
    }
    .offering-table tr:hover td {
      background: var(--bg-elevated);
    }
    .offering-provider {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .offering-provider .logo {
      width: 1.75rem;
      height: 1.75rem;
      color: var(--amber);
      flex-shrink: 0;
    }
    .offering-provider .logo svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .offering-provider a {
      font-weight: 600;
      color: var(--text);
    }
    .offering-provider a:hover {
      color: var(--amber-bright);
    }
    .offering-provider .provider-meta {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .offering-empty {
      color: var(--text-muted);
      font-style: italic;
      padding: 1rem;
      background: var(--bg-inset);
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .fuzzy-heading {
      font-family: var(--font-ui);
      font-size: 1.125rem;
      color: var(--amber);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 2.5rem;
      margin-bottom: 0.5rem;
    }
    .fuzzy-note {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    @media (max-width: 700px) {
      .offering-table {
        font-size: 0.875rem;
      }
      .offering-table th,
      .offering-table td {
        padding: 0.5rem 0.5rem;
      }
      .offering-table .hide-narrow {
        display: none;
      }
    }
    footer {
      border-top: 1px solid var(--border-default);
      padding: 1.5rem 1rem;
      background: var(--bg-elevated);
      color: var(--text-muted);
      font-size: 0.875rem;
    }
    .manifest {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      margin-top: 0.5rem;
      word-break: break-all;
    }
    .attribution {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-default);
    }
    @media (max-width: 600px) {
      .provider-grid {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      }
      .provider-title h1 {
        font-size: 1.5rem;
      }
      .model-row .model-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `;
}

function pageHead(title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>${sharedStyles()}</style>
</head>`;
}

function pageHeader(title: string, badge?: string, crumb?: string): string {
  return `
  <header>
    <div class="container">
      <div class="brand">
        <span class="glyph">影</span>
        <h1>${escapeHtml(title)}</h1>
        ${badge ? `<span class="badge">${escapeHtml(badge)}</span>` : ""}
      </div>
      ${crumb ? `<div class="nav-crumb">${crumb}</div>` : ""}
    </div>
  </header>`;
}

function pageFooter(manifest: Manifest): string {
  return `
  <footer>
    <div class="container">
      <div>[kaged] models catalog mirror</div>
      <div class="manifest">
        source: ${manifest.source_commit} · fetched: ${manifest.fetched_at} · schema: ${manifest.schema_version}
      </div>
      <div class="attribution">
        Catalog data derived from <a href="https://models.dev" target="_blank" rel="noopener">models.dev</a> (MIT, Anomaly / SST team).
        The kaged mirror is independent and not affiliated with or endorsed by models.dev.
      </div>
    </div>
  </footer>
</body>
</html>`;
}

export function renderIndex(
  providers: Record<string, Provider>,
  models: Record<string, ModelMetadata>,
  manifest: Manifest,
  logoMap: LogoMap,
): string {
  const providerCount = Object.keys(providers).length;
  const modelCount = Object.keys(models).length;
  const providerNames = Object.values(providers)
    .map((p) => p.name)
    .sort();

  return `${pageHead("kaged models — catalog mirror")}
<body>
  ${pageHeader("kaged models", "[CATALOG]")}
  <main>
    <div class="container">
      <div class="stats">
        <div class="stat">
          <div class="stat-number">${providerCount}</div>
          <div class="stat-label">Providers</div>
        </div>
        <div class="stat">
          <div class="stat-number">${modelCount}</div>
          <div class="stat-label">Models</div>
        </div>
      </div>

      <div class="endpoints">
        <h2>Data endpoints</h2>
        <ul>
          <li><code>/api.json</code> <span>provider catalog</span></li>
          <li><code>/models.json</code> <span>model-only metadata</span></li>
          <li><code>/catalog.json</code> <span>combined</span></li>
          <li><code>/manifest.json</code> <span>provenance</span></li>
          <li><code>/logos/{provider}.svg</code> <span>provider logos</span></li>
        </ul>
      </div>

      <div class="providers">
        <h2>Providers</h2>
        <div class="provider-grid">
          ${providerNames
            .map((name) => {
              const provider = Object.values(providers).find((p) => p.name === name)!;
              const modelCount = Object.keys(provider.models).length;
              const logoSvg = logoMap[provider.id] ?? logoMap.default ?? "";
              return `
                <a href="/provider/${provider.id}/" class="provider-card">
                  <div class="logo" aria-hidden="true">${logoSvg}</div>
                  <div>
                    <div class="name">${escapeHtml(provider.name)}</div>
                    <div class="models">${modelCount} model${modelCount === 1 ? "" : "s"}</div>
                  </div>
                </a>
              `;
            })
            .join("\n")}
        </div>
      </div>
    </div>
  </main>
  ${pageFooter(manifest)}`;
}

export function renderProviderPage(
  provider: Provider,
  providers: Record<string, Provider>,
  models: Record<string, ModelMetadata>,
  manifest: Manifest,
  logoMap: LogoMap,
): string {
  const logoSvg = logoMap[provider.id] ?? logoMap.default ?? "";
  const crumb = `<a href="/">kaged models</a> / provider / ${escapeHtml(provider.name)}`;

  return `${pageHead(`${provider.name} — kaged models`)}
<body class="provider-page">
  ${pageHeader(provider.name, "[PROVIDER]", crumb)}
  <main>
    <div class="container">
      <div class="provider-info">
        <div class="row"><span class="label">id:</span> ${escapeHtml(provider.id)}</div>
        <div class="row"><span class="label">npm:</span> ${escapeHtml(provider.npm)}</div>
        <div class="row"><span class="label">env:</span> ${provider.env.map(escapeHtml).join(", ")}</div>
        ${provider.api ? `<div class="row"><span class="label">api:</span> ${escapeHtml(provider.api)}</div>` : ""}
        <div class="row"><span class="label">doc:</span> <a href="${escapeHtml(provider.doc)}" target="_blank" rel="noopener">${escapeHtml(provider.doc)}</a></div>
      </div>

      <h2>Models</h2>
      <div class="model-list">
        ${Object.values(provider.models)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((model) => modelRow(model, provider, models, logoMap))
          .join("\n")}
      </div>
    </div>
  </main>
  ${pageFooter(manifest)}`;
}

export function renderModelPage(
  globalModelId: string,
  globalModel: ModelMetadata,
  providers: Record<string, Provider>,
  models: Record<string, ModelMetadata>,
  manifest: Manifest,
  logoMap: LogoMap,
): string {
  const crumb = `<a href="/">kaged models</a> / model / ${escapeHtml(globalModelId)}`;
  const { perfect, fuzzy } = findOfferings(globalModel, providers);

  return `${pageHead(`${globalModel.name} — kaged models`)}
<body class="model-page">
  ${pageHeader(globalModel.name, "[MODEL]", crumb)}
  <main>
    <div class="container">
      <div class="global-meta">
        <h3>${escapeHtml(globalModel.name)}</h3>
        <div class="row"><span>id:</span> ${escapeHtml(globalModelId)}</div>
        <div class="row"><span>family:</span> ${escapeHtml(globalModel.family ?? "—")}</div>
        <div class="row"><span>context:</span> ${formatNumber(globalModel.limit?.context)}</div>
        <div class="row"><span>modalities:</span> ${escapeHtml((globalModel.modalities?.input ?? []).join(", ") || "—")} → ${escapeHtml((globalModel.modalities?.output ?? []).join(", ") || "—")}</div>
        <div class="row"><span>release:</span> ${escapeHtml(globalModel.release_date ?? "—")}</div>
        <div class="row">
          <div class="badges">
            ${renderModelBadges(globalModel).join("\n")}
          </div>
        </div>
      </div>

      <h2>Offerings</h2>
      ${perfect.length === 0
        ? `<div class="offering-empty">No exact provider offerings found for this model.</div>`
        : renderOfferingTable(perfect, logoMap)}
      ${fuzzy.length > 0
        ? `
          <h3 class="fuzzy-heading">Similar matches</h3>
          <p class="fuzzy-note">These provider models look related but are not exact matches.</p>
          ${renderOfferingTable(fuzzy, logoMap)}
        `
        : ""}
    </div>
  </main>
  ${pageFooter(manifest)}`;
}

function findOfferings(
  globalModel: ModelMetadata,
  providers: Record<string, Provider>,
): { perfect: Array<{ provider: Provider; model: Model }>; fuzzy: Array<{ provider: Provider; model: Model }> } {
  const perfect: Array<{ provider: Provider; model: Model }> = [];
  const fuzzy: Array<{ provider: Provider; model: Model }> = [];
  const seenPerfect = new Set<string>();
  const seenFuzzy = new Set<string>();

  for (const provider of Object.values(providers)) {
    for (const model of Object.values(provider.models)) {
      const key = `${provider.id}::${model.id}`;
      if (isPerfectMatch(model, globalModel)) {
        if (!seenPerfect.has(key)) {
          seenPerfect.add(key);
          perfect.push({ provider, model });
        }
      } else if (isFuzzyMatch(model, globalModel)) {
        if (!seenPerfect.has(key) && !seenFuzzy.has(key)) {
          seenFuzzy.add(key);
          fuzzy.push({ provider, model });
        }
      }
    }
  }

  const sortByCost = (
    a: { provider: Provider; model: Model },
    b: { provider: Provider; model: Model },
  ): number => {
    const costA = a.model.cost?.input ?? Infinity;
    const costB = b.model.cost?.input ?? Infinity;
    if (costA !== costB) return costA - costB;
    return a.provider.name.localeCompare(b.provider.name);
  };

  return { perfect: perfect.sort(sortByCost), fuzzy: fuzzy.sort(sortByCost) };
}

function isPerfectMatch(model: Model, globalModel: ModelMetadata): boolean {
  return (
    model.name === globalModel.name ||
    model.id === globalModel.id ||
    model.id.endsWith(`/${globalModel.id}`)
  );
}

function isFuzzyMatch(model: Model, globalModel: ModelMetadata): boolean {
  const modelIdNorm = normalizeMatch(model.id);
  const globalIdNorm = normalizeMatch(globalModel.id);
  const modelNameNorm = normalizeMatch(model.name);
  const globalNameNorm = normalizeMatch(globalModel.name);

  return (
    modelIdNorm.includes(globalIdNorm) ||
    globalIdNorm.includes(modelIdNorm) ||
    modelNameNorm.includes(globalNameNorm) ||
    globalNameNorm.includes(modelNameNorm) ||
    modelIdNorm.includes(globalNameNorm) ||
    globalIdNorm.includes(modelNameNorm)
  );
}

function normalizeMatch(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function renderOfferingTable(
  offerings: Array<{ provider: Provider; model: Model }>,
  logoMap: LogoMap,
): string {
  return `
    <table class="offering-table">
      <thead>
        <tr>
          <th>Provider</th>
          <th class="numeric">Input</th>
          <th class="numeric">Output</th>
          <th class="numeric">Context</th>
          <th class="numeric hide-narrow">Max out</th>
        </tr>
      </thead>
      <tbody>
        ${offerings.map((offering) => renderOfferingRow(offering, logoMap)).join("\n")}
      </tbody>
    </table>
  `;
}

function renderOfferingRow(
  offering: { provider: Provider; model: Model },
  logoMap: LogoMap,
): string {
  const logoSvg = logoMap[offering.provider.id] ?? logoMap.default ?? "";
  const { model, provider } = offering;
  return `
    <tr>
      <td>
        <div class="offering-provider">
          <div class="logo" aria-hidden="true">${logoSvg}</div>
          <div>
            <a href="/provider/${provider.id}/">${escapeHtml(provider.name)}</a>
            <div class="provider-meta">${escapeHtml(model.id)}</div>
          </div>
        </div>
      </td>
      <td class="numeric cost">${formatCost(model.cost?.input)}</td>
      <td class="numeric cost">${formatCost(model.cost?.output)}</td>
      <td class="numeric">${formatNumber(model.limit?.context)}</td>
      <td class="numeric hide-narrow">${formatNumber(model.limit?.output)}</td>
    </tr>
  `;
}

function modelRow(
  model: Model,
  provider: Provider,
  globalModels: Record<string, ModelMetadata>,
  logoMap: LogoMap,
): string {
  const globalId = findGlobalModelId(model, provider, globalModels);
  const modelName = globalId
    ? `<a href="/model/${globalId}/">${escapeHtml(model.name)}</a>`
    : escapeHtml(model.name);

  return `
    <div class="model-row">
      <div class="model-header">
        <h3>${modelName}</h3>
        <span class="model-id">${escapeHtml(model.id)}</span>
      </div>
      ${modelDetails(model)}
    </div>
  `;
}

function findGlobalModelId(
  model: Model,
  provider: Provider,
  globalModels: Record<string, ModelMetadata>,
): string | null {
  const candidate1 = `${provider.id}/${model.id}`;
  if (globalModels[candidate1]) return candidate1;

  for (const [globalId, globalModel] of Object.entries(globalModels)) {
    if (globalModel.name === model.name && globalId.endsWith(`/${model.id}`)) {
      return globalId;
    }
  }

  for (const [globalId, globalModel] of Object.entries(globalModels)) {
    if (globalModel.name === model.name) {
      return globalId;
    }
  }

  return null;
}

function modelDetails(model: Model): string {
  const input = model.cost?.input ?? null;
  const output = model.cost?.output ?? null;
  const reasoning = model.cost?.reasoning ?? null;
  const cacheRead = model.cost?.cache_read ?? null;
  const cacheWrite = model.cost?.cache_write ?? null;
  const context = model.limit?.context ?? null;
  const maxOutput = model.limit?.output ?? null;
  const inputModalities = (model.modalities?.input || []).join(", ") || "—";
  const outputModalities = (model.modalities?.output || []).join(", ") || "—";

  return `
    <div class="costs">
      <div class="cost"><span>in</span> ${formatCost(input)}</div>
      <div class="cost"><span>out</span> ${formatCost(output)}</div>
      ${reasoning !== null ? `<div class="cost"><span>reason</span> ${formatCost(reasoning)}</div>` : ""}
      ${cacheRead !== null ? `<div class="cost"><span>cache read</span> ${formatCost(cacheRead)}</div>` : ""}
      ${cacheWrite !== null ? `<div class="cost"><span>cache write</span> ${formatCost(cacheWrite)}</div>` : ""}
    </div>
    <div class="limits">
      <span>ctx: ${formatNumber(context)}</span>
      <span>max out: ${formatNumber(maxOutput)}</span>
      <span>in: ${escapeHtml(inputModalities)}</span>
      <span>out: ${escapeHtml(outputModalities)}</span>
    </div>
    <div class="badges">
      ${renderModelBadges(model).join("\n")}
    </div>
  `;
}

function renderModelBadges(model: { reasoning?: boolean; tool_call?: boolean; attachment?: boolean; structured_output?: boolean; temperature?: boolean; open_weights?: boolean; status?: string }): string[] {
  return [
    badge("reasoning", !!model.reasoning),
    badge("tools", !!model.tool_call),
    badge("vision", !!model.attachment),
    badge("structured", !!model.structured_output),
    badge("temp", !!model.temperature),
    badge("open weights", !!model.open_weights),
    model.status ? badge(model.status, true) : "",
  ];
}

function badge(label: string, on: boolean): string {
  return `<span class="badge-pill ${on ? "on" : "off"}">${escapeHtml(label)}</span>`;
}

function formatNumber(n: number | null | undefined): string {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString();
}

function formatCost(n: number | null | undefined): string {
  if (n === undefined || n === null) return "—";
  return `$${n.toFixed(2)}/M`;
}

function escapeHtml(text: string | null | undefined): string {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function sanitizePathSegment(segment: string): string {
  return segment.replace(/[^a-zA-Z0-9._-]/g, "-");
}
