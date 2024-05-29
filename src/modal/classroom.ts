import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const TeacherSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ClassroomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    students: [StudentSchema],
    teacher: [TeacherSchema],
    owner: { type: String, required: true },
    profilePicture: { type: String },
    roomCode: { type: String },
    status: { type: Boolean ,default:false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    teacherCode:{type:String}
  },
  { timestamps: true }
);

export const Classroom = mongoose.model("Classroom", ClassroomSchema);
