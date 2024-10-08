import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import authRoutes from "./routes/auth";

import searchRoutes from "./routes/searchRoutes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
import cookieParser from "cookie-parser";

app.use(cookieParser());

app.use(
  cors({
    origin: "https://pern-task.vercel.app", // Your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

//
const port = process.env.PORT || 8000;
// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);

app.listen(port, () => {
  console.log("Server started on port " + port);
});
