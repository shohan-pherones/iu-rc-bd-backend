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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const workshopModel_1 = __importDefault(require("../models/workshopModel"));
node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    try {
        yield workshopModel_1.default.updateMany({ dateTime: { $lte: now }, status: "upcoming" }, { $set: { status: "running" } });
        yield workshopModel_1.default.updateMany({
            status: "running",
            $expr: {
                $lte: [
                    { $add: ["$dateTime", { $multiply: ["$duration", 3600000] }] },
                    now,
                ],
            },
        }, { $set: { status: "past" } });
        console.log("Workshop statuses updated");
    }
    catch (err) {
        console.error("Error updating workshop statuses:", err);
    }
}));
