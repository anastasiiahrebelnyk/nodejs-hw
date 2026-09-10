import { Router } from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

const postsRouter = Router();

postsRouter.get('/', getAllNotes);

postsRouter.get('/:noteId', getNoteById);

postsRouter.post('/', createNote);

postsRouter.patch('/:noteId', updateNote);

postsRouter.delete('/:noteId', deleteNote);

export default postsRouter;
