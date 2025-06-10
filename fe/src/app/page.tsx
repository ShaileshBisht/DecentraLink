"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { useAuth } from "@/providers/AuthProvider";
import { PostComposer } from "@/components/PostComposer";
import { PostFeed } from "@/components/PostFeed";
import { apiService, User } from "@/lib/api";
import { LoadingState, BackgroundEffects, Header, FeatureCard, StatCard, WelcomeHero, UserWelcome, Footer } from "@/components/home";
import { Wallet, Shield, Coins, Users, MessageCircle, Heart, Brain, Activity } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const { isConnected, address } = useAccount();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // Memoized feature data to prevent re-creation on every render
  const features = useMemo(
    () => [
      {
        icon: Wallet,
        title: "Own Your Identity",
        description: "Your wallet is your identity. No passwords, no centralized control.",
        gradient: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
        hoverColor: "blue-400",
      },
      {
        icon: Shield,
        title: "Censorship Resistant",
        description: "Decentralized infrastructure ensures your voice can't be silenced.",
        gradient: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
        hoverColor: "purple-400",
      },
      {
        icon: Coins,
        title: "Blockchain Powered",
        description: "Built on Ethereum for transparency and trust.",
        gradient: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
        hoverColor: "green-400",
      },
    ],
    []
  );

  const stats = useMemo(
    () => [
      { icon: Users, label: "Active Users", value: "42", gradient: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20", color: "blue-300" },
      {
        icon: MessageCircle,
        label: "Total Posts",
        value: "156",
        gradient: "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
        color: "purple-300",
      },
      {
        icon: Heart,
        label: "Interactions",
        value: "1.2k",
        gradient: "bg-gradient-to-r from-pink-500/20 to-rose-500/20",
        color: "pink-300",
      },
    ],
    []
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Optimized user profile fetching with useCallback to prevent unnecessary re-renders
  const fetchUserProfile = useCallback(async () => {
    if (!isConnected || !address || !isAuthenticated) return;

    setLoadingUser(true);
    try {
      const userProfile = await apiService.getUserProfile(address);
      setUser(userProfile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, [isConnected, address, isAuthenticated]);

  useEffect(() => {
    if (mounted) {
      fetchUserProfile();
    }
  }, [mounted, fetchUserProfile]);

  const handlePostCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  const getUserDisplayName = useCallback(() => {
    if (loadingUser) return "Loading...";
    if (user?.username) return user.username;
    if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    return "Anon";
  }, [loadingUser, user?.username, address]);

  // Show loading state during SSR or authentication loading
  if (!mounted || isAuthLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <BackgroundEffects />

      <Header isConnected={isConnected} isAuthenticated={isAuthenticated} />

      <main className="container max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="xl:col-span-1 order-2 xl:order-1 space-y-6">
            {/* Platform Features */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <h3 className="font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Web3 Features</span>
              </h3>
              <div className="space-y-5">
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </div>

            {/* Live Stats */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <h3 className="font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Live Stats</span>
              </h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <StatCard key={index} {...stat} />
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="xl:col-span-3 order-1 xl:order-2 space-y-8">
            {!isConnected && <WelcomeHero />}

            {isConnected && isAuthenticated && <UserWelcome user={user} getUserDisplayName={getUserDisplayName} />}

            <PostComposer onPostCreated={handlePostCreated} />

            <div className="border-t border-white/10"></div>

            <div key={refreshKey}>
              <PostFeed />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
