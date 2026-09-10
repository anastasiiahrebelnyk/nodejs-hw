import express from 'express';
import cors from 'cors';

import 'dotenv/config';
import connectDatabase from './db/connectMongoDB.js';
import logger from './middleware/logger.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';
import postsRouter from './routes/notesRoutes.js';

const app = express();

app.use(logger);

app.use(express.json());
app.use(cors());

app.use('/notes', postsRouter);

app.get('/notes/:noteId');

app.use(notFoundHandler);

app.use(errorHandler);

connectDatabase();

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Server running ${port} port`));
