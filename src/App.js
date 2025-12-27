import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CheckEligibility from './pages/CheckEligibility';
import BorrowLoans from './pages/BorrowLoans';
import SecureLoans from './pages/SecureLoans'; // New import

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/check-eligibility" element={<CheckEligibility />} />
          <Route path="/borrow-loans" element={<BorrowLoans />} />
          <Route path="/secure-loans" element={<SecureLoans />} /> {/* New route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;