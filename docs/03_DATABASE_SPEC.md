# 03 — Database Spec

## PostgreSQL Conventions
The data model is fully relational, with JSON used only where the shape is genuinely free-form.

- **Relational (separate tables / join tables):**
  - `Tech` + `ProjectTech` (many-to-many between projects and technologies).
  - `Tag` + `PostTag` (many-to-many between blog posts and tags).
  - `SkillGroup` + `Skill` (one-to-many; skills grouped, optionally linked to `Tech`).
  - `ProjectImage` (one-to-many; each project owns ordered, typed images).
  - `Category` → `Project` (one-to-many).
- **JSON columns (free-form, no fixed schema):**
  - `Project.impactMetrics` — arbitrary metric label/value pairs.
  - `SiteSettings.socialLinks` — arbitrary set of platform → URL entries.

### The NO `@db.LongText` / `@db.Text` Rule
On PostgreSQL, Prisma's plain `String` / `String?` already maps to `text`, which is **unlimited length**. Adding `@db.LongText` or `@db.Text` is a MySQL-ism that is wrong here and will break or mislead.

```prisma
// WRONG (MySQL thinking, invalid intent on Postgres):
description String? @db.LongText
content    String  @db.Text

// RIGHT (Postgres — already unlimited text):
description String?
content     String
```

Long fields (`Project.description`, `Project.solution`, `Post.content`, `Message.body`, etc.) are therefore just `String` / `String?`.

## Canonical Prisma Schema

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

## Per-Model Field Reference

### User
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| name | String? | display name |
| email | String | unique, login identifier |
| passwordHash | String | strong hash (e.g. bcrypt/argon2) |
| role | Role | default ADMIN |
| createdAt / updatedAt | DateTime | timestamps |

### SiteSettings
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK (single row expected) |
| siteName | String | default "Zerubabel Shimeles" |
| siteUrl | String | default "https://zerubabel.et" |
| title | String? | global title |
| heroTitle / heroSubtitle | String? | homepage hero copy |
| bio | String? | about text |
| email / phone / location | String? | contact info |
| profileImage | String? | uploads path |
| resumeUrl | String? | resume/CV asset |
| socialLinks | Json? | free-form platform→URL map |
| defaultMetaTitle / defaultMetaDescription / defaultOgImage | String? | SEO fallbacks |
| keywords | String[] | default SEO keywords |
| createdAt / updatedAt | DateTime | timestamps |

### Category
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| name / slug | String | both unique |
| description | String? | optional |
| order | Int | display order |
| projects | Project[] | relation |

### Project
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| title | String | required |
| slug | String | unique |
| summary | String | required short summary |
| description | String? | long body (plain text, unlimited) |
| clientName / projectType / industry / myRole | String? | case-study metadata |
| startDate / endDate | DateTime? | timeline |
| problem / solution / features / outcome | String? | case-study narrative |
| impactMetrics | Json? | free-form metrics |
| liveUrl / githubUrl | String? | external links |
| isConfidential | Boolean | quick flag |
| visibility | Visibility | PUBLIC / LIMITED / CONFIDENTIAL |
| featured | Boolean | homepage feature |
| status | Status | DRAFT / PUBLISHED / ARCHIVED |
| order | Int | display order |
| metaTitle / metaDescription / ogImage / canonicalUrl | String? | per-project SEO |
| keywords | String[] | per-project SEO |
| categoryId / category | String / Category | required category |
| techStack | ProjectTech[] | join to Tech |
| images | ProjectImage[] | cascade-deleted |

### ProjectImage
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| url | String | uploads path (WebP) |
| altText / caption | String? | accessibility / display |
| type | ImageType | COVER/GALLERY/SCREENSHOT/LOGO/MOCKUP/PROFILE/OG_IMAGE |
| order | Int | display order |
| projectId / project | String / Project | cascade on project delete |

### Tech
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| name / slug | String | both unique |
| icon / color | String? | display |
| projects / skills | relations | used by ProjectTech and Skill |

### ProjectTech (join)
| Field | Type | Notes |
|-------|------|-------|
| projectId / techId | String | composite PK `@@id` |
| project / tech | relations | cascade both sides |

### Service
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| title | String | required |
| slug | String | unique |
| description | String | required |
| icon | String? | display |
| order | Int | display order |
| status | Status | default PUBLISHED |

