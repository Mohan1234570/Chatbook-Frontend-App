// import React, { useEffect, useState } from 'react';
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
//   Dialog,
//   DialogContent,
//   IconButton,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import { AdminUser } from 'types/index';
// import axios from 'axios';

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
//   const { user } = useSelector((state: RootState) => state.auth) as { user: AdminUser | null };
//   const [userPosts, setUserPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [openImage, setOpenImage] = useState<string | null>(null);

//   const followersCount = user?.followers?.length || 0;
//   const followingCount = user?.following?.length || 0;

//   useEffect(() => {
//     if (!user) {
//       navigate('/login');
//       return;
//     }

//     // Helpers to normalize server shapes
//     const normalizeDate = (val: any): string => {
//       if (!val) return '';
//       if (typeof val === 'string') return val;
//       if (val instanceof Date) return val.toISOString();
//       if (typeof val === 'object') {
//         // common names we've seen: dateCreated, createdAt, createdOn
//         return val.dateCreated || val.createdAt || val.createdOn || '';
//       }
//       return String(val);
//     };

//     const normalizeLikes = (val: any): number => {
//       if (typeof val === 'number') return val;
//       if (Array.isArray(val)) return val.length;
//       if (val && typeof val === 'object') {
//         if (typeof val.likesCount === 'number') return val.likesCount;
//         if (typeof val.count === 'number') return val.count;
//         if (Array.isArray(val.likes)) return val.likes.length;
//       }
//       return 0;
//     };

//     const normalizeComments = (arr: any): any[] => {
//       if (!Array.isArray(arr)) return [];
//       return arr.map((c: any) => ({
//         ...c,
//         createdAt: normalizeDate(c.createdAt ?? c.createdOn ?? (c.date && c.date.dateCreated) ?? c.dateCreated),
//       }));
//     };

//     const fetchUserPosts = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
//         const response = await axios.get('http://localhost:8080/api/posts/userPosts', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const rawPosts: any[] = response.data?.data ?? [];
//         // map to predictable Post shape
//         const normalized: Post[] = rawPosts.map((p: any) => ({
//           id: p.id ?? p._id ?? String(p.postId ?? p.id),
//           title: p.title ?? '',
//           content: p.content ?? '',
//           imageUrl: p.imageUrl ?? p.image ?? '',
//           user: p.user ?? p.author ?? undefined,
//           createdAt: normalizeDate(
//             p.createdAt ??
//               p.dateCreated ??
//               p.createdOn ??
//               (p.createdAt && (p.createdAt.dateCreated ?? p.createdAt.createdAt)) ??
//               '',
//           ),
//           likes: normalizeLikes(p.likes ?? p.likesCount ?? p.likeCount ?? p.likesDetail ?? 0),
//           comments: normalizeComments(p.comments ?? p.allComments ?? []),
//         }));

//         setUserPosts(normalized);
//       } catch (err) {
//         console.error('Error fetching user posts (normalized):', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserPosts();
//   }, [user, navigate]);

//   if (!user) return null;

//   const handleDeletePost = async (postId: string) => {
//     const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
//     if (!confirmed) return;

//     try {
//       setDeletingId(postId);

//       // pass userEmail as query param and send Authorization header
//       const token = localStorage.getItem('token');
//       const userEmail = user?.email ?? (user as any)?.emailid ?? ''; // fallback if backend uses emailid

//       if (!userEmail) {
//         // safe-guard: if we don't have an email, abort and notify
//         window.alert('Cannot delete post: missing user email.');
//         setDeletingId(null);
//         return;
//       }

//       // DELETE request to backend
//       await axios.delete(`http://localhost:8080/api/posts/${postId}`, {
//         params: { userEmail }, // sends ?userEmail=...
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove the post from local state
//       setUserPosts(prev => prev.filter(p => String(p.id) !== String(postId)));

//       console.log(`Post ${postId} deleted.`);
//     } catch (err) {
//       console.error('Failed to delete post:', err);
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Helper to handle card activation (click or keyboard)
//   const activatePost = (postId: string) => {
//     navigate(`/post/${postId}`);
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 4 }}>
//       {/* Split layout: left = profile, right = posts (50/50 on md+) */}
//       <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
//         {/* Left: Profile Summary (half width on md+) */}
//         <Box>
//           <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Avatar sx={{ width: 100, height: 100, fontSize: '2rem', mb: 2 }}>
//                 {(user.username || user.email || 'U')[0].toUpperCase()}
//               </Avatar>
//               <Typography variant="h5" gutterBottom>
//                 {user.username}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" gutterBottom>
//                 {user.email}
//               </Typography>
//               <Chip label={user.role} color={user.role === 'admin' ? 'secondary' : 'primary'} sx={{ mt: 1 }} />
//             </Box>

