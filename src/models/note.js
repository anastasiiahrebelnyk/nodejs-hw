import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    tag: {
      type: String,
      default: 'Todo',
      enum: TAGS,
    },
  },
  { versionKey: false, timestamps: true },
);

const Note = model('Note', noteSchema);

export default Note;
