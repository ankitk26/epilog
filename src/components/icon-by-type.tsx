import { BookIcon, ClapperboardIcon, Tv2Icon } from "lucide-react";
import type { ComponentProps } from "react";
import type { MediaType } from "@/types";

type IconProps = ComponentProps<typeof BookIcon>;

export default function IconByType({
  type,
  ...props
}: {
  type: MediaType;
} & IconProps) {
  if (type === "book") {
    return <BookIcon {...props} />;
  }

  if (type === "movie") {
    return <ClapperboardIcon {...props} />;
  }

  return <Tv2Icon {...props} />;
}
