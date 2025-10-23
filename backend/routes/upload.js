const express = require('express');
const multer = require('multer');
const CreditReport = require('../models/CreditReport'); // Go up one level, then into models
const { parseXMLReport } = require('../services/xmlParser'); // Go up one level, then into services

const router = express.Router();

// --- Multer Configuration ---
// Configure multer to store files in memory for processing
const storage = multer.memoryStorage();

// Add file type validation to ensure only XML is uploaded
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml') {
    cb(null, true); // Accept the file
  } else {
    // Reject the file
    cb(new Error('Invalid file type. Only XML files are allowed.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


router.post('/upload', upload.single('xmlfile'), async (req, res) => {
  // 1. Handle errors from multer (like invalid file type) or no file
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded. Please select an XML file.' });
  }

  try {
    
    const parsedData = await parseXMLReport(req.file.buffer);

    // 3. Create a new report document based on our Mongoose model
    const newReport = new CreditReport({
      fileName: req.file.originalname,
      ...parsedData, // Spread the parsed data (basicDetails, reportSummary, accounts)
    });

    // 4. Save the document to MongoDB
    const savedReport = await newReport.save();

    // 5. Send a success response
    res.status(201).json({ 
      message: 'File uploaded and processed successfully!',
      report: savedReport 
    });

  } catch (error) {
    console.error('Upload processing error:', error);
    // Handle specific errors
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes('Failed to parse XML data')) {
      return res.status(400).json({ message: 'Error parsing XML. The file may be malformed.' });
    }
    // Generic server error
    res.status(500).json({ message: 'Server error during file processing.', error: error.message });
  }
});


router.get('/reports', async (req, res) => {
  try {
    const reports = await CreditReport.find()
      .sort({ uploadedAt: -1 }) // Show newest first
      .select('fileName uploadedAt basicDetails.name'); // Only send summary data for the list

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error fetching reports.' });
  }
});


router.get('/reports/:id', async (req, res) => {
  try {
    const report = await CreditReport.findById(req.params.id);
    
    if (!report) {
      return res.status(4404).json({ message: 'Report not found.' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching single report:', error);
    res.status(500).json({ message: 'Server error fetching report.' });
  }
});

module.exports = router;