import express from "express";
import { createClassroom,getClassData } from "../controller/classController/createdClass";
import authenticateToken from "../middleware/authMiddleware";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/createClassroom",verifyToken, createClassroom);
router.get("/getClassData", getClassData);

export default router;