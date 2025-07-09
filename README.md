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
- Interactive budget planning based on selected model fund
- Customizable investment parameters:
  - Initial investment amount
  - Monthly contribution plans
  - Investment time horizon
  - Risk tolerance settings
- Advanced parameters:
  - Inflation rate adjustments
  - Tax rate considerations
  - Emergency fund planning
- Real-time projection calculations with visual feedback

### 📋 Review & Analysis
- Comprehensive investment summary
- Personalized recommendations
- Risk warnings and considerations
- Exportable reports in JSON format
- Professional disclaimer and guidance

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **State Management**: React Context API with useReducer
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
│   ├── BudgetProjection.tsx  # Investment parameter input
│   ├── Review.tsx            # Final review and export
│   └── *.css                 # Page-specific styles
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

2. **Budget Projection**: Input your investment parameters including initial amount, monthly contributions, time horizon, and risk tolerance. The system calculates projections in real-time.

3. **Review**: Review your complete investment plan, read personalized recommendations, and export the summary for your records.

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
