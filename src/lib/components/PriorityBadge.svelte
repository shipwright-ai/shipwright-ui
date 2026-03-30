<script lang="ts">
	import type { PriorityLevel } from '$lib/priority';
	import { ArrowDown, Minus, ArrowUp, AlertTriangle, OctagonAlert } from 'lucide-svelte';

	let { priority }: { priority: PriorityLevel } = $props();

	const config: Record<PriorityLevel, { icon: typeof ArrowDown; color: string; bg: string }> = {
		low: { icon: ArrowDown, color: 'text-brain-muted', bg: 'bg-brain-muted/10' },
		medium: { icon: Minus, color: 'text-blue-400', bg: 'bg-blue-400/10' },
		high: { icon: ArrowUp, color: 'text-amber-400', bg: 'bg-amber-400/10' },
		urgent: { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-400/10' },
		blocker: { icon: OctagonAlert, color: 'text-red-400', bg: 'bg-red-400/10' }
	};

	const cfg = $derived(config[priority]);
</script>

<span
	class={`inline-flex items-center gap-1 rounded border border-current/20 px-1.5 py-0.5 text-xs ${cfg.color} ${cfg.bg}`}
>
	<cfg.icon size={12} />
	{priority}
</span>
