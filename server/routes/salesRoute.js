import express from "express";
import { recordSale } from "../controllers/salesController.js";

const router = express.Router();

router.post("/createSaleRecord",  recordSale);


export default router;