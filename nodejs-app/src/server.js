import express from 'express';
import cors from 'cors';
import PinoHttp from 'pino-http';
import 'dotenv/config';

const app = express();

const logger = PinoHttp({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat:
        '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
      hideObject: true,
    },
  },
});
app.use(logger);

app.use(express.json());
app.use(cors());

app.get('/notes', async (req, res) =>
  res.status(200).json({
    message: 'Retrieved all notes',
  }),
);

app.get('/notes/:noteId', async (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({
    message: `Retrieved note with ID: ${noteId}`,
  });
});

app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found`,
  });
});

app.use((error, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd
    ? 'Something went wrong. Please try again later.'
    : error.message;

  res.status(500).json({
    message,
  });
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Server running ${port} port`));
