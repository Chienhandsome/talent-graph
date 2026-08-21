"use client";

import {
  forwardRef,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import type cytoscape from "cytoscape";

import { cn } from "@/lib/utils";
import type {
  GraphData,
  GraphNode,
  GraphNodeType,
  GraphRelationshipType,
} from "@/types/graph";

export interface GraphCanvasHandle {
  fit(): void;
  relayout(): void;
  zoomIn(): void;
  zoomOut(): void;
  focusNode(nodeId: string): void;
}

interface GraphCanvasProps {
  graph: GraphData;
  isFullscreen?: boolean;
  selectedNodeId: string | null;
  visibleNodeTypes: GraphNodeType[];
  visibleRelationshipTypes: GraphRelationshipType[];
  onSelectNode(nodeId: string): void;
}

interface GraphPosition {
  x: number;
  y: number;
}

interface Viewport {
  zoom: number;
  x: number;
  y: number;
}

interface DragState {
  pointerId: number;
  clientX: number;
  clientY: number;
  viewportX: number;
  viewportY: number;
}

interface NodeDragState {
  pointerId: number;
  nodeId: string;
  clientX: number;
  clientY: number;
  nodeX: number;
  nodeY: number;
}

const VIEW_WIDTH = 1200;
const VIEW_HEIGHT = 720;
const LAYOUT_PADDING = 92;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 2.4;
const DEFAULT_VIEWPORT: Viewport = { zoom: 1, x: 0, y: 0 };

const NODE_COLORS: Record<GraphNodeType, string> = {
  role: "#0f172a",
  skill: "#0891b2",
  "learning-resource": "#4f46e5",
  project: "#d97706",
};

const RELATIONSHIP_COLORS: Record<GraphRelationshipType, string> = {
  REQUIRES: "#64748b",
  CAN_TRANSITION_TO: "#0f766e",
  TEACHES: "#4f46e5",
  DEMONSTRATES: "#d97706",
  RELATED_TO: "#0891b2",
};

const HEADLESS_STYLES: cytoscape.StylesheetStyle[] = [
  {
    selector: "node",
    style: { width: 48, height: 48 },
  },
  {
    selector: 'node[type = "role"]',
    style: { width: 64, height: 52 },
  },
];

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

function zoomAroundCenter(viewport: Viewport, requestedZoom: number): Viewport {
  const zoom = clampZoom(requestedZoom);
  const graphCenterX = (VIEW_WIDTH / 2 - viewport.x) / viewport.zoom;
  const graphCenterY = (VIEW_HEIGHT / 2 - viewport.y) / viewport.zoom;

  return {
    zoom,
    x: VIEW_WIDTH / 2 - graphCenterX * zoom,
    y: VIEW_HEIGHT / 2 - graphCenterY * zoom,
  };
}

function shortenEdge(source: GraphPosition, target: GraphPosition) {
  const deltaX = target.x - source.x;
  const deltaY = target.y - source.y;
  const length = Math.max(Math.hypot(deltaX, deltaY), 1);
  const unitX = deltaX / length;
  const unitY = deltaY / length;

  return {
    x1: source.x + unitX * 30,
    y1: source.y + unitY * 30,
    x2: target.x - unitX * 34,
    y2: target.y - unitY * 34,
  };
}

export function normalizeGraphPositions(
  positions: ReadonlyArray<{ id: string; x: number; y: number }>,
): Record<string, GraphPosition> {
  if (positions.length === 0) {
    return {};
  }

  if (
    positions.some(
      (position) =>
        !Number.isFinite(position.x) || !Number.isFinite(position.y),
    )
  ) {
    throw new Error("Cytoscape returned an invalid graph position.");
  }

  const minX = Math.min(...positions.map((position) => position.x));
  const maxX = Math.max(...positions.map((position) => position.x));
  const minY = Math.min(...positions.map((position) => position.y));
  const maxY = Math.max(...positions.map((position) => position.y));
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const availableWidth = VIEW_WIDTH - LAYOUT_PADDING * 2;
  const availableHeight = VIEW_HEIGHT - LAYOUT_PADDING * 2;
  const scale = Math.min(availableWidth / spanX, availableHeight / spanY);
  const renderedWidth = spanX * scale;
  const renderedHeight = spanY * scale;
  const offsetX = (VIEW_WIDTH - renderedWidth) / 2;
  const offsetY = (VIEW_HEIGHT - renderedHeight) / 2;

  return Object.fromEntries(
    positions.map((position) => [
      position.id,
      {
        x: offsetX + (position.x - minX) * scale,
        y: offsetY + (position.y - minY) * scale,
      },
    ]),
  );
}

function graphElements(graph: GraphData): cytoscape.ElementDefinition[] {
  return [
    ...graph.nodes.map((node) => ({
      data: { id: node.id, type: node.type },
    })),
    ...graph.edges.map((edge) => ({
      data: {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
      },
    })),
  ];
}

function NodeShape({ node }: { node: GraphNode }) {
  const color = NODE_COLORS[node.type];

  switch (node.type) {
    case "role":
      return (
        <rect
          x={-32}
          y={-26}
          width={64}
          height={52}
          rx={13}
          fill={color}
        />
      );
    case "learning-resource":
      return <polygon points="0,-27 27,0 0,27 -27,0" fill={color} />;
    case "project":
      return (
        <polygon points="-24,-14 0,-28 24,-14 24,14 0,28 -24,14" fill={color} />
      );
    case "skill":
      return <circle r={24} fill={color} />;
  }
}

function handleNodeKeyDown(
  event: KeyboardEvent<SVGGElement>,
  nodeId: string,
  onSelectNode: (nodeId: string) => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onSelectNode(nodeId);
  }
}

