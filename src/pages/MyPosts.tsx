// import React, { useEffect, useState } from 'react';
// import { blogAPI } from '../services/api';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import {
//   Container,
//   Typography,
//   Paper,
//   CircularProgress,
//   Alert,
//   CardMedia,
//   CardContent,
//   Box,
// } from '@mui/material';
// import { Post, CreatedAtObject } from '../types';

// // Utility to normalize createdAt to string
// const normalizeCreatedAt = (createdAt: string | CreatedAtObject): string => {
//   return typeof createdAt === 'string' ? createdAt : createdAt.dateCreated;
// };

// const MyPosts: React.FC = () => {
//   const { user } = useSelector((state: RootState) => state.auth);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUserPosts = async () => {
//       try {
//         if (!user?.email) {
//           setError('User not logged in.');
//           setLoading(false);
//           return;
//         }

//         const response = await blogAPI.getUserPosts(user.email);
//         // Normalize createdAt for all posts
//         const normalizedPosts: Post[] = response.map((post: Post) => ({
//           ...post,
//           createdAt: typeof post.createdAt === 'string'
//             ? post.createdAt
//             : post.createdAt.dateCreated, // <-- now it's a string
//         }));
//         setPosts(normalizedPosts);
//       } catch (err: any) {
//         setError(err?.response?.data?.message || 'Failed to load user posts.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserPosts();
//   }, [user]);

//   if (loading) {
//     return (
//       <Container sx={{ mt: 4 }}>
//         <CircularProgress />
//       </Container>
//     );
//   }

//   if (error) {
//     return (
//       <Container sx={{ mt: 4 }}>
//         <Alert severity="error">{error}</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="md" sx={{ mt: 4 }}>
//       <Typography variant="h4" gutterBottom>
//         My Posts
//       </Typography>

//       {posts.length === 0 ? (
//         <Typography>No posts found.</Typography>
//       ) : (
//         posts.map((post) => (
//           <Paper key={post.id} elevation={3} sx={{ mb: 3, p: 2 }}>
//             {post.imageUrl && (
//               <CardMedia
//                 component="img"
//                 image={post.imageUrl}
//                 alt={post.title}
//                 sx={{ height: 200, objectFit: 'cover' }}
//               />
//             )}
//             <CardContent>
//               <Typography variant="h5">{post.title}</Typography>
//               <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
//                 {post.content}
//               </Typography>
//               <Box sx={{ mt: 1, fontSize: '0.8rem', color: 'gray' }}>
//                 Created: {new Date(post.createdAt).toLocaleString()}
//               </Box>
//             </CardContent>
//           </Paper>
//         ))
//       )}
//     </Container>
//   );
// };

// export default MyPosts;


import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { blogAPI } from '../services/api';
import { Post } from '../types/index';
import { normalizeCreatedAt } from '../utils/normalize';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  CardMedia,
  CardContent,
  Box,
} from '@mui/material';

const MyPosts: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!user?.email) {
          setError('User not logged in.');
          setLoading(false);
          return;
        }

        const response = await blogAPI.getUserPosts(user.email);

        // Normalize createdAt
        const normalizedPosts = response.map((post: Post) => ({
          ...post,
          createdAt: normalizeCreatedAt(post.createdAt),
        }));

        setPosts(normalizedPosts);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load user posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  if (loading) return <Container sx={{ mt: 4 }}><CircularProgress /></Container>;
  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Posts</Typography>
      {posts.length === 0 ? (
        <Typography>No posts found.</Typography>
      ) : (
        posts.map(post => (
          <Paper key={post.id} elevation={3} sx={{ mb: 3, p: 2 }}>
            {post.imageUrl && <CardMedia component="img" image={post.imageUrl} alt={post.title} sx={{ height: 200, objectFit: 'cover' }} />}
            <CardContent>
              <Typography variant="h5">{post.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{post.content}</Typography>
              <Box sx={{ mt: 1, fontSize: '0.8rem', color: 'gray' }}>
                Created: {new Date(post.createdAt).toLocaleString()}
              </Box>
            </CardContent>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default MyPosts;
