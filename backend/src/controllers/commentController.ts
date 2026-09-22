import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getPostComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: postId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { postId, parentCommentId: null },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, status: true, profilePhotoUrl: true }
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            author: {
              select: { id: true, name: true, status: true, profilePhotoUrl: true }
            }
          }
        }
      }
    });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id: postId } = req.params;
    const { body, parentCommentId } = req.body;

    if (!body || body.trim() === '') {
      res.status(400).json({ error: 'Comment text cannot be empty' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId: req.user.id,
        body,
        parentCommentId: parentCommentId || null
      },
      include: {
        author: {
          select: { id: true, name: true, status: true, profilePhotoUrl: true }
        }
      }
    });

    await prisma.post.update({
      where: { id: postId },
      data: { commentCount: { increment: 1 } }
    }).catch(() => {});

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};
