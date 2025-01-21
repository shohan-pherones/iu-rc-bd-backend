"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const commentRoutes_1 = __importDefault(require("./commentRoutes"));
const membershipRoutes_1 = __importDefault(require("./membershipRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const workshopRoutes_1 = __importDefault(require("./workshopRoutes"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes_1.default,
    },
    {
        path: "/users",
        route: userRoutes_1.default,
    },
    {
        path: "/membership",
        route: membershipRoutes_1.default,
    },
    {
        path: "/workshops",
        route: workshopRoutes_1.default,
    },
    {
        path: "/comments",
        route: commentRoutes_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
