const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const participantRoutes = require('./routes/participants');
const registrationRoutes = require('./routes/registrations');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/registrations', registrationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ detail: 'Not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ detail: 'Internal server error.' });
});

module.exports = app;
