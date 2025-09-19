const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const authRoutes = require("./routes/authRoutes")
const bookRoutes = require("./routes/bookRoutes")
const lendingRoutes = require("./routes/lendingRoutes")

dotenv.config();

const app = express();
app.use(express.json())
const PORT = 5000;


app.use("/auth", authRoutes);
app.use("/book",bookRoutes)
app.use("/lending",lendingRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

mongoose.connect(process.env.MONGO_URI, {
}).then(console.log("MongoDB Connected"))
.catch((err) => console.error("Error occured: ", err));