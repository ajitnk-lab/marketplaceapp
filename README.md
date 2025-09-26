# Marketplace Platform

A comprehensive marketplace platform for digital solutions built with modern technologies.

## Architecture

This is a monorepo containing:

- **Infrastructure** (`packages/infrastructure`): AWS CDK infrastructure as code
- **Frontend** (`packages/frontend`): React application with TypeScript and Tailwind CSS

## Tech Stack

### Infrastructure
- AWS CDK (TypeScript)
- DynamoDB for data storage
- Lambda functions for API
- API Gateway for REST endpoints
- S3 for static assets
- CloudFront for CDN

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- React Query for data fetching
- React Hook Form for forms

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured
- AWS CDK CLI installed globally

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install package dependencies:
   ```bash
   npm install --workspaces
   ```

### Development

#### Frontend Development
```bash
cd packages/frontend
npm run dev
```

#### Infrastructure Development
```bash
cd packages/infrastructure
npm run build
npm run synth  # Synthesize CloudFormation templates
```

### Deployment

#### Deploy Infrastructure
```bash
cd packages/infrastructure
npm run bootstrap  # First time only
npm run deploy
```

#### Build Frontend
```bash
cd packages/frontend
npm run build
```

## Project Structure

```
marketplace-platform/
├── packages/
│   ├── infrastructure/          # AWS CDK infrastructure
│   │   ├── bin/                # CDK app entry point
│   │   ├── lib/                # CDK stacks and constructs
│   │   └── lambda/             # Lambda function code
│   └── frontend/               # React frontend application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components
│       │   └── utils/          # Utility functions
│       └── public/             # Static assets
├── .eslintrc.json             # ESLint configuration
├── .prettierrc                # Prettier configuration
└── package.json               # Root package.json with workspaces
```

## Available Scripts

### Root Level
- `npm run dev` - Start all development servers
- `npm run build` - Build all packages
- `npm run test` - Run tests for all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format code with Prettier

### Infrastructure Package
- `npm run build` - Compile TypeScript
- `npm run synth` - Synthesize CloudFormation templates
- `npm run deploy` - Deploy to AWS
- `npm run destroy` - Destroy AWS resources

### Frontend Package
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## Environment Configuration

Create environment-specific configuration files:

### Infrastructure
- Set AWS region and account in CDK context
- Configure stage-specific parameters

### Frontend
- Create `.env.local` for local development
- Set API endpoints and configuration

## Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## License

This project is licensed under the MIT License.