//             <Divider sx={{ my: 3 }} />

//             <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
//               <Box>
//                 <Typography variant="h6">{userPosts.length}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Posts
//                 </Typography>
//               </Box>
//               <Box>
//                 <Typography variant="h6">{followersCount}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Followers
//                 </Typography>
//               </Box>
//               <Box>
//                 <Typography variant="h6">{followingCount}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   Following
//                 </Typography>
//               </Box>
//             </Box>
//           </Paper>
//         </Box>

//         {/* Right: All Posts (half width on md+) */}
//         <Box>
//           <Typography variant="h5" gutterBottom>
//             My Posts
//           </Typography>

//           {loading ? (
//             <Typography>Loading posts...</Typography>
//           ) : userPosts.length === 0 ? (
//             <Typography>No posts yet.</Typography>
//           ) : (
//             <Box
//               sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 gap: 3,
//               }}
//             >
//               {userPosts.map((post: Post) => {
//                 const handleCardKeyDown = (e: React.KeyboardEvent) => {
//                   if (e.key === 'Enter' || e.key === ' ') {
//                     e.preventDefault();
//                     activatePost(String(post.id));
//                   }
//                 };

//                 return (
//                   <Card
//                     key={post.id}
//                     onClick={() => activatePost(String(post.id))}
//                     onKeyDown={handleCardKeyDown}
//                     role="button"
//                     tabIndex={0}
//                     sx={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       width: '100%',
//                       borderRadius: 2,
//                       overflow: 'hidden',
//                       boxShadow: 1,
//                       cursor: 'pointer',
//                       '&:hover': { boxShadow: 6, transform: 'translateY(-2px)', transition: 'all 150ms ease' },
//                       outline: 'none',
//                     }}
//                     elevation={2}
//                   >
//                     {/* Image (if present) */}
//                     {post.imageUrl && (
//                       <Box
//                         onClick={(e) => {
//                           // prevent the card click (which would navigate)
//                           e.stopPropagation();
//                           // open the full image modal
//                           setOpenImage(
//                             typeof post.imageUrl === 'string' && post.imageUrl.startsWith('http')
//                               ? post.imageUrl
//                               : `http://localhost:8080${post.imageUrl}`
//                           );
//                         }}
//                         sx={{
//                           width: '100%',
//                           // limit height so layout stays balanced; image will scale to fit
//                           maxHeight: { xs: 240, sm: 300, md: 420 },
//                           overflow: 'hidden',
//                           backgroundColor: '#f5f5f5',
//                           display: 'flex',
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                           cursor: 'pointer',
//                         }}
//                       >
//                         <img
//                           src={
//                             typeof post.imageUrl === 'string' && post.imageUrl.startsWith('http')
//                               ? post.imageUrl
//                               : `http://localhost:8080${post.imageUrl}`
//                           }
//                           alt={post.title}
//                           loading="lazy"
//                           style={{
//                             width: '100%', 
//                             height: 'auto', // preserve aspect ratio — no cropping
//                             objectFit: 'contain',
//                             display: 'block',
//                           }}
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src = '/default-post.png';
//                           }}
//                         />
//                       </Box>
//                     )}

//                     <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
//                       <Typography variant="h6" gutterBottom>
//                         {post.title}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         color="text.secondary"
//                         sx={{
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           display: '-webkit-box',
//                           WebkitLineClamp: 3,
//                           WebkitBoxOrient: 'vertical',
//                         }}
//                       >
//                         {post.content}
//                       </Typography>

//                       <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                         <Typography variant="caption" color="text.secondary">
//                           {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
//                         </Typography>

//                         <Box>
//                           <Typography component="span" variant="body2" sx={{ mr: 1 }}>
//                             ❤️ {post.likes ?? 0}
//                           </Typography>
//                           <Typography component="span" variant="body2">
//                             💬 {post.comments?.length ?? 0}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </Box>

//                     <CardActions sx={{ px: 2, pb: 2 }}>
//                       <Button
//                         size="small"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           navigate(`/post/${post.id}`);
//                         }}
//                       >
//                         Read More
//                       </Button>

//                       {/* NEW: Delete button */}
//                       <Button
//                         size="small"
//                         color="error"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleDeletePost(String(post.id));
//                         }}
//                         disabled={deletingId !== null && deletingId === String(post.id)}
//                       >
//                         {deletingId === String(post.id) ? 'Deleting...' : 'Delete'}
//                       </Button>

