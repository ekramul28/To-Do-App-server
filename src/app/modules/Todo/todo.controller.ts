import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TodoService } from "./todo.service";

const createTodoHandler = catchAsync(async (req, res) => {
  const result = await TodoService.createTodo({
    ...req.body,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "createTodo added successfully!",
    data: result,
  });
});
const getTodoHandler = catchAsync(async (req, res) => {
  const { email } = req.params;
  console.log(email);
  const result = await TodoService.getTodos(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "getTodo  successfully!",
    data: result,
  });
});
const updateTodoHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  console.log(id);
  const result = await TodoService.updateTodo(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "updateTodo  successfully!",
    data: result,
  });
});
const deleteTodoHandler = catchAsync(async (req, res) => {
  const result = await TodoService.deleteTodo(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "To-Do Delete  successfully!",
    data: result,
  });
});

export const TodoController = {
  createTodoHandler,
  getTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
};
