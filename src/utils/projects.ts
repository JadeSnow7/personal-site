export const PROJECT_ORDER = ['forge-studio', 'agent-harness', 'ai-teaching-platform'];

export function projectPriority(id: string): number {
  const index = PROJECT_ORDER.indexOf(id);
  return index === -1 ? PROJECT_ORDER.length : index;
}
