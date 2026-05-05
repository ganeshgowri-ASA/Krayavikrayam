import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "../types";

export function CollaboratorCountBadge({
  collaborators,
  className,
}: {
  collaborators: User[];
  className?: string;
}) {
  const count = collaborators.length;
  return (
    <span
      data-testid="collaborator-count"
      title={collaborators.map((c) => c.name).join(", ")}
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-inset ring-zinc-200",
        className
      )}
    >
      <Users className="h-3 w-3" aria-hidden />
      {count}
    </span>
  );
}
