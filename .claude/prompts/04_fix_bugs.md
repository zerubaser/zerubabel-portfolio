# Prompt: Fix a Bug

Reusable prompt to fix a bug in **zerubabel.et** with a minimal, verified change.

---

## Copy-paste prompt

```
Fix this bug: {{BUG_DESCRIPTION}}

Context: read PLAN.md, the relevant .claude/specs/ files, and the affected code.
Stay within the LOCKED STACK and the 7 RULES.

Work in this order and show your work:

1. Reproduce
   - State the exact steps, inputs, and environment that trigger the bug.
   - Write or identify a failing test (or a precise manual repro) that captures it.
   - If you cannot reproduce, stop and report what you tried and what info you need.

2. Root cause
   - Trace to the actual cause, not the symptom. Explain the mechanism in 1-3
     sentences. Note whether it is a spec, logic, validation, auth, or env issue.

3. Minimal fix
   - Change the smallest set of files that correctly fixes the root cause.
   - Do not refactor unrelated code or add packages. Preserve existing behavior
     elsewhere. Keep Rule 1 (no @db.LongText/@db.Text) and all other rules intact.

4. Test
   - Add or adjust a test so the bug cannot silently return. Confirm it now passes.

5. Verify no regressions
   - Run lint, typecheck, and the test suite. For build-affecting changes, note
     that the build runs OFF-server (Rule 3).
   - Re-check related flows (auth, uploads, 3D lazy-load) that could be impacted.

Output: root cause, files changed, the test added/changed, and verification
results. Do not commit. Stop after reporting.
```

---

## Notes
- If the bug stems from a spec ambiguity, fix the spec note too and flag it for approval.
- Prefer reproducing on the real data shape; avoid mocking away the actual failure.
