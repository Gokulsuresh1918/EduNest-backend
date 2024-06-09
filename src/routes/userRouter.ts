// routes.js

import express from "express";
import { userData,getClassData ,updateUsername} from "../controller/userController";

const router = express.Router();

router.get("/userData/:id", userData);
router.get("/getClassData/:id", getClassData);
router.post("/updateUsername", updateUsername);


export default router;
