import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { UserStatus } from '../types';

const prisma = new PrismaClient();

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { status, collegeId, graduationYear, degree, currentCompany, yearsExperience, currentRole, lookingFor, profilePhotoUrl } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(status && { status: status as UserStatus }),
        ...(collegeId !== undefined && { collegeId }),
        ...(graduationYear !== undefined && { graduationYear: graduationYear ? parseInt(graduationYear, 10) : null }),
        ...(degree !== undefined && { degree }),
        ...(currentCompany !== undefined && { currentCompany }),
        ...(yearsExperience !== undefined && { yearsExperience: yearsExperience ? parseInt(yearsExperience, 10) : null }),
        ...(currentRole !== undefined && { currentRole }),
        ...(lookingFor !== undefined && { lookingFor: Array.isArray(lookingFor) ? JSON.stringify(lookingFor) : lookingFor }),
        ...(profilePhotoUrl !== undefined && { profilePhotoUrl })
      },
      include: { college: true }
    });

    const { passwordHash: _, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        college: true,
        posts: {
          where: { status: 'PUBLISHED' },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { company: true, college: true }
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
