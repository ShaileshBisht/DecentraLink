import { memo } from "react";

export const BackgroundEffects = memo(() => (
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
));

BackgroundEffects.displayName = "BackgroundEffects";
