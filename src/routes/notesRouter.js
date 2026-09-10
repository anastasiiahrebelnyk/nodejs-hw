import { Router } from 'express';
import { getAllNotes, getNoteById } from '../controllers/notesController.js';

const postsRouter = Router();

postsRouter.get('/', getAllNotes);

postsRouter.get('/:noteId', getNoteById);

export default postsRouter;
