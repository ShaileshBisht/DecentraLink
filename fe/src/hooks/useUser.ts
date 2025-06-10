import { useState, useEffect, useCallback } from "react";
import { User, UserStats, apiService } from "@/lib/api";

export function useUser(walletAddress?: string) {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async (address: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const [userProfile, stats] = await Promise.allSettled([apiService.getUserProfile(address), apiService.getUserStats(address)]);

      if (userProfile.status === "fulfilled") {
        setUser(userProfile.value);
      } else {
        console.error("Error fetching user profile:", userProfile.reason);
      }

      if (stats.status === "fulfilled") {
        setUserStats(stats.value);
      } else {
        console.error("Error fetching user stats:", stats.reason);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user data");
      console.error("Error fetching user data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await apiService.createOrUpdateProfile(userData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
      throw err;
    }
  }, []);

  const refreshUserData = useCallback(() => {
    if (walletAddress) {
      fetchUserProfile(walletAddress);
    }
  }, [walletAddress, fetchUserProfile]);

  useEffect(() => {
    if (walletAddress) {
      fetchUserProfile(walletAddress);
    } else {
      setUser(null);
      setUserStats(null);
      setError(null);
    }
  }, [walletAddress, fetchUserProfile]);

  return {
    user,
    userStats,
    isLoading,
    error,
    updateProfile,
    refreshUserData,
  };
}
