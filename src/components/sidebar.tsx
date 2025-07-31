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
      <div className="flex items-center justify-between">
        <Link className="p-6" to="/">
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
        <Suspense fallback={<p>Loading...</p>}>
          <MediaTypeFilter />
        </Suspense>
      </div>

      <SidebarFooter />
    </aside>
  );
}
