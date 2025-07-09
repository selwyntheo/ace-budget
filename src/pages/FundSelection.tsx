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
      case 'return':
        return calculateAverageReturn(b) - calculateAverageReturn(a);
      case 'risk': {
        const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      }
      case 'fee':
        return a.managementFee - b.managementFee;
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
        <p>Choose a model fund that aligns with your investment goals and risk tolerance.</p>
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
            <option value="name">Name</option>
            <option value="return">Average Return</option>
            <option value="risk">Risk Level</option>
            <option value="fee">Management Fee</option>
          </select>
        </div>
      </div>

      <div className="fund-selection__grid">
        {sortedFunds.map(fund => (
          <div
            key={fund.id}
            className={`fund-card ${selectedFund?.id === fund.id ? 'fund-card--selected' : ''}`}
            onClick={() => handleFundSelect(fund)}
          >
            <div className="fund-card__header">
              <h3>{fund.name}</h3>
              <span 
                className="fund-card__risk-badge"
                style={{ backgroundColor: getRiskColor(fund.riskLevel) }}
              >
                {fund.riskLevel} Risk
              </span>
            </div>
            
            <p className="fund-card__description">{fund.description}</p>
            
            <div className="fund-card__stats">
              <div className="stat">
                <span className="stat__label">Category:</span>
                <span className="stat__value">{fund.category}</span>
              </div>
              <div className="stat">
                <span className="stat__label">Avg. Return:</span>
                <span className="stat__value">{calculateAverageReturn(fund).toFixed(1)}%</span>
              </div>
              <div className="stat">
                <span className="stat__label">Avg. Volatility:</span>
                <span className="stat__value">{calculateAverageVolatility(fund).toFixed(1)}%</span>
              </div>
              <div className="stat">
                <span className="stat__label">Management Fee:</span>
                <span className="stat__value">{fund.managementFee}%</span>
              </div>
              <div className="stat">
                <span className="stat__label">Min. Investment:</span>
                <span className="stat__value">${fund.minimumInvestment.toLocaleString()}</span>
              </div>
            </div>

            <div className="fund-card__performance">
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
