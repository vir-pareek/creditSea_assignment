import React, { useState, useEffect } from 'react';
import axios from 'axios'; // We'll use axios to talk to our backend
import FileUpload from '../components/FileUpload'; // We'll create this next
import ReportList from '../components/ReportList'; // And this one

// A modern practice is to store API URLs in a constant
const API_URL = 'https://creditsea-assignment-esto.onrender.com';

const HomePage = () => {
  /**
   * MODERN PRACTICE: React Hooks (useState)
   * 'useState' is a Hook that lets you add state to functional components.
   * 'reports' is our state variable (it will hold our list of reports).
   * 'setReports' is the *only* function we use to update it.
   * We initialize it with an empty array: []
   */
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /**
   * MODERN PRACTICE: React Hooks (useEffect)
   * 'useEffect' is a Hook for "side effects" - things that happen
   * outside of just rendering, like fetching data.
   * The '[]' at the end means "run this function only once,
   * when the component first loads."
   */
  useEffect(() => {
    fetchReports();
  }, []);

  // This is an async function to fetch data from our backend
  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_URL}/reports`);
      setReports(res.data); // Update our state with the fetched reports
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to fetch reports.');
    }
  };

  /**
   * MODERN PRACTICE: Callback Functions
   * We pass these functions as props to the 'FileUpload' component.
   * This lets the child component (FileUpload) communicate
   * back up to its parent (HomePage).
   */
  const onUploadSuccess = (newMessage) => {
    setMessage(newMessage);
    setError('');
    fetchReports(); // Refresh the list after a successful upload!
    // Clear the success message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const onUploadError = (errorMessage) => {
    setError(errorMessage);
    setMessage('');
    // Clear the error message after 3 seconds
    setTimeout(() => setError(''), 3000);
  };

  return (
    <div className="space-y-8">
      {/* This is a "controlled component" pattern.
        The 'FileUpload' component doesn't manage its own
        success/error state. It just calls the functions
        we pass to it (onUploadSuccess / onUploadError).
      */}
      <FileUpload 
        onUploadSuccess={onUploadSuccess} 
        onUploadError={onUploadError} 
        apiUrl={API_URL}
      />
      
      {/* Conditional Rendering: Only show the message if it exists */}
      {message && (
        <div className="p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Prop Drilling: We "drill" the 'reports' state down
        into the 'ReportList' component as a prop.
      */}
      <ReportList reports={reports} refreshReports={fetchReports} />
    </div>
  );
};

export default HomePage;