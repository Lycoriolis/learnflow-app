<!-- src/routes/links/+page.svelte -->
<script lang="ts">
    type LinkItem = {
        url: string;
        title: string;
        description: string;
        icon?: string; // Optional Font Awesome icon class
    };

    // Mock link data (replace with dynamic data if needed)
    const usefulLinks: LinkItem[] = [
        {
            url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
            title: 'MDN Web Docs: JavaScript',
            description: 'The indispensable resource for JavaScript developers, covering syntax, APIs, and tutorials.',
            icon: 'fab fa-js-square'
        },
        {
            url: 'https://www.khanacademy.org/math',
            title: 'Khan Academy: Math',
            description: 'Free lessons and practice covering everything from basic arithmetic to calculus and beyond.',
            icon: 'fas fa-square-root-alt'
        },
        {
            url: 'https://svelte.dev/docs/introduction',
            title: 'Svelte Documentation',
            description: 'Official documentation for the Svelte framework, great for learning and reference.',
            icon: 'fas fa-code' // Generic code icon as fab fa-svelte might not exist
        },
         {
            url: 'https://www.freecodecamp.org/',
            title: 'freeCodeCamp',
            description: 'Learn to code for free. Build projects. Earn certifications.',
            icon: 'fab fa-free-code-camp'
        },
         {
            url: 'https://css-tricks.com/',
            title: 'CSS-Tricks',
            description: 'Articles, tutorials, tips, and tricks about CSS and front-end development.',
            icon: 'fab fa-css3-alt'
        },
         {
            url: 'https://stackoverflow.com/',
            title: 'Stack Overflow',
            description: 'The largest online community for programmers to learn, share knowledge, and build careers.',
            icon: 'fab fa-stack-overflow'
        },
        // Add more links as needed
    ];
</script>

<svelte:head>
    <title>LearnFlow | Useful Links</title>
    <meta name="description" content="A curated list of useful links for learning and development." />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Useful Links</h1>
    <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Here's a collection of external resources that might be helpful for your learning journey.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each usefulLinks as link}
            <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                class="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
            >
                <div class="flex items-start space-x-4">
                     {#if link.icon}
                         <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                             <i class="{link.icon} fa-lg"></i> <!-- Use class binding -->
                         </div>
                     {:else}
                         <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                             <i class="fas fa-link fa-lg"></i> <!-- Default icon -->
                         </div>
                     {/if}
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{link.title}</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
                         <span class="mt-2 inline-block text-xs text-indigo-500 dark:text-indigo-400 group-hover:underline">
                           Visit Site <i class="fas fa-external-link-alt fa-xs ml-1"></i>
                         </span>
                    </div>
                </div>
            </a>
        {/each}
    </div>
</div> 