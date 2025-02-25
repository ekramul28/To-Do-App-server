import express from "express";
import { TodoController } from "./todo.controller";
import { createTodoSchema, updateTodoSchema } from "./todo.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/",
  validateRequest(createTodoSchema),
  TodoController.createTodoHandler
);
router.get("/", TodoController.getTodoHandler);

router.put(
  "/:id",
  validateRequest(updateTodoSchema),
  TodoController.updateTodoHandler
);
router.delete("/:id", TodoController.deleteTodoHandler);

export const TodoRoutes = router;
