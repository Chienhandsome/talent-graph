// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import Home from "../src/app/page";

afterEach(cleanup);

describe("landing page", () => {
  it("presents the product and links to all three core tools", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Turn your skills into a route forward.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("70")).toBeInTheDocument();
    expect(screen.getByText("660")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links.some((link) => link.getAttribute("href") === "/career-path")).toBe(
      true,
    );
    expect(links.some((link) => link.getAttribute("href") === "/skill-gap")).toBe(
      true,
    );
    expect(links.some((link) => link.getAttribute("href") === "/explorer")).toBe(
      true,
    );
  });

  it("explains the graph-backed workflow", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: "A career plan grounded in relationships, not guesswork.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Career planning is a graph problem." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Start with your context")).toBeInTheDocument();
    expect(screen.getByText("Traverse the opportunity graph")).toBeInTheDocument();
    expect(screen.getByText("Turn gaps into evidence")).toBeInTheDocument();
  });
});
