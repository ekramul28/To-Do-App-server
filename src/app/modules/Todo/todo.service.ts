import { ITodo } from "./todo.interface";
import { Todo } from "./todo.model";
import {
  createGoogleEvent,
  deleteGoogleEvent,
  updateGoogleEvent,
} from "./todo.utils";

const createTodo = async (todoData: ITodo) => {
  const todo = await Todo.create(todoData);
  if (todoData.user) {
    const eventId = await createGoogleEvent(todo);
    todo.googleEventId = eventId ?? undefined;
    await todo.save();
  }
  return todo;
};

const getTodos = async (userId: string) => {
  return await Todo.find({ user: userId });
};

const updateTodo = async (id: string, updateData: Partial<ITodo>) => {
  const todo = await Todo.findByIdAndUpdate(id, updateData, { new: true });
  if (todo?.googleEventId) {
    await updateGoogleEvent(todo);
  }
  return todo;
};

const deleteTodo = async (id: string) => {
  const todo = await Todo.findByIdAndDelete(id);
  if (todo?.googleEventId) {
    await deleteGoogleEvent(todo.googleEventId);
  }
  return todo;
};

export const TodoService = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
};
