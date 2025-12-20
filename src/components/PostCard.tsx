import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: {
    id: number;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    userId: number;       // ✅ MUST exist
    username: string;     // or email
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate(`/users/${post.userId}`);
  };

  return (
    <div className="post-card">
      {/* HEADER */}
      <div className="post-header">
        <span
          className="post-username"
          onClick={goToProfile}
          style={{ cursor: "pointer", fontWeight: 600 }}
        >
          {post.username}
        </span>
      </div>

      {/* CONTENT */}
      <p>{post.content}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="post" />
      )}
    </div>
  );
};

export default PostCard;
