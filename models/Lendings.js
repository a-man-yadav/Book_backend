const mongoose = require("mongoose")

const lendingSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        require: true
    },
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true
    },
    lendingDate: {
        type: Date,
        require: true,
        default: Date.now
    },
    returnDate: {
        type: Date,
        default: null,
    },
    status: {
        type:String,
        enum: ["borrowed","returned","requested","rejected"],
        default: "requested" 
    }

});

const Lending = mongoose.model("Lending", lendingSchema)

module.exports = Lending;