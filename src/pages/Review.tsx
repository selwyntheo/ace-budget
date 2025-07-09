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
        
        if (state.projection!.expectedReturn > 8) {
          recommendations.push("Your projected returns look strong based on the selected model fund.");
        }
        
        if (state.budgetInputs!.monthlyContribution > 1000) {
          recommendations.push("Your monthly contributions are substantial. Consider maximizing tax-advantaged accounts.");
        }
        
        if (state.budgetInputs!.timeHorizon > 15) {
          recommendations.push("With your long investment horizon, you can benefit from compound growth.");
        }
        
        if (state.budgetInputs!.riskTolerance === 'Conservative' && state.selectedModelFund!.riskLevel === 'High') {
          recommendations.push("Consider reviewing the risk alignment between your tolerance and selected fund.");
        }
        
        if (state.budgetInputs!.additionalParameters?.emergencyFund && state.budgetInputs!.additionalParameters.emergencyFund < state.budgetInputs!.monthlyContribution * 3) {
          recommendations.push("Consider building a larger emergency fund before increasing investments.");
        }
        
        return recommendations;
      };

      const generateWarnings = (): string[] => {
        const warnings: string[] = [];
        
        if (state.projection!.expectedReturn < 3) {
          warnings.push("Low expected returns may not keep pace with inflation. Consider adjusting your strategy.");
        }
        
        if (state.budgetInputs!.initialInvestment < state.selectedModelFund!.minimumInvestment * 2) {
          warnings.push("Your initial investment is close to the minimum. Consider starting with a larger amount if possible.");
        }
        
        if (state.budgetInputs!.additionalParameters?.taxRate && state.budgetInputs!.additionalParameters.taxRate > 30) {
          warnings.push("High tax rates significantly impact returns. Consider tax-efficient investment strategies.");
        }
        
        if (state.selectedModelFund!.riskLevel === 'High' && state.budgetInputs!.timeHorizon < 5) {
          warnings.push("High-risk investments may not be suitable for shorter time horizons.");
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
          <h2>Investment Parameters</h2>
          <div className="parameters-grid">
            <div className="parameter">
              <span className="parameter__label">Initial Investment:</span>
              <span className="parameter__value">${reviewSummary.budgetInputs.initialInvestment.toLocaleString()}</span>
            </div>
            <div className="parameter">
              <span className="parameter__label">Monthly Contribution:</span>
              <span className="parameter__value">${reviewSummary.budgetInputs.monthlyContribution.toLocaleString()}</span>
            </div>
            <div className="parameter">
              <span className="parameter__label">Time Horizon:</span>
              <span className="parameter__value">{reviewSummary.budgetInputs.timeHorizon} years</span>
            </div>
            <div className="parameter">
              <span className="parameter__label">Risk Tolerance:</span>
              <span className="parameter__value">{reviewSummary.budgetInputs.riskTolerance}</span>
            </div>
            <div className="parameter">
              <span className="parameter__label">Inflation Rate:</span>
              <span className="parameter__value">{reviewSummary.budgetInputs.additionalParameters?.inflationRate}%</span>
            </div>
            <div className="parameter">
              <span className="parameter__label">Tax Rate:</span>
              <span className="parameter__value">{reviewSummary.budgetInputs.additionalParameters?.taxRate}%</span>
            </div>
          </div>
        </div>

        <div className="review__section">
          <h2>Projection Results</h2>
          <div className="projection-results">
            <div className="result-card result-card--primary">
              <h3>Projected Value</h3>
              <div className="result-value">
                ${reviewSummary.projection.projectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="result-card">
              <h3>Total Contributions</h3>
              <div className="result-value">
                ${reviewSummary.projection.totalContributions.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="result-card">
              <h3>Total Growth</h3>
              <div className="result-value">
                ${reviewSummary.projection.totalGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="result-card">
              <h3>Expected Return</h3>
              <div className="result-value">
                {reviewSummary.projection.expectedReturn.toFixed(1)}%
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
            This projection is based on historical data and assumptions. Past performance does not guarantee future results. 
            Investment values may fluctuate and you may receive back less than you invested. Please consult with a qualified 
            financial advisor before making investment decisions.
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
