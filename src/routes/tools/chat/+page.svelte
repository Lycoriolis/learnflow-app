<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import MarkdownIt from 'markdown-it';
  import markdownItKatex from 'markdown-it-katex';
  // Set up Markdown-It with KaTeX for math rendering
  const md = new MarkdownIt({ html: true }).use(markdownItKatex);
  import { logStart, logEnd, logEvent } from '$lib/services/activityService';

  const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
  const SITE_URL = import.meta.env.VITE_SITE_URL || (typeof location !== 'undefined' ? location.origin : '');
  const SITE_NAME = import.meta.env.VITE_SITE_NAME || 'LearnFlow';

  type Role = 'user' | 'assistant';
  interface ChatMessage { role: Role; text: string; }

  const modes = [
    { id: 'assist', label: 'Assist Mode', model: 'deepseek/deepseek-prover-v2:free' },
    { id: 'support', label: 'Support Mode', model: 'google/gemini-2.5-pro-exp-03-25:free' }
  ];

  let mode = 'assist';
  let messages: ChatMessage[] = [];
  let input = '';
  let loading = false;
  let error = '';
  let chatWindow: HTMLElement;
  let chatViewEventId: string | null = null;

  onMount(async () => {
    chatViewEventId = await logStart('view_chat', 'chat');
  });

  onDestroy(() => {
    if (chatViewEventId) logEnd(chatViewEventId);
  });

  afterUpdate(() => {
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  });

  async function send() {
    if (!input.trim()) return;
    await logEvent('send_message', 'chat', { content: input });
    // add user message
    messages = [...messages, { role: 'user', text: input }];
    input = '';
    loading = true;
    error = '';
    const selected = modes.find(m => m.id === mode);

    if (!selected) { // Add check for undefined selected
      error = 'Invalid mode selected.';
      loading = false;
      return;
    }

    try {
      // Build request with full chat history for context (memory)
      // Include full history and enable streaming
      const body = {
        model: selected.model,
        stream: true,
        messages: messages.map(msg => ({ role: msg.role, content: [{ type: 'text', text: msg.text }] }))
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
      
      // Prepare streaming of assistant reply
      messages = [...messages, { role: 'assistant', text: '' }];
      const assistantIndex = messages.length - 1;

      if (!res.body) { // Add check for null res.body
        throw new Error('Response body is null.');
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        buffer += decoder.decode(value || new Uint8Array(), { stream: true });
        let boundary;
        while ((boundary = buffer.indexOf('\n\n')) !== -1) {
          const eventStr = buffer.slice(0, boundary);
          buffer = buffer.slice(boundary + 2);
          for (const line of eventStr.split(/\r?\n/)) {
            if (!line.startsWith('data: ')) continue;
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') { done = true; break; }
            try {
              const json = JSON.parse(dataStr);
              const delta = json.choices?.[0]?.delta || {};
              const content = delta.content || delta.text || '';
              if (content) {
                messages[assistantIndex].text += content;
                messages = messages.slice(); // Trigger Svelte reactivity
              }
            } catch {
              // skip invalid JSON
            }
          }
        }
      }
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

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
  <!-- Header -->
  <div class="bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white shadow-xl">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <i class="fas fa-robot text-3xl"></i>
          <div>
            <h1 class="text-3xl font-bold">AI Study Chat</h1>
            <p class="text-indigo-100 mt-1">Get help with your studies using AI</p>
          </div>
        </div>
        <div class="flex space-x-3">
          {#each modes as m}
            <button
              class="px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg
                {mode === m.id
                  ? 'bg-white text-indigo-600 shadow-xl'
                  : 'bg-indigo-500/30 text-white hover:bg-indigo-500/50 backdrop-blur-sm'}"
              on:click={() => mode = m.id}
            >{m.label}</button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="max-w-7xl mx-auto px-6 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
      <!-- Chat Area -->
      <div class="lg:col-span-3 flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Chat Messages -->
        <div bind:this={chatWindow} class="flex-1 overflow-y-auto p-6 space-y-4" id="chat-window">
          {#each messages as msg}
            <div class="flex {msg.role === 'assistant' ? 'justify-start' : 'justify-end'}">
              <div class="max-w-[80%] p-4 prose dark:prose-invert
                {msg.role === 'assistant'
                  ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-gray-100 rounded-tr-2xl rounded-br-2xl rounded-tl-2xl shadow-lg'
                  : 'bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl shadow-lg'}">
                {@html md.render(msg.text)}
              </div>
            </div>
          {/each}
          {#if loading}
            <div class="flex justify-start">
              <div class="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-4 rounded-2xl shadow-lg">
                <div class="flex space-x-2">
                  <div class="loading-dot bg-gray-400 dark:bg-gray-600"></div>
                  <div class="loading-dot bg-gray-400 dark:bg-gray-600"></div>
                  <div class="loading-dot bg-gray-400 dark:bg-gray-600"></div>
                </div>
              </div>
            </div>
          {/if}
          {#if error}
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl">
              <div class="flex items-center">
                <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                <span class="text-red-700 dark:text-red-300 text-sm">{error}</span>
              </div>
            </div>
          {/if}
        </div>

        <!-- Input Area -->
        <div class="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
          <div class="flex space-x-4">
            <textarea
              class="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 p-4 resize-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
              rows="3"
              bind:value={input}
              placeholder="Type your question..."
              on:keydown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            ></textarea>
            <button
              class="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              on:click={send}
              disabled={loading || !input.trim()}
            >
              <i class="fas fa-paper-plane mr-2"></i>
              Send
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 p-6 bg-gradient-to-br from-indigo-50/50 via-red-50/30 dark:from-indigo-950/20 dark:via-red-950/10 to-white dark:to-gray-900 border-l border-gray-200 dark:border-gray-800 overflow-y-auto">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <i class="fas fa-info-circle mr-2 text-indigo-500"></i> Chat Info
          </h3>
          <div class="space-y-4">
            <div class="p-4 bg-gradient-to-r from-indigo-50 to-red-50 dark:from-indigo-950/50 dark:to-red-950/50 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">Current Mode</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {#if mode === 'assist'}
                  <i class="fas fa-brain mr-1 text-indigo-500"></i> Assist Mode - General AI assistance
                {:else}
                  <i class="fas fa-support mr-1 text-red-500"></i> Support Mode - Specialized support
                {/if}
              </p>
            </div>
            <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">Messages</h4>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <i class="fas fa-comments mr-1 text-green-500"></i> {messages.length} messages in conversation
              </p>
            </div>
            <div class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-lg border border-amber-200 dark:border-amber-800">
              <h4 class="font-medium text-gray-900 dark:text-white mb-2">Tips</h4>
              <ul class="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Press Enter to send</li>
                <li>• Shift+Enter for new line</li>
                <li>• Ask about any subject</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  #chat-window {
    scrollbar-width: thin;
    scrollbar-color: rgba(100,100,100,0.4) transparent;
  }
  #chat-window::-webkit-scrollbar {
    width: 6px;
  }
  #chat-window::-webkit-scrollbar-thumb {
    background-color: rgba(100,100,100,0.4);
    border-radius: 3px;
  }
  #chat-window::-webkit-scrollbar-track {
    background: transparent;
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
