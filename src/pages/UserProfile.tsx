import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";

/* =======================
   Types
======================= */

interface ProfilePost {
  id: number;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
}

interface UserProfileResponse {
  userId: number;
  firstname: string | null;
  lastname: string | null;
  emailid: string;
  followersCount: number;
  followingCount: number;
  posts: ProfilePost[];
}

/* =======================
   Component
======================= */

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =======================
     Effects
  ======================= */

  useEffect(() => {
    if (!userId) return;

    const id = Number(userId);

    Promise.all([
      api.get<UserProfileResponse>(`/api/users/${id}`),
      api.get<{ following: boolean }>(
        `/api/follow/status?targetUserId=${id}`
      ),
    ])
      .then(([profileRes, followRes]) => {
        setProfile(profileRes.data);
        setIsFollowing(followRes.data.following);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  /* =======================
     Actions
  ======================= */

  const followUser = async () => {
    if (!userId) return;
    await api.post(`/api/follow/${userId}`);
    setIsFollowing(true);
  };

  const unfollowUser = async () => {
    if (!userId) return;
    await api.delete(`/api/unfollow/${userId}`);
    setIsFollowing(false);
  };

  /* =======================
     Render
  ======================= */

  if (loading) return <h3>Loading profile...</h3>;
  if (!profile) return <h3>User not found</h3>;

  const displayName =
    profile.firstname ??
    profile.emailid.split("@")[0];

  return (
    <div className="profile-container">
      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-info">
          <h2>{displayName}</h2>
          <p>{profile.emailid}</p>

          <div className="profile-stats">
            <span>
              <b>{profile.posts.length}</b> posts
            </span>
            <span>
              <b>{profile.followersCount}</b> followers
            </span>
            <span>
              <b>{profile.followingCount}</b> following
            </span>
          </div>

          {isFollowing ? (
            <button className="btn-unfollow" onClick={unfollowUser}>
              Unfollow
            </button>
          ) : (
            <button className="btn-follow" onClick={followUser}>
              Follow
            </button>
          )}
        </div>
      </div>

      {/* POSTS GRID */}
      <div className="posts-grid">
        {profile.posts.map((post) => (
          <PostCard
            key={post.id}
            post={{
              ...post,
              userId: profile.userId,        // ✅ injected
              username: displayName,         // ✅ injected
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
