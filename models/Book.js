const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
    },
    publishedYear: {
        type: Number,
        required: true,
        min: [1, "Year must be positive"],
        validate: {
            validator: Number.isInteger,
            message: "Must be an Integer"
        }
    },
    publisher: {
        type: String,
        required: true
    },
    genre: [{
        type: String,
        enum: ["Fiction", "Non-Fiction", "Science Fiction", "Fantasy", "Mystery", "Thriller", "Romance", "Biography", "History", "Self-Help", "Philosophy", "Poetry", "Children"]
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    available: {
        type: Boolean,
        default: true,
        // required: true iski neeed nhi hai due to default
    }
}, { timestamps: true });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;