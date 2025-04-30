// @ts-nocheck
import type { PageLoad } from './$types';

// Simple mapping for demonstration. You might fetch this from an API or a more structured source.
const categoryMap: Record<string, string> = {
    cs: 'Computer Science',
    math: 'Mathematics',
    languages: 'Languages',
    science: 'Science'
};

// Explicitly type params using the PageLoad generic or an inline type
export const load = ({ params }: { params: { slug: string } }) => {
    const slug = params.slug;
    const categoryName = categoryMap[slug] || 'Unknown Category'; // Provide a fallback name

    return {
        slug: slug,
        categoryName: categoryName
    };
}; ;null as any as PageLoad;