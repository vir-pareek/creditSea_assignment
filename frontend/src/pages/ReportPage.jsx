import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import the 'useParams' Hook
import axios from 'axios';
import ReportDetail from '../components/ReportDetail'; // We'll create this next

const API_URL = 'https://creditsea-assignment-esto.onrender.com/api';

const ReportPage = () => {
  /**
   * MODERN PRACTICE: React Hooks (useParams)
   * This Hook from 'react-router-dom' reads the dynamic parts
   * from the URL. In our 'App.jsx', we defined the route as
   * "/report/:id". 'useParams' gives us access to that 'id' part.
   */
  const { id } = useParams(); // 'id' will be the report's _id from MongoDB

  // We use state to store the report, loading status, and any errors
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * MODERN PRACTICE: React Hooks (useEffect with dependencies)
   * We use 'useEffect' to fetch data when the component loads.
   * Notice the '[id]' at the end. This is a "dependency array".
   * It tells React to re-run this function *only* if the 'id'
   * variable changes. This is crucial if a user navigates from
   * one report directly to another.
   */
  useEffect(() => {
    // We define an async function *inside* useEffect
    const fetchReport = async () => {
      try {
        setLoading(true); // Start loading
        setError('');
        const res = await axios.get(`${API_URL}/reports/${id}`);
        setReport(res.data); // Set the fetched report data
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to fetch report data.');
      }
      setLoading(false); // We're done loading
    };

    fetchReport(); // Call the function
  }, [id]); // The dependency array

  /**
   * MODERN PRACTICE: Conditional Rendering
   * This is a clean way to handle loading and error states
   * *before* attempting to render the main component.
   */
  if (loading) {
    return <div className="text-center p-10">Loading report...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg">
        {error}
      </div>
    );
  }

  // If not loading and no error, render the detail component
  // and pass the 'report' data down as a prop.
  return (
    <ReportDetail report={report} />
  );
};

export default ReportPage;