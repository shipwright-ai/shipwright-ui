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

export async function browse(path?: string): Promise<BrowseResponse> {
	const url = new URL('/api/browse', getBrainUrl());
	if (path) url.searchParams.set('path', path);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Brain API error: ${res.status}`);
	return res.json();
}

export async function getMemory(file: string): Promise<MemoryEntry> {
	const url = new URL('/api/memory', getBrainUrl());
	url.searchParams.set('f', file);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Brain API error: ${res.status}`);
	return res.json();
}

export async function search(query: string): Promise<SearchResult[]> {
	const url = new URL('/api/search', getBrainUrl());
	url.searchParams.set('q', query);
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Brain API error: ${res.status}`);
	return res.json();
}

export function fileUrl(path: string): string {
	return `${getBrainUrl()}/file?p=${encodeURIComponent(path)}`;
}

// Types
export interface BrowseEntry {
	title: string;
	summary: string;
	kind: string;
	tags: string[];
	memory_file: string;
}

export interface BrowseResponse {
	path: string;
	entries: BrowseEntry[];
	children: string[];
}

export interface MemoryEntry extends BrowseEntry {
	content: string;
	children: string[];
}

export interface SearchResult extends BrowseEntry {
	score: number;
}
