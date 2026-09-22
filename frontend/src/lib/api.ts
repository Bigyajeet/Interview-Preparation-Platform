import { User, Post, Comment, College, Company, Report } from './types';

const API_BASE = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  signup: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Signup failed');
    }
    return res.json();
  },

  login: async (data: any) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  getMe: async (): Promise<User | null> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return null;

    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      localStorage.removeItem('token');
      return null;
    }
    return res.json();
  },

  updateProfile: async (data: Partial<User>) => {
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  getColleges: async (search?: string): Promise<College[]> => {
    const url = `${API_BASE}/colleges${search ? `?search=${encodeURIComponent(search)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  },

  getCompanies: async (search?: string): Promise<Company[]> => {
    const url = `${API_BASE}/companies${search ? `?search=${encodeURIComponent(search)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  },

  getPosts: async (params: {
    category?: string;
    companyId?: string;
    collegeId?: string;
    mode?: string;
    result?: string;
    search?: string;
    sort?: string;
    cursor?: string;
  }): Promise<{ posts: Post[]; nextCursor: string | null }> => {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.companyId) query.set('companyId', params.companyId);
    if (params.collegeId) query.set('collegeId', params.collegeId);
    if (params.mode) query.set('mode', params.mode);
    if (params.result) query.set('result', params.result);
    if (params.search) query.set('search', params.search);
    if (params.sort) query.set('sort', params.sort);
    if (params.cursor) query.set('cursor', params.cursor);

    const res = await fetch(`${API_BASE}/posts?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  createPost: async (postData: any): Promise<Post> => {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create post');
    }
    return res.json();
  },

  getPostById: async (id: string): Promise<Post> => {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Post not found');
    return res.json();
  },

  toggleUpvote: async (id: string): Promise<{ upvoted: boolean; upvoteCount: number }> => {
    const res = await fetch(`${API_BASE}/posts/${id}/upvote`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to toggle upvote');
    return res.json();
  },

  toggleBookmark: async (id: string): Promise<{ bookmarked: boolean }> => {
    const res = await fetch(`${API_BASE}/posts/${id}/bookmark`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`);
    if (!res.ok) return [];
    return res.json();
  },

  createComment: async (postId: string, body: string, parentCommentId?: string): Promise<Comment> => {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ body, parentCommentId })
    });
    if (!res.ok) throw new Error('Failed to add comment');
    return res.json();
  },

  submitReport: async (postId?: string, commentId?: string, reason?: string) => {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ postId, commentId, reason })
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return res.json();
  },

  getReports: async (status: string = 'OPEN'): Promise<Report[]> => {
    const res = await fetch(`${API_BASE}/moderation/reports?status=${status}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  updateReportStatus: async (id: string, status: string, action?: string) => {
    const res = await fetch(`${API_BASE}/moderation/reports/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, action })
    });
    if (!res.ok) throw new Error('Failed to update report');
    return res.json();
  }
};
