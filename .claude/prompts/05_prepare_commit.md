# Prompt: Prepare a Commit

Reusable prompt to prepare a clean, verified commit for **zerubabel.et**.

---

## Copy-paste prompt

```
Prepare a commit for the change: {{CHANGE_SUMMARY}}

Follow the LOCKED STACK and 7 RULES. Do these steps and report results:

1. Run checks (all must pass before committing)
   - Lint
   - Typecheck
   - Tests
   - Production build OFF-server (Rule 3; output: "standalone" must succeed)
   If any check fails, stop and report — do not commit.

2. Review the diff
   - Confirm no debug logs, secrets, .env values, or stray files.
   - Confirm no @db.LongText/@db.Text crept into the Prisma schema (Rule 1).
   - Confirm DATABASE_URL still carries ?connection_limit=5 if touched (Rule 6).

3. Stage only related files
   - Stage exactly the files for this change; leave unrelated changes unstaged.

4. Write a Conventional Commit message
   - Format: type(scope): subject  (feat, fix, chore, refactor, docs, test, perf,
     build, ci). Imperative mood, <= 72 char subject.
   - Body: what and why, not how. Reference the spec/feature if relevant.
   - Note any migration or env-var change in the body.

5. Suggest a branch name
   - Format: type/short-kebab-summary (e.g. feat/project-crud-admin).

Output the staged file list, the proposed commit message, and the branch name.
Do not push. Only commit if explicitly told to.
```

---

## Notes
- Migrations: mention `prisma migrate` status and whether `migrate deploy` is needed on the server.
- Keep commits scoped to one logical change; split if the diff spans unrelated areas.
