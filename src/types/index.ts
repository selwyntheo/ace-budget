// Core data types for the budget management application

export interface ModelFund {
  id: string;
  fundNumber: string;
  name: string;
  fundShareclass: string;
  description: string;
  category: string;
  unitsOutstanding: number;
  validationPeriodEndDate: string;
  shareholderEquity: number;
  assetsAfterCapitalChange: number;
  fiscalYearEndMonth: number;
  fiscalYearEndDay: number;
  nav: number; // 8 precision
  allocationRatioMcsOpt: number;
  fundBaseCurrency: string;
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

export interface SecurityEntry {
  id: string;
  fund: string;
  securityUniqueQualifier: string;
  securityDescription: string;
  assetGroup: string;
  feeType: 'Include' | 'Exclude';
  modelFundCurrentRunRate: number;
  weightedToNewFundProjectionRunRate: number;
  annual: number;
  estimateTER: number;
  clientEstimate: number;
  dailyRunRate: number;
  logicApplied: string;
  estimatedTER: number;
}

export interface NewFundInputs {
  newFundNumber: string;
  newFundEstimatedAssets: number;
  newFundBaseCCY: string;
  launchDate: string;
  fye: string;
  dayCountRemaining: number;
}

export interface BudgetProjectionTableData {
  newFundInputs: NewFundInputs;
  securities: SecurityEntry[];
  selectedModelFund: ModelFund;
}

// Trial Balance data types
export interface TrialBalanceEntry {
  id: string;
  accountNumber: string;
  accountName: string;
  classOfShares: string; // Expense
  securityUniqueQual: string;
  securityDistribution: string; // Long 1
  positionDate: string;
  assetGroup: string;
  accruedIncomeGrossBase: number;
  accruedIncomeGross: number;
  incomeEarnedBase: number;
  earnedIncomeLocal: number;
  accountBaseCurrency: string;
  ana: number; // Calculated field from Model Fund Asset After Capital Change
  annualFee: number; // Calculated field from Income Earned * 365
  rate: number; // Calculated field from Annual Rate/ANA
}

export interface TrialBalanceData {
  entries: TrialBalanceEntry[];
  totalANA: number;
  totalAnnualFee: number;
  averageRate: number;
}
