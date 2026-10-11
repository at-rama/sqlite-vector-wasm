# First npm publication

A maintainer completes the first public `@at-rama/sqlite-vector-wasm@0.1.0` publication from the archive already qualified and published by GitHub Actions. Later releases use the normal trusted publisher. The product name remains sqlite-vector-wasm; the package name includes `@at-rama/`.

This procedure requires authorized account/settings access, a separately authorized candidate integration, and authorization for the one manual npm publication. Documentation delivery and passing checks do not supply those authorizations. Stop at any missing prerequisite or mismatch and record the actual outcome. Use [candidate preparation](candidates.md), [publication](publication.md) and [acceptance prerequisites](acceptance.md) for their existing mechanisms.

## Establish initial access

Verify the authenticated npm account can create a public package in organization `@at-rama`, including any organization authentication/2FA requirements. Inspect the actual role and access: Developers membership alone is not a recorded publication-rights check. Query the exact scoped registry identity and retain the response status/body:

```sh
curl --silent --show-error --include 'https://registry.npmjs.org/@at-rama%2fsqlite-vector-wasm'
```

Only a recognized HTTP 404 with `error: Not found` supports package absence. A transport failure, authentication error, unreadable response or existing package is not an empty history. Inspect an existing publication as a conflict; do not create a placeholder, another scope or an intermediate unscoped package. Recheck absence immediately before the first publication; the preflight does not reserve the identity.

In GitHub repository **Settings → Actions → General**, verify that organization/repository policy allows the native workflow token to create PRs, including **Allow GitHub Actions to create and approve pull requests**. The Updates job needs `contents: write` and `pull-requests: write`. The release publishing job needs `contents: write`, `pull-requests: read`, `attestations: write` and `id-token: write` on the configured GitHub-hosted runner. Inspect live policy as well as [workflow declarations](../.github/workflows/release.yml); preserve protected-main checks and human integration. A blocked native token or supported attestation mechanism is a prerequisite failure, not a reason to add permanent credentials.

For the confirmed unavoidable first npm case, set repository **Settings → Secrets and variables → Actions → Variables**:

| Variable | Initial value |
| --- | --- |
| `RELEASE_SETUP` | `initial-manual-npm` |

Read the saved value back and record the result. Never let a missing variable or authentication failure select this disposition implicitly. Normal operation will later use `trusted`; no npm publishing token belongs in GitHub.

## Obtain the qualified initial handoff

Start Updates using `main` and the two exact stable upstream versions selected by the maintainer. There is no manual channel or distribution-version input: the shared calculation supplies `0.1.0` on `latest`. Inspect the candidate's complete qualification and approve any pending native-token PR workflow runs. Preparation stops at its PR; only the maintainer decides integration after all mandatory gates pass.

After authorized integration, **Distribution release** qualifies the resulting authoritative commit and definitive archive, then automatically creates `dist/v0.1.0` and the GitHub Release. In the initial disposition, its publishing step deliberately reports `npm-pending` with exit 2. Inspect the retained `outcome.json`: tag, draft, archive, provenance, attestation, GitHub finalization and GitHub identity operations must have succeeded. A red job alone does not establish this handoff; `status: failed` or missing operations indicate a different failure. Do not rerun `publish` to finish npm.

Retain the actual candidate/preparation, integration and publication run references. Download the run's `release-qualified-<runId>-<attempt>` and `release-outcome-<runId>-<attempt>` artifacts before their 30-day expiry. Inspect complete production/browser evidence for the integrated commit and accepted archive, not just candidate or historical fixture results. Preserve source origins/digests, build tools/options/environment, package inventory, browser/hosting results and publication outcomes. The signed archive and Release assets remain the durable payload handoff.

## Retrieve and verify the accepted bytes

Use GitHub CLI with the necessary repository read access. Record its version and verify that `gh attestation verify --help` supports the flags below. From the repository checkout, use a fresh external asset directory and the independently reviewed integration commit:

```sh
bootstrap_checkout="$PWD"
bootstrap_assets=$(mktemp -d)
bootstrap_commit='REPLACE_WITH_AUTHORITATIVE_40_HEX_COMMIT'
export bootstrap_assets bootstrap_commit
gh release download 'dist/v0.1.0' --repo at-rama/sqlite-vector-wasm \
  --dir "$bootstrap_assets" \
  --pattern payload.tgz --pattern publication.json --pattern attestation.json
```

