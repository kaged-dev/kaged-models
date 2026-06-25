type Provider = {
  id: string;
  name: string;
  npm: string;
  api?: string;
  env: string[];
  doc: string;
  models: Record<string, Model>;
};

type Model = {
  id: string;
  name: string;
  cost?: {
    input?: number;
    output?: number;
    reasoning?: number;
    cache_read?: number;
    cache_write?: number;
  };
  limit?: {
    context?: number;
    input?: number;
    output?: number;
  };
  modalities?: {
    input?: string[];
    output?: string[];
  };
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

type Manifest = {
  source_commit: string;
  fetched_at: string;
  schema_version: string;
};

export type LogoMap = Record<string, string>;

export function renderIndex(
  providers: Record<string, Provider>,
  models: Record<string, unknown>,
  manifest: Manifest,
  logoMap: LogoMap,
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
      --bg-overlay: #16161A;
      --bg-inset: #08080A;
      --border-subtle: #1F1E1B;
      --border-default: #2B2924;
      --border-glow: #3D3A33;
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
      cursor: pointer;
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
    }
    .provider-card .models {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      z-index: 100;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .modal-overlay.open {
      display: flex;
    }
    .modal {
      background: var(--bg-elevated);
      border: 1px solid var(--border-default);
      border-radius: 0.75rem;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .modal-header {
      padding: 1.25rem;
      border-bottom: 1px solid var(--border-default);
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: space-between;
    }
    .modal-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .modal-title .logo {
      width: 2.5rem;
      height: 2.5rem;
      color: var(--amber);
    }
    .modal-title .logo svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .modal-title h2 {
      margin: 0;
      font-family: var(--font-ui);
      font-size: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--amber);
    }
    .modal-meta {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
    .modal-close {
      background: transparent;
      border: 1px solid var(--border-default);
      color: var(--text);
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-close:hover {
      border-color: var(--amber);
      color: var(--amber);
    }
    .modal-body {
      padding: 1.25rem;
      overflow-y: auto;
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
    .model-row .badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.75rem;
    }
    .model-row .badge-pill {
      font-family: var(--font-mono);
      font-size: 0.6875rem;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid var(--border-default);
      color: var(--text-muted);
    }
    .model-row .badge-pill.on {
      color: var(--amber);
      border-color: var(--amber-dim);
      background: var(--amber-faint);
    }
    .model-row .badge-pill.off {
      opacity: 0.5;
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
      .modal-header {
        padding: 1rem;
      }
      .modal-body {
        padding: 1rem;
      }
      .model-row .model-header {
        flex-direction: column;
        align-items: flex-start;
      }
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
              const logoSvg = logoMap[provider.id] ?? logoMap.default ?? "";
              return `
                <div class="provider-card" data-provider-id="${escapeHtml(provider.id)}" role="button" tabindex="0">
                  <div class="logo" aria-hidden="true">${logoSvg}</div>
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

  <div class="modal-overlay" id="modal-overlay" aria-hidden="true">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-header">
        <div class="modal-title">
          <div class="logo" id="modal-logo" aria-hidden="true"></div>
          <div>
            <h2 id="modal-title">Provider</h2>
            <div class="modal-meta" id="modal-meta"></div>
          </div>
        </div>
        <button class="modal-close" id="modal-close" aria-label="Close">×</button>
      </div>
      <div class="modal-body" id="modal-body">
        <p>Loading…</p>
      </div>
    </div>
  </div>

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

  <script>
    (function() {
      const logoMap = ${JSON.stringify(logoMap)};
      const fallbackLogo = logoMap.default || "";
      let providerData = null;
      let loading = false;

      const overlay = document.getElementById("modal-overlay");
      const closeBtn = document.getElementById("modal-close");
      const modalTitle = document.getElementById("modal-title");
      const modalMeta = document.getElementById("modal-meta");
      const modalLogo = document.getElementById("modal-logo");
      const modalBody = document.getElementById("modal-body");

      async function loadData() {
        if (providerData) return providerData;
        if (loading) {
          while (loading) await new Promise((r) => setTimeout(r, 50));
          return providerData;
        }
        loading = true;
        try {
          const res = await fetch("/api.json");
          providerData = await res.json();
          return providerData;
        } finally {
          loading = false;
        }
      }

      function formatNumber(n) {
        if (n === undefined || n === null) return "—";
        return n.toLocaleString();
      }

      function formatCost(n) {
        if (n === undefined || n === null) return "—";
        return "\$" + n.toFixed(2) + "/M";
      }

      function badge(label, on) {
        return \`<span class="badge-pill \${on ? "on" : "off"}">\${label}</span>\`;
      }

      function renderProvider(provider) {
        modalTitle.textContent = provider.name;
        modalMeta.textContent = provider.id + " · " + provider.npm;
        modalLogo.innerHTML = logoMap[provider.id] || fallbackLogo;

        const info = document.createElement("div");
        info.className = "provider-info";
        info.innerHTML = \`
          <div class="row"><span class="label">npm:</span> \${escapeHtml(provider.npm)}</div>
          <div class="row"><span class="label">env:</span> \${provider.env.map(escapeHtml).join(", ")}</div>
          \${provider.api ? \`<div class="row"><span class="label">api:</span> \${escapeHtml(provider.api)}</div>\` : ""}
          <div class="row"><span class="label">doc:</span> <a href="\${escapeHtml(provider.doc)}" target="_blank" rel="noopener">\${escapeHtml(provider.doc)}</a></div>
        \`;

        const list = document.createElement("div");
        list.className = "model-list";

        const modelEntries = Object.values(provider.models).sort((a, b) => a.name.localeCompare(b.name));
        for (const model of modelEntries) {
          const row = document.createElement("div");
          row.className = "model-row";
          const input = model.cost?.input ?? null;
          const output = model.cost?.output ?? null;
          const reasoning = model.cost?.reasoning ?? null;
          const cacheRead = model.cost?.cache_read ?? null;
          const cacheWrite = model.cost?.cache_write ?? null;
          const context = model.limit?.context ?? null;
          const maxOutput = model.limit?.output ?? null;
          const inputModalities = (model.modalities?.input || []).join(", ") || "—";
          const outputModalities = (model.modalities?.output || []).join(", ") || "—";
          row.innerHTML = \`
            <div class="model-header">
              <h3>\${escapeHtml(model.name)}</h3>
              <span class="model-id">\${escapeHtml(model.id)}</span>
            </div>
            <div class="costs">
              <div class="cost"><span>in</span> \${formatCost(input)}</div>
              <div class="cost"><span>out</span> \${formatCost(output)}</div>
              \${reasoning !== null ? \`<div class="cost"><span>reason</span> \${formatCost(reasoning)}</div>\` : ""}
              \${cacheRead !== null ? \`<div class="cost"><span>cache read</span> \${formatCost(cacheRead)}</div>\` : ""}
              \${cacheWrite !== null ? \`<div class="cost"><span>cache write</span> \${formatCost(cacheWrite)}</div>\` : ""}
            </div>
            <div class="limits">
              <span>ctx: \${formatNumber(context)}</span>
              <span>max out: \${formatNumber(maxOutput)}</span>
              <span>in: \${escapeHtml(inputModalities)}</span>
              <span>out: \${escapeHtml(outputModalities)}</span>
            </div>
            <div class="badges">
              \${badge("reasoning", !!model.reasoning)}
              \${badge("tools", !!model.tool_call)}
              \${badge("vision", !!model.attachment)}
              \${badge("structured", !!model.structured_output)}
              \${badge("temp", !!model.temperature)}
              \${badge("open weights", !!model.open_weights)}
              \${model.status ? badge(model.status, true) : ""}
            </div>
          \`;
          list.appendChild(row);
        }

        modalBody.innerHTML = "";
        modalBody.appendChild(info);
        modalBody.appendChild(list);
      }

      function escapeHtml(text) {
        if (text === null || text === undefined) return "";
        return String(text)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      function openModal(providerId) {
        loadData().then((data) => {
          const provider = data[providerId];
          if (!provider) return;
          renderProvider(provider);
          overlay.classList.add("open");
          overlay.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
        });
      }

      function closeModal() {
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }

      document.querySelectorAll(".provider-card").forEach((card) => {
        card.addEventListener("click", () => {
          const id = card.getAttribute("data-provider-id");
          if (id) openModal(id);
        });
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const id = card.getAttribute("data-provider-id");
            if (id) openModal(id);
          }
        });
      });

      closeBtn.addEventListener("click", closeModal);
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
      });
    })();
  </script>
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
