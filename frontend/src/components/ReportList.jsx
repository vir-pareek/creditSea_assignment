import React from 'react';
import { Link } from 'react-router-dom'; // We use 'Link' for client-side routing

// This component receives the 'reports' array as a prop
const ReportList = ({ reports }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Processed Reports</h2>
      
      {/* MODERN PRACTICE: Conditional Rendering */}
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports uploaded yet.</p>
      ) : (
        <ul className="space-y-3">
          {/* MODERN PRACTICE: Mapping an Array to JSX */}
          {reports.map((report) => (
            <li 
              key={report._id} 
              className="border border-gray-200 rounded-lg p-4
                         flex justify-between items-center
                         hover:bg-gray-50"
            >
              <div>
                <Link 
                  to={`/report/${report._id}`} 
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {/* We use '||' as a fallback in case the name is missing */}
                  {report.basicDetails?.name || 'Unknown Report'}
                </Link>
                <div className="text-sm text-gray-500 mt-1">
                  {report.fileName}
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {/* We format the date into a more readable string.
                    This is a built-in JavaScript feature.
                */}
                {new Date(report.uploadedAt).toLocaleString()}
              </span>
              {/* The extra </Link> tag that was here is now removed. */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportList;