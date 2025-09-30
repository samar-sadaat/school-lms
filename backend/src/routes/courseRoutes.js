const express = require('express');
const CourseRoutes = express.Router();
const cors = require('cors');
const CourseController = require('../controller/courseController');
const verify = require('../middleware/teacherMiddleware')

CourseRoutes.use(express.json());
CourseRoutes.use(cors());

CourseRoutes.get("/", verify, CourseController.courseget);

CourseRoutes.post("/create", verify,  CourseController.courseCreate);

CourseRoutes.delete("/del/:Course", verify, CourseController.courseDelete);

CourseRoutes.patch("/update", verify, CourseController.courseUpdate);

module.exports = CourseRoutes;