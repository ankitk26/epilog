import { Link } from "@tanstack/react-router";
import { PlusIcon, XIcon } from "lucide-react";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";
import CardsViewFilter from "./cards-view-filter";
import MediaTypeFilter from "./media-type-filter";
import SidebarFooter from "./sidebar-footer";
import { ThemeToggle } from "./theme-toggler";
import { Button } from "./ui/button";

export default function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore();

  return (
    <>
      {/* Mobile overlay - positioned behind sidebar */}
      {!isCollapsed && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggle}
          type="button"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out lg:relative lg:z-auto",
          isCollapsed
            ? "-translate-x-full w-64 md:w-80 lg:w-16 lg:translate-x-0"
            : "w-64 translate-x-0 md:w-80 lg:w-auto"
        )}
      >
        <div className="flex items-center justify-between p-4 lg:p-6">
          <Link className="flex items-center" to="/">
            <h1
              className={cn(
                "font-semibold text-base tracking-wide transition-all duration-300 lg:text-lg",
                isCollapsed && "lg:hidden"
              )}
            >
              epilog
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              className="h-8 w-8 p-0 lg:hidden"
              onClick={toggle}
              size="sm"
              variant="ghost"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-4 pb-8 lg:px-6">
          <Link to="/search">
            <Button className="w-full text-xs">
              <PlusIcon className="mr-2 h-3 w-3 lg:h-4 lg:w-4" />
              <span className={cn(isCollapsed && "lg:hidden")}>
                Add New Media
              </span>
            </Button>
          </Link>
        </div>

        <div className="flex-1 space-y-8 px-4 lg:space-y-8 lg:px-6">
          <CardsViewFilter />
          <div className="space-y-2 lg:space-y-3">
            <h3
              className={cn(
                "font-medium text-muted-foreground text-xs uppercase tracking-wider",
                isCollapsed && "lg:hidden"
              )}
            >
              Media Types
            </h3>
            <Suspense
              fallback={
                <div className="space-y-1">
                  {["anime", "movie", "tv", "book"].map((type) => (
                    <div
                      className="flex h-6 w-full animate-pulse items-center justify-between rounded bg-muted px-2 lg:h-8"
                      key={type}
                    >
                      <span className="h-2 w-16 rounded bg-muted-foreground/20 lg:h-3 lg:w-20" />
                      <span className="h-2 w-4 rounded bg-muted-foreground/10 lg:h-3 lg:w-6" />
                    </div>
                  ))}
                </div>
              }
            >
              <MediaTypeFilter />
            </Suspense>
          </div>
        </div>

        <SidebarFooter />
      </aside>
    </>
  );
}
