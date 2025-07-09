import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { calculateAverageReturn, calculateAverageVolatility } from '../data/modelFunds';
import type { ReviewSummary } from '../types';
import './Review.css';

const Review: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [reviewSummary, setReviewSummary] = useState<ReviewSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Redirect if required data is missing
    if (!state.selectedModelFund || !state.budgetInputs || !state.projection) {
      navigate('/');
      return;
    }

    // Generate review summary
    setIsGenerating(true);
    
    setTimeout(() => {
      const generateRecommendations = (): string[] => {
        const recommendations: string[] = [];
        const ter = state.projection!.expectedReturn;
        
        if (ter < 1.0) {
          recommendations.push("The Total Expense Ratio is relatively low, which may provide cost-effective fund management.");
        }
        
        if (state.budgetInputs!.initialInvestment > 10000000) {
          recommendations.push("With substantial estimated assets, consider implementing enhanced risk monitoring and diversification strategies.");
        }
        
        if (state.budgetInputs!.timeHorizon > 1) {
          recommendations.push("With a longer time horizon, the fund can benefit from strategic asset allocation and rebalancing.");
        }
        
        if (state.selectedModelFund!.riskLevel === 'Low') {
          recommendations.push("The selected model fund has a conservative risk profile, suitable for stable returns.");
        }
        
        if (state.selectedModelFund!.managementFee < 1.0) {
          recommendations.push("The model fund has competitive management fees, which should support overall fund performance.");
        }
        
        return recommendations;
      };

      const generateWarnings = (): string[] => {
        const warnings: string[] = [];
        const ter = state.projection!.expectedReturn;
        
        if (ter > 2.0) {
          warnings.push("The Total Expense Ratio is relatively high. Consider reviewing the fee structure and cost efficiency.");
        }
        
        if (state.budgetInputs!.initialInvestment < state.selectedModelFund!.minimumInvestment * 1.5) {
          warnings.push("Estimated assets are close to the minimum investment threshold. Consider increasing the initial funding.");
        }
        
        if (state.budgetInputs!.timeHorizon < 0.25) {
          warnings.push("Very short time horizon may limit the fund's ability to implement optimal investment strategies.");
        }
        
        if (state.selectedModelFund!.riskLevel === 'High' && state.budgetInputs!.timeHorizon < 1) {
          warnings.push("High-risk model fund may not be suitable for short-term investment horizons.");
        }
        
        if (state.selectedModelFund!.managementFee > 2.0) {
          warnings.push("High management fees may impact overall fund performance. Consider fee optimization strategies.");
        }
        
        return warnings;
      };

      const summary: ReviewSummary = {
        selectedModelFund: state.selectedModelFund!,
        budgetInputs: state.budgetInputs!,
        projection: state.projection!,
        recommendations: generateRecommendations(),
        warnings: generateWarnings(),
      };

      setReviewSummary(summary);
      dispatch({ type: 'SET_REVIEW_SUMMARY', payload: summary });
      setIsGenerating(false);
    }, 1500);
  }, [state.selectedModelFund, state.budgetInputs, state.projection, navigate, dispatch]);

  const handleStartOver = () => {
    dispatch({ type: 'RESET_STATE' });
    navigate('/');
  };

  const handleExport = () => {
    if (!reviewSummary) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      selectedFund: reviewSummary.selectedModelFund,
      inputs: reviewSummary.budgetInputs,
      projection: reviewSummary.projection,
      recommendations: reviewSummary.recommendations,
      warnings: reviewSummary.warnings,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget-projection-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleModifyProjection = () => {
    navigate('/budget-projection');
  };

  if (isGenerating) {
    return (
      <div className="review">
        <div className="review__loading">
          <div className="loading-spinner"></div>
          <h2>Generating Review Summary...</h2>
          <p>Please wait while we analyze your investment projection.</p>
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
        <h1>Investment Review Summary</h1>
        <p>Review your investment projection and recommendations before finalizing your decision.</p>
      </div>

      <div className="review__content">
        <div className="review__section">
          <h2>Selected Model Fund</h2>
          <div className="fund-summary">
            <div className="fund-summary__header">
              <h3>{reviewSummary.selectedModelFund.name}</h3>
              <span 
                className="risk-badge"
                style={{ backgroundColor: reviewSummary.selectedModelFund.riskLevel === 'Low' ? '#4CAF50' : reviewSummary.selectedModelFund.riskLevel === 'Medium' ? '#FF9800' : '#F44336' }}
              >
                {reviewSummary.selectedModelFund.riskLevel} Risk
              </span>
            </div>
            <p className="fund-summary__description">
              {reviewSummary.selectedModelFund.description}
            </p>
            <div className="fund-summary__stats">
              <div className="stat">
                <span className="stat__label">Average Return:</span>
                <span className="stat__value">{calculateAverageReturn(reviewSummary.selectedModelFund).toFixed(1)}%</span>
              </div>
              <div className="stat">
                <span className="stat__label">Average Volatility:</span>
                <span className="stat__value">{calculateAverageVolatility(reviewSummary.selectedModelFund).toFixed(1)}%</span>
              </div>
              <div className="stat">
                <span className="stat__label">Management Fee:</span>
                <span className="stat__value">{reviewSummary.selectedModelFund.managementFee}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="review__section">
          <h2>New Fund Parameters</h2>
          <div className="parameters-grid">
            <div className="parameter">
              <span className="parameter__label">Estimated Assets:</span>
              <span className="parameter__value">${reviewSummary.budgetInputs.initialInvestment.toLocaleString()}</span>
            </div>
            <div className="parameter">
              <span className="parameter__label">Time Horizon:</span>
              <span className="parameter__value">{Math.round(reviewSummary.budgetInputs.timeHorizon * 365)} days</span>
            </div>
            <div className="parameter">
              <span className="parameter__label">Risk Assessment:</span>
              <span className="parameter__value">{reviewSummary.budgetInputs.riskTolerance}</span>
            </div>
            <div className="parameter">
              <span className="parameter__label">Model Fund TER:</span>
              <span className="parameter__value">{reviewSummary.projection.expectedReturn.toFixed(4)}%</span>
            </div>
          </div>
        </div>

        <div className="review__section">
          <h2>Budget Projection Results</h2>
          <div className="projection-results">
            <div className="result-card result-card--primary">
              <h3>Estimated Fund Value</h3>
              <div className="result-value">
                ${reviewSummary.projection.projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="result-card">
              <h3>Initial Assets</h3>
              <div className="result-value">
                ${reviewSummary.projection.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="result-card">
              <h3>Estimated TER Impact</h3>
              <div className="result-value">
                ${reviewSummary.projection.totalGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="result-card">
              <h3>Total Expense Ratio</h3>
              <div className="result-value">
                {reviewSummary.projection.expectedReturn.toFixed(4)}%
              </div>
            </div>
          </div>
        </div>

        {reviewSummary.recommendations.length > 0 && (
          <div className="review__section">
            <h2>Recommendations</h2>
            <div className="recommendations">
              {reviewSummary.recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation">
                  <div className="recommendation__icon">✓</div>
                  <div className="recommendation__text">{recommendation}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reviewSummary.warnings.length > 0 && (
          <div className="review__section">
            <h2>Important Considerations</h2>
            <div className="warnings">
              {reviewSummary.warnings.map((warning, index) => (
                <div key={index} className="warning">
                  <div className="warning__icon">⚠</div>
                  <div className="warning__text">{warning}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="review__disclaimer">
          <h3>Important Disclaimer</h3>
          <p>
            This budget projection is based on model fund data and assumptions about fee structures and market conditions. 
            Actual results may vary significantly due to market volatility, changes in fee structures, regulatory changes, 
            and other factors. This analysis is for informational purposes only and should not be considered as investment 
            advice. Please consult with qualified financial professionals before making fund management decisions.
          </p>
        </div>
      </div>

      <div className="review__actions">
        <button className="btn btn--secondary" onClick={handleStartOver}>
          Start Over
        </button>
        <button className="btn btn--outline" onClick={handleModifyProjection}>
          Modify Projection
        </button>
        <button className="btn btn--primary" onClick={handleExport}>
          Export Summary
        </button>
      </div>
    </div>
  );
};

export default Review;
