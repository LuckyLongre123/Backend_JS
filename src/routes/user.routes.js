import Router from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { veryfyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//! Secure Routes
router.route("/logout").post(veryfyJWT, logoutUser);
router.route("/refreshtoken").post(refreshAccessToken);

export default router;
