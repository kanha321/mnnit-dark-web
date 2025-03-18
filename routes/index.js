/**
 * Main Routes Index
 * Combines all application routes
 */

const express = require('express');
const router = express.Router();
const fileRoutes = require('./fileRoutes');

// Use file routes
router.use('/', fileRoutes);

module.exports = router;
