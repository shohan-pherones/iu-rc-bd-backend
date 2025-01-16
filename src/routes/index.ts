import express, { Router } from "express";
import AuthRoutes from "./authRoutes";
import UserRoutes from "./userRoutes";

const router: Router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
