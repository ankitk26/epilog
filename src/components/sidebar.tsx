import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import CardsViewFilter from "./cards-view-filter";
import MediaTypeFilter from "./media-type-filter";
import SidebarFooter from "./sidebar-footer";
import { ThemeToggle } from "./theme-toggler";
import { Button } from "./ui/button";

export default function Sidebar() {
  return (
    <aside className="col-span-1 flex h-full flex-col border-r bg-background">
      <div className="flex items-center justify-between p-6">
        <Link to="/">
          <h1 className="font-semibold text-lg tracking-wide">epilog</h1>
        </Link>
        <ThemeToggle />
      </div>

      <div className="px-6 pb-6">
        <Link to="/search">
          <Button className="w-full text-xs">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Media
          </Button>
        </Link>
      </div>

      <div className="flex-1 space-y-6 px-6">
        <CardsViewFilter />
        <div className="space-y-3">
          <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Media Types
          </h3>
          <Suspense
            fallback={
              <div className="space-y-1">
                {["anime", "movie", "tv", "book"].map((type) => (
                  <div
                    className="flex h-8 w-full animate-pulse items-center justify-between rounded bg-muted px-2"
                    key={type}
                  >
                    <span className="h-3 w-20 rounded bg-muted-foreground/20" />
                    <span className="h-3 w-6 rounded bg-muted-foreground/10" />
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
  );
}
