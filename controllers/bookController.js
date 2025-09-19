const Book = require("../models/Book")

const createBook = async (req, res) => {
    try {
        const { title, author, publishedYear, publisher, genre } = req.body;

        if (!title || !publishedYear || !publisher) {
            res.status(400).json({ message: "Title, Year and publisher are required field" });
        }

        const book = new Book({
            title,
            author,
            publishedYear,
            publisher,
            genre,
            owner: req.user._id,
            available: true,
        });

        await book.save();

        res.status(200).json({
            success: true,
            message: "Book created Successfully",
            data: book,
        })
    } catch (error) {
        console.log("Error creating Book: ", error);
        res.status(500).json({ message: "Server Error" })
    }

}

const getBooks = async (req, res) => {

    try {
        let query = {};

        if (req.query.available) {
            query.available = req.query.available === "true";
        }

        if (req.query.genre) {
            query.genre = { $in: req.query.genre.split(",") };
        }

        if (req.query.author) {
            query.author = req.query.author;
        }

        const books = await Book.find(query).populate("owner", "name email");

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        })
    } catch (error) {
        console.log("Error Getting books:", error.message);
        res.status(500).json({
            message: "Server Error"
        })
    }
};

const getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId).populate("owner", "name email");

        if (!book) {
            return res.status(400).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.log("Error getting Book: ", error.message)

        res.status(500).json({
            message: "Server Error"
        });
    }

}

const updateBook = async (req, res) => {

    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book Not Found"
            });
        }

        if (book.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this book"
            });
        }

        if (req.body.title) book.title = req.body.title;
        if (req.body.author) book.author = req.body.author;
        if (req.body.publishedYear) book.publishedYear = req.body.publishedYear;
        if (req.body.publisher) book.publisher = req.body.publisher;
        if (req.body.genre) book.genre = req.body.genre;

        const updatedBook = await book.save();

        res.status(200).json({
            success: true,
            message: "Book Updated",
            data: updatedBook,
        });
    } catch (error) {
        console.log("Error Updating Book: ", error.message)

        res.status(500).json({
            message: "Server Error"
        });
    }
}

const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                message: "Book Not Found"
            });
        }

        if (book.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false, 
                message: "Not authorized to update this book"
            });
        }

        await book.deleteOne();

        res.status(200).json({
            success: true,
            message: "Book Deleted",
        });
    } catch (error) {
        console.log("Error Updating Book: ", error.message)

        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = { createBook, getBooks, getBookById, updateBook,deleteBook }