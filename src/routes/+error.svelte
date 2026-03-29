<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';

	const status = $derived($page.status);
	const message = $derived($page.error?.message ?? 'Something went wrong');

	const illustration = $derived(status === 404 ? '/error-404.svg' : '/error-500.svg');
	const headline = $derived(
		status === 404 ? 'Lost at sea' : status === 500 ? 'Ship on fire' : 'Ran aground'
	);
	const subtitle = $derived(
		status === 404
			? 'This page has sailed beyond the edge of the map.'
			: status === 500
				? "The engine room exploded. We're working on it."
				: message
	);
</script>

<svelte:head>
	<title>{status} — {headline} | shipwright brain</title>
</svelte:head>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
	<img src={illustration} alt="{status} error" class="mb-8 h-52 w-auto" />
	<p class="mb-2 text-6xl font-bold text-brain-muted/40">{status}</p>
	<h1 class="mb-2 text-2xl font-semibold">{headline}</h1>
	<p class="mb-8 max-w-md text-brain-muted">{subtitle}</p>
	<div class="flex gap-3">
		<button
			onclick={() => history.back()}
			class="rounded border border-brain-border bg-brain-surface px-4 py-2 text-sm transition-colors hover:border-brain-accent"
		>
			Go back
		</button>
		<a
			href={resolve('/')}
			class="rounded bg-brain-accent px-4 py-2 text-sm text-white transition-colors hover:bg-brain-accent/80"
		>
			Home
		</a>
	</div>
</div>
