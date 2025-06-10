"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { apiService } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => void;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount and wallet connection changes
  useEffect(() => {
    checkAuthStatus();
  }, [address, isConnected]);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isConnected || !address) {
        setIsAuthenticated(false);
        return;
      }

      const token = apiService.getStoredToken();
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Verify token by making a test API call
      await apiService.getUserProfile(address);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);

      if (error.message?.includes("Authentication expired")) {
        setError("Your session has expired. Please sign in again.");
        // Clear the expired token
        apiService.logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async () => {
    if (!address || !isConnected) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const timestamp = Date.now();
      const message = `Welcome to Decentralized Social Media!

Please sign this message to authenticate your wallet and access the platform.

Wallet: ${address}
Timestamp: ${timestamp}
Nonce: ${Math.random().toString(36).substring(7)}

This signature is used for authentication only and does not authorize any transactions.`;

      console.log("Requesting signature for message:", message);
      const signature = await signMessageAsync({ message });
      console.log("Signature received:", signature);

      // Verify the signature with the backend
      await apiService.verifyWallet(address, signature, message);

      // Authentication successful
      setIsAuthenticated(true);
      setError(null);

      console.log("Authentication successful!");
    } catch (error: any) {
      console.error("Sign in failed:", error);

      if (error.message?.includes("User rejected")) {
        setError("Signature was rejected. Please try again.");
      } else if (error.message?.includes("Network")) {
        setError("Network error. Check your connection.");
      } else {
        setError(error.message || "Sign in failed");
      }

      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setError(null);
    console.log("Signed out successfully");
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signOut,
    checkAuthStatus,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
