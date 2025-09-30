const express = require('express');
const StudentRoute = express.Router();
const cors = require('cors');
const StudentController = require('../controller/studentController');
const verify = require('../middleware/teacherMiddleware')

StudentRoute.use(express.json());
StudentRoute.use(cors());

StudentRoute.get("/:pageNmbr", verify, StudentController.studentget);

StudentRoute.post("/signup", verify,  StudentController.studentSignup);

StudentRoute.post("/login",  StudentController.studentlogin);

StudentRoute.delete('/del/:Email', verify, StudentController.studentDelete);

StudentRoute.patch('/update', verify, StudentController.studentUpdate);

module.exports = StudentRoute;