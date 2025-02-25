"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const user_controller_1 = require("./user.controller");
const user_const_1 = require("./user.const");
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post("/create-user", (0, auth_1.default)(user_const_1.USER_ROLE.Admin, user_const_1.USER_ROLE.User), sendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.UserValidation.userRegisterSchema), user_controller_1.UserControllers.createUser);
router.post("/create-admin", (0, auth_1.default)(user_const_1.USER_ROLE.Admin), sendImageToCloudinary_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.UserValidation.userRegisterSchema), user_controller_1.UserControllers.createAdmin);
router.get("/me", (0, auth_1.default)(user_const_1.USER_ROLE.Admin, user_const_1.USER_ROLE.User), user_controller_1.UserControllers.getMe);
exports.UserRoutes = router;
