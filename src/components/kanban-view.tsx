import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { CalendarIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { useRef, useState } from "react";
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

  const handleTouchEnd = (e?: React.TouchEvent) => {
    const endX = touchEnd || e?.changedTouches?.[0]?.clientX || 0;
    if (!(touchStart && endX)) {
      setTouchStart(0);
      setTouchEnd(0);
      return;
    }

    const distance = touchStart - endX;
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
      {/* Mobile and tablet: Single column with swipe */}
      <div
        className="min-h-0 flex-1 overflow-hidden lg:hidden"
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        ref={containerRef}
      >
        <div
          className="flex h-full min-h-0 transition-transform duration-300 ease-in-out will-change-transform"
          style={{
            width: `${columns.length * 100}vw`,
            transform: `translateX(-${activeTab * 100}vw)`,
          }}
        >
          {columns.map((column) => (
            <div
              className="mt-2 h-full min-h-0 w-[100vw] max-w-[100vw] shrink-0 overflow-y-auto overflow-x-hidden"
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
      <div className="hidden min-h-0 lg:grid lg:h-[calc(100vh-50px)] lg:min-h-0 lg:grid-cols-3 lg:gap-4">
        {columns.map((column) => (
          <div className="min-h-0 overflow-hidden" key={column.status}>
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
  );
}
