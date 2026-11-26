# Self-hosted release/publish pipelines — design

Date: 2026-11-26
Status: Approved

## Purpose

Move the release chain (Release → Tag → Publish) from GitHub-hosted runners
(`runs-on: ubuntu-latest`) to self-hosted runners (`runs-on: [self-hosted, linux, x64]`).
The publish target, triggers, versioning, and step logic are unchanged: same
registry (`https://registry.npmjs.org`), same tags (`v<VERSION>`), same packages
(`@cjlapao/ui-kit`, `@cjlapao/ui-kit-vue`, `@cjlapao/ui-kit-i18n-cli`), same
`PUBLISH_TOKEN` secret.

`ci.yml` is not part of this change and stays on GitHub-hosted runners.

## Approach (A: one-line disable + duplicate files)

The hosted workflow files stay in the repo untouched except for a kill switch,
so they can be re-enabled later by deleting one line each. The self-hosted
duplicates take over the same triggers.

### New files

| File | Duplicates | Trigger | What it does |
| --- | --- | --- | --- |
| `.github/workflows/release-selfhost.yml` | `release.yml` | `workflow_dispatch` (major/minor/patch) | Bump `package.json` (root), `react/`, `vue/`, `tools/i18n-cli/` + `VERSION`; push `release/v<NEW>`; open PR against `main` with `gh` |
| `.github/workflows/tag-selfhost.yml` | `tag.yml` | push to `main` touching `VERSION` | Push `v<VERSION>` tag using `PUBLISH_TOKEN` (PAT required so the tag triggers publish) |
| `.github/workflows/publish-selfhost.yml` | `publish.yml` | `push: tags: ["v*"]` | 3 jobs (react, vue, i18n-cli): `npm ci` → build (cli: test) → `npm publish --provenance --access public` to npmjs |

Differences from the originals, deliberately the only ones:

1. `name:` gains a `(self-hosted)` suffix for the Actions UI.
2. `runs-on: [self-hosted, linux, x64]` replaces `runs-on: ubuntu-latest`
   (all five jobs across the three files).
3. `concurrency` guard on the tag and publish workflows:
   `group: <workflow-name>-${{ github.ref }}`, `cancel-in-progress: false` —
   two events for the same ref cannot race on the shared runner.

### Disabled hosted files

In `release.yml`, `tag.yml`, `publish.yml`: each job gets

```yaml
# DISABLED 2026-11-26 — superseded by *-selfhost.yml (self-hosted runners).
# Delete the `if: ${{ false }}` line below to re-enable.
if: ${{ false }}
```

Triggers stay intact so runs still appear (as skipped) in the Actions UI —
a visible audit trail of the swap. Re-enable = delete the `if:` line per job.

## End-to-end behavior (unchanged)

1. Actions → **Release (self-hosted)** → choose major/minor/patch.
2. Release PR opens against `main`; merge it.
3. The `VERSION` change on `main` fires **Tag release (self-hosted)** → pushes `v<VERSION>`.
4. The tag fires **Publish (self-hosted)** → three packages land on npmjs.

## Runner prerequisites (documented, not enforced)

- Standard GitHub runner requirements: `git`, `curl`, `tar`; `actions/setup-node`
  downloads its own Node (20 for release, 24 for publish).
- `gh` CLI on the PATH (release workflow opens the PR; `GITHUB_TOKEN`/`GH_TOKEN`
  come from `PUBLISH_TOKEN` as before).
- `npm install -g npm@latest` needs write access to the Node tool cache under
  the runner directory (true by default for `setup-node`-managed installs).
- `--provenance` requires OIDC (`id-token: write`, kept from the original).
  Supported on self-hosted runners on GitHub.com for public repos. If the
  runner cannot reach the OIDC endpoint (or the repo is private), the fallback
  is to drop `--provenance` from the publish commands.

## Out of scope

- `ci.yml` — stays hosted.
- Any change to package contents, version-bump logic, registries, or secrets.
- Removing the hosted files (explicitly kept for re-enablement).

## Amendment (2026-11-26) — publish stays hosted

Same day as approval: the publish leg reverted to GitHub-hosted runners.

- `publish.yml` re-enabled (all three jobs back on `ubuntu-latest`).
- `publish-selfhost.yml` is the one now disabled via `if: ${{ false }}`;
  delete those lines to move publishing onto the self-hosted runner later.
- `release-selfhost.yml` / `tag-selfhost.yml` unchanged — release and tag
  still run on the self-hosted runner, with `release.yml` / `tag.yml`
  remaining disabled.

Net live chain: **Release (self-hosted)** → PR → merge →
**Tag release (self-hosted)** → `v<VERSION>` tag → **Publish** (hosted).
