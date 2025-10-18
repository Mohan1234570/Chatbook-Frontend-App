


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import { setPosts } from '../store/slices/blogSlice';
// import { fetchAllPosts } from '../services/PostService';
// import { blogAPI } from '../services/api';
// import { normalizeCreatedAt } from '../utils/normalize';
// import {
//   Container, Box, Card, CardContent, CardActions, Typography,
//   Button, IconButton, Chip, Dialog, DialogContent, DialogTitle
// } from '@mui/material';
// import { ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon, Share as ShareIcon, Comment as CommentIcon } from '@mui/icons-material';

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { posts } = useSelector((state: RootState) => state.blog);
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const [open, setOpen] = useState(false);
//   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

//   // Selected post from Redux
//   const selectedPost = posts.find(p => p.id === selectedPostId) ?? null;

//   // Helper: fetch all posts and set Redux
//   const loadAllPosts = async () => {
//     try {
//       let allPosts = await fetchAllPosts();
//       allPosts = allPosts.map(post => ({
//         ...post,
//         createdAt: normalizeCreatedAt(post.createdAt),
//       }));
//       dispatch(setPosts(allPosts));
//     } catch (err) {
//       console.error('Failed to fetch posts', err);
//     }
//   };

//   useEffect(() => {
//     loadAllPosts();
//   }, [dispatch]);

//   // Like / Dislike / Share handlers: refresh posts after action
//   const handleLike = async (postId: string) => {
//     if (!isAuthenticated) return navigate('/login');
//     try {
//       await blogAPI.likePost(postId);
//       await loadAllPosts();
//     } catch (err) {
//       console.error('Error liking post:', err);
//     }
//   };

//   const handleDislike = async (postId: string) => {
//     if (!isAuthenticated) return navigate('/login');
//     try {
//       await blogAPI.dislikePost(postId);
//       await loadAllPosts();
//     } catch (err) {
//       console.error('Error disliking post:', err);
//     }
//   };

//   const handleShare = async (postId: string) => {
//     if (!isAuthenticated) return navigate('/login');
//     try {
//       await blogAPI.sharePost(postId);
//       await loadAllPosts();
//     } catch (err) {
//       console.error('Error sharing post:', err);
//     }
//   };

//   const handleOpenPost = (postId: string) => {
//     setSelectedPostId(postId);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedPostId(null);
//   };

//   return (
//     <Container sx={{ mt: 4 }}>
//       <Box sx={{ display: 'grid', gap: 3 }}>
//         {posts.map(post => (
//           <Card key={post.id}>
//             <CardContent>
//               <Typography variant="h5">{post.title}</Typography>
//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
//               >
//                 {post.content}
//               </Typography>
//               <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Chip label={`By ${post.user?.firstname ?? ''} ${post.user?.lastname ?? ''}`.trim() || 'Unknown'} size="small" variant="outlined" />
//                 <Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleDateString()}</Typography>
//               </Box>
//             </CardContent>

//             <CardActions>
//               <IconButton size="small" onClick={() => handleLike(post.id)} color="primary">
//                 <ThumbUpIcon /> {post.likes}
//               </IconButton>
//               <IconButton size="small" onClick={() => handleDislike(post.id)} color="secondary">
//                 <ThumbDownIcon />
//               </IconButton>
//               <IconButton size="small" onClick={() => handleShare(post.id)} color="primary">
//                 <ShareIcon /> {post.shares}
//               </IconButton>
//               <IconButton size="small" onClick={() => handleOpenPost(post.id)} color="primary">
//                 <CommentIcon /> {post.comments?.length ?? 0}
//               </IconButton>
//               <Button size="small" onClick={() => handleOpenPost(post.id)} sx={{ ml: 'auto' }}>Read More</Button>
//             </CardActions>
//           </Card>
//         ))}
//       </Box>

//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         {selectedPost ? (
//           <>
//             <DialogTitle>{selectedPost.title}</DialogTitle>
//             <DialogContent dividers>
//               <Typography variant="subtitle2" color="text.secondary">
//                 By {selectedPost.user?.firstname} {selectedPost.user?.lastname} • {new Date(selectedPost.createdAt).toLocaleString()}
//               </Typography>
//               <Typography sx={{ whiteSpace: 'pre-line', mt: 2 }}>{selectedPost.content}</Typography>
//               {selectedPost.imageUrl && (
//                 <Box sx={{ mt: 2 }}>
//                   <img src={selectedPost.imageUrl} alt={selectedPost.title} style={{ width: '100%', borderRadius: 8 }} />
//                 </Box>
//               )}
//               <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
//                 <IconButton color="primary" onClick={() => handleLike(selectedPost.id)}>
//                   <ThumbUpIcon /> {selectedPost.likes}
//                 </IconButton>
//                 <IconButton color="secondary" onClick={() => handleDislike(selectedPost.id)}>
//                   <ThumbDownIcon />
//                 </IconButton>
//                 <IconButton color="primary" onClick={() => handleShare(selectedPost.id)}>
//                   <ShareIcon /> {selectedPost.shares}
//                 </IconButton>
//               </Box>
//             </DialogContent>
//           </>
//         ) : (
//           <Typography sx={{ p: 3 }}>Post not found</Typography>
//         )}
//       </Dialog>
//     </Container>
//   );
// };

// export default Home;





