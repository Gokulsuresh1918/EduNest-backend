import mongoose from "mongoose";
import {User} from '../modal/users'

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  completedOn: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export const Todo = mongoose.model('Todo', todoSchema);
