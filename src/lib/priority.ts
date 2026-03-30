export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent' | 'blocker';

const PRIORITY_LEVELS: Set<string> = new Set(['low', 'medium', 'high', 'urgent', 'blocker']);

const PREFIX = 'priority/';

/** Extract the priority level from a tags array, or undefined if none. */
export function extractPriority(tags: string[]): PriorityLevel | undefined {
	for (const tag of tags) {
		if (tag.startsWith(PREFIX)) {
			const level = tag.slice(PREFIX.length);
			if (PRIORITY_LEVELS.has(level)) return level as PriorityLevel;
		}
	}
	return undefined;
}

/** Return tags with priority tags filtered out. */
export function tagsWithoutPriority(tags: string[]): string[] {
	return tags.filter((t) => !t.startsWith(PREFIX));
}
