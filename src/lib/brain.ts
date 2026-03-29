const DEFAULT_BRAIN_URL = 'http://localhost:3111';

function getBrainUrl(): string {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('brain-url') || DEFAULT_BRAIN_URL;
	}
	return DEFAULT_BRAIN_URL;
}

export function setBrainUrl(url: string): void {
	localStorage.setItem('brain-url', url);
}

export function resetBrainUrl(): void {
	localStorage.removeItem('brain-url');
}

export async function checkConnection(): Promise<boolean> {
	try {
		const res = await fetch(`${getBrainUrl()}/api/browse`, {
			signal: AbortSignal.timeout(3000)
		});
		return res.ok;
	} catch {
		return false;
	}
}

export async function browseRoot(): Promise<BrowseRootResponse> {
	const res = await fetch(`${getBrainUrl()}/api/browse`);
	if (!res.ok) throw new Error(`Brain API error: ${res.status}`);
	return res.json();
}

export async function browseKind(
	kind: string,
	opts?: { tags?: string[]; status?: string; limit?: number; offset?: number }
): Promise<BrowseKindResponse> {
	const url = new URL('/api/browse', getBrainUrl());
	url.searchParams.set('path', kind);
	if (opts?.tags?.length) url.searchParams.set('tags', opts.tags.join(','));
	if (opts?.status) url.searchParams.set('status', opts.status);
	if (opts?.limit) url.searchParams.set('limit', String(opts.limit));
	if (opts?.offset) url.searchParams.set('offset', String(opts.offset));
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Brain API error: ${res.status}`);
	return res.json();
}

export async function getMemory(file: string): Promise<MemoryDetail> {
	const url = new URL('/api/memory', getBrainUrl());
	url.searchParams.set('f', file);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Brain API error: ${res.status}`);
	return res.json();
}

export async function searchMemories(opts: {
	query?: string;
	tags?: string[];
	status?: 'not-started' | 'in-progress' | 'done';
}): Promise<SearchResponse> {
	const url = new URL('/api/search', getBrainUrl());
	if (opts.query) url.searchParams.set('q', opts.query);
	if (opts.tags?.length) url.searchParams.set('tags', opts.tags.join(','));
	if (opts.status) url.searchParams.set('status', opts.status);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Brain API error: ${res.status}`);
	return res.json();
}

export function fileUrl(path: string): string {
	return `${getBrainUrl()}/file?p=${encodeURIComponent(path)}`;
}

// Types matching actual Brain API responses

export interface KindEntry {
	kind: string;
	count?: number;
	progress?: Progress;
}

export interface BrowseRootResponse {
	level: 'root';
	kinds: KindEntry[];
}

export interface Progress {
	checked: number;
	total: number;
	status: 'not-started' | 'in-progress' | 'done';
}

export interface MemorySummary {
	memory_file: string;
	title: string;
	summary: string;
	kind: string;
	tags: string[];
	children: number;
	at: string;
	progress?: Progress;
}

export interface TagFacet {
	tag: string;
	count: number;
}

export interface Facets {
	tags: TagFacet[];
	status: {
		'not-started': number;
		'in-progress': number;
		done: number;
		'no-progress': number;
	};
}

export interface BrowseKindResponse {
	level: 'kind';
	kind: string;
	memories: MemorySummary[];
	total: number;
	hasMore: boolean;
	facets?: Facets;
}

export interface MemoryDetail {
	memory_file: string;
	title: string;
	summary: string;
	kind: string;
	tags: string[];
	refs: string[];
	by: string;
	at: string;
	content: string;
	children: MemorySummary[];
	progress?: Progress;
}

export interface SearchResponse {
	memories: MemorySummary[];
	total: number;
	hasMore: boolean;
	facets?: Facets;
}
