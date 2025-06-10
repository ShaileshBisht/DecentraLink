import { useState } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "@/providers/AuthProvider";
import { apiService, Post } from "@/lib/api";

export function usePostActions() {
  const { isConnected } = useAccount();
  const { isAuthenticated } = useAuth();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const toggleLike = async (postId: number, hasLiked: boolean, onSuccess?: (newPost: Post) => void) => {
    if (!isConnected || !isAuthenticated) {
      console.warn("User must be connected and signed in to like posts");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [postId]: true }));

    try {
      if (hasLiked) {
        await apiService.unlikePost(postId);
      } else {
        await apiService.likePost(postId);
      }

      // Fetch the updated post to get latest like count and status
      const updatedPost = await apiService.getPost(postId);
      if (onSuccess) {
        onSuccess(updatedPost);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const addComment = async (postId: number, content: string, onSuccess?: (newPost: Post) => void) => {
    if (!isConnected || !isAuthenticated) {
      console.warn("User must be connected and signed in to comment");
      return;
    }

    if (!content.trim()) {
      return;
    }

    const commentKey = `comment-${postId}`;
    setLoadingStates((prev) => ({ ...prev, [commentKey]: true }));

    try {
      await apiService.commentOnPost(postId, content.trim());
      // Fetch updated post with new comment
      const updatedPost = await apiService.getPost(postId);
      if (onSuccess) {
        onSuccess(updatedPost);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [commentKey]: false }));
    }
  };

  const isLiking = (postId: number) => loadingStates[postId] || false;
  const isCommenting = (postId: number) => loadingStates[`comment-${postId}`] || false;

  return {
    toggleLike,
    addComment,
    isLiking,
    isCommenting,
    canInteract: isConnected && isAuthenticated,
  };
}
