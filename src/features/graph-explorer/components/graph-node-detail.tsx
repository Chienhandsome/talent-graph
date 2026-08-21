"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
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
    <Card className="border-0 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.3)] ring-slate-200">
      <CardHeader className="border-b border-slate-200 bg-slate-50/60 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-cyan-800 uppercase">
              <Network className="size-4" aria-hidden="true" />
              Node inspector
            </p>
            <CardTitle className="mt-2 text-xl text-slate-950">
              Inspect graph details
            </CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Review a node and jump between its direct connections.
            </p>
          </div>
          <div className="w-full sm:w-80">
            <label
              htmlFor="graph-node-inspector"
              className="text-xs font-medium text-slate-600"
            >
              Selected node
            </label>
            <Select
              items={nodeItems}
              value={selectedNode?.id ?? null}
              onValueChange={(value) => {
                if (value) {
                  onSelectNode(value);
                }
              }}
            >
              <SelectTrigger
                id="graph-node-inspector"
                className="mt-1.5 h-10 w-full border-slate-300 bg-white px-3 shadow-xs"
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
        </div>
      </CardHeader>

      <CardContent>
        {selectedNode ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.8fr)]">
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex size-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
                  <NodeIcon type={selectedNode.type} />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-950">
                    {selectedNode.label}
                  </h3>
                  <p className="mt-0.5 text-sm text-slate-500 capitalize">
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
              <p className="mt-5 text-sm leading-6 text-slate-700">
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

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-800">
                  Direct connections
                </p>
                <Badge variant="outline" className="bg-white text-slate-700">
                  {connections.length}
                </Badge>
              </div>
              {connections.length > 0 ? (
                <ul className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                  {connections.slice(0, 20).map(({ edge, node }) => (
                    <li key={edge.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (node) {
                            onSelectNode(node.id);
                          }
                        }}
                        className="group flex min-h-11 w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-cyan-300 hover:bg-cyan-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-700"
                      >
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                          {node?.label}
                        </span>
                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-slate-500 uppercase group-hover:bg-white group-hover:text-cyan-800">
                          {edge.label}
                        </span>
                        <ChevronRight
                          className="size-3.5 shrink-0 text-slate-400 group-hover:text-cyan-700"
                          aria-hidden="true"
                        />
                      </button>
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
