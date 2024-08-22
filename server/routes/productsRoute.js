import express from "express";
import { addProduct, getAllProducts } from "../controllers/productController.js";
import { verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/add",  addProduct);
router.get("/getproducts",  getAllProducts);


export default router;