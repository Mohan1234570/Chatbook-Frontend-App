


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
import { Post, Comment } from '../types';
import { setCurrentPost, updateLikes, updateShares, addComment, deletePost } from '../store/slices/blogSlice';
import { blogAPI } from '../services/api';
import { normalizeCreatedAt } from '../utils/normalize';
import {
  Container, Paper, Typography, Box, Button, TextField, IconButton, Divider, Chip, Alert
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

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await blogAPI.getPost(id!);
        const post: Post = {
          ...response.data.data,
          createdAt: normalizeCreatedAt(response.data.data.createdAt),
        };
        dispatch(setCurrentPost(post));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch post');
      }
    };
    fetchPost();
  }, [dispatch, id]);

  if (!currentPost) return <Container><Typography>Loading...</Typography></Container>;

  const isAuthor = user?.id === currentPost.user?.userId;

  // Like / Share
  const handleLike = async () => {
    if (!isAuthenticated) return navigate('/login');
    const response = await blogAPI.likePost(id!);
    dispatch(updateLikes({ postId: id!, likes: response.data.data.likes }));
  };

  const handleShare = async () => {
    if (!isAuthenticated) return navigate('/login');
    const response = await blogAPI.sharePost(id!);
    dispatch(updateShares({ postId: id!, shares: response.data.data.shares }));
  };

  // Add Comment
  const handleCommentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!commentText.trim()) return;

  try {
    // 1️⃣ Add new comment
    await blogAPI.addComment(id!, commentText);

    // 2️⃣ Fetch all latest comments for this post
    const latestComments: Comment[] = await blogAPI.getComments(id!); // returns Comment[]

    // Optional: normalize username if API uses userEmail
    const normalizedComments = latestComments.map(c => ({
      id: c.id,
      content: c.content,
      username: c.username ?? (c as any).userEmail,
      createdAt: c.createdAt,
    }));

    // 3️⃣ Update Redux store
    dispatch(addComment({ postId: id!, allComments: normalizedComments }));

    // 4️⃣ Clear input
    setCommentText('');
  } catch (err) {
    console.error('Error submitting comment:', err);
  }
};

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await blogAPI.deletePost(id!);
      dispatch(deletePost(id!));
      navigate('/');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Post Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">{currentPost.title}</Typography>
          {isAuthor && (
            <Box>
              <IconButton color="primary" onClick={() => navigate(`/edit-post/${id}`)}><EditIcon /></IconButton>
              <IconButton color="error" onClick={handleDelete}><DeleteIcon /></IconButton>
            </Box>
          )}
        </Box>

        {/* Post Meta */}
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip label={`By ${currentPost.user?.emailid || 'Unknown'}`} size="small" variant="outlined" />
          <Typography variant="caption" color="text.secondary">{new Date(currentPost.createdAt).toLocaleDateString()}</Typography>
        </Box>

        {/* Post Content */}
        <Typography variant="body1" paragraph>{currentPost.content}</Typography>

        {/* Likes / Shares */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button startIcon={<ThumbUpIcon />} onClick={handleLike} color="primary">{currentPost.likes} Likes</Button>
          <Button startIcon={<ShareIcon />} onClick={handleShare} color="primary">{currentPost.shares} Shares</Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Comments */}
        <Typography variant="h6" gutterBottom>Comments ({currentPost.comments.length})</Typography>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" disabled={!commentText.trim()}>Comment</Button>
          </form>
        ) : (
          <Button variant="contained" color="primary" onClick={() => navigate('/login')}>Login to Comment</Button>
        )}

        <Box sx={{ mt: 3 }}>
          {currentPost.comments.length === 0 && <Typography>No comments yet.</Typography>}
          {currentPost.comments.map((c: Comment) => (
            <Paper key={c.id} elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2">{c.username}</Typography>
              <Typography variant="body2">{c.content}</Typography>
              <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleDateString()}</Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default PostDetail;
