<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { checkConnection, setBrainUrl, resetBrainUrl } from '$lib/brain';
	import { onMount } from 'svelte';

	let connected = $state(false);
	let showPopover = $state(false);
	let urlInput = $state('http://localhost:3111');
	let searchQuery = $state('');

	let isSearchPage = $derived($page.url.pathname.startsWith('/search'));

	onMount(() => {
		urlInput = localStorage.getItem('brain-url') || 'http://localhost:3111';
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

	function submitSearch() {
		if (!searchQuery.trim()) return;
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- resolve() used, query params appended
		goto(`${resolve('/search')}?q=${encodeURIComponent(searchQuery.trim())}`);
		searchQuery = '';
	}
</script>

<header
	class="flex items-center justify-between border-b border-brain-border bg-brain-surface px-4 py-3"
>
	<div class="flex items-center gap-3">
		<a href={resolve('/')} class="flex items-center gap-2 hover:opacity-80">
			<span class="text-xl">🧠</span>
			<h1 class="text-lg font-semibold tracking-tight">shipwright brain</h1>
		</a>
	</div>

	<div class="flex items-center gap-4">
		<!-- Search input (hidden on search page) -->
		{#if !isSearchPage}
			<form
				onsubmit={(e) => {
					e.preventDefault();
					submitSearch();
				}}
				class="hidden sm:block"
			>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="search..."
					class="w-48 rounded border border-brain-border bg-brain-bg px-2.5 py-1 text-xs text-brain-text transition-all placeholder:text-brain-muted focus:w-64 focus:border-brain-accent focus:outline-none"
				/>
			</form>
		{/if}

		<!-- Connection status -->
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
	</div>
</header>
