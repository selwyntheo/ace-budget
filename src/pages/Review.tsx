import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from 'react-data-grid';
import type { Column } from 'react-data-grid';
import { useAppContext } from '../context/useAppContext';
import type { ReviewSummary } from '../types';
import './Review.css';
import 'react-data-grid/lib/styles.css';

interface DownloadableData {
  id: string;
  dataType: string;
  description: string;
  format: string;
  size: string;
  lastUpdated: string;
  status: 'Ready' | 'Processing' | 'Error';
}

interface AIReviewInsight {
  category: string;
  insight: string;
  confidence: number;
  priority: 'High' | 'Medium' | 'Low';
}

const Review: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadableData, setDownloadableData] = useState<DownloadableData[]>([]);
  const [aiReviewInsights, setAiReviewInsights] = useState<AIReviewInsight[]>([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isBudgetValidationLoading, setIsBudgetValidationLoading] = useState(false);

  useEffect(() => {
    // Redirect if required data is missing
    if (!state.selectedModelFund || !state.budgetInputs || !state.projection) {
      navigate('/');
      return;
    }

    // Generate review summary
    setIsGenerating(true);
    setIsAiAnalyzing(true);
    
    const initializeReview = async () => {
      // Simplified review summary without recommendations and warnings
      const summary: ReviewSummary = {
        selectedModelFund: state.selectedModelFund!,
        budgetInputs: state.budgetInputs!,
        projection: state.projection!,
        recommendations: [], // Removed
        warnings: [], // Removed
      };

      setReviewSummary(summary);
      dispatch({ type: 'SET_REVIEW_SUMMARY', payload: summary });
      
      // Generate downloadable data options
      generateDownloadableData();
      
      // Generate AI review insights (now async)
      await generateAIReviewInsights();
      
      setIsGenerating(false);
      setIsAiAnalyzing(false);
    };

    // Execute async initialization
    initializeReview();
  }, [state.selectedModelFund, state.budgetInputs, state.projection, navigate, dispatch]);

  const generateDownloadableData = () => {
    const currentTime = new Date().toISOString();
    const data: DownloadableData[] = [
      {
        id: 'budget-projection',
        dataType: 'Budget Projection',
        description: 'Complete budget projection data with fund parameters',
        format: 'JSON',
        size: '125 KB',
        lastUpdated: currentTime,
        status: 'Ready'
      },
      {
        id: 'securities-data',
        dataType: 'Securities Data',
        description: 'Detailed securities breakdown with TER calculations',
        format: 'CSV',
        size: '89 KB',
        lastUpdated: currentTime,
        status: 'Ready'
      },
      {
        id: 'trial-balance',
        dataType: 'Trial Balance',
        description: 'Complete trial balance data with calculated fields',
        format: 'Excel',
        size: '156 KB',
        lastUpdated: currentTime,
        status: 'Ready'
      },
      {
        id: 'fund-analysis',
        dataType: 'Fund Analysis Report',
        description: 'Comprehensive fund analysis with model comparison',
        format: 'PDF',
        size: '2.3 MB',
        lastUpdated: currentTime,
        status: 'Processing'
      },
      {
        id: 'ai-insights',
        dataType: 'AI Insights',
        description: 'AI-generated insights and analysis',
        format: 'JSON',
        size: '67 KB',
        lastUpdated: currentTime,
        status: 'Ready'
      }
    ];
    setDownloadableData(data);
  };

  const generateAIReviewInsights = async () => {
    const insights: AIReviewInsight[] = [
      {
        category: 'Expense Analysis',
        insight: 'Total expense ratio is within optimal range for the selected fund category',
        confidence: 0.92,
        priority: 'High'
      }
    ];

    // Fetch Budget Validation from API endpoint
    setIsBudgetValidationLoading(true);
    try {
      const budgetValidationResult = await fetchBudgetValidationFromAPI();
      if (budgetValidationResult) {
        insights.push(budgetValidationResult);
      }
    } catch (error) {
      console.error('Failed to fetch budget validation:', error);
      // Add default budget validation if API fails
      insights.push({
        category: 'Budget Validation',
        insight: 'Budget allocation analysis is currently unavailable. Please try again later.',
        confidence: 0.0,
        priority: 'Low'
      });
    } finally {
      setIsBudgetValidationLoading(false);
    }

    setAiReviewInsights(insights);
  };

  const fetchBudgetValidationFromAPI = async (): Promise<AIReviewInsight | null> => {
    if (!reviewSummary) return null;

    try {
      // Prepare API request payload
      const requestPayload = {
        fundId: reviewSummary.selectedModelFund.id,
        fundName: reviewSummary.selectedModelFund.name,
        initialInvestment: reviewSummary.budgetInputs.initialInvestment,
        projectedValue: reviewSummary.projection.projectedValue,
        expectedReturn: reviewSummary.projection.expectedReturn,
        riskLevel: reviewSummary.selectedModelFund.riskLevel,
        managementFee: reviewSummary.selectedModelFund.managementFee,
        timestamp: new Date().toISOString()
      };

      // In a real implementation, this would be an actual API call
      // const response = await fetch('/api/budget-validation', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(requestPayload)
      // });
      // const data = await response.json();

      // Simulate API call with realistic delay and response
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate random API success/failure (90% success rate)
          if (Math.random() > 0.1) {
            // Generate dynamic insight based on the actual data
            const assetAllocation = calculateAssetAllocation(requestPayload);
            const complianceScore = calculateComplianceScore(requestPayload);
            
            const mockApiResponse = {
              category: 'Budget Validation',
              insight: `Budget allocation shows ${assetAllocation.equity}% equity, ${assetAllocation.bonds}% bonds, and ${assetAllocation.alternatives}% alternatives. Compliance score: ${complianceScore}%. ${getValidationMessage(complianceScore)}`,
              confidence: Math.round((complianceScore / 100) * 100) / 100,
              priority: complianceScore >= 85 ? 'High' : complianceScore >= 70 ? 'Medium' : 'Low'
            } as AIReviewInsight;
            
            resolve(mockApiResponse);
          } else {
            // Simulate API error
            reject(new Error('API service temporarily unavailable'));
          }
        }, 2000); // Simulate network delay
      });
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  const calculateAssetAllocation = (payload: any) => {
    // Simulate asset allocation calculation based on fund data
    const riskFactor = payload.riskLevel === 'High' ? 0.8 : payload.riskLevel === 'Medium' ? 0.6 : 0.4;
    return {
      equity: Math.round(60 + (riskFactor * 20)),
      bonds: Math.round(35 - (riskFactor * 15)),
      alternatives: Math.round(5 + (riskFactor * 5))
    };
  };

  const calculateComplianceScore = (payload: any) => {
    // Simulate compliance score calculation
    let score = 75; // Base score
    
    // Adjust based on expense ratio
    if (payload.expectedReturn < 1.0) score += 15;
    else if (payload.expectedReturn < 2.0) score += 10;
    else if (payload.expectedReturn > 3.0) score -= 10;
    
    // Adjust based on fund size
    if (payload.initialInvestment > 100000) score += 10;
    else if (payload.initialInvestment < 10000) score -= 5;
    
    return Math.min(Math.max(score, 0), 100);
  };

  const getValidationMessage = (score: number) => {
    if (score >= 85) return 'Excellent alignment with industry standards.';
    if (score >= 70) return 'Good alignment with minor optimization opportunities.';
    if (score >= 50) return 'Acceptable allocation with room for improvement.';
    return 'Allocation requires review and adjustment.';
  };

  const downloadDataColumns: Column<DownloadableData>[] = [
    {
      key: 'dataType',
      name: 'Data Type',
      width: 200,
      renderCell: ({ row }) => (
        <div className="data-type-cell">
          <strong>{row.dataType}</strong>
        </div>
      )
    },
    {
      key: 'description',
      name: 'Description',
      width: 300,
      renderCell: ({ row }) => (
        <div className="description-cell">
          {row.description}
        </div>
      )
    },
    {
      key: 'format',
      name: 'Format',
      width: 100,
      renderCell: ({ row }) => (
        <div className={`format-badge format-badge--${row.format.toLowerCase()}`}>
          {row.format}
        </div>
      )
    },
    {
      key: 'size',
      name: 'Size',
      width: 100,
      renderCell: ({ row }) => (
        <div className="size-cell">
          {row.size}
        </div>
      )
    },
    {
      key: 'status',
      name: 'Status',
      width: 120,
      renderCell: ({ row }) => (
        <div className={`status-badge status-badge--${row.status.toLowerCase()}`}>
          {row.status}
        </div>
      )
    },
    {
      key: 'actions',
      name: 'Actions',
      width: 120,
      renderCell: ({ row }) => (
        <button
          className={`download-btn ${row.status === 'Ready' ? 'download-btn--ready' : 'download-btn--disabled'}`}
          onClick={() => handleDownload(row.id)}
          disabled={row.status !== 'Ready'}
        >
          {row.status === 'Ready' ? 'Download' : 'Processing...'}
        </button>
      )
    }
  ];

  // Data generation functions for downloads
  const generateBudgetProjectionData = () => {
    if (!reviewSummary) return [];

    // Generate sample budget projection data with the requested fields
    const currentDate = new Date();
    const fyeDate = new Date(currentDate.getFullYear(), 11, 31); // Dec 31 of current year
    const execDate = new Date();

    const budgetProjectionData = [
      {
        MODE: 'BUDGET',
        ACCT: reviewSummary.selectedModelFund.id,
        SCTYDT: currentDate.toISOString().split('T')[0],
        SCTYUNQ: 'FUND001',
        FYEDT: fyeDate.toISOString().split('T')[0],
        EXECDT: execDate.toISOString().split('T')[0],
        AMTYP: 'INITIAL',
        AMT: reviewSummary.budgetInputs.initialInvestment
      },
      {
        MODE: 'BUDGET',
        ACCT: reviewSummary.selectedModelFund.id,
        SCTYDT: currentDate.toISOString().split('T')[0],
        SCTYUNQ: 'FUND002',
        FYEDT: fyeDate.toISOString().split('T')[0],
        EXECDT: execDate.toISOString().split('T')[0],
        AMTYP: 'PROJECTED',
        AMT: reviewSummary.projection.projectedValue
      },
      {
        MODE: 'BUDGET',
        ACCT: reviewSummary.selectedModelFund.id,
        SCTYDT: currentDate.toISOString().split('T')[0],
        SCTYUNQ: 'FUND003',
        FYEDT: fyeDate.toISOString().split('T')[0],
        EXECDT: execDate.toISOString().split('T')[0],
        AMTYP: 'CONTRIBUTION',
        AMT: reviewSummary.projection.totalContributions
      },
      {
        MODE: 'BUDGET',
        ACCT: reviewSummary.selectedModelFund.id,
        SCTYDT: currentDate.toISOString().split('T')[0],
        SCTYUNQ: 'FUND004',
        FYEDT: fyeDate.toISOString().split('T')[0],
        EXECDT: execDate.toISOString().split('T')[0],
        AMTYP: 'GROWTH',
        AMT: reviewSummary.projection.totalGrowth
      },
      {
        MODE: 'BUDGET',
        ACCT: reviewSummary.selectedModelFund.id,
        SCTYDT: currentDate.toISOString().split('T')[0],
        SCTYUNQ: 'FUND005',
        FYEDT: fyeDate.toISOString().split('T')[0],
        EXECDT: execDate.toISOString().split('T')[0],
        AMTYP: 'FEE',
        AMT: reviewSummary.projection.projectedValue * (reviewSummary.projection.expectedReturn / 100)
      }
    ];

    return budgetProjectionData;
  };

  const generateSecuritiesData = () => {
    if (!reviewSummary) return [];

    return [
      {
        fundName: reviewSummary.selectedModelFund.name,
        securityId: 'SEC001',
        securityDescription: 'Equity Holdings',
        assetGroup: 'EQUITIES',
        feeType: 'INCLUDE',
        modelFundRate: reviewSummary.selectedModelFund.managementFee,
        projectedRate: reviewSummary.projection.expectedReturn,
        estimatedTER: reviewSummary.projection.expectedReturn
      },
      {
        fundName: reviewSummary.selectedModelFund.name,
        securityId: 'SEC002',
        securityDescription: 'Fixed Income',
        assetGroup: 'BONDS',
        feeType: 'INCLUDE',
        modelFundRate: reviewSummary.selectedModelFund.managementFee * 0.8,
        projectedRate: reviewSummary.projection.expectedReturn * 0.8,
        estimatedTER: reviewSummary.projection.expectedReturn * 0.8
      }
    ];
  };

  const generateTrialBalanceData = () => {
    if (!reviewSummary) return [];

    return [
      {
        accountNumber: 'ACC001',
        accountName: 'Management Fee Account',
        classOfShares: 'Expense',
        securityUniqueQualifier: 'MGMT001',
        securityDistribution: 'Long 1',
        positionDate: new Date().toISOString().split('T')[0],
        assetGroup: 'FEES',
        accruedIncomeGrossBase: 1000.00,
        accruedIncomeGross: 1000.00,
        incomeEarnedBase: 850.00,
        earnedIncomeLocal: 850.00,
        accountBaseCurrency: 'USD',
        ANA: 85000.00,
        annualFee: 850.00 * 365,
        rate: (850.00 * 365) / 85000.00
      }
    ];
  };

  const generateFundAnalysisData = () => {
    if (!reviewSummary) return {};

    return {
      analysisDate: new Date().toISOString(),
      selectedFund: reviewSummary.selectedModelFund,
      budgetInputs: reviewSummary.budgetInputs,
      projection: reviewSummary.projection,
      performanceMetrics: {
        riskAdjustedReturn: reviewSummary.projection.expectedReturn * 0.85,
        volatilityScore: reviewSummary.selectedModelFund.riskLevel === 'High' ? 0.8 : 0.4,
        diversificationIndex: 0.72
      }
    };
  };

  const generateAIInsightsData = () => {
    return {
      analysisTimestamp: new Date().toISOString(),
      insights: aiReviewInsights,
      overallConfidence: aiReviewInsights.reduce((sum, insight) => sum + insight.confidence, 0) / aiReviewInsights.length,
      highPriorityCount: aiReviewInsights.filter(i => i.priority === 'High').length,
      totalInsights: aiReviewInsights.length
    };
  };

  const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  };

  const handleDownload = (dataId: string) => {
    const item = downloadableData.find(d => d.id === dataId);
    if (!item) return;

    let downloadData: any;
    let mimeType = 'application/json';
    let fileExtension = item.format.toLowerCase();

    // Generate specific data based on download type
    switch (dataId) {
      case 'budget-projection':
        downloadData = generateBudgetProjectionData();
        break;
      case 'securities-data':
        downloadData = generateSecuritiesData();
        break;
      case 'trial-balance':
        downloadData = generateTrialBalanceData();
        break;
      case 'fund-analysis':
        downloadData = generateFundAnalysisData();
        break;
      case 'ai-insights':
        downloadData = generateAIInsightsData();
        break;
      default:
        downloadData = { message: `${item.dataType} data` };
    }

    // Convert to appropriate format
    let content: string;
    if (item.format === 'CSV') {
      content = convertToCSV(downloadData);
      mimeType = 'text/csv';
    } else if (item.format === 'Excel') {
      content = JSON.stringify(downloadData, null, 2);
      mimeType = 'application/json'; // Simplified for demo
    } else {
      content = JSON.stringify(downloadData, null, 2);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.dataType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const readyItems = downloadableData.filter(item => item.status === 'Ready');
    readyItems.forEach(item => {
      setTimeout(() => handleDownload(item.id), Math.random() * 1000);
    });
  };

  const handleFinalizeBudget = () => {
    // Finalize budget and navigate to confirmation
    alert('Budget finalized successfully!');
    navigate('/');
  };

  if (isGenerating) {
    return (
      <div className="review">
        <div className="review__loading">
          <div className="loading-spinner"></div>
          <h2>Generating Budget Review...</h2>
          <p>Please wait while we analyze your budget data with AI.</p>
        </div>
      </div>
    );
  }

  if (!reviewSummary) {
    return null;
  }

  return (
    <div className="review">
      <div className="review__header">
        <h1>Budget Review and Finalization with the AI Agent Reviewing the data</h1>
        <p>Review your budget data, download reports, and finalize your budget with AI-powered insights.</p>
      </div>

      <div className="review__content">
        {/* AI Agent Review Section */}
        <div className="review__section">
          <h2>AI Agent Review</h2>
          {isAiAnalyzing ? (
            <div className="ai-analyzing">
              <div className="loading-spinner"></div>
              <p>AI is analyzing your budget data...</p>
            </div>
          ) : (
            <div className="ai-insights">
              {aiReviewInsights.map((insight, index) => (
                <div key={index} className={`ai-insight ai-insight--${insight.priority.toLowerCase()}`}>
                  <div className="ai-insight__header">
                    <h4>{insight.category}</h4>
                    <div className="ai-insight__meta">
                      <span className={`priority-badge priority-badge--${insight.priority.toLowerCase()}`}>
                        {insight.priority}
                      </span>
                      <span className="confidence-score">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  <p className="ai-insight__text">{insight.insight}</p>
                </div>
              ))}
              {isBudgetValidationLoading && (
                <div className="ai-insight ai-insight--loading">
                  <div className="ai-insight__header">
                    <h4>Budget Validation</h4>
                    <div className="ai-insight__meta">
                      <div className="loading-spinner small"></div>
                    </div>
                  </div>
                  <p className="ai-insight__text">Fetching budget validation analysis from server...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Budget Summary Section */}
        <div className="review__section">
          <h2>Budget Summary</h2>
          <div className="budget-summary">
            <div className="summary-card">
              <h3>Selected Model Fund</h3>
              <p className="summary-value">{reviewSummary.selectedModelFund.name}</p>
            </div>
            <div className="summary-card">
              <h3>Estimated Assets</h3>
              <p className="summary-value">${reviewSummary.budgetInputs.initialInvestment.toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h3>Projected Value</h3>
              <p className="summary-value">${reviewSummary.projection.projectedValue.toLocaleString()}</p>
            </div>
            <div className="summary-card">
              <h3>Total Expense Ratio</h3>
              <p className="summary-value">{reviewSummary.projection.expectedReturn.toFixed(4)}%</p>
            </div>
          </div>
        </div>

        {/* Data Download Grid Section */}
        <div className="review__section">
          <h2>Data Download Center</h2>
          <div className="download-grid-container">
            <div className="download-grid-header">
              <p>Download your budget data in various formats for external analysis and reporting.</p>
              <button 
                className="btn btn--primary download-all-btn"
                onClick={handleDownloadAll}
              >
                Download All Ready Files
              </button>
            </div>
            <div className="data-grid-wrapper">
              <DataGrid
                columns={downloadDataColumns}
                rows={downloadableData}
                className="download-data-grid"
                headerRowHeight={50}
                rowHeight={60}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="review__actions">
        <button className="btn btn--secondary" onClick={() => navigate('/')}>
          Start Over
        </button>
        <button className="btn btn--outline" onClick={() => navigate('/budget-projection')}>
          Modify Budget
        </button>
        <button className="btn btn--primary" onClick={handleFinalizeBudget}>
          Finalize Budget
        </button>
      </div>
    </div>
  );
};

export default Review;
