"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchCareerPaths,
  fetchRoleDetail,
  fetchRoles,
} from "@/features/career-path/api";
import type { CareerPathRequest, CareerPathResult } from "@/types/career-path";
import type { RoleSummary, SkillRequirement } from "@/types/role";

import { CareerPathForm } from "./career-path-form";
import { CareerPathResults } from "./career-path-results";
import {
  CareerPathEmptyState,
  CareerPathErrorState,
  CareerPathInitialState,
  CareerPathLoadingState,
} from "./career-path-states";

const DEFAULT_CURRENT_ROLE = "frontend-developer";
const DEFAULT_TARGET_ROLE = "ai-engineer";
const DEFAULT_DEMO_SKILLS = ["javascript", "typescript", "react"];

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "TalentGraph could not complete the request.";
}

function wasAborted(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export function CareerPathExplorer() {
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState<string | null>(null);
  const [currentRoleId, setCurrentRoleId] = useState("");
  const [targetRoleId, setTargetRoleId] = useState("");
  const [maxHops, setMaxHops] = useState(4);
  const [currentRoleSkills, setCurrentRoleSkills] = useState<
    SkillRequirement[]
  >([]);
  const [targetRoleSkills, setTargetRoleSkills] = useState<
    SkillRequirement[]
  >([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [skillsReloadToken, setSkillsReloadToken] = useState(0);
  const [paths, setPaths] = useState<CareerPathResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const searchController = useRef<AbortController | null>(null);
  const lastRequest = useRef<CareerPathRequest | null>(null);
  const loadedCurrentRoleId = useRef<string | null>(null);
  const resultsRegion = useRef<HTMLDivElement | null>(null);

  const clearResults = useCallback(() => {
    searchController.current?.abort();
    setPaths([]);
    setHasSearched(false);
    setSearchError(null);
    setIsSubmitting(false);
  }, []);

  const loadRoles = useCallback(async (signal?: AbortSignal) => {
    setRolesLoading(true);
    setRolesError(null);
    try {
      const loadedRoles = await fetchRoles(signal);
      setRoles(loadedRoles);
      setCurrentRoleId((current) => {
        if (current && loadedRoles.some((role) => role.id === current)) {
          return current;
        }
        return loadedRoles.some((role) => role.id === DEFAULT_CURRENT_ROLE)
          ? DEFAULT_CURRENT_ROLE
          : (loadedRoles[0]?.id ?? "");
      });
      setTargetRoleId((target) => {
        if (target && loadedRoles.some((role) => role.id === target)) {
          return target;
        }
        return loadedRoles.some((role) => role.id === DEFAULT_TARGET_ROLE)
          ? DEFAULT_TARGET_ROLE
          : (loadedRoles[1]?.id ?? "");
      });
    } catch (error) {
      if (!wasAborted(error)) {
        setRolesError(errorMessage(error));
      }
    } finally {
      if (!signal?.aborted) {
        setRolesLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchRoles(controller.signal)
      .then((loadedRoles) => {
        setRoles(loadedRoles);
        setCurrentRoleId(
          loadedRoles.some((role) => role.id === DEFAULT_CURRENT_ROLE)
            ? DEFAULT_CURRENT_ROLE
            : (loadedRoles[0]?.id ?? ""),
        );
        setTargetRoleId(
          loadedRoles.some((role) => role.id === DEFAULT_TARGET_ROLE)
            ? DEFAULT_TARGET_ROLE
            : (loadedRoles[1]?.id ?? ""),
        );
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
  }, []);

  useEffect(() => {
    if (!currentRoleId || !targetRoleId) {
      return;
    }

    const controller = new AbortController();

    async function loadSkills() {
      await Promise.resolve();
      if (controller.signal.aborted) {
        return;
      }
      setSkillsLoading(true);
      setSkillsError(null);
      setCurrentRoleSkills([]);
      setTargetRoleSkills([]);

      try {
        const [currentRole, targetRole] = await Promise.all([
          fetchRoleDetail(currentRoleId, controller.signal),
          fetchRoleDetail(targetRoleId, controller.signal),
        ]);
        setCurrentRoleSkills(currentRole.requiredSkills);
        setTargetRoleSkills(targetRole.requiredSkills);
        const availableIds = new Set(
          [...currentRole.requiredSkills, ...targetRole.requiredSkills].map(
            (skill) => skill.id,
          ),
        );
        const suggestedSkills =
          currentRoleId === DEFAULT_CURRENT_ROLE
            ? DEFAULT_DEMO_SKILLS.filter((skillId) => availableIds.has(skillId))
            : currentRole.requiredSkills
                .filter((skill) => skill.essential)
                .slice(0, 3)
                .map((skill) => skill.id);
        const currentRoleChanged =
          loadedCurrentRoleId.current !== currentRoleId;
        setSelectedSkillIds((selected) =>
          currentRoleChanged
            ? suggestedSkills
            : selected.filter((skillId) => availableIds.has(skillId)),
        );
        loadedCurrentRoleId.current = currentRoleId;
      } catch (error) {
        if (!wasAborted(error)) {
          setSkillsError(errorMessage(error));
          setCurrentRoleSkills([]);
          setTargetRoleSkills([]);
          setSelectedSkillIds([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSkillsLoading(false);
        }
      }
    }

    void loadSkills();

    return () => controller.abort();
  }, [currentRoleId, targetRoleId, skillsReloadToken]);

  useEffect(
    () => () => {
      searchController.current?.abort();
    },
    [],
  );

  const runSearch = useCallback(
    async (request: CareerPathRequest) => {
      searchController.current?.abort();
      const controller = new AbortController();
      searchController.current = controller;
      lastRequest.current = request;
      setIsSubmitting(true);
      setHasSearched(true);
      setSearchError(null);
      setPaths([]);

      try {
        const nextPaths = await fetchCareerPaths(request, controller.signal);
        setPaths(nextPaths);
      } catch (error) {
        if (!wasAborted(error)) {
          setSearchError(errorMessage(error));
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSubmitting(false);
          requestAnimationFrame(() => resultsRegion.current?.focus());
        }
      }
    },
    [],
  );

  function submitSearch() {
    if (!currentRoleId || !targetRoleId || currentRoleId === targetRoleId) {
      return;
    }
    void runSearch({
      currentRoleId,
      targetRoleId,
      skillIds: selectedSkillIds,
      maxHops,
    });
  }

  const selectedSkills = new Set(selectedSkillIds);
  const coversAllTargetSkills =
    targetRoleSkills.length > 0 &&
    targetRoleSkills.every((skill) => selectedSkills.has(skill.id));
  const targetRoleName =
    roles.find((role) => role.id === targetRoleId)?.name ?? "the target role";

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="grid items-start gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-8">
        <CareerPathForm
          roles={roles}
          rolesLoading={rolesLoading}
          rolesError={rolesError}
          currentRoleId={currentRoleId}
          targetRoleId={targetRoleId}
          maxHops={maxHops}
          currentRoleSkills={currentRoleSkills}
          targetRoleSkills={targetRoleSkills}
          selectedSkillIds={selectedSkillIds}
          skillsLoading={skillsLoading}
          skillsError={skillsError}
          isSubmitting={isSubmitting}
          onCurrentRoleChange={(roleId) => {
            clearResults();
            setSkillsLoading(Boolean(roleId));
            setSkillsError(null);
            setCurrentRoleSkills([]);
            setTargetRoleSkills([]);
            setSelectedSkillIds([]);
            setCurrentRoleId(roleId);
          }}
          onTargetRoleChange={(roleId) => {
            clearResults();
            setSkillsLoading(Boolean(currentRoleId && roleId));
            setSkillsError(null);
            setTargetRoleSkills([]);
            setTargetRoleId(roleId);
          }}
          onMaxHopsChange={(nextMaxHops) => {
            clearResults();
            setMaxHops(nextMaxHops);
          }}
          onToggleSkill={(skillId) => {
            clearResults();
            setSelectedSkillIds((selected) =>
              selected.includes(skillId)
                ? selected.filter((id) => id !== skillId)
                : [...selected, skillId],
            );
          }}
          onSwapRoles={() => {
            clearResults();
            setSkillsLoading(Boolean(targetRoleId));
            setSkillsError(null);
            setCurrentRoleSkills([]);
            setTargetRoleSkills([]);
            setSelectedSkillIds([]);
            setCurrentRoleId(targetRoleId);
            setTargetRoleId(currentRoleId);
          }}
          onRetryRoles={() => void loadRoles()}
          onRetrySkills={() => setSkillsReloadToken((token) => token + 1)}
          onSubmit={submitSearch}
        />

        <div
          ref={resultsRegion}
          tabIndex={-1}
          className="min-w-0 scroll-mt-6 outline-none"
          aria-live="polite"
        >
          {isSubmitting ? <CareerPathLoadingState /> : null}
          {!isSubmitting && searchError ? (
            <CareerPathErrorState
              message={searchError}
              onRetry={() => {
                if (lastRequest.current) {
                  void runSearch(lastRequest.current);
                }
              }}
            />
          ) : null}
          {!isSubmitting && !searchError && hasSearched && paths.length === 0 ? (
            <CareerPathEmptyState />
          ) : null}
          {!isSubmitting && !searchError && paths.length > 0 ? (
            <CareerPathResults
              paths={paths}
              coversAllTargetSkills={coversAllTargetSkills}
              targetRoleName={targetRoleName}
            />
          ) : null}
          {!isSubmitting && !searchError && !hasSearched ? (
            <CareerPathInitialState />
          ) : null}
        </div>
      </div>
    </section>
  );
}
