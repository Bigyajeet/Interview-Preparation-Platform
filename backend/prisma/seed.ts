import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  await prisma.report.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.postUpvote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.postCategory.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();
  await prisma.college.deleteMany();

  const iitb = await prisma.college.create({
    data: { name: 'IIT Bombay (Indian Institute of Technology)', city: 'Mumbai' }
  });
  const bits = await prisma.college.create({
    data: { name: 'BITS Pilani (Birla Institute of Technology and Science)', city: 'Pilani' }
  });
  const nitt = await prisma.college.create({
    data: { name: 'NIT Trichy (National Institute of Technology)', city: 'Tiruchirappalli' }
  });
  const vtu = await prisma.college.create({
    data: { name: 'Visvesvaraya Technological University (VTU)', city: 'Belagavi' }
  });
  const du = await prisma.college.create({
    data: { name: 'Delhi University (DU)', city: 'New Delhi' }
  });

  const google = await prisma.company.create({
    data: { name: 'Google', logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=120&q=80' }
  });
  const tcs = await prisma.company.create({
    data: { name: 'TCS (Tata Consultancy Services)', logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80' }
  });
  const infosys = await prisma.company.create({
    data: { name: 'Infosys', logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80' }
  });
  const microsoft = await prisma.company.create({
    data: { name: 'Microsoft', logoUrl: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&w=120&q=80' }
  });
  const amazon = await prisma.company.create({
    data: { name: 'Amazon', logoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=120&q=80' }
  });

  const defaultPasswordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Platform Admin',
      email: 'admin@interview.com',
      passwordHash: defaultPasswordHash,
      status: 'EMPLOYEE',
      currentCompany: 'Google',
      currentRole: 'Staff Software Engineer',
      yearsExperience: 7,
      role: 'ADMIN',
      lookingFor: JSON.stringify(['Networking with peers', 'Sharing my own experience'])
    }
  });

  const studentA = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'aarav@student.com',
      passwordHash: defaultPasswordHash,
      status: 'STUDENT',
      collegeId: iitb.id,
      graduationYear: 2025,
      degree: 'B.Tech Computer Science & Engineering',
      role: 'USER',
      lookingFor: JSON.stringify(['Interview experiences to prepare', 'On/off-campus placement info'])
    }
  });

  const fresherB = await prisma.user.create({
    data: {
      name: 'Priya Verma',
      email: 'priya@fresher.com',
      passwordHash: defaultPasswordHash,
      status: 'FRESHER',
      collegeId: bits.id,
      graduationYear: 2024,
      degree: 'B.E. Electrical & Electronics',
      role: 'USER',
      lookingFor: JSON.stringify(['Interview experiences to prepare', 'Referrals'])
    }
  });

  const employeeC = await prisma.user.create({
    data: {
      name: 'Rohan Gupta',
      email: 'rohan@tech.com',
      passwordHash: defaultPasswordHash,
      status: 'EMPLOYEE',
      collegeId: nitt.id,
      graduationYear: 2022,
      degree: 'B.Tech IT',
      currentCompany: 'Microsoft',
      yearsExperience: 3,
      currentRole: 'SDE-2',
      role: 'USER',
      lookingFor: JSON.stringify(['Sharing my own experience', 'Networking with peers'])
    }
  });

  const dsaTag = await prisma.tag.create({ data: { name: 'DSA' } });
  const sysDesignTag = await prisma.tag.create({ data: { name: 'System Design' } });
  const hrTag = await prisma.tag.create({ data: { name: 'HR Round' } });
  const dynamicProgTag = await prisma.tag.create({ data: { name: 'Dynamic Programming' } });
  const behavioralTag = await prisma.tag.create({ data: { name: 'Behavioral' } });

  const post1 = await prisma.post.create({
    data: {
      authorId: studentA.id,
      title: 'Google SDE-1 Interview Experience — On-Campus 2025 (Selected)',
      body: JSON.stringify([
        {
          round: 'Round 1: Online Assessment (90 mins)',
          description: 'Two algorithmic questions on Graph traversal and Sliding Window array optimizations. 100% test cases passed.'
        },
        {
          round: 'Round 2: Technical Interview 1 (DSA)',
          description: 'Focus on Binary Search Tree mutations and finding K-th smallest element. Interviewer checked edge cases thoroughly.'
        },
        {
          round: 'Round 3: Technical Interview 2 (System & Data Structure)',
          description: 'Design a distributed rate limiter algorithm (Token Bucket vs Leaky Bucket) with memory limits.'
        },
        {
          round: 'Round 4: Googleyness & Leadership',
          description: 'Behavioral scenarios: How do you handle conflict in team projects? How do you prioritize deadlines?'
        }
      ]),
      companyId: google.id,
      collegeId: iitb.id,
      roleApplied: 'Software Development Engineer - 1',
      interviewMode: 'ON_CAMPUS',
      roundsCount: 4,
      result: 'SELECTED',
      isAnonymous: false,
      upvoteCount: 42,
      commentCount: 5,
      viewCount: 380,
      status: 'PUBLISHED',
      categories: {
        create: [
          { category: 'COMPANY' },
          { category: 'COLLEGE' },
          { category: 'FRESHER' }
        ]
      },
      tags: {
        create: [
          { tagId: dsaTag.id },
          { tagId: sysDesignTag.id },
          { tagId: behavioralTag.id }
        ]
      }
    }
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: employeeC.id,
      title: 'Microsoft SDE-2 Off-Campus Hiring Drive — Detailed Questions',
      body: JSON.stringify([
        {
          round: 'Round 1: Coding Screen',
          description: 'Hard Dynamic Programming problem on String Edit Distance variation and LRU Cache implementation.'
        },
        {
          round: 'Round 2: Low Level Design',
          description: 'Designed an Elevator Control System with OOP principles, concurrency control, and clean patterns.'
        },
        {
          round: 'Round 3: High Level System Design',
          description: 'Designed scalable Notification Service handling 100M daily events with Redis and Kafka queues.'
        }
      ]),
      companyId: microsoft.id,
      collegeId: nitt.id,
      roleApplied: 'Software Engineer II',
      interviewMode: 'OFF_CAMPUS',
      roundsCount: 3,
      result: 'SELECTED',
      isAnonymous: true,
      upvoteCount: 29,
      commentCount: 3,
      viewCount: 240,
      status: 'PUBLISHED',
      categories: {
        create: [
          { category: 'COMPANY' }
        ]
      },
      tags: {
        create: [
          { tagId: sysDesignTag.id },
          { tagId: dynamicProgTag.id }
        ]
      }
    }
  });

  const post3 = await prisma.post.create({
    data: {
      authorId: fresherB.id,
      title: 'TCS Digital Campus Drive 2024 — Complete Pattern & Interview Experience',
      body: JSON.stringify([
        {
          round: 'Round 1: TCS NQT Assessment',
          description: 'Quantitative aptitude, verbal reasoning, advanced coding section (Arrays, Strings, Recursion).'
        },
        {
          round: 'Round 2: Technical + HR Interview',
          description: 'Questions on OOPs concepts, SQL Joins, DBMS normalization, and final project walkthrough.'
        }
      ]),
      companyId: tcs.id,
      collegeId: bits.id,
      roleApplied: 'Digital Systems Engineer',
      interviewMode: 'ON_CAMPUS',
      roundsCount: 2,
      result: 'SELECTED',
      isAnonymous: false,
      upvoteCount: 18,
      commentCount: 2,
      viewCount: 195,
      status: 'PUBLISHED',
      categories: {
        create: [
          { category: 'COMPANY' },
          { category: 'COLLEGE' },
          { category: 'FRESHER' }
        ]
      },
      tags: {
        create: [
          { tagId: hrTag.id },
          { tagId: dsaTag.id }
        ]
      }
    }
  });

  const post4 = await prisma.post.create({
    data: {
      authorId: studentA.id,
      title: 'Amazon SDE Summer Intern 2025 — Referral Experience',
      body: JSON.stringify([
        {
          round: 'Round 1: OA',
          description: 'Two LC Medium questions + Amazon Leadership Principles survey.'
        },
        {
          round: 'Round 2: Technical Interview (1 Hour)',
          description: 'Deep dive into Tree Data Structures (Lowest Common Ancestor) + LP questions on Customer Obsession.'
        }
      ]),
      companyId: amazon.id,
      collegeId: iitb.id,
      roleApplied: 'SDE Intern',
      interviewMode: 'REFERRAL',
      roundsCount: 2,
      result: 'SELECTED',
      isAnonymous: false,
      upvoteCount: 34,
      commentCount: 4,
      viewCount: 310,
      status: 'PUBLISHED',
      categories: {
        create: [
          { category: 'COMPANY' },
          { category: 'FRESHER' }
        ]
      },
      tags: {
        create: [
          { tagId: dsaTag.id },
          { tagId: behavioralTag.id }
        ]
      }
    }
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: fresherB.id,
      body: 'Congratulations Aarav! What resources did you use for System Design rate limiter round?'
    }
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: studentA.id,
      body: 'Thanks Priya! I followed Alex Xu’s System Design Interview book and practiced rate limiting algorithms on LeetCode.'
    }
  });

  await prisma.postUpvote.create({
    data: { userId: studentA.id, postId: post2.id }
  });
  await prisma.postUpvote.create({
    data: { userId: fresherB.id, postId: post1.id }
  });
  await prisma.bookmark.create({
    data: { userId: studentA.id, postId: post2.id }
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
