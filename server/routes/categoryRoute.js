import express from "express";
import { addCategory, deleteCategory, getAllCategories } from "../controllers/categoryController.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken,  addCategory);
router.get("/getCategories",  getAllCategories);
router.delete("/deleteCategory/:id", deleteCategory);


export default router;