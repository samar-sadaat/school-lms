const express = require('express');
const exp = express();
const cors = require('cors');
const TeacherRoute = require('./src/routes/teacherRoutes');
const StudentRoute = require('./src/routes/studentRoutes');
const CourseRoutes = require('./src/routes/courseRoutes');
const port = 4000;
const mongodb = require('./db')
mongodb();

exp.use(cors());
exp.use(express.json());
exp.use('/teacher', TeacherRoute);
exp.use('/student', StudentRoute);
exp.use('/course', CourseRoutes);



exp.listen(port, ()=>{
    console.log(`Server is Runing ${port}`)
})