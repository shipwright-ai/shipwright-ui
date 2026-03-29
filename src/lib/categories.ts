/** Category detection from tags and title prefix stripping */

export const CATEGORIES = {
	bug: { label: 'Bug', icon: 'bug', color: 'text-red-400 border-red-400', bg: 'bg-red-400/10' },
	feature: {
		label: 'Feature',
		icon: 'sparkles',
		color: 'text-blue-400 border-blue-400',
		bg: 'bg-blue-400/10'
	},
	improvement: {
		label: 'Improvement',
		icon: 'wrench',
		color: 'text-green-400 border-green-400',
		bg: 'bg-green-400/10'
	},
	epic: {
		label: 'Epic',
		icon: 'rocket',
		color: 'text-purple-400 border-purple-400',
		bg: 'bg-purple-400/10'
	},
	research: {
		label: 'Research',
		icon: 'search',
		color: 'text-cyan-400 border-cyan-400',
		bg: 'bg-cyan-400/10'
	},
	chore: {
		label: 'Chore',
		icon: 'settings',
		color: 'text-gray-400 border-gray-400',
		bg: 'bg-gray-400/10'
	}
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

/** Find category from tags array */
export function detectCategory(tags: string[] | undefined): CategoryKey | null {
	if (!tags) return null;
	for (const tag of tags) {
		if (CATEGORY_KEYS.includes(tag as CategoryKey)) return tag as CategoryKey;
	}
	return null;
}
