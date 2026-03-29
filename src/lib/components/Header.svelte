<script lang="ts">
	import { checkConnection, setBrainUrl, resetBrainUrl } from '$lib/brain';
	import { onMount } from 'svelte';

	let connected = $state(false);
	let showPopover = $state(false);
	let urlInput = $state(localStorage.getItem('brain-url') || 'http://localhost:3111');

	onMount(() => {
		check();
		const interval = setInterval(check, 10000);
		return () => clearInterval(interval);
	});

	async function check() {
		connected = await checkConnection();
	}

	function save() {
		const trimmed = urlInput.trim().replace(/\/+$/, '');
		if (trimmed && trimmed !== 'http://localhost:3111') {
			setBrainUrl(trimmed);
		} else {
			resetBrainUrl();
		}
		showPopover = false;
		check();
	}
</script>

<header
	class="flex items-center justify-between border-b border-brain-border bg-brain-surface px-4 py-3"
>
	<div class="flex items-center gap-3">
		<h1 class="text-lg font-semibold tracking-tight">shipwright brain</h1>
	</div>

	<div class="relative">
		<button
			class="flex items-center gap-2 text-sm text-brain-muted transition-colors hover:text-brain-text"
			onclick={() => (showPopover = !showPopover)}
		>
			<span
				class="inline-block h-2.5 w-2.5 rounded-full {connected
					? 'bg-brain-green'
					: 'bg-brain-red'}"
			></span>
			{connected ? 'connected' : 'disconnected'}
		</button>

		{#if showPopover}
			<div
				class="absolute top-full right-0 z-50 mt-2 w-80 rounded-md border border-brain-border bg-brain-surface p-4 shadow-lg"
			>
				<label class="mb-1 block text-xs text-brain-muted" for="brain-url-input">Brain URL</label>
				<input
					id="brain-url-input"
					type="text"
					bind:value={urlInput}
					class="w-full rounded border border-brain-border bg-brain-bg px-2 py-1.5 text-sm text-brain-text focus:border-brain-accent focus:outline-none"
					onkeydown={(e) => e.key === 'Enter' && save()}
				/>
				<div class="mt-2 flex justify-end gap-2">
					<button
						class="text-xs text-brain-muted hover:text-brain-text"
						onclick={() => (showPopover = false)}
					>
						cancel
					</button>
					<button
						class="rounded bg-brain-accent px-2 py-1 text-xs font-medium text-black hover:opacity-90"
						onclick={save}
					>
						save
					</button>
				</div>
			</div>
		{/if}
	</div>
</header>
