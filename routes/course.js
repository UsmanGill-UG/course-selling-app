const express = require('express');
const courseRouter = express.Router();  // Initialize the router
const { courseModel, userModel, purchaseModel } = require('../db'); // Import the courseModel
const { userMiddleware } = require('../middleware/user');

// user purchase a course
courseRouter.post('/purchase', userMiddleware, async (req, res) => {
    userId = req.userId; 
    courseId = req.body.courseId;  

    await purchaseModel.create({
        userId: userId,
        courseId: courseId
    });  

    res.json({ message: `You have successfully purchased the course` });
});

  // no need to check if user is logged in
courseRouter.post('/preview', async (req, res) => {
    const courses = await courseModel.find({});
    res.json(courses);
});

module.exports = courseRouter;  // Export the courseRouter
