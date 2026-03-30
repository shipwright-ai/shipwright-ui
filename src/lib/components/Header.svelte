<script lang="ts">
	import { resolve } from '$app/paths';
	import { checkConnection, setBrainUrl, resetBrainUrl } from '$lib/brain';
	import { BrainCircuit, Sun, Moon, Monitor } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let connected = $state(false);
	let showPopover = $state(false);
	let urlInput = $state('http://localhost:3111');
	let theme = $state<'dark' | 'light' | 'system'>('dark');

	onMount(() => {
		urlInput = localStorage.getItem('brain-url') || 'http://localhost:3111';
		theme = (localStorage.getItem('brain-theme') as typeof theme) || 'dark';
		applyTheme();
		check();
		const interval = setInterval(check, 10000);
		return () => clearInterval(interval);
	});

	function applyTheme() {
		const root = document.documentElement;
		root.classList.remove('dark', 'light');
		if (theme !== 'system') root.classList.add(theme);
	}

	function cycleTheme() {
		const order: Array<typeof theme> = ['dark', 'system', 'light'];
		theme = order[(order.indexOf(theme) + 1) % order.length];
		localStorage.setItem('brain-theme', theme);
		applyTheme();
	}

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

	function openSearch() {
		window.dispatchEvent(new CustomEvent('open-command-palette'));
	}
</script>

<header
	class="flex items-center justify-between border-b border-brain-border bg-brain-surface px-4 py-3"
>
	<div class="flex items-center gap-4">
		<a href={resolve('/')} class="flex items-center gap-2 hover:opacity-80">
			<BrainCircuit class="h-6 w-6 text-brain-accent" />
			<h1 class="text-lg font-semibold tracking-tight">shipwright brain</h1>
		</a>
	</div>

	<div class="flex items-center gap-4">
		<!-- Search button — opens Cmd+K palette -->
		<button
			onclick={openSearch}
			class="hidden items-center gap-2 rounded border border-brain-border bg-brain-bg px-2.5 py-1 text-xs text-brain-muted transition-colors hover:border-brain-accent hover:text-brain-text sm:flex"
		>
			search
			<kbd class="rounded bg-brain-border/50 px-1 py-0.5 text-[10px]">⌘K</kbd>
		</button>

		<!-- Theme toggle -->
		<button
			onclick={cycleTheme}
			class="text-brain-muted transition-colors hover:text-brain-text"
			title="Theme: {theme}"
		>
			{#if theme === 'dark'}
				<Moon class="h-4 w-4" />
			{:else if theme === 'light'}
				<Sun class="h-4 w-4" />
			{:else}
				<Monitor class="h-4 w-4" />
			{/if}
		</button>

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
