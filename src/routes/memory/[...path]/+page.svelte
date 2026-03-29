<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getMemory, fileUrl, type MemoryDetail } from '$lib/brain';
	import { detectCategory } from '$lib/categories';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import MemoryCard from '$lib/components/MemoryCard.svelte';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { marked } from 'marked';
	import { markedHighlight } from 'marked-highlight';
	import hljs from 'highlight.js/lib/core';
	import javascript from 'highlight.js/lib/languages/javascript';
	import typescript from 'highlight.js/lib/languages/typescript';
	import python from 'highlight.js/lib/languages/python';
	import bash from 'highlight.js/lib/languages/bash';
	import json from 'highlight.js/lib/languages/json';
	import yaml from 'highlight.js/lib/languages/yaml';
	import markdown from 'highlight.js/lib/languages/markdown';
	import css from 'highlight.js/lib/languages/css';
	import xml from 'highlight.js/lib/languages/xml';
	import { onMount } from 'svelte';

	hljs.registerLanguage('javascript', javascript);
	hljs.registerLanguage('js', javascript);
	hljs.registerLanguage('typescript', typescript);
	hljs.registerLanguage('ts', typescript);
	hljs.registerLanguage('python', python);
	hljs.registerLanguage('bash', bash);
	hljs.registerLanguage('sh', bash);
	hljs.registerLanguage('json', json);
	hljs.registerLanguage('yaml', yaml);
	hljs.registerLanguage('yml', yaml);
	hljs.registerLanguage('markdown', markdown);
	hljs.registerLanguage('md', markdown);
	hljs.registerLanguage('css', css);
	hljs.registerLanguage('html', xml);
	hljs.registerLanguage('xml', xml);
	hljs.registerLanguage('svelte', xml);

	marked.use(
		markedHighlight({
			langPrefix: 'hljs language-',
			highlight(code, lang) {
				if (lang && hljs.getLanguage(lang)) {
					return hljs.highlight(code, { language: lang }).value;
				}
				return hljs.highlightAuto(code).value;
			}
		})
	);

	let entry = $state<MemoryDetail | null>(null);
	let error = $state<string | null>(null);
	let html = $state('');
	let lightboxSrc = $state<string | null>(null);
	let lightboxPdf = $state<string | null>(null);
	let allImages = $state<string[]>([]);
	let lightboxIndex = $derived(lightboxSrc ? allImages.indexOf(lightboxSrc) : -1);

	function lightboxNav(dir: -1 | 1) {
		if (allImages.length < 2 || lightboxIndex < 0) return;
		const next = (lightboxIndex + dir + allImages.length) % allImages.length;
		lightboxSrc = allImages[next];
	}

	const file = $derived($page.params.path ?? '');

	onMount(() => load());

	$effect(() => {
		void file;
		load();
	});

	function relativeTime(iso: string): string {
		const now = Date.now();
		const then = new Date(iso).getTime();
		const diff = now - then;
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return 'just now';
		if (mins < 60) return `${mins}m ago`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 30) return `${days}d ago`;
		const months = Math.floor(days / 30);
		return `${months}mo ago`;
	}

	function exactTime(iso: string): string {
		return new Date(iso).toLocaleString();
	}

	function getFileIcon(ext: string): string {
		const icons: Record<string, string> = {
			pdf: '📄',
			stl: '🧊',
			obj: '🧊',
			'3mf': '🧊',
			zip: '📦',
			tar: '📦',
			gz: '📦',
			csv: '📊',
			xlsx: '📊',
			xls: '📊',
			docx: '📝',
			doc: '📝',
			txt: '📝',
			log: '📋',
			json: '🔧',
			yaml: '🔧',
			yml: '🔧',
			svg: '🎨'
		};
		return icons[ext] || '📎';
	}

	async function load() {
		entry = null;
		error = null;
		html = '';
		try {
			entry = await getMemory(file);
			// Build contentLinks lookup by memory_file for rich rendering
			// Also index children so relative links to sub-memories get rich cards
			// eslint-disable-next-line svelte/prefer-svelte-reactivity -- local non-reactive lookup
			const linkMap = new Map<
				string,
				{
					title?: string;
					kind?: string;
					summary?: string;
					progress?: { checked: number; total: number };
					deleted?: boolean;
					memory_file: string;
				}
			>();
			for (const cl of entry.contentLinks ?? []) {
				linkMap.set(cl.memory_file, cl);
			}
			for (const child of entry.children) {
				linkMap.set(child.memory_file, {
					memory_file: child.memory_file,
					title: child.title,
					kind: child.kind,
					summary: child.summary,
					progress: child.progress
						? { checked: child.progress.checked, total: child.progress.total }
						: undefined,
					deleted: false
				});
			}
			// Rewrite relative paths to use Brain file API
			const memDir = file.substring(0, file.lastIndexOf('/'));
			const content = entry.content
				// Images: ![alt](relative-path)
				.replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, (_, alt, src) => {
					const resolved = src.startsWith('/') ? src : `${memDir}/${src}`;
					return `![${alt}](${fileUrl(resolved)})`;
				})
				// Non-image file links: [name](relative-path.ext) + optional trailing text
				// memory.md links use contentLinks for rich cards, other files become download links
				.replace(
					/(?<!!)\[([^\]]+)\]\((?!https?:\/\/)(?!#)([^)]+\.[a-z0-9]+)\)(.*?)$/gim,
					(match, text, href, trailing) => {
						if (href.endsWith('/memory.md') || href === 'memory.md') {
							const resolved = href.startsWith('/') ? href : `${memDir}/${href}`;
							// Look up contentLink by raw href or resolved full path
							const cl = linkMap.get(href) ?? linkMap.get(resolved);
							const memHref = `/memory/${resolved}`;
							if (cl && !cl.deleted && cl.title) {
								const prog = cl.progress
									? ` <span class="rounded border border-brain-border px-1 py-0.5 text-[10px] text-brain-muted">${cl.progress.checked}/${cl.progress.total}</span>`
									: '';
								return `MEMCARD_START<a href="${memHref}" class="not-prose inline-flex items-center gap-1.5 rounded border border-brain-border bg-brain-surface px-2 py-0.5 text-sm no-underline transition-colors hover:border-brain-accent"><span class="font-medium text-brain-text">${cl.title}</span>${prog}</a>MEMCARD_END${trailing ?? ''}`;
							}
							return `[${text}](${memHref})${trailing ?? ''}`;
						}
						const resolved = href.startsWith('/') ? href : `${memDir}/${href}`;
						const ext = href.split('.').pop()?.toLowerCase() ?? '';
						const icon = getFileIcon(ext);
						return `[${icon} ${text}](${fileUrl(resolved)})${trailing}`;
					}
				);
			let parsed = await marked.parse(content);
			// Unwrap memory card links from <p> tags
			parsed = parsed.replace(/<p>MEMCARD_START(.*?)MEMCARD_END<\/p>/gs, '$1');
			// Also handle inline memcards (not wrapped in their own <p>)
			parsed = parsed.replace(/MEMCARD_START/g, '').replace(/MEMCARD_END/g, '');
			// Wrap images in clickable figure with figcaption
			parsed = parsed.replace(
				/<img\s+src="([^"]+)"\s+alt="([^"]+)"[^>]*>/g,
				(match, src, alt) =>
					`<figure><a href="${src}" class="lightbox-trigger" data-lightbox="${src}">${match}</a><figcaption>${alt}</figcaption></figure>`
			);
			// Convert standalone file links (in their own <p>) to attachment cards
			parsed = parsed.replace(/<p><a href="([^"]+)">([^<]+)<\/a><\/p>/g, (_, url, text) => {
				const icon = text.split(' ')[0];
				const name = text.substring(text.indexOf(' ') + 1);
				const isPdf = url.toLowerCase().endsWith('.pdf') || name.toLowerCase().endsWith('.pdf');
				if (isPdf) {
					return `<div class="my-3 flex cursor-pointer items-center gap-3 rounded border border-brain-border bg-brain-surface p-3" data-pdf-lightbox="${url}">
							<span class="text-lg">${icon}</span>
							<span class="flex-1 text-sm text-brain-text">${name}</span>
							<span class="rounded bg-brain-bg px-2 py-1 text-xs text-brain-muted">click to preview</span>
							<a href="${url}" class="rounded bg-brain-bg px-2 py-1 text-xs text-brain-muted hover:text-brain-accent" download>⬇ download</a>
						</div>`;
				}
				return `<div class="my-3 flex items-center gap-3 rounded border border-brain-border bg-brain-surface p-3">
						<span class="text-lg">${icon}</span>
						<span class="flex-1 text-sm text-brain-text">${name}</span>
						<a href="${url}" class="rounded bg-brain-bg px-2 py-1 text-xs text-brain-muted hover:text-brain-accent" download>⬇ download</a>
					</div>`;
			});
			// Collect all image sources for lightbox navigation
			const imgSrcs: string[] = [];
			parsed.replace(/data-lightbox="([^"]+)"/g, (_, src) => {
				imgSrcs.push(src);
				return _;
			});
			allImages = imgSrcs;
			html = parsed;
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load memory';
		}
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			if (lightboxSrc) lightboxSrc = null;
			if (lightboxPdf) lightboxPdf = null;
		}
		if (lightboxSrc) {
			if (e.key === 'ArrowLeft') lightboxNav(-1);
			if (e.key === 'ArrowRight') lightboxNav(1);
		}
	}}
