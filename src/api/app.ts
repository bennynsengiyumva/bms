import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import candidateRoutes from './routes/candidate.routes';
import lessonRoutes from './routes/lesson.routes';
import spiritualRoutes from './routes/spiritual.routes';
import baptismRoutes from './routes/baptism.routes';
import reportRoutes from './routes/report.routes';
import memberRoutes from './routes/member.routes';
import documentRoutes from './routes/document.routes';
import notificationRoutes from './routes/notification.routes';
import instructorRoutes from './routes/instructor.routes';
import churchRoutes from './routes/church.routes';
import mfaRoutes from './routes/mfa.routes';
import auditRoutes from './routes/audit.routes';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/spiritual', spiritualRoutes);
app.use('/api/baptism', baptismRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/instructors', instructorRoutes);
app.use('/api/churches', churchRoutes);
app.use('/api/mfa', mfaRoutes);
app.use('/api/audit', auditRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;
