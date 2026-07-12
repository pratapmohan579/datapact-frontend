import React from 'react';
import { Hammer } from 'lucide-react';

export default function Page() {
  return (
    <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[600px] text-center">
      <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-6 shadow-xl">
        <Hammer className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-foreground mb-4">Under Construction</h1>
      <p className="text-muted-foreground max-w-md">
        This module is currently being redesigned as part of the Phase 3 Enterprise UI Overhaul. Check back soon!
      </p>
    </div>
  );
}
