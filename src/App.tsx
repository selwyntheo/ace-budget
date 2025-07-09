import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import FundSelection from './pages/FundSelection';
import BudgetProjection from './pages/BudgetProjectionNew';
import Review from './pages/Review';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<FundSelection />} />
              <Route path="/budget-projection" element={<BudgetProjection />} />
              <Route path="/review" element={<Review />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
