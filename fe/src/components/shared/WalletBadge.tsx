import { cn } from "@/lib/utils";

interface WalletBadgeProps {
  walletAddress: string;
  className?: string;
  showFull?: boolean;
}

export function WalletBadge({ walletAddress, className, showFull = false }: WalletBadgeProps) {
  const formatWalletAddress = (address: string) => {
    if (showFull) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div
      className={cn("font-mono text-xs bg-white/10 text-white/70 border border-white/20 backdrop-blur-sm px-2 py-1 rounded-lg", className)}
    >
      {formatWalletAddress(walletAddress)}
    </div>
  );
}
