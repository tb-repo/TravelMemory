const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
require('node:dns/promises').setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// DB connection
const conn = require('./conn');

// DEBUG LOGGER
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// MIDDLEWARE
app.use(express.json());

// IMPORTANT: keep simple (no FRONTEND_URL needed)
app.use(cors());

// ROUTES
const tripRoutes = require('./routes/trip.routes');

// FINAL API PREFIX
app.use('/api/trip', tripRoutes);

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// TEST
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error'
  });
});

// CRITICAL FIX
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started at http://0.0.0.0:${PORT}`);
});