import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage'; // We'll create this
import ReportPage from './pages/ReportPage'; // We'll create this

function App() {
  return (
    <Router>
      {/* Here's our first use of Tailwind!
        - 'max-w-5xl': Sets a max-width for the content (keeps it from looking too wide)
        - 'mx-auto': Sets the left/right margin to 'auto', which centers the container
        - 'p-4 sm:p-6 lg:p-8': Applies padding. It's responsive! 
          'p-4' (small padding) on mobile, 
          'sm:p-6' (medium padding) on small screens, 
          'lg:p-8' (large padding) on large screens.
      */}
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="py-6 border-b border-gray-200 mb-8">
          {/*
            - 'text-3xl': Makes the font size large (3xl)
            - 'font-bold': Makes the text bold
            - 'text-blue-800': Sets the text color to a specific shade of blue
            - 'hover:text-blue-600': A modern state variant! On hover, change the color.
            - 'no-underline': Removes the default link underline.
          */}
          <Link to="/" className="text-3xl font-bold text-blue-800 hover:text-blue-600 no-underline">
            <h1>CreditSea Report Viewer</h1>
          </Link>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report/:id" element={<ReportPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;