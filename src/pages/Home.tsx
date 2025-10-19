// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import { setPosts, addComment, setCurrentPost /* or updatePosts */ } from '../store/slices/blogSlice';
// import { fetchAllPosts } from '../services/PostService';
// import { blogAPI } from '../services/api';
// import { normalizeCreatedAt } from '../utils/normalize';
// import {
//   Container, Box, Card, CardContent, CardActions, Typography,
//   Button, IconButton, Chip, Dialog, DialogContent, DialogTitle, TextField
// } from '@mui/material';
// import { ThumbUp as ThumbUpIcon, ThumbDown as ThumbDownIcon, Share as ShareIcon, Comment as CommentIcon } from '@mui/icons-material';

// const Home: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { posts } = useSelector((state: RootState) => state.blog);
//   const { isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const [openPostId, setOpenPostId] = useState<string | null>(null);
//   const [openCommentId, setOpenCommentId] = useState<string | null>(null);
//   const [commentText, setCommentText] = useState('');

//   const selectedPost = openPostId
//     ? posts.find(p => String(p.id) === String(openPostId)) ?? null
//     : null;

//   const commentPost = openCommentId
//     ? posts.find(p => String(p.id) === String(openCommentId)) ?? null
//     : null;

//   const loadAllPosts = async () => {
//     try {
//       let allPosts = await fetchAllPosts();
//       // normalize and ensure commentsCount exists
//       allPosts = allPosts.map(post => {
//         // make sure createdAt is a string (you already call normalizeCreatedAt)
//         const createdAt = normalizeCreatedAt(post.createdAt);
//         // ensure comments array is at least an empty array
//         const commentsArray = Array.isArray(post.comments) ? post.comments : [];
//         // prefer a backend-provided explicit count if available, else use comments.length
//         const commentsCount = typeof (post as any).commentsCount === 'number'
//           ? (post as any).commentsCount
//           : commentsArray.length;

//         return {
//           ...post,
//           createdAt,
//           comments: commentsArray,
//           commentsCount,
//         };
//       });
//       dispatch(setPosts(allPosts));
//     } catch (err) {
//       console.error('Failed to fetch posts', err);
//     }
//   };

//   useEffect(() => {
//     loadAllPosts();
//   }, [dispatch]);

//   // Like / Dislike / Share
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

//   // Comment
//   const handleOpenComment = (postId: string) => {
//     if (!isAuthenticated) return navigate('/login');
//     setOpenCommentId(postId);
//     setCommentText('');
//   };

//   const handleCloseComment = () => {
//     setOpenCommentId(null);
//     setCommentText('');
//   };const handleSubmitComment = async (postId: string, commentText: string) => {
//   if (!isAuthenticated) return navigate('/login');

//   try {
//     // 1️⃣ Submit new comment
//     await blogAPI.addComment(postId, commentText);

//     // 2️⃣ Fetch latest comments for this post
//     const latestComments = await blogAPI.getComments(postId); // returns Comment[]

//     // Optional mapping if your API uses userEmail instead of username
//     const normalizedComments = latestComments.map(c => ({
//       id: c.id,
//       content: c.content,
//       username: c.username ?? (c as any).userEmail, 
//       createdAt: c.createdAt,
//     }));

//     // 3️⃣ Update Redux store
//     dispatch(addComment({ postId, allComments: normalizedComments }));

//     // 3b️⃣ Refresh the post object (includes latest comments/commentsCount) and update the posts list
//     try {
//       const refreshedPost = await blogAPI.getPost(postId);
//       // keep the selected post in sync
//       dispatch(setCurrentPost(refreshedPost));
//       // or update the posts list: dispatch(updatePosts(updatedPostsArray));
//     } catch (err) {
//       console.warn('Failed to refresh post after adding comment', err);
//     }

//     // 4️⃣ Clear input
//     setCommentText('');
//   } catch (err) {
//     console.error('Error adding comment:', err);
//   }
// };

//   const handleOpenPost = (postId: string) => {
//     setOpenPostId(postId);
//   };

//   const handleClosePost = () => {
//     setOpenPostId(null);
//   };

//   return (
//   <Container sx={{ mt: 4 }}>
//     <Box sx={{ display: 'grid', gap: 3 }}>
//       {posts.map(post => (
//         <Card key={post.id}>
//           <CardContent>
//             <Typography variant="h5">{post.title}</Typography>

