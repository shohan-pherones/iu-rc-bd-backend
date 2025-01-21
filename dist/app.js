"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = __importDefault(require("./utils/errorHandler"));
const notFound_1 = __importDefault(require("./utils/notFound"));
const envConfig_1 = __importDefault(require("./config/envConfig"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: envConfig_1.default.frontend_url,
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is running perfectly!" });
});
app.use("/api/v1", routes_1.default);
(0, dbConnect_1.default)();
app.use(notFound_1.default);
app.use(errorHandler_1.default);
exports.default = app;
