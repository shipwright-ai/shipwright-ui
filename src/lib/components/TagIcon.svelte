<script lang="ts">
	import { TAG_ICON_MAP } from '$lib/tagIcons';
	import {
		Bug,
		Sparkles,
		Wrench,
		Rocket,
		Search,
		Settings,
		Monitor,
		Palette,
		Paintbrush,
		Images,
		Filter,
		FolderOpen,
		BarChart3,
		Route,
		Paperclip,
		Brain,
		Plug,
		Tags,
		Code,
		Layout,
		Workflow
	} from 'lucide-svelte';

	let { tag, size = 12 }: { tag: string; size?: number } = $props();

	const ICONS: Record<string, typeof Bug> = {
		Bug,
		Sparkles,
		Wrench,
		Rocket,
		Search,
		Settings,
		Monitor,
		Palette,
		Paintbrush,
		Images,
		Filter,
		FolderOpen,
		BarChart3,
		Route,
		Paperclip,
		Brain,
		Plug,
		Tags,
		Code,
		Layout,
		Workflow
	};

	const iconName = $derived(TAG_ICON_MAP[tag]);
	const IconComponent = $derived(iconName ? ICONS[iconName] : undefined);
</script>

{#if IconComponent}
	<IconComponent {size} class="inline-block" />
{/if}
