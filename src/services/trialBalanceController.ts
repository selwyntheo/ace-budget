import type { TrialBalanceData, TrialBalanceEntry, ModelFund } from '../types';

// Trial Balance Controller
export class TrialBalanceController {
  private static instance: TrialBalanceController;
  // private apiBaseUrl: string; // For future API integration

  private constructor() {
    // this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }

  public static getInstance(): TrialBalanceController {
    if (!TrialBalanceController.instance) {
      TrialBalanceController.instance = new TrialBalanceController();
    }
    return TrialBalanceController.instance;
  }

  /**
   * Fetch trial balance data for a specific model fund
   * @param modelFundId - The ID of the model fund
   * @returns Promise<TrialBalanceData>
   */
  async fetchTrialBalanceData(modelFundId: string): Promise<TrialBalanceData> {
    try {
      // In a real implementation, this would make an API call to the server
      // const response = await fetch(`${this.apiBaseUrl}/trial-balance/${modelFundId}`);
      // const data = await response.json();
      
      // For now, we'll simulate the API call and return mock data
      const response = await this.simulateApiCall(modelFundId);
      return response;
    } catch (error) {
      console.error('Error fetching trial balance data:', error);
      throw new Error('Failed to fetch trial balance data');
    }
  }

  /**
   * Calculate derived fields for trial balance entries
   * @param entries - Raw trial balance entries
   * @param modelFund - The model fund for ANA calculation
   * @returns TrialBalanceEntry[] with calculated fields
   */
  private calculateDerivedFields(entries: any[], modelFund: ModelFund): TrialBalanceEntry[] {
    return entries.map((entry, index) => {
      // ANA calculation: Model Fund Asset After Capital Change
      const ana = modelFund.assetsAfterCapitalChange;
      
      // Annual Fee calculation: Income Earned * 365
      const annualFee = entry.incomeEarnedBase * 365;
      
      // Rate calculation: Annual Fee / ANA
      const rate = ana > 0 ? annualFee / ana : 0;

      return {
        id: entry.id || `tb-${index}`,
        accountNumber: entry.accountNumber,
        accountName: entry.accountName,
        classOfShares: entry.classOfShares,
        securityUniqueQual: entry.securityUniqueQual,
        securityDistribution: entry.securityDistribution,
        positionDate: entry.positionDate,
        assetGroup: entry.assetGroup,
        accruedIncomeGrossBase: entry.accruedIncomeGrossBase,
        accruedIncomeGross: entry.accruedIncomeGross,
        incomeEarnedBase: entry.incomeEarnedBase,
        earnedIncomeLocal: entry.earnedIncomeLocal,
        accountBaseCurrency: entry.accountBaseCurrency,
        ana,
        annualFee,
        rate
      };
    });
  }

  /**
   * Simulate API call to server - replace with actual API call
   * @param modelFundId - The model fund ID
   * @returns Promise<TrialBalanceData>
   */
  private async simulateApiCall(modelFundId: string): Promise<TrialBalanceData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock trial balance data - in real implementation, this would come from the server
    const mockEntries = [
      {
        id: 'tb-001',
        accountNumber: '1001',
        accountName: 'Investment Management Fee',
        classOfShares: 'Expense',
        securityUniqueQual: 'US12345678',
        securityDistribution: 'Long 1',
        positionDate: '2024-12-31',
        assetGroup: 'Equity',
        accruedIncomeGrossBase: 125000,
        accruedIncomeGross: 125000,
        incomeEarnedBase: 342.47,
        earnedIncomeLocal: 342.47,
        accountBaseCurrency: 'USD'
      },
      {
        id: 'tb-002',
        accountNumber: '1002',
        accountName: 'Administrative Fee',
        classOfShares: 'Expense',
        securityUniqueQual: 'US87654321',
        securityDistribution: 'Long 1',
        positionDate: '2024-12-31',
        assetGroup: 'Fixed Income',
        accruedIncomeGrossBase: 75000,
        accruedIncomeGross: 75000,
        incomeEarnedBase: 205.48,
        earnedIncomeLocal: 205.48,
        accountBaseCurrency: 'USD'
      },
      {
        id: 'tb-003',
        accountNumber: '1003',
        accountName: 'Distribution Fee',
        classOfShares: 'Expense',
        securityUniqueQual: 'US11111111',
        securityDistribution: 'Long 1',
        positionDate: '2024-12-31',
        assetGroup: 'Equity',
        accruedIncomeGrossBase: 50000,
        accruedIncomeGross: 50000,
        incomeEarnedBase: 136.99,
        earnedIncomeLocal: 136.99,
        accountBaseCurrency: 'USD'
      },
      {
        id: 'tb-004',
        accountNumber: '1004',
        accountName: 'Custody Fee',
        classOfShares: 'Expense',
        securityUniqueQual: 'US22222222',
        securityDistribution: 'Long 1',
        positionDate: '2024-12-31',
        assetGroup: 'Mixed',
        accruedIncomeGrossBase: 25000,
        accruedIncomeGross: 25000,
        incomeEarnedBase: 68.49,
        earnedIncomeLocal: 68.49,
        accountBaseCurrency: 'USD'
      }
    ];

    // Get model fund data for calculations (in real implementation, this would come from the API)
    const modelFund = await this.getModelFundData(modelFundId);
    
    // Calculate derived fields
    const entriesWithCalculations = this.calculateDerivedFields(mockEntries, modelFund);

    // Calculate totals
    const totalANA = entriesWithCalculations.reduce((sum, entry) => sum + entry.ana, 0);
    const totalAnnualFee = entriesWithCalculations.reduce((sum, entry) => sum + entry.annualFee, 0);
    const averageRate = entriesWithCalculations.length > 0 
      ? entriesWithCalculations.reduce((sum, entry) => sum + entry.rate, 0) / entriesWithCalculations.length
      : 0;

    return {
      entries: entriesWithCalculations,
      totalANA,
      totalAnnualFee,
      averageRate
    };
  }

