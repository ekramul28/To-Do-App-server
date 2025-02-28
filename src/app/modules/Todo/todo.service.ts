import { User } from "../User/user.model";
import { ITodo } from "./todo.interface";
import { Todo } from "./todo.model";
import {
  createGoogleEvent,
  deleteGoogleEvent,
  updateGoogleEvent,
} from "./todo.utils";

const createTodo = async (todoData: ITodo) => {
  console.log("data44", todoData);
  const user = await User.findOne({ email: todoData.userEmail });
  console.log({ user });
  if (!user || user.isDeleted) {
    throw new Error("User not found or has been deleted.");
  }

  const todo = await Todo.create(todoData);
  if (user.isGoogleAuth) {
    try {
      const eventId = await createGoogleEvent(todo);
      console.log("event", eventId);
      todo.googleEventId = eventId ?? undefined;
      await todo.save();
    } catch (error) {
      console.log(error);
    }
  }
  console.log(todo);
  return todo;
};

const getTodos = async (email: string) => {
  return await Todo.find({ userEmail: email });
};

const updateTodo = async (_id: string, updateData: Partial<ITodo>) => {
  try {
    const todo = await Todo.findByIdAndUpdate(_id, updateData, { new: true });
    console.log("this is todo", todo);

    if (todo?.googleEventId) {
      await updateGoogleEvent(todo);
    }
    return todo;
  } catch (error) {
    console.log(error);
  }
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
