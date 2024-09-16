import express from "express";
import { deleteuser, getusers, updateUser } from "../controllers/userController.js";
import {isAdmin} from '../utils/authMiddleware.js';

const router = express.Router();


router.get("/getusers", getusers);
router.delete("/deleteuser/:id", isAdmin, deleteuser);
router.put("/updateuser/:id", isAdmin,  updateUser);


export default router;