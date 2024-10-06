const express = require('express');
const userRouter = express.Router();  // Initialize the router
const { userModel, purchaseModel, courseModel } = require('../db'); // Import the userModel
const jwt = require('jsonwebtoken');
const { JWT_USER_PASSWORD } = require('../config');
const { userMiddleware } = require('../middleware/user');

userRouter.post('/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body; // Zod
    // hash the password, so that it is not stored in plain text in DB

    try{
        await userModel.create({ // why await? because it is an async operation
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

userRouter.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    
    // ideally password should be hashed and then compared
    const user = await userModel.findOne({ email: email, password: password }); // why should we use await? because it is an async operation

    if (user) {
        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);

        // do cookie stuff here

        res.json({ message: 'User Signed In yes', token: token });
    }
    else {
        res.status(403).json({ message: 'User signin failed' });
    }
});

userRouter.get('/purchases', userMiddleware, async (req, res) => {
    const userId = req.userId; 
    const purchases = await purchaseModel.find({ userId: userId });
    const courseData = await courseModel.find({ _id: { $in: purchases.map(p => p.courseId)}});
    res.json(courseData);  
});

module.exports = userRouter;  // Export the userRouter
