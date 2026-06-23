import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Demo / initial portfolio content. Idempotent: re-running never duplicates.
// Real personal facts (email/phone/socials/resume) are NOT seeded — they stay
// user-controlled via /admin/settings. Sensitive client facts are not invented;
// client production work is marked LIMITED so the public site hides details.
// ---------------------------------------------------------------------------

const CATEGORIES: { name: string; slug: string; order: number }[] = [
  { name: "ERP / SaaS", slug: "erp-saas", order: 1 },
  { name: "Healthcare / Clinic / Lab", slug: "healthcare", order: 2 },
  { name: "LMS / Education", slug: "lms-education", order: 3 },
  { name: "Mobile Apps", slug: "mobile-apps", order: 4 },
  { name: "Backend APIs", slug: "backend-apis", order: 5 },
  { name: "WordPress", slug: "wordpress", order: 6 },
  { name: "Business Websites", slug: "business-websites", order: 7 },
  { name: "E-commerce / Ordering", slug: "ecommerce-ordering", order: 8 },
  { name: "Attendance / HR", slug: "attendance-hr", order: 9 },
  { name: "Nonprofit / Organization", slug: "nonprofit", order: 10 },
  { name: "Ride / Booking", slug: "ride-booking", order: 11 },
  { name: "Portfolio / Personal Brand", slug: "portfolio-personal-brand", order: 12 },
];

const TECH: { name: string; slug: string }[] = [
  { name: "Flutter", slug: "flutter" },
  { name: "Dart", slug: "dart" },
  { name: "GetX", slug: "getx" },
  { name: "Firebase", slug: "firebase" },
  { name: "ASP.NET Core", slug: "aspnet-core" },
  { name: "C#", slug: "csharp" },
  { name: "Laravel", slug: "laravel" },
  { name: "PHP", slug: "php" },
  { name: "Django", slug: "django" },
  { name: "Django REST Framework", slug: "django-rest-framework" },
  { name: "Python", slug: "python" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Express", slug: "express" },
  { name: "Next.js", slug: "nextjs" },
  { name: "React", slug: "react" },
  { name: "Angular", slug: "angular" },
  { name: "TypeScript", slug: "typescript" },
  { name: "JavaScript", slug: "javascript" },
  { name: "WordPress", slug: "wordpress" },
  { name: "WooCommerce", slug: "woocommerce" },
  { name: "MySQL", slug: "mysql" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "SQL Server", slug: "sql-server" },
  { name: "SQLite", slug: "sqlite" },
  { name: "Prisma", slug: "prisma" },
  { name: "Tailwind CSS", slug: "tailwind-css" },
  { name: "Bootstrap", slug: "bootstrap" },
  { name: "HTML", slug: "html" },
  { name: "CSS", slug: "css" },
  { name: "REST API", slug: "rest-api" },
  { name: "JWT", slug: "jwt" },
  { name: "Auth.js", slug: "authjs" },
  { name: "Stripe", slug: "stripe" },
  { name: "Chapa", slug: "chapa" },
  { name: "Cloudflare", slug: "cloudflare" },
  { name: "Nginx", slug: "nginx" },
  { name: "PM2", slug: "pm2" },
  { name: "AWS Lightsail", slug: "aws-lightsail" },
  { name: "Docker", slug: "docker" },
  { name: "GitHub", slug: "github" },
  { name: "Bitbucket", slug: "bitbucket" },
  { name: "Three.js", slug: "threejs" },
  { name: "React Three Fiber", slug: "react-three-fiber" },
  { name: "GSAP", slug: "gsap" },
  { name: "Framer Motion", slug: "framer-motion" },
];

const SERVICES: { title: string; slug: string; description: string; order: number }[] = [
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    order: 1,
    description:
      "Flutter mobile apps for Android and iOS with clean UI, authentication, API integration, role-based dashboards, notifications, location features, and business workflows.",
  },
  {
    title: "Backend API Development",
    slug: "backend-api-development",
    order: 2,
    description:
      "Secure and scalable REST APIs using ASP.NET Core, Laravel, Django REST Framework, and Node.js, including authentication, role permissions, reporting, integrations, and admin workflows.",
  },
  {
    title: "Business System Development",
    slug: "business-system-development",
    order: 3,
    description:
      "Custom business systems including ERP, attendance, inventory, POS, HR, payroll planning, dashboards, reporting, and workflow automation.",
  },
  {
    title: "Clinic, Hospital and Laboratory Systems",
    slug: "clinic-lab-system-development",
    order: 4,
    description:
      "Healthcare software workflows for clinics, hospitals, and laboratories, including patient flow, lab requests, billing, reports, and analyzer/machine integration planning.",
  },
  {
    title: "LMS and Training Platforms",
    slug: "lms-training-platforms",
    order: 5,
    description:
      "Learning management systems, course enrollment workflows, student/member dashboards, payment-related flows, and admin tools for training organizations.",
  },
  {
    title: "WordPress Development and Optimization",
    slug: "wordpress-development",
    order: 6,
    description:
      "WordPress website development, redesign, maintenance, speed optimization, plugin fixes, WooCommerce, MemberPress, SEO setup, and responsive improvements.",
  },
  {
    title: "Full Project Development",
    slug: "full-project-development",
    order: 7,
    description:
      "End-to-end product development from idea and requirements to UI, backend, database, admin panel, frontend, mobile app, deployment, and post-launch support.",
  },
  {
    title: "Debugging, Maintenance and Performance",
    slug: "performance-optimization",
    order: 8,
    description:
      "Production bug fixing, performance optimization, deployment troubleshooting, API issue resolution, WordPress fixes, and long-term system maintenance.",
  },
];

