import { Router } from "express";
import {
  openBankAccount,
  getBnakUserById,
} from "../controllers/bankuser.controller.js";

const router = Router();

router.route("/register/:oneKYC_user_passport").post(openBankAccount);
router.route("/account-details").get(getBnakUserById);

export default router;
