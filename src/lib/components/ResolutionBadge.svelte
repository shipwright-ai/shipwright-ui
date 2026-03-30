<script lang="ts">
	import type { ResolutionLevel } from '$lib/resolution';
	import { CircleOff, Clock, XCircle, Ban, ShieldOff, Copy } from 'lucide-svelte';

	let { resolution }: { resolution: ResolutionLevel } = $props();

	const config: Record<ResolutionLevel, { icon: typeof CircleOff; color: string; bg: string }> = {
		dropped: { icon: CircleOff, color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
		deferred: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
		rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
		cancelled: { icon: Ban, color: 'text-orange-400', bg: 'bg-orange-400/10' },
		wontfix: { icon: ShieldOff, color: 'text-zinc-500', bg: 'bg-zinc-500/10' },
		duplicate: { icon: Copy, color: 'text-zinc-500', bg: 'bg-zinc-500/10' }
	};

	const cfg = $derived(config[resolution]);
</script>

<span class={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs ${cfg.color} ${cfg.bg}`}>
	<cfg.icon size={12} />
	{resolution}
</span>
