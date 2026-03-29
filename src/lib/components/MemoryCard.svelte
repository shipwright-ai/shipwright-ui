<script lang="ts">
	import { resolve } from '$app/paths';
	import { detectCategory } from '$lib/categories';
	import type { MemorySummary, Progress } from '$lib/brain';
	import CategoryBadge from './CategoryBadge.svelte';
	import ProgressBadge from './ProgressBadge.svelte';

	interface Props {
		memory: MemorySummary;
		showKind?: boolean;
		showTags?: boolean;
		activeTags?: string[];
		onToggleTag?: (tag: string) => void;
		deleted?: boolean;
	}

	let {
		memory,
		showKind = false,
		showTags = false,
		activeTags = [],
		onToggleTag,
		deleted = false
	}: Props = $props();

	const category = $derived(detectCategory(memory.tags));
	const progress: Progress | undefined = $derived(memory.progress);
	const isDone = $derived(progress?.status === 'done');
	const isInProgress = $derived(progress?.status === 'in-progress');
</script>

<a
	href={resolve('/memory/[...path]', { path: memory.memory_file })}
	class="block overflow-hidden rounded border transition-colors {deleted
		? 'border-brain-red/40 bg-brain-red/5 opacity-70'
		: isDone
			? 'border-brain-border/50 bg-brain-surface/50 opacity-60'
			: 'border-brain-border bg-brain-surface hover:border-brain-accent'}"
>
	{#if progress && !deleted}
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
		<div class="flex items-center gap-2 text-sm font-medium">
			{#if deleted}
				<span class="rounded bg-brain-red/15 px-1.5 py-0.5 text-xs font-medium text-brain-red"
					>deleted</span
				>
			{:else if showKind && memory.kind}
				<span class="rounded bg-brain-bg px-1.5 py-0.5 text-xs text-brain-accent"
					>{memory.kind}</span
				>
			{/if}
			{#if category && !deleted}
				<CategoryBadge {category} />
			{/if}
			<span class={deleted ? 'text-brain-muted line-through' : ''}>
				{memory.title ?? memory.memory_file}
			</span>
			{#if progress && !isDone}
				<ProgressBadge {progress} />
			{/if}
			{#if isDone}
				<span class="ml-auto text-xs text-brain-green">done</span>
			{/if}
		</div>
		{#if memory.summary}
			<div class="mt-1 text-xs text-brain-muted">{memory.summary}</div>
		{/if}
		{#if showTags && memory.tags?.length > 0}
			<div class="mt-2 flex gap-1.5">
				{#each memory.tags as tag (tag)}
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
