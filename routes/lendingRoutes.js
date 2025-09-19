const express = require("express");
const {requestLendBook, approveLendBook, rejectLendRequest, returnBook} = require("../controllers/lendingController");
const protect = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/request",protect, requestLendBook);
router.put("/:id/approve",protect, approveLendBook);
router.put("/:id/reject",protect, rejectLendRequest);
router.put("/:id/return",protect, returnBook);


module.exports = router