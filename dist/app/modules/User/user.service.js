"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const config_1 = __importDefault(require("../../config"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const user_model_1 = require("./user.model");
const createUserFromDB = (file, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = {};
    // Use default password if not provided
    userData.password = data.password || config_1.default.default_password;
    // Set user role
    userData.role = "user";
    // Set user email
    userData.email = data.email;
    if (file) {
        const imageName = `${userData.email}${userData === null || userData === void 0 ? void 0 : userData.name}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        //send image to cloudinary
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        userData.profileImg = secure_url;
    }
    // Create user in the database
    const user = yield user_model_1.User.create(userData);
    return user;
});
const createAdminFromDB = (file, data) => __awaiter(void 0, void 0, void 0, function* () {
    const adminData = {};
    // Use default password if not provided
    adminData.password = data.password || config_1.default.default_password;
    // Set user role
    adminData.role = "admin";
    // Set user email
    adminData.email = data.email;
    if (file) {
        const imageName = `${adminData.email}${adminData === null || adminData === void 0 ? void 0 : adminData.name}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        //send image to cloudinary
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        adminData.profileImg = secure_url;
    }
    // Create user in the database
    const admin = yield user_model_1.User.create(adminData);
    return admin;
});
const getMe = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === "user") {
        result = yield user_model_1.User.findOne({ id: userId });
    }
    if (role === "admin") {
        result = yield user_model_1.User.findOne({ id: userId });
    }
    return result;
});
exports.UserServices = {
    createUserFromDB,
    createAdminFromDB,
    getMe,
};
