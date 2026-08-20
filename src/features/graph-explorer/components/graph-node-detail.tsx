"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  ExternalLink,
  FolderKanban,
  GitFork,
  Network,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GraphData, GraphNode, GraphNodeType } from "@/types/graph";

const nodeTypeLabels: Record<GraphNodeType, string> = {
  role: "Role",
  skill: "Skill",
  "learning-resource": "Learning resource",
  project: "Project",
};

const nodeTypeStyles: Record<GraphNodeType, string> = {
  role: "border-slate-300 bg-slate-100 text-slate-800",
  skill: "border-cyan-200 bg-cyan-50 text-cyan-900",
  "learning-resource": "border-indigo-200 bg-indigo-50 text-indigo-800",
  project: "border-amber-200 bg-amber-50 text-amber-900",
};

function NodeIcon({ type }: { type: GraphNodeType }) {
  const Icon =
    type === "role"
      ? BriefcaseBusiness
      : type === "skill"
        ? GitFork
        : type === "learning-resource"
          ? BookOpen
          : FolderKanban;
  return <Icon className="size-4" aria-hidden="true" />;
}

export function GraphNodeDetail({
  graph,
  visibleNodes,
  selectedNode,
  onSelectNode,
}: {
  graph: GraphData;
  visibleNodes: GraphNode[];
  selectedNode: GraphNode | null;
  onSelectNode(nodeId: string): void;
}) {
  const nodeItems = visibleNodes.map((node) => ({
    value: node.id,
    label: `${node.label} · ${nodeTypeLabels[node.type]}`,
  }));
  const connections = selectedNode
    ? graph.edges
        .filter(
          (edge) =>
            edge.source === selectedNode.id || edge.target === selectedNode.id,
        )
        .map((edge) => {
          const otherId =
            edge.source === selectedNode.id ? edge.target : edge.source;
          return {
            edge,
            node: graph.nodes.find((node) => node.id === otherId),
          };
        })
        .filter((connection) => connection.node)
    : [];

  return (
    <Card className="border-0 bg-white ring-slate-200">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan-800 uppercase">
              <Network className="size-4" aria-hidden="true" />
              Node inspector
            </p>
            <CardTitle className="mt-2 text-lg">Inspect graph details</CardTitle>
          </div>
          <Select
            items={nodeItems}
            value={selectedNode?.id ?? null}
            onValueChange={(value) => {
              if (value) {
                onSelectNode(value);
              }
            }}
          >
            <label htmlFor="graph-node-inspector" className="sr-only">
              Inspect a visible graph node
            </label>
            <SelectTrigger
              id="graph-node-inspector"
              className="h-10 w-full max-w-sm border-slate-200 bg-white px-3 sm:w-80"
            >
              <SelectValue placeholder="Choose a visible node" />
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false} className="max-h-72">
              {visibleNodes.map((node) => (
                <SelectItem key={node.id} value={node.id}>
                  <span className="flex min-w-0 flex-col py-0.5">
                    <span className="truncate font-medium">{node.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {nodeTypeLabels[node.type]}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {selectedNode ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.8fr)]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <NodeIcon type={selectedNode.type} />
                </span>
                <div>
                  <h3 className="font-semibold text-slate-950">
                    {selectedNode.label}
                  </h3>
                  <p className="text-xs text-slate-500 capitalize">
                    {selectedNode.subtitle}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`ml-auto ${nodeTypeStyles[selectedNode.type]}`}
                >
                  {nodeTypeLabels[selectedNode.type]}
                </Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {selectedNode.description}
              </p>
              {selectedNode.url ? (
                <a
                  href={selectedNode.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                >
                  Open official resource
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
              ) : null}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Direct connections · {connections.length}
              </p>
              {connections.length > 0 ? (
                <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto pr-1">
                  {connections.slice(0, 20).map(({ edge, node }) => (
                    <li
                      key={edge.id}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="truncate font-medium text-slate-700">
                        {node?.label}
                      </span>
                      <span className="shrink-0 text-[10px] tracking-wide text-slate-400 uppercase">
                        {edge.label}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-400">
                  No visible connection for this node.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Select a visible node to read its description and connections.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
