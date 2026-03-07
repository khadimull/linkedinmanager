import express from 'express';
import cors from 'cors';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimit } from './middleware/rateLimit';
import authRoutes from './routes/auth';
import accountRoutes from './routes/accounts';
import campaignRoutes from './routes/campaigns';
import leadRoutes from './routes/leads';
import aiRoutes from './routes/ai';

const app = express();

app.use(cors({ 
  origin: config.FRONTEND_URL, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit(100, 60000));

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (_, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.use(errorHandler);

const PORT = parseInt(config.PORT, 10);
app.listen(PORT, '0.0.0.0', () => {
  logger.info('Server running on port ' + PORT);
  logger.info('Health check: http://localhost:' + PORT + '/health');
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});
