const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'CareerPilot API is running smoothly!' });
});

// Import Routes
const resumeRoutes = require('./routes/resume.routes');
const profileRoutes = require('./routes/profile.routes');

// Use Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/profile', profileRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
