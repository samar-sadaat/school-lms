const Teachers = require('../models/teacherModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const teacherget = async (req, res) => {
    try {
        const AllTeacher = await Teachers.find();
        res.json(AllTeacher)

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const teacherSignup = async (req, res) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).json({ status: "error", message: "All fields are required" });
        }
        const findemail = await Teachers.findOne({ email: data.Email });
        if (findemail) {
            return res.status(409).json({ status: "error", message: "Email already exists" });
        }
        const cryptedPass = await bcrypt.hash(data.Password, 10);
        await Teachers.create({
            name: data.Name,
            email: data.Email.toLowerCase(),
            department: data.Department,
            password: cryptedPass
        })
        return res.send("Data Created Successfully")
    } catch (err) {
        console.error("Error reading file (new signup):", err);
    }
};


const teacherlogin = async (req, res) => {
    
    try {
        const data = await req.body;
        if (!data) {
            return res.status(500).json({ status: "error", message:"Enter Email or Password"});
        }
        const teacher = await Teachers.findOne({ email: data.Email});
        
        if (!teacher) {
            return res.status(401).json({ status: "error", message:"Invalid Email"});
        }

        const decryptPass = await bcrypt.compare(data.Password, teacher.password);
        
        const token = jwt.sign(
            {
                id: teacher._id
            },
            "screatekeytoken",
            {
                expiresIn: '1h'
            }
        )

        if(decryptPass){
            res.json({ status: "success", message:`${teacher.name} Login successful`, token: token});
        }else{
            return res.status(401).json({ status: "error", message:"Invalid Password"});
        }

    } catch (err) {
        res.status(500).json({status: "error", message:"Error processing login"});
    }
};


const teacherDelete = async (req, res) => {
    
    try {
        const  Email  = await req.params.Email;

        const user = await Teachers.findOneAndDelete({ email: Email });
        if (!user) {
            return res.status(404).send("No users found");
        }

        res.send(`User with email ${Email} deleted successfully`);
    } catch (err) {
        res.status(500).send("Error deleting user" + err.message);
    }
};


const teacherUpdate = async (req, res) =>{
    try {
        const data = await req.body;

        if (!data){
            return res.status(400).send("Enter Data to Update");
        }
        const user = await Teachers.findOneAndUpdate(
            { email: data.Email, password: data.Password },
            { name: data.Name, age: data.Age },
            { new: true }
        );
        if (!user) {
            return res.status(404).send("No users found");
        }

        res.send(`User with email ${data.Email} updated successfully`);
    } catch (err) {
        res.status(500).send("Error Updating user" + err.message);
    }
}

module.exports = {
    teacherget,
    teacherSignup,
    teacherlogin,
    teacherUpdate,
    teacherDelete
};