const mongoose = require('mongoose');
const { MONGO_URL } = require('./config');
mongoose.connect(MONGO_URL);
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    password: String,
    firstName: String,
    lastName: String,
});

const adminSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    password: String,
    firstName: String,
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorID: ObjectId
});

const purchaseSchema = new Schema({
    userID: ObjectId,
    courseID: ObjectId,
});

const userModel = mongoose.model('User', userSchema);
const adminModel = mongoose.model('Admin', adminSchema);
const courseModel = mongoose.model('Course', courseSchema);
const purchaseModel = mongoose.model('Purchase', purchaseSchema);

module.exports = { 
    userModel, 
    adminModel, 
    courseModel, 
    purchaseModel 
};