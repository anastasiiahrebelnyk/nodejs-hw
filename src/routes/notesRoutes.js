import { Router } from 'express';
import {
  createNote,
  getAllNotes,
  getNoteById,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
import { celebrate } from 'celebrate';
import {
  createNoteSchema,
  getAllNotesSchema,
  noteIdSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';
import { authenticate } from '../middleware/authenticate.js';

const notesRouter = Router();

notesRouter.use('/notes', authenticate);

notesRouter.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

notesRouter.get('/notes/:noteId', celebrate(noteIdSchema), getNoteById);

notesRouter.post(
  '/notes',
  celebrate(createNoteSchema, { abortEarly: false }),
  createNote,
);

notesRouter.patch(
  '/notes/:noteId',
  celebrate(updateNoteSchema, { abortEarly: false }),
  updateNote,
);

notesRouter.delete('/notes/:noteId', celebrate(noteIdSchema), deleteNote);

export default notesRouter;
