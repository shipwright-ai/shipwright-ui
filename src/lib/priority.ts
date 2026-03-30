export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent' | 'blocker';

const PRIORITY_LEVELS: Set<string> = new Set(['low', 'medium', 'high', 'urgent', 'blocker']);

const PREFIX = 'priority/';

/** Resolve a tag to a priority level, supporting both "high" and "priority/high". */
function parsePriority(tag: string): PriorityLevel | undefined {
	if (PRIORITY_LEVELS.has(tag)) return tag as PriorityLevel;
	if (tag.startsWith(PREFIX)) {
		const level = tag.slice(PREFIX.length);
		if (PRIORITY_LEVELS.has(level)) return level as PriorityLevel;
	}
	return undefined;
}

/** Extract the priority level from a tags array, or undefined if none. */
export function extractPriority(tags: string[] | undefined | null): PriorityLevel | undefined {
	if (!tags) return undefined;
	for (const tag of tags) {
		const p = parsePriority(tag);
		if (p) return p;
	}
	return undefined;
}

/** Return tags with priority tags filtered out. */
export function tagsWithoutPriority(tags: string[] | undefined | null): string[] {
	if (!tags) return [];
	return tags.filter((t) => !parsePriority(t));
}
