import express from "express";
import { getAllSales, getDailyRevenue, getMonthlySaleCount, getSalesCount, getTotalRevenue, recordSale } from "../controllers/salesController.js";

const router = express.Router();

router.post("/createSaleRecord",  recordSale);
router.get("/getSales", getAllSales);
router.get("/getTotalRevenue", getTotalRevenue);
router.get("/getTotalSales", getSalesCount);
router.get("/getDailyRevenue", getDailyRevenue);
router.get("/getMonthlySaleCount", getMonthlySaleCount);



export default router;