const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false }); // Makes parsing easier

// Helper function to safely get nested properties
// This prevents "Cannot read property '...' of undefined" errors
const get = (obj, path, defaultValue = null) => {
  const result = path
    .split('.')
    .reduce((acc, key) => (acc && acc[key] ? acc[key] : undefined), obj);
  // Return the result if it's not undefined or null, otherwise return the default
  return result !== undefined && result !== null ? result : defaultValue;
};

// Main parsing function
async function parseXMLReport(xmlBuffer) {
  try {
    const rawJson = await parser.parseStringPromise(xmlBuffer.toString());
    
    // Check for the main response object
    if (!rawJson.INProfileResponse) {
      throw new Error("Invalid XML structure: INProfileResponse not found.");
    }
    
    const report = rawJson.INProfileResponse;

    // --- 1. Basic Details [cite: 15-19] ---
    const applicantDetails = get(report, 'Current_Application.Current_Applicant_Details', {});
    const basicDetails = {
      name: `${get(applicantDetails, 'First_Name', '')} ${get(applicantDetails, 'Last_Name', '')}`.trim(),
      mobilePhone: get(applicantDetails, 'MobilePhoneNumber'),
      // PAN is often more reliable from the account holder details
      // We look in the first account, then the second, as a fallback.
      pan: get(report, 'CAIS_Account.CAIS_Account_DETAILS.0.CAIS_Holder_ID_Details.0.Income_TAX_PAN') || 
           get(report, 'CAIS_Account.CAIS_Account_DETAILS.1.CAIS_Holder_ID_Details.0.Income_TAX_PAN'),
      creditScore: parseInt(get(report, 'SCORE.BureauScore', 0), 10),
    };
    
    // --- 2. Report Summary [cite: 20-28] ---
    const caisSummary = get(report, 'CAIS_Account.CAIS_Summary', {});
    const reportSummary = {
      totalAccounts: parseInt(get(caisSummary, 'Credit_Account.CreditAccountTotal', 0), 10),
      activeAccounts: parseInt(get(caisSummary, 'Credit_Account.CreditAccountActive', 0), 10),
      closedAccounts: parseInt(get(caisSummary, 'Credit_Account.CreditAccountClosed', 0), 10),
      currentBalance: parseInt(get(caisSummary, 'Total_Outstanding_Balance.Outstanding_Balance_All', 0), 10),
      securedBalance: parseInt(get(caisSummary, 'Total_Outstanding_Balance.Outstanding_Balance_Secured', 0), 10),
      unsecuredBalance: parseInt(get(caisSummary, 'Total_Outstanding_Balance.Outstanding_Balance_UnSecured', 0), 10),
      enquiriesLast7Days: parseInt(get(report, 'TotalCAPS_Summary.TotalCAPSLast7Days', 0), 10),
    };

    // --- 3. Credit Accounts Information [cite: 29-35] ---
    let accountDetailsList = get(report, 'CAIS_Account.CAIS_Account_DETAILS', []);
    
    // Ensure it's always an array for consistent mapping, even if only one account exists
    if (accountDetailsList && !Array.isArray(accountDetailsList)) {
        accountDetailsList = [accountDetailsList];
    }

    const accounts = accountDetailsList.map((acc) => {
      const address = get(acc, 'CAIS_Holder_Address_Details', {});
      // Combine address lines, filter out empty ones, and join
      const fullAddress = [
        get(address, 'First_Line_Of_Address_non_normalized', ''),
        get(address, 'Second_Line_Of_Address_non_normalized', ''),
        get(address, 'Third_Line_Of_Address_non_normalized', ''),
        get(address, 'City_non_normalized', ''),
        get(address, 'ZIP_Postal_Code_non_normalized', '')
      ].filter(Boolean).join(', '); // 'filter(Boolean)' cleverly removes empty strings

      return {
        bankName: get(acc, 'Subscriber_Name', '').trim(),
        accountNumber: get(acc, 'Account_Number'),
        accountType: get(acc, 'Account_Type'), // e.g., 10 = Credit Card, 51 = Loan
        currentBalance: parseInt(get(acc, 'Current_Balance', 0), 10),
        amountOverdue: parseInt(get(acc, 'Amount_Past_Due', 0), 10),
        address: fullAddress,
      };
    });

    // Combine all parts into our final schema structure
    const processedReport = {
      basicDetails,
      reportSummary,
      accounts,
    };

    return processedReport;

  } catch (error) {
    console.error('Error parsing XML:', error);
    // Re-throw the error so the route handler can catch it
    throw new Error(`Failed to parse XML data: ${error.message}`);
  }
}

module.exports = { parseXMLReport };