export const GraphCanvas = forwardRef<GraphCanvasHandle, GraphCanvasProps>(
  function GraphCanvas(
    {
      graph,
      isFullscreen = false,
      selectedNodeId,
      visibleNodeTypes,
      visibleRelationshipTypes,
      onSelectNode,
    },
    ref,
  ) {
    const [positions, setPositions] = useState<Record<string, GraphPosition>>(
      {},
    );
    const [renderState, setRenderState] = useState<
      "loading" | "ready" | "error"
    >("loading");
    const [layoutRevision, setLayoutRevision] = useState(0);
    const [viewport, setViewport] = useState<Viewport>(DEFAULT_VIEWPORT);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const dragRef = useRef<DragState | null>(null);
    const nodeDragRef = useRef<NodeDragState | null>(null);

    useEffect(() => {
      let disposed = false;

      void import("cytoscape")
        .then(({ default: createCytoscape }) => {
          if (disposed) {
            return;
          }

          let instance: cytoscape.Core | null = null;
          try {
            instance = createCytoscape({
              headless: true,
              styleEnabled: true,
              elements: graphElements(graph),
              style: HEADLESS_STYLES,
            });
            instance
              .layout({
                name: "cose",
                animate: false,
                fit: false,
                boundingBox: {
                  x1: LAYOUT_PADDING,
                  y1: LAYOUT_PADDING,
                  w: VIEW_WIDTH - LAYOUT_PADDING * 2,
                  h: VIEW_HEIGHT - LAYOUT_PADDING * 2,
                },
                nodeRepulsion: 9000,
                idealEdgeLength: 95,
                edgeElasticity: 110,
                nestingFactor: 1.2,
                gravity: 0.45,
                numIter: 900,
                randomize: true,
              })
              .run();

            const nextPositions = normalizeGraphPositions(
              instance.nodes().map((node) => ({
                id: node.id(),
                x: node.position("x"),
                y: node.position("y"),
              })),
            );

            if (Object.keys(nextPositions).length !== graph.nodes.length) {
              throw new Error("Cytoscape did not position every graph node.");
            }

            if (!disposed) {
              setPositions(nextPositions);
              setViewport(DEFAULT_VIEWPORT);
              setRenderState("ready");
            }
          } catch {
            if (!disposed) {
              setPositions({});
              setRenderState("error");
            }
          } finally {
            instance?.destroy();
          }
        })
        .catch(() => {
          if (!disposed) {
            setPositions({});
            setRenderState("error");
          }
        });

      return () => {
        disposed = true;
      };
    }, [graph, layoutRevision]);

    const visibleNodeIds = useMemo(
      () =>
        new Set(
          graph.nodes
            .filter((node) => visibleNodeTypes.includes(node.type))
            .map((node) => node.id),
        ),
      [graph.nodes, visibleNodeTypes],
    );

    const visibleEdges = useMemo(
      () =>
        graph.edges.filter(
          (edge) =>
            visibleRelationshipTypes.includes(edge.type) &&
            visibleNodeIds.has(edge.source) &&
            visibleNodeIds.has(edge.target),
        ),
      [graph.edges, visibleNodeIds, visibleRelationshipTypes],
    );

    const connectedNodeIds = useMemo(() => {
      const connected = new Set<string>();
      if (!selectedNodeId) {
        return connected;
      }
      visibleEdges.forEach((edge) => {
        if (edge.source === selectedNodeId) {
          connected.add(edge.target);
        }
        if (edge.target === selectedNodeId) {
          connected.add(edge.source);
        }
      });
      return connected;
    }, [selectedNodeId, visibleEdges]);

    const visibleNodes = useMemo(
      () =>
        graph.nodes
          .filter((node) => visibleNodeIds.has(node.id))
          .sort((left, right) => {
            const layer = (nodeId: string) => {
              if (nodeId === hoveredNodeId) return 4;
              if (nodeId === selectedNodeId) return 3;
              if (nodeId === graph.rootId) return 2;
              if (connectedNodeIds.has(nodeId)) return 1;
              return 0;
            };
            return layer(left.id) - layer(right.id);
          }),
      [
        connectedNodeIds,
        graph.nodes,
        graph.rootId,
        hoveredNodeId,
        selectedNodeId,
        visibleNodeIds,
      ],
    );

    useImperativeHandle(
      ref,
      () => ({
        fit() {
          setViewport(DEFAULT_VIEWPORT);
        },
        relayout() {
          setRenderState("loading");
          setLayoutRevision((revision) => revision + 1);
        },
        zoomIn() {
          setViewport((current) =>
            zoomAroundCenter(current, current.zoom * 1.2),
          );
        },
        zoomOut() {
          setViewport((current) =>
            zoomAroundCenter(current, current.zoom / 1.2),
          );
        },
        focusNode(nodeId: string) {
          const position = positions[nodeId];
          if (!position) {
            return;
          }
          const zoom = 1.35;
          setViewport({
            zoom,
            x: VIEW_WIDTH / 2 - position.x * zoom,
            y: VIEW_HEIGHT / 2 - position.y * zoom,
          });
        },
      }),
      [positions],
    );

    function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
      const target = event.target as Element;
      if (target.closest("[data-graph-node]")) {
        return;
      }
      if (typeof event.currentTarget.setPointerCapture === "function") {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      dragRef.current = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        viewportX: viewport.x,
        viewportY: viewport.y,
      };
    }

    function handleNodePointerDown(
      event: PointerEvent<SVGGElement>,
      nodeId: string,
    ) {
      const position = positions[nodeId];
      if (!position) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      onSelectNode(nodeId);
      const svg = event.currentTarget.ownerSVGElement;
      if (svg && typeof svg.setPointerCapture === "function") {
        svg.setPointerCapture(event.pointerId);
      }
      nodeDragRef.current = {
        pointerId: event.pointerId,
        nodeId,
        clientX: event.clientX,
        clientY: event.clientY,
        nodeX: position.x,
        nodeY: position.y,
      };
    }

    function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const scaleX = VIEW_WIDTH / Math.max(bounds.width, 1);
      const scaleY = VIEW_HEIGHT / Math.max(bounds.height, 1);
      const nodeDrag = nodeDragRef.current;
      if (nodeDrag?.pointerId === event.pointerId) {
        const nextX =
          nodeDrag.nodeX +
          ((event.clientX - nodeDrag.clientX) * scaleX) / viewport.zoom;
        const nextY =
          nodeDrag.nodeY +
          ((event.clientY - nodeDrag.clientY) * scaleY) / viewport.zoom;
        setPositions((current) => ({
          ...current,
          [nodeDrag.nodeId]: { x: nextX, y: nextY },
        }));
        return;
      }

      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }
      setViewport((current) => ({
        ...current,
        x: drag.viewportX + (event.clientX - drag.clientX) * scaleX,
        y: drag.viewportY + (event.clientY - drag.clientY) * scaleY,
      }));
    }

    function handlePointerEnd(event: PointerEvent<SVGSVGElement>) {
      if (nodeDragRef.current?.pointerId === event.pointerId) {
        nodeDragRef.current = null;
      }
      if (dragRef.current?.pointerId === event.pointerId) {
        dragRef.current = null;
      }
      if (
        typeof event.currentTarget.hasPointerCapture === "function" &&
        event.currentTarget.hasPointerCapture(event.pointerId)
      ) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    function handleWheel(event: WheelEvent<SVGSVGElement>) {
      event.preventDefault();
      setViewport((current) =>
        zoomAroundCenter(
          current,
          current.zoom * (event.deltaY > 0 ? 0.9 : 1.1),
        ),
      );
    }

    return (
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-xl bg-slate-50",
          isFullscreen ? "h-full rounded-none" : "h-[480px] lg:h-[620px]",
        )}
        aria-busy={renderState === "loading"}
      >
        {renderState === "ready" ? (
          <svg
            data-testid="graph-svg"
            role="application"
            aria-label="Interactive TalentGraph visualization. Drag nodes to reposition them, drag the background to pan, or scroll to zoom."
            tabIndex={0}
            width="100%"
            height="100%"
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            className="block size-full cursor-grab touch-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-600 active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onWheel={handleWheel}
          >
            <defs>
              <pattern
                id="graph-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="#cbd5e1" opacity="0.65" />
              </pattern>
              {Object.entries(RELATIONSHIP_COLORS).map(([type, color]) => (
                <marker
                  key={type}
                  id={`arrow-${type}`}
                  viewBox="0 0 10 10"
                  refX="9"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
                </marker>
              ))}
            </defs>
            <rect width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="#f8fafc" />
            <rect
              width={VIEW_WIDTH}
              height={VIEW_HEIGHT}
              fill="url(#graph-grid)"
            />
            <g
              aria-hidden="true"
              pointerEvents="none"
              transform="translate(18 18)"
            >
              <rect
                width="238"
                height="34"
                rx="10"
                fill="#ffffff"
                stroke="#cbd5e1"
                opacity="0.94"
              />
              <text x="14" y="22" fontSize="12" fontWeight="600" fill="#475569">
                Drag a node to untangle this view
              </text>
            </g>
            <g
              data-testid="graph-viewport"
              transform={`translate(${viewport.x} ${viewport.y}) scale(${viewport.zoom})`}
            >
              <g aria-hidden="true" pointerEvents="none">
                {visibleEdges.map((edge) => {
                  const source = positions[edge.source];
                  const target = positions[edge.target];
                  if (!source || !target) {
                    return null;
                  }
                  const touchesSelection =
                    edge.source === selectedNodeId || edge.target === selectedNodeId;
                  const touchesHover =
                    edge.source === hoveredNodeId || edge.target === hoveredNodeId;
                  const emphasized = touchesSelection || touchesHover;
                  const color = RELATIONSHIP_COLORS[edge.type];
                  const line = shortenEdge(source, target);

                  return (
                    <g
                      key={edge.id}
                      data-testid="graph-edge"
                      data-edge-id={edge.id}
                    >
                      <title>{`${edge.label}: ${edge.source} → ${edge.target}`}</title>
                      <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke={color}
                        strokeWidth={emphasized ? 2.8 : 1.25}
                        strokeDasharray={
                          edge.type === "RELATED_TO" ? "7 6" : undefined
                        }
                        opacity={
                          selectedNodeId || hoveredNodeId
                            ? emphasized
                              ? 0.82
                              : 0.1
                            : 0.4
                        }
                        markerEnd={`url(#arrow-${edge.type})`}
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  );
                })}
              </g>

              {visibleNodes.map((node) => {
                const position = positions[node.id];
                if (!position) {
                  return null;
                }
                const selected = node.id === selectedNodeId;
                const connected = connectedNodeIds.has(node.id);
                const root = node.id === graph.rootId;
                const hovered = node.id === hoveredNodeId;
                const displayLabel =
                  node.label.length > 28
                    ? `${node.label.slice(0, 27)}…`
                    : node.label;
                const showLabel =
                  selected ||
                  root ||
                  hovered ||
                  (node.type === "role" && connected) ||
                  viewport.zoom >= 1.5;
                const labelWidth = Math.min(
                  200,
                  Math.max(62, displayLabel.length * 6.4 + 18),
                );

                return (
                  <g
                    key={node.id}
                    data-testid="graph-node"
                    data-graph-node={node.id}
                    data-x={position.x}
                    data-y={position.y}
                    role="button"
                    aria-label={`${node.label}, ${node.type}. Drag to reposition.`}
                    tabIndex={0}
                    transform={`translate(${position.x} ${position.y})`}
                    className="cursor-grab outline-none active:cursor-grabbing"
                    opacity={
                      selectedNodeId && !selected && !connected && !hovered
                        ? 0.42
                        : 1
                    }
                    onPointerDown={(event) =>
                      handleNodePointerDown(event, node.id)
                    }
                    onPointerEnter={() => setHoveredNodeId(node.id)}
                    onPointerLeave={() => setHoveredNodeId(null)}
                    onClick={() => onSelectNode(node.id)}
                    onKeyDown={(event) =>
                      handleNodeKeyDown(event, node.id, onSelectNode)
                    }
                  >
                    <title>{`${node.label} · ${node.type}`}</title>
                    {root || selected ? (
                      <circle
                        r={38}
                        fill="none"
                        stroke={selected ? "#06b6d4" : "#67e8f9"}
                        strokeWidth={selected ? 5 : 4}
                        vectorEffect="non-scaling-stroke"
                      />
                    ) : null}
                    <NodeShape node={node} />
                    {showLabel ? (
                      <g pointerEvents="none">
                        <rect
                          x={-labelWidth / 2}
                          y={34}
                          width={labelWidth}
                          height={24}
                          rx={8}
                          fill={selected ? "#0f172a" : "#ffffff"}
                          stroke={selected ? "#22d3ee" : "#cbd5e1"}
                          strokeWidth={selected ? 2 : 1}
                          opacity={0.96}
                          vectorEffect="non-scaling-stroke"
                        />
                        <text
                          y={50}
                          textAnchor="middle"
                          fontSize={root ? 12 : 10.5}
                          fontWeight={root || selected ? "700" : "600"}
                          fill={selected ? "#ffffff" : "#334155"}
                        >
                          {displayLabel}
                        </text>
                      </g>
                    ) : null}
                  </g>
                );
              })}
            </g>
          </svg>
        ) : null}

        {renderState === "loading" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 p-6 text-center text-sm text-slate-500">
            Laying out the graph…
          </div>
        ) : null}
        {renderState === "error" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white p-6 text-center text-sm text-red-700">
            The interactive graph could not be initialized. Refresh the page
            and try again.
          </div>
        ) : null}
      </div>
    );
  },
);
