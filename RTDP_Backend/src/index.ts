import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/connectDB';
import { PORT } from './config/envConfig';
import { HttpStatus } from './utils/constants';
import errorHandler from './middleware/errorHandler';
import dataLogRoutes from './routes/dataLogRoutes';


const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
// app.use(cors({
//     origin: ALLOWED_ORIGIN || 'http://localhost:5173',
//     methods: ['GET', 'POST']
// }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/dataLog', dataLogRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
    return res.status(HttpStatus.NOT_FOUND).json({ message: 'Route not found', success: false });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.info(`===> Server running on port ${PORT}`);
});