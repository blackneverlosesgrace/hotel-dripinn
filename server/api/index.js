// Vercel Serverless Function Handler
import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use the routes from routes.js
app.use(routes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Hotel Dripinn API is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;
