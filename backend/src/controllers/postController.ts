import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { CategoryType, InterviewMode, InterviewResult, PostStatus } from '../types';

const prisma = new PrismaClient();

export const getPosts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      category,
      companyId,
      collegeId,
      mode,
      result,
      search,
      sort = 'recent',
      cursor,
      limit = '10'
    } = req.query;

    const pageSize = Math.min(parseInt(limit as string, 10) || 10, 50);

    const where: any = {
      status: 'PUBLISHED'
    };

    if (category) {
      const catEnum = (category as string).toUpperCase() as CategoryType;
      where.categories = {
        some: { category: catEnum }
      };
    }

    if (companyId) where.companyId = companyId as string;
    if (collegeId) where.collegeId = collegeId as string;
    if (mode) where.interviewMode = (mode as string).toUpperCase() as InterviewMode;
    if (result) where.result = (result as string).toUpperCase() as InterviewResult;

    if (search) {
      const searchTerm = search as string;
      where.OR = [
        { title: { contains: searchTerm } },
        { body: { contains: searchTerm } },
        { roleApplied: { contains: searchTerm } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'upvoted') orderBy = { upvoteCount: 'desc' };
    if (sort === 'commented') orderBy = { commentCount: 'desc' };

    let cursorObj: any = undefined;
    if (cursor) {
      cursorObj = { id: cursor as string };
    }

    const posts = await prisma.post.findMany({
      where,
      take: pageSize + 1,
      cursor: cursorObj,
      skip: cursorObj ? 1 : 0,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            status: true,
            currentRole: true,
            currentCompany: true,
            degree: true,
            graduationYear: true,
            college: { select: { id: true, name: true } }
          }
        },
        company: true,
        college: true,
        categories: true,
        tags: { include: { tag: true } }
      }
    });

    let nextCursor: string | null = null;
    if (posts.length > pageSize) {
      const nextItem = posts.pop();
      nextCursor = nextItem?.id || null;
    }

    const sanitizedPosts = posts.map(post => {
      return {
        ...post,
        author: post.isAnonymous
          ? { id: 'anonymous', name: 'Anonymous Candidate', status: post.author?.status, college: post.college }
          : post.author,
        isUpvoted: false,
        isBookmarked: false
      };
    });

    res.json({
      posts: sanitizedPosts,
      nextCursor
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const createPost = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const {
      title,
      body,
      categories,
      companyId,
      collegeId,
      roleApplied,
      interviewMode,
      roundsCount,
      result,
      isAnonymous
    } = req.body;

    if (!title || !body || !roleApplied) {
      res.status(400).json({ error: 'Title, body, and role applied are required' });
      return;
    }

    const categoryList: CategoryType[] = Array.isArray(categories) && categories.length > 0
      ? categories.map((c: string) => c.toUpperCase() as CategoryType)
      : ['COMPANY'];

    const formattedBody = typeof body === 'string' ? body : JSON.stringify(body);

    const post = await prisma.post.create({
      data: {
        authorId: req.user.id,
        title,
        body: formattedBody,
        companyId: companyId || null,
        collegeId: collegeId || null,
        roleApplied,
        interviewMode: (interviewMode as InterviewMode) || 'ON_CAMPUS',
        roundsCount: roundsCount ? parseInt(roundsCount, 10) : 1,
        result: (result as InterviewResult) || 'SELECTED',
        isAnonymous: Boolean(isAnonymous),
        status: 'PUBLISHED',
        categories: {
          create: categoryList.map(cat => ({ category: cat }))
        }
      },
      include: {
        company: true,
        college: true,
        categories: true,
        author: {
          select: { id: true, name: true, status: true }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getPostById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    }).catch(() => {});

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            status: true,
            currentRole: true,
            currentCompany: true,
            degree: true,
            graduationYear: true,
            college: { select: { id: true, name: true } }
          }
        },
        company: true,
        college: true,
        categories: true,
        tags: { include: { tag: true } }
      }
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    let isUpvoted = false;
    let isBookmarked = false;

    if (req.user) {
      const upvote = await prisma.postUpvote.findUnique({
        where: { userId_postId: { userId: req.user.id, postId: id } }
      });
      const bookmark = await prisma.bookmark.findUnique({
        where: { userId_postId: { userId: req.user.id, postId: id } }
      });
      isUpvoted = !!upvote;
      isBookmarked = !!bookmark;
    }

    const sanitizedPost = {
      ...post,
      author: post.isAnonymous
        ? { id: 'anonymous', name: 'Anonymous Candidate', status: post.author?.status, college: post.college }
        : post.author,
      isUpvoted,
      isBookmarked
    };

    res.json(sanitizedPost);
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch post details' });
  }
};

export const toggleUpvote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id: postId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.postUpvote.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existing) {
      await prisma.postUpvote.delete({
        where: { userId_postId: { userId, postId } }
      });
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { upvoteCount: { decrement: 1 } },
        select: { upvoteCount: true }
      });
      res.json({ upvoted: false, upvoteCount: updatedPost.upvoteCount });
    } else {
      await prisma.postUpvote.create({
        data: { userId, postId }
      });
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { upvoteCount: { increment: 1 } },
        select: { upvoteCount: true }
      });
      res.json({ upvoted: true, upvoteCount: updatedPost.upvoteCount });
    }
  } catch (error) {
    console.error('Toggle upvote error:', error);
    res.status(500).json({ error: 'Failed to toggle upvote' });
  }
};

export const toggleBookmark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { id: postId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.bookmark.findUnique({
      where: { userId_postId: { userId, postId } }
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { userId_postId: { userId, postId } }
      });
      res.json({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: { userId, postId }
      });
      res.json({ bookmarked: true });
    }
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
};
