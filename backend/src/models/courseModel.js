const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true,
    },
    slot:{
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Course', CourseSchema);