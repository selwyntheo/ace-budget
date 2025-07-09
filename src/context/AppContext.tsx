import React, { createContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppState, ModelFund, BudgetInputs, BudgetProjectionData, ReviewSummary } from '../types';

// Action types
type AppAction =
  | { type: 'SELECT_MODEL_FUND'; payload: ModelFund }
  | { type: 'SET_BUDGET_INPUTS'; payload: BudgetInputs }
  | { type: 'SET_PROJECTION'; payload: BudgetProjectionData }
  | { type: 'SET_REVIEW_SUMMARY'; payload: ReviewSummary }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  selectedModelFund: null,
  budgetInputs: null,
  projection: null,
  reviewSummary: null,
};

// Context
export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SELECT_MODEL_FUND':
      return { ...state, selectedModelFund: action.payload };
    case 'SET_BUDGET_INPUTS':
      return { ...state, budgetInputs: action.payload };
    case 'SET_PROJECTION':
      return { ...state, projection: action.payload };
    case 'SET_REVIEW_SUMMARY':
      return { ...state, reviewSummary: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
