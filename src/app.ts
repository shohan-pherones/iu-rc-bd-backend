import cors from "cors";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import dbConnect from "./utils/dbConnect";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running perfectly!" });
});

dbConnect();

export default app;
