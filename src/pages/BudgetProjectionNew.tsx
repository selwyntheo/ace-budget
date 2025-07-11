import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from 'react-data-grid';
import type { Column, RenderEditCellProps } from 'react-data-grid';
import { useAppContext } from '../context/useAppContext';
import { getSecurityDataForFund } from '../data/modelFunds';
import { trialBalanceController } from '../services/trialBalanceController';
import type { NewFundInputs, SecurityEntry, TrialBalanceData, TrialBalanceEntry } from '../types';
import './BudgetProjection.css';
import 'react-data-grid/lib/styles.css';

const BudgetProjection: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [newFundInputs, setNewFundInputs] = useState<NewFundInputs>({
    newFundNumber: '',
    newFundEstimatedAssets: 0,
    newFundBaseCCY: 'USD',
    launchDate: '',
    fye: '',
    dayCountRemaining: 0,
  });
  const [securities, setSecurities] = useState<SecurityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Trial Balance state
  const [trialBalanceData, setTrialBalanceData] = useState<TrialBalanceData | null>(null);
  const [isLoadingTrialBalance, setIsLoadingTrialBalance] = useState(false);
  const [trialBalanceError, setTrialBalanceError] = useState<string>('');
  
  // Prospectus upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<{
    budgetAnalysis: string;
    expenseBreakdown: string;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  // Redirect if no model fund is selected
  useEffect(() => {
    if (!state.selectedModelFund) {
      navigate('/');
      return;
    }

    // Load security data for the selected fund
    setIsLoading(true);
    setTimeout(() => {
      const securityData = getSecurityDataForFund(state.selectedModelFund!.id);
      setSecurities(securityData);
      setIsLoading(false);
    }, 500);

    // Load trial balance data
    loadTrialBalanceData();
  }, [state.selectedModelFund, navigate]);

  // Load trial balance data from server
  const loadTrialBalanceData = async () => {
    if (!state.selectedModelFund) return;
    
    setIsLoadingTrialBalance(true);
    setTrialBalanceError('');
    
    try {
      const data = await trialBalanceController.fetchTrialBalanceData(state.selectedModelFund.id);
      setTrialBalanceData(data);
    } catch (error) {
      setTrialBalanceError('Failed to load trial balance data. Please try again.');
      console.error('Error loading trial balance data:', error);
    } finally {
      setIsLoadingTrialBalance(false);
    }
  };

  const handleNewFundInputChange = (field: keyof NewFundInputs, value: string | number) => {
    setNewFundInputs(prev => ({ ...prev, [field]: value }));
  };

  // Prospectus upload handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadError('');
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setUploadError('Please upload a PDF file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB');
        return;
      }
      
      setUploadedFile(file);
      analyzeProspectus(file);
    }
  };

  const analyzeProspectus = async (file: File) => {
    setIsAnalyzing(true);
    setAiInsights(null);
    
    try {
      // Simulate AI analysis - in a real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI insights based on file name and common prospectus patterns
      const fileName = file.name.toLowerCase();
      const isEquityFund = fileName.includes('equity') || fileName.includes('stock');
      const isBondFund = fileName.includes('bond') || fileName.includes('fixed');
      
      const mockInsights = {
        budgetAnalysis: `Based on the uploaded prospectus (${file.name}), the estimated annual operating expenses range from ${isEquityFund ? '0.85% to 1.45%' : isBondFund ? '0.45% to 0.85%' : '0.75% to 1.25%'} of net assets. Key cost drivers include management fees, administrative costs, and distribution fees. The fund structure suggests a total expense ratio in line with industry standards for similar asset classes.`,
        expenseBreakdown: `Management Fee: ${isEquityFund ? '0.75%' : isBondFund ? '0.45%' : '0.65%'} | Administrative Expenses: 0.20% | Distribution/Service Fees: 0.12% | Other Expenses: 0.08% | Total Estimated TER: ${isEquityFund ? '1.15%' : isBondFund ? '0.85%' : '1.05%'}`
      };
      
      setAiInsights(mockInsights);
    } catch (error) {
      setUploadError('Failed to analyze prospectus. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAiInsights(null);
    setUploadError('');
  };

  const calculateTotalTER = () => {
    return securities.reduce((total, security) => total + security.estimatedTER, 0);
  };

  // Color-coded cell formatters
  const ColorCodedCell = ({ value, colorType }: { value: number; colorType: 'projection' | 'annual' | 'ter' }) => {
    const getColor = (val: number, type: string) => {
      switch (type) {
        case 'projection':
          if (val > 0.5) return '#e8f5e8'; // Light green for high values
          if (val > 0.2) return '#fff3cd'; // Light yellow for medium values
          return '#f8d7da'; // Light red for low values
        case 'annual':
          if (val > 1000) return '#e8f5e8'; // Light green for high values
          if (val > 500) return '#fff3cd'; // Light yellow for medium values
          return '#f8d7da'; // Light red for low values
        case 'ter':
          if (val < 0.5) return '#e8f5e8'; // Light green for low TER (good)
          if (val < 1.0) return '#fff3cd'; // Light yellow for medium TER
          return '#f8d7da'; // Light red for high TER (concerning)
        default:
          return '#ffffff';
      }
    };

    return (
      <div style={{ 
        backgroundColor: getColor(value, colorType),
        padding: '4px 8px',
        borderRadius: '4px',
        textAlign: 'right',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}>
        {typeof value === 'number' ? value.toFixed(4) : value}
      </div>
    );
  };

  // Editable cell component
  const EditableCell = ({ row, column, onRowChange }: RenderEditCellProps<SecurityEntry>) => {
    const value = row[column.key as keyof SecurityEntry];
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const newValue = column.key.includes('Rate') || column.key.includes('TER') || column.key.includes('annual') || column.key.includes('Estimate')
        ? Number(e.target.value)
        : e.target.value;
      
      onRowChange({ ...row, [column.key]: newValue });
    };

    if (column.key === 'feeType') {
      return (
        <select value={value as string} onChange={handleChange} style={{ width: '100%', border: 'none', background: 'transparent' }}>
          <option value="Include">Include</option>
          <option value="Exclude">Exclude</option>
        </select>
      );
    }

    if (column.key === 'logicApplied') {
      return (
        <select value={value as string} onChange={handleChange} style={{ width: '100%', border: 'none', background: 'transparent' }}>
          <option value="Weighted Average">Weighted Average</option>
          <option value="Direct Allocation">Direct Allocation</option>
          <option value="Pro Rata">Pro Rata</option>
          <option value="Custom Logic">Custom Logic</option>
        </select>
      );
    }

    return (
      <input
        type={typeof value === 'number' ? 'number' : 'text'}
        value={value}
        onChange={handleChange}
        step={column.key.includes('Rate') || column.key.includes('TER') ? '0.0001' : column.key === 'annual' ? '0.01' : '1'}
        style={{ width: '100%', border: 'none', background: 'transparent', textAlign: typeof value === 'number' ? 'right' : 'left' }}
      />
    );
  };

  // Column definitions for React Data Grid
  const columns: Column<SecurityEntry>[] = useMemo(() => [
    { key: 'fund', name: 'Fund', width: 80, frozen: true },
    { key: 'securityUniqueQualifier', name: 'Security Unique Qualifier', width: 120, frozen: true },
    { key: 'securityDescription', name: 'Security Description', width: 200, frozen: true },
    { key: 'assetGroup', name: 'Asset Group', width: 120 },
    { 
      key: 'feeType', 
      name: 'Fee Type - Include/Exclude', 
      width: 140,
      renderEditCell: EditableCell
    },
    { 
      key: 'modelFundCurrentRunRate', 
      name: 'Model Fund # - Current Run Rate', 
      width: 160,
      renderEditCell: EditableCell
    },
    { 
      key: 'weightedToNewFundProjectionRunRate', 
      name: 'Weighted to New Fund - Projection Run Rate Estimates', 
      width: 200,
      renderCell: ({ row }) => <ColorCodedCell value={row.weightedToNewFundProjectionRunRate} colorType="projection" />,
      renderEditCell: EditableCell
    },
    { 
      key: 'annual', 
      name: 'Annual', 
      width: 100,
      renderCell: ({ row }) => <ColorCodedCell value={row.annual} colorType="annual" />,
      renderEditCell: EditableCell
    },
    { 
      key: 'estimateTER', 
      name: 'Estimate TER', 
      width: 120,
      renderCell: ({ row }) => <ColorCodedCell value={row.estimateTER} colorType="ter" />,
      renderEditCell: EditableCell
    },
    { 
      key: 'clientEstimate', 
      name: 'Client Estimate', 
      width: 120,
      renderEditCell: EditableCell
    },
    { 
      key: 'dailyRunRate', 
      name: 'Daily Run Rate', 
      width: 120,
      renderEditCell: EditableCell
    },
    { 
      key: 'logicApplied', 
      name: 'Logic Applied', 
      width: 140,
      renderEditCell: EditableCell
    },
    { 
      key: 'estimatedTER', 
      name: 'Estimated TER', 
      width: 120,
      renderEditCell: EditableCell
    }
  ], []);

  const handleRowsChange = (rows: SecurityEntry[], { indexes }: { indexes: number[] }) => {
    const updatedSecurities = [...securities];
    indexes.forEach(index => {
      updatedSecurities[index] = rows[index];
    });
    setSecurities(updatedSecurities);
  };

  // Trial Balance column definitions
  const trialBalanceColumns: Column<TrialBalanceEntry>[] = useMemo(() => [
    { key: 'accountNumber', name: 'Account Number', width: 120, frozen: true },
    { key: 'accountName', name: 'Account Name', width: 200, frozen: true },
    { key: 'classOfShares', name: 'Class of Shares (Expense)', width: 150 },
    { key: 'securityUniqueQual', name: 'Security Unique Qual', width: 150 },
    { key: 'securityDistribution', name: 'Security Distribution (Long 1)', width: 180 },
    { key: 'positionDate', name: 'Position Date', width: 120 },
    { key: 'assetGroup', name: 'Asset Group', width: 120 },
    { 
      key: 'accruedIncomeGrossBase', 
      name: 'Accrued Income Gross (Base)', 
      width: 180,
      renderCell: ({ row }) => `$${row.accruedIncomeGrossBase.toLocaleString()}`
    },
    { 
      key: 'accruedIncomeGross', 
      name: 'Accrued Income Gross', 
      width: 160,
      renderCell: ({ row }) => `$${row.accruedIncomeGross.toLocaleString()}`
    },
    { 
      key: 'incomeEarnedBase', 
      name: 'Income Earned (Base)', 
      width: 150,
      renderCell: ({ row }) => `$${row.incomeEarnedBase.toFixed(2)}`
    },
    { 
      key: 'earnedIncomeLocal', 
      name: 'Earned Income (Local)', 
      width: 150,
      renderCell: ({ row }) => `$${row.earnedIncomeLocal.toFixed(2)}`
    },
    { key: 'accountBaseCurrency', name: 'Account Base Currency', width: 160 },
    { 
      key: 'ana', 
      name: 'ANA', 
      width: 120,
      renderCell: ({ row }) => `$${row.ana.toLocaleString()}`,
      headerTooltip: 'Asset Net Amount (Model Fund Asset After Capital Change)'
    },
    { 
      key: 'annualFee', 
      name: 'Annual Fee', 
      width: 120,
      renderCell: ({ row }) => `$${row.annualFee.toFixed(2)}`,
      headerTooltip: 'Income Earned * 365'
    },
    { 
      key: 'rate', 
      name: 'Rate', 
      width: 100,
      renderCell: ({ row }) => `${(row.rate * 100).toFixed(4)}%`,
      headerTooltip: 'Annual Fee / ANA'
    }
  ], []);

  const handleTrialBalanceRowsChange = (rows: TrialBalanceEntry[], { indexes }: { indexes: number[] }) => {
    if (!trialBalanceData) return;
    
    const updatedEntries = [...trialBalanceData.entries];
    indexes.forEach(index => {
      updatedEntries[index] = rows[index];
    });
    
    // Recalculate totals
    const totalANA = updatedEntries.reduce((sum, entry) => sum + entry.ana, 0);
    const totalAnnualFee = updatedEntries.reduce((sum, entry) => sum + entry.annualFee, 0);
    const averageRate = updatedEntries.length > 0 
      ? updatedEntries.reduce((sum, entry) => sum + entry.rate, 0) / updatedEntries.length
      : 0;
    
    setTrialBalanceData({
      entries: updatedEntries,
      totalANA,
      totalAnnualFee,
      averageRate
    });
  };

  const handleContinue = () => {
    // Save the budget inputs in compatible format
    const budgetInputsData = {
      initialInvestment: newFundInputs.newFundEstimatedAssets,
      monthlyContribution: 0, // Not applicable in this context
      timeHorizon: newFundInputs.dayCountRemaining / 365,
      riskTolerance: 'Moderate' as const,
      additionalParameters: {
        inflationRate: 2.5,
        taxRate: 0,
        emergencyFund: 0,
      },
    };

    // Save the budget projection data
    const projectionData = {
      modelFundId: state.selectedModelFund!.id,
      initialInvestment: newFundInputs.newFundEstimatedAssets,
      monthlyContribution: 0, // Not applicable in this context
      timeHorizon: newFundInputs.dayCountRemaining / 365,
      expectedReturn: calculateTotalTER(),
      riskTolerance: 'Moderate' as const,
      projectedValue: newFundInputs.newFundEstimatedAssets * (1 + calculateTotalTER() / 100),
      totalContributions: newFundInputs.newFundEstimatedAssets,
      totalGrowth: newFundInputs.newFundEstimatedAssets * (calculateTotalTER() / 100),
    };

    dispatch({ type: 'SET_BUDGET_INPUTS', payload: budgetInputsData });
    dispatch({ type: 'SET_PROJECTION', payload: projectionData });
    navigate('/review');
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!state.selectedModelFund) {
    return null;
  }

  return (
    <div className="budget-projection">
      <div className="budget-projection__header">
        <h1>BNY - Draft of Budget Based on Model Fund Selected</h1>
        <p>Selected Model Fund: <strong>{state.selectedModelFund.name}</strong> ({state.selectedModelFund.fundNumber})</p>
      </div>

      <div className="budget-projection__content">
        {/* New Fund Input Fields */}
        <div className="new-fund-inputs">
          <h3>New Fund Parameters</h3>
          <div className="input-grid">
            <div className="input-group">
              <label htmlFor="new-fund-number">New Fund Number</label>
              <input
                id="new-fund-number"
                type="text"
                value={newFundInputs.newFundNumber}
                onChange={(e) => handleNewFundInputChange('newFundNumber', e.target.value)}
                placeholder="Enter new fund number"
              />
            </div>

            <div className="input-group">
              <label htmlFor="new-fund-assets">New Fund Estimated Assets</label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  id="new-fund-assets"
                  type="number"
                  value={newFundInputs.newFundEstimatedAssets}
                  onChange={(e) => handleNewFundInputChange('newFundEstimatedAssets', Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="new-fund-ccy">New Fund Base CCY</label>
              <select
                id="new-fund-ccy"
                value={newFundInputs.newFundBaseCCY}
                onChange={(e) => handleNewFundInputChange('newFundBaseCCY', e.target.value)}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="JPY">JPY</option>
                <option value="CAD">CAD</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="launch-date">Launch Date</label>
              <input
                id="launch-date"
                type="date"
                value={newFundInputs.launchDate}
                onChange={(e) => handleNewFundInputChange('launchDate', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="fye">FYE</label>
              <input
                id="fye"
                type="date"
                value={newFundInputs.fye}
                onChange={(e) => handleNewFundInputChange('fye', e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="day-count">Day Count Remaining</label>
              <input
                id="day-count"
                type="number"
                value={newFundInputs.dayCountRemaining}
                onChange={(e) => handleNewFundInputChange('dayCountRemaining', Number(e.target.value))}
                min={0}
                max={365}
              />
            </div>
          </div>
        </div>

        {/* Mutual Fund Prospectus Upload & AI Insight */}
        <div className="prospectus-upload-section">
          <h3>Mutual Fund Prospectus Upload & AI Insight</h3>
          <p className="section-description">
            Upload a mutual fund prospectus to get AI-powered insights on budget projections and expense analysis.
          </p>
          
          <div className="upload-container">
            <div className="file-upload-area">
              <input
                type="file"
                id="prospectus-upload"
                accept=".pdf"
                onChange={handleFileUpload}
                className="file-input"
              />
              <label htmlFor="prospectus-upload" className="file-upload-label">
                <div className="upload-icon">📄</div>
                <div className="upload-text">
                  <span className="upload-title">Upload Prospectus</span>
                  <span className="upload-subtitle">PDF files only, max 10MB</span>
                </div>
              </label>
            </div>
            
            {uploadedFile && (
              <div className="uploaded-file-info">
                <div className="file-details">
                  <span className="file-name">{uploadedFile.name}</span>
                  <span className="file-size">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="remove-file-btn"
                >
                  ✕
                </button>
              </div>
            )}
            
            {uploadError && (
              <div className="upload-error">
                <span className="error-icon">⚠️</span>
                <span className="error-message">{uploadError}</span>
              </div>
            )}
          </div>
          
          {isAnalyzing && (
            <div className="ai-analysis-loading">
              <div className="loading-spinner"></div>
              <div className="loading-text">
                <h4>AI Analysis in Progress</h4>
                <p>Analyzing prospectus for budget insights and expense breakdown...</p>
              </div>
            </div>
          )}
          
          {aiInsights && (
            <div className="ai-insights">
              <h4>AI-Generated Insights</h4>
              
              <div className="insight-section">
                <h5>📊 Budget Analysis</h5>
                <p className="insight-text">{aiInsights.budgetAnalysis}</p>
              </div>
              
              <div className="insight-section">
                <h5>💰 Expense Breakdown</h5>
                <div className="expense-breakdown">
                  {aiInsights.expenseBreakdown.split(' | ').map((item, index) => (
                    <div key={index} className="expense-item">
                      <span className="expense-label">{item.split(':')[0]}:</span>
                      <span className="expense-value">{item.split(':')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="insight-actions">
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setAiInsights(null)}
                >
                  Clear Insights
                </button>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => {
                    // Apply AI insights to the securities table
                    const updatedSecurities = securities.map(security => ({
                      ...security,
                      estimatedTER: security.estimatedTER + (Math.random() * 0.1 - 0.05), // Mock adjustment
                    }));
                    setSecurities(updatedSecurities);
                  }}
                >
                  Apply Insights to Table
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Trial Balance Data Section */}
        <div className="trial-balance-section">
          <h3>Trial Balance Data</h3>
          <p className="section-description">
            Trial balance data sourced from the server with calculated ANA, Annual Fee, and Rate fields.
          </p>
          
          {isLoadingTrialBalance && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading trial balance data...</p>
            </div>
          )}
          
          {trialBalanceError && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{trialBalanceError}</span>
              <button 
                onClick={loadTrialBalanceData}
                className="btn btn--secondary btn--small"
              >
                Retry
              </button>
            </div>
          )}
          
          {trialBalanceData && !isLoadingTrialBalance && (
            <div className="trial-balance-content">
              <div className="trial-balance-summary">
                <div className="summary-item">
                  <span className="summary-label">Total ANA:</span>
                  <span className="summary-value">${trialBalanceData.totalANA.toLocaleString()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Total Annual Fee:</span>
                  <span className="summary-value">${trialBalanceData.totalAnnualFee.toFixed(2)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Average Rate:</span>
                  <span className="summary-value">{(trialBalanceData.averageRate * 100).toFixed(4)}%</span>
                </div>
              </div>
              
              <div className="trial-balance-grid">
                <DataGrid
                  columns={trialBalanceColumns}
                  rows={trialBalanceData.entries}
                  onRowsChange={handleTrialBalanceRowsChange}
                  defaultColumnOptions={{
                    sortable: true,
                    resizable: true,
                  }}
                  className="rdg-light"
                  style={{ height: '300px' }}
                  headerRowHeight={50}
                  rowHeight={35}
                />
              </div>
              
              <div className="trial-balance-actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={loadTrialBalanceData}
                >
                  Refresh Data
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    // Export trial balance data
                    const exportData = {
                      timestamp: new Date().toISOString(),
                      modelFundId: state.selectedModelFund?.id,
                      trialBalanceData
                    };
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `trial-balance-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Securities Table */}
        <div className="securities-table-container">
          <h3>Budget Breakdown by Security</h3>
          
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading securities data...</p>
            </div>
          ) : (
            <div className="data-grid-wrapper">
              <DataGrid
                columns={columns}
                rows={securities}
                onRowsChange={handleRowsChange}
                defaultColumnOptions={{
                  sortable: true,
                  resizable: true,
                }}
                className="rdg-light"
                style={{ height: '400px' }}
                headerRowHeight={60}
                rowHeight={40}
              />
              
              <div className="table-summary">
                <div className="totals-row">
                  <strong>Total Estimated TER: {calculateTotalTER().toFixed(4)}</strong>
                </div>
                
                <div className="color-legend">
                  <h4>Color Legend:</h4>
                  <div className="legend-items">
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#e8f5e8' }}></div>
                      <span>Good/Optimal Range</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#fff3cd' }}></div>
                      <span>Moderate Range</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: '#f8d7da' }}></div>
                      <span>Attention Required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="budget-projection__actions">
        <button className="btn btn--secondary" onClick={handleBack}>
          Back to Fund Selection
        </button>
        <button
          className="btn btn--primary"
          onClick={handleContinue}
          disabled={isLoading || securities.length === 0}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default BudgetProjection;
