# TODO: ChatbotTrigger Full Integration

**Component:** `src/lib/components/ChatbotTrigger.svelte`

**Current Status:**
- UI for a trigger button and a mock chat window.
- Toggles chat window visibility.
- Mock message sending and receiving (client-side only).
- Receives `context` prop (e.g., `pageTitle`).

**Future Integration Requirements:**

1.  **Choose Chatbot Service/Platform:**
    *   Dialogflow (Google)
    *   Azure Bot Service (Microsoft)
    *   Amazon Lex
    *   Rasa (Open Source)
    *   Custom-built solution using LLMs (e.g., OpenAI API, Hugging Face models)

2.  **Backend API Endpoint (SvelteKit server route):**
    *   `POST /api/chatbot/message`: Forward user message and context to the chosen chatbot service.
        *   Request body: `{ messageText: string, sessionId: string (for conversation history), context: object }`
        *   Handle authentication if chatbot interactions should be user-specific.
        *   Call the chatbot service's API.
        *   Return the bot's response.

3.  **Component Updates (`ChatbotTrigger.svelte`):**
    *   Replace mock message handling with API calls to `/api/chatbot/message`.
    *   Manage a `sessionId` for the conversation.
    *   Display actual bot responses.
    *   Handle loading states while waiting for bot response.
    *   Handle API errors gracefully.
    *   Potentially implement more sophisticated UI elements (e.g., quick replies, cards) if supported by the bot service.

4.  **Contextualization:**
    *   Ensure the `context` prop (page title, type, etc.) is effectively passed to the chatbot service to provide relevant answers.
    *   The chatbot's knowledge base needs to be populated with course content or have access to it (e.g., via RAG - Retrieval Augmented Generation if using LLMs).

5.  **Conversation History:**
    *   Decide if conversation history needs to be persisted beyond the current session (e.g., in a database linked to the user).

6.  **Natural Language Understanding (NLU) Training:**
    *   If using services like Dialogflow, Rasa, etc., define intents, entities, and training phrases for the chatbot.

7.  **Security & Privacy:**
    *   Ensure sensitive information is not inadvertently logged or mishandled.
    *   Comply with data privacy regulations.
