import express from "express";
import { cancelSaleRecord, createSaleRecordWithStockUpdate, getAllDueSales, getAllReturnCancelSales, getAllSales, getDailyRevenue, getMonthlyRevenue, getMonthlySaleCount, getPaginationSales, getSalesCount, getTotalRevenue, recordSale } from "../controllers/salesController.js";

const router = express.Router();

// router.post("/createSaleRecord",  recordSale);
router.get("/getSales", getAllSales);
router.get("/getpaginationSales",  getPaginationSales);
router.get("/getDueSales", getAllDueSales);
router.get("/getTotalRevenue", getTotalRevenue);
router.get("/getTotalSales", getSalesCount);
router.get("/getDailyRevenue", getDailyRevenue);
router.get("/getMonthlySaleCount", getMonthlySaleCount);
router.post("/createSaleRecordWithStockUpdate", createSaleRecordWithStockUpdate);
router.get("/getMonthlyRevenue", getMonthlyRevenue);
router.post("/cancelSale", cancelSaleRecord);
router.get("/getReturnCancel", getAllReturnCancelSales);




export default router;