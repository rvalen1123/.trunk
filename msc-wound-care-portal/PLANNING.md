# MSC Wound Care Portal - Project Planning

## 📋 Project Overview
The MSC Wound Care Portal is an AI-enhanced web application designed to streamline wound care workflows for healthcare professionals. It automates document generation, provides intelligent product recommendations, delivers AI-driven training, and tracks sales performance and commissions in real-time.

## 🏗️ Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Framework**: NextUI components + Tailwind CSS
- **State Management**: React Context for global state, React hooks for local state
- **Form Management**: React Hook Form with Yup validation
- **Routing**: Next.js App Router (file-based routing)

### Backend Architecture
- **API Routes**: Next.js API routes with route handlers
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **File Storage**: Azure Blob Storage
- **AI Integration**: Azure OpenAI Service via LangChain

### Third-Party Integrations
- **Document Processing**: Azure Document Intelligence
- **E-signatures**: DocuSeal
- **Analytics**: Vercel Analytics (for performance) + custom analytics

## 📊 Data Models

### Core Entities
- **Users**: Admin, Staff, Rep, Sub-rep roles with hierarchical relationships
- **Facilities**: Healthcare facilities with multiple relationships
- **Products**: Product catalog with categorization
- **Orders**: Order forms and tracking
- **Documents**: Various document types (BAA, Prior Auth, etc.)
- **Commissions**: Commission rules, calculations, and payouts
- **AI Interactions**: Tracking of AI usage and outcomes

## 🔒 Security & Compliance

### Authentication & Authorization
- JWT-based authentication via NextAuth.js
- Role-based access control (RBAC)
- Route protection at both API and page levels

### Compliance Requirements
- HIPAA considerations for PHI
- Data retention policies
- Audit logging for sensitive operations

## 🎯 Feature Milestones

### Phase 1: Core Infrastructure
- User authentication and role-based access
- Basic dashboard 
- Document template system
- Form builder foundation

### Phase 2: AI Integration
- Azure OpenAI integration
- Product recommendation engine
- AI-assisted form completion
- Training assistant

### Phase 3: Advanced Features
- Commission calculation engine
- Reporting and analytics
- Advanced document workflows
- Integration with external systems

## 🧰 Development Guidelines

### Code Organization
- **Feature-based structure** within app directory
- Shared components in dedicated directories
- Business logic in custom hooks and services
- Type definitions for all components and data

### Performance Considerations
- Server components for data-fetching operations
- Client components for interactive elements
- Optimistic UI updates where appropriate
- Proper caching strategies

### Testing Strategy
- Jest for unit and integration tests
- React Testing Library for component tests
- Cypress for E2E testing
- Mock services for AI and external APIs

## 📝 Naming Conventions
- **Files/Directories**: kebab-case for directories and file names
- **Components**: PascalCase (e.g., ProductCard.tsx)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with prefix (e.g., IUser, TProduct)

## 🚫 Constraints & Limitations
- Maximum file size of 500 lines; split into smaller modules when needed
- Strict typing for all components and functions
- Environment variables for all sensitive configuration
- No direct database access in client components