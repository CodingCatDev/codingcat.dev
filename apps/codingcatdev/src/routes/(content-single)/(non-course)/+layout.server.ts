import { compile } from 'mdsvex';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { error } from '@sveltejs/kit';
import type { Content, Podcast } from '$lib/types';

export const prerender = true;

export const load = (async (params) => {
    try {
        const file = fileURLToPath(new URL(`./${params.url.pathname}/+page.md`, import.meta.url));
        const md = readFileSync(file, 'utf8');
        const transformed = await compile(md);
        const content = transformed?.data?.fm as Content & Podcast | undefined;
        const start = content?.start && new Date(content.start);
        if (start && start < new Date()) {
            return {
                content,
                course: [],
                tutorial: [],
                podcast: [],
                post: []
            }
        } else {
            throw error(404);
        }
    }
    catch (e) {
        console.error(e)
        throw error(404)
    }
})