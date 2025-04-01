# MSC Wound Care AI-Enabled Portal

A modern, AI-enhanced web application that streamlines wound care workflows for MSC Wound Care. The portal automates document generation, provides intelligent product recommendations, delivers AI-driven training, and tracks sales performance and commissions in real-time.

## Core Features

1. **Dynamic Form and Document Workflow**
   - Single data entry to auto-fill multiple forms/PDFs
   - E-signature integration via DocuSeal
   - Template library for BAA agreements, prior authorizations, etc.
   - AI-assisted form completion

2. **AI-Powered Agents**
   - Product recommendation agent (suggests products based on wound characteristics)
   - Training assistant (answers product/protocol questions, simulates sales scenarios)
   - Natural language form completion (fill forms via conversation)

3. **Sales and Commission Tracking**
   - Real-time dashboards for sales performance
   - Commission calculations for reps and sub-reps
   - Tracking of flat-fee and percentage-based commissions
   - Facility usage reports and analytics

4. **Role-Based Access Control**
   - Admin: Full system control, manage users, facilities, commission rules
   - Staff: Handle document workflows, monitor process status
   - Rep: Track performance and commissions, use AI tools
   - Sub-rep: Similar to rep but with parent relationship

## Tech Stack

- **Frontend & Backend:** Next.js with TypeScript
- **UI Framework:** NextUI and Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **AI Integration:** Azure OpenAI Service, LangChain
- **Document Processing:** DocuSeal, Azure Document Intelligence

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/msc-wound-care-portal.git
   cd msc-wound-care-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/msc_portal"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Azure OpenAI
   AZURE_OPENAI_API_KEY="your-azure-openai-api-key"
   AZURE_OPENAI_ENDPOINT="your-azure-openai-endpoint"
   AZURE_OPENAI_DEPLOYMENT_NAME="your-deployment-name"
   
   # DocuSeal
   DOCUSEAL_API_KEY="your-docuseal-api-key"
   DOCUSEAL_ENDPOINT="your-docuseal-endpoint"
   
   # Azure Document Intelligence
   AZURE_DOCUMENT_INTELLIGENCE_KEY="your-document-intelligence-key"
   AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT="your-document-intelligence-endpoint"
   ```

4. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
msc-wound-care-portal/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── auth/            # Authentication routes
│   │   ├── dashboard/       # Dashboard routes
│   │   ├── api/             # API routes
│   │   └── ...
│   ├── components/          # React components
│   │   ├── ui/              # UI components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── forms/           # Form components
│   │   ├── ai/              # AI-related components
│   │   └── documents/       # Document-related components
│   ├── lib/                 # Utility functions and services
│   │   ├── auth/            # Authentication utilities
│   │   ├── db/              # Database utilities
│   │   ├── ai/              # AI services
│   │   └── documents/       # Document processing services
│   └── types/               # TypeScript type definitions
├── prisma/                  # Prisma schema and migrations
├── public/                  # Static assets
└── ...
```

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For questions or support, please contact [support@mscwoundcare.com](mailto:support@mscwoundcare.com).
