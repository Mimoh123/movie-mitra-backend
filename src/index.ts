import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './api/routes/userRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5003;

// CORS configuration - must be before routes
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/backend', userRoutes)

app.listen(port, () => {
  console.log('this is the port', port);
});
