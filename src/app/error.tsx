"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-500/10 border border-red-500/20 rounded-lg text-center mx-auto max-w-2xl mt-12">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-red-500 mb-2">Something went wrong!</h2>
      <p className="text-sm text-gray-400 mb-6 max-w-md">
        An unexpected error occurred in this component. Other parts of the application should still be working.
      </p>
      <div className="bg-black/20 p-4 rounded text-left text-xs text-red-400 font-mono mb-6 w-full overflow-auto max-h-32">
        {error.message || "Unknown error"}
      </div>
      <button
        onClick={() => reset()}
        className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors text-sm font-medium"
      >
        <RefreshCcw className="w-4 h-4 mr-2" />
        Try again
      </button>
    </div>
  );
}
