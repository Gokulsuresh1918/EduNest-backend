import express from "express";
import { createClassroom,getClassData,getStudentData,deleteClass } from "../controller/classController/createdClass";
import { joinClass } from "../controller/classController/joinedClass";
import authenticateToken from "../middleware/authMiddleware";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/createClassroom",verifyToken, createClassroom);
router.post("/joinClass", joinClass);
router.get("/getClassData/:id", getClassData);
router.get("/getStudentData/:id", getStudentData);
router.patch("/deleteClass/:id", deleteClass);
// router.patch("/classrooomUpdate", classrooomUpdate);

export default router;