import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { connectToDatabase } from "./config/connection";
import { errorHandler } from "./middleware/errorHandler";
import authRouter from "./routes/authRouter";
import classRouter from "./routes/classroomRoute";

const CLIENT_URL = process.env.CLIENT_URL;
const app = express();

// Use cookieParser middleware
app.use(cookieParser());
const httpServer = require("http").createServer(app);

app.use(express.json());
app.use(
  session({
    secret: "your_session_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  cors({
    origin: `${CLIENT_URL}`,
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);


app.use(express.static("src/public"));
app.use("/auth", authRouter);
app.use("/class", classRouter);

const port = process.env.PORT ;

connectToDatabase()
  .then(() => {
    app.use(errorHandler);
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
