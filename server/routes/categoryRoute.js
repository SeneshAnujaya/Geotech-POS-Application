import express from "express";
import { addCategory, getAllCategories } from "../controllers/categoryController.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken,  addCategory);
router.get("/getCategories",  getAllCategories);


export default router;