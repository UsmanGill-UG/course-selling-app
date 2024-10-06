const express = require('express');
const adminRouter = express.Router();  // Initialize the router
const jwt = require('jsonwebtoken');

const { adminModel, courseModel } = require('../db'); // Import the adminModel
const { JWT_ADMIN_PASSWORD } = require('../config');
const { adminMiddleware } = require('../middleware/admin');

adminRouter.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body; // Zod
    // hash the password, so that it is not stored in plain text in DB

    try{
        await adminModel.create({ // why await? because it is an async operation
            email: email,
            password: password,
            firstName: firstName,
            lastName, // if key and value are same, we can write it once
        });
    }
    catch(err){
        res.status(400).json({ message: 'Admin signup failed' });
        return
    }

    res.json({ message: 'Admin signup succeeded' });
});

adminRouter.post('/signin', async (req, res) => { 
    const { email, password } = req.body;
    
    // ideally password should be hashed and then compared
    const admin = await adminModel.findOne({ email: email, password: password }); // why should we use await? because it is an async operation

    if (admin) {
        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);

        // do cookie stuff here

        res.json({ message: 'Admin Signed In', token: token });
    }
    else {
        res.status(403).json({ message: 'Admin signin failed' });
    }
});

adminRouter.post('/course',adminMiddleware,  async (req, res) => {
    const adminId = req.userId
    const { title, description, imageUrl,  price } = req.body;


    // creating a web3 saas in 6 hours // youtube video
    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    });


    res.json({ 
        message: 'Course Created',
        courseId: course._id
    });
});

// edit a course
adminRouter.put('/course',adminMiddleware,  async (req, res) => {
    const adminId = req.userId
    const { title, description, imageUrl,  price, courseId} = req.body;

    if (!courseId) {
        res.status(400).json({ message: 'Course ID is required' });
        return;
    }

    // Fetch the course to verify that the admin is the creator of the course
    const course = await courseModel.findById(courseId);

    if (!course) {
        return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the adminId is the same as the creatorId of the course
    if (course.creatorId.toString() !== adminId) {
        return res.status(403).json({ message: 'You do not have permission to update this course' });
    }

    // Proceed with the update if the adminId matches the creatorId
    const updatedCourse = await courseModel.updateOne(
        { _id: courseId, creatorId: adminId },
        {
            title: title,
            description: description,
            imageUrl: imageUrl,
            price: price,
            adminId: adminId
        }
    );

    res.json({
        message: 'Course Updated',
        courseId: updatedCourse._id
    });
});

// admin can get all the courses he created
adminRouter.get('/course/bulk', adminMiddleware, async(req, res) => {
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId : adminId,
    });


    res.json({ 
        message: 'All courses',
        courses
    }); 
});

module.exports = adminRouter;