//             {/* 🖼️ Show image preview if available */}
//             {post.imageUrl && (
//               <Box sx={{ mt: 2 }}>
//                 <img
//                   src={
//                     post.imageUrl.startsWith('http')
//                       ? post.imageUrl
//                       : `http://localhost:8080${post.imageUrl}`
//                   }
//                   alt={post.title}
//                   style={{
//                     width: '100%',
//                     maxHeight: 250,
//                     objectFit: 'cover',
//                     borderRadius: 8,
//                     marginBottom: 8,
//                   }}
//                 />
//               </Box>
//             )}

//             <Typography
//               variant="body2"
//               color="text.secondary"
//               sx={{
//                 overflow: 'hidden',
//                 textOverflow: 'ellipsis',
//                 display: '-webkit-box',
//                 WebkitLineClamp: 3,
//                 WebkitBoxOrient: 'vertical',
//               }}
//             >
//               {post.content}
//             </Typography>

//             <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Chip
//                 label={`By ${post.user?.firstname ?? ''} ${post.user?.lastname ?? ''}`.trim() || 'Unknown'}
//                 size="small"
//                 variant="outlined"
//               />
//               <Typography variant="caption" color="text.secondary">
//                 {new Date(post.createdAt).toLocaleDateString()}
//               </Typography>
//             </Box>
//           </CardContent>

//           <CardActions>
//             <IconButton size="small" onClick={() => handleLike(post.id)} color="primary">
//               <ThumbUpIcon /> {post.likes}
//             </IconButton>
//             <IconButton size="small" onClick={() => handleDislike(post.id)} color="secondary">
//               <ThumbDownIcon />
//             </IconButton>
//             <IconButton size="small" onClick={() => handleShare(post.id)} color="primary">
//               <ShareIcon /> {post.shares}
//             </IconButton>
//             <IconButton size="small" onClick={() => handleOpenComment(String(post.id))} color="primary">
//               <CommentIcon /> {post.commentsCount ?? post.comments?.length ?? 0}
//             </IconButton>
//             <Button size="small" onClick={() => handleOpenPost(post.id)} sx={{ ml: 'auto' }}>
//               Read More
//             </Button>
//           </CardActions>
//         </Card>
//       ))}
//     </Box>

//     {/* 🧩 Post Details Dialog */}
//     <Dialog open={!!selectedPost} onClose={handleClosePost} maxWidth="md" fullWidth>
//       {selectedPost && (
//         <>
//           <DialogTitle>{selectedPost.title}</DialogTitle>
//           <DialogContent dividers>
//             <Typography variant="subtitle2" color="text.secondary">
//               By {selectedPost.user?.firstname} {selectedPost.user?.lastname} •{' '}
//               {new Date(selectedPost.createdAt).toLocaleString()}
//             </Typography>

//             {/* 🖼️ Show full image in dialog */}
//             {selectedPost.imageUrl && (
//               <Box sx={{ mt: 2 }}>
//                 <img
//                   src={
//                     selectedPost.imageUrl.startsWith('http')
//                       ? selectedPost.imageUrl
//                       : `http://localhost:8080${selectedPost.imageUrl}`
//                   }
//                   alt={selectedPost.title}
//                   style={{ width: '100%', borderRadius: 8 }}
//                 />
//               </Box>
//             )}

//             <Typography sx={{ whiteSpace: 'pre-line', mt: 2 }}>
//               {selectedPost.content}
//             </Typography>
//           </DialogContent>
//         </>
//       )}
//     </Dialog>

//     {/* 💬 Comment Dialog */}
//     <Dialog open={Boolean(openCommentId)} onClose={handleCloseComment} maxWidth="sm" fullWidth>
//       {commentPost && (
//         <>
//           <DialogTitle>Add a Comment</DialogTitle>
//           <DialogContent dividers>
//             <Typography variant="subtitle2" color="text.secondary">
//               Commenting on: {commentPost.title}
//             </Typography>

//             <TextField
//               multiline
//               rows={4}
//               fullWidth
//               sx={{ mt: 2 }}
//               placeholder="Write your comment here..."
//               value={commentText}
//               onChange={e => setCommentText(e.target.value)}
//             />

//             <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
//               <Button variant="outlined" onClick={handleCloseComment}>Cancel</Button>
//               <Button
//                 variant="contained"
//                 onClick={() => handleSubmitComment(commentPost.id, commentText)}
//                 disabled={!commentText.trim()}
//               >
//                 Submit
//               </Button>
//             </Box>

//             <Box sx={{ mt: 2 }}>
//               <Typography variant="subtitle2">Existing Comments:</Typography>
//               {commentPost.comments.length === 0 && <Typography>No comments yet.</Typography>}
//               {commentPost.comments.map(c => (
//                 <Box key={c.id} sx={{ mt: 1, p: 1, bgcolor: '#f1f1f1', borderRadius: 1 }}>
//                   <Typography variant="body2">{c.content}</Typography>
//                   <Typography variant="caption" color="text.secondary">
//                     {c.username} • {new Date(c.createdAt).toLocaleString()}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           </DialogContent>
//         </>
//       )}
//     </Dialog>

