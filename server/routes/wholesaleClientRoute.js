import express from "express";
import {isAdmin} from '../utils/authMiddleware.js';
import { addBulkBuyer, getBulkBuyers } from "../controllers/wholesaleclientController.js";

const router = express.Router();

router.post('/add',addBulkBuyer);
router.get('/getBulkBuyers', getBulkBuyers)


export default router;