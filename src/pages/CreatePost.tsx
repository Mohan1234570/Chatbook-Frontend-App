// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Paper,
//   Typography,
//   TextField,
//   Button,
//   Box,
//   Alert,
//   IconButton,
//   Divider,
//   useTheme,
//   CircularProgress,
//   Snackbar,
// } from '@mui/material';
// import {
//   FormatBold,
//   FormatItalic,
//   FormatUnderlined,
//   FormatListBulleted,
//   FormatListNumbered,
//   Image,
//   Close,
// } from '@mui/icons-material';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../store/store';
// import { addPost } from '../store/slices/blogSlice';
// import { blogAPI, Post } from '../services/api';

// const CreatePost: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     image: null as File | null,
//   });

//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [showSuccess, setShowSuccess] = useState(false);

//   useEffect(() => {
//     if (!isAuthenticated || !user?.email) {
//       navigate('/login');
//     }
//   }, [isAuthenticated, user, navigate]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ✅ This triggers the file input
//   const handleImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   // ✅ This handles file selection and preview
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData(prev => ({ ...prev, image: file }));
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setShowSuccess(false);
//     setLoading(true);

//     try {
//       const response = await blogAPI.createPost({
//         title: formData.title,
//         content: formData.content,
//         image: formData.image || undefined,
//       });

//       console.log('Post creation response:', response);

//       if (response.data) {
//         const postData = response.data;

//         const newPost: Post = {
//           id: String(postData.id || ''),
//           title: String(postData.title || ''),
//           content: String(postData.content || ''),
//           imageUrl: postData.imageUrl,
//           user: {
//             userId: Number(postData.user?.userId || 0),
//             emailid: String(postData.user?.emailid || ''),
//             firstname: postData.user?.firstname || null,
//             lastname: postData.user?.lastname || null,
//           },
//           createdAt: new Date().toISOString(),
//           likes: 0,
//           shares: 0,
//           comments: Array.isArray(postData.comments) ? postData.comments : [],
//         };

//         dispatch(addPost(newPost));
//         setShowSuccess(true);
//         setFormData({ title: '', content: '', image: null });
//         setImagePreview(null);

//         // ✅ Delay a bit then redirect to /posts
//         setTimeout(() => {
//           navigate('/posts');
//         }, 1500);
//       } else {
//         setError('Failed to create post');
//       }
//     } catch (err: any) {
//       console.error('Post creation failed:', err);
//       const errorMessage =
//         err.response?.data?.message || err.message || 'Failed to create post.';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//       <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//         <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
//           Create New Post
//         </Typography>

//         {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

//         <Snackbar
//           open={showSuccess}
//           autoHideDuration={1500}
//           onClose={() => setShowSuccess(false)}
//           anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
//         >
//           <Alert severity="success" sx={{ width: '100%' }}>
//             Post created successfully! Redirecting...
//           </Alert>
//         </Snackbar>

//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             label="Title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             margin="normal"
//             required
//             variant="outlined"
//             disabled={loading}
//           />

//           <Box sx={{ mb: 2 }}>
//             <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
//               <IconButton size="small" disabled={loading}><FormatBold /></IconButton>
//               <IconButton size="small" disabled={loading}><FormatItalic /></IconButton>
//               <IconButton size="small" disabled={loading}><FormatUnderlined /></IconButton>
//               <IconButton size="small" disabled={loading}><FormatListBulleted /></IconButton>
//               <IconButton size="small" disabled={loading}><FormatListNumbered /></IconButton>
//               <IconButton size="small" onClick={handleImageClick} disabled={loading}>
//                 <Image />
//               </IconButton>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleImageChange}
//                 accept="image/*"
//                 style={{ display: 'none' }}
//               />
//             </Box>

//             {imagePreview && (
//               <Box sx={{ mb: 2, position: 'relative' }}>
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
//                 />
//                 <IconButton
//                   size="small"
//                   onClick={() => {
//                     setImagePreview(null);
//                     setFormData(prev => ({ ...prev, image: null }));
//                   }}
//                   sx={{
//                     position: 'absolute',
//                     top: 8,
//                     right: 8,
//                     bgcolor: 'rgba(0,0,0,0.5)',
//                     color: 'white',
//                     '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
//                   }}
//                 >
//                   <Close />
//                 </IconButton>
//               </Box>
//             )}

//             <TextField
//               fullWidth
//               label="Content"
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               multiline
//               rows={6}
//               required
//               variant="outlined"
//               disabled={loading}
//             />
//           </Box>

//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               disabled={loading}
//               sx={{ px: 4, py: 1, borderRadius: 2 }}
//             >
//               {loading ? <CircularProgress size={24} /> : 'Create Post'}
//             </Button>
//           </Box>
//         </form>
//       </Paper>
//     </Container>
//   );
// };

// export default CreatePost;




import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Image,
  Close,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addPost } from '../store/slices/blogSlice';
import { Post } from '../store/slices/blogSlice';
import { blogAPI } from 'services/api';
import { CreatedAtObject } from '../types';


const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null as File | null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowSuccess(false);
    setLoading(true);

    try {
      const response = await blogAPI.createPost({
        title: formData.title,
        content: formData.content,
        image: formData.image || undefined,
      });

      const normalizeCreatedAt = (createdAt: string | CreatedAtObject): string =>
      typeof createdAt === 'string' ? createdAt : createdAt.dateCreated;


      if (response.data) {
        const postData = response.data;

        // ✅ Normalize createdAt to a string
        // const createdAtString =
        //   typeof postData.createdAt === 'string'
        //     ? postData.createdAt
        //     : postData.createdAt?.dateCreated || new Date().toISOString();

        const newPost: Post = {
          id: String(postData.id || ''),
          title: String(postData.title || ''),
          content: String(postData.content || ''),
          imageUrl: postData.imageUrl ?? undefined,
          user: {
            userId: Number(postData.user?.userId || 0),
            emailid: String(postData.user?.emailid || ''),
            firstname: postData.user?.firstname || null,
            lastname: postData.user?.lastname || null,
          },
          createdAt: normalizeCreatedAt(response.data.data.createdAt),
          likes: 0,
          shares: 0,
          comments: Array.isArray(postData.comments) ? postData.comments : [],
        };

        dispatch(addPost(newPost));
        setShowSuccess(true);
        setFormData({ title: '', content: '', image: null });
        setImagePreview(null);

        setTimeout(() => {
          navigate('/posts');
        }, 1500);
      } else {
        setError('Failed to create post');
      }
    } catch (err: any) {
      console.error('Post creation failed:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          Create New Post
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Snackbar
          open={showSuccess}
          autoHideDuration={1500}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Post created successfully! Redirecting...
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            variant="outlined"
            disabled={loading}
          />

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <IconButton size="small" disabled={loading}><FormatBold /></IconButton>
              <IconButton size="small" disabled={loading}><FormatItalic /></IconButton>
              <IconButton size="small" disabled={loading}><FormatUnderlined /></IconButton>
              <IconButton size="small" disabled={loading}><FormatListBulleted /></IconButton>
              <IconButton size="small" disabled={loading}><FormatListNumbered /></IconButton>
              <IconButton size="small" onClick={handleImageClick} disabled={loading}><Image /></IconButton>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </Box>

            {imagePreview && (
              <Box sx={{ mb: 2, position: 'relative' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    setImagePreview(null);
                    setFormData(prev => ({ ...prev, image: null }));
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            )}

            <TextField
              fullWidth
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              multiline
              rows={6}
              required
              variant="outlined"
              disabled={loading}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ px: 4, py: 1, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Post'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreatePost;
