import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './api/routes/userRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5003;
app.use(express.json());
app.use(cors());
app.use('/api/backend', userRoutes)

app.listen(port, () => {
  console.log('this is the port', port);
});
