const express = require('express');
const courseRouter = express.Router();  // Initialize the router
const { courseModel } = require('../db'); // Import the courseModel


courseRouter.post('/preview', (req, res) => {
    res.json({ message: 'Add new course' });
});

courseRouter.get('/purchase', (req, res) => {
    res.json({ message: `purchase a course` });
});

module.exports = courseRouter;  // Export the courseRouter
