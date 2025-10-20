// Define comment structure
export interface Comment {
  id: string;
  content: string;
  username: string;
  createdAt: string;
   userId: string;
  _id?: string; // <-- added optional _id for backend compatibility
}

// Define user structure
export interface User {
  userId: number;
  emailid: string;
  firstname: string | null;
  lastname: string | null;
}



export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
 followers?: AdminUser[]; // array of users following this admin
  following?: AdminUser[]; // array of users this user is following
}


// Define possible structure for createdAt object
// export interface CreatedAtObject {
//   id: string;
//   dateCreated: string;
// }
export interface CreatedAtObject {
  dateCreated: string;
}

// Define Post structure with createdAt possibly being an object
export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  user?: User;
  createdAt: string;
  likes: number;
  shares: number;
  comments: Comment[];
}


export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}