const SKILL_GROUPS: { name: string; slug: string; order: number }[] = [
  { name: "Frontend", slug: "frontend", order: 1 },
  { name: "Mobile", slug: "mobile", order: 2 },
  { name: "Backend", slug: "backend", order: 3 },
  { name: "Database", slug: "databases", order: 4 },
  { name: "WordPress / CMS", slug: "cms-wordpress", order: 5 },
  { name: "DevOps / Hosting", slug: "devops", order: 6 },
  { name: "AI-Assisted Development", slug: "ai-tools", order: 7 },
];

// [name, level] — levels kept realistic (60–95), not exaggerated.
const SKILLS: Record<string, [string, number][]> = {
  frontend: [
    ["HTML", 92], ["CSS", 90], ["JavaScript", 88], ["TypeScript", 85],
    ["React", 86], ["Next.js", 85], ["Angular", 75], ["Bootstrap", 85],
    ["Tailwind CSS", 88], ["Responsive UI", 90], ["Admin Dashboards", 88], ["Landing Pages", 85],
  ],
  mobile: [
    ["Flutter", 88], ["Dart", 86], ["GetX", 82], ["Firebase", 80],
    ["Push Notifications", 80], ["API Integration", 88], ["Authentication", 85],
    ["Geofence / Location", 78], ["Android Testing", 78], ["iOS Testing", 70],
  ],
  backend: [
    ["ASP.NET Core", 84], ["Laravel", 86], ["Django", 82], ["Django REST Framework", 82],
    ["Node.js", 80], ["Express", 78], ["PHP", 86], ["Python", 82],
    ["REST API", 90], ["JWT Authentication", 86], ["Role-Based Access Control", 85],
    ["Webhooks", 75], ["Background Jobs", 72],
  ],
  databases: [
    ["PostgreSQL", 84], ["MySQL", 88], ["SQL Server", 80], ["SQLite", 80],
    ["Firebase Firestore", 78], ["Prisma", 82], ["Database Design", 86],
    ["Query Optimization", 78], ["Backup Planning", 72],
  ],
  "cms-wordpress": [
    ["WordPress", 88], ["WooCommerce", 82], ["MemberPress", 75], ["Plugin Customization", 82],
    ["Theme Customization", 82], ["Speed Optimization", 84], ["SEO Setup", 80], ["Cloudflare / Cache Fixes", 80],
  ],
  devops: [
    ["Linux", 78], ["Nginx", 78], ["PM2", 78], ["AWS Lightsail", 76],
    ["cPanel", 80], ["DNS", 80], ["SSL", 82], ["GitHub", 88],
    ["Bitbucket", 78], ["Deployment", 80], ["Server Troubleshooting", 80],
  ],
  "ai-tools": [
    ["Claude Code", 88], ["ChatGPT", 88], ["Cursor", 80], ["AI Planning", 85],
    ["AI Code Review", 82], ["AI Debugging", 84], ["Vibe Coding Workflow", 85],
  ],
};

