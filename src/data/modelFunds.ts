import type { ModelFund, SecurityEntry } from '../types';

export const sampleModelFunds: ModelFund[] = [
  {
    id: 'fund-001',
    fundNumber: 'GEF-001',
    name: 'Growth Equity Fund',
    fundShareclass: 'Class A',
    description: 'A diversified equity fund focusing on growth stocks with strong potential for capital appreciation.',
    category: 'Equity',
    unitsOutstanding: 12500000,
    validationPeriodEndDate: '2024-12-31',
    shareholderEquity: 450000000,
    assetsAfterCapitalChange: 475000000,
    fiscalYearEndMonth: 12,
    fiscalYearEndDay: 31,
    nav: 36.24567890,
    allocationRatioMcsOpt: 0.15,
    fundBaseCurrency: 'USD',
    performanceHistory: [
      { year: 2023, return: 12.5, volatility: 15.2 },
      { year: 2022, return: -8.3, volatility: 18.7 },
      { year: 2021, return: 22.1, volatility: 16.4 },
      { year: 2020, return: 18.9, volatility: 24.3 },
      { year: 2019, return: 28.7, volatility: 14.8 },
    ],
    riskLevel: 'High',
    minimumInvestment: 1000,
    managementFee: 0.75,
  },
  {
    id: 'fund-002',
    fundNumber: 'BIF-002',
    name: 'Balanced Income Fund',
    fundShareclass: 'Class B',
    description: 'A balanced fund that provides steady income through a mix of bonds and dividend-paying stocks.',
    category: 'Balanced',
    unitsOutstanding: 8750000,
    validationPeriodEndDate: '2024-12-31',
    shareholderEquity: 262500000,
    assetsAfterCapitalChange: 280000000,
    fiscalYearEndMonth: 6,
    fiscalYearEndDay: 30,
    nav: 30.14285714,
    allocationRatioMcsOpt: 0.25,
    fundBaseCurrency: 'USD',
    performanceHistory: [
      { year: 2023, return: 8.2, volatility: 9.1 },
      { year: 2022, return: -2.1, volatility: 11.3 },
      { year: 2021, return: 12.4, volatility: 8.7 },
      { year: 2020, return: 6.8, volatility: 12.9 },
      { year: 2019, return: 15.3, volatility: 7.2 },
    ],
    riskLevel: 'Medium',
    minimumInvestment: 500,
    managementFee: 0.65,
  },
  {
    id: 'fund-003',
    fundNumber: 'CBF-003',
    name: 'Conservative Bond Fund',
    fundShareclass: 'Class C',
    description: 'A low-risk bond fund focused on government and high-grade corporate bonds for capital preservation.',
    category: 'Fixed Income',
    unitsOutstanding: 15000000,
    validationPeriodEndDate: '2024-12-31',
    shareholderEquity: 225000000,
    assetsAfterCapitalChange: 235000000,
    fiscalYearEndMonth: 3,
    fiscalYearEndDay: 31,
    nav: 15.00000000,
    allocationRatioMcsOpt: 0.40,
    fundBaseCurrency: 'USD',
    performanceHistory: [
      { year: 2023, return: 4.1, volatility: 3.2 },
      { year: 2022, return: -1.8, volatility: 4.1 },
      { year: 2021, return: 3.2, volatility: 2.8 },
      { year: 2020, return: 7.5, volatility: 5.3 },
      { year: 2019, return: 6.8, volatility: 2.1 },
    ],
    riskLevel: 'Low',
    minimumInvestment: 250,
    managementFee: 0.45,
  },
  {
    id: 'fund-004',
    fundNumber: 'IEF-004',
    name: 'International Equity Fund',
    fundShareclass: 'Class A',
    description: 'An international diversified equity fund investing in developed and emerging markets worldwide.',
    category: 'International Equity',
    unitsOutstanding: 6250000,
    validationPeriodEndDate: '2024-12-31',
    shareholderEquity: 312500000,
    assetsAfterCapitalChange: 325000000,
    fiscalYearEndMonth: 9,
    fiscalYearEndDay: 30,
    nav: 50.00000000,
    allocationRatioMcsOpt: 0.12,
    fundBaseCurrency: 'EUR',
    performanceHistory: [
      { year: 2023, return: 15.7, volatility: 19.4 },
      { year: 2022, return: -12.1, volatility: 22.8 },
      { year: 2021, return: 18.3, volatility: 17.9 },
      { year: 2020, return: 14.2, volatility: 26.1 },
      { year: 2019, return: 21.9, volatility: 16.7 },
    ],
    riskLevel: 'High',
    minimumInvestment: 1000,
    managementFee: 0.85,
  },
  {
    id: 'fund-005',
    fundNumber: 'TSF-005',
    name: 'Technology Sector Fund',
    fundShareclass: 'Class I',
    description: 'A specialized fund focusing on technology companies with high growth potential.',
    category: 'Sector - Technology',
    unitsOutstanding: 4500000,
    validationPeriodEndDate: '2024-12-31',
    shareholderEquity: 540000000,
    assetsAfterCapitalChange: 562500000,
    fiscalYearEndMonth: 12,
    fiscalYearEndDay: 31,
    nav: 120.00000000,
    allocationRatioMcsOpt: 0.08,
    fundBaseCurrency: 'USD',
    performanceHistory: [
      { year: 2023, return: 35.2, volatility: 28.3 },
      { year: 2022, return: -28.1, volatility: 32.4 },
      { year: 2021, return: 42.7, volatility: 29.1 },
      { year: 2020, return: 48.9, volatility: 35.7 },
      { year: 2019, return: 31.4, volatility: 25.8 },
    ],
    riskLevel: 'High',
    minimumInvestment: 1000,
    managementFee: 0.95,
  },
];

