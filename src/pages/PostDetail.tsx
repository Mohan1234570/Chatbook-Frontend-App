// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import { Post, Comment } from '../types';
// import { setCurrentPost, updateLikes, updateShares, addComment, deletePost } from '../store/slices/blogSlice';
// import { blogAPI } from '../services/api';
// import { normalizeCreatedAt } from '../utils/normalize';
// import {
//   Container, Paper, Typography, Box, Button, TextField, IconButton, Divider, Chip, Alert
// } from '@mui/material';
// import { ThumbUp as ThumbUpIcon, Share as ShareIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

// const PostDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { currentPost } = useSelector((state: RootState) => state.blog) as { currentPost: Post | null };
//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const [comment, setComment] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await blogAPI.getPost(id!);
//         const post: Post = {
//           ...response.data.data,
//           createdAt: normalizeCreatedAt(response.data.data.createdAt),
//         };
//         dispatch(setCurrentPost(post));
//       } catch (err: any) {
//         setError(err.response?.data?.message || 'Failed to fetch post');
//       }
//     };
//     fetchPost();
//   }, [dispatch, id]);

//   if (!currentPost) return <Container><Typography>Loading...</Typography></Container>;

//   const isAuthor = user?.id === currentPost.user?.userId;

//   const handleLike = async () => {
//     if (!isAuthenticated) return navigate('/login');
//     const response = await blogAPI.likePost(id!);
//     dispatch(updateLikes({ postId: id!, likes: response.data.data.likes }));
//   };

//   const handleShare = async () => {
//     if (!isAuthenticated) return navigate('/login');
//     const response = await blogAPI.sharePost(id!);
//     dispatch(updateShares({ postId: id!, shares: response.data.data.shares }));
//   };

//   const handleComment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!comment.trim()) return;
//     const response = await blogAPI.addComment(id!, comment);
//     dispatch(addComment({ postId: id!, comment: response.data.data }));
//     setComment('');
//   };

//   const handleDelete = async () => {
//     if (window.confirm('Are you sure you want to delete this post?')) {
//       await blogAPI.deletePost(id!);
//       dispatch(deletePost(id!));
//       navigate('/');
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 4 }}>
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
//           <Typography variant="h4">{currentPost.title}</Typography>
//           {isAuthor && (
//             <Box>
//               <IconButton color="primary" onClick={() => navigate(`/edit-post/${id}`)}><EditIcon /></IconButton>
//               <IconButton color="error" onClick={handleDelete}><DeleteIcon /></IconButton>
//             </Box>
//           )}
//         </Box>
//         <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Chip label={`By ${currentPost.user?.emailid || 'Unknown'}`} size="small" variant="outlined" />
//           <Typography variant="caption" color="text.secondary">{new Date(currentPost.createdAt).toLocaleDateString()}</Typography>
//         </Box>
//         <Typography variant="body1" paragraph>{currentPost.content}</Typography>
//         <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//           <Button startIcon={<ThumbUpIcon />} onClick={handleLike} color="primary">{currentPost.likes} Likes</Button>
//           <Button startIcon={<ShareIcon />} onClick={handleShare} color="primary">{currentPost.shares} Shares</Button>
//         </Box>
//         <Divider sx={{ my: 3 }} />
//         <Typography variant="h6" gutterBottom>Comments ({currentPost.comments.length})</Typography>
//         {isAuthenticated ? (
//           <form onSubmit={handleComment}>
//             <TextField fullWidth multiline rows={2} placeholder="Write a comment..." value={comment} onChange={e => setComment(e.target.value)} sx={{ mb: 2 }} />
//             <Button type="submit" variant="contained" color="primary" disabled={!comment.trim()}>Comment</Button>
//           </form>
//         ) : (
//           <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Login to Comment</Button>
//         )}
//         <Box sx={{ mt: 3 }}>
//           {currentPost.comments.map((c: Comment) => (
//             <Paper key={c.id} elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
//               <Typography variant="subtitle2">{c.username}</Typography>
//               <Typography variant="body2">{c.content}</Typography>
//               <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleDateString()}</Typography>
//             </Paper>
//           ))}
//         </Box>
//       </Paper>
//     </Container>
//   );
// };

