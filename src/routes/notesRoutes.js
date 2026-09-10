import { Router } from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';

const notesRouter = Router();

notesRouter.get('/notes/', getAllNotes);

notesRouter.get('/notes/:noteId', getNoteById);

notesRouter.post('/notes/', createNote);

notesRouter.patch('/notes/:noteId', updateNote);

notesRouter.delete('/notes/:noteId', deleteNote);

export default notesRouter;
