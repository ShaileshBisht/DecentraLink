import { memo } from "react";
import Link from "next/link";
import { User as UserIcon, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletConnect } from "@/components/WalletConnect";

interface HeaderProps {
  isConnected: boolean;
  isAuthenticated: boolean;
}

export const Header = memo(({ isConnected, isAuthenticated }: HeaderProps) => (
  <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/10 bg-black/20">
    <div className="container max-w-7xl mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <Hexagon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            DecentraLink
          </h1>
        </div>

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
));

Header.displayName = "Header";
