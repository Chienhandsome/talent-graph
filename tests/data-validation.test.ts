import { describe, expect, it } from "vitest";

import { buildGraphData } from "../scripts/lib/build-graph-data";
import { loadGraphData } from "../scripts/lib/load-graph-data";
import {
  assertGraphDataInvariants,
  collectGraphDataIssues,
} from "../src/lib/data/validation";

describe("TalentGraph seed data", () => {
  it("matches the deterministic generator output", () => {
    expect(loadGraphData()).toEqual(buildGraphData());
  });

  it("satisfies all graph data invariants", () => {
    const data = loadGraphData();

    expect(() => assertGraphDataInvariants(data)).not.toThrow();
    expect(data.roles).toHaveLength(30);
    expect(data.skills).toHaveLength(70);
    expect(data.relationships.requires).toHaveLength(300);
    expect(data.relationships.transitions).toHaveLength(60);
  });

  it("reports a skill that is not required by any role", () => {
    const data = structuredClone(loadGraphData());
    data.relationships.requires = data.relationships.requires.filter(
      (relationship) => relationship.skillId !== "nest-js",
    );

    expect(collectGraphDataIssues(data)).toContain(
      "skill nest-js must be required by at least one role",
    );
  });

  it("requires multiple bounded paths for the primary demo", () => {
    const data = structuredClone(loadGraphData());
    data.relationships.transitions = data.relationships.transitions.filter(
      (transition) =>
        !(
          transition.toRoleId === "machine-learning-engineer" &&
          ["backend-developer", "data-engineer"].includes(
            transition.fromRoleId,
          )
        ),
    );

    expect(collectGraphDataIssues(data)).toContain(
      "frontend-developer to ai-engineer needs at least two paths of 2-4 hops; found 0",
    );
  });
});
