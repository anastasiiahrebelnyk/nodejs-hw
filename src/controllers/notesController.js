import createHttpError from 'http-errors';
import Note from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  // res.status(200).json({
  //   message: 'Retrieved all notes',
  // });
  res.json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;

  if (!result) {
    throw createHttpError(404, 'Note not found');
  }

  const result = await Note.findById(noteId);
  res.json(result);
  // res.status(200).json({
  //   message: `Retrieved note with ID: ${noteId}`,
  // });
};
// createNote;
// deleteNote;
// updateNote;
