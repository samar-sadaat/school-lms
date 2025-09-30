const express = require('express');
// const checkEmail = require('../middleware/userMiddleware');
const TeacherRoute = express.Router();
const cors = require('cors');
const TeacherController = require('../controller/teacherController');
// const verify = require('../middleware/teacherMiddleware')

TeacherRoute.use(express.json());
TeacherRoute.use(cors());

TeacherRoute.get("/", TeacherController.teacherget);

TeacherRoute.post("/signup",  TeacherController.teacherSignup);


TeacherRoute.post("/login", TeacherController.teacherlogin);

TeacherRoute.delete('/del/:Email',TeacherController.teacherDelete);

TeacherRoute.patch('/update/',TeacherController.teacherUpdate);


module.exports = TeacherRoute;