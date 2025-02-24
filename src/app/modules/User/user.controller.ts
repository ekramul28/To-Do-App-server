import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserServices } from "./user.service";
const createUser = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createUserFromDB(
    req.file,
    password,
    studentData
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: result,
  });
});

export const UserControllers = {
  createUser,
};
