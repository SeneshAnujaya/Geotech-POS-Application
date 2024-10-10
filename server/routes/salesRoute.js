import express from "express";
import { getAllSales, getTotalRevenue, recordSale } from "../controllers/salesController.js";

const router = express.Router();

router.post("/createSaleRecord",  recordSale);
router.get("/getSales", getAllSales);
router.get("/getTotalRevenue", getTotalRevenue);


export default router;