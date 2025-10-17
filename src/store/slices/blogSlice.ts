import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Comment {
  id: string;
  content: string;
  username: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  user?: {
    userId: number;
    emailid: string;
    firstname: string | null;
    lastname: string | null;
  };
  createdAt: string;
  likes: number;
  shares: number;
  comments: Comment[];
}

interface BlogState {
  posts: Post[];
  currentPost: Post | null;
  totalPosts: number;
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  totalPosts: 0
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
      state.totalPosts += 1;
    },
    setCurrentPost: (state, action: PayloadAction<Post>) => {
      state.currentPost = action.payload;
    },
    updateLikes: (state, action: PayloadAction<{ postId: string; likes: number }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.likes = action.payload.likes;
      }
    },
    updateShares: (state, action: PayloadAction<{ postId: string; shares: number }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.shares = action.payload.shares;
      }
    },
    addComment: (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload.comment);
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
      state.totalPosts -= 1;
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.totalPosts = action.payload.length;
    }
  }
});

export const { 
  addPost,
  setCurrentPost, 
  updateLikes, 
  updateShares, 
  addComment, 
  deletePost,
  setPosts
} = blogSlice.actions;

export default blogSlice.reducer;
