type Provider = {
  id: string;
  name: string;
  npm: string;
  api?: string;
  env: string[];
  doc: string;
  models: Record<string, unknown>;
};

type Manifest = {
  source_commit: string;
  fetched_at: string;
  schema_version: string;
};

export function renderIndex(
  providers: Record<string, Provider>,
  models: Record<string, unknown>,
  manifest: Manifest,
): string {
  const providerCount = Object.keys(providers).length;
  const modelCount = Object.keys(models).length;
  const providerNames = Object.values(providers)
    .map((p) => p.name)
    .sort();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>kaged models — catalog mirror</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-base: #0A0A0B;
      --bg-elevated: #111114;
      --bg-inset: #08080A;
      --border-default: #2B2924;
      --amber: #FFB000;
      --amber-bright: #FFCC33;
      --amber-dim: #806000;
      --amber-faint: #2A2010;
      --magenta: #FF2E63;
      --cyan: #00E0FF;
      --text: #E8E6E1;
      --text-muted: #8A8580;
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
      padding: 2rem 1rem;
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
      padding: 1rem;
      border-radius: 0.5rem;
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
    .providers h2 {
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
    }
    .provider-card img {
      width: 2rem;
      height: 2rem;
      object-fit: contain;
      flex-shrink: 0;
      color: var(--amber);
    }
    .provider-card .name {
      font-weight: 600;
    }
    .provider-card .models {
      font-size: 0.875rem;
      color: var(--text-muted);
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
  </style>
</head>
<body>
  <header>
    <div class="container">
      <div class="brand">
        <span class="glyph">影</span>
        <h1>kaged models</h1>
        <span class="badge">[CATALOG]</span>
      </div>
    </div>
  </header>
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
              return `
                <div class="provider-card">
                  <img src="/logos/${provider.id}.svg" alt="" onerror="this.src='/logos/default.svg'">
                  <div>
                    <div class="name">${escapeHtml(provider.name)}</div>
                    <div class="models">${modelCount} model${modelCount === 1 ? "" : "s"}</div>
                  </div>
                </div>
              `;
            })
            .join("\n")}
        </div>
      </div>
    </div>
  </main>
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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
