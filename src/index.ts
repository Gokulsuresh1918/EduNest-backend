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
import userRouter from "./routes/userRouter";
import { Server } from "socket.io";
import  nodeCron  from "node-cron";


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

interface SocketCallback {
  (data?: any): void;
}

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // console.log("A user connected");

  // Handle start call event
  socket.on("startCall", (data) => {
    io.emit("callStarted", data);
  });

  // Handle drawing event
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  // Handle task assigned event
  socket.on("taskAssigned", (data) => {
    console.log('Task assigned:', data);
    io.emit("assigned", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected on Socket");
  });
});




app.use(express.static("src/public"));
app.use("/auth", authRouter);
app.use("/class", classRouter);
app.use("/user", userRouter);

const port = process.env.PORT;

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
