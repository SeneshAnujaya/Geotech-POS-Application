import express from "express";
import { getAllSales, recordSale } from "../controllers/salesController.js";

const router = express.Router();

router.post("/createSaleRecord",  recordSale);
router.get("/getSales", getAllSales)


export default router;