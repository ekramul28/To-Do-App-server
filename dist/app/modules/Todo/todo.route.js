"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRoutes = void 0;
const express_1 = __importDefault(require("express"));
const todo_controller_1 = require("./todo.controller");
const todo_validation_1 = require("./todo.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.post("/", (0, validateRequest_1.default)(todo_validation_1.createTodoSchema), todo_controller_1.TodoController.createTodoHandler);
router.get("/", todo_controller_1.TodoController.getTodoHandler);
router.put("/:id", (0, validateRequest_1.default)(todo_validation_1.updateTodoSchema), todo_controller_1.TodoController.updateTodoHandler);
router.delete("/:id", todo_controller_1.TodoController.deleteTodoHandler);
exports.TodoRoutes = router;
