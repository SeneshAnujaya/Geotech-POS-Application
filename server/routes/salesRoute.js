import express from "express";
import { createSaleRecordWithStockUpdate, getAllSales, getDailyRevenue, getMonthlySaleCount, getPaginationSales, getSalesCount, getTotalRevenue, recordSale } from "../controllers/salesController.js";

const router = express.Router();

// router.post("/createSaleRecord",  recordSale);
router.get("/getSales", getAllSales);
router.get("/getpaginationSales",  getPaginationSales);
router.get("/getTotalRevenue", getTotalRevenue);
router.get("/getTotalSales", getSalesCount);
router.get("/getDailyRevenue", getDailyRevenue);
router.get("/getMonthlySaleCount", getMonthlySaleCount);
router.post("/createSaleRecordWithStockUpdate", createSaleRecordWithStockUpdate);



export default router;