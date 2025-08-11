import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { CalendarIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { filterStore } from "@/store/filter-store";
import KanbanColumn from "./kanban-column";

export default function KanbanView() {
  const mediaType = useStore(filterStore, (state) => state.type);
  const [activeTab, setActiveTab] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  const columns = [
    {
      status: "planned",
      title: mediaType === "book" ? "To Read" : "To Watch",
      icon: CalendarIcon,
    },
    {
      status: "in_progress",
      title: mediaType === "book" ? "Reading" : "Watching",
      icon: ClockIcon,
    },
    {
      status: "completed",
      title: "Completed",
      icon: CheckCircleIcon,
    },
  ];

  const logsFilteredByMediaType = mediaLogs.filter(
    (log) => log.metadata.type === mediaType
  );

  // Swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!(touchStart && touchEnd)) {
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeTab < columns.length - 1) {
      setActiveTab(activeTab + 1);
    } else if (isRightSwipe && activeTab > 0) {
      setActiveTab(activeTab - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="-mx-4 h[calc(100vh-50px)] flex flex-col overflow-hidden lg:mx-0">
      {/* Sticky tabs for mobile and tablet */}
      <div className="sticky top-0 z-10 border-b bg-background lg:hidden">
        <div className="flex">
          {columns.map((column, index) => (
            <button
              className={cn(
                "flex-1 px-4 py-3 font-medium text-sm transition-colors",
                activeTab === index
                  ? "border-primary border-b-2 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={column.status}
              onClick={() => setActiveTab(index)}
              type="button"
            >
              <div className="flex items-center justify-center gap-2">
                <column.icon className="h-4 w-4" />
                <span className="text-xs">{column.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile and tablet: Single column with swipe */}
      <div
        className="flex-1 overflow-hidden lg:hidden"
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        ref={containerRef}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-in-out will-change-transform"
          style={{
            width: `${columns.length * 100}vw`,
            transform: `translateX(-${activeTab * 100}vw)`,
          }}
        >
          {columns.map((column) => (
            <div
              className="mt-2 h-full w-[100vw] max-w-[100vw] shrink-0 overflow-y-auto overflow-x-hidden"
              key={column.status}
            >
              <KanbanColumn
                column={column}
                logs={logsFilteredByMediaType.filter(
                  (log) => log.status === column.status
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Three column grid */}
      <div className="hidden lg:grid lg:h-full lg:grid-cols-3 lg:gap-4">
        {columns.map((column) => (
          <KanbanColumn
            column={column}
            key={column.status}
            logs={logsFilteredByMediaType.filter(
              (log) => log.status === column.status
            )}
          />
        ))}
      </div>
    </div>
  );
}
