const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

exports.signup = async (req, res) => { 
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User exists" });
        }

        const user = await User.create({ name, email, password });

        const token = generateToken(user._id);

        res.status(201).json({
            message: "User Registered",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "No Such User found" });
        }

        const isMatch = await user.passwordComparator(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid creds"});
        }

        const token = generateToken(user._id);

        res.status(200).json({
            message: "Login Success",
            user:{
                id: user.id,
                name: user.name,
                email: user.email
            },
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};