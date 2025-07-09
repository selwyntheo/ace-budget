import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import { sampleModelFunds, calculateAverageReturn, calculateAverageVolatility } from '../data/modelFunds';
import type { ModelFund } from '../types';
import './FundSelection.css';

const FundSelection: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  const [selectedFund, setSelectedFund] = useState<ModelFund | null>(state.selectedModelFund);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('name');

  const categories = ['All', ...new Set(sampleModelFunds.map(fund => fund.category))];

  const filteredFunds = sampleModelFunds.filter(fund => 
    filterCategory === 'All' || fund.category === filterCategory
  );

  const sortedFunds = [...filteredFunds].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'fundNumber':
        return a.fundNumber.localeCompare(b.fundNumber);
      case 'nav':
        return b.nav - a.nav;
      case 'return':
        return calculateAverageReturn(b) - calculateAverageReturn(a);
      case 'risk': {
        const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      }
      case 'fee':
        return a.managementFee - b.managementFee;
      case 'assets':
        return b.assetsAfterCapitalChange - a.assetsAfterCapitalChange;
      case 'units':
        return b.unitsOutstanding - a.unitsOutstanding;
      default:
        return 0;
    }
  });

  const handleFundSelect = (fund: ModelFund) => {
    setSelectedFund(fund);
  };

  const handleContinue = () => {
    if (selectedFund) {
      dispatch({ type: 'SELECT_MODEL_FUND', payload: selectedFund });
      navigate('/budget-projection');
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'High': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <div className="fund-selection">
      <div className="fund-selection__header">
        <h1>Select a Model Fund</h1>
        <p>Choose a model fund to project the budget for the new fund.</p>
      </div>

      <div className="fund-selection__controls">
        <div className="filter-group">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="sort-group">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Fund Name</option>
            <option value="fundNumber">Fund Number</option>
            <option value="nav">NAV</option>
            <option value="return">Average Return</option>
            <option value="risk">Risk Level</option>
            <option value="fee">Management Fee</option>
            <option value="assets">Assets After Capital Change</option>
            <option value="units">Units Outstanding</option>
          </select>
        </div>
      </div>

      <div className="fund-selection__list">
        {sortedFunds.map(fund => (
          <div
            key={fund.id}
            className={`fund-item ${selectedFund?.id === fund.id ? 'fund-item--selected' : ''}`}
            onClick={() => handleFundSelect(fund)}
          >
            <div className="fund-item__header">
              <div className="fund-item__title">
                <h3>{fund.name}</h3>
                <div className="fund-item__subtitle">
                  <span className="fund-number">{fund.fundNumber}</span>
                  <span className="fund-shareclass">{fund.fundShareclass}</span>
                </div>
              </div>
              <span 
                className="fund-item__risk-badge"
                style={{ backgroundColor: getRiskColor(fund.riskLevel) }}
              >
                {fund.riskLevel} Risk
              </span>
            </div>
            
            <p className="fund-item__description">{fund.description}</p>
            
            <div className="fund-item__details">
              <div className="fund-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Fund Number:</span>
                  <span className="detail-value">{fund.fundNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fund Name:</span>
                  <span className="detail-value">{fund.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fund Shareclass:</span>
                  <span className="detail-value">{fund.fundShareclass}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Units Outstanding:</span>
                  <span className="detail-value">{fund.unitsOutstanding.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Validation Period-End Date:</span>
                  <span className="detail-value">{new Date(fund.validationPeriodEndDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Shareholder Equity:</span>
                  <span className="detail-value">{fund.fundBaseCurrency} {fund.shareholderEquity.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Assets After Capital Change:</span>
                  <span className="detail-value">{fund.fundBaseCurrency} {fund.assetsAfterCapitalChange.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fiscal Year End:</span>
                  <span className="detail-value">{fund.fiscalYearEndMonth}/{fund.fiscalYearEndDay}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">NAV (8 Precision):</span>
                  <span className="detail-value detail-value--highlight">{fund.nav.toFixed(8)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Allocation Ratio (MCS OPT):</span>
                  <span className="detail-value">{(fund.allocationRatioMcsOpt * 100).toFixed(2)}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Fund Base Currency:</span>
                  <span className="detail-value">{fund.fundBaseCurrency}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{fund.category}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Avg. Return:</span>
                  <span className="detail-value">{calculateAverageReturn(fund).toFixed(1)}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Avg. Volatility:</span>
                  <span className="detail-value">{calculateAverageVolatility(fund).toFixed(1)}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Management Fee:</span>
                  <span className="detail-value">{fund.managementFee}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Min. Investment:</span>
                  <span className="detail-value">{fund.fundBaseCurrency} {fund.minimumInvestment.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="fund-item__performance">
              <h4>Recent Performance</h4>
              <div className="performance-chart">
                {fund.performanceHistory.slice(-3).map(data => (
                  <div key={data.year} className="performance-bar">
                    <span className="performance-bar__year">{data.year}</span>
                    <div className="performance-bar__container">
                      <div 
                        className={`performance-bar__fill ${data.return >= 0 ? 'positive' : 'negative'}`}
                        style={{ width: `${Math.min(Math.abs(data.return) * 2, 100)}%` }}
                      />
                      <span className="performance-bar__value">{data.return.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fund-selection__actions">
        <button
          className="btn btn--primary"
          onClick={handleContinue}
          disabled={!selectedFund}
        >
          Continue to Budget Projection
        </button>
      </div>
    </div>
  );
};

export default FundSelection;
