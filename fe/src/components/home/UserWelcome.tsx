import { memo } from "react";
import { User as UserIcon } from "lucide-react";
import { User } from "@/lib/api";

interface UserWelcomeProps {
  user: User | null;
  getUserDisplayName: () => string;
}

export const UserWelcome = memo(({ user, getUserDisplayName }: UserWelcomeProps) => (
  <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
    <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 p-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
          <UserIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Welcome back, {getUserDisplayName()}!</h3>
          <p className="text-white/70 text-sm">{user?.bio || "Ready to share your thoughts?"}</p>
        </div>
      </div>
    </div>
  </div>
));

UserWelcome.displayName = "UserWelcome";
