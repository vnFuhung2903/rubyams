import express, { Request, Response } from 'express';
import * as dotenv from "dotenv";
import cors from 'cors';

import bidRoutes from './controller/bid';
import voteRoutes from './controller/vote';
import courseRoutes from './controller/course';
import studentRoutes from './controller/student';

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/bids', bidRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});