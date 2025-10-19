// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Avatar,
//   Divider,
//   Chip,
// } from '@mui/material';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   imageUrl?: string;
//   user?: {
//     userId: number;
//     emailid: string;
//     firstname: string | null;
//     lastname: string | null;
//   };
//   createdAt: string;
//   likes: number;
//   comments: any[];
// }

// const Profile: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useSelector((state: RootState) => state.auth);
//   const { posts } = useSelector((state: RootState) => state.blog) as { posts: Post[] };

//   const userPosts = posts.filter((post: Post) => post.user?.userId === user?.id);

//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//     }
//   }, [user, navigate]);

//   if (!user) {
//     return null;
//   }

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4 }}>
//       <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 4 }}>
//         <Box>
//           <Paper elevation={3} sx={{ p: 3 }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Avatar
//                 sx={{
//                   width: 100,
//                   height: 100,
//                   fontSize: '2rem',
//                   mb: 2,
//                 }}
//               >
//                 {(user.username || user.email || 'U')[0].toUpperCase()}
//               </Avatar>
//               <Typography variant="h5" gutterBottom>
//                 {user.username}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" gutterBottom>
//                 {user.email}
//               </Typography>
//               <Chip
//                 label={user.role}
//                 color={user.role === 'admin' ? 'secondary' : 'primary'}
//                 sx={{ mt: 1 }}
//               />
//             </Box>
//             <Divider sx={{ my: 3 }} />
//             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
//               <Box>
//                 <Typography variant="h4">{userPosts.length}</Typography>
//                 <Typography variant="body2" color="text.secondary">Posts</Typography>
//               </Box>
//               <Box>
//                 <Typography variant="h4">
//                   {userPosts.reduce((acc, post) => acc + post.likes, 0)}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">Likes</Typography>
//               </Box>
//               <Box>
//                 <Typography variant="h4">
//                   {userPosts.reduce((acc, post) => acc + post.comments.length, 0)}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">Comments</Typography>
//               </Box>
//             </Box>
//           </Paper>
//         </Box>
//         <Box>
//           <Typography variant="h5" gutterBottom>My Posts</Typography>
//           <Box sx={{ display: 'grid', gap: 3 }}>
//             {userPosts.map((post: Post) => (
//               <Card key={post.id}>
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom>
//                     {post.title}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     color="text.secondary"
//                     sx={{
//                       overflow: 'hidden',
//                       textOverflow: 'ellipsis',
//                       display: '-webkit-box',
//                       WebkitLineClamp: 2,
//                       WebkitBoxOrient: 'vertical',
//                     }}
//                   >
//                     {post.content}
//                   </Typography>
//                   <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                     <Chip
//                       size="small"
//                       label={`${post.likes} likes`}
//                       variant="outlined"
//                     />
//                     <Chip
//                       size="small"
//                       label={`${post.comments.length} comments`}
//                       variant="outlined"
//                     />
//                     <Typography variant="caption" color="text.secondary">
//                       {new Date(post.createdAt).toLocaleDateString()}
//                     </Typography>
//                   </Box>
//                 </CardContent>
//                 <CardActions>
//                   <Button
//                     size="small"
//                     onClick={() => navigate(`/post/${post.id}`)}
//                   >
//                     Read More
//                   </Button>
//                   <Button
//                     size="small"
//                     onClick={() => navigate(`/edit-post/${post.id}`)}
//                   >
//                     Edit
//                   </Button>
//                 </CardActions>
//               </Card>
//             ))}
//           </Box>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default Profile; 


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Divider,
  Chip,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { AdminUser } from 'types/index';
import axios from 'axios';

interface Post {
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
  comments: any[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth) as { user: AdminUser | null };
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const followersCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('token'); // or wherever you store JWT
        const response = await axios.get('http://localhost:8080/api/posts/userPosts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // assuming API returns { status: 200, message: '', data: Post[] }
        setUserPosts(response.data.data || []);
      } catch (err) {
        console.error('Error fetching user posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 4 }}>
        {/* Profile Summary */}
        <Box>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, fontSize: '2rem', mb: 2 }}>
                {(user.username || user.email || 'U')[0].toUpperCase()}
              </Avatar>
              <Typography variant="h5" gutterBottom>{user.username}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>{user.email}</Typography>
              <Chip
                label={user.role}
                color={user.role === 'admin' ? 'secondary' : 'primary'}
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="h6">{userPosts.length}</Typography>
                <Typography variant="body2" color="text.secondary">Posts</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{followersCount}</Typography>
                <Typography variant="body2" color="text.secondary">Followers</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{followingCount}</Typography>
                <Typography variant="body2" color="text.secondary">Following</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* User Posts */}
        <Box>
          <Typography variant="h5" gutterBottom>My Posts</Typography>
          {loading ? (
            <Typography>Loading posts...</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 3 }}>
              {userPosts.map((post: Post) => (
                <Card key={post.id}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>{post.title}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {post.content}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/post/${post.id}`)}>Read More</Button>
                    <Button size="small" onClick={() => navigate(`/edit-post/${post.id}`)}>Edit</Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
