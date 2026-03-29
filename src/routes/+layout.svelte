<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import CommandPalette from '$lib/components/CommandPalette.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<CommandPalette />

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="flex-1 p-6">
		{@render children()}
	</main>
</div>
