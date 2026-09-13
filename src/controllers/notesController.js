import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    // sortBy = '_id',
    // sortOrder = 'asc',
    tag,
    search,
  } = req.query;
  const userId = req.user._id;
  const skip = (page - 1) * perPage;
  const notesQuery = Note.find();
  if (userId) {
    notesQuery.where('userId').equals(userId);
  }
  if (tag) {
    notesQuery.where('tag').equals(tag);
  }
  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const [notes, totalNotes] = await Promise.all([
    notesQuery.clone().skip(skip).limit(perPage).populate('userId', 'username'),

    // .sort({
    //   [sortBy]: sortOrder,
    //  }),
    notesQuery.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);
  res.json({
    notes,
    totalNotes,
    totalPages,
    page,
    perPage,
  });
  // console.log(req.query);

  // res.json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  // const userId = req.user._id;
  const { _id: userId } = req.user;
  // const singleNote = await Note.findOne({ ...noteId }, userId);
  const singleNote = await Note.findOne({ _id: noteId, userId });

  if (!singleNote) {
    throw createHttpError(404, 'Note not found');
  }

  res.json(singleNote);
  // res.status(200).json({
  //   message: `Retrieved note with ID: ${noteId}`,
  // });
};

export const createNote = async (req, res) => {
  const userId = req.user._id;
  // console.log(req.body);
  const newNote = await Note.create({ ...req.body, userId });
  await newNote.populate('userId', 'username');
  res.status(201).json(newNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;
  const updateNote = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    req.body,
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );
  if (!updateNote) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(updateNote);
};
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const { _id: userId } = req.user;

  const deleteNote = await Note.findOneAndDelete({ _id: noteId, userId });
  if (!deleteNote) {
    throw createHttpError(404, 'Note not found');
  }
  // res.json(deletePost);
  res.status(200).json(deleteNote);
};
