import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from 'react-data-grid';
import type { Column, RenderEditCellProps } from 'react-data-grid';
import { useAppContext } from '../context/useAppContext';
import { getSecurityDataForFund } from '../data/modelFunds';
import type { NewFundInputs, SecurityEntry } from '../types';
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
  }, [state.selectedModelFund, navigate]);

  const handleNewFundInputChange = (field: keyof NewFundInputs, value: string | number) => {
    setNewFundInputs(prev => ({ ...prev, [field]: value }));
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
