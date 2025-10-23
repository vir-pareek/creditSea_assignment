// In Node.js, we import modules like this:
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // For environment variables

const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 8000;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS)
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:5173'
}));
// Standard JSON body parser
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Successfully connected to MongoDB.'))
.catch((err) => console.error('MongoDB connection error:', err));

// --- API Routes ---
// Mount the upload routes 
app.use('/api', uploadRoutes);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});