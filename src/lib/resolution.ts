export type ResolutionLevel =
	| 'dropped'
	| 'deferred'
	| 'rejected'
	| 'cancelled'
	| 'wontfix'
	| 'duplicate';

const RESOLUTION_LEVELS: Set<string> = new Set([
	'dropped',
	'deferred',
	'rejected',
	'cancelled',
	'wontfix',
	'duplicate'
]);

const PREFIX = 'resolution/';

/** Resolve a tag to a resolution level, supporting both "dropped" and "resolution/dropped". */
function parseResolution(tag: string): ResolutionLevel | undefined {
	if (RESOLUTION_LEVELS.has(tag)) return tag as ResolutionLevel;
	if (tag.startsWith(PREFIX)) {
		const level = tag.slice(PREFIX.length);
		if (RESOLUTION_LEVELS.has(level)) return level as ResolutionLevel;
	}
	return undefined;
}

/** Extract the resolution level from a tags array, or undefined if none. */
export function extractResolution(tags: string[] | undefined | null): ResolutionLevel | undefined {
	if (!tags) return undefined;
	for (const tag of tags) {
		const r = parseResolution(tag);
		if (r) return r;
	}
	return undefined;
}

/** Return tags with resolution tags filtered out. */
export function tagsWithoutResolution(tags: string[] | undefined | null): string[] {
	if (!tags) return [];
	return tags.filter((t) => !parseResolution(t));
}
