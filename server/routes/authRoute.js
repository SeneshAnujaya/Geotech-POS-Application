import express from "express";
import { getusers, signin, signout, signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getusers", getusers);
router.post("/signout", signout);

export default router;