import { Router } from "express";
import { registerUser, getUserByID } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/user/:id").get(getUserByID);

export default router;
