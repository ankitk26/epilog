import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import CardsViewFilter from "./cards-view-filter";
import MediaTypeFilter from "./media-type-filter";
import SidebarFooter from "./sidebar-footer";
import { Button } from "./ui/button";

export default function Sidebar() {
  return (
    <aside className="flex flex-col h-full col-span-1 bg-background border-r">
      <Link to="/" className="p-6">
        <h1 className="text-lg font-semibold tracking-wide">epilog</h1>
      </Link>

      <div className="px-6 pb-6">
        <Link to="/search">
          <Button className="w-full text-xs">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Media
          </Button>
        </Link>
      </div>

      <div className="flex-1 px-6 space-y-6">
        <CardsViewFilter />
        <Suspense fallback={<p>Loading...</p>}>
          <MediaTypeFilter />
        </Suspense>
      </div>

      <SidebarFooter />
    </aside>
  );
}
