/**
 * Map tag names to Lucide icon component names.
 * Exact Lucide name matches work automatically.
 * This map handles tags that don't match a Lucide icon name directly.
 */
export const TAG_ICON_MAP: Record<string, string> = {
	// Categories (also in categories.ts, but included here for completeness)
	bug: 'Bug',
	feature: 'Sparkles',
	improvement: 'Wrench',
	epic: 'Rocket',
	research: 'Search',
	chore: 'Settings',

	// Priority
	low: 'ArrowDown',
	medium: 'Minus',
	high: 'ArrowUp',
	urgent: 'AlertTriangle',
	blocker: 'OctagonAlert',

	// Resolution
	dropped: 'CircleOff',
	deferred: 'Clock',
	rejected: 'XCircle',
	cancelled: 'Ban',
	wontfix: 'ShieldOff',
	duplicate: 'Copy',

	// Common tags → Lucide icon names
	'brain-ui': 'Monitor',
	ux: 'Palette',
	styling: 'Paintbrush',
	search: 'Search',
	images: 'Images',
	filters: 'Filter',
	browse: 'FolderOpen',
	progress: 'BarChart3',
	routing: 'Route',
	attachments: 'Paperclip',
	brain: 'Brain',
	api: 'Plug',
	tags: 'Tags',
	sveltekit: 'Code',
	frontend: 'Layout',
	workflow: 'Workflow'
};
