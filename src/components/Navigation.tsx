import React from 'react';
import { useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const getStepNumber = (pathname: string): number => {
    switch (pathname) {
      case '/':
        return 1;
      case '/budget-projection':
        return 2;
      case '/review':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = getStepNumber(location.pathname);

  const steps = [
    { number: 1, title: 'Select Fund', path: '/' },
    { number: 2, title: 'Budget Projection', path: '/budget-projection' },
    { number: 3, title: 'Review', path: '/review' },
  ];

  return (
    <nav className="navigation">
      <div className="navigation__container">
        <div className="navigation__brand">
          <h1>ACE Budget</h1>
          <span>Fund Creation Tool</span>
        </div>
        
        <div className="navigation__steps">
          {steps.map((step, index) => (
            <div key={step.number} className="step-container">
              <div className={`step ${currentStep >= step.number ? 'step--active' : ''} ${currentStep > step.number ? 'step--completed' : ''}`}>
                <div className="step__number">
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <div className="step__title">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${currentStep > step.number ? 'step-connector--completed' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
