// Import the testing functions from Vitest
import { describe, it, expect, beforeAll } from 'vitest';

// Import the function we want to test
import { parseXMLReport } from './xmlParser.js';

// Import Node.js 'fs' (file system) to read our sample file
import { promises as fs } from 'fs';
import path from 'path';

// --- Test Suite for xmlParser ---

// 'describe' groups related tests together
describe('parseXMLReport Service', () => {
  
  let parsedResult; // We'll store the parsed data here

  // 'beforeAll' runs once before any tests.
  // We use it to read the file and run the parser,
  // so we don't have to do it in every single test.
  beforeAll(async () => {
    // 1. Find and read the sample XML file
    const xmlPath = path.join(__dirname, '../Sagar_Ugle1.xml');
    const xmlBuffer = await fs.readFile(xmlPath);
    
    // 2. Run our parser function
    parsedResult = await parseXMLReport(xmlBuffer);
  });

  // --- Test Case 1: Basic Details ---
  // 'it' defines an individual test case
  it('should correctly parse Basic Details', () => {
    // 'expect' is our assertion. We check if the result
    // matches what we know it should be.
    expect(parsedResult.basicDetails.name).toBe('Sagar ugle');
    expect(parsedResult.basicDetails.mobilePhone).toBe('9819137672');
    expect(parsedResult.basicDetails.pan).toBe('AOZPB0247S');
    expect(parsedResult.basicDetails.creditScore).toBe(719);
  });

  // --- Test Case 2: Report Summary ---
  it('should correctly parse the Report Summary', () => {
    expect(parsedResult.reportSummary.totalAccounts).toBe(4);
    expect(parsedResult.reportSummary.activeAccounts).toBe(3);
    expect(parsedResult.reportSummary.closedAccounts).toBe(1);
    expect(parsedResult.reportSummary.currentBalance).toBe(245000);
    expect(parsedResult.reportSummary.securedBalance).toBe(85000);
    expect(parsedResult.reportSummary.unsecuredBalance).toBe(160000);
    expect(parsedResult.reportSummary.enquiriesLast7Days).toBe(0); // Good to test a zero value
  });

  // --- Test Case 3: Credit Accounts ---
  it('should correctly parse Credit Accounts Information', () => {
    // Check if it found all 4 accounts
    expect(parsedResult.accounts).toHaveLength(4);

    // Spot-check the first account in the list
    const firstAccount = parsedResult.accounts[0];
    expect(firstAccount.bankName).toBe('icicibank');
    expect(firstAccount.accountNumber).toBe('ICIVB20994');
    expect(firstAccount.accountType).toBe('10'); // This is 'Credit Card'
    expect(firstAccount.currentBalance).toBe(80000);
    expect(firstAccount.amountOverdue).toBe(4000);
    expect(firstAccount.address).toBe('ANANDI VIHAR, DEHU ROAD, PUNE, 411047');
  });

});