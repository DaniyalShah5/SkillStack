import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import deleteRoutes from './routes/deleteRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import stripeWebhook from './routes/stripeWebhook.js'
import dotenv from 'dotenv';
import courseDes from './routes/CourseDesRoutes.js'
import chatRoutes from './routes/chatRoutes.js';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { handleSocketEvents } from './controllers/chatController.js';

dotenv.config();

const allowedOrigins = [
  'http://localhost:5173',                      
  'https://lambent-dasik-e1878e.netlify.app'   
];


const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = "https://lambent-dasik-e1878e.netlify.app";

const io = new SocketServer(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});
handleSocketEvents(io);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use('/api/config', stripeWebhook)


app.use(bodyParser.json());


connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', deleteRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api',courseDes);
app.use('/api/chat', chatRoutes); 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
