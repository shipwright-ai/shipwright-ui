<script lang="ts">
	import { CATEGORIES, type CategoryKey } from '$lib/categories';

	let { category }: { category: CategoryKey } = $props();

	const cat = $derived(CATEGORIES[category]);
</script>

<span class={`rounded border px-1.5 py-0.5 text-xs ${cat.color} ${cat.bg}`}>
	{cat.label}
</span>
