import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";

const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static("Backend/uploads"));

app.get("/", (req, res) => {
  res.send("API is running....");
});
// app.use("/api/users", userRoutes);
// app.use("/api/admin", adminRoutes);
try {
  app.listen(port, () => console.log(`Server started on port ${port}`));
} catch (error) {    
  console.log(error);
}