const EXPERIENCE: { role: string; org: string; description: string; order: number }[] = [
  {
    role: "Full-Stack Developer / Software Developer",
    org: "Independent / Client Projects",
    order: 1,
    description:
      "Designed and developed web applications, mobile apps, backend APIs, admin dashboards, WordPress systems, and business management tools for different clients and organizations. Work includes Flutter apps, ASP.NET Core APIs, Laravel systems, Django/DRF APIs, WordPress performance fixes, and database-driven dashboards.",
  },
  {
    role: "Founder / Developer",
    org: "Peak Internet & Networking Technologies",
    order: 2,
    description:
      "Working on custom software development, websites, business platforms, and SaaS-style systems for local and international clients. Focus areas include ERP systems, clinic/lab systems, mobile apps, and web platforms.",
  },
  {
    role: "Technical Support and Development",
    org: "AbroVision IT Training & Consultancy",
    order: 3,
    description:
      "Supported website, LMS, course enrollment workflows, registration processes, user access, and training platform operations for an IT training organization.",
  },
];

type ProjectSeed = {
  title: string;
  slug: string;
  categorySlug: string;
  visibility: "PUBLIC" | "LIMITED" | "CONFIDENTIAL";
  featured: boolean;
  order: number;
  summary: string;
  description?: string;
  projectType: string;
  industry: string;
  myRole: string;
  tech: string[];
  features?: string;
  keywords: string[];
  impactMetrics?: Record<string, unknown>;
};