### SkillGroup
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| name | String | group label |
| slug | String | unique |
| description | String? | optional |
| order | Int | display order |
| skills | Skill[] | cascade-deleted children |

### Skill
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| name | String | required |
| level | Int? | optional proficiency |
| icon | String? | display |
| order | Int | display order |
| groupId / group | String / SkillGroup | cascade on group delete |
| techId / tech | String? / Tech? | optional link to Tech |

### Experience
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| role / org | String | required |
| location | String? | optional |
| startDate / endDate | DateTime? | timeline |
| description | String? | details |
| order | Int | display order |
| status | Status | default PUBLISHED |

### Testimonial
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| author | String | required |
| role / company / avatar | String? | optional |
| quote | String | required |
| featured | Boolean | homepage feature |
| order | Int | display order |
| status | Status | default PUBLISHED |

### Post
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| title | String | required |
| slug | String | unique |
| excerpt | String? | optional |
| content | String | required body (unlimited text) |
| coverImage | String? | uploads path |
| status | Status | DRAFT/PUBLISHED/ARCHIVED |
| publishedAt | DateTime? | publish time |
| metaTitle / metaDescription / ogImage / canonicalUrl | String? | per-post SEO |
| keywords | String[] | per-post SEO |
| tags | PostTag[] | many-to-many |

### Tag
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| name / slug | String | both unique |
| posts | PostTag[] | many-to-many |

### PostTag (join)
| Field | Type | Notes |
|-------|------|-------|
| postId / tagId | String | composite PK `@@id` |
| post / tag | relations | cascade both sides |

### Message
| Field | Type | Notes |
|-------|------|-------|
| id | String | cuid PK |
| name / email | String | submitter |
| subject | String? | optional |
| body | String | message text (unlimited) |
| read | Boolean | admin read flag |
| ipAddress / userAgent | String? | anti-spam / audit |
| createdAt | DateTime | submitted at |

## Enums
- **Role** — `ADMIN`, `EDITOR`. Single admin first; EDITOR reserved for future delegation.
- **Status** — `DRAFT`, `PUBLISHED`, `ARCHIVED`. Governs public visibility lifecycle for content entities.
- **Visibility** — `PUBLIC`, `LIMITED`, `CONFIDENTIAL`. Controls how much project detail is exposed publicly (see Public Site Spec).
- **ImageType** — `COVER`, `GALLERY`, `SCREENSHOT`, `LOGO`, `MOCKUP`, `PROFILE`, `OG_IMAGE`. Drives where/how images render.

## Indexes & Uniques
- Unique constraints: `User.email`, `Category.name`, `Category.slug`, `Project.slug`, `Tech.name`, `Tech.slug`, `Service.slug`, `SkillGroup.slug`, `Post.slug`, `Tag.name`, `Tag.slug`.
- Composite PKs (act as join uniqueness + index): `ProjectTech([projectId, techId])`, `PostTag([postId, tagId])`.
- TODO: Consider adding explicit `@@index` on frequently filtered columns (`Project.status`, `Project.featured`, `Project.categoryId`, `Post.status`, `Post.publishedAt`) once query patterns are confirmed.

## Cascade Deletes
- `ProjectImage` → `Project`: `onDelete: Cascade`.
- `ProjectTech` → both `Project` and `Tech`: `onDelete: Cascade`.
- `Skill` → `SkillGroup`: `onDelete: Cascade`.
- `PostTag` → both `Post` and `Tag`: `onDelete: Cascade`.
- `Project` → `Category` is a required relation **without** cascade — deleting a category in use is blocked (reassign first).
- `Skill.tech` is optional and **not** cascaded — deleting a Tech nulls related skill links only if handled explicitly (TODO: confirm desired behavior).

## Seeding Approach
- Idempotent seed script (`prisma/seed.ts`) run via `prisma db seed`.
- Seeds in dependency order:
  1. **User** — first admin account (password hash from env, not committed).
  2. **SiteSettings** — single settings row with defaults.
  3. **Category**, **Tech**, **SkillGroup**, **Tag** — reference data.
  4. **Service**, **Skill**, **Experience**, **Testimonial** — content.
  5. **Project** (+ **ProjectImage**, **ProjectTech**) and **Post** (+ **PostTag**) — examples.
- Use `upsert` keyed on unique fields (`email`, `slug`, `name`) for idempotency.
- Admin password and any secrets come from environment variables; never hard-code in the seed.
