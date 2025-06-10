"use client";

import { WalletConnect } from "@/components/WalletConnect";
import { PostComposer } from "@/components/PostComposer";
import { PostFeed } from "@/components/PostFeed";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { apiService, User } from "@/lib/api";
import {
  Sparkles,
  Users,
  Shield,
  Zap,
  User as UserIcon,
  Settings,
  TrendingUp,
  Heart,
  MessageCircle,
  Globe,
  Wallet,
  Coins,
  Activity,
  Star,
  Hexagon,
  Brain,
  Rocket,
} from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Always call hooks (required by Rules of Hooks)
  const { isConnected, address } = useAccount();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user profile when connected and authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!mounted || !isConnected || !address || !isAuthenticated) return;

      setLoadingUser(true);
      try {
        const userProfile = await apiService.getUserProfile(address);
        setUser(userProfile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // User might not have a profile yet, which is fine
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserProfile();
  }, [mounted, isConnected, address, isAuthenticated]);

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (loadingUser) return "Loading...";
    if (user?.username) return user.username;
    if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    return "Anon";
  };

  // Show loading state during SSR
  if (!mounted || isAuthLoading) {
    return (
      <div className="min-h-screen bg-crypto-mesh">
        <header className="sticky top-0 z-50 w-full glass border-white/10">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="animate-pulse">
                <div className="h-8 w-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded"></div>
              </div>
              <div className="h-10 w-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse rounded-xl"></div>
            </div>
          </div>
        </header>
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500/30 border-t-blue-500 mx-auto"></div>
            <p className="mt-4 text-bright-muted">Loading Web3 Experience...</p>
          </div>
        </main>
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

      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/10 bg-black/20">
        <div className="container max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section - Minimal */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Hexagon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                DecentraLink
              </h1>
            </div>

            {/* Right Section - Minimal */}
            <div className="flex items-center gap-3">
              {isConnected && isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-9 w-9 p-0 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <Link href="/profile">
                    <UserIcon className="w-4 h-4" />
                  </Link>
                </Button>
              )}
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Enhanced */}
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
                <div className="group cursor-pointer">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/30 transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center border border-blue-400/20">
                      <Wallet className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Own Your Identity</h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Your wallet is your identity. No passwords, no centralized control.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/30 transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-400/20">
                      <Shield className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Censorship Resistant</h4>
                      <p className="text-sm text-white/70 leading-relaxed">
                        Decentralized infrastructure ensures your voice can't be silenced.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-green-400/30 transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-400/20">
                      <Coins className="w-5 h-5 text-green-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Blockchain Powered</h4>
                      <p className="text-sm text-white/70 leading-relaxed">Built on Ethereum for transparency and trust.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Stats - Enhanced */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
              <h3 className="font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Live Stats</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-blue-300" />
                    <span className="text-sm text-white/80">Active Users</span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-400/20 rounded-lg text-sm font-medium">
                    42
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-purple-300" />
                    <span className="text-sm text-white/80">Total Posts</span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-400/20 rounded-lg text-sm font-medium">
                    156
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-pink-300" />
                    <span className="text-sm text-white/80">Interactions</span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-300 border border-pink-400/20 rounded-lg text-sm font-medium">
                    1.2k
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed - Enhanced */}
          <div className="xl:col-span-3 order-1 xl:order-2 space-y-8">
            {/* Welcome Hero - Enhanced */}
            {!isConnected && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50"></div>
                  <div className="relative z-10">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6">
                      Welcome to{" "}
                      <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        DecentraLink
                      </span>
                    </h2>
                    <p className="text-white/80 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                      Experience decentralized social media. Connect your wallet to get started.
                    </p>
                    <div className="max-w-sm mx-auto">
                      <WalletConnect />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Connected User Welcome - Enhanced */}
            {isConnected && isAuthenticated && (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                      <UserIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Welcome back, {getUserDisplayName()}!</h3>
                      <p className="text-white/70 text-sm">{user?.bio || "Ready to share your thoughts?"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Post Composer */}
            <PostComposer onPostCreated={handlePostCreated} />

            <div className="border-t border-white/10"></div>

            {/* Post Feed */}
            <div key={refreshKey}>
              <PostFeed />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl mt-20">
        <div className="container max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Hexagon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl text-white">DecentraLink</h3>
              </div>
              <p className="text-white/70 leading-relaxed mb-6">
                Building the future of social media on the blockchain. Connect, share, and engage in a truly decentralized ecosystem.
              </p>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/20 rounded-lg text-sm flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  Web3
                </div>
                <div className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-400/20 rounded-lg text-sm flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Decentralized
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Technology Stack</h4>
              <div className="space-y-3 text-white/70">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Next.js 14 & React 18</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>NestJS Backend API</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Ethereum Blockchain</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>RainbowKit & Wagmi</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Core Features</h4>
              <div className="space-y-3 text-white/70">
                <div className="flex items-center gap-3">
                  <Wallet className="w-4 h-4 text-blue-300" />
                  <span>Wallet Authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-purple-300" />
                  <span>Decentralized Posts</span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-green-300" />
                  <span>Real-time Updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-pink-300" />
                  <span>Profile Management</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 my-12"></div>

          <div className="text-center">
            <p className="text-white/70 mb-4">&copy; 2024 DecentraLink • Building the Decentralized Future</p>
            <div className="flex justify-center items-center gap-2">
              <span className="text-white/70">Powered by</span>
              <div className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-400/20 rounded-lg text-sm flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Web3
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
