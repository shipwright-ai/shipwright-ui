<script lang="ts">
	import { resolve } from '$app/paths';
	import { detectCategory } from '$lib/categories';
	import type { MemorySummary, Progress } from '$lib/brain';
	import { extractPriority, tagsWithoutPriority } from '$lib/priority';
	import { extractResolution, tagsWithoutResolution } from '$lib/resolution';
	import CategoryBadge from './CategoryBadge.svelte';
	import PriorityBadge from './PriorityBadge.svelte';
	import ResolutionBadge from './ResolutionBadge.svelte';
	import ProgressBadge from './ProgressBadge.svelte';

	interface Props {
		memory: MemorySummary;
		showKind?: boolean;
		showTags?: boolean;
		activeTags?: string[];
		onToggleTag?: (tag: string) => void;
		deleted?: boolean;
		dimDone?: boolean;
	}

	let {
		memory,
		showKind = false,
		showTags = false,
		activeTags = [],
		onToggleTag,
		deleted = false,
		dimDone = true
	}: Props = $props();

	const category = $derived(detectCategory(memory.tags));
	const priority = $derived(extractPriority(memory.tags));
	const resolution = $derived(extractResolution(memory.tags));
	const displayTags = $derived(tagsWithoutResolution(tagsWithoutPriority(memory.tags)));
	const progress: Progress | undefined = $derived(memory.progress);
	const isDone = $derived(progress?.status === 'done');
	const isInProgress = $derived(progress?.status === 'in-progress');
	const isResolved = $derived(!!resolution);
</script>

<a
	href={resolve('/memory/[...path]', { path: memory.memory_file })}
	class="block overflow-hidden rounded border transition-colors {deleted
		? 'border-brain-red/40 bg-brain-red/5 opacity-70'
		: isResolved
			? 'border-brain-border/30 bg-brain-surface/30 opacity-50 hover:border-brain-accent hover:opacity-70'
			: isDone && dimDone
				? 'border-brain-border/50 bg-brain-surface/50 opacity-60 hover:border-brain-accent hover:opacity-80'
				: isDone
					? 'border-brain-border/50 bg-brain-surface/50 hover:border-brain-accent'
					: 'border-brain-border bg-brain-surface hover:border-brain-accent'}"
>
	{#if progress && !deleted && !isDone && !isResolved}
		{@const pct = progress.total > 0 ? (progress.checked / progress.total) * 100 : 0}
		<div class="h-0.5 w-full bg-brain-border/30">
			<div
				class="h-full transition-all {isDone
					? 'bg-brain-green'
					: isInProgress
						? 'bg-amber-500'
						: 'bg-brain-muted/40'}"
				style="width: {pct}%"
			></div>
		</div>
	{/if}
	<div class="p-3">
		{#if deleted || (showKind && memory.kind) || (category && !deleted) || priority || resolution || progress}
			<div class="flex items-center gap-1.5 text-xs">
				{#if deleted}
					<span class="rounded bg-brain-red/10 px-1.5 py-0.5 font-medium text-brain-red"
						>deleted</span
					>
				{/if}
				{#if progress}
					<ProgressBadge {progress} />
				{/if}
				{#if showKind && memory.kind && !deleted}
					<span class="rounded bg-brain-bg px-1.5 py-0.5 text-brain-accent">{memory.kind}</span>
				{/if}
				{#if category && !deleted}
					<CategoryBadge {category} />
				{/if}
				{#if priority}
					<PriorityBadge {priority} />
				{/if}
				{#if resolution}
					<ResolutionBadge {resolution} />
				{/if}
			</div>
		{/if}
		<div class="mt-1 flex items-start gap-2">
			<div
				class="min-w-0 flex-1 text-sm font-medium {deleted ? 'text-brain-muted line-through' : ''}"
			>
				{memory.title ?? memory.memory_file}
			</div>
		</div>
		{#if memory.summary}
			<div class="card-compact-summary mt-1 text-xs text-brain-muted">{memory.summary}</div>
		{/if}
		{#if showTags && displayTags.length > 0}
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each displayTags as tag (tag)}
					<button
						onclick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onToggleTag?.(tag);
						}}
						class="cursor-pointer px-0.5 text-xs transition-colors {activeTags.includes(tag)
							? 'text-brain-accent'
							: 'text-brain-muted hover:text-brain-accent'}">{tag}</button
					>
				{/each}
			</div>
		{/if}
		{#if memory.children > 0}
			<div class="mt-1 text-xs text-brain-muted">{memory.children} sub-memories</div>
		{/if}
	</div>
</a>
