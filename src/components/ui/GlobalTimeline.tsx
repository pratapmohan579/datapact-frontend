"use client";

import React from "react";
import { CheckCircle, AlertTriangle, AlertCircle, Clock, GitCommit, Play, FileText, Settings, User } from "lucide-react";

export type TimelineEventType = 
  | "incident_created"
  | "incident_resolved"
  | "incident_updated"
  | "contract_created"
  | "contract_failed"
  | "contract_passed"
  | "pipeline_started"
  | "pipeline_failed"
  | "pipeline_success"
  | "schema_changed"
  | "owner_changed"
  | "comment_added";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, any>;
}

interface GlobalTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function GlobalTimeline({ events, className = "" }: GlobalTimelineProps) {
  // Sort events by timestamp descending
  const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className={`relative pl-4 space-y-8 ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-7 top-4 bottom-4 w-px bg-border"></div>

      {sortedEvents.map((event, index) => (
        <div key={event.id} className="relative flex gap-4">
          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-background border-2 border-background shadow-sm">
            <EventIcon type={event.type} />
          </div>

          {/* Content */}
          <div className="flex-1 pb-4">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
              <time className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(event.timestamp).toLocaleString()}
              </time>
            </div>
            
            {event.description && (
              <p className="text-sm text-muted-foreground mb-2">
                {event.description}
              </p>
            )}

            {/* Metadata / Details */}
            {event.metadata && Object.keys(event.metadata).length > 0 && (
              <div className="bg-secondary/50 rounded-md p-3 text-xs font-mono text-muted-foreground border border-border mt-2 overflow-x-auto">
                <pre>{JSON.stringify(event.metadata, null, 2)}</pre>
              </div>
            )}

            {/* User Attribution */}
            {event.user && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  {event.user.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-foreground">{event.user}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EventIcon({ type }: { type: TimelineEventType }) {
  switch (type) {
    case "incident_created":
      return <div className="w-full h-full rounded-full bg-red-500/20 text-red-500 flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></div>;
    case "incident_resolved":
      return <div className="w-full h-full rounded-full bg-green-500/20 text-green-500 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>;
    case "incident_updated":
      return <div className="w-full h-full rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center"><AlertCircle className="w-4 h-4" /></div>;
    case "contract_created":
      return <div className="w-full h-full rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center"><FileText className="w-4 h-4" /></div>;
    case "contract_failed":
      return <div className="w-full h-full rounded-full bg-red-500/20 text-red-500 flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></div>;
    case "contract_passed":
      return <div className="w-full h-full rounded-full bg-green-500/20 text-green-500 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>;
    case "pipeline_started":
      return <div className="w-full h-full rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center"><Play className="w-4 h-4" /></div>;
    case "pipeline_failed":
      return <div className="w-full h-full rounded-full bg-red-500/20 text-red-500 flex items-center justify-center"><AlertTriangle className="w-4 h-4" /></div>;
    case "pipeline_success":
      return <div className="w-full h-full rounded-full bg-green-500/20 text-green-500 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>;
    case "schema_changed":
      return <div className="w-full h-full rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center"><GitCommit className="w-4 h-4" /></div>;
    case "owner_changed":
      return <div className="w-full h-full rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center"><User className="w-4 h-4" /></div>;
    case "comment_added":
      return <div className="w-full h-full rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center"><FileText className="w-4 h-4" /></div>;
    default:
      return <div className="w-full h-full rounded-full bg-secondary text-muted-foreground flex items-center justify-center"><Settings className="w-4 h-4" /></div>;
  }
}
