export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent' | 'blocker';

const PRIORITY_LEVELS: Set<string> = new Set(['low', 'medium', 'high', 'urgent', 'blocker']);

/** Extract the priority level from a tags array, or undefined if none. */
export function extractPriority(tags: string[]): PriorityLevel | undefined {
	for (const tag of tags) {
		if (PRIORITY_LEVELS.has(tag)) return tag as PriorityLevel;
	}
	return undefined;
}

/** Return tags with priority tags filtered out. */
export function tagsWithoutPriority(tags: string[]): string[] {
	return tags.filter((t) => !PRIORITY_LEVELS.has(t));
}
