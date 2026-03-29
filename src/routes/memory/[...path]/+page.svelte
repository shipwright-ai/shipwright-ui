<script lang="ts">
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getMemory, fileUrl, type MemoryDetail } from '$lib/brain';
	import { detectCategory } from '$lib/categories';
	import CategoryBadge from '$lib/components/CategoryBadge.svelte';
	import ProgressBadge from '$lib/components/ProgressBadge.svelte';
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
			// Rewrite relative paths to use Brain file API
			const memDir = file.substring(0, file.lastIndexOf('/'));
			const content = entry.content
				// Images: ![alt](relative-path)
				.replace(/!\[([^\]]*)\]\((?!https?:\/\/)([^)]+)\)/g, (_, alt, src) => {
					const resolved = src.startsWith('/') ? src : `${memDir}/${src}`;
					return `![${alt}](${fileUrl(resolved)})`;
				})
				// Non-image file links: [name](relative-path.ext)
				.replace(
					/(?<!!)\[([^\]]+)\]\((?!https?:\/\/)(?!#)([^)]+\.[a-z0-9]+)\)/gi,
					(_, text, href) => {
						const resolved = href.startsWith('/') ? href : `${memDir}/${href}`;
						const ext = href.split('.').pop()?.toLowerCase() ?? '';
						const icon = getFileIcon(ext);
						return `[${icon} ${text}](${fileUrl(resolved)})`;
					}
				);
			let parsed = await marked.parse(content);
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
	}}
/>

{#if lightboxSrc}
	<div
		class="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/90 p-8"
		onclick={() => (lightboxSrc = null)}
		role="dialog"
	>
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
		<div class="rounded border border-brain-red/30 bg-brain-red/10 p-4 text-sm text-brain-red">
			{error}
		</div>
	{:else if !entry}
		<p class="text-brain-muted">loading...</p>
	{:else}
		<!-- Breadcrumb -->
		<nav class="mb-6 flex items-center gap-1.5 text-sm text-brain-muted">
			<a href={resolve('/')} class="hover:text-brain-text">home</a>
			<span>/</span>
			<a href={resolve('/browse/[...path]', { path: entry.kind })} class="hover:text-brain-text"
				>{entry.kind}</a
			>
			<span>/</span>
			<span class="text-brain-text">{entry.title}</span>
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

		<!-- Refs -->
		{#if entry.refs.length > 0}
			<div class="mt-8 border-t border-brain-border pt-6">
				<h3 class="mb-3 text-sm font-semibold text-brain-muted">related memories</h3>
				<div class="space-y-2">
					{#each entry.refs as ref (ref)}
						{@const refSlug = ref.split('/').slice(-2, -1)[0]?.replace(/-/g, ' ') ?? ref}
						<a
							href={resolve('/memory/[...path]', { path: ref })}
							class="block rounded border border-brain-border bg-brain-surface p-3 text-sm transition-colors hover:border-brain-accent"
						>
							<span class="capitalize">{refSlug}</span>
							<span class="ml-2 text-xs text-brain-muted">{ref}</span>
						</a>
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
						<a
							href={resolve('/memory/[...path]', { path: child.memory_file })}
							class="block rounded border border-brain-border bg-brain-surface p-3 transition-colors hover:border-brain-accent"
						>
							<div class="flex items-center gap-2 text-sm font-medium">
								{child.title}
								{#if child.progress}
									<ProgressBadge progress={child.progress} />
								{/if}
							</div>
							{#if child.summary}
								<div class="mt-1 text-xs text-brain-muted">{child.summary}</div>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
