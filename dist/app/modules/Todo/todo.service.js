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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const todo_model_1 = require("./todo.model");
const todo_utils_1 = require("./todo.utils");
const createTodo = (todoData) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = yield todo_model_1.Todo.create(todoData);
    if (todoData.user) {
        const eventId = yield (0, todo_utils_1.createGoogleEvent)(todo);
        todo.googleEventId = eventId !== null && eventId !== void 0 ? eventId : undefined;
        yield todo.save();
    }
    return todo;
});
const getTodos = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield todo_model_1.Todo.find({ user: userId });
});
const updateTodo = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = yield todo_model_1.Todo.findByIdAndUpdate(id, updateData, { new: true });
    if (todo === null || todo === void 0 ? void 0 : todo.googleEventId) {
        yield (0, todo_utils_1.updateGoogleEvent)(todo);
    }
    return todo;
});
const deleteTodo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = yield todo_model_1.Todo.findByIdAndDelete(id);
    if (todo === null || todo === void 0 ? void 0 : todo.googleEventId) {
        yield (0, todo_utils_1.deleteGoogleEvent)(todo.googleEventId);
    }
    return todo;
});
exports.TodoService = {
    createTodo,
    getTodos,
    updateTodo,
    deleteTodo,
};
