import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, Zap, Wallet, MessageCircle, Activity, User as UserIcon, Hexagon } from "lucide-react";

export const Footer = memo(() => (
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
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/20">
              <Globe className="w-3 h-3 mr-1" />
              Web3
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/20">
              <Shield className="w-3 h-3 mr-1" />
              Decentralized
            </Badge>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6">Technology Stack</h4>
          <div className="space-y-3 text-white/70">
            {[
              { color: "blue", text: "Next.js 14 & React 18" },
              { color: "purple", text: "NestJS Backend API" },
              { color: "green", text: "Ethereum Blockchain" },
              { color: "pink", text: "RainbowKit & Wagmi" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 bg-${item.color}-400 rounded-full`}></div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6">Core Features</h4>
          <div className="space-y-3 text-white/70">
            {[
              { icon: Wallet, color: "blue-300", text: "Wallet Authentication" },
              { icon: MessageCircle, color: "purple-300", text: "Decentralized Posts" },
              { icon: Activity, color: "green-300", text: "Real-time Updates" },
              { icon: UserIcon, color: "pink-300", text: "Profile Management" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 text-${item.color}`} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 my-12"></div>

      <div className="text-center">
        <p className="text-white/70 mb-4">&copy; 2024 DecentraLink • Building the Decentralized Future</p>
        <div className="flex justify-center items-center gap-2">
          <span className="text-white/70">Powered by</span>
          <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400/20">
            <Zap className="w-3 h-3 mr-1" />
            Web3
          </Badge>
        </div>
      </div>
    </div>
  </footer>
));

Footer.displayName = "Footer";
