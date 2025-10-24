const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
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

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("MongoDB connection error:", err));
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));