const PROJECTS: ProjectSeed[] = [
  {
    title: "AbroVision IT Training & Consultancy",
    slug: "abrovision-it-training-consultancy",
    categorySlug: "lms-education",
    visibility: "PUBLIC",
    featured: true,
    order: 1,
    summary:
      "Training and consultancy platform support including website, LMS workflows, course registration, enrollment, user access, and operational support.",
    description:
      "AbroVision is an IT training and consultancy organization. My work included supporting the website and LMS workflows, helping with course access, registration and enrollment processes, user communication, and ongoing platform maintenance.",
    projectType: "LMS & Website Support",
    industry: "IT Training & Consultancy",
    myRole: "Full-stack development & platform support",
    tech: ["Laravel", "PHP", "MySQL", "WordPress", "HTML", "CSS", "JavaScript"],
    features:
      "Course enrollment workflow\nLMS access support\nRegistration flow support\nEmail and verification flow support\nAdmin/user support\nWebsite maintenance\nTraining operation support",
    keywords: ["LMS", "training platform", "course enrollment", "Laravel"],
    impactMetrics: {
      studentsSupported: "1000+",
      trainingFocus: "SQL Server DBA and IT training",
      supportType: "Website, LMS and operations",
    },
  },
  {
    title: "ERP SaaS Platform",
    slug: "erp-saas-platform",
    categorySlug: "erp-saas",
    visibility: "PUBLIC",
    featured: true,
    order: 2,
    summary:
      "A multi-tenant ERP SaaS platform concept and implementation for small and medium businesses with finance, HR, inventory, POS, reporting, and industry modules.",
    projectType: "Multi-tenant ERP / SaaS",
    industry: "SMB Business Software",
    myRole: "Architecture, backend & mobile",
    tech: ["Django", "Django REST Framework", "PostgreSQL", "Flutter", "GetX", "JWT", "REST API"],
    features:
      "Platform and tenant separation\nFinance / accounting modules\nHR and attendance modules\nPayroll planning\nInventory and POS modules\nReporting and analytics\nDairy industry module\nFlutter tenant app\nSubscription / module gating planning",
    keywords: ["ERP", "SaaS", "multi-tenant", "Django", "Flutter"],
    impactMetrics: {
      architecture: "DB-per-tenant SaaS",
      modules: "Finance, HR, POS, Inventory, Reporting",
      platformType: "Business ERP",
    },
  },
  {
    title: "Clinic / Hospital / Laboratory Management System",
    slug: "clinic-hospital-laboratory-management-system",
    categorySlug: "healthcare",
    visibility: "LIMITED",
    featured: true,
    order: 3,
    summary:
      "Healthcare management system experience covering clinic, hospital, and laboratory workflows, including lab requests, billing, reports, and analyzer integration planning.",
    projectType: "Healthcare Management System",
    industry: "Healthcare / Laboratory",
    myRole: "Backend & integrations",
    tech: ["Laravel", "PHP", "MySQL", "Python", "REST API"],
    features:
      "Patient workflow support\nLab request workflow\nSpecimen and billing workflow\nRole-based access\nReports\nAnalyzer / machine integration planning",
    keywords: ["healthcare", "clinic", "laboratory", "HL7"],
  },
  {
    title: "NYLOS Attendance System",
    slug: "nylos-attendance-system",
    categorySlug: "attendance-hr",
    visibility: "PUBLIC",
    featured: true,
    order: 4,
    summary:
      "Attendance and workforce management system with Flutter mobile app, ASP.NET Core backend, device registration, login, geofence attendance, supervisor role, and branch filtering.",
    projectType: "Attendance & Workforce System",
    industry: "Workforce / HR",
    myRole: "Flutter app & ASP.NET Core API",
    tech: ["Flutter", "Dart", "ASP.NET Core", "C#", "SQL Server", "REST API", "JWT"],
    features:
      "Device registration\nLogin and authentication\nAttendance tracking\nGeofence / location workflow\nSupervisor role\nBranch filtering\nREST API integration",
    keywords: ["attendance", "geofence", "Flutter", "ASP.NET Core"],
  },
  {
    title: "YES Ethiopia Recruitment Platform",
    slug: "yes-ethiopia-recruitment-platform",
    categorySlug: "wordpress",
    visibility: "PUBLIC",
    featured: true,
    order: 5,
    summary:
      "Recruitment/job platform work involving WordPress-based employer and job posting workflows, content management, and website maintenance.",
    projectType: "Recruitment Platform",
    industry: "Recruitment / HR",
    myRole: "WordPress development & maintenance",
    tech: ["WordPress", "PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    keywords: ["recruitment", "jobs", "WordPress"],
    impactMetrics: { employers: "200+", jobPosts: "1000+" },
  },
  {
    title: "Trading MMT",
    slug: "trading-mmt",
    categorySlug: "wordpress",
    visibility: "LIMITED",
    featured: true,
    order: 6,
    summary:
      "WordPress business platform work including performance improvements, UX fixes, dashboard improvements, membership/payment-related troubleshooting, and production support.",
    projectType: "Membership / Trading Platform",
    industry: "Trading / Membership",
    myRole: "WordPress performance & support",
    tech: ["WordPress", "PHP", "JavaScript", "CSS", "Cloudflare", "Stripe"],
    keywords: ["WordPress", "membership", "performance"],
  },
  {
    title: "PipBack",
    slug: "pipback",
    categorySlug: "wordpress",
    visibility: "LIMITED",
    featured: true,
    order: 7,
    summary:
      "WordPress platform improvements involving pricing workflows, offer fields, dashboard UX, mobile/desktop layout fixes, and performance improvements.",
    projectType: "Referral / Rewards Platform",
    industry: "Fintech / Rewards",
    myRole: "WordPress development & UX",
    tech: ["WordPress", "PHP", "JavaScript", "CSS", "Cloudflare"],
    keywords: ["WordPress", "referral", "rewards"],
  },
  {
    title: "Karavan Coffee Food Ordering System",
    slug: "karavan-coffee-food-ordering-system",
    categorySlug: "ecommerce-ordering",
    visibility: "PUBLIC",
    featured: true,
    order: 8,
    summary:
      "Food ordering system with Flutter mobile app, ASP.NET Core backend, Angular frontend, REST API workflows, and payment integration planning.",
    projectType: "Food Ordering System",
    industry: "Food & Beverage",
    myRole: "Flutter, ASP.NET Core & Angular",
    tech: ["Flutter", "Dart", "ASP.NET Core", "Angular", "TypeScript", "REST API", "Chapa"],
    keywords: ["food ordering", "e-commerce", "Flutter", "Chapa"],
  },
  {
    title: "Royal Ride",
    slug: "royal-ride",
    categorySlug: "ride-booking",
    visibility: "PUBLIC",
    featured: false,
    order: 9,
    summary:
      "Ride/booking platform experience involving mobile workflows, backend integration, booking flow, tracking concepts, and payment workflow planning.",
    projectType: "Ride / Booking Platform",
    industry: "Mobility / Transport",
    myRole: "Mobile & backend",
    tech: ["Flutter", "Python", "REST API"],
    keywords: ["ride-hailing", "booking", "Flutter"],
  },
  {
    title: "EVtopia",
    slug: "evtopia",
    categorySlug: "mobile-apps",
    visibility: "PUBLIC",
    featured: false,
    order: 10,
    summary:
      "Flutter mobile app project involving mobile UI, API integration, authentication/workflow features, and app development experience.",
    projectType: "Mobile App",
    industry: "Mobile",
    myRole: "Flutter development",
    tech: ["Flutter", "Dart", "REST API"],
    keywords: ["Flutter", "mobile app"],
  },
  {
    title: "Journey to Origin",
    slug: "journey-to-origin",
    categorySlug: "business-websites",
    visibility: "PUBLIC",
    featured: false,
    order: 11,
    summary:
      "Web platform with Next.js, Express, Prisma, multilingual support, role-based access, blogs, events, and user workflows.",
    projectType: "Web Platform",
    industry: "Nonprofit / Community",
    myRole: "Next.js, Express & Prisma",
    tech: ["Next.js", "React", "Node.js", "Express", "Prisma", "TypeScript"],
    keywords: ["Next.js", "Prisma", "multilingual"],
  },
  {
    title: "Zerubabel.et Portfolio",
    slug: "zerubabel-et-portfolio",
    categorySlug: "portfolio-personal-brand",
    visibility: "PUBLIC",
    featured: true,
    order: 12,
    summary:
      "A personal portfolio and admin-managed content platform with Next.js, PostgreSQL, Prisma, Auth.js, local media uploads, SEO, and Three.js/R3F 3D hero.",
    projectType: "Portfolio & CMS",
    industry: "Personal Brand",
    myRole: "Full-stack (solo)",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Auth.js", "Tailwind CSS", "Three.js", "React Three Fiber"],
    features:
      "Database-driven content\nAdmin dashboard & CRUD\nLocal media uploads (WebP)\nSEO + JSON-LD\nThree.js / R3F 3D hero\nProject visibility controls",
    keywords: ["Next.js", "portfolio", "Three.js", "Prisma"],
  },
  {
    title: "Business / Organization Website Collection",
    slug: "business-organization-website-collection",
    categorySlug: "business-websites",
    visibility: "PUBLIC",
    featured: false,
    order: 13,
    summary:
      "Collection of business, nonprofit, real estate, architecture, dental, trading, and organization websites delivered or supported across different clients.",
    description:
      "A selection of business and organization websites delivered or supported:\n\npeakintech.com\nseyadent.com\nnmweo.org\ngurmuuda.org\nshegerrealestate.com\ngwishtrading.com\naddismebratu.archi\ne-ceaa.org\netbuna.com\nsvoet.org\nalpado.org\nboawn.org",
    projectType: "Website Delivery",
    industry: "Various",
    myRole: "WordPress development & support",
    tech: ["WordPress", "PHP", "HTML", "CSS", "JavaScript", "MySQL"],
    keywords: ["WordPress", "business websites", "nonprofit"],
  },
];

// Clearly-marked SAMPLE testimonials — replace via /admin/testimonials.
const TESTIMONIALS: { author: string; role: string; company: string; quote: string; featured: boolean; order: number }[] = [
  {
    author: "Sample Client",
    role: "Business Owner",
    company: "Demo Company (sample)",
    quote:
      "Zerubabel communicates clearly, understands business requirements, and turns ideas into practical web and mobile solutions.",
    featured: true,
    order: 1,
  },
  {
    author: "Sample Client",
    role: "Product Manager",
    company: "Demo Web Project (sample)",
    quote:
      "He helped improve our website structure, speed, and user experience while keeping the work organized and easy to follow.",
    featured: false,
    order: 2,
  },
  {
    author: "Sample Client",
    role: "Operations Lead",
    company: "Demo System (sample)",
    quote:
      "The system was developed with attention to real workflows, admin usability, and long-term maintainability.",
    featured: false,
    order: 3,
  },
  {
    author: "Sample Client",
    role: "Founder",
    company: "Demo Startup (sample)",
    quote:
      "Reliable, responsive, and able to work across frontend, backend, mobile, and deployment tasks.",
    featured: false,
    order: 4,
  },
];

const POSTS: { title: string; slug: string; excerpt: string; content: string; status: "DRAFT" | "PUBLISHED"; tagSlugs: string[] }[] = [
  {
    title: "Building zerubabel.et as a 3D Portfolio",
    slug: "building-zerubabel-et-as-a-3d-portfolio",
    status: "PUBLISHED",
    excerpt: "A short devlog about designing zerubabel.et as a 3D Digital Command Center instead of a normal portfolio template.",
    tagSlugs: ["devlog"],
    content:
      "I wanted zerubabel.et to feel less like a template and more like a system — a 3D \"Digital Command Center\" that shows the kinds of products I build.\n\nThe stack is Next.js, PostgreSQL, Prisma, Auth.js, and Three.js via React Three Fiber. The whole site is database-driven and managed from an admin dashboard, so projects, services, and posts are real records rather than hardcoded markup.\n\nThe 3D hero is procedural and lazy-loaded, with a static fallback for reduced motion and low-power devices, so it stays fast and accessible.",
  },
  {
    title: "Why Business Systems Need Good Admin Dashboards",
    slug: "why-business-systems-need-good-admin-dashboards",
    status: "DRAFT",
    excerpt: "Thoughts on building software that is not only beautiful on the frontend but also manageable from the backend.",
    tagSlugs: ["case-study"],
    content:
      "A product is only as good as the team's ability to run it day to day. The frontend gets attention, but the admin dashboard is where the real work happens.\n\nFor every system I build, I focus on clear lists, safe edits, validation, and sensible defaults — so non-technical owners can manage content and operations without fear of breaking things.",
  },
  {
    title: "My Full-Stack Development Workflow",
    slug: "my-full-stack-development-workflow",
    status: "DRAFT",
    excerpt: "A short overview of planning, database design, backend APIs, frontend development, testing, deployment preparation, and AI-assisted coding.",
    tagSlugs: ["tutorial"],
    content:
      "My typical workflow: clarify requirements, design the database, build the API, then the frontend, with validation and tests along the way.\n\nI plan deployment early and use AI-assisted tools for planning, review, and debugging — while keeping every change small, reviewable, and verified.",
  },
];

const SITE_CONTENT = {
  siteName: "Zerubabel Shimeles",
  siteUrl: "http://localhost:3000",
  title: "Full-Stack Developer | Mobile Apps, Backend APIs & Business Systems",
  heroTitle: "Zerubabel Shimeles",
  heroSubtitle:
    "Full-stack developer building mobile apps, backend APIs, ERP systems, clinic/lab platforms, LMS systems, WordPress solutions, and business tools.",
  location: "Addis Ababa, Ethiopia",
  bio:
    "I am Zerubabel Shimeles, a full-stack developer based in Addis Ababa, Ethiopia. I build practical software systems for businesses, training organizations, clinics, startups, and service companies. My work includes mobile apps, backend APIs, admin dashboards, ERP/SaaS platforms, clinic and laboratory systems, LMS platforms, WordPress websites, and performance-focused business websites.\n\nI focus on building systems that are useful, maintainable, secure, and easy for real users to manage. I work across frontend, backend, mobile, databases, integrations, and deployment.",
  defaultMetaTitle: "Zerubabel Shimeles | Full-Stack Developer",
  defaultMetaDescription:
    "Portfolio of Zerubabel Shimeles, a full-stack developer building Flutter apps, backend APIs, ERP systems, clinic/lab systems, LMS platforms, WordPress solutions, and business websites.",
  keywords: [
    "Zerubabel Shimeles",
    "Full Stack Developer Ethiopia",
    "Flutter Developer",
    "ASP.NET Core Developer",
    "Laravel Developer",
    "Django Developer",
    "WordPress Developer",
    "ERP Developer",
    "Clinic Management System",
    "LMS Developer",
  ],
  // NOTE: email / phone / profileImage / resumeUrl / socialLinks are intentionally
  // NOT seeded (no public "TODO_" placeholders). Add them via /admin/settings.
  // Suggested socialLinks JSON to paste there:
  //   { "github": "...", "linkedin": "...", "upwork": "...", "x": "...", "email": "..." }
};

const TAGS: { name: string; slug: string }[] = [
  { name: "Devlog", slug: "devlog" },
  { name: "Case Study", slug: "case-study" },
  { name: "Tutorial", slug: "tutorial" },
  { name: "Announcement", slug: "announcement" },
];

// --------------------------------- seeders ---------------------------------

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Seed aborted: ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.");
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists (${email}).`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({ data: { email, passwordHash, name: "Administrator", role: "ADMIN" } });
  console.log(`Created admin user: ${user.email}`);
}

async function seedCategories() {
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: c.order },
      create: c,
    });
  }
  console.log(`Ensured ${CATEGORIES.length} categories.`);
}

async function seedTech() {
  for (const t of TECH) {
    await prisma.tech.upsert({ where: { slug: t.slug }, update: {}, create: t });
  }
  console.log(`Ensured ${TECH.length} tech entries.`);
}

async function seedServices() {
  for (const s of SERVICES) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { title: s.title, description: s.description, order: s.order, status: "PUBLISHED" },
      create: { ...s, status: "PUBLISHED" },
    });
  }
  // Remove the stale prior-seed service folded into "Business System Development".
  await prisma.service.deleteMany({ where: { slug: "erp-saas-development" } });
  console.log(`Ensured ${SERVICES.length} services.`);
}

async function seedSkillGroups() {
  for (const g of SKILL_GROUPS) {
    await prisma.skillGroup.upsert({
      where: { slug: g.slug },
      update: { name: g.name, order: g.order },
      create: g,
    });
  }
  console.log(`Ensured ${SKILL_GROUPS.length} skill groups.`);
}

async function seedSkills() {
  let total = 0;
  for (const [groupSlug, list] of Object.entries(SKILLS)) {
    const group = await prisma.skillGroup.findUnique({ where: { slug: groupSlug } });
    if (!group) continue;
    let order = 1;
    for (const [name, level] of list) {
      total += 1;
      const existing = await prisma.skill.findFirst({ where: { name, groupId: group.id } });
      if (existing) {
        order += 1;
        continue;
      }
      await prisma.skill.create({
        data: { name, level, order, group: { connect: { id: group.id } } },
      });
      order += 1;
    }
  }
  console.log(`Ensured ${total} skills.`);
}

async function seedTags() {
  for (const t of TAGS) {
    await prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t });
  }
  console.log(`Ensured ${TAGS.length} tags.`);
}

async function seedExperience() {
  for (const e of EXPERIENCE) {
    const existing = await prisma.experience.findFirst({ where: { role: e.role, org: e.org } });
    if (existing) continue;
    await prisma.experience.create({
      data: { role: e.role, org: e.org, description: e.description, order: e.order, status: "PUBLISHED" },
    });
  }
  console.log(`Ensured ${EXPERIENCE.length} experience entries.`);
}

async function seedProjects() {
  const techRows = await prisma.tech.findMany({ select: { id: true, name: true } });
  const techByName = new Map(techRows.map((t) => [t.name, t.id]));

  for (const p of PROJECTS) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (existing) continue; // idempotent: never duplicate or clobber edits

    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
    if (!category) {
      console.warn(`Skipping ${p.slug}: category ${p.categorySlug} not found.`);
      continue;
    }
    const techCreate = p.tech
      .map((name) => techByName.get(name))
      .filter((id): id is string => Boolean(id))
      .map((id) => ({ tech: { connect: { id } } }));

    await prisma.project.create({
      data: {
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        description: p.description ?? null,
        projectType: p.projectType,
        industry: p.industry,
        myRole: p.myRole,
        features: p.features ?? null,
        status: "PUBLISHED",
        visibility: p.visibility,
        featured: p.featured,
        order: p.order,
        keywords: p.keywords,
        impactMetrics: p.impactMetrics ? (p.impactMetrics as Prisma.InputJsonValue) : Prisma.DbNull,
        category: { connect: { id: category.id } },
        techStack: { create: techCreate },
      },
    });
  }
  console.log(`Ensured ${PROJECTS.length} projects.`);
}

async function seedTestimonials() {
  for (const t of TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({ where: { quote: t.quote } });
    if (existing) continue;
    await prisma.testimonial.create({
      data: {
        author: t.author,
        role: t.role,
        company: t.company,
        quote: t.quote,
        featured: t.featured,
        order: t.order,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`Ensured ${TESTIMONIALS.length} sample testimonials.`);
}

async function seedPosts() {
  for (const p of POSTS) {
    const existing = await prisma.post.findUnique({ where: { slug: p.slug } });
    if (existing) continue;
    const tags = await prisma.tag.findMany({ where: { slug: { in: p.tagSlugs } }, select: { id: true } });
    await prisma.post.create({
      data: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        status: p.status,
        publishedAt: p.status === "PUBLISHED" ? new Date() : null,
        tags: { create: tags.map((tag) => ({ tag: { connect: { id: tag.id } } })) },
      },
    });
  }
  console.log(`Ensured ${POSTS.length} blog posts.`);
}

async function seedSiteSettings() {
  const existing = await prisma.siteSettings.findFirst();
  if (!existing) {
    await prisma.siteSettings.create({ data: SITE_CONTENT });
    console.log("Created site settings.");
    return;
  }
  // Refresh demo CONTENT fields only; never touch user-managed personal/asset
  // fields (email, phone, profileImage, resumeUrl, socialLinks, defaultOgImage).
  await prisma.siteSettings.update({ where: { id: existing.id }, data: SITE_CONTENT });
  console.log("Updated site settings content.");
}

async function main() {
  await seedAdmin();
  await seedCategories();
  await seedTech();
  await seedServices();
  await seedSkillGroups();
  await seedSkills();
  await seedTags();
  await seedExperience();
  await seedProjects();
  await seedTestimonials();
  await seedPosts();
  await seedSiteSettings();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
