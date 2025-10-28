
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Post, Comment } from '../store/slices/blogSlice';
import { setCurrentPost, addComment, updateLikes, updateShares, deletePost } from '../store/slices/blogSlice';
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
  Dialog,
  DialogContent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ThumbUp as ThumbUpIcon, Share as ShareIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost } = useSelector((state: RootState) => state.blog) as { currentPost: Post | null };
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const [openImage, setOpenImage] = useState<string | null>(null);

  // Helper: always return a string ISO date for any createdAt shape
  const normalizeDate = (val: any): string => {
    if (!val) return new Date().toISOString();
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
      if (typeof val.dateCreated === 'string') return val.dateCreated;
      try {
        const maybe = (val as any).dateCreated ?? (val as any).createdAt;
        if (typeof maybe === 'string') return maybe;
        if (maybe instanceof Date) return maybe.toISOString();
        if (maybe != null) return String(maybe);
      } catch {}
    }
    return new Date().toISOString();
  };

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData: any = await blogAPI.getPost(id!);

        if (!postData) {
          setError('Post not found');
          return;
        }

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

  const safeNormalizeDate = (val: any): string => {
    if (!val) return new Date().toISOString();
    if (typeof val === 'string') return val;
    if (val instanceof Date) return val.toISOString();
    if (typeof val === 'object') {
      if (typeof val.dateCreated === 'string') return val.dateCreated;
      if (typeof val.createdAt === 'string') return val.createdAt;
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

  const safeString = (v: any, fallback = ''): string => {
    if (v == null) return fallback;
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    try {
      if (typeof v === 'object') {
        if ((v as any).email || (v as any).emailid) return (v as any).email ?? (v as any).emailid;
        if ((v as any).name) return (v as any).name;
        if ((v as any).username) return (v as any).username;
        if ((v as any).dateCreated && typeof (v as any).dateCreated === 'string') return (v as any).dateCreated;
        return JSON.stringify(v);
      }
    } catch {}
    return fallback;
  };

  const safePost: Post = {
    ...currentPost,
    title: safeString(currentPost.title, ''),

    content: safeString(currentPost.content, ''),
    createdAt: safeNormalizeDate(currentPost.createdAt),
    comments: Array.isArray(currentPost.comments)
      ? currentPost.comments.map((c) => ({
          id: String((c as any).id ?? (c as any)._id ?? Date.now()),
          content: safeString((c as any).content, ''),

          username: safeString((c as any).username ?? (c as any).userEmail, 'Anonymous'),
          createdAt: safeNormalizeDate((c as any).createdAt ?? (c as any).dateCreated),
        }))
      : [],
    likes: typeof currentPost.likes === 'number' ? currentPost.likes : Number(currentPost.likes ?? 0),
    shares: typeof currentPost.shares === 'number' ? currentPost.shares : Number(currentPost.shares ?? 0),
    user: currentPost.user
      ? {
          userId: Number(currentPost.user.userId ?? 0),
          emailid: safeString(currentPost.user.emailid ?? '', ''),
          firstname: safeString(currentPost.user.firstname) as any,
          lastname: safeString(currentPost.user.lastname) as any,
        }
      : undefined,
  };

  const isAuthor = user?.id === safePost.user?.userId;

  const handleLike = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await blogAPI.likePost(id!);
      dispatch(updateLikes({ postId: id!, likes: safePost.likes + 1 }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleShare = async () => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await blogAPI.sharePost(id!);
      dispatch(updateShares({ postId: id!, shares: safePost.shares + 1 }));
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await blogAPI.addComment(id!, commentText);
      const newComment: Comment = {
        id: Date.now().toString(),
        content: commentText,
        username: user?.email || 'Anonymous',
        createdAt: new Date().toISOString(),
      };
      dispatch(
        addComment({
          postId: id!,
          allComments: [...(currentPost?.comments ?? []), newComment],
        })
      );
      setCommentText('');
      try {
        const refreshedPost = await blogAPI.getPost(id!);
        dispatch(setCurrentPost(refreshedPost));
      } catch (err) {
        console.warn('Failed to refresh post after commenting', err);
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

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

  // Compute the fully-qualified image URL to use in modal / img src
  const getFullImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8080${imagePath}`;
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
          <Typography variant="caption" color="text.secondary">
            {safePost.createdAt ? new Date(safePost.createdAt).toLocaleDateString() : ''}
          </Typography>
        </Box>

        {/* Post Image - show without cropping; click to open full modal */}
        {safePost.imageUrl && (
          <Box
            onClick={(e) => {
              e.stopPropagation();
              setOpenImage(getFullImageUrl(safePost.imageUrl));
            }}
            sx={{
              my: 2,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <img
              src={getFullImageUrl(safePost.imageUrl)}
              alt={safePost.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 500,
                objectFit: 'contain',
                borderRadius: 8,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-post.png';
              }}
            />
          </Box>
        )}

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

      {/* Full image dialog */}
      <Dialog open={Boolean(openImage)} onClose={() => setOpenImage(null)} maxWidth="lg" fullWidth>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton aria-label="close" onClick={() => setOpenImage(null)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          {openImage && (
            <img
              src={openImage}
              alt="Full post"
              style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-post.png';
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default PostDetail;
