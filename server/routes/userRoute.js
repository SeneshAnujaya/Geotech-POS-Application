import express from "express";
import { deleteuser, getusers } from "../controllers/userController.js";
import {isAdmin} from '../utils/authMiddleware.js';

const router = express.Router();


router.get("/getusers", getusers);
router.delete("/deleteuser/:id", deleteuser);


export default router;