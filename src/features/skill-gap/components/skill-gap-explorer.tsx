"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchRoleDetail,
  fetchRoles,
  fetchSkillGap,
} from "@/features/skill-gap/api";
import type { RoleSummary, SkillRequirement } from "@/types/role";
import type { SkillGapRequest, SkillGapResult } from "@/types/skill-gap";

import { SkillGapForm } from "./skill-gap-form";
import { SkillGapResults } from "./skill-gap-results";
import {
  SkillGapEmptyState,
  SkillGapErrorState,
  SkillGapInitialState,
  SkillGapLoadingState,
} from "./skill-gap-states";

const DEFAULT_TARGET_ROLE = "ai-engineer";
const DEFAULT_DEMO_SKILLS = ["python", "rest-apis"];

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "TalentGraph could not complete the request.";
}

function wasAborted(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function suggestedSkillIds(
  targetRoleId: string,
  skills: SkillRequirement[],
): string[] {
  const availableIds = new Set(skills.map((skill) => skill.id));
  const demoSkills =
    targetRoleId === DEFAULT_TARGET_ROLE
      ? DEFAULT_DEMO_SKILLS.filter((skillId) => availableIds.has(skillId))
      : [];

  if (demoSkills.length > 0) {
    return demoSkills;
  }

  return skills
    .filter((skill) => skill.essential)
    .slice(0, 2)
    .map((skill) => skill.id);
}

export function SkillGapExplorer() {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [targetRoleId, setTargetRoleId] = useState("");
  const [targetSkills, setTargetSkills] = useState<SkillRequirement[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [skillsReloadToken, setSkillsReloadToken] = useState(0);
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const analysisController = useRef<AbortController | null>(null);
  const lastRequest = useRef<SkillGapRequest | null>(null);
  const resultsRegion = useRef<HTMLDivElement | null>(null);

  const clearAnalysis = useCallback(() => {
    analysisController.current?.abort();
    setResult(null);
    setHasAnalyzed(false);
    setAnalysisError(null);
    setIsSubmitting(false);
  }, []);

  const applyRoles = useCallback((loadedRoles: RoleSummary[]) => {
    setRoles(loadedRoles);
    setTargetRoleId((current) => {
      if (current && loadedRoles.some((role) => role.id === current)) {
        return current;
      }
      return loadedRoles.some((role) => role.id === DEFAULT_TARGET_ROLE)
        ? DEFAULT_TARGET_ROLE
        : (loadedRoles[0]?.id ?? "");
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchRoles(controller.signal)
      .then((loadedRoles) => {
        setSkillsLoading(loadedRoles.length > 0);
        applyRoles(loadedRoles);
      })
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

  useEffect(() => {
    if (!targetRoleId) {
      return;
    }

    const controller = new AbortController();
    void fetchRoleDetail(targetRoleId, controller.signal)
      .then((role) => {
        setTargetSkills(role.requiredSkills);
        setSelectedSkillIds(
          suggestedSkillIds(targetRoleId, role.requiredSkills),
        );
      })
      .catch((error: unknown) => {
        if (!wasAborted(error)) {
          setSkillsError(errorMessage(error));
          setSelectedSkillIds([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSkillsLoading(false);
        }
      });

    return () => controller.abort();
  }, [targetRoleId, skillsReloadToken]);

  useEffect(
    () => () => {
      analysisController.current?.abort();
    },
    [],
  );

  const runAnalysis = useCallback(async (request: SkillGapRequest) => {
    analysisController.current?.abort();
    const controller = new AbortController();
    analysisController.current = controller;
    lastRequest.current = request;
    setIsSubmitting(true);
    setHasAnalyzed(true);
    setAnalysisError(null);
    setResult(null);

    try {
      const nextResult = await fetchSkillGap(request, controller.signal);
      setResult(nextResult);
    } catch (error) {
      if (!wasAborted(error)) {
        setAnalysisError(errorMessage(error));
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsSubmitting(false);
        requestAnimationFrame(() => resultsRegion.current?.focus());
      }
    }
  }, []);

  function submitAnalysis() {
    if (!targetRoleId) {
      return;
    }
    void runAnalysis({ targetRoleId, skillIds: selectedSkillIds });
  }

  function retryRoles() {
    setRolesLoading(true);
    setRolesError(null);
    void fetchRoles()
      .then((loadedRoles) => {
        setSkillsLoading(loadedRoles.length > 0);
        applyRoles(loadedRoles);
      })
      .catch((error: unknown) => setRolesError(errorMessage(error)))
      .finally(() => setRolesLoading(false));
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-8">
        <SkillGapForm
          roles={roles}
          rolesLoading={rolesLoading}
          rolesError={rolesError}
          targetRoleId={targetRoleId}
          targetSkills={targetSkills}
          selectedSkillIds={selectedSkillIds}
          skillsLoading={skillsLoading}
          skillsError={skillsError}
          isSubmitting={isSubmitting}
          onTargetRoleChange={(roleId) => {
            if (roleId === targetRoleId) {
              return;
            }
            clearAnalysis();
            setSkillsLoading(Boolean(roleId));
            setSkillsError(null);
            setTargetSkills([]);
            setSelectedSkillIds([]);
            setTargetRoleId(roleId);
          }}
          onToggleSkill={(skillId) => {
            clearAnalysis();
            setSelectedSkillIds((selected) =>
              selected.includes(skillId)
                ? selected.filter((id) => id !== skillId)
                : [...selected, skillId],
            );
          }}
          onSelectAll={() => {
            clearAnalysis();
            setSelectedSkillIds(targetSkills.map((skill) => skill.id));
          }}
          onClearSkills={() => {
            clearAnalysis();
            setSelectedSkillIds([]);
          }}
          onRetryRoles={retryRoles}
          onRetrySkills={() => {
            setSkillsLoading(true);
            setSkillsError(null);
            setSkillsReloadToken((token) => token + 1);
          }}
          onSubmit={submitAnalysis}
        />

        <div
          ref={resultsRegion}
          tabIndex={-1}
          className="min-w-0 scroll-mt-6 outline-none"
          aria-live="polite"
        >
          {isSubmitting ? <SkillGapLoadingState /> : null}
          {!isSubmitting && analysisError ? (
            <SkillGapErrorState
              message={analysisError}
              onRetry={() => {
                if (lastRequest.current) {
                  void runAnalysis(lastRequest.current);
                }
              }}
            />
          ) : null}
          {!isSubmitting && !analysisError && result?.totalRequiredSkills === 0 ? (
            <SkillGapEmptyState />
          ) : null}
          {!isSubmitting &&
          !analysisError &&
          result &&
          result.totalRequiredSkills > 0 ? (
            <SkillGapResults result={result} />
          ) : null}
          {!isSubmitting && !analysisError && !hasAnalyzed ? (
            <SkillGapInitialState />
          ) : null}
        </div>
      </div>
    </section>
  );
}
