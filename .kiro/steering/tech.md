# Technology Stack & Build System

## Core Technology Stack

### Frontend Framework
- **Next.js 13+** with TypeScript for static site generation and server-side rendering
- **Tailwind CSS** for responsive, mobile-first styling
- **React 18+** with modern hooks and component patterns

### Content Management (Phase 1-2)
- **Git-based CMS** using Markdown files stored in GitHub repository
- **Frontmatter** for content metadata (title, date, category, tags)
- **GitHub API integration** for admin interface content management
- **Rich text editor** with WYSIWYG functionality for non-technical users

### AWS Infrastructure
- **S3** for static website hosting
- **CloudFront** for global CDN and performance optimization
- **Route53** for DNS management and domain configuration
- **ACM (Certificate Manager)** for SSL/TLS certificates
- **Lambda** for GitHub API integration and admin functions
- **API Gateway** for REST API endpoints
- **Systems Manager Parameter Store** for secure token storage
- **CloudWatch** for monitoring, logging, and alerts

### Infrastructure as Code
- **AWS CDK** with TypeScript for infrastructure deployment
- **Nested stacks** architecture for organized, maintainable code
- **Environment-specific configurations** (dev/staging/production)

### Development Tools
- **TypeScript** for type safety and better developer experience
- **ESLint + Prettier** for code formatting and quality
- **Jest** for unit testing
- **Playwright** for end-to-end testing

## Build System & Commands

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Export static files
npm run export

# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Infrastructure Commands
```bash
# Deploy all infrastructure stacks
npm run deploy:infrastructure

# Deploy to development environment
npm run deploy:dev

# Deploy to production
npm run deploy:prod

# Destroy infrastructure (cleanup)
npm run destroy:infrastructure
```

### Content Management Commands
```bash
# Start admin interface locally
npm run admin:dev

# Build admin interface
npm run admin:build

# Sync content from GitHub
npm run content:sync

# Validate content structure
npm run content:validate
```

### Deployment Pipeline
- **GitHub Actions** for automated CI/CD
- **Automatic deployment** on push to main branch (production) or develop branch (staging)
- **Build validation** with tests and linting before deployment
- **CloudFront cache invalidation** after successful deployment

## Architecture Patterns

### Static Site Generation (SSG)
- Pre-built pages for optimal performance
- Dynamic content through build-time data fetching
- Incremental Static Regeneration (ISR) for content updates

### Serverless Architecture
- Lambda functions for admin operations
- API Gateway for REST endpoints
- No persistent servers to manage

### Content-First Architecture
- Markdown-based content storage
- Git as the single source of truth
- Automatic content validation and type safety

## Migration Path (Future Phases)

### Phase 3+ Technology Additions
- **Strapi CMS** for advanced content management (~$30-40/month)
- **DynamoDB** for user accounts and subscriptions
- **Cognito** for user authentication and authorization
- **Stripe API** for payment processing

### Phase 6+ AI Integration
- **OpenAI API** for chatbot functionality
- **Pinecone/Weaviate** for vector database (RAG)
- **Lambda** for AI processing functions

## Performance Standards
- **Page load time**: Under 3 seconds globally
- **Core Web Vitals**: Green scores for LCP, FID, CLS
- **Mobile performance**: 90+ Lighthouse score
- **SEO optimization**: Proper meta tags, sitemap, structured data