"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2, Shield, Zap, LogOut, LogIn } from "lucide-react";

export function WalletConnect() {
  const [mounted, setMounted] = useState(false);
  const [authAttempts, setAuthAttempts] = useState(0);

  // Always call hooks (required by Rules of Hooks)
  const { address, isConnected } = useAccount();
  const { isAuthenticated, isLoading, error, signIn, signOut, clearError } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAuthenticate = async () => {
    try {
      clearError();
      await signIn();
      setAuthAttempts(0);
    } catch (error: any) {
      console.error("Authentication failed:", error);
      setAuthAttempts((prev) => prev + 1);
    }
  };

  const handleLogout = () => {
    signOut();
    setAuthAttempts(0);
    clearError();
  };

  // Show loading state during SSR
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-24 bg-white/10 animate-pulse rounded-xl"></div>
        <div className="w-3 h-3 bg-blue-400/50 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <Badge variant="outline" className="text-white/70 border-white/20 bg-white/5">
          <AlertCircle className="w-3 h-3 mr-1" />
          Not Connected
        </Badge>
        <ConnectButton />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3">
        <ConnectButton />
        <Badge variant="outline" className="text-blue-300 border-blue-400/40 bg-blue-500/10">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Checking Auth...
        </Badge>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <ConnectButton />
          <Badge variant="outline" className="text-orange-300 border-orange-400/40 bg-orange-500/10">
            <Shield className="w-3 h-3 mr-1" />
            Sign In Required
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleAuthenticate}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 rounded-xl shadow-lg min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>

          {error && (
            <div className="text-xs text-red-300 max-w-xs">
              {error}
              {authAttempts > 1 && <span className="block mt-1 text-red-400">Attempt {authAttempts}/3</span>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex items-center gap-2">
        <ConnectButton />
        <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/40 backdrop-blur-sm">
          <CheckCircle className="w-3 h-3 mr-1" />
          Authenticated
        </Badge>
        <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400/30 backdrop-blur-sm">
          <Zap className="w-3 h-3 mr-1" />
          Web3
        </Badge>
      </div>

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="hover:bg-red-500/20 hover:border-red-400/40 text-red-300 border border-white/20 hover:text-red-200 transition-all duration-300 rounded-xl"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
