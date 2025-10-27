

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import { setPosts, addComment, setCurrentPost } from '../store/slices/blogSlice';
// import { fetchAllPosts } from '../services/PostService';
// import { blogAPI } from '../services/api';
// import { normalizeCreatedAt } from '../utils/normalize';
// import type Post  from '../store/slices/blogSlice';

// import {
//   Container, Box, Card, CardContent, CardActions, Typography,
//   Button, IconButton, Chip, Dialog, DialogContent, DialogTitle, TextField
// } from '@mui/material';
// import { ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon, Share as ShareIcon, Comment as CommentIcon } from '@mui/icons-material';

// // Types
// interface User {
//   userId: number;
//   firstname?: string | null;
//   lastname?: string | null;
//   emailid: string;
//   profileImageUrl?: string | null;
//   bio?: string | null;
// }

// // interface Comment {
// //   id: string;
// //   content: string;
// //   username: string;
// //   userId?: number; // used for navigation
// //   createdAt: string;
// // }

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   imageUrl?: string;
//   user?: User;
//   dateCreated: string;
//   likes: number;
//   shares: number;
//   comments: Comment[];
//   commentsCount?: number;
// }

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { posts } = useSelector((state: RootState) => state.blog);
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const [openPostId, setOpenPostId] = useState<string | null>(null);
//   const [openCommentId, setOpenCommentId] = useState<string | null>(null);
//   const [commentText, setCommentText] = useState('');

//   const selectedPost = openPostId ? posts.find(p => String(p.id) === String(openPostId)) ?? null : null;
//   const commentPost = openCommentId ? posts.find(p => String(p.id) === String(openCommentId)) ?? null : null;

//   const loadAllPosts = async () => {
//     try {
//       let allPosts: Post[] = await fetchAllPosts();
//       allPosts = allPosts.map(post => {
//         const dateCreated = normalizeCreatedAt(post.dateCreated);
//         const commentsArray: Comment[] = Array.isArray(post.comments) ? post.comments : [];
//         const commentsCount = typeof post.commentsCount === 'number' ? post.commentsCount : commentsArray.length;
//         return { ...post, dateCreated, comments: commentsArray, commentsCount };
//       });
//       dispatch(setPosts(allPosts));
//     } catch (err) {
//       console.error('Failed to fetch posts', err);
//     }
//   };

//   useEffect(() => { loadAllPosts(); }, [dispatch]);

//   // Like / Dislike / Share
//   const handleLike = async (postId: string) => {
//     if (!isAuthenticated) return navigate('/login');
//     try { await blogAPI.likePost(postId); await loadAllPosts(); } catch (err) { console.error(err); }
//   };
//   const handleDislike = async (postId: string) => {
//     if (!isAuthenticated) return navigate('/login');
//     try { await blogAPI.dislikePost(postId); await loadAllPosts(); } catch (err) { console.error(err); }
//   };
//   const handleShare = async (postId: string) => {
//     if (!isAuthenticated) return navigate('/login');
//     try { await blogAPI.sharePost(postId); await loadAllPosts(); } catch (err) { console.error(err); }
//   };

//   // Comment handling
//   const handleOpenComment = (postId: string) => { if (!isAuthenticated) return navigate('/login'); setOpenCommentId(postId); setCommentText(''); };
//   const handleCloseComment = () => { setOpenCommentId(null); setCommentText(''); };

//   const handleSubmitComment = async (postId: string, commentText: string) => {
//     if (!isAuthenticated) return navigate('/login');
//     try {
//       // Add comment
//       await blogAPI.addComment(postId, commentText);

//       // Fetch latest comments
//       const latestComments = await blogAPI.getComments(postId);

//       // Normalize comments to include userId for navigation
//       const normalizedComments: Comment[] = latestComments.map(c => ({
//         id: c.id,
//         content: c.content,
//         username: c.user?.firstname || c.user?.emailid || 'Unknown',
//         userId: c.user?.userId,
//         createdAt: c.createdAt
//       }));

//       dispatch(addComment({ postId, allComments: normalizedComments }));

//       // Refresh selected post
//       const refreshedPost = await blogAPI.getPost(postId);
//       dispatch(setCurrentPost(refreshedPost));