/>

{#if lightboxSrc}
	<div
		class="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-8"
		onclick={() => (lightboxSrc = null)}
		role="dialog"
	>
		{#if allImages.length > 1}
			<button
				class="absolute left-4 cursor-pointer rounded-full bg-white/10 p-2 text-2xl text-white/70 transition-colors hover:bg-white/20 hover:text-white"
				onclick={(e) => {
					e.stopPropagation();
					lightboxNav(-1);
				}}
			>
				&#8249;
			</button>
			<button
				class="absolute right-4 cursor-pointer rounded-full bg-white/10 p-2 text-2xl text-white/70 transition-colors hover:bg-white/20 hover:text-white"
				onclick={(e) => {
					e.stopPropagation();
					lightboxNav(1);
				}}
			>
				&#8250;
			</button>
			<span class="absolute bottom-4 text-sm text-white/50">
				{lightboxIndex + 1} / {allImages.length}
			</span>
		{/if}
		<img src={lightboxSrc} alt="" class="max-h-full max-w-full rounded" />
	</div>
{/if}

{#if lightboxPdf}
	<div class="fixed inset-0 z-50 flex flex-col bg-black/95 p-4" role="dialog">
		<div class="mb-2 flex justify-end">
			<button
				onclick={() => (lightboxPdf = null)}
				class="rounded bg-brain-surface px-3 py-1 text-sm text-brain-muted hover:text-brain-text"
			>
				close
			</button>
		</div>
		<iframe src={lightboxPdf} title="PDF preview" class="flex-1 rounded border border-brain-border"
		></iframe>
	</div>
{/if}

<div class="mx-auto max-w-4xl">
	{#if error}
		<div class="flex flex-col items-center py-12 text-center">
			{#if error.includes('404')}
				<img src="/error-404.svg" alt="Not found" class="mb-6 h-40 w-auto" />
				<p class="mb-2 text-lg font-medium text-brain-muted">Memory not found</p>
				<p class="mb-6 text-sm text-brain-muted/60">This memory may have been deleted or moved.</p>
			{:else}
				<img src="/error-generic.svg" alt="Error" class="mb-6 h-40 w-auto opacity-80" />
				<p class="mb-2 text-lg font-medium text-brain-muted">Something went wrong</p>
				<p class="mb-6 text-sm text-brain-muted/60">{error}</p>
			{/if}
			<a
				href={resolve('/')}
				class="rounded bg-brain-accent px-4 py-2 text-sm text-white transition-colors hover:bg-brain-accent/80"
			>
				Home
			</a>
		</div>
	{:else if !entry}
		<Spinner />
	{:else}
		<!-- Breadcrumb — derive hierarchy from memory_file path -->
		{@const pathParts = entry.memory_file
			.replace(/^docs\//, '')
			.replace(/\/memory\.md$/, '')
			.split('/')}
		<nav class="mb-6 flex items-center gap-1.5 text-sm text-brain-muted">
			<a href={resolve('/')} class="hover:text-brain-text">home</a>
			{#each pathParts as part, i (i)}
				<span>/</span>
				{#if i === 0}
					<a href={resolve('/browse/[...path]', { path: part })} class="hover:text-brain-text"
						>{part}</a
					>
				{:else if i === pathParts.length - 1}
					<span class="text-brain-text">{entry.title}</span>
				{:else}
					<a
						href={resolve('/memory/[...path]', {
							path: `docs/${pathParts.slice(0, i + 1).join('/')}/memory.md`
						})}
						class="hover:text-brain-text">{part.replace(/-/g, ' ')}</a
					>
				{/if}
			{/each}
		</nav>

		<!-- Header -->
		{@const entryCategory = detectCategory(entry.tags)}
		<div class="mb-6">
			<div class="flex items-center gap-3">
				{#if entryCategory}
					<CategoryBadge category={entryCategory} />
				{/if}
				<h1 class="text-2xl font-semibold">{entry.title}</h1>
				{#if entry.progress}
					<ProgressBadge progress={entry.progress} />
				{/if}
			</div>
			{#if entry.summary}
				<p class="mt-1 text-brain-muted">{entry.summary}</p>
			{/if}
			{#if entry.tags.length > 0}
				<div class="mt-3 flex flex-wrap items-center gap-1.5">
					{#each entry.tags as tag (tag)}
						<button
							onclick={() => {
								// eslint-disable-next-line svelte/no-navigation-without-resolve -- resolve() used, query params appended
								goto(`${resolve('/search')}?tags=${encodeURIComponent(tag)}`);
							}}
							class="rounded border border-brain-border bg-brain-bg px-1.5 py-0.5 text-xs text-brain-muted transition-colors hover:border-brain-accent hover:text-brain-accent"
							>{tag}</button
						>
					{/each}
				</div>
			{/if}
			<div class="mt-2 flex flex-wrap gap-4 text-xs text-brain-muted">
				{#if entry.at}
					<span
						>created {relativeTime(entry.at)}
						<span class="text-brain-muted/60">{exactTime(entry.at)}</span></span
					>
				{/if}
				{#if entry.modified}
					<span
						>modified {relativeTime(entry.modified)}
						<span class="text-brain-muted/60">{exactTime(entry.modified)}</span></span
					>
				{/if}
				{#if entry.by}
					<span>by {entry.by}</span>
				{/if}
			</div>
		</div>

		<!-- Content -->
		<article
			class="prose prose-sm max-w-none prose-invert"
			onclick={(e) => {
				const imgTrigger = (e.target as HTMLElement).closest('[data-lightbox]');
				if (imgTrigger) {
					e.preventDefault();
					lightboxSrc = imgTrigger.getAttribute('data-lightbox');
					return;
				}
				const pdfTrigger = (e.target as HTMLElement).closest('[data-pdf-lightbox]');
				if (pdfTrigger && !(e.target as HTMLElement).closest('a[download]')) {
					e.preventDefault();
					lightboxPdf = pdfTrigger.getAttribute('data-pdf-lightbox');
				}
			}}
		>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- rendering trusted markdown from Brain API -->
			{@html html}
		</article>

		<!-- Refs (exclude children and unresolved sub-paths that are children) -->
		{@const childPaths = new Set(entry.children.map((c) => c.memory_file))}
		{@const filteredRefs = entry.refs.filter(
			(r) =>
				!childPaths.has(r.memory_file) &&
				!Array.from(childPaths).some((cp) => cp.endsWith('/' + r.memory_file))
		)}
		{#if filteredRefs.length > 0}
			<div class="mt-8 border-t border-brain-border pt-6">
				<h3 class="mb-3 text-sm font-semibold text-brain-muted">related memories</h3>
				<div class="space-y-2">
					{#each filteredRefs as ref (ref.memory_file)}
						<MemoryCard memory={ref} showKind deleted={!ref.title} />
					{/each}
				</div>
			</div>
		{/if}

		<!-- Children -->
		{#if entry.children.length > 0}
			<div class="mt-8 border-t border-brain-border pt-6">
				<h3 class="mb-3 text-sm font-semibold text-brain-muted">sub-memories</h3>
				<div class="space-y-2">
					{#each entry.children as child (child.memory_file)}
						<MemoryCard memory={child} />
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
