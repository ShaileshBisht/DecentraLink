import { memo } from "react";
import { Sparkles } from "lucide-react";
import { WalletConnect } from "@/components/WalletConnect";

export const WelcomeHero = memo(() => (
  <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
    <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 p-12 text-center relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-50"></div>
      <div className="relative z-10">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-white mb-6">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">DecentraLink</span>
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
));

WelcomeHero.displayName = "WelcomeHero";
