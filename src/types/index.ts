// Core data types for the budget management application

export interface ModelFund {
  id: string;
  name: string;
  description: string;
  category: string;
  performanceHistory: PerformanceData[];
  riskLevel: 'Low' | 'Medium' | 'High';
  minimumInvestment: number;
  managementFee: number;
}

export interface PerformanceData {
  year: number;
  return: number;
  volatility: number;
}

export interface BudgetProjectionData {
  modelFundId: string;
  initialInvestment: number;
  monthlyContribution: number;
  timeHorizon: number; // in years
  expectedReturn: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  projectedValue: number;
  totalContributions: number;
  totalGrowth: number;
}

export interface BudgetInputs {
  initialInvestment: number;
  monthlyContribution: number;
  timeHorizon: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  additionalParameters?: {
    inflationRate: number;
    taxRate: number;
    emergencyFund: number;
  };
}

export interface ReviewSummary {
  selectedModelFund: ModelFund;
  budgetInputs: BudgetInputs;
  projection: BudgetProjectionData;
  recommendations: string[];
  warnings: string[];
}

export interface AppState {
  selectedModelFund: ModelFund | null;
  budgetInputs: BudgetInputs | null;
  projection: BudgetProjectionData | null;
  reviewSummary: ReviewSummary | null;
}
