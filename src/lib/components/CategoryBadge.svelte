<script lang="ts">
	import { CATEGORIES, type CategoryKey } from '$lib/categories';
	import { Bug, Sparkles, Wrench, Rocket, Search, Settings } from 'lucide-svelte';

	let { category }: { category: CategoryKey } = $props();

	const cat = $derived(CATEGORIES[category]);

	const icons = {
		bug: Bug,
		sparkles: Sparkles,
		wrench: Wrench,
		rocket: Rocket,
		search: Search,
		settings: Settings
	} as const;

	const IconComponent = $derived(icons[cat.icon]);
</script>

<span
	class={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-xs ${cat.color} ${cat.bg}`}
>
	<IconComponent size={12} />
	{cat.label}
</span>
