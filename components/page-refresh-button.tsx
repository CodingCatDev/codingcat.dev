"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function PageRefreshButton() {
	const router = useRouter();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = () => {
		setIsRefreshing(true);
		router.refresh();
		setTimeout(() => setIsRefreshing(false), 1000);
	};

	return (
		<Button
			variant="outline"
			size="sm"
			className="gap-2"
			onClick={handleRefresh}
			disabled={isRefreshing}
		>
			<RefreshCw
				className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
			/>
			Refresh
		</Button>
	);
}
