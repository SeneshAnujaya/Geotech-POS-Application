import express from "express";
import { addProduct, deleteProduct, getAllProducts,  updateProductsStock  } from "../controllers/productController.js";
import { isAdmin, verifyToken } from "../utils/authMiddleware.js";

const router = express.Router();

router.post("/add", isAdmin,  addProduct);
router.get("/getproducts",  getAllProducts);
router.post("/updatestock",  updateProductsStock);
router.delete("/delete/:sku", isAdmin, deleteProduct);


export default router;