const importanceLabels: Record<number, string> = {
  1: "Low priority",
  2: "Lower priority",
  3: "Medium priority",
  4: "High priority",
  5: "Top priority",
};

export function skillImportanceLabel(importance: number): string {
  return importanceLabels[importance] ?? "Unrated priority";
}
