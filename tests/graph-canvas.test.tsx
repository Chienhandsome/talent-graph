// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { GraphCanvas } from "../src/features/graph-explorer/components/graph-canvas";
import type { GraphData } from "../src/types/graph";

const graph: GraphData = {
  rootId: "data-scientist",
  depth: 2,
  truncated: false,
  nodes: [
    {
      id: "data-scientist",
      type: "role",
      label: "Data Scientist",
      subtitle: "AI & Data Science · mid",
      description: "Investigates data and validates predictive solutions.",
    },
    {
      id: "python",
      type: "skill",
      label: "Python",
      subtitle: "Programming",
      description: "Python programming for data workflows.",
    },
    {
      id: "ml-course",
      type: "learning-resource",
      label: "Machine Learning Course",
      subtitle: "Course",
      description: "A practical machine learning course.",
    },
  ],
  edges: [
    {
      id: "requires:data-scientist:python",
      source: "data-scientist",
      target: "python",
      type: "REQUIRES",
      label: "requires",
    },
    {
      id: "teaches:ml-course:python",
      source: "ml-course",
      target: "python",
      type: "TEACHES",
      label: "teaches",
    },
  ],
};

class TestPointerEvent extends MouseEvent {
  pointerId: number;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("graph canvas interactions", () => {
  it("drags a node and updates its connected edge", async () => {
    vi.stubGlobal("PointerEvent", TestPointerEvent);
    const onSelectNode = vi.fn();

    render(
      <GraphCanvas
        graph={graph}
        selectedNodeId="data-scientist"
        visibleNodeTypes={[
          "role",
          "skill",
          "learning-resource",
          "project",
        ]}
        visibleRelationshipTypes={[
          "REQUIRES",
          "CAN_TRANSITION_TO",
          "TEACHES",
          "DEMONSTRATES",
          "RELATED_TO",
        ]}
        onSelectNode={onSelectNode}
      />,
    );

    const svg = await screen.findByTestId("graph-svg");
    vi.spyOn(svg, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 1200,
      bottom: 720,
      width: 1200,
      height: 720,
      toJSON: () => ({}),
    });
    Object.defineProperties(svg, {
      setPointerCapture: { value: vi.fn(), configurable: true },
      hasPointerCapture: { value: vi.fn(() => false), configurable: true },
    });

    const pythonNode = screen.getByRole("button", {
      name: "Python, skill. Drag to reposition.",
    });
    const edge = svg.querySelector(
      '[data-edge-id="requires:data-scientist:python"] line',
    );
    const startX = Number(pythonNode.getAttribute("data-x"));
    const startY = Number(pythonNode.getAttribute("data-y"));
    const startEdgeX = Number(edge?.getAttribute("x2"));

    fireEvent.pointerDown(pythonNode, {
      pointerId: 7,
      clientX: 100,
      clientY: 100,
    });
    fireEvent.pointerMove(svg, {
      pointerId: 7,
      clientX: 180,
      clientY: 145,
    });
    fireEvent.pointerUp(svg, { pointerId: 7 });

    await waitFor(() => {
      expect(Number(pythonNode.getAttribute("data-x"))).toBeCloseTo(
        startX + 80,
      );
      expect(Number(pythonNode.getAttribute("data-y"))).toBeCloseTo(
        startY + 45,
      );
      expect(Number(edge?.getAttribute("x2"))).not.toBeCloseTo(startEdgeX);
    });
    expect(onSelectNode).toHaveBeenCalledWith("python");
  });

  it("reveals secondary labels on hover instead of showing every label", async () => {
    render(
      <GraphCanvas
        graph={graph}
        selectedNodeId="data-scientist"
        visibleNodeTypes={[
          "role",
          "skill",
          "learning-resource",
          "project",
        ]}
        visibleRelationshipTypes={[
          "REQUIRES",
          "CAN_TRANSITION_TO",
          "TEACHES",
          "DEMONSTRATES",
          "RELATED_TO",
        ]}
        onSelectNode={() => {}}
      />,
    );

    await screen.findByTestId("graph-svg");
    expect(screen.queryByText("Python")).not.toBeInTheDocument();

    fireEvent.pointerEnter(
      screen.getByRole("button", {
        name: "Python, skill. Drag to reposition.",
      }),
    );

    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.queryByText("requires")).not.toBeInTheDocument();
  });

  it("keeps the full 74-node and 160-edge graph interactive", async () => {
    const nodes: GraphData["nodes"] = Array.from({ length: 74 }, (_, index) => ({
      id: `node-${index}`,
      type: index === 0 ? "role" : "skill",
      label: index === 0 ? "Data Scientist" : `Skill ${index}`,
      subtitle: "Test graph",
      description: `Graph node ${index}`,
    }));
    const edges: GraphData["edges"] = Array.from(
      { length: 160 },
      (_, index) => ({
        id: `edge-${index}`,
        source:
          index < 73 ? `node-${index}` : `node-${index % nodes.length}`,
        target:
          index < 73
            ? `node-${index + 1}`
            : `node-${(index * 13 + 7) % nodes.length}`,
        type: "REQUIRES",
        label: "requires",
      }),
    );

    render(
      <GraphCanvas
        graph={{
          rootId: "node-0",
          depth: 2,
          truncated: false,
          nodes,
          edges,
        }}
        selectedNodeId="node-0"
        visibleNodeTypes={[
          "role",
          "skill",
          "learning-resource",
          "project",
        ]}
        visibleRelationshipTypes={[
          "REQUIRES",
          "CAN_TRANSITION_TO",
          "TEACHES",
          "DEMONSTRATES",
          "RELATED_TO",
        ]}
        onSelectNode={() => {}}
      />,
    );

    await screen.findByTestId("graph-svg", {}, { timeout: 10_000 });
    expect(screen.getAllByTestId("graph-node")).toHaveLength(74);
    expect(screen.getAllByTestId("graph-edge")).toHaveLength(160);
  });
});
