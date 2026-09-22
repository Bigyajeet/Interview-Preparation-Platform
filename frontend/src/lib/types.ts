export type UserStatus = 'STUDENT' | 'FRESHER' | 'EMPLOYEE';
export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';
export type InterviewMode = 'ON_CAMPUS' | 'OFF_CAMPUS' | 'REFERRAL' | 'WALK_IN';
export type InterviewResult = 'SELECTED' | 'REJECTED' | 'AWAITING';
export type CategoryType = 'COMPANY' | 'COLLEGE' | 'FRESHER';
export type PostStatus = 'PUBLISHED' | 'FLAGGED' | 'REMOVED';

export interface College {
  id: string;
  name: string;
  city?: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  collegeId?: string;
  college?: College;
  graduationYear?: number;
  degree?: string;
  currentCompany?: string;
  yearsExperience?: number;
  currentRole?: string;
  lookingFor?: string;
  profilePhotoUrl?: string;
}

export interface RoundBreakdown {
  round: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  companyId?: string;
  company?: Company;
  collegeId?: string;
  college?: College;
  roleApplied: string;
  interviewMode: InterviewMode;
  roundsCount: number;
  result: InterviewResult;
  isAnonymous: boolean;
  upvoteCount: number;
  commentCount: number;
  viewCount: number;
  status: PostStatus;
  createdAt: string;
  author: {
    id: string;
    name: string;
    status: UserStatus;
    college?: College;
    currentCompany?: string;
    currentRole?: string;
  };
  categories: { category: CategoryType }[];
  tags: { tag: { id: string; name: string } }[];
  isUpvoted?: boolean;
  isBookmarked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: string;
  parentCommentId?: string;
  author: {
    id: string;
    name: string;
    status: UserStatus;
    profilePhotoUrl?: string;
  };
  replies?: Comment[];
}

export interface Report {
  id: string;
  reason: string;
  status: 'OPEN' | 'REVIEWED' | 'DISMISSED';
  createdAt: string;
  reportedBy: { id: string; name: string; email: string };
  post?: { id: string; title: string; status: PostStatus; author: { name: string } };
  comment?: { id: string; body: string; author: { name: string } };
}
