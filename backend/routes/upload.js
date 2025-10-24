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

    // // 3. Create a new report document based on our Mongoose model
    // const newReport = new CreditReport({
    //   fileName: req.file.originalname,
    //   ...parsedData, // Spread the parsed data (basicDetails, reportSummary, accounts)
    // });

    // --- NEW LOGIC: Create a default display name ---
    const reportCount = await CreditReport.countDocuments();
    const defaultName = `Report ${reportCount + 1}`;
    // -----------------------------------------------

    const newReport = new CreditReport({
      fileName: req.file.originalname,
      displayName: defaultName, // <-- Add the new field
      ...parsedData, 
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
      .select('fileName uploadedAt displayName'); // // Send displayName instead of basicDetails.name

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error fetching reports.' });
  }
});


router.put('/reports/:id', async (req, res) => {
  const { displayName } = req.body;

  if (!displayName) {
    return res.status(400).json({ message: 'Display name is required.' });
  }

  try {
    const report = await CreditReport.findByIdAndUpdate(
      req.params.id,
      { displayName: displayName },
      { new: true } // This option returns the updated document
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Error updating report name:', error);
    res.status(500).json({ message: 'Server error updating report name.' });
  }
});

router.get('/reports/:id', async (req, res) => {
  try {
    const report = await CreditReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error('Error fetching single report:', error);
    res.status(500).json({ message: 'Server error fetching report.' });
  }
});

/**
 * @route   DELETE /api/reports/:id
 * @desc    Delete a report by its ID
 */
router.delete('/reports/:id', async (req, res) => {
  try {
    // We find the report by its ID and delete it from the database
    const report = await CreditReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.status(200).json({ message: 'Report deleted successfully.' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error deleting report.' });
  }
});

module.exports = router;
