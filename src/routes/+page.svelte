<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		browseRoot,
		browseKind,
		searchMemories,
		type BrowseRootResponse,
		type MemorySummary,
		type Facets
	} from '$lib/brain';
	import MemoryCard from '$lib/components/MemoryCard.svelte';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { BrainCircuit } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let data = $state<BrowseRootResponse | null>(null);
	let error = $state<string | null>(null);
	let singleMemories = $state<Record<string, MemorySummary>>({});
	let kindFacets = $state<Record<string, Facets>>({});

	interface StatusSection {
		label: string;
		status: 'not-started' | 'in-progress' | 'done';
		memories: MemorySummary[];
		total: number;
	}
	let dashboard = $state<StatusSection[]>([]);

	onMount(async () => {
		try {
			data = await browseRoot();
			// Fetch single-memory kinds and dashboard in parallel
			const singles = data.kinds.filter((k) => (k.count ?? 0) === 1);
			const progressKinds = data.kinds.filter((k) => k.progress);
			const [kindResults, facetResults, ...statusResults] = await Promise.all([
				Promise.all(singles.map((k) => browseKind(k.kind))),
				Promise.all(progressKinds.map((k) => browseKind(k.kind))),
				...(['not-started', 'in-progress', 'done'] as const).map((status) =>
					searchMemories({ status, sort: 'modified', order: 'desc' })
				)
			]);
			const rec: Record<string, MemorySummary> = {};
			for (const result of kindResults) {
				if (result.memories.length > 0) {
					rec[result.kind] = result.memories[0];
				}
			}
			singleMemories = rec;
			const facetRec: Record<string, Facets> = {};
			for (const result of facetResults) {
				if (result.facets) facetRec[result.kind] = result.facets;
			}
			kindFacets = facetRec;
			const labels = ['Planned', 'In Progress', 'Done'];
			const statuses = ['not-started', 'in-progress', 'done'] as const;
			dashboard = statusResults.map((r, i) => ({
				label: labels[i],
				status: statuses[i],
				memories: r.memories.slice(0, 3),
				total: r.total
			}));
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to connect to Brain';
		}
	});
</script>

