<script lang="ts">
    import { slide } from 'svelte/transition';

    export let context: Record<string, any> = {}; // e.g., { pageTitle: 'Variables', pageType: 'lesson' }

    let chatOpen = false;
    let messages = [
        { id: 1, text: "Hello! How can I help you today regarding: " + (context.pageTitle || 'this page') + "?", sender: 'bot' }
    ];
    let userInput = '';

    function toggleChat() {
        chatOpen = !chatOpen;
        if (chatOpen) {
            // Reset messages or add context-specific greeting
            messages = [
                { id: crypto.randomUUID(), text: "Hello! How can I help you with '" + (context.pageTitle || 'this topic') + "'?", sender: 'bot' }
            ];
            userInput = '';
        }
    }

    function sendMessage() {
        if (!userInput.trim()) return;
        messages = [...messages, { id: crypto.randomUUID(), text: userInput, sender: 'user' }];
        
        // Mock bot response
        setTimeout(() => {
            messages = [...messages, { id: crypto.randomUUID(), text: "Thanks for your message! I'm still learning. (Context: " + JSON.stringify(context) + ")", sender: 'bot' }];
        }, 1000);
        userInput = '';
    }
</script>

<div class="chatbot-container">
    {#if chatOpen}
        <div class="chat-window" transition:slide={{ duration: 300, axis: 'y' }}>
            <div class="chat-header">
                <span>Support Chat</span>
                <button class="close-chat" on:click={toggleChat} aria-label="Close chat">&times;</button>
            </div>
            <div class="chat-messages">
                {#each messages as message (message.id)}
                    <div class="message" class:user={message.sender === 'user'} class:bot={message.sender === 'bot'}>
                        {message.text}
                    </div>
                {/each}
            </div>
            <div class="chat-input-area">
                <input type="text" bind:value={userInput} placeholder="Type your message..." on:keypress={(e) => e.key === 'Enter' && sendMessage()} />
                <button on:click={sendMessage}>Send</button>
            </div>
        </div>
    {/if}

    <button type="button" class="chatbot-trigger-button" on:click={toggleChat} aria-label="Open chat support">
        {#if chatOpen}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        {/if}
    </button>
</div>

<style>
    .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1010; /* Above most other elements */
    }

    .chatbot-trigger-button {
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 50%; /* Circular button */
        width: 60px;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: background-color 0.2s ease, transform 0.2s ease;
    }
    .chatbot-trigger-button:hover {
        background-color: #0056b3;
        transform: scale(1.1);
    }
    .chatbot-trigger-button svg {
        width: 28px; /* Adjust icon size */
        height: 28px;
    }

    .chat-window {
        width: 350px;
        max-height: 500px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin-bottom: 10px; /* Space between window and trigger button if window is above */
    }

    .chat-header {
        background-color: #007bff;
        color: white;
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
    }
    .close-chat {
        background: none;
        border: none;
        color: white;
        font-size: 1.5em;
        cursor: pointer;
    }

    .chat-messages {
        flex-grow: 1;
        padding: 15px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .message {
        padding: 8px 12px;
        border-radius: 15px;
        max-width: 80%;
        word-wrap: break-word;
        font-size: 0.9em;
    }
    .message.bot {
        background-color: #f1f0f0;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 2px;
    }
    .message.user {
        background-color: #007bff;
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 2px;
    }

    .chat-input-area {
        display: flex;
        padding: 10px;
        border-top: 1px solid #eee;
    }
    .chat-input-area input {
        flex-grow: 1;
        padding: 8px 10px;
        border: 1px solid #ccc;
        border-radius: 20px;
        margin-right: 8px;
        outline: none;
    }
    .chat-input-area input:focus {
        border-color: #007bff;
    }
    .chat-input-area button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 500;
    }
    .chat-input-area button:hover {
        background-color: #0056b3;
    }
</style>
