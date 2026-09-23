import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { apiRateLimiter, strictRateLimiter } from './middleware/rateLimiter';
import { authenticateToken, optionalAuth, requireAdminOrMod } from './middleware/auth';

import * as authController from './controllers/authController';
import * as userController from './controllers/userController';
import * as lookupController from './controllers/lookupController';
import * as postController from './controllers/postController';
import * as commentController from './controllers/commentController';
import * as moderationController from './controllers/moderationController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(apiRateLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'interview-platform-backend' });
});

app.post('/api/auth/signup', strictRateLimiter, authController.signup);
app.post('/api/auth/login', strictRateLimiter, authController.login);
app.get('/api/auth/me', authenticateToken, authController.getMe);

app.patch('/api/users/me', authenticateToken, userController.updateProfile);
app.get('/api/users/:id', optionalAuth, userController.getUserById);

app.get('/api/colleges', lookupController.getColleges);
app.get('/api/companies', lookupController.getCompanies);

app.get('/api/posts', optionalAuth, postController.getPosts);
app.post('/api/posts', authenticateToken, strictRateLimiter, postController.createPost);
app.get('/api/posts/:id', optionalAuth, postController.getPostById);
app.post('/api/posts/:id/upvote', authenticateToken, postController.toggleUpvote);
app.post('/api/posts/:id/bookmark', authenticateToken, postController.toggleBookmark);

app.get('/api/posts/:id/comments', commentController.getPostComments);
app.post('/api/posts/:id/comments', authenticateToken, strictRateLimiter, commentController.createComment);

app.post('/api/reports', authenticateToken, moderationController.submitReport);
app.get('/api/moderation/reports', authenticateToken, requireAdminOrMod, moderationController.getReports);
app.patch('/api/moderation/reports/:id', authenticateToken, requireAdminOrMod, moderationController.updateReportStatus);

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
});