// Utility function to calculate average return
export const calculateAverageReturn = (fund: ModelFund): number => {
  const totalReturn = fund.performanceHistory.reduce((sum, data) => sum + data.return, 0);
  return totalReturn / fund.performanceHistory.length;
};

// Utility function to calculate average volatility
export const calculateAverageVolatility = (fund: ModelFund): number => {
  const totalVolatility = fund.performanceHistory.reduce((sum, data) => sum + data.volatility, 0);
  return totalVolatility / fund.performanceHistory.length;
};

// Sample security data for budget projection tables
export const getSecurityDataForFund = (fundId: string): SecurityEntry[] => {
  const baseSecurities: Record<string, SecurityEntry[]> = {
    'fund-001': [
      {
        id: 'sec-001-1',
        fund: 'Growth Equity Fund',
        securityUniqueQualifier: 'AAPL.US',
        securityDescription: 'Apple Inc. Common Stock',
        assetGroup: 'Equity',
        feeType: 'Include',
        modelFundCurrentRunRate: 0.0012,
        weightedToNewFundProjectionRunRate: 0.0014,
        annual: 0.51,
        estimateTER: 0.0051,
        clientEstimate: 0.0053,
        dailyRunRate: 0.000014,
        logicApplied: 'Weighted Average',
        estimatedTER: 0.0052
      },
      {
        id: 'sec-001-2',
        fund: 'Growth Equity Fund',
        securityUniqueQualifier: 'MSFT.US',
        securityDescription: 'Microsoft Corporation Common Stock',
        assetGroup: 'Equity',
        feeType: 'Include',
        modelFundCurrentRunRate: 0.0011,
        weightedToNewFundProjectionRunRate: 0.0013,
        annual: 0.47,
        estimateTER: 0.0047,
        clientEstimate: 0.0049,
        dailyRunRate: 0.000013,
        logicApplied: 'Weighted Average',
        estimatedTER: 0.0048
      },
      {
        id: 'sec-001-3',
        fund: 'Growth Equity Fund',
        securityUniqueQualifier: 'GOOGL.US',
        securityDescription: 'Alphabet Inc. Class A Common Stock',
        assetGroup: 'Equity',
        feeType: 'Include',
        modelFundCurrentRunRate: 0.0010,
        weightedToNewFundProjectionRunRate: 0.0012,
        annual: 0.44,
        estimateTER: 0.0044,
        clientEstimate: 0.0046,
        dailyRunRate: 0.000012,
        logicApplied: 'Weighted Average',
        estimatedTER: 0.0045
      }
    ],
    'fund-002': [
      {
        id: 'sec-002-1',
        fund: 'Balanced Income Fund',
        securityUniqueQualifier: 'AGG.US',
        securityDescription: 'iShares Core US Aggregate Bond ETF',
        assetGroup: 'Fixed Income',
        feeType: 'Include',
        modelFundCurrentRunRate: 0.0008,
        weightedToNewFundProjectionRunRate: 0.0009,
        annual: 0.32,
        estimateTER: 0.0032,
        clientEstimate: 0.0034,
        dailyRunRate: 0.000009,
        logicApplied: 'Weighted Average',
        estimatedTER: 0.0033
      },
      {
        id: 'sec-002-2',
        fund: 'Balanced Income Fund',
        securityUniqueQualifier: 'VTI.US',
        securityDescription: 'Vanguard Total Stock Market ETF',
        assetGroup: 'Equity',
        feeType: 'Include',
        modelFundCurrentRunRate: 0.0009,
        weightedToNewFundProjectionRunRate: 0.0010,
        annual: 0.36,
        estimateTER: 0.0036,
        clientEstimate: 0.0038,
        dailyRunRate: 0.000010,
        logicApplied: 'Weighted Average',
        estimatedTER: 0.0037
      }
    ]
  };

  return baseSecurities[fundId] || [];
};
