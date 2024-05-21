import { User } from "../../modal/users";
import { Request, Response } from "express";
import { Classroom } from "../../modal/classroom";

export const joinClass = async (req: Request, res: Response) => {
  const classCode = req.body.data.classcode;
  const userId = req.body.data.ownerId;
  console.log("userID", userId);
  const classData = await Classroom.findOne({ roomCode: classCode });

  const userData = await User.findById(userId);

  if (!classData || !userData) {
    return res.status(400).json({
      message: "Either classroom or user not found.",
    });
  }
  console.log("class", classData);

  console.log("userData", userData);
  const existingStudent = classData.students.find((student) =>
    student._id.equals(userData._id)
  );

  if (!existingStudent) {
    classData.students.push({
      _id: userData._id,
      createdAt: new Date(),
    });
    await classData.save();
    userData.joinedClassrooms.push(classData._id);
    await userData.save();
  }

  res.status(200).json({
    message: "Successfully joined the classroom.",
    classroom: classData,
  });
};
