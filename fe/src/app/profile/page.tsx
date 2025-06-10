"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { apiService, User, UserStats } from "@/lib/api";
import { WalletConnect } from "@/components/WalletConnect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  User as UserIcon,
  Calendar,
  Wallet,
  Edit3,
  Save,
  X,
  Globe,
  Camera,
  Heart,
  MessageCircle,
  Zap,
  Hexagon,
  Shield,
  Activity,
} from "lucide-react";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    profile_pic_url: "",
  });

  const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("auth_token");

  useEffect(() => {
    if (!isConnected || !isAuthenticated || !address) {
      setLoading(false);
      return;
    }

    fetchUserData();
  }, [address, isConnected, isAuthenticated]);

  const fetchUserData = async () => {
    if (!address) return;

    try {
      // Fetch user profile and stats in parallel
      const [userData, statsData] = await Promise.allSettled([apiService.getUserProfile(address), apiService.getUserStats(address)]);

      if (userData.status === "fulfilled") {
        setUser(userData.value);
        setFormData({
          username: userData.value.username || "",
          bio: userData.value.bio || "",
          profile_pic_url: userData.value.profile_pic_url || "",
        });
      } else {
        console.log("User profile not found, will create new one");
        setUser(null);
      }

      if (statsData.status === "fulfilled") {
        setUserStats(statsData.value);
      } else {
        console.log("User stats not found, setting defaults");
        setUserStats({
          wallet_address: address.toLowerCase(),
          posts_count: 0,
          likes_given_count: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updatedUser = await apiService.createOrUpdateProfile(formData);
      setUser(updatedUser);
      setIsEditing(false);

      // Refresh stats after profile update
      if (address) {
        try {
          const statsData = await apiService.getUserStats(address);
          setUserStats(statsData);
        } catch (error) {
          console.log("Could not fetch updated stats");
        }
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const refreshUserStats = async () => {
    if (!address) return;

    try {
      const statsData = await apiService.getUserStats(address);
      setUserStats(statsData);
    } catch (error) {
      console.log("Could not refresh stats");
    }
  };

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getUserInitial = () => {
    if (user?.username) return user.username[0].toUpperCase();
    if (address) return address[2].toUpperCase();
    return "?";
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
            <Skeleton className="h-8 w-32 bg-white/10" />
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl mb-8">
            <div className="p-8">
              <div className="flex items-center gap-6 mb-6">
                <Skeleton className="h-24 w-24 rounded-full bg-white/10" />
                <div className="space-y-3">
                  <Skeleton className="h-8 w-48 bg-white/10" />
                  <Skeleton className="h-4 w-32 bg-white/10" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-3/4 bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not connected state
  if (!isConnected || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="mb-8 hover:bg-white/10 text-white border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>

          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50"></div>
              <div className="relative z-10">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-6">Your Profile</h1>
                <p className="text-white/80 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                  Connect your wallet and sign in to view and customize your decentralized profile
                </p>
                <div className="max-w-sm mx-auto">
                  <WalletConnect />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="hover:bg-white/10 text-white border border-white/20 hover:border-white/30 transition-all duration-300 rounded-xl self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>
          <WalletConnect />
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-8 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                Your Profile
              </h1>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full sm:w-auto rounded-xl border-0 shadow-lg"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="hover:bg-red-500/20 hover:border-red-400/40 text-red-300 border border-white/20 hover:text-red-200 w-full sm:w-auto rounded-xl"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full sm:w-auto rounded-xl border-0 shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                  <div className="relative self-center sm:self-start">
                    <Avatar className="w-24 h-24 border-4 border-white/20 shadow-2xl">
                      {formData.profile_pic_url ? <AvatarImage src={formData.profile_pic_url} alt="Profile" /> : null}
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-2xl font-bold">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div>
                      <label className="text-sm font-medium text-white mb-3 block">Display Name</label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Enter your display name"
                        className="bg-white/5 border border-white/20 focus:border-blue-400/60 text-white placeholder:text-white/50 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white mb-3 block">Profile Picture URL</label>
                      <Input
                        value={formData.profile_pic_url}
                        onChange={(e) => setFormData({ ...formData, profile_pic_url: e.target.value })}
                        placeholder="https://example.com/your-photo.jpg"
                        className="bg-white/5 border border-white/20 focus:border-blue-400/60 text-white placeholder:text-white/50 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white mb-3 block">Bio</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="min-h-[120px] bg-white/5 border border-white/20 focus:border-blue-400/60 text-white placeholder:text-white/50 rounded-xl"
                    maxLength={500}
                  />
                  <div className="flex justify-end mt-3">
                    <div className="px-3 py-1 bg-white/10 text-white/70 border border-white/20 rounded-lg text-xs">
                      {formData.bio.length}/500
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-400/40 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <span className="text-red-300 font-medium">{error}</span>
                    </div>
                  </div>
                )}
              </form>
            ) : (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="relative self-center sm:self-start">
                    <Avatar className="w-24 h-24 border-4 border-white/20 shadow-2xl">
                      {user?.profile_pic_url ? <AvatarImage src={user.profile_pic_url} alt="Profile" /> : null}
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-2xl font-bold">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white/30 flex items-center justify-center shadow-lg">
                      <Hexagon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h2 className="text-3xl font-bold text-white mb-3">{user?.username || "Anonymous User"}</h2>
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/10 text-white/70 border border-white/20 rounded-lg">
                        <Wallet className="w-4 h-4" />
                        <span className="font-mono text-sm">{formatWalletAddress(address!)}</span>
                      </div>
                      <div className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/30 backdrop-blur-sm rounded-lg text-xs flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Web3
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10"></div>

                {/* Bio Section */}
                {user?.bio ? (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      About
                    </h3>
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{user.bio}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <UserIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No bio added yet</h3>
                    <p className="text-white/70 mb-6">Tell the community about yourself</p>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl border-0"
                    >
                      Add Bio
                    </Button>
                  </div>
                )}

                <div className="border-t border-white/10"></div>

                {/* Stats and Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Activity Stats */}
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      Activity
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-400/20">
                            <MessageCircle className="w-5 h-5 text-blue-300" />
                          </div>
                          <span className="text-white font-medium">Posts Created</span>
                        </div>
                        <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/20 rounded-lg font-bold">
                          {userStats?.posts_count || 0}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl flex items-center justify-center border border-pink-400/20">
                            <Heart className="w-5 h-5 text-pink-300" />
                          </div>
                          <span className="text-white font-medium">Likes Given</span>
                        </div>
                        <div className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-400/20 rounded-lg font-bold">
                          {userStats?.likes_given_count || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="space-y-6">
                    <h3 className="flex items-center gap-3 text-xl font-bold text-white">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      Details
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex flex-col gap-2">
                          <span className="text-white/70 text-sm font-medium">Wallet Address</span>
                          <div className="font-mono text-white bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                            {formatWalletAddress(address!)}
                          </div>
                        </div>
                      </div>
                      {user?.created_at && (
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex flex-col gap-2">
                            <span className="text-white/70 text-sm font-medium">Member Since</span>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-purple-300" />
                              <span className="text-white">{new Date(user.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Create Profile CTA */}
                {!user && (
                  <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-dashed border-white/20 rounded-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <Edit3 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Complete Your Profile</h3>
                    <p className="text-white/70 mb-8 max-w-md mx-auto">
                      You haven't created a profile yet. Add your details to get started with the community!
                    </p>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 w-full sm:w-auto rounded-xl border-0 shadow-lg px-8 py-3"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Create Profile
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
