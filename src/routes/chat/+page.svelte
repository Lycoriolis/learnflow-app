<!-- src/routes/chat/+page.svelte -->
<script lang="ts">
    import ChatBot from "$lib/components/ChatBot.svelte";

    // Could potentially add features here like clearing history,
    // loading specific contexts, etc.

</script>

<svelte:head>
    <title>LearnFlow | Chat Assistant</title>
</svelte:head>

<div class="flex flex-col h-[calc(100vh-var(--header-height,60px))] max-w-4xl mx-auto">
    <!-- Subtract header height -->
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white p-4 pb-0 sm:px-6 lg:px-8">Chat Assistant</h1>
    <div class="flex-1 p-4 sm:p-6 lg:p-8 min-h-0">
        <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg h-full flex flex-col">
            <ChatBot />
        </div>
    </div>
</div>

<style>
    /* Define header height variable if your layout doesn't already */
    /* :root {
        --header-height: 60px; 
    } */
</style> 