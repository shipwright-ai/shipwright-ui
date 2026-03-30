<script lang="ts">
	import type { Progress } from '$lib/brain';

	let { progress }: { progress: Progress } = $props();
</script>

<span
	class="shrink-0 text-xs tabular-nums"
	class:text-brain-green={progress.status === 'done'}
	class:text-amber-500={progress.status === 'in-progress'}
	class:text-brain-muted={progress.status === 'not-started'}
>
	{progress.status === 'done' ? 'done' : `${progress.checked}/${progress.total}`}
</span>
