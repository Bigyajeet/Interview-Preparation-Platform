import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, AuthRequest } from '../middleware/auth';
import { UserStatus } from '../types';

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, status, collegeId, graduationYear, degree, currentCompany, yearsExperience, currentRole, lookingFor } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email is already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const parsedStatus = (status as UserStatus) || 'STUDENT';

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        status: parsedStatus,
        collegeId: collegeId || null,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
        degree: degree || null,
        currentCompany: currentCompany || null,
        yearsExperience: yearsExperience ? parseInt(yearsExperience, 10) : null,
        currentRole: currentRole || null,
        lookingFor: Array.isArray(lookingFor) ? JSON.stringify(lookingFor) : '[]'
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        role: true,
        collegeId: true,
        graduationYear: true,
        degree: true,
        currentCompany: true,
        yearsExperience: true,
        currentRole: true,
        lookingFor: true,
        profilePhotoUrl: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error during signup' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { college: true }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { college: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { passwordHash: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
