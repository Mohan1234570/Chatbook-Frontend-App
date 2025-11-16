import axios from 'axios';
import { Post } from '../store/slices/blogSlice';

export const API_URL = "http://localhost:8080/api/posts"; // backend posts API
export const BASE_URL = "http://localhost:8080";


export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const posts: any[] = response.data.data || [];

    return posts.map(post => ({
      ...post,
      createdAt: post.dateCreated ?? post.createdAt,
      comments: post.comments ?? [],
      likes: post.likesCount ?? post.likes ?? 0,
      shares: post.shares ?? 0,
      imageUrl: post.imageUrl ? `${BASE_URL}${post.imageUrl}` : null, // full URL
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const fetchUserPosts = async (): Promise<Post[]> => {
  try {
    const response = await axios.get(`${API_URL}/userPosts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const posts = response.data.data || [];

    return posts.map((post: any) => ({
      ...post,
      createdAt: post.dateCreated,
      likes: post.likesCount ?? 0,
      comments: post.comments ?? [],
      // 👇 Prepend BASE_URL to imageUrl if available
      imageUrl: post.imageUrl ? `${API_URL}${post.imageUrl}` : null,
    }));
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
};