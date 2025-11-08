import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import profileRoutes from './routes/profiles.js';
import eventRoutes from './routes/events.js';

dotenv.config({ path: './.env' });
console.log('Loaded URI:', process.env.MONGODB_URI);
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});