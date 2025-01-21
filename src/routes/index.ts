import express, { Router } from "express";
import AuthRoutes from "./authRoutes";
import MembershipRoutes from "./membershipRoutes";
import UserRoutes from "./userRoutes";
import WorkshopRoutes from "./workshopRoutes";
import CommentRoutes from "./commentRoutes";

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
  {
    path: "/membership",
    route: MembershipRoutes,
  },
  {
    path: "/workshops",
    route: WorkshopRoutes,
  },
  {
    path: "/comments",
    route: CommentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
