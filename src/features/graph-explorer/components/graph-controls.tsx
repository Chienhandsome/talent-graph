"use client";

import {
  Check,
  GitFork,
  LoaderCircle,
  Network,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type {
  GraphNodeType,
  GraphRelationshipType,
} from "@/types/graph";
import {
  GRAPH_NODE_TYPES,
  GRAPH_RELATIONSHIP_TYPES,
} from "@/types/graph";
import type { RoleSummary } from "@/types/role";

const depthOptions = [
  { value: "1", label: "1 hop · focused" },
  { value: "2", label: "2 hops · connected" },
];

const nodeTypeLabels: Record<GraphNodeType, string> = {
  role: "Roles",
  skill: "Skills",
  "learning-resource": "Resources",
  project: "Projects",
};

const nodeTypeDots: Record<GraphNodeType, string> = {
  role: "bg-slate-950",
  skill: "bg-cyan-600",
  "learning-resource": "bg-indigo-600",
  project: "bg-amber-600",
};

const relationshipLabels: Record<GraphRelationshipType, string> = {
  REQUIRES: "Requires",
  CAN_TRANSITION_TO: "Transitions",
  TEACHES: "Teaches",
  DEMONSTRATES: "Demonstrates",
  RELATED_TO: "Related",
};

interface GraphControlsProps {
  roles: RoleSummary[];
  rolesLoading: boolean;
  rolesError: string | null;
  rootRoleId: string;
  depth: 1 | 2;
  isLoading: boolean;
  hasGraph: boolean;
  visibleNodeTypes: GraphNodeType[];
  visibleRelationshipTypes: GraphRelationshipType[];
  onRootRoleChange(roleId: string): void;
  onDepthChange(depth: 1 | 2): void;
  onToggleNodeType(type: GraphNodeType): void;
  onToggleRelationshipType(type: GraphRelationshipType): void;
  onRetryRoles(): void;
  onSubmit(): void;
}

export function GraphControls({
  roles,
  rolesLoading,
  rolesError,
  rootRoleId,
  depth,
  isLoading,
  hasGraph,
  visibleNodeTypes,
  visibleRelationshipTypes,
  onRootRoleChange,
  onDepthChange,
  onToggleNodeType,
  onToggleRelationshipType,
  onRetryRoles,
  onSubmit,
}: GraphControlsProps) {
  const roleItems = roles.map((role) => ({ value: role.id, label: role.name }));
  const visibleNodes = new Set(visibleNodeTypes);
  const visibleRelationships = new Set(visibleRelationshipTypes);

  return (
    <Card className="border-0 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.45)] ring-slate-200 xl:sticky xl:top-6">
      <CardHeader className="border-b border-slate-100 pb-5">
        <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-slate-950 text-white">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg">Explore a neighborhood</CardTitle>
        <CardDescription className="leading-6">
          Select a root role and how far the graph should expand.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {rolesError ? (
          <Alert variant="destructive" className="mb-5 pr-24">
            <AlertTitle>Roles could not be loaded</AlertTitle>
            <AlertDescription>{rolesError}</AlertDescription>
            <AlertAction>
              <Button type="button" size="sm" variant="outline" onClick={onRetryRoles}>
                <RefreshCw aria-hidden="true" />
                Retry
              </Button>
            </AlertAction>
          </Alert>
        ) : null}

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          {rolesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full" />
            </div>
          ) : (
            <Select
              items={roleItems}
              value={rootRoleId || null}
              onValueChange={(value) => onRootRoleChange(value ?? "")}
            >
              <label
                htmlFor="graph-root-role"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Root role
              </label>
              <SelectTrigger
                id="graph-root-role"
                className="h-11 w-full border-slate-200 bg-white px-3 text-left hover:bg-slate-50"
              >
                <SelectValue placeholder="Choose a role" />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false} className="max-h-72">
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <span className="flex min-w-0 flex-col py-0.5">
                      <span className="truncate font-medium">{role.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {role.category}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            items={depthOptions}
            value={String(depth)}
            onValueChange={(value) => onDepthChange(Number(value ?? 1) as 1 | 2)}
          >
            <label
              htmlFor="graph-depth"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Expansion depth
            </label>
            <SelectTrigger
              id="graph-depth"
              className="h-11 w-full border-slate-200 bg-white px-3 hover:bg-slate-50"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {depthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="submit"
            size="lg"
            disabled={!rootRoleId || rolesLoading || Boolean(rolesError) || isLoading}
            className="h-11 w-full bg-slate-950 text-white shadow-sm hover:bg-slate-800"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Network aria-hidden="true" />
            )}
            {isLoading ? "Loading graph…" : "Explore graph"}
          </Button>

          <div className={cn("space-y-5 border-t border-slate-100 pt-5", !hasGraph && "opacity-50")}>
            <fieldset disabled={!hasGraph}>
              <legend className="text-sm font-medium text-slate-800">Node types</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {GRAPH_NODE_TYPES.map((type) => {
                  const selected = visibleNodes.has(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onToggleNodeType(type)}
                      className={cn(
                        "flex min-h-9 items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-700",
                        selected
                          ? "border-slate-300 bg-slate-50 text-slate-900"
                          : "border-slate-200 bg-white text-slate-400",
                      )}
                    >
                      <span className={cn("size-2.5 rounded-full", nodeTypeDots[type])} />
                      {nodeTypeLabels[type]}
                      {selected ? <Check className="ml-auto size-3" aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset disabled={!hasGraph}>
              <legend className="text-sm font-medium text-slate-800">
                Relationships
              </legend>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {GRAPH_RELATIONSHIP_TYPES.map((type) => {
                  const selected = visibleRelationships.has(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onToggleRelationshipType(type)}
                      className={cn(
                        "inline-flex min-h-7 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyan-700",
                        selected
                          ? "border-cyan-200 bg-cyan-50 text-cyan-900"
                          : "border-slate-200 bg-white text-slate-400",
                      )}
                    >
                      {selected ? <Check className="size-3" aria-hidden="true" /> : null}
                      {relationshipLabels[type]}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
            <GitFork className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            Two hops can reveal a much larger neighborhood but always stays
            below the server-side graph limits.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
