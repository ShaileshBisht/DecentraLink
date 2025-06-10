import { memo } from "react";

export const LoadingState = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/10 bg-black/20">
      <div className="container max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded"></div>
          </div>
          <div className="h-10 w-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse rounded-xl"></div>
        </div>
      </div>
    </header>
    <main className="container max-w-7xl mx-auto px-6 py-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500/30 border-t-blue-500 mx-auto"></div>
        <p className="mt-4 text-white/70">Loading Web3 Experience...</p>
      </div>
    </main>
  </div>
));

LoadingState.displayName = "LoadingState";
