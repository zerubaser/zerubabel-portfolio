# 0002 — Use PostgreSQL with Prisma

## Status

Accepted

## Context

zerubabel.et needs a relational database for portfolio content and admin data, accessed through Prisma from the Next.js app. The two realistic options were **MySQL** and **PostgreSQL**. PostgreSQL is the stronger default for a TypeScript/Prisma stack: richer types (JSONB, arrays, native UUID, full-text search), stricter standards conformance, and excellent Prisma support.

Choosing the engine also locks in some engine-specific rules that the schema must respect to stay portable and correct.

## Decision

Use **PostgreSQL** as the database and **Prisma** as the ORM / migration tool.

The following rules are part of this decision and **must be followed** in `schema.prisma`:

- **Do NOT use MySQL-only text attributes.** `@db.LongText` and `@db.Text` are **MySQL-specific** and must not appear in the schema. In PostgreSQL a plain Prisma `String` maps to `text`, which is **unlimited-length** — there is no need (and no valid mapping) for `@db.LongText`/`@db.Text`. Use plain `String` for long text fields.
- **PostgreSQL 15 schema-permission requirement.** On PostgreSQL 15+, the `public` schema is no longer writable by all users by default. The application database role must be explicitly granted privileges on the target schema, e.g.:

  ```sql
  GRANT ALL ON SCHEMA public TO <app_user>;
  ```

  (or own the schema) so that `prisma migrate deploy` can create and alter tables. This must be configured when provisioning the database, otherwise migrations fail with permission-denied errors.

## Consequences

### Positive

- Unlimited-length text via plain `String` — no engine-specific text annotations to manage.
- Access to PostgreSQL-native features (JSONB, arrays, full-text search) if needed later.
- First-class Prisma support and predictable migrations.
- Schema stays portable and free of MySQL-isms.

### Negative / Risks

- The PG15 schema-permission step is easy to forget and produces confusing migration failures until the grant is applied — documented here to prevent that.
- Self-hosting PostgreSQL on the small Lightsail box consumes some of the limited RAM; it must be tuned conservatively (low `shared_buffers`, modest `max_connections`).
- Using `@db.LongText`/`@db.Text` out of habit (copied from MySQL examples) will break against PostgreSQL — reviewers must reject it.

## Alternatives Considered

- **MySQL** — rejected: weaker type system for this stack, would invite `@db.LongText`/`@db.Text` usage, and offers no advantage for this project.
- **SQLite** — rejected: not suitable for a server-hosted app with an admin writing content concurrently; limited migration/feature story.
