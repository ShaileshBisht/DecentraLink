import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

// Ensure project ID is available
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  console.warn("WalletConnect Project ID not found. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment variables.");
}

// Create config with singleton pattern to prevent double initialization
let wagmiConfig: ReturnType<typeof getDefaultConfig> | null = null;

function createConfig() {
  if (wagmiConfig) {
    return wagmiConfig;
  }

  wagmiConfig = getDefaultConfig({
    appName: "Decentralized Social Media",
    projectId: projectId || "b5cff92017bb60c899845b74870ceaf5",
    chains: [mainnet, sepolia],
    ssr: true,
  });

  return wagmiConfig;
}

export const config = createConfig();
