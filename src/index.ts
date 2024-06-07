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
  // console.log("a user connected");

  socket.on("startCall", (data) => {
    // Broadcast to all clients that a video call has started
    io.emit("callStarted", data);
  });
  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data); 
  });
  socket.on("disconnect", () => {
    console.log("user disconnected on Socket");
  });
});



app.use(express.static("src/public"));
app.use("/auth", authRouter);
app.use("/class", classRouter);

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
