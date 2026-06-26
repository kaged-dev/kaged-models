# kaged-models

> Self-hosted mirror of the [models.dev](https://github.com/anomalyco/models.dev) provider catalog for [kaged](https://kaged.dev). Publishes `https://models.kaged.dev`.

This repository is the data source behind [ADR-0049: Provider store dynamic loading](https://github.com/kaged-dev/monorepo/blob/main/docs/adr/0049-provider-store-dynamic-loading.md). It is intentionally a sibling repo to the kaged monorepo — it has a different lifecycle (nightly vendored snapshot vs. code commits) and must not be blurred into the daemon source tree.

## What this repo does

1. Carries `anomalyco/models.dev` as a pinned Git submodule on the `dev` branch.
2. Nightly CI bumps the submodule, runs the models.dev generator, and emits:
   - `api.json` — provider catalog with `npm` / `api` / `env` and per-provider models
   - `models.json` — provider-agnostic model metadata
   - `catalog.json` — combined `api.json` + `models.json`
   - `logos/{provider}.svg` — provider logos, self-hosted
   - `manifest.json` — provenance: `{ source_commit, fetched_at, schema_version }`
3. Renders a small kaged-branded site with MIT attribution:
   - `/` — provider index
   - `/provider/{id}/` — provider details and its models
   - `/model/{provider}/{id}/` — model details with cross-provider price comparison
4. Deploys the built `dist/` directory to the `models` branch of the Cloudflare Pages project `kaged` at `models.kaged.dev`.

The daemon bundles the catalog JSON and logos at image-build time, so a fresh daemon is offline-capable for metadata without fetching the live mirror on startup.

## Layout

```
├── .github/workflows/publish.yml   # nightly build + Pages publish
├── scripts/
│   ├── build.ts                    # generate JSON, copy logos, render site
│   ├── bump-submodule.ts           # bump vendor/models.dev to origin/dev
│   └── site.ts                     # kaged-branded HTML page renderer
├── vendor/models.dev               # git submodule (anomalyco/models.dev, dev branch)
├── dist/                           # build output (gitignored, deployed via wrangler)
└── README.md
```

## Development

Requires [Bun](https://bun.sh) >= 1.3.9.

```bash
# one-time
bun install
cd vendor/models.dev && bun install

# build the catalog into dist/
bun run build

# bump the models.dev submodule
bun run bump

# typecheck
bun run typecheck
```

## Catalog endpoints

Once published, the following endpoints are available at `https://models.kaged.dev`:

| Endpoint | Description |
|---|---|
| `/api.json` | Provider catalog. Each provider entry has `npm`, `api`, `env`, `name`, `doc`, and `models`. |
| `/models.json` | Provider-agnostic model metadata. |
| `/catalog.json` | Combined `providers` + `models` in one file. |
| `/manifest.json` | Provenance: submodule commit, build timestamp, schema version. |
| `/logos/{provider}.svg` | Provider logo. Falls back to `default.svg` if unavailable. |
| `/provider/{id}/` | Provider page: details, models, and links. |
| `/model/{provider}/{id}/` | Model page: cross-provider offerings and pricing. |

## Provenance

`manifest.json` carries the exact commit of the models.dev submodule that produced the build, so the daemon can trace stale metadata back to its source.

```json
{
  "source_commit": "7ceac334bbacc5ece7fbaea510ac5d7b850cfdf0",
  "fetched_at": "2026-06-25T16:49:30.375Z",
  "schema_version": "1.0"
}
```

## Attribution

Catalog data is derived from [models.dev](https://github.com/anomalyco/models.dev) by Anomaly / the SST team, used under the MIT license. The kaged mirror is independent and not affiliated with or endorsed by models.dev.

## Cloudflare Pages setup

The workflow deploys the built `dist/` directory directly to the Cloudflare Pages project `kaged` on the `models` branch using Wrangler.

1. Ensure the Cloudflare Pages project `kaged` exists.
2. Add these repository secrets to `kaged-dev/kaged-models`:
   - `CLOUDFLARE_API_TOKEN` — an API token with `Cloudflare Pages:Edit` permission for the project.
   - `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID that owns the project.
3. Add the custom domain `models.kaged.dev` in the Pages dashboard for the `models` branch.

The workflow also uses the default `GITHUB_TOKEN` to commit submodule bumps.

## License

This repository is licensed under the MIT License. See [LICENCE.md](LICENCE.md).

## See also

- [ADR-0049: Provider store dynamic loading](https://github.com/kaged-dev/monorepo/blob/main/docs/adr/0049-provider-store-dynamic-loading.md) — the decision this repo implements
- [Spec: LLM Provider Interface](https://github.com/kaged-dev/monorepo/blob/main/docs/specs/llm.md) — daemon consumer contract
- [models.dev](https://github.com/anomalyco/models.dev) — upstream catalog source
