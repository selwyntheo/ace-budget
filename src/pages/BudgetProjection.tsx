import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { calculateAverageReturn } from '../data/modelFunds';
import type { BudgetInputs, BudgetProjectionData } from '../types';
import './BudgetProjection.css';

const BudgetProjection: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [inputs, setInputs] = useState<BudgetInputs>({
    initialInvestment: 5000,
    monthlyContribution: 500,
    timeHorizon: 10,
    riskTolerance: 'Moderate',
    additionalParameters: {
      inflationRate: 2.5,
      taxRate: 22,
      emergencyFund: 5000,
    },
  });
  const [projection, setProjection] = useState<BudgetProjectionData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Redirect if no model fund is selected
  useEffect(() => {
    if (!state.selectedModelFund) {
      navigate('/');
    }
  }, [state.selectedModelFund, navigate]);

  const calculateProjection = useCallback(() => {
    if (!state.selectedModelFund) return;

    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      const baseReturn = calculateAverageReturn(state.selectedModelFund!);
      
      // Adjust return based on risk tolerance
      let adjustedReturn = baseReturn;
      switch (inputs.riskTolerance) {
        case 'Conservative':
          adjustedReturn = baseReturn * 0.7;
          break;
        case 'Moderate':
          adjustedReturn = baseReturn * 0.85;
          break;
        case 'Aggressive':
          adjustedReturn = baseReturn * 1.1;
          break;
      }

      // Account for inflation and taxes
      const realReturn = adjustedReturn - (inputs.additionalParameters?.inflationRate || 0);
      const afterTaxReturn = realReturn * (1 - (inputs.additionalParameters?.taxRate || 0) / 100);
      
      // Calculate compound growth
      const monthlyReturn = afterTaxReturn / 100 / 12;
      const totalMonths = inputs.timeHorizon * 12;
      
      // Future value of initial investment
      const futureValueInitial = inputs.initialInvestment * Math.pow(1 + monthlyReturn, totalMonths);
      
      // Future value of monthly contributions (annuity)
      const futureValueContributions = inputs.monthlyContribution * 
        ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
      
      const projectedValue = futureValueInitial + futureValueContributions;
      const totalContributions = inputs.initialInvestment + (inputs.monthlyContribution * totalMonths);
      const totalGrowth = projectedValue - totalContributions;

      const newProjection: BudgetProjectionData = {
        modelFundId: state.selectedModelFund!.id,
        initialInvestment: inputs.initialInvestment,
        monthlyContribution: inputs.monthlyContribution,
        timeHorizon: inputs.timeHorizon,
        expectedReturn: afterTaxReturn,
        riskTolerance: inputs.riskTolerance,
        projectedValue: Math.max(projectedValue, totalContributions), // Ensure no negative growth
        totalContributions,
        totalGrowth: Math.max(totalGrowth, 0),
      };

      setProjection(newProjection);
      setIsCalculating(false);
    }, 1000);
  }, [state.selectedModelFund, inputs]);

  useEffect(() => {
    calculateProjection();
  }, [inputs, state.selectedModelFund, calculateProjection]);

  const handleInputChange = (field: keyof BudgetInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleAdditionalParameterChange = (field: string, value: number) => {
    setInputs(prev => ({
      ...prev,
      additionalParameters: {
        inflationRate: 2.5,
        taxRate: 22,
        emergencyFund: 5000,
        ...prev.additionalParameters,
        [field]: value,
      },
    }));
  };

  const handleContinue = () => {
    if (projection) {
      dispatch({ type: 'SET_BUDGET_INPUTS', payload: inputs });
      dispatch({ type: 'SET_PROJECTION', payload: projection });
      navigate('/review');
    }
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
        <h1>Budget Projection</h1>
        <p>Configure your investment parameters based on the selected model fund: <strong>{state.selectedModelFund.name}</strong></p>
      </div>

      <div className="budget-projection__content">
        <div className="budget-projection__inputs">
          <div className="input-section">
            <h3>Investment Parameters</h3>
            
            <div className="input-group">
              <label htmlFor="initial-investment">Initial Investment</label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  id="initial-investment"
                  type="number"
                  value={inputs.initialInvestment}
                  onChange={(e) => handleInputChange('initialInvestment', Number(e.target.value))}
                  min={state.selectedModelFund.minimumInvestment}
                />
              </div>
              <small>Minimum: ${state.selectedModelFund.minimumInvestment.toLocaleString()}</small>
            </div>

            <div className="input-group">
              <label htmlFor="monthly-contribution">Monthly Contribution</label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  id="monthly-contribution"
                  type="number"
                  value={inputs.monthlyContribution}
                  onChange={(e) => handleInputChange('monthlyContribution', Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="time-horizon">Investment Time Horizon</label>
              <div className="input-with-suffix">
                <input
                  id="time-horizon"
                  type="number"
                  value={inputs.timeHorizon}
                  onChange={(e) => handleInputChange('timeHorizon', Number(e.target.value))}
                  min={1}
                  max={50}
                />
                <span className="input-suffix">years</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="risk-tolerance">Risk Tolerance</label>
              <select
                id="risk-tolerance"
                value={inputs.riskTolerance}
                onChange={(e) => handleInputChange('riskTolerance', e.target.value as BudgetInputs['riskTolerance'])}
              >
                <option value="Conservative">Conservative</option>
                <option value="Moderate">Moderate</option>
                <option value="Aggressive">Aggressive</option>
              </select>
            </div>
          </div>

          <div className="input-section">
            <h3>Additional Parameters</h3>
            
            <div className="input-group">
              <label htmlFor="inflation-rate">Expected Inflation Rate</label>
              <div className="input-with-suffix">
                <input
                  id="inflation-rate"
                  type="number"
                  step="0.1"
                  value={inputs.additionalParameters?.inflationRate || 2.5}
                  onChange={(e) => handleAdditionalParameterChange('inflationRate', Number(e.target.value))}
                  min={0}
                  max={10}
                />
                <span className="input-suffix">%</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="tax-rate">Tax Rate</label>
              <div className="input-with-suffix">
                <input
                  id="tax-rate"
                  type="number"
                  value={inputs.additionalParameters?.taxRate || 22}
                  onChange={(e) => handleAdditionalParameterChange('taxRate', Number(e.target.value))}
                  min={0}
                  max={50}
                />
                <span className="input-suffix">%</span>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="emergency-fund">Emergency Fund</label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  id="emergency-fund"
                  type="number"
                  value={inputs.additionalParameters?.emergencyFund || 5000}
                  onChange={(e) => handleAdditionalParameterChange('emergencyFund', Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="budget-projection__results">
          <div className="results-card">
            <h3>Projection Results</h3>
            
            {isCalculating ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                <p>Calculating projection...</p>
              </div>
            ) : projection ? (
              <div className="projection-summary">
                <div className="projection-metric">
                  <span className="metric-label">Projected Value</span>
                  <span className="metric-value metric-value--primary">
                    ${projection.projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                
                <div className="projection-metric">
                  <span className="metric-label">Total Contributions</span>
                  <span className="metric-value">
                    ${projection.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                
                <div className="projection-metric">
                  <span className="metric-label">Total Growth</span>
                  <span className="metric-value metric-value--growth">
                    ${projection.totalGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                
                <div className="projection-metric">
                  <span className="metric-label">Expected Annual Return</span>
                  <span className="metric-value">
                    {projection.expectedReturn.toFixed(1)}%
                  </span>
                </div>

                <div className="projection-breakdown">
                  <h4>Investment Breakdown</h4>
                  <div className="breakdown-chart">
                    <div className="breakdown-item">
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-bar__fill breakdown-bar__fill--contributions"
                          style={{ width: `${(projection.totalContributions / projection.projectedValue) * 100}%` }}
                        ></div>
                        <div 
                          className="breakdown-bar__fill breakdown-bar__fill--growth"
                          style={{ width: `${(projection.totalGrowth / projection.projectedValue) * 100}%` }}
                        ></div>
                      </div>
                      <div className="breakdown-legend">
                        <div className="legend-item">
                          <span className="legend-color legend-color--contributions"></span>
                          <span>Contributions ({((projection.totalContributions / projection.projectedValue) * 100).toFixed(1)}%)</span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-color legend-color--growth"></span>
                          <span>Growth ({((projection.totalGrowth / projection.projectedValue) * 100).toFixed(1)}%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="budget-projection__actions">
        <button className="btn btn--secondary" onClick={handleBack}>
          Back to Fund Selection
        </button>
        <button
          className="btn btn--primary"
          onClick={handleContinue}
          disabled={!projection || isCalculating}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default BudgetProjection;
