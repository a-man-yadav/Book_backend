const bcrypt = require("bcrypt")
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    email:{
        type:String,
        unique: true,
        require: true,
    },
    password:{
        type: String,
        require: true,
        minlength: 8
    }
}, {timestamps: true});

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.methods.passwordComparator = async function(enteredPass) {
    return await bcrypt.compare(enteredPass, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;