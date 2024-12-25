import contentUpload from "../middleware/contentUpload.js";
import commonValidator from "../utils/validation.js";
import authMiddleware from "../middleware/auth.middleware.js";
import express from "express";
import userController from "../controller/user.controller.js";
const userRouter = express.Router();

userRouter.get(
  "/profile",
  authMiddleware.checkAuthToken,
  userController.getProfile
);

userRouter.get(
  "/listing",
  authMiddleware.checkAuthToken,
  userController.userListing
);

userRouter.patch(
  "/update-profile",
  authMiddleware.checkAuthToken,
  commonValidator.joiUpdateProfileValidator,
  userController.updateProfile
);

userRouter.post(
  "/upload",
  contentUpload.single("vedio"),
  authMiddleware.checkAuthToken,
  userController.uploadVedio
);

userRouter.get(
  "/vedio/:id",
  authMiddleware.checkAuthToken,
  userController.userVedio
);

export default userRouter;
