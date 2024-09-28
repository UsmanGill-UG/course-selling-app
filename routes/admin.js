const express = require('express');
const adminRouter = express.Router();  // Initialize the router
const { adminModel, courseModel } = require('../db'); // Import the adminModel
const jwt = require('jsonwebtoken');
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
        res.status(400).json({ message: 'User signup failed' });
        return
    }

    res.json({ message: 'User signup succeeded' });
});

adminRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    // ideally password should be hashed and then compared
    const admin = await adminModel.findOne({ email: email, password: password }); // why should we use await? because it is an async operation

    if (admin) {
        const token = jwt.sign({ id: admin._id }, JWT_ADMIN_PASSWORD);

        // do cookie stuff here

        res.json({ message: 'User Signed In', token: token });
    }
    else {
        res.status(403).json({ message: 'User signin failed' });
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
        adminId: adminId
    });


    res.json({ 
        message: 'Course Created',
        courseId: course._id
    });
});

// edit a course
adminRouter.put('/course',adminMiddleware,  (req, res) => {
    res.json({ message: 'Add new course' });
});

// admin can get all the courses he created
adminRouter.get('/course/bulk', (req, res) => {
    res.json({ message: 'Add new course' });
});

module.exports = adminRouter;  // Export the adminRouter