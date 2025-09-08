# Project Structure & Organization

## Repository Structure

```
cloudnestle-website/
├── .github/
│   └── workflows/
│       ├── deploy.yml              # CI/CD pipeline for automated deployment
│       └── test.yml                # Test automation workflow
├── .kiro/
│   ├── specs/                      # Project specifications and requirements
│   └── steering/                   # AI assistant guidance documents
├── content/                        # Git-based CMS content storage
│   ├── blog/
│   │   ├── 2024-01-15-cloud-migration-guide.md
│   │   └── images/                 # Blog post images
│   ├── services/
│   │   ├── aws-migration.md
│   │   ├── cloud-consulting.md
│   │   └── managed-services.md
│   └── pages/
│       ├── about.md
│       ├── contact.md
│       └── privacy-policy.md
├── infrastructure/                 # AWS CDK infrastructure code
│   ├── lib/
│   │   ├── stacks/
│   │   │   ├── networking-stack.ts
│   │   │   ├── storage-stack.ts
│   │   │   ├── compute-stack.ts
│   │   │   └── security-stack.ts
│   │   └── constructs/
│   ├── bin/
│   │   └── app.ts
│   └── cdk.json
├── src/
│   ├── components/
│   │   ├── ui/                     # Reusable UI components
│   │   ├── layout/                 # Layout components (Header, Footer)
│   │   └── admin/                  # Admin interface components
│   ├── pages/
│   │   ├── api/                    # API routes for admin functions
│   │   ├── admin/                  # Admin interface pages
│   │   ├── blog/                   # Blog pages
│   │   ├── services/               # Service pages
│   │   └── index.tsx               # Homepage
│   ├── lib/
│   │   ├── content.ts              # Content parsing and management
│   │   ├── github.ts               # GitHub API integration
│   │   └── utils.ts                # Utility functions
│   ├── styles/
│   │   └── globals.css             # Global styles and Tailwind imports
│   └── types/
│       └── content.ts              # TypeScript type definitions
├── public/
│   ├── images/                     # Static images and assets
│   └── favicon.ico
├── tests/
│   ├── unit/                       # Unit tests
│   ├── integration/                # Integration tests
│   └── e2e/                        # End-to-end tests
├── docs/                           # Project documentation
│   ├── deployment.md
│   ├── content-management.md
│   └── architecture.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Content Organization

### Blog Content Structure
```markdown
---
title: "How to Migrate to AWS Cloud"
date: "2024-01-15"
category: "Cloud Migration"
tags: ["AWS", "Migration", "Best Practices"]
excerpt: "Complete guide to migrating your infrastructure to AWS"
author: "Cloud Nestle Team"
featured: true
image: "./images/migration-guide.jpg"
---

# Blog content in Markdown format
```

### Service Page Structure
```markdown
---
title: "AWS Cloud Migration Services"
slug: "aws-cloud-migration"
category: "services"
pricing: "Starting at $2,500"
featured: true
icon: "cloud-arrow-up"
---

# Service content with pricing and features
```

## Component Architecture

### UI Component Hierarchy
```
Layout Components:
├── Header (navigation, logo, mobile menu)
├── Footer (contact info, links, certifications)
└── Layout (wrapper with consistent spacing)

Page Components:
├── Homepage (hero, services overview, testimonials)
├── ServicePage (tabbed interface, pricing, CTA)
├── BlogPost (typography, related posts, sharing)
└── BlogListing (pagination, filtering, search)

Admin Components:
├── AdminLayout (sidebar navigation, user menu)
├── PostEditor (rich text editor, media insertion)
├── MediaLibrary (file upload, organization)
└── Dashboard (quick stats, recent activity)

UI Components:
├── Button (variants: primary, secondary, outline)
├── Card (content containers with consistent styling)
├── Modal (overlays for confirmations, forms)
├── Form (input fields, validation, submission)
└── Loading (spinners, skeletons, progress bars)
```

## File Naming Conventions

### Components
- **PascalCase** for component files: `BlogPost.tsx`, `ServiceCard.tsx`
- **camelCase** for utility functions: `parseContent.ts`, `formatDate.ts`
- **kebab-case** for page routes: `cloud-migration.tsx`, `about-us.tsx`

### Content Files
- **kebab-case** with date prefix for blog posts: `2024-01-15-cloud-migration-guide.md`
- **kebab-case** for service pages: `aws-migration.md`, `cloud-consulting.md`
- **kebab-case** for static pages: `privacy-policy.md`, `terms-of-service.md`

### Assets
- **kebab-case** for images: `hero-background.jpg`, `service-icon-migration.svg`
- **descriptive names** for documents: `aws-pricing-guide.pdf`, `migration-checklist.xlsx`

## Environment Configuration

### Development Environments
```
├── Local Development
│   ├── Next.js dev server (localhost:3000)
│   ├── Hot reloading for rapid development
│   └── Local content preview
├── Staging Environment
│   ├── dev.cloudnestle.com
│   ├── Deployed from 'develop' branch
│   └── Full AWS infrastructure testing
└── Production Environment
    ├── cloudnestle.com
    ├── Deployed from 'main' branch
    └── Live customer-facing website
```

### Configuration Files
- **Environment variables**: `.env.local`, `.env.development`, `.env.production`
- **AWS configuration**: `infrastructure/cdk.json`, AWS profiles
- **Build configuration**: `next.config.js`, `tailwind.config.js`
- **TypeScript configuration**: `tsconfig.json` with strict mode enabled

## Code Organization Principles

### Separation of Concerns
- **Content**: Stored in `/content` directory as Markdown files
- **Presentation**: React components in `/src/components`
- **Business Logic**: Utility functions in `/src/lib`
- **Infrastructure**: AWS CDK code in `/infrastructure`
- **Styling**: Tailwind classes with component-specific styles

### Import Organization
```typescript
// External libraries
import React from 'react'
import { NextPage } from 'next'

// Internal utilities
import { parseContent } from '@/lib/content'
import { formatDate } from '@/lib/utils'

// Components
import Layout from '@/components/layout/Layout'
import BlogPost from '@/components/BlogPost'

// Types
import type { BlogPostData } from '@/types/content'
```

### Folder Responsibilities
- **`/src/components/ui`**: Reusable, generic UI components
- **`/src/components/layout`**: Layout-specific components (Header, Footer)
- **`/src/components/admin`**: Admin interface specific components
- **`/src/lib`**: Business logic, utilities, and API integrations
- **`/src/pages/api`**: Next.js API routes for admin functionality
- **`/infrastructure`**: AWS CDK infrastructure as code
- **`/content`**: All website content in Markdown format

## Deployment Structure

### AWS Resource Organization
```
Production Stack:
├── cloudnestle-website-prod-networking
├── cloudnestle-website-prod-storage
├── cloudnestle-website-prod-compute
└── cloudnestle-website-prod-security

Development Stack:
├── cloudnestle-website-dev-networking
├── cloudnestle-website-dev-storage
├── cloudnestle-website-dev-compute
└── cloudnestle-website-dev-security
```

### Branch Strategy
- **`main`**: Production-ready code, auto-deploys to cloudnestle.com
- **`develop`**: Integration branch, auto-deploys to dev.cloudnestle.com
- **`feature/*`**: Feature development branches
- **`hotfix/*`**: Emergency production fixes

This structure supports the phased development approach while maintaining clean separation between content, code, and infrastructure.