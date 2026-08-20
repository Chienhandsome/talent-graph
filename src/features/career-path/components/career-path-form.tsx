"use client";

import {
  ArrowLeftRight,
  Check,
  LoaderCircle,
  RefreshCw,
  Search,
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
import { cn } from "@/lib/utils";
import type { RoleSummary, SkillRequirement } from "@/types/role";

interface CareerPathFormProps {
  roles: RoleSummary[];
  rolesLoading: boolean;
  rolesError: string | null;
  currentRoleId: string;
  targetRoleId: string;
  maxHops: number;
  currentRoleSkills: SkillRequirement[];
  selectedSkillIds: string[];
  skillsLoading: boolean;
  skillsError: string | null;
  isSubmitting: boolean;
  onCurrentRoleChange(roleId: string): void;
  onTargetRoleChange(roleId: string): void;
  onMaxHopsChange(maxHops: number): void;
  onToggleSkill(skillId: string): void;
  onRetrySkills(): void;
  onSwapRoles(): void;
  onRetryRoles(): void;
  onSubmit(): void;
}

const hopOptions = [
  { value: "1", label: "1 transition" },
  { value: "2", label: "Up to 2 transitions" },
  { value: "3", label: "Up to 3 transitions" },
  { value: "4", label: "Up to 4 transitions" },
];

export function CareerPathForm({
  roles,
  rolesLoading,
  rolesError,
  currentRoleId,
  targetRoleId,
  maxHops,
  currentRoleSkills,
  selectedSkillIds,
  skillsLoading,
  skillsError,
  isSubmitting,
  onCurrentRoleChange,
  onTargetRoleChange,
  onMaxHopsChange,
  onToggleSkill,
  onRetrySkills,
  onSwapRoles,
  onRetryRoles,
  onSubmit,
}: CareerPathFormProps) {
  const roleItems = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));
  const selectedSkills = new Set(selectedSkillIds);
  const canSubmit =
    Boolean(currentRoleId && targetRoleId) &&
    currentRoleId !== targetRoleId &&
    !rolesLoading &&
    !rolesError &&
    !skillsLoading &&
    !isSubmitting;

  return (
    <Card className="border-0 bg-white shadow-[0_18px_55px_-35px_rgba(15,23,42,.45)] ring-slate-200 lg:sticky lg:top-6">
      <CardHeader className="border-b border-slate-100 pb-5">
        <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-slate-950 text-white">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg">Build your path</CardTitle>
        <CardDescription className="leading-6">
          Tell us your starting point and choose the skills you already use.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {rolesError ? (
          <Alert variant="destructive" className="mb-5 pr-24">
            <AlertTitle>Roles could not be loaded</AlertTitle>
            <AlertDescription>{rolesError}</AlertDescription>
            <AlertAction>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onRetryRoles}
              >
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
          <div className="relative space-y-4">
            {rolesLoading ? (
              <>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-11 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </>
            ) : (
              <>
                <Select
                  items={roleItems}
                  value={currentRoleId || null}
                  onValueChange={(value) => onCurrentRoleChange(value ?? "")}
                >
                  <label
                    htmlFor="current-role"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    Current role
                  </label>
                  <SelectTrigger
                    id="current-role"
                    className="h-11 w-full border-slate-200 bg-white px-3 text-left hover:bg-slate-50"
                  >
                    <SelectValue placeholder="Choose your current role" />
                  </SelectTrigger>
                  <SelectContent
                    align="start"
                    alignItemWithTrigger={false}
                    className="max-h-72"
                  >
                    {roles.map((role) => (
                      <SelectItem
                        key={role.id}
                        value={role.id}
                        disabled={role.id === targetRoleId}
                      >
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

                <div className="absolute top-[72px] right-3 z-10 flex justify-center">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    aria-label="Swap current and target roles"
                    title="Swap roles"
                    disabled={!currentRoleId || !targetRoleId || skillsLoading}
                    onClick={onSwapRoles}
                    className="rounded-full bg-white shadow-sm"
                  >
                    <ArrowLeftRight aria-hidden="true" />
                  </Button>
                </div>

                <Select
                  items={roleItems}
                  value={targetRoleId || null}
                  onValueChange={(value) => onTargetRoleChange(value ?? "")}
                >
                  <label
                    htmlFor="target-role"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    Target role
                  </label>
                  <SelectTrigger
                    id="target-role"
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
                      <SelectItem
                        key={role.id}
                        value={role.id}
                        disabled={role.id === currentRoleId}
                      >
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
              </>
            )}
          </div>

          <fieldset>
            <div className="flex items-start justify-between gap-4">
              <div>
                <legend className="text-sm font-medium text-slate-800">
                  Skills you already have
                </legend>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Based on your current role. Select everything you can use
                  confidently.
                </p>
              </div>
              <span
                className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                aria-live="polite"
              >
                {selectedSkillIds.length} selected
              </span>
            </div>

            <div className="mt-3 flex min-h-12 flex-wrap gap-2">
              {skillsLoading ? (
                Array.from({ length: 6 }, (_, index) => (
                  <Skeleton
                    key={index}
                    className={cn("h-8", index % 2 === 0 ? "w-24" : "w-32")}
                  />
                ))
              ) : skillsError ? (
                <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  <span>{skillsError}</span>
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={onRetrySkills}
                  >
                    Retry
                  </Button>
                </div>
              ) : currentRoleSkills.length > 0 ? (
                currentRoleSkills.map((skill) => {
                  const selected = selectedSkills.has(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onToggleSkill(skill.id)}
                      className={cn(
                        "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
                        selected
                          ? "border-emerald-700 bg-emerald-700 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950",
                      )}
                    >
                      {selected ? <Check className="size-3" aria-hidden="true" /> : null}
                      {skill.name}
                    </button>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">
                  Choose a current role to load its common skills.
                </p>
              )}
            </div>
          </fieldset>

          <Select
            items={hopOptions}
            value={String(maxHops)}
            onValueChange={(value) => onMaxHopsChange(Number(value ?? 4))}
          >
            <label
              htmlFor="max-hops"
              className="mb-2 block text-sm font-medium text-slate-800"
            >
              Maximum path length
            </label>
            <SelectTrigger
              id="max-hops"
              className="h-11 w-full border-slate-200 bg-white px-3 hover:bg-slate-50"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {hopOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentRoleId && targetRoleId && currentRoleId === targetRoleId ? (
            <p className="text-sm text-amber-700" role="status">
              Current and target roles must be different.
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={!canSubmit}
            className="h-11 w-full bg-slate-950 text-white shadow-sm hover:bg-slate-800"
          >
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" aria-hidden="true" />
            ) : (
              <Search aria-hidden="true" />
            )}
            {isSubmitting ? "Finding your paths…" : "Find career paths"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
