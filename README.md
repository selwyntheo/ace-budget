# ACE Budget - Fund Creation Tool

A modern React TypeScript application for creating new investment funds based on model funds. This tool provides a comprehensive workflow for fund selection, budget projection, and investment review.

## Features

### 🏦 Fund Selection
- Browse and compare multiple model funds
- Filter by category and risk level
- Sort by performance metrics
- View detailed fund information including:
  - Historical performance data
  - Risk assessments
  - Management fees
  - Minimum investment requirements

### 📊 Budget Projection
- **React Data Grid Integration**: Professional tabular data management with advanced features
- **Trial Balance Data Integration**: 
  - 🔄 **Server-Sourced Data**: Automated retrieval of trial balance data from server
  - 📈 **Calculated Fields**: 
    - **ANA** (Asset Net Amount): Derived from Model Fund Asset After Capital Change
    - **Annual Fee**: Calculated as Income Earned × 365
    - **Rate**: Calculated as Annual Fee ÷ ANA
  - 📊 **Comprehensive Fields**: Account Number, Account Name, Class of Shares (Expense), Security Unique Qualifier, Security Distribution (Long 1), Position Date, Asset Group, Accrued Income Gross (Base), Accrued Income Gross, Income Earned (Base), Earned Income (Local), Account Base Currency
  - 📋 **Interactive Grid**: Sortable, resizable columns with real-time calculations
  - 💾 **Export Functionality**: Export trial balance data to JSON format
  - 🔄 **Refresh Data**: Real-time data refresh from server
- **Mutual Fund Prospectus Upload & AI Insight**: 
  - 📄 **PDF Upload**: Secure upload of mutual fund prospectus documents (max 10MB)
  - 🤖 **AI Analysis**: Automated analysis of prospectus content for budget insights
  - 📊 **Budget Analysis**: AI-generated expense ratio estimates and cost breakdown
  - 💰 **Expense Breakdown**: Detailed fee structure analysis (management, administrative, distribution)
  - 🔄 **Apply Insights**: One-click application of AI insights to the securities table
- **Color-Coded Analytics**: Visual indicators for key financial metrics:
  - 🟢 **Green**: Optimal/Good range values
  - 🟡 **Yellow**: Moderate/Attention needed
  - 🔴 **Red**: Concerning/Requires review
- **Editable Securities Table** with columns:
  - Fund, Security Unique Qualifier, Security Description
  - Asset Group, Fee Type (Include/Exclude)
  - Model Fund Current Run Rate
  - **Weighted to New Fund - Projection Run Rate Estimates** (Color-coded)
  - **Annual** values (Color-coded)
  - **Estimate TER** (Total Expense Ratio - Color-coded)
  - Client Review columns with estimates and logic
- **New Fund Parameter Configuration**:
  - New Fund Number and Estimated Assets
  - Base Currency selection (USD, EUR, GBP, JPY, CAD)
  - Launch Date and Fiscal Year End (FYE)
  - Day Count Remaining calculations
- **Real-time TER Calculations** with automated totaling
- **Sortable and Resizable Columns** with frozen key columns
- **Interactive Editing** with dropdown selections and numeric inputs

### 📋 Budget Review and Finalization with AI Agent
- **AI Agent Review**: Advanced AI-powered analysis of budget data
  - 🤖 **Smart Insights**: AI-generated insights across multiple categories
  - 📊 **Confidence Scoring**: AI confidence levels for each insight (0-100%)
  - ⚠️ **Priority Indicators**: High, Medium, Low priority classifications
  - 🔍 **Local Analysis**: Expense Analysis performed locally
  - 🌐 **API Integration**: Budget Validation fetched from server endpoint
    - Real-time API calls to `/api/budget-validation`
    - Dynamic asset allocation analysis
    - Compliance scoring with industry standards
    - Error handling and fallback mechanisms
    - Loading states and progress indicators
- **Budget Summary Dashboard**: Key financial metrics overview
  - Selected Model Fund details
  - Estimated Assets and Projected Value
  - Total Expense Ratio (TER) calculations
- **Data Download Center**: 
  - 📊 **Interactive Data Grid**: Professional download interface with React Data Grid
  - 📄 **Multiple Formats**: JSON, CSV, Excel, PDF support
  - 📁 **Ready Files**: Instant download for processed data
  - 🔄 **Processing Status**: Real-time status updates for large files
  - 📦 **Bulk Download**: Download all ready files at once
  - 📋 **Available Downloads**:
    - Budget Projection data with fund parameters (MODE, ACCT, SCTYDT, SCTYUNQ, FYEDT, EXECDT, AMTYP, AMT)
    - Securities breakdown with TER calculations
    - Trial balance data with calculated fields
    - Comprehensive fund analysis reports
    - AI-generated insights and analysis
- **Budget Finalization**: Complete budget approval workflow
- **Professional Data Export**: Enterprise-ready reporting capabilities

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Context API with useReducer
- **Data Grid**: React Data Grid for advanced table functionality
- **Styling**: CSS Modules with modern responsive design
- **Development**: ESLint, TypeScript strict mode

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.tsx   # Step-by-step navigation
│   └── Navigation.css
├── context/             # Global state management
│   └── AppContext.tsx   # React Context with useReducer
├── data/                # Sample data and utilities
│   └── modelFunds.ts    # Model fund data and calculations
├── pages/               # Main application pages
│   ├── FundSelection.tsx     # Fund browsing and selection
│   ├── BudgetProjectionNew.tsx  # Investment parameter input with data grid
│   ├── Review.tsx            # Budget review and data download center
│   └── *.css                 # Page-specific styles
├── services/            # Business logic and data services
│   └── trialBalanceController.ts  # Trial balance data management
├── types/               # TypeScript interfaces
│   └── index.ts         # All type definitions
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Key Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessibility compliant

### Data Persistence
- State maintained across page navigation
- Form validation and error handling
- Loading states and user feedback

### Professional UI/UX
- Modern, clean interface design
- Intuitive step-by-step workflow
- Visual progress indicators
- Interactive charts and data visualization

## Usage Guide

1. **Fund Selection**: Browse available model funds, compare their performance metrics, and select one that matches your investment goals.

2. **Budget Projection**: 
   - Input your investment parameters and new fund details
   - Work with the interactive securities table with color-coded analytics
   - Upload mutual fund prospectus for AI-powered insights
   - Review trial balance data with calculated fields
   - Configure fund parameters and calculations

3. **Budget Review and Finalization**: 
   - Review AI agent analysis with confidence scores and priority indicators
   - Download comprehensive data in multiple formats
   - Access professional reports and analysis
   - Finalize your budget with complete data transparency

## Contributing

This project follows React and TypeScript best practices:
- Functional components with hooks
- TypeScript strict mode enabled
- CSS modules for styling
- Responsive design patterns
- Accessibility considerations

## License

This project is created for educational and demonstration purposes.

## Disclaimer

This tool is for educational purposes only and should not be considered as financial advice. Always consult with qualified financial professionals before making investment decisions.
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