//       setCommentText('');
//     } catch (err) { console.error(err); }
//   };

//   const handleOpenPost = (postId: string) => setOpenPostId(postId);
//   const handleClosePost = () => setOpenPostId(null);

//   return (
//     <Container sx={{ mt: 4 }}>
//       {/* Posts Grid */}
//       <Box component="section" sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' } }}>
//         {posts.map(post => (
//           <Card key={post.id} sx={{ display: 'flex', flexDirection: 'column', minHeight: 380, borderRadius: 2 }} elevation={2}>
//             {post.imageUrl && (
//               <Box sx={{ height: { xs: 140, sm: 160, md: 200 }, overflow: 'hidden' }}>
//                 <img
//                   src={post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:8080${post.imageUrl}`}
//                   alt={post.title}
//                   style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                 />
//               </Box>
//             )}

//             <CardContent sx={{ flexGrow: 1 }}>
//               <Typography variant="h6" gutterBottom>{post.title}</Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical' }}>
//                 {post.content}
//               </Typography>

//               <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Chip
//                   label={post.user?.firstname || post.user?.lastname ? `${post.user.firstname ?? ''} ${post.user.lastname ?? ''}`.trim() : post.user?.emailid ?? 'Unknown'}
//                   size="small"
//                   variant="outlined"
//                   clickable
//                   onClick={() => post.user?.userId && navigate(`/profile/${post.user.userId}`)}
//                 />
//                 <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
//                   {new Date(post.createdAt).toLocaleDateString()}
//                 </Typography>
//               </Box>
//             </CardContent>

//             <CardActions sx={{ mt: 'auto', px: 2, pb: 2 }}>
//               <IconButton size="small" onClick={() => handleLike(post.id)} color="primary"><ThumbUpIcon /></IconButton>
//               <Typography variant="body2" sx={{ mr: 2 }}>{post.likes ?? 0}</Typography>

//               <IconButton size="small" onClick={() => handleDislike(post.id)} color="secondary"><ThumbDownIcon /></IconButton>

//               <IconButton size="small" onClick={() => handleShare(post.id)} color="primary"><ShareIcon /></IconButton>
//               <Typography variant="body2" sx={{ mr: 'auto' }}>{post.shares ?? 0}</Typography>

//               <IconButton size="small" onClick={() => handleOpenComment(String(post.id))} color="primary"><CommentIcon /></IconButton>
//               <Typography variant="body2">{post.commentsCount ?? post.comments?.length ?? 0}</Typography>

//               <Button size="small" onClick={() => handleOpenPost(post.id)}>Read More</Button>
//             </CardActions>
//           </Card>
//         ))}
//       </Box>

//       {/* Post Dialog */}
//       <Dialog open={!!selectedPost} onClose={handleClosePost} maxWidth="md" fullWidth>
//         {selectedPost && (
//           <>
//             <DialogTitle>{selectedPost.title}</DialogTitle>
//             <DialogContent dividers>
//               <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Chip
//                   label={selectedPost.user?.firstname || selectedPost.user?.lastname ? `${selectedPost.user.firstname ?? ''} ${selectedPost.user.lastname ?? ''}`.trim() : selectedPost.user?.emailid ?? 'Unknown'}
//                   size="small"
//                   variant="outlined"
//                   clickable
//                   onClick={() => selectedPost.user?.userId && navigate(`/profile/${selectedPost.user.userId}`)}
//                 />
//                 <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
//                   {new Date(selectedPost.createdAt).toLocaleDateString()}
//                 </Typography>
//               </Box>

//               {selectedPost.imageUrl && (
//                 <Box sx={{ mt: 2 }}>
//                   <img
//                     src={selectedPost.imageUrl.startsWith('http') ? selectedPost.imageUrl : `http://localhost:8080${selectedPost.imageUrl}`}
//                     alt={selectedPost.title}
//                     style={{ width: '100%', borderRadius: 8 }}
//                   />
//                 </Box>
//               )}

//               <Typography sx={{ whiteSpace: 'pre-line', mt: 2 }}>{selectedPost.content}</Typography>
//             </DialogContent>
//           </>
//         )}
//       </Dialog>

