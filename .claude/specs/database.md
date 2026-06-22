# Database — zerubabel.et (canonical Prisma schema)

> **Source of truth:** [`docs/03_DATABASE_SPEC.md`](../../docs/03_DATABASE_SPEC.md).
> This file mirrors that schema verbatim for quick AI/editor access. If the two
> ever diverge, `docs/03_DATABASE_SPEC.md` wins — update this copy to match, never
> the other way around.

## Postgres conventions (read first)

This project uses **PostgreSQL**, not MySQL. PostgreSQL's native `text` type is
already unlimited-length, so **NEVER** use the MySQL-only attributes
`@db.LongText` or `@db.Text`. They are invalid for Postgres and will break
`prisma migrate`. All long-text fields are plain `String` / `String?` and map to
Postgres `text` automatically.

```prisma
// WRONG (MySQL-only, invalid on Postgres):
description String  @db.LongText
problem     String? @db.Text

// RIGHT (Postgres):
description String
problem     String?
```

Other conventions:
- `id` uses `cuid()`; timestamps via `createdAt @default(now())` and `updatedAt @updatedAt`.
- `keywords` fields are `String[]` (Postgres native array), not `String?`.
- `DATABASE_URL` must include `?connection_limit=5` (Rule 6).
- PG15 requires `GRANT ALL ON SCHEMA public` + `ALTER DATABASE ... OWNER TO ...` on setup (Rule 2).

---

## Canonical schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  EDITOR
}

enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum Visibility {
  PUBLIC
  LIMITED
  CONFIDENTIAL
}

enum ImageType {
  COVER
  GALLERY
  SCREENSHOT
  LOGO
  MOCKUP
  PROFILE
  OG_IMAGE
}

model User {
  id           String   @id @default(cuid())
  name         String?
  email        String   @unique
  passwordHash String
  role         Role     @default(ADMIN)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model SiteSettings {
  id                     String   @id @default(cuid())
  siteName               String   @default("Zerubabel Shimeles")
  siteUrl                String   @default("https://zerubabel.et")
  title                  String?
  heroTitle              String?
  heroSubtitle           String?
  bio                    String?
  email                  String?
  phone                  String?
  location               String?
  profileImage           String?
  resumeUrl              String?
  socialLinks            Json?
  defaultMetaTitle       String?
  defaultMetaDescription String?
  defaultOgImage         String?
  keywords               String[]
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  order       Int       @default(0)
  projects    Project[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Project {
  id              String         @id @default(cuid())
  title           String
  slug            String         @unique
  summary         String
  description     String?
  clientName      String?
  projectType     String?
  industry        String?
  myRole          String?
  startDate       DateTime?
  endDate         DateTime?
  problem         String?
  solution        String?
  features        String?
  outcome         String?
  impactMetrics   Json?
  liveUrl         String?
  githubUrl       String?
  isConfidential  Boolean        @default(false)
  visibility      Visibility     @default(PUBLIC)
  featured        Boolean        @default(false)
  status          Status         @default(DRAFT)
  order           Int            @default(0)
  metaTitle       String?
  metaDescription String?
  ogImage         String?
  canonicalUrl    String?
  keywords        String[]
  categoryId      String
  category        Category       @relation(fields: [categoryId], references: [id])
  techStack       ProjectTech[]
  images          ProjectImage[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model ProjectImage {
  id        String    @id @default(cuid())
  url       String
  altText   String?
  caption   String?
  type      ImageType @default(GALLERY)
  order     Int       @default(0)
  projectId String
  project   Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt DateTime  @default(now())
}

model Tech {
  id        String        @id @default(cuid())
  name      String        @unique
  slug      String        @unique
  icon      String?
  color     String?
  projects  ProjectTech[]
  skills    Skill[]
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model ProjectTech {
  projectId String
  techId    String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  tech      Tech    @relation(fields: [techId], references: [id], onDelete: Cascade)

  @@id([projectId, techId])
}

model Service {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String
  icon        String?
  order       Int      @default(0)
  status      Status   @default(PUBLISHED)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model SkillGroup {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  order       Int      @default(0)
  skills      Skill[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Skill {
  id        String     @id @default(cuid())
  name      String
  level     Int?
  icon      String?
  order     Int        @default(0)
  groupId   String
  group     SkillGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  techId    String?
  tech      Tech?      @relation(fields: [techId], references: [id])
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Experience {
  id          String    @id @default(cuid())
  role        String
  org         String
  location    String?
  startDate   DateTime?
  endDate     DateTime?
  description String?
  order       Int       @default(0)
  status      Status    @default(PUBLISHED)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Testimonial {
  id        String   @id @default(cuid())
  author    String
  role      String?
  company   String?
  avatar    String?
  quote     String
  featured  Boolean  @default(false)
  order     Int      @default(0)
  status    Status   @default(PUBLISHED)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id              String    @id @default(cuid())
  title           String
  slug            String    @unique
  excerpt         String?
  content         String
  coverImage      String?
  status          Status    @default(DRAFT)
  publishedAt     DateTime?
  metaTitle       String?
  metaDescription String?
  ogImage         String?
  canonicalUrl    String?
  keywords        String[]
  tags            PostTag[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Tag {
  id        String    @id @default(cuid())
  name      String    @unique
  slug      String    @unique
  posts     PostTag[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model PostTag {
  postId String
  tagId  String
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
}

model Message {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String?
  body      String
  read      Boolean  @default(false)
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
}
```
