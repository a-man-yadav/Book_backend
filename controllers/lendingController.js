const Lending = require("../models/Lendings");
const Book = require("../models/Book");

const requestLendBook = async (req, res) => {
    try {
        const { bookId } = req.body;

        if (!bookId) {
            return res.status(400).json({
                success: false,
                message: "Book ID is required"
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        if (book.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ sucess: false, message: "Can't borrow your own book" });
        }

        const existingRequest = await Lending.findOne({
            book: bookId,
            borrower: req.user._id,
            status: { $in: ["requested", "borrowed"] }
        });

        if (existingRequest) {
            return res.status(400).json({ success: false, message: "You already requested for this book" });
        }

        const lendingRequest = new Lending({
            book: bookId,
            lender: book.owner,
            borrower: req.user._id,
            status: "requested"
        });

        await lendingRequest.save();

        res.status(201).json({
            success: true,
            message: "Lending request created successfully",
            data: lendingRequest
        });
    } catch (error) {
        console.log("Error Requesting: ", error.message);
        res.status(500).json({
            sucess: false, message: "Server error"
        });
    }
}

const approveLendBook = async (req, res) => {
    try {
        const lendingId = req.params.id;


        const lending = await Lending.findById(lendingId).populate("book");
        if (!lending) {
            return res.status(404).json({ success: false, message: "No lending request" });
        }

        if (lending.lender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not Authorised to approve" });
        }

        if (lending.status !== "requested") {
            return res.status(400).json({ success: false, message: "This req is not pending" });
        }

        lending.status = "borrowed";
        lending.lendingDate = new Date();
        await lending.save();

        const book = await Book.findById(lending.book._id);
        if (book) {
            book.available = false;
            await book.save();
        }

        res.status(200).json({
            success: true,
            message: "Request Approved",
            data: lending
        });
    } catch (error) {
        console.log("Error Approving", error.message)

        res.status(500).json({ success: false, message: "Server Error" })
    }

}

const rejectLendRequest = async (req, res) => {
    try {
        const lendingId = req.params.id;

        const lending = await Lending.findById(lendingId).populate("book");
        if (!lending) {
            return res.status(404).json({ success: false, message: "No request found" });
        }

        if (lending.lender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not Authorised" });
        }

        if (lending.status !== "requested") {
            return res.status(400).json({ success: false, message: "This request is not pending approval" })
        }

        lending.status = "rejected";
        await lending.save();

        res.status(200).json({
            success: true,
            message: "Rejected Request",
            data: lending
        });
    } catch (error) {
        console.log("Error Rejecting: ", error.message)

        res.status(500).json({ success: false, message: "Server Error" });
    }
}

const returnBook = async (req, res) => {
    try {
        const lendingId = req.params.id;

        const lending = await Lending.findById(lendingId).populate("book");
        if (!lending) {
            return res.status(404).json({ success: false, message: "Lending record not found" });
        }

        if (lending.borrower.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to return this book" });
        }

        if (lending.status !== "borrowed") {
            return res.status(400).json({ success: false, message: "This book is not currently borrowed" });
        }

        lending.status = "returned";
        lending.returnDate = new Date();
        await lending.save();

        const book = await Book.findById(lending.book._id);
        if (book) {
            book.available = true;
            await book.save();
        }

        res.status(200).json({
            success: true,
            message: "Book returned successfully",
            data: lending
        });
    } catch (error) {
        console.error("Error returning book:", error.message);

        if (error.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid Lending ID" });
        }

        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getBorroweedBooksByUser = async (req, res) => {

    try {
        const userId = req.params.id;
        
        if (req.user._id.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not Authorised"
            })
        }
        const lendings = await Lending.find({ borrower: userId, status: "borrowed" }).populate("book", "title author available").populate("lender", "name email");

        res.status(200).json({
            success: true,
            count: lendings.length,
            data: lendings
        })
    } catch (error) {
        console.log("Error fetching", error.message);
        res.status(500).json({success:false, message: "Server Error"});
    }

}


const getLendedBooksByUser = async (req, res) => {

}

const getPendingRequestsForLender = async (req, res) => {
 
}

const getLendingHistoryForBook = async (req, res) => {

}

module.exports = { requestLendBook, approveLendBook, rejectLendRequest, returnBook, getBorroweedBooksByUser }