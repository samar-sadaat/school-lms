const express = require('express');
const exp = express();
const cors = require('cors');
const TeacherRoute = require('./src/routes/teacherRoutes');
const StudentRoute = require('./src/routes/studentRoutes');
const CourseRoutes = require('./src/routes/courseRoutes');
require('dotenv').config();
const mongodb = require('./db')
mongodb();

exp.use(cors());
exp.use(express.json());
exp.use('/teacher', TeacherRoute);
exp.use('/student', StudentRoute);
exp.use('/course', CourseRoutes);


const PORT = process.env.PORT || 4000;

exp.listen(PORT, ()=>{
    console.log(`Server is Runing ${PORT}`)
})