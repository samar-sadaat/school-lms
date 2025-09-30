const Students = require('../models/studentsModel');
const generator = require('generate-password');
const emailSender = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const studentget = async (req, res) => {
    try {
        const teacherId = await req.userId;
        const page = await req.params.pageNmbr;
        const size = 4
        const skip = (page - 1) * size

        const AllStudent = await Students.countDocuments({ teacherId });

        const limitedStudents = await Students.find({ teacherId }).skip(skip).limit(size);
        res.json({ Data: limitedStudents, count: AllStudent });

    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
};

// Send email
async function sendEmail(Email, Name, Password) {
    const transporter = emailSender.createTransport({
        service: 'gmail',
        auth: {
            user: 'sammarsadaat@gmail.com',
            pass: 'jfil jhjb pfyk cbwo'
        }
    });
    const mailOptions = {
        from: 'sammarsadaat@gmail.com',
        to: Email,
        subject: 'Your Student Account Password',
        text: `Hi ${Name},\n\nYour student account has been created.\nHere is your password: ${Password}\n\nPlease keep it secure.\n\nRegards,\nTeam`
    };
    await transporter.sendMail(mailOptions);
}

const studentSignup = async (req, res) => {
    try {
        const data = await req.body;
        const TeacherId = await req.userId;
        if (!data) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }
        const findUser = await Students.findOne({ email: data.Email, teacherId: TeacherId });

        if (findUser) {
            return res.status(409).json({ status: "error", message: "Email already exists" });
        }

        var Password = generator.generate({
            length: 8,
            numbers: true,
            uppercase: true
        });


        const cryptedPass = await bcrypt.hash(Password, 10);

        await Students.create({
            teacherId: TeacherId,
            name: data.Name,
            email: data.Email.toLowerCase(),
            course: data.Course,
            dob: data.DoB,
            password: cryptedPass
        })

        sendEmail(data.Email, data.Name, Password)

        return res.send("Data Created Successfully")
    } catch (err) {
        console.error("Error reading file (new signup):", err);
    }
};


const studentlogin = async (req, res) => {

    try {
        const data = await req.body;
        if (!data) {
            return res.status(500).json({ status: "error", message: "Enter Email or Password" });
        }
        const student = await Students.findOne({ email: data.Email });

        if (!student) {
            return res.status(401).json({ status: "error", message: "Invalid Email" });
        }

        const decryptPass = await bcrypt.compare(data.Password, student.password);

        const token = jwt.sign(
            {
                id: student._id
            },
            "screatekeytoken",
            {
                expiresIn: '1h'
            }
        )

        if (decryptPass) {
            res.json({ status: "success", message: `${student.name} Login successful`, token: token});
        } else {

            return res.status(401).json({ status: "error", message: "Invalid Password" });
        }


    } catch (err) {
        res.status(500).json({ status: "error", message: "Error processing login" });
    }
};


const studentDelete = async (req, res) => {

    try {
        const RcveEmail = await req.params.Email;

        const Student = await Students.findOneAndDelete({ email: RcveEmail });
        if (!Student) {
            return res.status(404).send("No users found");
        }

        res.json({ status: "success", message: `${Student.name} deleted successfully` });
    } catch (err) {
        res.status(500).send("Error deleting user" + err.message);
    }
};


const studentUpdate = async (req, res) => {
    try {
        // const id = await req.params._id
        const data = await req.body;

        if (!data) {
            return res.status(400).send("Enter Data to Update");
        }
        const user = await Students.findOneAndUpdate(
            { email: data.Email },
            { name: data.Name, dob: data.DoB, course: data.Course },
            { new: true }
        );
        if (!user) {
            return res.status(404).send("No users found");
        }

        res.json({ status: "success", message: `${user.name} Updated` });
    } catch (err) {
        res.status(500).send("Error Updating user" + err.message);
    }
}

module.exports = {
    studentget,
    studentSignup,
    studentlogin,
    studentUpdate,
    studentDelete
};