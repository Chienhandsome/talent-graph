"use client";

import {
  Check,
  LoaderCircle,
  RefreshCw,
  ScanSearch,
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
import { skillImportanceLabel } from "@/lib/skill-importance";
import { cn } from "@/lib/utils";
import type { RoleSummary, SkillRequirement } from "@/types/role";

interface SkillGapFormProps {
  roles: RoleSummary[];
  rolesLoading: boolean;
  rolesError: string | null;
  targetRoleId: string;
  targetSkills: SkillRequirement[];
  selectedSkillIds: string[];
  skillsLoading: boolean;
  skillsError: string | null;
  isSubmitting: boolean;
  onTargetRoleChange(roleId: string): void;
  onToggleSkill(skillId: string): void;
  onSelectAll(): void;
  onClearSkills(): void;
  onRetryRoles(): void;
  onRetrySkills(): void;
  onSubmit(): void;
}

export function SkillGapForm({
  roles,
  rolesLoading,
  rolesError,
  targetRoleId,
  targetSkills,
  selectedSkillIds,
  skillsLoading,
  skillsError,
  isSubmitting,
  onTargetRoleChange,
  onToggleSkill,
  onSelectAll,
  onClearSkills,
  onRetryRoles,
  onRetrySkills,
  onSubmit,
}: SkillGapFormProps) {
  const roleItems = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));
  const selectedSkills = new Set(selectedSkillIds);
  const canSubmit =
    Boolean(targetRoleId) &&
    !rolesLoading &&
    !rolesError &&
    !skillsLoading &&
    !skillsError &&
    !isSubmitting;

  return (
    <Card className="border-0 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.45)] ring-slate-200 lg:sticky lg:top-6">
      <CardHeader className="border-b border-slate-100 pb-5">
        <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-slate-950 text-white">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg">Set your baseline</CardTitle>
        <CardDescription className="leading-6">
          Choose a target role and mark the skills you can already use.
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
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full" />
            </div>
          ) : (
            <Select
              items={roleItems}
              value={targetRoleId || null}
              onValueChange={(value) => onTargetRoleChange(value ?? "")}
            >
              <label
                htmlFor="skill-gap-target-role"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Target role
              </label>
              <SelectTrigger
                id="skill-gap-target-role"
                className="h-11 w-full border-slate-200 bg-white px-3 text-left hover:bg-slate-50"
              >
                <SelectValue placeholder="Choose your target role" />
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="max-h-72"
              >
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

          <fieldset>
            <div className="flex items-start justify-between gap-4">
              <div>
                <legend className="text-sm font-medium text-slate-800">
                  Skills you already have
                </legend>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Only skills relevant to the selected target are shown.
                </p>
              </div>
              <span
                className="shrink-0 rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                aria-live="polite"
              >
                {selectedSkillIds.length}/{targetSkills.length}
              </span>
            </div>

            {!skillsLoading && !skillsError && targetSkills.length > 0 ? (
              <div className="mt-2 flex items-center gap-1">
                <Button type="button" size="xs" variant="ghost" onClick={onSelectAll}>
                  Select all
                </Button>
                <Button type="button" size="xs" variant="ghost" onClick={onClearSkills}>
                  Clear
                </Button>
              </div>
            ) : null}

            <div className="mt-3 flex max-h-[360px] min-h-24 flex-col gap-2 overflow-y-auto pr-1">
              {skillsLoading ? (
                Array.from({ length: 7 }, (_, index) => (
                  <Skeleton key={index} className="h-12 w-full shrink-0" />
                ))
              ) : skillsError ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  <span>{skillsError}</span>
                  <Button type="button" size="xs" variant="outline" onClick={onRetrySkills}>
                    Retry
                  </Button>
                </div>
              ) : targetSkills.length > 0 ? (
                targetSkills.map((skill) => {
                  const selected = selectedSkills.has(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onToggleSkill(skill.id)}
                      className={cn(
                        "flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
                        selected
                          ? "border-indigo-600 bg-indigo-50 text-indigo-950"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-md border",
                            selected
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : "border-slate-300 bg-white",
                          )}
                        >
                          {selected ? <Check className="size-3" aria-hidden="true" /> : null}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {skill.name}
                          </span>
                          <span className="block text-xs text-slate-500 capitalize">
                            {skill.requiredLevel} level
                          </span>
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-medium text-slate-500">
                        {skillImportanceLabel(skill.importance)}
                      </span>
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">
                  Choose a target role to load its required skills.
                </p>
              )}
            </div>
          </fieldset>

          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            className="h-11 w-full bg-slate-950 text-white shadow-sm hover:bg-slate-800"
          >
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <ScanSearch aria-hidden="true" />
            )}
            {isSubmitting ? "Analyzing your skills…" : "Analyze skill gap"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
