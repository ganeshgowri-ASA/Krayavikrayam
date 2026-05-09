# Contributing to Krayavikrayam

Thanks for contributing. Krayavikrayam ships in small, traceable sessions tracked in [`docs/SESSION-INDEX.md`](docs/SESSION-INDEX.md). Read it before opening a PR.

## Session IDs

Every change is scoped to a session ID of the form:

```
KV-<TRACK><PARENT>.<CHILD>
```

For example, `KV-A1.6` is child #6 of parent A1 (Monorepo skeleton). The parent IDs and child splits live in [`docs/SESSION-INDEX.md`](docs/SESSION-INDEX.md). Coarse umbrellas from [`docs/CLAUDE-SESSIONS-v3.md`](docs/CLAUDE-SESSIONS-v3.md) remain valid where the index defers to them.

If your work doesn't fit an existing ID, open a PR against `docs/SESSION-INDEX.md` first to add the entry, then reference it from your implementation PR.

## Branch naming

```
kv/<id-lowercased>[-short-slug]
```

Examples:

- `kv/a1-2-tooling`
- `kv/a1-6-readme`
- `kv/c1-3-filter-bar`

Branch from `main`. One session = one branch = one PR.

## PR title

PR titles MUST start with the ID, followed by a colon and a concise summary:

```
KV-<id>: <summary>
```

Examples:

- `KV-A1.2: Tooling configs (eslint/prettier/husky)`
- `KV-A1.6: README + CONTRIBUTING`
- `KV-C1.3: Filter bar with debounced search`

## Commit messages

- Imperative mood, present tense (`add`, `fix`, `update`).
- Reference the session ID in the body when relevant.
- Keep commits focused; squash on merge unless history matters.

## Definition of Done

Copied from [`docs/SESSION-INDEX.md`](docs/SESSION-INDEX.md) — every child session must satisfy:

- Branch `kv/<id>`; PR title starts with the ID.
- Lint + typecheck + tests + build green in CI.
- No Prisma `generate`/`migrate` in `postinstall` or `build`.
- No changes outside the child's stated surface area.
- Updates this index if scope shifts.

## Local checks before opening a PR

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

CI runs the same set; failures there block merge.

## Scope discipline

- Don't fold unrelated cleanup into a session PR — open a separate `KV-<id>` for it.
- If you discover the scope must shift, update [`docs/SESSION-INDEX.md`](docs/SESSION-INDEX.md) in the same PR and call it out in the description.
- Never push to a session branch other than the one you own.

## Reviews

- At least one approving review before merge.
- Resolve all review threads or explain why a suggestion doesn't apply.
- Keep PRs small enough to review in one sitting; if it's bigger than a child session, split it.
