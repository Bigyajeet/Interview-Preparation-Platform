import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getColleges = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string;
    const colleges = await prisma.college.findMany({
      where: search ? { name: { contains: search } } : undefined,
      take: 20,
      orderBy: { name: 'asc' }
    });
    res.json(colleges);
  } catch (error) {
    console.error('Get colleges error:', error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
};

export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = req.query.search as string;
    const companies = await prisma.company.findMany({
      where: search ? { name: { contains: search } } : undefined,
      take: 20,
      orderBy: { name: 'asc' }
    });
    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};
