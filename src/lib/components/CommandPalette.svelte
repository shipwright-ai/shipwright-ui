<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { searchMemories, type MemorySummary } from '$lib/brain';
	import { detectCategory } from '$lib/categories';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';

	let open = $state(false);
	let query = $state('');
	let results = $state<MemorySummary[]>([]);
	let selectedIndex = $state(0);
	let loading = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout>;
	let inputEl: HTMLInputElement;

	function show() {
		open = true;
		query = '';
		results = [];
		selectedIndex = 0;
		// Focus input after DOM update
		setTimeout(() => inputEl?.focus(), 10);
	}

	function hide() {
		open = false;
	}

	function handleGlobalKeydown(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			if (open) hide();
			else show();
		}
	}

	$effect(() => {
		const handler = () => {
			if (!open) show();
		};
		window.addEventListener('open-command-palette', handler);
		return () => window.removeEventListener('open-command-palette', handler);
	});

	function onInput() {
		clearTimeout(debounceTimer);
		if (!query.trim()) {
			results = [];
			return;
		}
		debounceTimer = setTimeout(async () => {
			loading = true;
			try {
				const data = await searchMemories({ query: query.trim() });
				results = data.memories;
				selectedIndex = 0;
			} catch {
				results = [];
			} finally {
				loading = false;
			}
		}, 200);
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, 0);
		} else if (e.key === 'Enter' && results[selectedIndex]) {
			e.preventDefault();
			navigate(results[selectedIndex].memory_file);
		} else if (e.key === 'Escape') {
			hide();
		}
	}

	function navigate(memoryFile: string) {
		hide();
		goto(resolve('/memory/[...path]', { path: memoryFile }));
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[20vh]"
		onclick={(e) => {
			if (e.target === e.currentTarget) hide();
		}}
		role="dialog"
	>
		<div class="w-full max-w-lg rounded-lg border border-brain-border bg-brain-surface shadow-2xl">
			<!-- Search input -->
			<div class="flex items-center gap-3 border-b border-brain-border px-4 py-3">
				<span class="text-brain-muted">🔍</span>
				<input
					bind:this={inputEl}
					type="text"
					bind:value={query}
					oninput={onInput}
					onkeydown={onKeydown}
					placeholder="Search memories..."
					class="flex-1 bg-transparent text-sm text-brain-text placeholder:text-brain-muted focus:outline-none"
				/>
				<kbd class="rounded bg-brain-bg px-1.5 py-0.5 text-xs text-brain-muted">esc</kbd>
			</div>

			<!-- Results -->
			{#if loading}
				<div class="p-4 text-center text-xs text-brain-muted">searching...</div>
			{:else if query && results.length === 0}
				<div class="p-4 text-center text-xs text-brain-muted">no results</div>
			{:else if results.length > 0}
				<div class="max-h-80 overflow-y-auto p-2">
					{#each results as result, i (result.memory_file)}
						{@const category = detectCategory(result.tags)}
						<button
							class="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors {i ===
							selectedIndex
								? 'bg-brain-accent/10 text-brain-text'
								: 'text-brain-muted hover:bg-brain-bg'}"
							onclick={() => navigate(result.memory_file)}
							onmouseenter={() => (selectedIndex = i)}
						>
							<span class="text-xs text-brain-muted">{result.kind}</span>
							{#if category}
								<CategoryBadge {category} />
							{/if}
							<span class="flex-1 truncate font-medium text-brain-text">{result.title}</span>
							{#if result.progress}
								<ProgressBadge progress={result.progress} />
							{/if}
						</button>
					{/each}
				</div>
			{:else}
				<div class="p-4 text-center text-xs text-brain-muted">
					Type to search across all memories
				</div>
			{/if}
		</div>
	</div>
{/if}
