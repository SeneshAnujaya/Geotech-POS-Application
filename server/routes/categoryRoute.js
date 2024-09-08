import express from "express";
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/categoryController.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken,  addCategory);
router.get("/getCategories",  getAllCategories);
router.delete("/deleteCategory/:id", deleteCategory);
router.put("/updateCategory/:id", updateCategory);


export default router;