//                       <Button
//                         size="small"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           navigate(`/edit-post/${post.id}`);
//                         }}
//                       >
//                         Edit
//                       </Button>
//                     </CardActions>
//                   </Card>
//                 );
//               })}
//             </Box>
//           )}
//         </Box>
//       </Box>

//       {/* Image preview dialog (place once inside return) */}
//       <Dialog
//         open={Boolean(openImage)}
//         onClose={() => setOpenImage(null)}
//         maxWidth="lg"
//         fullWidth
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
//           <Box sx={{ width: 1 }} />
//           <IconButton aria-label="close" onClick={() => setOpenImage(null)}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//         <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
//           {openImage && (
//             <img
//               src={openImage}
//               alt="Full view"
//               style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain' }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     </Container>
//   );
// };

// export default Profile;



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  dateCreated: string;
  likesCount: number;
}

interface UserProfile {
  userId: number;
  firstname: string | null;
  lastname: string | null;
  emailid: string;
  followersCount: number;
  followingCount: number;
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const loggedInUserId = Number(localStorage.getItem('user_id'));

  // if id not passed → own profile
  const profileUserId = id ? Number(id) : loggedInUserId;
  const isOwnProfile = profileUserId === loggedInUserId;

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!token || !profileUserId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);

        // 🔹 USER PROFILE
        const profileRes = await axios.get(
          `${BASE_URL}/api/users/${profileUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserProfile(profileRes.data);

        // 🔹 USER POSTS
        const postsRes = await axios.get(
          `${BASE_URL}/api/posts/userPosts/${profileUserId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const posts = postsRes.data?.data ?? [];

        setUserPosts(
          posts.map((p: any) => ({
            id: String(p.id),
            title: p.title,
            content: p.content,
            imageUrl: p.imageUrl ? `${BASE_URL}${p.imageUrl}` : undefined,
            dateCreated: p.dateCreated,
            likesCount: p.likesCount ?? 0,
          }))
        );

        // 🔹 FOLLOW STATUS
        if (!isOwnProfile) {
          const statusRes = await axios.get(
            `${BASE_URL}/api/follow/status/${profileUserId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'X-USER-ID': loggedInUserId,
              },
            }
          );
          setIsFollowing(statusRes.data.isFollowing);
        }

      } catch (err) {
        console.error('Profile fetch failed', err);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileUserId]);

  const handleFollowToggle = async () => {
    if (isOwnProfile) return;

    const url = isFollowing
      ? `/api/follow/unfollow/${profileUserId}`
      : `/api/follow/follow/${profileUserId}`;

    await axios.post(`${BASE_URL}${url}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-USER-ID': loggedInUserId,
      },
    });

    setIsFollowing(prev => !prev);
  };

  if (loading) return <Typography>Loading profile...</Typography>;
  if (!userProfile) return <Typography>User not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={4}>

        {/* PROFILE */}
        <Paper sx={{ p: 3 }}>
          <Box textAlign="center">
            <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}>
              {(userProfile.firstname ?? userProfile.emailid)[0].toUpperCase()}
            </Avatar>

            <Typography variant="h5">
              {userProfile.firstname ?? 'User'}
            </Typography>
            <Typography color="text.secondary">
              {userProfile.emailid}
            </Typography>

            {isOwnProfile ? (
              <Button sx={{ mt: 2 }} onClick={() => navigate('/edit-profile')}>
                Edit Profile
              </Button>
            ) : (
              <Button sx={{ mt: 2 }} variant="contained" onClick={handleFollowToggle}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}

            <Divider sx={{ my: 3 }} />

            <Box display="flex" justifyContent="space-around">
              <Box>
                <Typography variant="h6">{userPosts.length}</Typography>
                <Typography>Posts</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{userProfile.followersCount}</Typography>
                <Typography>Followers</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{userProfile.followingCount}</Typography>
                <Typography>Following</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* POSTS */}
        <Box>
          <Typography variant="h5">Posts</Typography>

          {userPosts.map(post => (
            <Card key={post.id} sx={{ mt: 2 }}>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  style={{ width: '100%', maxHeight: 350, objectFit: 'cover' }}
                />
              )}

              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography>{post.content}</Typography>
              </CardContent>

              <CardActions>
                <Typography sx={{ ml: 1 }}>
                  ❤️ {post.likesCount}
                </Typography>
                <Button onClick={() => navigate(`/post/${post.id}`)}>
                  Read
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>

      </Box>
    </Container>
  );
};

export default Profile;
