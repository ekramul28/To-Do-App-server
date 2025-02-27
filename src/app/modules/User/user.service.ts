import config from "../../config";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { User } from "./user.model";

type TUser = {
  email: string;
  password: string;
  role: string;
  profileImg: string;
  name: string;
  userStatus: string;
};

const createUserFromDB = async (file: any, data: any) => {
  const userData: Partial<TUser> = {};

  // Use default password if not provided
  userData.password = data.password || (config.default_password as string);

  userData.name = data.name;

  // Set user email
  userData.email = data.email;
  if (file) {
    const imageName = `${userData.email}${userData?.name}`;
    const path = file?.path;

    //send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    userData.profileImg = secure_url as string;
  }
  // Create user in the database
  console.log("last user data", userData);
  const user = await User.create(userData);

  return user;
};
const createAdminFromDB = async (file: any, data: any) => {
  const adminData: Partial<TUser> = {};

  // Use default password if not provided
  adminData.password = data.password || (config.default_password as string);

  // Set user role
  adminData.role = "admin";

  // Set user email
  adminData.email = data.email;
  if (file) {
    const imageName = `${adminData.email}${adminData?.name}`;
    const path = file?.path;

    //send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    adminData.profileImg = secure_url as string;
  }
  // Create user in the database
  const admin = await User.create(adminData);

  return admin;
};

const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === "user") {
    result = await User.findOne({ id: userId });
  }
  if (role === "admin") {
    result = await User.findOne({ id: userId });
  }

  return result;
};

export const UserServices = {
  createUserFromDB,
  createAdminFromDB,
  getMe,
};
