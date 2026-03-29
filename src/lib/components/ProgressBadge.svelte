<script lang="ts">
	import type { Progress } from '$lib/brain';

	let { progress }: { progress: Progress } = $props();
</script>

<span
	class="rounded border px-1.5 py-0.5 text-xs"
	class:border-brain-green={progress.status === 'done'}
	class:text-brain-green={progress.status === 'done'}
	class:border-amber-500={progress.status === 'in-progress'}
	class:text-amber-500={progress.status === 'in-progress'}
	class:border-brain-muted={progress.status === 'not-started'}
	class:text-brain-muted={progress.status === 'not-started'}
>
	{progress.status === 'done' ? 'DONE' : `${progress.checked}/${progress.total}`}
</span>