//       {/* Comment Dialog */}
//       <Dialog open={Boolean(openCommentId)} onClose={handleCloseComment} maxWidth="sm" fullWidth>
//         {commentPost && (
//           <>
//             <DialogTitle>Add a Comment</DialogTitle>
//             <DialogContent dividers>
//               <Typography variant="subtitle2" color="text.secondary">Commenting on: {commentPost.title}</Typography>

//               <TextField
//                 multiline rows={4} fullWidth sx={{ mt: 2 }}
//                 placeholder="Write your comment here..."
//                 value={commentText}
//                 onChange={e => setCommentText(e.target.value)}
//               />

//               <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
//                 <Button variant="outlined" onClick={handleCloseComment}>Cancel</Button>
//                 <Button variant="contained" onClick={() => handleSubmitComment(commentPost.id, commentText)} disabled={!commentText.trim()}>Submit</Button>
//               </Box>

//               <Box sx={{ mt: 2 }}>
//                 <Typography variant="subtitle2">Existing Comments:</Typography>
//                 {commentPost.comments.length === 0 && <Typography>No comments yet.</Typography>}
//                 {commentPost.comments.map(c => (
//                   <Box key={c.id} sx={{ mt: 1, p: 1, bgcolor: '#f1f1f1', borderRadius: 1 }}>
//                     <Typography variant="body2">{c.content}</Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       <Chip
//                         label={c.username}
//                         size="small"
//                         variant="outlined"
//                         clickable
//                         onClick={() => c.userId && navigate(`/profile/${c.userId}`)}
//                         sx={{ mr: 1 }}
//                       />
//                       • {new Date(c.createdAt).toLocaleString()}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </DialogContent>
//           </>
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
import { setPosts, addComment, setCurrentPost } from '../store/slices/blogSlice';
import { fetchAllPosts } from '../services/PostService';
import { blogAPI } from '../services/api';
import { normalizeCreatedAt } from '../utils/normalize';
import {
  Container, Box, Card, CardContent, CardActions, Typography,
  Button, IconButton, Chip, Dialog, DialogContent, DialogTitle, TextField
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Share as ShareIcon,
  Comment as CommentIcon
} from '@mui/icons-material';

