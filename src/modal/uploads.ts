

import mongoose, { Schema } from "mongoose";
import {User} from '../modal/users'

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  classCode: {
    type: String,
  },
  uploaderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const  File = mongoose.model('File', fileSchema);


