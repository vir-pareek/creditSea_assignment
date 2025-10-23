const mongoose = require('mongoose');

// This schema is designed to directly match the reporting requirements
// from the PDF 
const creditReportSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },

  // Section 1: Basic Details
  basicDetails: {
    name: String,
    mobilePhone: String,
    pan: String,
    creditScore: Number,
  },

  // Section 2: Report Summary
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalance: Number,     // This is Outstanding_Balance_All
    securedBalance: Number,     // Outstanding_Balance_Secured
    unsecuredBalance: Number,   // Outstanding_Balance_UnSecured
    enquiriesLast7Days: Number, // TotalCAPSLast7Days
  },

  // Section 3: Credit Accounts Information 
  // This will be an array of all accounts found in the report
  accounts: [
    {
      bankName: String,         // Subscriber_Name
      accountNumber: String,    // Account_Number
      accountType: String,      // Account_Type (e.g., '10' for Credit Card)
      currentBalance: Number,   // Current_Balance
      amountOverdue: Number,    // Amount_Past_Due
      address: String,          // Combined address from CAIS_Holder_Address_Details
    },
  ],
});

module.exports = mongoose.model('CreditReport', creditReportSchema);