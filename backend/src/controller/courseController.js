const Course = require('../models/courseModel')




const courseget = async (req, res) => {
    try {
        const studentId = await req.userId;
        // const page = await req.params.pageNmbr;
        // const size = 4
        // const skip = (page - 1) * size

        // const AllStudent = await Students.countDocuments({ teacherId });

        const Courses = await Course.find({ studentId });
        res.json({ Data: Courses});

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
};




const courseCreate = async (req, res) => {
    try {
        const data = await req.body;
        const StudentId = await req.userId;
        if (!data) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }
        const findCourse = await Course.findOne({ course: data.Course, studentId: StudentId });

        if (findCourse) {
            return res.status(409).json({ status: "error", message: "Course already exists" });
        }

        await Course.create({
            studentId: StudentId,
            course: data.Course,
            courseCode: data.CourseCode,
            slot: data.Slot
        })

        return res.send("Data Created Successfully")
    } catch (err) {
        console.error("Error reading file", err);
    }
};


const courseDelete = async (req, res) => {

    try {
        const RecveCourse = await req.params.Course;

        const CourseDelete = await Course.findOneAndDelete({ course: RecveCourse });
        if (!CourseDelete) {
            return res.status(404).send("Not found");
        }

        res.json({ status: "success", message: `${CourseDelete.course} Course deleted successfully` });
    } catch (err) {
        res.status(500).send("Error deleting user" + err.message);
    }
};


const courseUpdate = async (req, res) => {
    try {
        // const id = await req.params._id
        const data = await req.body;

        if (!data) {
            return res.status(400).send("Enter Data to Update");
        }
        const course = await Course.findOneAndUpdate(
            { course: data.Course },
            { course: data.Course, courseCode: data.CourseCode, slot: data.Slot },
            { new: true }
        );
        if (!course) {
            return res.status(404).send("Not found");
        }

        res.json({ status: "success", message: `${course.course} Course Updated` });
    } catch (err) {
        res.status(500).send("Error Updating course" + err.message);
    }
;}



module.exports = {
    courseget,
    courseCreate,
    courseUpdate,
    courseDelete
}