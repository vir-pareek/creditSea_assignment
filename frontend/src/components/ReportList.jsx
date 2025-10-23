import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // We need axios to make the PUT and DELETE requests

// This component receives the 'reports' and 'refreshReports' props
const ReportList = ({ reports, refreshReports }) => {

  const [editingId, setEditingId] = useState(null); 
  const [newName, setNewName] = useState('');
  
  const handleEditClick = (report) => {
    setEditingId(report._id);
    setNewName(report.displayName || ''); // This is our fix from before
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setNewName('');
  };

  const handleSaveClick = async (id) => {
    try {
      await axios.put(`https://creditsea-assignment-esto.onrender.com/api/reports/${id}`, { 
        displayName: newName 
      });
      
      setEditingId(null);
      setNewName('');

      if (refreshReports) {
        refreshReports();
      }
    } catch (err) {
      console.error('Error updating report name:', err);
    }
  };

  // --- ADD THIS NEW FUNCTION ---
  // This function runs when the user clicks "Delete"
  const handleDeleteClick = async (id) => {
    // MODERN PRACTICE: Always confirm a destructive action
    if (!window.confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
      return;
    }

    try {
      // 1. Send the delete request to our new endpoint
      await axios.delete(`https://creditsea-assignment-esto.onrender.com/api/reports/${id}`);
      
      // 2. Call the refresh function from the parent to get the updated list
      if (refreshReports) {
        refreshReports();
      }
    } catch (err) {
      console.error('Error deleting report:', err);
      // You could show an error message to the user here
    }
  };
  // -----------------------------

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Processed Reports</h2>
      
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports uploaded yet.</p>
      ) : (
        <ul className="space-y-3">
          {reports.map((report) => (
            <li 
              key={report._id} 
              className="border border-gray-200 rounded-lg p-4
                         flex justify-between items-center"
            >
              {editingId === report._id ? (
                // --- This is the EDITING view ---
                <div className="flex-grow flex items-center space-x-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-grow border border-blue-400 rounded-md px-3 py-2 text-sm"
                  />
                  <button
                    onClick={() => handleSaveClick(report._id)}
                    className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                // --- This is the NORMAL view ---
                <>
                  <div>
                    <span className="text-blue-600 font-semibold">
                      {report.displayName}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {report.fileName}
                    </div>
                  </div>
                  <div className="flex space-x-3 items-center">
                    <span className="text-sm text-gray-600">
                      {new Date(report.uploadedAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleEditClick(report)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    
                    {/* --- ADD THIS DELETE BUTTON --- */}
                    <button
                      onClick={() => handleDeleteClick(report._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                    {/* --------------------------- */}
                    
                    <Link 
                      to={`/report/${report._id}`} 
                      className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700"
                    >
                      View
                    </Link>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportList;