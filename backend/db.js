const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/SchoolDB");
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(" MongoDB connection error:", err);
        process.exit(1);
    }
};
module.exports = connectDB;



// , {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         }