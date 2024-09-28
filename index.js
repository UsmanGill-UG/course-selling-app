require('dotenv').config();
const express = require('express');

const userRouter = require('./routes/user');    // Correct user router import
const courseRouter = require('./routes/course'); // Assuming courseRouter is similarly defined
const adminRouter = require('./routes/admin'); // Assuming adminRouter is similarly defined

const app = express();
app.use(express.json());

const port = 3000;

// Use user routes and course routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/admin', adminRouter);


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