  /**
   * Get model fund data for calculations
   * @param modelFundId - The model fund ID
   * @returns Promise<ModelFund>
   */
  private async getModelFundData(modelFundId: string): Promise<ModelFund> {
    // In a real implementation, this would fetch from an API
    // For now, return mock data based on the model fund ID
    return {
      id: modelFundId,
      fundNumber: 'MF001',
      name: 'Sample Model Fund',
      fundShareclass: 'A',
      description: 'Sample fund for calculations',
      category: 'Equity',
      unitsOutstanding: 1000000,
      validationPeriodEndDate: '2024-12-31',
      shareholderEquity: 100000000,
      assetsAfterCapitalChange: 100000000, // This is used for ANA calculation
      fiscalYearEndMonth: 12,
      fiscalYearEndDay: 31,
      nav: 100.00000000,
      allocationRatioMcsOpt: 0.75,
      fundBaseCurrency: 'USD',
      performanceHistory: [],
      riskLevel: 'Medium',
      minimumInvestment: 10000,
      managementFee: 1.0
    };
  }

  /**
   * Update trial balance entry
   * @param entryId - The entry ID to update
   * @param updates - Partial updates to apply
   * @returns Promise<TrialBalanceEntry>
   */
  async updateTrialBalanceEntry(entryId: string, updates: Partial<TrialBalanceEntry>): Promise<TrialBalanceEntry> {
    try {
      // In a real implementation, this would make an API call to update the entry
      // For now, we'll simulate the update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return the updated entry (mock)
      return {
        id: entryId,
        accountNumber: updates.accountNumber || '1001',
        accountName: updates.accountName || 'Updated Account',
        classOfShares: updates.classOfShares || 'Expense',
        securityUniqueQual: updates.securityUniqueQual || 'US12345678',
        securityDistribution: updates.securityDistribution || 'Long 1',
        positionDate: updates.positionDate || '2024-12-31',
        assetGroup: updates.assetGroup || 'Equity',
        accruedIncomeGrossBase: updates.accruedIncomeGrossBase || 0,
        accruedIncomeGross: updates.accruedIncomeGross || 0,
        incomeEarnedBase: updates.incomeEarnedBase || 0,
        earnedIncomeLocal: updates.earnedIncomeLocal || 0,
        accountBaseCurrency: updates.accountBaseCurrency || 'USD',
        ana: updates.ana || 0,
        annualFee: updates.annualFee || 0,
        rate: updates.rate || 0
      };
    } catch (error) {
      console.error('Error updating trial balance entry:', error);
      throw new Error('Failed to update trial balance entry');
    }
  }
}

// Export singleton instance
export const trialBalanceController = TrialBalanceController.getInstance();
