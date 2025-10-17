import axios from 'axios';
import { Post } from '../store/slices/blogSlice';

const API_URL = 'http://localhost:8080/api/posts';

export const fetchUserPosts = async (email: string): Promise<Post[]> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await axios.get(`${API_URL}/user/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  const token = localStorage.getItem('token'); // 👈 assuming you store JWT here

  const response = await axios.get(`${API_URL}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return response.data;
};
