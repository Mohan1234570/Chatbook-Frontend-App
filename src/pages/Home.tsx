import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Post } from '../types';
import { setPosts, updateLikes, updateShares } from '../store/slices/blogSlice';
import { fetchAllPosts } from '../services/PostService'; // 👈 Updated API import
import { normalizeCreatedAt } from '../utils/normalize';
import {
  Container, Box, Card, CardContent, CardActions, Typography,
  Button, IconButton, Chip
} from '@mui/material';
import { ThumbUp as ThumbUpIcon, Share as ShareIcon, Comment as CommentIcon } from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts } = useSelector((state: RootState) => state.blog);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadAllPosts = async () => {
      if (isAuthenticated) {
        try {
          let allPosts = await fetchAllPosts(); // 👈 Fetch all posts API call

          // Normalize createdAt
          allPosts = allPosts.map(post => ({
            ...post,
            createdAt: normalizeCreatedAt(post.createdAt),
          }));

          dispatch(setPosts(allPosts));
        } catch (error) {
          console.error('Failed to fetch all posts', error);
        }
      }
    };

    loadAllPosts();
  }, [isAuthenticated, dispatch]);

  const handleLike = (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    const post = posts.find(p => p.id === postId);
    if (post) dispatch(updateLikes({ postId, likes: post.likes + 1 }));
  };

  const handleShare = (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    const post = posts.find(p => p.id === postId);
    if (post) dispatch(updateShares({ postId, shares: post.shares + 1 }));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        {posts.map(post => (
          <Card key={post.id}>
            <CardContent>
              <Typography variant="h5">{post.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'
              }}>
                {post.content}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`By ${post.user?.firstname ?? ''} ${post.user?.lastname ?? ''}`.trim() || 'Unknown'}
                  size="small"
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <IconButton size="small" onClick={() => handleLike(post.id)} color="primary">
                <ThumbUpIcon />
                <Typography variant="caption" sx={{ ml: 0.5 }}>{post.likes}</Typography>
              </IconButton>
              <IconButton size="small" onClick={() => handleShare(post.id)} color="primary">
                <ShareIcon />
                <Typography variant="caption" sx={{ ml: 0.5 }}>{post.shares}</Typography>
              </IconButton>
              <IconButton size="small" onClick={() => navigate(`/post/${post.id}`)} color="primary">
                <CommentIcon />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {post.comments?.length ?? 0}
                  </Typography>
              </IconButton>
              <Button size="small" onClick={() => navigate(`/post/${post.id}`)} sx={{ ml: 'auto' }}>
                Read More
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Home;
