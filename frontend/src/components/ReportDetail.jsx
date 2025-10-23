import React from 'react';

/**
 * MODERN PRACTICE: Reusable Helper Components
 * We create a small, simple component right inside this file.
 * Its only job is to be a styled "box" for a key/value pair.
 * This keeps our main JSX clean and easy to read.
 */
const DetailItem = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
    <strong className="block text-sm font-medium text-gray-500 uppercase">
      {label}
    </strong>
    <span className="text-xl font-semibold text-blue-800">
      {/* Show 'N/A' if the value is missing or 0 */}
      {value ?? 'N/A'} 
    </span>
  </div>
);

/**
 * MODERN PRACTICE: Helper Functions
 * We define a small helper to format numbers into Indian Rupees.
 * This keeps formatting logic out of our JSX.
 */
const formatCurrency = (num) => {
  if (typeof num !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

// This component receives the full 'report' object as a prop
const ReportDetail = ({ report }) => {
  // We destructure the properties from the report for easier access
  const { basicDetails, reportSummary, accounts, fileName } = report;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 space-y-8">
      
      {/* --- Main Header --- */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Credit Report for: {basicDetails.name}
        </h2>
        <p className="text-gray-500 mt-1">
          Original file: {fileName}
        </p>
      </div>

      {/* --- Section 1: Basic Details [cite: 15-19] --- */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
          Basic Details
        </h3>
        {/* MODERN PRACTICE: Tailwind Grid
          'grid' is a powerful modern layout tool.
          'grid-cols-2 lg:grid-cols-4' makes it responsive:
          - 2 columns on small screens
          - 4 columns on large screens ('lg:')
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DetailItem label="Name" value={basicDetails.name} />
          <DetailItem label="Mobile Phone" value={basicDetails.mobilePhone} />
          <DetailItem label="PAN" value={basicDetails.pan} />
          <DetailItem label="Credit Score" value={basicDetails.creditScore} />
        </div>
      </section>

      {/* --- Section 2: Report Summary [cite: 20-28] --- */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
          Report Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <DetailItem label="Total Accounts" value={reportSummary.totalAccounts} />
          <DetailItem label="Active Accounts" value={reportSummary.activeAccounts} />
          <DetailItem label="Closed Accounts" value={reportSummary.closedAccounts} />
          <DetailItem 
            label="Total Current Balance" 
            value={formatCurrency(reportSummary.currentBalance)} 
          />
          <DetailItem 
            label="Secured Balance" 
            value={formatCurrency(reportSummary.securedBalance)} 
          />
          <DetailItem 
            label="Unsecured Balance" 
            value={formatCurrency(reportSummary.unsecuredBalance)} 
          />
          <DetailItem 
            label="Enquiries (7 Days)" 
            value={reportSummary.enquiriesLast7Days} 
          />
        </div>
      </section>
      
      {/* --- Section 3: Credit Accounts [cite: 29-35] --- */}
      <section>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
          Credit Accounts Information
        </h3>
        {/* This wrapper makes the table scroll horizontally on small screens */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* We use 'px-6 py-3' for Tailwind-powered table cell padding */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Balance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Overdue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.length > 0 ? (
                accounts.map((acc, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{acc.bankName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{acc.accountNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{acc.accountType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(acc.currentBalance)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">{formatCurrency(acc.amountOverdue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{acc.address}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No account information available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ReportDetail;