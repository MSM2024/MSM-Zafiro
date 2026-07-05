"use client";

import { useState } from "react";

interface FollowButtonProps {
  targetUserId: string;
  currentUserId?: string;
  initialFollowing?: boolean;
  onToggle?: (following: boolean) => void;
}

export function FollowButton({ targetUserId, currentUserId, initialFollowing = false, onToggle }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  if (targetUserId === currentUserId) return null;

  const handleToggle = async () => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      if (following) {
        await fetch("/api/follow", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerId: currentUserId, followingId: targetUserId }),
        });
      } else {
        await fetch("/api/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ followerId: currentUserId, followingId: targetUserId }),
        });
      }
      setFollowing(!following);
      onToggle?.(!following);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        padding: "6px 18px",
        border: following ? "1px solid var(--border)" : 0,
        borderRadius: 999,
        background: following ? "transparent" : "linear-gradient(135deg, #2563ff, #7c3aed)",
        color: following ? "var(--text)" : "#fff",
        cursor: loading ? "wait" : "pointer",
        fontSize: 13,
        fontWeight: 600,
        transition: "all 0.2s",
        minWidth: 100,
      }}
    >
      {loading ? "..." : following ? "Siguiendo" : "Seguir"}
    </button>
  );
}
