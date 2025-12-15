import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';
import { requireAuth } from './middlewares/auth.middleware';
import authRoutes from './routes/auth.routes';
import subscriptionRoutes from './routes/subscription.routes';
import widgetRoutes from './routes/widget.routes';
import adminRoutes from './routes/admin.routes';
import integrationRoutes from './routes/integration.routes';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));

// Mount subscription routes BEFORE global express.json() to handle raw body for webhooks
app.use('/api/subscriptions', subscriptionRoutes);

app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/widgets', widgetRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/integrations', integrationRoutes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