// ✅ Use shared types from Redux slice instead of local interfaces
import type { Post, Comment } from '../store/slices/blogSlice';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts } = useSelector((state: RootState) => state.blog);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [openCommentId, setOpenCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const selectedPost = openPostId ? posts.find(p => String(p.id) === String(openPostId)) ?? null : null;
  const commentPost = openCommentId ? posts.find(p => String(p.id) === String(openCommentId)) ?? null : null;

  const loadAllPosts = async () => {
    try {
      let allPosts: Post[] = await fetchAllPosts();
      allPosts = allPosts.map(post => {
        const dateCreated = normalizeCreatedAt(post.dateCreated ?? new Date().toISOString());
        const commentsArray: Comment[] = Array.isArray(post.comments) ? post.comments : [];
        const commentsCount = typeof post.commentsCount === 'number' ? post.commentsCount : commentsArray.length;
        return { ...post, dateCreated, comments: commentsArray, commentsCount };
      });
      dispatch(setPosts(allPosts));
    } catch (err) {
      console.error('Failed to fetch posts', err);
    }
  };

  useEffect(() => {
    loadAllPosts();
  }, [dispatch]);

  // ✅ Like / Dislike / Share
  const handleLike = async (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await blogAPI.likePost(postId);
      await loadAllPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await blogAPI.dislikePost(postId);
      await loadAllPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await blogAPI.sharePost(postId);
      await loadAllPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Comment handling
  const handleOpenComment = (postId: string) => {
    if (!isAuthenticated) return navigate('/login');
    setOpenCommentId(postId);
    setCommentText('');
  };
  const handleCloseComment = () => {
    setOpenCommentId(null);
    setCommentText('');
  };

  const handleSubmitComment = async (postId: string, commentText: string) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      await blogAPI.addComment(postId, commentText);

      // Fetch latest comments
      const latestComments = await blogAPI.getComments(postId);

      // Normalize comments with user info
      const normalizedComments: Comment[] = latestComments.map((c: any) => ({
        id: c.id,
        content: c.content,
        username: c.user?.firstname || c.user?.emailid || 'Unknown',
        userId: c.user?.userId,
        createdAt: c.createdAt,
      }));

      // ✅ Dispatch with consistent slice type
      dispatch(addComment({ postId, allComments: normalizedComments }));

      // Refresh post
      const refreshedPost = await blogAPI.getPost(postId);
      dispatch(setCurrentPost(refreshedPost));

      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenPost = (postId: string) => setOpenPostId(postId);
  const handleClosePost = () => setOpenPostId(null);

  return (
    <Container sx={{ mt: 4 }}>
      {/* ✅ Posts Grid */}
      <Box
        component="section"
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        }}
      >
        {posts.map(post => (
          <Card
            key={post.id}
            sx={{ display: 'flex', flexDirection: 'column', minHeight: 380, borderRadius: 2 }}
            elevation={2}
          >
            {post.imageUrl && (
              <Box sx={{ height: { xs: 140, sm: 160, md: 200 }, overflow: 'hidden' }}>
                <img
                  src={post.imageUrl.startsWith('http') ? post.imageUrl : `http://localhost:8080${post.imageUrl}`}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>{post.title}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {post.content}
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={post.user?.firstname || post.user?.lastname
                    ? `${post.user.firstname ?? ''} ${post.user.lastname ?? ''}`.trim()
                    : post.user?.emailid ?? 'Unknown'}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => post.user?.userId && navigate(`/profile/${post.user.userId}`)}
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {new Date(post.dateCreated ?? '').toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>

            <CardActions sx={{ mt: 'auto', px: 2, pb: 2 }}>
              <IconButton size="small" onClick={() => handleLike(post.id)} color="primary">
                <ThumbUpIcon />
              </IconButton>
              <Typography variant="body2" sx={{ mr: 2 }}>{post.likes ?? 0}</Typography>

              <IconButton size="small" onClick={() => handleDislike(post.id)} color="secondary">
                <ThumbDownIcon />
              </IconButton>

              <IconButton size="small" onClick={() => handleShare(post.id)} color="primary">
                <ShareIcon />
              </IconButton>
              <Typography variant="body2" sx={{ mr: 'auto' }}>{post.shares ?? 0}</Typography>

              <IconButton size="small" onClick={() => handleOpenComment(String(post.id))} color="primary">
                <CommentIcon />
              </IconButton>
              <Typography variant="body2">{post.commentsCount ?? post.comments?.length ?? 0}</Typography>

              <Button size="small" onClick={() => handleOpenPost(post.id)}>Read More</Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* ✅ Post Dialog */}
      <Dialog open={!!selectedPost} onClose={handleClosePost} maxWidth="md" fullWidth>
        {selectedPost && (
          <>
            <DialogTitle>{selectedPost.title}</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={selectedPost.user?.firstname || selectedPost.user?.lastname
                    ? `${selectedPost.user.firstname ?? ''} ${selectedPost.user.lastname ?? ''}`.trim()
                    : selectedPost.user?.emailid ?? 'Unknown'}
                  size="small"
                  variant="outlined"
                  clickable
                  onClick={() => selectedPost.user?.userId && navigate(`/profile/${selectedPost.user.userId}`)}
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {new Date(selectedPost.dateCreated ?? '').toLocaleDateString()}
                </Typography>
              </Box>

              {selectedPost.imageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={selectedPost.imageUrl.startsWith('http')
                      ? selectedPost.imageUrl
                      : `http://localhost:8080${selectedPost.imageUrl}`}
                    alt={selectedPost.title}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Box>
              )}

              <Typography sx={{ whiteSpace: 'pre-line', mt: 2 }}>{selectedPost.content}</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* ✅ Comment Dialog */}
      <Dialog open={Boolean(openCommentId)} onClose={handleCloseComment} maxWidth="sm" fullWidth>
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
                      <Chip
                        label={c.username}
                        size="small"
                        variant="outlined"
                        clickable
                        onClick={() => c.userId && navigate(`/profile/${c.userId}`)}
                        sx={{ mr: 1 }}
                      />
                      • {new Date(c.createdAt).toLocaleString()}
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