import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setPosts, addComment } from '../store/slices/blogSlice';
import { fetchAllPosts } from '../services/PostService';
import { blogAPI } from '../services/api';
import { normalizeCreatedAt } from '../utils/normalize';
import {
  Container, Box, Card, CardContent, CardActions, Typography,
  Button, IconButton, Chip, Dialog, DialogContent, DialogTitle, TextField
} from '@mui/material';
import { ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon, Share as ShareIcon, Comment as CommentIcon } from '@mui/icons-material';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts } = useSelector((state: RootState) => state.blog);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const selectedPost = posts.find(p => p.id === openPostId) ?? null;
  const commentPost = posts.find(p => p.id === openCommentId) ?? null;

  const loadAllPosts = async () => {
    try {
      let allPosts = await fetchAllPosts();
      allPosts = allPosts.map(post => ({
        ...post,
        createdAt: normalizeCreatedAt(post.createdAt),
      }));
      dispatch(setPosts(allPosts));
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  useEffect(() => {
    loadAllPosts();
  }, [dispatch]);

  // Like / Dislike / Share
  const handleLike = async (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await blogAPI.likePost(postId);
      await loadAllPosts();
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleDislike = async (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await blogAPI.dislikePost(postId);
      await loadAllPosts();
    } catch (err) {
      console.error('Error disliking post:', err);
    }
  };

  const handleShare = async (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await blogAPI.sharePost(postId);
      await loadAllPosts();
    } catch (err) {
      console.error('Error sharing post:', err);
    }
  };

  // Comment
  const handleOpenComment = (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    setOpenCommentId(postId);
    setCommentText('');
  };

  const handleCloseComment = () => {
    setOpenCommentId(null);
    setCommentText('');
  };const handleSubmitComment = async (postId: string, commentText: string) => {
  if (!isAuthenticated) return navigate('/login');

  try {
    // 1️⃣ Submit new comment
    await blogAPI.addComment(postId, commentText);

    // 2️⃣ Fetch latest comments for this post
    const latestComments = await blogAPI.getComments(postId); // returns Comment[]

    // Optional mapping if your API uses userEmail instead of username
    const normalizedComments = latestComments.map(c => ({
      id: c.id,
      content: c.content,
      username: c.username ?? (c as any).userEmail, 
      createdAt: c.createdAt,
    }));

    // 3️⃣ Update Redux store
    dispatch(addComment({ postId, allComments: normalizedComments }));

    // 4️⃣ Clear input
    setCommentText('');
  } catch (err) {
    console.error('Error adding comment:', err);
  }
};

  const handleOpenPost = (postId: string) => {
    setOpenPostId(postId);
  };

  const handleClosePost = () => {
    setOpenPostId(null);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        {posts.map(post => (
          <Card key={post.id}>
            <CardContent>
              <Typography variant="h5">{post.title}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
              >
                {post.content}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={`By ${post.user?.firstname ?? ''} ${post.user?.lastname ?? ''}`.trim() || 'Unknown'} size="small" variant="outlined" />
                <Typography variant="caption" color="text.secondary">{new Date(post.createdAt).toLocaleDateString()}</Typography>
              </Box>
            </CardContent>

            <CardActions>
              <IconButton size="small" onClick={() => handleLike(post.id)} color="primary">
                <ThumbUpIcon /> {post.likes}
              </IconButton>
              <IconButton size="small" onClick={() => handleDislike(post.id)} color="secondary">
                <ThumbDownIcon />
              </IconButton>
              <IconButton size="small" onClick={() => handleShare(post.id)} color="primary">
                <ShareIcon /> {post.shares}
              </IconButton>
              <IconButton size="small" onClick={() => handleOpenComment(post.id)} color="primary">
                <CommentIcon /> {post.comments?.length ?? 0}
              </IconButton>
              <Button size="small" onClick={() => handleOpenPost(post.id)} sx={{ ml: 'auto' }}>Read More</Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Post Details Dialog */}
      <Dialog open={!!selectedPost} onClose={handleClosePost} maxWidth="md" fullWidth>
        {selectedPost && (
          <>
            <DialogTitle>{selectedPost.title}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="text.secondary">
                By {selectedPost.user?.firstname} {selectedPost.user?.lastname} • {new Date(selectedPost.createdAt).toLocaleString()}
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-line', mt: 2 }}>{selectedPost.content}</Typography>
              {selectedPost.imageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img src={selectedPost.imageUrl} alt={selectedPost.title} style={{ width: '100%', borderRadius: 8 }} />
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Comment Dialog */}
      {/* Comment Dialog */}
      <Dialog open={!!commentPost} onClose={handleCloseComment} maxWidth="sm" fullWidth>
        {commentPost && (
          <>
            <DialogTitle>Add a Comment</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="text.secondary">
                Commenting on: {commentPost.title}
              </Typography>

              <TextField
                multiline
                rows={4}
                fullWidth
                sx={{ mt: 2 }}
                placeholder="Write your comment here..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
              />

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button variant="outlined" onClick={handleCloseComment}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={() => handleSubmitComment(commentPost.id, commentText)}
                  disabled={!commentText.trim()}
                >
                  Submit
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Existing Comments:</Typography>
                {commentPost.comments.length === 0 && <Typography>No comments yet.</Typography>}
                {commentPost.comments.map(c => (
                  <Box key={c.id} sx={{ mt: 1, p: 1, bgcolor: '#f1f1f1', borderRadius: 1 }}>
                    <Typography variant="body2">{c.content}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.username} • {new Date(c.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

    </Container>
  );
};

export default Home;
