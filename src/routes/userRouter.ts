// routes.js

import express from "express";
import {
  userData,
  getClassData,
  allUserData,
  classroomData,
  updateUser,
  updateUsername,
  addUser,
  updateClass,
  findUser,
} from "../controller/userController";

const router = express.Router();

router.get("/userData", userData);
router.patch("/updateUser/:id", updateUser);
router.put("/updateClass/:id", updateClass);

router.get("/allUserData", allUserData);
router.get("/classroomData", classroomData);

router.get("/getClassData/:id", getClassData);
router.post("/updateUsername", updateUsername);

router.post("/addUser", addUser);
router.post("/findUser", findUser);

export default router;