//     </Container>
//   );
// };

// export default Home;









import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setPosts, addComment, setCurrentPost /* or updatePosts */ } from '../store/slices/blogSlice';
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

  const selectedPost = openPostId
    ? posts.find(p => String(p.id) === String(openPostId)) ?? null
    : null;

  const commentPost = openCommentId
    ? posts.find(p => String(p.id) === String(openCommentId)) ?? null
    : null;

  const loadAllPosts = async () => {
    try {
      let allPosts = await fetchAllPosts();
      // normalize and ensure commentsCount exists
      allPosts = allPosts.map(post => {
        // make sure createdAt is a string (you already call normalizeCreatedAt)
        const createdAt = normalizeCreatedAt(post.createdAt);
        // ensure comments array is at least an empty array
        const commentsArray = Array.isArray(post.comments) ? post.comments : [];
        // prefer a backend-provided explicit count if available, else use comments.length
        const commentsCount = typeof (post as any).commentsCount === 'number'
          ? (post as any).commentsCount
          : commentsArray.length;

        return {
          ...post,
          createdAt,
          comments: commentsArray,
          commentsCount,
        };
      });
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

    // 3b️⃣ Refresh the post object (includes latest comments/commentsCount) and update the posts list
    try {
      const refreshedPost = await blogAPI.getPost(postId);
      // keep the selected post in sync
      dispatch(setCurrentPost(refreshedPost));
      // or update the posts list: dispatch(updatePosts(updatedPostsArray));
    } catch (err) {
      console.warn('Failed to refresh post after adding comment', err);
    }

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
      {/* Posts grid: responsive columns */}
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
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: 380, // taller cards
              borderRadius: 2,
            }}
            elevation={2}
          >
            {/* Image (if present) */}
            {post.imageUrl && (
              <Box
                sx={{
                  height: { xs: 140, sm: 160, md: 200 },
                  overflow: 'hidden',
                }}
              >
                <img
                  src={
                    typeof post.imageUrl === 'string' && post.imageUrl.startsWith('http')
                      ? post.imageUrl
                      : `http://localhost:8080${post.imageUrl}`
                  }
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </Box>
            )}

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="h3" gutterBottom noWrap={false}>
                {post.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 6, // show more lines than before
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {post.content}
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`By ${post.user?.firstname ?? ''} ${post.user?.lastname ?? ''}`.trim() || 'Unknown'}
                  size="small"
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </CardContent>

            <CardActions sx={{ mt: 'auto', px: 2, pb: 2 }}>
              <IconButton size="small" onClick={() => handleLike(post.id)} color="primary">
                <ThumbUpIcon />
              </IconButton>
              <Typography variant="body2" sx={{ mr: 2 }}>{post.likes}</Typography>

              <IconButton size="small" onClick={() => handleDislike(post.id)} color="secondary">
                <ThumbDownIcon />
              </IconButton>

              <IconButton size="small" onClick={() => handleShare(post.id)} color="primary">
                <ShareIcon />
              </IconButton>
              <Typography variant="body2" sx={{ mr: 'auto' }}>{post.shares}</Typography>

              <IconButton size="small" onClick={() => handleOpenComment(String(post.id))} color="primary">
                <CommentIcon />
              </IconButton>
              <Typography variant="body2">{post.commentsCount ?? post.comments?.length ?? 0}</Typography>

              <Button size="small" onClick={() => handleOpenPost(post.id)} sx={{ ml: 1 }}>
                Read More
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* 🧩 Post Details Dialog */}
      <Dialog open={!!selectedPost} onClose={handleClosePost} maxWidth="md" fullWidth>
        {selectedPost && (
          <>
            <DialogTitle>{selectedPost.title}</DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" color="text.secondary">
                By {selectedPost.user?.firstname} {selectedPost.user?.lastname} •{' '}
                {new Date(selectedPost.createdAt).toLocaleString()}
              </Typography>

              {/* 🖼️ Show full image in dialog */}
              {selectedPost.imageUrl && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={
                      selectedPost.imageUrl.startsWith('http')
                        ? selectedPost.imageUrl
                        : `http://localhost:8080${selectedPost.imageUrl}`
                    }
                    alt={selectedPost.title}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Box>
              )}

              <Typography sx={{ whiteSpace: 'pre-line', mt: 2 }}>
                {selectedPost.content}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* 💬 Comment Dialog */}
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
