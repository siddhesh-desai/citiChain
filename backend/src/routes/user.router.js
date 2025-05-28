import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  approveUserKYC,
  declineUserKYC,
  getDashboard,
  checkKYCStatus,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "live_photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  registerUser
);
router.route("/check-kyc/:oneKYC_user_passport").get(checkKYCStatus);
router.route("/approve-kyc/:user_id").patch(approveUserKYC);
router.route("/reject-kyc/:user_id").patch(declineUserKYC);

router.route("/login").post(loginUser);

// secured routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/dashboard").get(verifyJWT, getDashboard);

export default router;