The commit must come from the authorized integration/publication record and agree with the Release tag, qualification and `publication.json`. Do not derive expected identity solely from the downloaded metadata. Compare that metadata with the publication-run record; preparation's `publication.json` is not a published handoff. Validate the retained provenance through the existing release validator:

```sh
node --input-type=module <<'JS'
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import assert from 'node:assert/strict';
import {publicationIdentity} from './tools/release/state.mjs';
const p=publicationIdentity(JSON.parse(await readFile(join(process.env.bootstrap_assets,'publication.json'))));
assert.match(process.env.bootstrap_commit,/^[0-9a-f]{40}$/);
assert.equal(p.repository,'at-rama/sqlite-vector-wasm');
assert.equal(p.commit,process.env.bootstrap_commit);
assert.equal(p.initial,true); assert.equal(p.version,'0.1.0'); assert.equal(p.channel,'latest');
console.log(JSON.stringify({name:p.name,version:p.version,commit:p.commit,archive:p.archive}));
JS
gh attestation verify "$bootstrap_assets/payload.tgz" \
  --bundle "$bootstrap_assets/attestation.json" \
  --repo at-rama/sqlite-vector-wasm \
  --signer-workflow at-rama/sqlite-vector-wasm/.github/workflows/release.yml \
  --source-digest "$bootstrap_commit" --deny-self-hosted-runners \
  --format json > "$bootstrap_assets/attestation-verification.json"
```

Both commands must succeed. The CLI verifies the signature and configured source/signer identity; the repository's subject check alone is not cryptographic verification. Next compare the downloaded archive's exact size/SHA-256 and embedded package identity without changing its bytes:

```sh
python3 - <<'PY'
import hashlib,json,os,tarfile
from pathlib import Path
d=Path(os.environ['bootstrap_assets'])
p=json.loads((d/'publication.json').read_text())
payload=d/'payload.tgz'; data=payload.read_bytes()
assert len(data)==p['archive']['size']
assert hashlib.sha256(data).hexdigest()==p['archive']['sha256']
with tarfile.open(payload,'r:gz') as archive:
    entries=[m for m in archive.getmembers() if m.name=='package/package.json']
    assert len(entries)==1 and entries[0].isfile()
    metadata=json.load(archive.extractfile(entries[0]))
assert metadata['name']==p['name']=='@at-rama/sqlite-vector-wasm'
assert metadata['version']==p['version']=='0.1.0'
assert metadata['repository']['url']=='https://github.com/at-rama/sqlite-vector-wasm.git'
print(json.dumps({'size':len(data),'sha256':hashlib.sha256(data).hexdigest(),'package':metadata['name'],'version':metadata['version']}))
PY
```

Record verification outputs and successful exit statuses, and compare the digest with complete accepted evidence from the actual publication run. Stop on absent or inconsistent source, evidence, signature, version, channel or bytes. Never rebuild, repack, relabel or substitute an archive.

## Perform the one authorized npm operation

Use the repository's qualified Linux x86-64 tooling, Node.js `24.19.0` / npm `11.17.0`. Install/check it through the [existing harness](../tools/harness.sh); acquiring tooling does not reconstruct the published archive. Run `bash tools/harness.sh install` and confirm `bash tools/harness.sh check` succeeds before authentication. Use an isolated private working directory, empty global configuration and a temporary login configuration; exclude all of it from retained evidence:

```sh
bootstrap_private=$(mktemp -d)
chmod 700 "$bootstrap_private"
export npm_config_userconfig="$bootstrap_private/npmrc"
export npm_config_globalconfig="$bootstrap_private/global.npmrc"
touch "$npm_config_userconfig" "$npm_config_globalconfig"
chmod 600 "$npm_config_userconfig" "$npm_config_globalconfig"
unset NODE_AUTH_TOKEN NPM_TOKEN NPM_CONFIG_PROVENANCE_FILE npm_config_provenance_file
cd "$bootstrap_private"
bash "$bootstrap_checkout/tools/harness.sh" exec npm login \
  --registry=https://registry.npmjs.org/ --scope=@at-rama --auth-type=web
bash "$bootstrap_checkout/tools/harness.sh" exec npm whoami \
  --registry=https://registry.npmjs.org/
```

