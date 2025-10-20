import axios from 'axios';
import { Post, Comment, ApiResponse } from '../types/index';

const API_URL = 'http://localhost:8080/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false
});

// ✅ Backend health test
export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const response = await axios.get(`${API_URL}/health`, {
      headers: { 'Accept': 'application/json' }
    });
    console.log('Backend test response:', response);
    return true;
  } catch (error: any) {
    if (error.response) {
      console.log('Backend is running (received response)');
      return true;
    }
    console.error('Backend connection test failed:', error);
    return false;
  }
};

// ✅ Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Auth APIs
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });

      const token = response.data.data;
      if (!token) throw new Error('No token received');

      // ✅ Store token and email
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', credentials.email);

      return {
        data: {
          token,
          user: {
            id: '',
            email: credentials.email,
            name: '',
            role: 'user'
          }
        }
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: { firstname: string; lastname: string, email: string; password: string; phone: string }) => {
    try {
      const response = await api.post('/users/register', userData);
      return response;
    } catch (error) {
      console.error('Register request failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  }
};

// ✅ Blog APIs

// Update normalizeCreatedAt helper (if you already have it) or add below:

const normalizeCreatedAtValue = (val: any): string => {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'object') {
    return val.dateCreated ?? val.createdAt ?? new Date().toISOString();
  }
  return String(val);
};

const normalizePost = (post: any): Post => ({
  ...post,
  // ensure createdAt is a string
  createdAt: normalizeCreatedAtValue(post.createdAt ?? post.dateCreated ?? post.dateCreated),

  // primary number of likes (use likesCount, or fallback to array length)
  likes: post.likesCount ?? (Array.isArray(post.likes) ? post.likes.length : post.likes ?? 0),

  // preserve the raw likes array as normalized date strings
  likesDetails: Array.isArray(post.likes)
    ? post.likes.map((l: any) => ({
        id: String(l.id ?? l._id ?? ''),

        dateCreated: normalizeCreatedAtValue(l.dateCreated ?? l.createdAt ?? l.createdOn),
      }))
    : undefined,

  // preserve the list of users who liked (if backend provides it)
  likedBy: Array.isArray(post.likedBy) ? post.likedBy : undefined,

  // normalize comments (if not already handled)
  comments: Array.isArray(post.comments)
    ? post.comments.map((c: any) => ({
        id: String(c.id ?? c._id ?? ''),

        content: c.content ?? '',
        username: c.username ?? c.userEmail ?? c.name ?? 'Anonymous',
        // accept createdOn, createdAt, dateCreated (most backends use one of these)
        createdAt: normalizeCreatedAtValue(c.createdAt ?? c.dateCreated ?? c.createdOn),
      }))
    : [],
});

export const blogAPI = {
  getPosts: async () => {
    const res = await api.get<ApiResponse<Post[]>>('/posts');
    return res.data.data.map(normalizePost);
  },

  getPost: async (id: string) => {
    const res = await api.get<ApiResponse<Post>>(`/posts/${id}`);
    return normalizePost(res.data.data);
  },

  getUserPosts: async (email: string) => {
    const res = await api.get<Post[]>(`/posts/user/${encodeURIComponent(email)}`);
    return res.data.map(normalizePost);
  },

  createPost: (data: { title: string; content: string; image?: File }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) throw new Error('User email not found');
    formData.append('userEmail', userEmail);

    return api.post<Post>('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  updatePost: (id: string, data: { title: string; content: string; image?: File }) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);

    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) formData.append('userEmail', userEmail);

    return api.put<ApiResponse<Post>>(`/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deletePost: (id: string) => {
    const userEmail = localStorage.getItem('userEmail');
    return api.delete<ApiResponse<void>>(`/posts/${id}?userEmail=${userEmail}`);
  },

  likePost: (id: string) => api.post<ApiResponse<Post>>(`/posts/${id}/like`),
  dislikePost: (id: string) => api.post<ApiResponse<Post>>(`/posts/${id}/unlike`),

  sharePost: (id: string) => {
    const userEmail = localStorage.getItem('userEmail');
    return api.post<ApiResponse<Post>>(`/posts/${id}/share?userEmail=${userEmail}`);
  },

 // Add a comment to a post
addComment: async (id: string, content: string) => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) throw new Error('User not logged in');

  const res = await api.post<ApiResponse<Comment>>(
    `/posts/${id}/comment`,
    { content, userEmail } // backend expects this
  );

  return res.data.data; // return the created comment
},

// Get all comments for a post
getComments: async (postId: string) => {
  const res = await api.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`);
  const raw = res.data.data;
  // normalize each comment's createdAt
  return Array.isArray(raw)
    ? raw.map((c: any) => ({
        id: String(c.id ?? c._id ?? ''),

        content: c.content ?? '',
        username: c.username ?? c.userEmail ?? c.name ?? 'Anonymous',
        createdAt: normalizeCreatedAtValue(c.createdAt ?? c.dateCreated ?? c.createdOn),
      }))
    : [];
}
};

export default api;