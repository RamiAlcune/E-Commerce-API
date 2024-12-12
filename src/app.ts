//Security
import helmet from "helmet";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { notFound } from "./middlewares/notfound";
import { errorHandlerMiddleware } from "./middlewares/errorhandler";
dotenv.config();
//Routes
import AuthRoutes from "./routes/authRoutes";
import UsersRoute from "./routes/usersRoute";
import ProductRoute from "./routes/productRoutes";
import ReviewRoute from "./routes/reviewRoute";
import orderRouter from "./routes/orderRoute";
//
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import "express-async-errors";

const app: Application = express();
//middlewares
app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());
//Security
app.set("trust proxy", 1);
app.use(cors());
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
//TEST
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("API is running on Render!");
});

//Routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UsersRoute);
app.use("/api/v1/products", ProductRoute);
app.use("/api/v1/reviews", ReviewRoute);
app.use("/api/v1/orders", orderRouter);
//ErrorsHandler
app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;
const start = async () => {
  try {
    app.listen(port, () => console.log(`Server is Listing on PORT ${port}`));
  } catch (error) {
    console.error(error);
  }
};
start();
