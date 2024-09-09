import express from "express";
import { getusers, signin, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getusers", getusers);

export default router;