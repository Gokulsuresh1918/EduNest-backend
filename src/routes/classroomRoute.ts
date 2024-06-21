import express from "express";
import {
  createClassroom,
  getClassData,
  getStudentData,
  deleteClass,
  blockUser,
  assignTask,
  bulkEmail,
  fileUpload,
  fileData,
  assignedStudent,
  classDetails
} from "../controller/classController/createdClass";
import { joinClass } from "../controller/classController/joinedClass";
import { authMiddleware } from "../middleware/authMiddleware";


const router = express.Router();

router.post("/createClassroom", createClassroom);
router.post("/joinClass", joinClass);

router.get("/getClassData/:id", getClassData);
router.get("/classDetails/:id", classDetails);
router.get("/getStudentData/:id", getStudentData);
router.get("/assignedStudent/:id", assignedStudent);

router.patch("/deleteClass/:id", deleteClass);
router.patch("/blockUser/:id", blockUser);

router.post("/assigntask", assignTask);
router.post("/bulkEmail", bulkEmail);

router.post("/fileUpload", fileUpload);
router.get("/fileData/:id", fileData);
export default router;
