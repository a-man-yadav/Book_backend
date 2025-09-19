const express = require("express");
const {createBook, getBooks, getBookById, updateBook, deleteBook} = require("../controllers/bookController");
const protect = require("../middlewares/authMiddleware")
 
const router = express.Router();

router.post("/createbook",protect, createBook);
router.get("/getbooks",getBooks);
router.get("/:id", getBookById);
router.put("/:id/updatebook",protect, updateBook);
router.delete("/:id/deletebook",protect, deleteBook);

module.exports = router