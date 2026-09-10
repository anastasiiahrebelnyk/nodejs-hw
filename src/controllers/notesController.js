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
  const singleNote = await Note.findById(noteId);
  if (!singleNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.json(singleNote);
  // res.status(200).json({
  //   message: `Retrieved note with ID: ${noteId}`,
  // });
};

export const createNote = async (req, res) => {
  // console.log(req.body);
  const newNote = await Note.create(req.body);
  res.status(201).json(newNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updateNote = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
  });
  if (!updateNote) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(updateNote);
};
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deleteNote = await Note.findByIdAndDelete(noteId);
  if (!deleteNote) {
    throw createHttpError(404, 'Note not found');
  }
  // res.json(deletePost);
  res.status(200).json(deleteNote);
};
