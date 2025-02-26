import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { TodoRoutes } from "../modules/Todo/todo.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/todo",
    route: TodoRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
