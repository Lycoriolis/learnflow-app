<!-- learnflow-app/src/lib/components/ChatInterface.svelte -->
<script lang="ts">
    import { createEventDispatcher, afterUpdate } from 'svelte';
    import type { ChatMessage } from '$lib/stores/pipStores.js';
    import { fade } from 'svelte/transition';

    export let messages: ChatMessage[] = [];
    export let inputPlaceholder: string = "Type your message...";
    export let loading: boolean = false; // To show bot thinking indicator

    let userInput = '';
    let messagesContainer: HTMLElement;

    const dispatch = createEventDispatcher<{ send: string }>();

    function sendMessage() {
        const text = userInput.trim();
        if (!text) return;
        dispatch('send', text);
        userInput = ''; // Clear input after sending
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent newline on Enter
            sendMessage();
        }
    }

    // Auto-scroll to bottom
    let shouldScroll = false;
    afterUpdate(() => {
        if (shouldScroll && messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            shouldScroll = false;
        }
    });

    $: {
        // Trigger scroll after messages update
        if (messages) {
            shouldScroll = true;
        }
    }

</script>

<div class="chat-interface flex flex-col h-full">
    <!-- Message Display Area -->
    <div bind:this={messagesContainer} class="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-700">
        {#each messages as message (message.id)}
            <div
                class="flex"
                class:justify-end={message.sender === 'user'}
                class:justify-start={message.sender === 'bot'}
                 in:fade={{ duration: 200 }}
            >
                <div
                    class="max-w-[80%] px-3 py-2 rounded-lg shadow"
                    class:bg-indigo-600={message.sender === 'user'}
                    class:text-white={message.sender === 'user'}
                    class:bg-gray-600={message.sender === 'bot'}
                    class:text-gray-100={message.sender === 'bot'}
                >
                    <p class="text-sm whitespace-pre-wrap">{message.text}</p>
                    <!-- Optional: Timestamp -->
                    <!-- <span class="text-xs opacity-70 block text-right mt-1">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span> -->
                </div>
            </div>
        {/each}
         {#if loading}
             <div class="flex justify-start" transition:fade={{ duration: 150 }}>
                  <div class="max-w-[80%] px-3 py-2 rounded-lg shadow bg-gray-600 text-gray-100">
                      <span class="typing-indicator">
                          <span>.</span><span>.</span><span>.</span>
                      </span>
                  </div>
             </div>
         {/if}
    </div>

    <!-- Input Area -->
    <div class="p-2 border-t border-gray-600">
        <div class="flex items-center bg-gray-600 rounded-lg">
            <textarea
                bind:value={userInput}
                on:keydown={handleKeydown}
                rows="1"
                placeholder={inputPlaceholder}
                class="flex-1 bg-transparent text-sm text-gray-100 p-2 resize-none focus:outline-none placeholder-gray-400"
                style="min-height: 40px; max-height: 100px;"
                on:input={(e) => {
                    // Auto-resize textarea
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                }}
            ></textarea>
            <button
                on:click={sendMessage}
                disabled={!userInput.trim() || loading}
                class="p-2 text-indigo-400 hover:text-indigo-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none transition duration-150"
                aria-label="Send message"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                    <path d="M3.105 3.105a1.5 1.5 0 0 1 1.995-.24l12 6a1.5 1.5 0 0 1 0 2.28l-12 6a1.5 1.5 0 0 1-1.995-.24 1.5 1.5 0 0 1-.24-1.995L4.61 11.75H10a.75.75 0 0 0 0-1.5H4.61L2.865 5.1a1.5 1.5 0 0 1 .24-1.995Z" />
                </svg>
            </button>
        </div>
    </div>
</div>

<style>
    /* Typing indicator animation */
    .typing-indicator span {
        display: inline-block;
        width: 6px;
        height: 6px;
        margin: 0 1px;
        background-color: rgba(209, 213, 219, 0.7); /* gray-300 with opacity */
        border-radius: 50%;
        animation: typing 1s infinite ease-in-out;
    }
    .typing-indicator span:nth-child(1) { animation-delay: 0s; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.1s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.2s; }

    @keyframes typing {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1.0); }
    }

    /* Custom scrollbar for message area */
     .scrollbar-thin {
        scrollbar-width: thin;
        scrollbar-color: #4b5563 #374151; /* thumb color track color */
    }
    .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
        background: #374151; /* gray-700 */
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
        background-color: #4b5563; /* gray-600 */
        border-radius: 3px;
        border: 1px solid #374151; /* gray-700 */
    }
</style> 