import { error, type NumericRange } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const code = Number(url.searchParams.get('code') ?? '500');
	error(code as NumericRange<400, 599>, `Test error: ${code}`);
};