<div class="mx-auto max-w-4xl">
	{#if error}
		<div class="flex flex-col items-center py-12 text-center">
			<img src="/error-generic.svg" alt="Connection error" class="mb-6 h-48 w-auto" />
			<h2 class="mb-2 text-2xl font-semibold">Ship ran aground</h2>
			<p class="mb-2 text-brain-muted">Can't reach the Brain — is the server running?</p>
			<p class="mb-6 text-xs text-brain-muted/60">{error}</p>
			<button
				onclick={() => location.reload()}
				class="rounded bg-brain-accent px-4 py-2 text-sm text-white transition-colors hover:bg-brain-accent/80"
			>
				Try again
			</button>
		</div>
	{:else if !data}
		<Spinner />
	{:else}
		<!-- Hero -->
		{@const totalMemories = data.kinds.reduce((sum, k) => sum + (k.totalCount ?? k.count ?? 0), 0)}
		<div class="mb-8 flex flex-col items-center">
			<BrainCircuit class="mb-4 h-24 w-24 text-brain-accent" strokeWidth={1.2} />
			<h2 class="text-xl font-semibold">Memories</h2>
			<span class="text-sm text-brain-muted">{totalMemories} total</span>
		</div>

		{#if data.kinds.length > 0}
			<div class="space-y-2">
				{#each [...data.kinds].sort((a, b) => (b.progress ? 1 : 0) - (a.progress ? 1 : 0)) as kind (kind.kind)}
					{@const memory = singleMemories[kind.kind]}
					{@const isSingle = (kind.count ?? 0) === 1 && memory}
					{#if isSingle}
						<a
							href={resolve('/memory/[...path]', { path: memory.memory_file })}
							class="block overflow-hidden rounded border border-brain-border bg-brain-surface transition-colors hover:border-brain-accent"
						>
							{#if kind.progress && kind.progress.status !== 'done'}
								{@const pct =
									kind.progress.total > 0 ? (kind.progress.checked / kind.progress.total) * 100 : 0}
								<div class="h-0.5 w-full bg-brain-border/30">
									<div class="h-full bg-amber-500 transition-all" style="width: {pct}%"></div>
								</div>
							{/if}
							<div class="flex items-center gap-2 p-4">
								<span class="text-xs text-brain-muted capitalize">{kind.kind}</span>
								<span class="text-sm font-medium">{memory.title}</span>
								{#if memory.children > 0}
									<span class="text-xs text-brain-muted/60">{memory.children} sub-memories</span>
								{/if}
								{#if kind.progress}
									<ProgressBadge progress={kind.progress} />
								{/if}
							</div>
						</a>
					{:else}
						<a
							href={resolve('/browse/[...path]', { path: kind.kind })}
							class="block overflow-hidden rounded border border-brain-border bg-brain-surface transition-colors hover:border-brain-accent"
						>
							{#if kind.progress && kind.progress.status !== 'done'}
								{@const pct =
									kind.progress.total > 0 ? (kind.progress.checked / kind.progress.total) * 100 : 0}
								<div class="h-0.5 w-full bg-brain-border/30">
									<div class="h-full bg-amber-500 transition-all" style="width: {pct}%"></div>
								</div>
							{/if}
							<div class="flex items-center gap-2 p-4">
								<span class="text-xs text-brain-muted capitalize">{kind.kind}</span>
								{#if kind.count}
									<span class="text-sm font-medium">{kind.count} memories</span>
								{/if}
								{#if kind.totalCount && kind.totalCount > (kind.count ?? 0)}
									<span class="text-xs text-brain-muted/60"
										>+{kind.totalCount - (kind.count ?? 0)} nested</span
									>
								{/if}
								<span class="flex-1"></span>
								{#if kindFacets[kind.kind]}
									<span class="flex items-center gap-2 text-xs">
										{#if kind.progress}
											<span class="text-brain-muted/60"
												>{kind.progress.checked}/{kind.progress.total}</span
											>
										{/if}
										{#if kindFacets[kind.kind].status['not-started'] > 0}
											<span class="text-brain-muted"
												>{kindFacets[kind.kind].status['not-started']} planned</span
											>
										{/if}
										{#if kindFacets[kind.kind].status['in-progress'] > 0}
											<span class="text-amber-500"
												>{kindFacets[kind.kind].status['in-progress']} active</span
											>
										{/if}
										{#if kindFacets[kind.kind].status.done > 0}
											<span class="text-brain-green">{kindFacets[kind.kind].status.done} done</span>
										{/if}
									</span>
								{:else if kind.progress}
									<ProgressBadge progress={kind.progress} />
								{/if}
							</div>
						</a>
					{/if}
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center py-12 text-center">
				<img src="/error-404.svg" alt="Empty" class="mb-6 h-40 w-auto opacity-60" />
				<p class="text-lg font-medium text-brain-muted">Brain is empty</p>
				<p class="mt-1 text-sm text-brain-muted/60">No memories yet — start creating!</p>
			</div>
		{/if}

		<!-- Dashboard: recent memories by status -->
		{#if dashboard.some((s) => s.total > 0)}
			<div class="mt-10">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-xl font-semibold">Recent activity</h2>
					<a href={resolve('/board')} class="text-xs text-brain-accent hover:text-brain-accent/80">
						see full board &rarr;
					</a>
				</div>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
					{#each dashboard as section (section.status)}
						{#if section.total > 0}
							<div class="card-container">
								<div class="mb-2">
									<h3 class="text-sm font-medium text-brain-muted">
										{section.label}
										<span class="opacity-40">({section.total})</span>
									</h3>
								</div>
								<div class="space-y-2">
									{#each section.memories as mem (mem.memory_file)}
										<MemoryCard memory={mem} showKind />
									{/each}
									{#if section.total > 3}
										<a
											href="{resolve('/board')}?status={section.status}"
											class="block py-1 text-center text-xs text-brain-muted/60 hover:text-brain-accent"
										>
											+{section.total - 3} more
										</a>
									{/if}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
