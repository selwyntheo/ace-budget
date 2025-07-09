import type { ModelFund } from '../types';

export const sampleModelFunds: ModelFund[] = [
  {
    id: 'fund-001',
    name: 'Growth Equity Fund',
    description: 'A diversified equity fund focusing on growth stocks with strong potential for capital appreciation.',
    category: 'Equity',
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
    name: 'Balanced Income Fund',
    description: 'A balanced fund that provides steady income through a mix of bonds and dividend-paying stocks.',
    category: 'Balanced',
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
    name: 'Conservative Bond Fund',
    description: 'A low-risk bond fund focused on government and high-grade corporate bonds for capital preservation.',
    category: 'Fixed Income',
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
    name: 'International Equity Fund',
    description: 'An international diversified equity fund investing in developed and emerging markets worldwide.',
    category: 'International Equity',
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
    name: 'Technology Sector Fund',
    description: 'A specialized fund focusing on technology companies with high growth potential.',
    category: 'Sector - Technology',
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
