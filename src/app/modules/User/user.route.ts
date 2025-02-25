/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/sendImageToCloudinary";

import { UserControllers } from "./user.controller";
import { USER_ROLE } from "./user.const";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/create-user",
  auth(USER_ROLE.Admin, USER_ROLE.User),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(UserValidation.userRegisterSchema),
  UserControllers.createUser
);

router.post(
  "/create-admin",
  auth(USER_ROLE.Admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(UserValidation.userRegisterSchema),
  UserControllers.createAdmin
);

router.get(
  "/me",
  auth(USER_ROLE.Admin, USER_ROLE.User),

  UserControllers.getMe
);

export const UserRoutes = router;
