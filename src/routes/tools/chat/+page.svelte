<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  import { writable } from 'svelte/store';
  import MarkdownRenderer from '$lib/components/MarkdownRenderer.svelte';

  const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  const SITE_URL = import.meta.env.VITE_SITE_URL || location.origin;
  const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'LearnFlow';

  type Role = 'user' | 'assistant';
  interface ChatMessage { role: Role; text: string; }

  const modes = [
    { id: 'assist', label: 'Assist Mode', model: 'google/learnlm-1.5-pro-experimental:free' },
    { id: 'support', label: 'Support Mode', model: 'google/gemini-2.5-pro-exp-03-25:free' }
  ];

  let mode = 'assist';
  let messages: ChatMessage[] = [];
  let input = '';
  let loading = false;
  let error = '';
  let chatWindow: HTMLElement;

  afterUpdate(() => {
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  });

  async function send() {
    if (!input.trim()) return;
    // add user message
    messages = [...messages, { role: 'user', text: input }];
    const userContent = input;
    input = '';
    loading = true;
    error = '';
    const selected = modes.find(m => m.id === mode);
    try {
      const body = {
        model: selected.model,
        messages: [{ role: 'user', content: [{ type: 'text', text: userContent }] }]
      };
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // assume data.choices[0].message.content is text or array
      let reply = '';
      const content = data.choices?.[0]?.message?.content;
      if (typeof content === 'string') reply = content;
      else if (Array.isArray(content)) {
        reply = content.map((c:any) => c.text || '').join(' ');
      }
      messages = [...messages, { role: 'assistant', text: reply }];
    } catch (e:any) {
      console.error(e);
      error = e.message || 'Error fetching AI response';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>AI Study Chat | LearnFlow</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-10 flex flex-col h-[75vh]">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Study Chat</h1>
  <div class="flex space-x-4 mb-4">
    {#each modes as m}
      <button
        class="px-4 py-2 rounded-lg font-semibold transition 
          {mode === m.id 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}"
        on:click={() => mode = m.id}
      >{m.label}</button>
    {/each}
  </div>
  <div bind:this={chatWindow} class="flex-1 overflow-y-auto space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner" id="chat-window">
    {#each messages as msg}
      <div class="flex {msg.role === 'assistant' ? 'justify-start' : 'justify-end'}">
        <div class="max-w-[80%] p-3 prose dark:prose-invert 
          {msg.role === 'assistant'
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tr-xl rounded-br-xl rounded-tl-xl'
            : 'bg-indigo-600 dark:bg-indigo-500 text-white rounded-tl-xl rounded-bl-xl rounded-br-xl'}">
          <MarkdownRenderer content={msg.text} />
        </div>
      </div>
    {/each}
    {#if loading}
      <div class="flex justify-start mb-3">
        <div class="loading-dot bg-gray-400 dark:bg-gray-600"></div>
        <div class="loading-dot bg-gray-400 dark:bg-gray-600"></div>
        <div class="loading-dot bg-gray-400 dark:bg-gray-600"></div>
      </div>
    {/if}
    {#if error}
      <div class="text-red-500 text-sm">{error}</div>
    {/if}
  </div>
  <div class="mt-4 flex">
    <textarea
      class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 p-2 resize-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      rows="2"
      bind:value={input}
      placeholder="Type your question..."
      on:keydown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
    ></textarea>
    <button
      class="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition disabled:opacity-50"
      on:click={send}
      disabled={loading || !input.trim()}
    >Send</button>
  </div>
</div>

<style>
  #chat-window {
    scrollbar-width: thin;
  }
  #chat-window::-webkit-scrollbar {
    width: 6px;
  }
  #chat-window::-webkit-scrollbar-thumb {
    background-color: rgba(100,100,100,0.4);
    border-radius: 3px;
  }
  .loading-dot {
    width: 8px;
    height: 8px;
    margin-right: 4px;
    border-radius: 50%;
    animation: blink 1s infinite ease-in-out;
  }
  .loading-dot:nth-child(2) { animation-delay: 0.2s }
  .loading-dot:nth-child(3) { animation-delay: 0.4s }
  @keyframes blink {
    0%, 80%, 100% { opacity: 0 }
    40% { opacity: 1 }
  }
</style>
