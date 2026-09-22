import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ReportStatus, PostStatus } from '../types';

const prisma = new PrismaClient();

export const submitReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { postId, commentId, reason } = req.body;

    if (!reason) {
      res.status(400).json({ error: 'Reason for report is required' });
      return;
    }

    const report = await prisma.report.create({
      data: {
        postId: postId || null,
        commentId: commentId || null,
        reportedById: req.user.id,
        reason,
        status: 'OPEN'
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
};

export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status = 'OPEN' } = req.query;

    const reports = await prisma.report.findMany({
      where: { status: (status as string).toUpperCase() as ReportStatus },
      orderBy: { createdAt: 'desc' },
      include: {
        reportedBy: { select: { id: true, name: true, email: true } },
        post: {
          select: { id: true, title: true, status: true, author: { select: { id: true, name: true } } }
        },
        comment: {
          select: { id: true, body: true, author: { select: { id: true, name: true } } }
        }
      }
    });

    res.json(reports);
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

export const updateReportStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, action } = req.body;

    const report = await prisma.report.update({
      where: { id },
      data: { status: (status as ReportStatus) || 'REVIEWED' }
    });

    if (report.postId && action) {
      let postStatus: PostStatus = 'PUBLISHED';
      if (action === 'FLAG_POST') postStatus = 'FLAGGED';
      if (action === 'REMOVE_POST') postStatus = 'REMOVED';

      await prisma.post.update({
        where: { id: report.postId },
        data: { status: postStatus }
      });
    }

    res.json(report);
  } catch (error) {
    console.error('Update report status error:', error);
    res.status(500).json({ error: 'Failed to update report status' });
  }
};