// export default PostDetail;



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Post, Comment } from '../store/slices/blogSlice';
import { setCurrentPost, updateLikes, updateShares, addComment, deletePost } from '../store/slices/blogSlice';
import { blogAPI } from '../services/api';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import { ThumbUp as ThumbUpIcon, Share as ShareIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost } = useSelector((state: RootState) => state.blog) as { currentPost: Post | null };
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  // Helper: always return a string ISO date for any createdAt shape
  const normalizeDate = (val: any): string => {
    if (!val) return new Date().toISOString();
    if (typeof val === 'string') return val;
    // if backend returns { dateCreated: '...' } or { id: ..., dateCreated: '...' }
    if (typeof val === 'object') {
      if (typeof val.dateCreated === 'string') return val.dateCreated;
      // sometimes nested differently; try toString fallback
      try {
        const maybe = (val as any).dateCreated ?? (val as any).createdAt;
        if (typeof maybe === 'string') return maybe;
        if (maybe instanceof Date) return maybe.toISOString();
        if (maybe != null) return String(maybe);
      } catch {
        // fall through
      }
    }
    return new Date().toISOString();
  };

  // Fetch post (defensive normalization)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // blogAPI.getPost often returns a Post-like object; be defensive about shapes
        const postData: any = await blogAPI.getPost(id!);

        if (!postData) {
          setError('Post not found');
          return;
        }

        // Normalize comments (ensure createdAt is string)
        const normalizedComments: Comment[] = Array.isArray(postData.comments)
          ? postData.comments.map((c: any) => ({
              id: String(c.id ?? c._id ?? Date.now()),
              content: c.content ?? '',
              username: c.username ?? c.userEmail ?? 'Anonymous',
              createdAt: normalizeDate(c.createdAt ?? c.dateCreated),
            }))
          : [];

        const post: Post = {
          id: String(postData.id ?? postData._id ?? ''),

          title: postData.title ?? '',
          content: postData.content ?? '',
          imageUrl: postData.imageUrl ?? undefined,
          user: postData.user
            ? {
                userId: Number(postData.user.userId ?? postData.user.id ?? 0),
                emailid: postData.user.emailid,
                firstname: postData.user.firstname ?? null,
                lastname: postData.user.lastname ?? null,
              }
            : undefined,
          createdAt: normalizeDate(postData.createdAt ?? postData.dateCreated),
          likes: postData.likes ?? postData.likesCount ?? 0,
          shares: postData.shares ?? 0,
          comments: normalizedComments,
        };

        dispatch(setCurrentPost(post));
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err?.response?.data?.message || 'Failed to fetch post');
      }
    };

    fetchPost();
  }, [dispatch, id]);

  if (!currentPost) return <Container><Typography>Loading...</Typography></Container>;

  // Defensive normalization for render-time to ensure nothing is a plain object
  const safeNormalizeDate = (val: any): string => {
    if (!val) return new Date().toISOString();
    if (typeof val === 'string') return val;
    if (val instanceof Date) return val.toISOString();
    if (typeof val === 'object') {
      if (typeof val.dateCreated === 'string') return val.dateCreated;
      if (typeof val.createdAt === 'string') return val.createdAt;
      // If object looks like { id, dateCreated }, prefer dateCreated; otherwise stringify
      try {
        const maybe = val.dateCreated ?? val.createdAt;
        if (typeof maybe === 'string') return maybe;
        return String(maybe ?? JSON.stringify(val));
      } catch {
        return new Date().toISOString();
      }
    }
    return String(val);
  };

  // Coerce any value to a safe string (used for title/content/username/email)
  const safeString = (v: any, fallback = ''): string => {
    if (v == null) return fallback;
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    try {
      // If it's an object, try common fields then JSON.stringify as last resort
      if (typeof v === 'object') {
        // If it's a user-like object, return email or name if available
        if ((v as any).email || (v as any).emailid) return (v as any).email ?? (v as any).emailid;
        if ((v as any).name) return (v as any).name;
        if ((v as any).username) return (v as any).username;
        if ((v as any).dateCreated && typeof (v as any).dateCreated === 'string') return (v as any).dateCreated;
        return JSON.stringify(v);
      }
    } catch {
      // ignore
    }
    return fallback;
  };

  // Build a safePost for rendering (coerce all potential object fields)
  const safePost: Post = {
    ...currentPost,
    // ensure primitive title/content
    title: safeString(currentPost.title, ''),
    content: safeString(currentPost.content, ''),
    // normalize createdAt to string
    createdAt: safeNormalizeDate(currentPost.createdAt),
    // normalize comments: ensure id, username, content and createdAt are strings
    comments: Array.isArray(currentPost.comments)
      ? currentPost.comments.map((c) => ({
          id: String((c as any).id ?? (c as any)._id ?? Date.now()),
          content: safeString((c as any).content, ''),

          username: safeString((c as any).username ?? (c as any).userEmail, 'Anonymous'),
          createdAt: safeNormalizeDate((c as any).createdAt ?? (c as any).dateCreated),
        }))
      : [],
    // ensure numbers
    likes: typeof currentPost.likes === 'number' ? currentPost.likes : Number(currentPost.likes ?? 0),
    shares: typeof currentPost.shares === 'number' ? currentPost.shares : Number(currentPost.shares ?? 0),
    // ensure user email is primitive if present
    user: currentPost.user
      ? {
          userId: Number(currentPost.user.userId ?? 0),
          emailid: safeString(currentPost.user.emailid ?? currentPost.user.emailid ?? '', ''),
          firstname: safeString(currentPost.user.firstname) as any,
          lastname: safeString(currentPost.user.lastname) as any,
        }
      : undefined,
  };
  console.log('safePost (render):', safePost);

  const isAuthor = user?.id === safePost.user?.userId;

  // Handle like
  const handleLike = async () => {
    if (!isAuthenticated) return navigate('/login');

    try {
      await blogAPI.likePost(id!);
      dispatch(updateLikes({ postId: id!, likes: safePost.likes + 1 }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!isAuthenticated) return navigate('/login');

    try {
      await blogAPI.sharePost(id!);
      dispatch(updateShares({ postId: id!, shares: safePost.shares + 1 }));
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await blogAPI.addComment(id!, commentText);

      const newComment: Comment = {
        id: Date.now().toString(), // temporary id
        content: commentText,
        username: user?.email || 'Anonymous',
        createdAt: new Date().toISOString(),
      };

      dispatch(addComment({ postId: id!, allComments: [...currentPost.comments, newComment] }));
      setCommentText('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await blogAPI.deletePost(id!);
      dispatch(deletePost(id!));
      navigate('/');
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Post Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">{safePost.title}</Typography>
          {isAuthor && (
            <Box>
              <IconButton color="primary" onClick={() => navigate(`/edit-post/${id}`)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={handleDelete}><DeleteIcon /></IconButton>
            </Box>
          )}
        </Box>

        {/* Post Meta */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={`By ${safePost.user?.emailid || 'Unknown'}`} size="small" variant="outlined" />
          <Typography variant="caption" color="text.secondary">{new Date(safePost.createdAt).toLocaleDateString()}</Typography>
        </Box>

        {/* Post Content */}
        <Typography variant="body1" paragraph>{safePost.content}</Typography>

        {/* Likes / Shares */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button startIcon={<ThumbUpIcon />} onClick={handleLike} color="primary">{safePost.likes} Likes</Button>
          <Button startIcon={<ShareIcon />} onClick={handleShare} color="primary">{safePost.shares} Shares</Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Comments */}
        <Typography variant="h6" gutterBottom>Comments ({safePost.comments.length})</Typography>

        {safePost.comments.length === 0 && <Typography>No comments yet.</Typography>}
        {safePost.comments.map(c => (
          <Paper key={c.id} elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2">{c.username}</Typography>
            <Typography variant="body2">{c.content}</Typography>
            <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleDateString()}</Typography>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default PostDetail;

// inside normalizePost (src/services/api.ts)
// const normalizePost = (post: any): Post => ({
//   ...post,
//   likes: post.likes ?? post.likesCount ?? 0,
//   createdAt:
//     typeof post.createdAt === 'string'
//       ? post.createdAt
//       : post.createdAt?.dateCreated || new Date().toISOString(),
// });
