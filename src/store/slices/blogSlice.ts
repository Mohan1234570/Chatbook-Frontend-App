import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Comment {
  id: string;
  content: string;
  username: string;
  createdAt: string;
  userId?: number;
  _id?: string; 
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
  dateCreated?: string;
  likes: number;
  shares: number;
  comments: Comment[];
  commentsCount?: number;

  likesDetails?: { id: string; dateCreated: string }[];
  likedBy?: string[];
}

interface BlogState {
  posts: Post[];
  currentPost: Post | null;
  totalPosts: number;
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  totalPosts: 0,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addPost: (state, action: PayloadAction<Post>) => {
      // Ensure commentsCount is set
      const p = { ...action.payload };
      p.comments = Array.isArray(p.comments) ? p.comments : [];
      p.commentsCount = typeof p.commentsCount === 'number' ? p.commentsCount : p.comments.length;
      state.posts.unshift(p);
      state.totalPosts += 1;
    },
    setCurrentPost: (state, action: PayloadAction<Post>) => {
      const p = { ...action.payload };
      p.comments = Array.isArray(p.comments) ? p.comments : [];
      p.commentsCount = typeof p.commentsCount === 'number' ? p.commentsCount : p.comments.length;
      state.currentPost = p;
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
    // Update comments array AND keep commentsCount in sync
    addComment: (state, action: PayloadAction<{ postId: string; allComments: Comment[] }>) => {
      const { postId, allComments } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.comments = Array.isArray(allComments) ? allComments : [];
        post.commentsCount = post.comments.length;
      }
      // also update currentPost if it matches
      if (state.currentPost && state.currentPost.id === postId) {
        state.currentPost.comments = Array.isArray(allComments) ? allComments : [];
        state.currentPost.commentsCount = state.currentPost.comments.length;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
      state.totalPosts -= 1;
      if (state.currentPost?.id === action.payload) {
        state.currentPost = null;
      }
    },
    setPosts: (state, action: PayloadAction<Post[]>) => {
      // Ensure each post has comments array and commentsCount set
      state.posts = action.payload.map(p => {
        const postCopy = { ...p };
        postCopy.comments = Array.isArray(postCopy.comments) ? postCopy.comments : [];
        postCopy.commentsCount =
          typeof postCopy.commentsCount === 'number' ? postCopy.commentsCount : postCopy.comments.length;
        return postCopy;
      });
      state.totalPosts = state.posts.length;
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const newPost = { ...action.payload };
      newPost.comments = Array.isArray(newPost.comments) ? newPost.comments : [];
      newPost.commentsCount =
        typeof newPost.commentsCount === 'number' ? newPost.commentsCount : newPost.comments.length;

      const index = state.posts.findIndex(p => p.id === newPost.id);
      if (index !== -1) {
        state.posts[index] = newPost;
      }

      if (state.currentPost?.id === newPost.id) {
        state.currentPost = newPost;
      }
    },
  },
});

export const { 
  addPost,
  setCurrentPost, 
  updateLikes, 
  updateShares, 
  addComment, 
  deletePost,
  setPosts,
  updatePost
} = blogSlice.actions;

export default blogSlice.reducer;
