"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Focus,
  GitFork,
  Maximize2,
  Minus,
  Minimize2,
  Plus,
  RefreshCw,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchGraph, fetchRoles } from "@/features/graph-explorer/api";
import { cn } from "@/lib/utils";
import type {
  GraphData,
  GraphNodeType,
  GraphRelationshipType,
  GraphRequest,
} from "@/types/graph";
import {
  GRAPH_NODE_TYPES,
  GRAPH_RELATIONSHIP_TYPES,
} from "@/types/graph";
import type { RoleSummary } from "@/types/role";

import {
  GraphCanvas,
  type GraphCanvasHandle,
} from "./graph-canvas";
import { GraphControls } from "./graph-controls";
import { GraphNodeDetail } from "./graph-node-detail";
import {
  GraphEmptyState,
  GraphErrorState,
  GraphInitialState,
  GraphLoadingState,
} from "./graph-states";

const DEFAULT_ROOT_ROLE = "frontend-developer";

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "TalentGraph could not complete the request.";
}

function wasAborted(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function GraphExplorer() {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [rootRoleId, setRootRoleId] = useState("");
  const [depth, setDepth] = useState<1 | 2>(2);
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [hasExplored, setHasExplored] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [graphError, setGraphError] = useState<string | null>(null);
  const [isGraphFullscreen, setIsGraphFullscreen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [visibleNodeTypes, setVisibleNodeTypes] = useState<GraphNodeType[]>([
    ...GRAPH_NODE_TYPES,
  ]);
  const [visibleRelationshipTypes, setVisibleRelationshipTypes] = useState<
    GraphRelationshipType[]
  >([...GRAPH_RELATIONSHIP_TYPES]);

  const graphController = useRef<AbortController | null>(null);
  const lastRequest = useRef<GraphRequest | null>(null);
  const canvasRef = useRef<GraphCanvasHandle | null>(null);
  const graphFullscreenRef = useRef<HTMLDivElement | null>(null);
  const resultsRegion = useRef<HTMLDivElement | null>(null);

  const clearGraph = useCallback(() => {
    graphController.current?.abort();
    setGraph(null);
    setHasExplored(false);
    setIsLoading(false);
    setGraphError(null);
    setSelectedNodeId(null);
    setVisibleNodeTypes([...GRAPH_NODE_TYPES]);
    setVisibleRelationshipTypes([...GRAPH_RELATIONSHIP_TYPES]);
  }, []);

  const applyRoles = useCallback((loadedRoles: RoleSummary[]) => {
    setRoles(loadedRoles);
    setRootRoleId((current) => {
      if (current && loadedRoles.some((role) => role.id === current)) {
        return current;
      }
      return loadedRoles.some((role) => role.id === DEFAULT_ROOT_ROLE)
        ? DEFAULT_ROOT_ROLE
        : (loadedRoles[0]?.id ?? "");
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchRoles(controller.signal)
      .then(applyRoles)
      .catch((error: unknown) => {
        if (!wasAborted(error)) {
          setRolesError(errorMessage(error));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setRolesLoading(false);
        }
      });
    return () => controller.abort();
  }, [applyRoles]);

  useEffect(
    () => () => {
      graphController.current?.abort();
    },
    [],
  );

  useEffect(() => {
    function syncFullscreenState() {
      setIsGraphFullscreen(
        document.fullscreenElement === graphFullscreenRef.current,
      );
    }

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () => {
      document.removeEventListener("fullscreenchange", syncFullscreenState);
    };
  }, []);

  const runExplore = useCallback(async (request: GraphRequest) => {
    graphController.current?.abort();
    const controller = new AbortController();
    graphController.current = controller;
    lastRequest.current = request;
    setIsLoading(true);
    setHasExplored(true);
    setGraphError(null);
    setGraph(null);
    setSelectedNodeId(null);

    try {
      const nextGraph = await fetchGraph(request, controller.signal);
      setGraph(nextGraph);
      setSelectedNodeId(nextGraph.rootId);
      setVisibleNodeTypes([...GRAPH_NODE_TYPES]);
      setVisibleRelationshipTypes([...GRAPH_RELATIONSHIP_TYPES]);
    } catch (error) {
      if (!wasAborted(error)) {
        setGraphError(errorMessage(error));
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        requestAnimationFrame(() => resultsRegion.current?.focus());
      }
    }
  }, []);

  const handleCanvasSelect = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const visibleNodes = useMemo(
    () =>
      graph?.nodes.filter((node) => visibleNodeTypes.includes(node.type)) ?? [],
    [graph, visibleNodeTypes],
  );
  const selectedNode =
    graph?.nodes.find((node) => node.id === selectedNodeId) ?? null;

  function submitExplore() {
    if (rootRoleId) {
      void runExplore({ roleId: rootRoleId, depth });
    }
  }

  function retryRoles() {
    setRolesLoading(true);
    setRolesError(null);
    void fetchRoles()
      .then(applyRoles)
      .catch((error: unknown) => setRolesError(errorMessage(error)))
      .finally(() => setRolesLoading(false));
  }

  function toggleNodeType(type: GraphNodeType) {
    const nextTypes = visibleNodeTypes.includes(type)
      ? visibleNodeTypes.filter((candidate) => candidate !== type)
      : [...visibleNodeTypes, type];
    setVisibleNodeTypes(nextTypes);

    if (graph && selectedNode && !nextTypes.includes(selectedNode.type)) {
      const fallback = graph.nodes.find((node) => nextTypes.includes(node.type));
      setSelectedNodeId(fallback?.id ?? null);
    }
  }

  function toggleRelationshipType(type: GraphRelationshipType) {
    setVisibleRelationshipTypes((current) =>
      current.includes(type)
        ? current.filter((candidate) => candidate !== type)
        : [...current, type],
    );
  }

  async function toggleGraphFullscreen() {
    const graphElement = graphFullscreenRef.current;
    if (!graphElement) {
      return;
    }

    if (document.fullscreenElement === graphElement) {
      await document.exitFullscreen();
      return;
    }

    await graphElement.requestFullscreen();
  }

  return (
    <section className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="grid items-start gap-6 xl:grid-cols-[330px_minmax(0,1fr)] xl:gap-8">
        <GraphControls
          roles={roles}
          rolesLoading={rolesLoading}
          rolesError={rolesError}
          rootRoleId={rootRoleId}
          depth={depth}
          isLoading={isLoading}
          hasGraph={Boolean(graph && graph.edges.length > 0)}
          visibleNodeTypes={visibleNodeTypes}
          visibleRelationshipTypes={visibleRelationshipTypes}
          onRootRoleChange={(roleId) => {
            clearGraph();
            setRootRoleId(roleId);
          }}
          onDepthChange={(nextDepth) => {
            clearGraph();
            setDepth(nextDepth);
          }}
          onToggleNodeType={toggleNodeType}
          onToggleRelationshipType={toggleRelationshipType}
          onRetryRoles={retryRoles}
          onSubmit={submitExplore}
        />

        <div
          ref={resultsRegion}
          tabIndex={-1}
          className="min-w-0 scroll-mt-6 space-y-5 outline-none"
          aria-live="polite"
        >
          {isLoading ? <GraphLoadingState /> : null}
          {!isLoading && graphError ? (
            <GraphErrorState
              message={graphError}
              onRetry={() => {
                if (lastRequest.current) {
                  void runExplore(lastRequest.current);
                }
              }}
            />
          ) : null}
          {!isLoading && !graphError && graph && graph.edges.length === 0 ? (
            <GraphEmptyState />
          ) : null}
          {!isLoading && !graphError && graph && graph.edges.length > 0 ? (
            <>
              {graph.truncated ? (
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  This neighborhood reached the safety limit. Narrow the depth
                  or use the filters to focus the view.
                </div>
              ) : null}

              <Card
                ref={graphFullscreenRef}
                className={cn(
                  "border-0 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.45)] ring-slate-200",
                  isGraphFullscreen &&
                    "h-screen w-screen gap-0 rounded-none py-0 shadow-none ring-0",
                )}
              >
                <CardHeader
                  className={cn(
                    "border-b border-slate-100 pb-4",
                    isGraphFullscreen && "shrink-0 py-4",
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-lg">Graph neighborhood</CardTitle>
                        <Badge variant="outline">{graph.nodes.length} nodes</Badge>
                        <Badge variant="outline">{graph.edges.length} relationships</Badge>
                        <Badge variant="outline">{graph.depth} hops</Badge>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Drag nodes to reposition them, drag empty space to pan,
                        and click any node to inspect it.
                      </p>
                    </div>
                    <div className="flex items-center gap-1" aria-label="Graph view controls">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        aria-label="Zoom out"
                        title="Zoom out"
                        onClick={() => canvasRef.current?.zoomOut()}
                      >
                        <Minus aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        aria-label="Zoom in"
                        title="Zoom in"
                        onClick={() => canvasRef.current?.zoomIn()}
                      >
                        <Plus aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        aria-label="Fit graph to view"
                        title="Fit graph"
                        onClick={() => canvasRef.current?.fit()}
                      >
                        <Focus aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        aria-label="Run graph layout again"
                        title="Re-layout graph"
                        onClick={() => canvasRef.current?.relayout()}
                      >
                        <RotateCcw aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        aria-label={
                          isGraphFullscreen
                            ? "Exit full screen"
                            : "View graph full screen"
                        }
                        title={
                          isGraphFullscreen
                            ? "Exit full screen"
                            : "View full screen"
                        }
                        onClick={() => void toggleGraphFullscreen()}
                      >
                        {isGraphFullscreen ? (
                          <Minimize2 aria-hidden="true" />
                        ) : (
                          <Maximize2 aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent
                  className={cn(
                    "p-3 sm:p-4",
                    isGraphFullscreen && "min-h-0 flex-1",
                  )}
                >
                  <GraphCanvas
                    ref={canvasRef}
                    graph={graph}
                    isFullscreen={isGraphFullscreen}
                    selectedNodeId={selectedNodeId}
                    visibleNodeTypes={visibleNodeTypes}
                    visibleRelationshipTypes={visibleRelationshipTypes}
                    onSelectNode={handleCanvasSelect}
                  />
                </CardContent>
              </Card>

              <GraphNodeDetail
                graph={graph}
                visibleNodes={visibleNodes}
                selectedNode={selectedNode}
                onSelectNode={(nodeId) => {
                  setSelectedNodeId(nodeId);
                  canvasRef.current?.focusNode(nodeId);
                }}
              />

              <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm text-slate-500">
                <GitFork className="size-4 shrink-0 text-cyan-700" aria-hidden="true" />
                The server returns only bounded, curated relationship types.
                <RefreshCw className="ml-auto size-4 shrink-0 text-slate-400" aria-hidden="true" />
              </div>
            </>
          ) : null}
          {!isLoading && !graphError && !hasExplored ? <GraphInitialState /> : null}
        </div>
      </div>
    </section>
  );
}
