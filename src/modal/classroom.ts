import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  createdAt: { type: Date, default: Date.now },
});

const TeacherSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  createdAt: { type: Date, default: Date.now },
});

const ClassroomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    students: [StudentSchema], 
    teacher: [TeacherSchema], 
    owner: { type: String, required: true },
    profilePicture:{type:String},
    roomCode: { type: String, required: true, unique: true }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Classroom = mongoose.model("Classroom", ClassroomSchema);
