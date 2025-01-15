import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import dbConnect from "./config/dbConnect";
import errorHandler from "./utils/errorHandler";
import notFound from "./utils/notFound";

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is running perfectly!" });
});

dbConnect();

app.use(notFound);
app.use(errorHandler);

export default app;
