"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      router.refresh();
      // We add a small delay to make the refresh animation feel natural
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Subscriber list updated");
    } catch (error) {
      toast.error("Failed to refresh list");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      className="p-2 hover:bg-muted rounded-md transition-colors group border border-transparent hover:border-border"
      disabled={isRefreshing}
      title="Refresh list"
    >
      <RefreshCw
        className={cn(
          "h-4 w-4 text-muted-foreground transition-all duration-500",
          isRefreshing
            ? "animate-spin text-primary"
            : "group-hover:text-foreground",
        )}
      />
    </button>
  );
}