Complete interactive authentication/2FA through npm's prompts and recheck the authenticated account's organization rights. Do not put an OTP or credential in a command, report or log. After the separate publication authorization and successful preflight checks, publish the retained tarball exactly once:

```sh
bash "$bootstrap_checkout/tools/harness.sh" exec npm publish "$bootstrap_assets/payload.tgz" \
  --registry=https://registry.npmjs.org/ --access=public --tag=latest --ignore-scripts
```

Record the outcome and exit status without credentials. Public scope access, registry/channel and disabled package scripts are explicit. This local operation does not provide hosted npm OIDC provenance: its fallback is the verified signed GitHub archive and complete source/build/acceptance records. No supported attestation or qualification control is waived. Do not supply synthetic provenance, run `npm pack`, publish a directory or mutate a dist-tag separately.

If npm reports an error or transport uncertainty, inspect the destinations and retained evidence before any further decision. A successful destination remains published; do not delete, overwrite, republish or invoke the ordinary publisher as a repair. Stop rather than inventing a replacement number. The read-only completion command below can establish whether the first operation actually completed.

When the interactive session is no longer needed, log out with the same temporary configuration and remove the temporary configuration files. Retain the verified assets and sanitized outcome, never the login configuration or npm debug logs containing sensitive information.

## Check completion without publishing

Return to the identity-reconciled checkout. Supply authorized GitHub read access through `GH_TOKEN` or `GITHUB_TOKEN` where required, without recording its value. Run the existing command and retain its output and exit status:

```sh
cd "$bootstrap_checkout"
sh tools/release.sh check-initial "$bootstrap_assets/publication.json"
```

Exit 0 with `status: complete` establishes matching initial GitHub/npm version/channel/revision and exact archive bytes. Exit 2 with `status: npm-pending` keeps the first publication pending; exit 1 is failure. Inaccessible or inconsistent evidence is non-success. This command reads destinations only and cannot recreate tags, publish, repack or repair another partial attempt. Record first-publication completion only after it succeeds.

## Establish subsequent trusted publication

In npm package **Settings → Trusted publishing**, add a GitHub Actions publisher for the created scoped package:

| Field | Value |
| --- | --- |
| Organization or user | `at-rama` |
| Repository | `sqlite-vector-wasm` |
| Workflow filename | `release.yml` |
| Environment name | Empty; the current publishing job declares none |
| Allowed action | Explicitly allow direct `npm publish` |

Read back the saved binding and action permission. Stage-only access would add a recurring human publication step and cannot execute the selected normal workflow. The current workflow needs no separate dist-tag action. Record configuration time and validation deadline: npm currently expires a new publisher unless its first successful hosted publication occurs within two days. Coordinate configuration with a forthcoming normal authorized release, or recreate an expired binding before that release. Do not force a release, reuse `0.1.0` or introduce a keepalive to demonstrate access.

After matching first-publication completion and usable trusted setup, change `RELEASE_SETUP` to `trusted`, read it back, and retain the result. Distinguish **initial publication complete**, **trusted access configured and still usable**, and **trusted access demonstrated**. Only an actual subsequent successful normal hosted publication demonstrates OIDC access. Expired or insufficient setup is unready, even if it was previously saved; subsequent publication remains subject to ordinary human initiation/integration and all qualification controls. There is no recurring manual npm path or steady-state publishing token.

## References and execution record

The active Change's [execution record](../.42p/openspec/changes/bootstrap-npm-publication/execution-evidence.md) carries dated non-secret observations and pending/failure states. Keep procedure and evidence distinct. After archival, use the record moved with that Change.

Command/settings references checked on 2026-10-11: [npm tarball publication](https://docs.npmjs.com/cli/v11/commands/npm-publish/), [scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/), [interactive login](https://docs.npmjs.com/cli/v11/commands/npm-login/), [npm configuration](https://docs.npmjs.com/cli/v11/using-npm/config/) and [GitHub attestation verification](https://cli.github.com/manual/gh_attestation_verify). [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) specifies binding, direct-publish permissions and initial configuration expiry. Recheck moving requirements at execution; they do not authorize publication or revise product obligations.
