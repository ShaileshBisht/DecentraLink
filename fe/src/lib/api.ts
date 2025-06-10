const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface User {
  wallet_address: string;
  username?: string;
  bio?: string;
  profile_pic_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  wallet_address: string;
  posts_count: number;
  likes_given_count: number;
}

export interface Post {
  id: number;
  wallet_address: string;
  content: string;
  timestamp: string;
  user?: User;
  likes?: Like[];
  comments?: Comment[];
}

export interface Like {
  post_id: number;
  wallet_address: string;
  created_at: string;
  user?: User;
}

export interface Comment {
  id: number;
  post_id: number;
  wallet_address: string;
  content: string;
  timestamp: string;
  user?: User;
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("auth_token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      // Handle different error types
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("auth_token");
        throw new Error("Authentication expired. Please sign in again.");
      } else if (response.status === 403) {
        throw new Error("Access denied. Please check your permissions.");
      } else if (response.status === 404) {
        throw new Error("Resource not found.");
      } else if (response.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else {
        // Try to get error message from response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
        } catch {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }
    }

    return response.json();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  getStoredToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  async verifyWallet(walletAddress: string, signature: string, message: string) {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress,
        signature,
        message,
      }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Invalid signature. Please try again.");
      } else if (response.status === 429) {
        throw new Error("Too many attempts. Please wait a moment before trying again.");
      }
      throw new Error("Wallet verification failed");
    }

    const data = await response.json();
    localStorage.setItem("auth_token", data.access_token);
    return data;
  }

  async getUserProfile(walletAddress: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${walletAddress}`);
    return this.handleResponse(response);
  }

  async getUserStats(walletAddress: string): Promise<UserStats> {
    const response = await fetch(`${API_BASE_URL}/users/${walletAddress}/stats`);
    return this.handleResponse(response);
  }

  async createOrUpdateProfile(userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  async getAllPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts`);
    return this.handleResponse(response);
  }

  async getPost(id: number): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);
    return this.handleResponse(response);
  }

  async createPost(content: string): Promise<Post> {
    if (!this.isAuthenticated()) {
      throw new Error("Authentication required to create posts");
    }

    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    return this.handleResponse(response);
  }

  async likePost(postId: number): Promise<Like> {
    if (!this.isAuthenticated()) {
      throw new Error("Authentication required to like posts");
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async unlikePost(postId: number): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error("Authentication required to unlike posts");
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async commentOnPost(postId: number, content: string): Promise<Comment> {
    if (!this.isAuthenticated()) {
      throw new Error("Authentication required to comment on posts");
    }

    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comment`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    return this.handleResponse(response);
  }

  logout() {
    localStorage.removeItem("auth_token");
    // Optionally clear other stored data
    // localStorage.removeItem("user_preferences");
  }

  // Health check method to verify API connectivity
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
