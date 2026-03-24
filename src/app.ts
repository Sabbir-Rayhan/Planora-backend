import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middleware/globalErrorHandler.js';
import notFound from './app/middleware/notFound.js';
import { IndexRoutes } from './Routes/index.js';

const app: Application = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    process.env.FRONTEND_URL as string,
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Planora API is running!' });
});

app.use('/api/v1', IndexRoutes);
app.use(globalErrorHandler);
app.use(notFound);

export default app;