<!-- learnflow-app/src/lib/components/ChatBot.svelte -->
<script lang="ts">
    import { chatMessages, type ChatMessage } from '$lib/stores/pipStores.js';
    import ChatInterface from './ChatInterface.svelte';
    import { tick } from 'svelte';

    let botLoading = false;

    // Mock bot response function
    async function getMockBotResponse(userMessage: string): Promise<string> {
        console.log("Bot received:", userMessage);
        botLoading = true;
        await tick(); // Allow UI to update showing loading indicator

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        let response = "Sorry, I didn't understand that.";
        const lowerCaseMsg = userMessage.toLowerCase();

        if (lowerCaseMsg.includes("hello") || lowerCaseMsg.includes("hi")) {
            response = "Hello there! How can I help you with your learning today?";
        } else if (lowerCaseMsg.includes("course") || lowerCaseMsg.includes("algebra")) {
            response = "You can find courses under the 'My Courses' or 'Explore' sections. The Algebra Basics course covers variables, equations, and functions.";
        } else if (lowerCaseMsg.includes("timer") || lowerCaseMsg.includes("focus")) {
            response = "The focus timer can be found in the Quick Tools widget! Use it to manage work and break sessions.";
        } else if (lowerCaseMsg.includes("help")) {
            response = "I can provide information about courses, help you navigate the site, or answer general questions. What do you need assistance with?";
        } else if (lowerCaseMsg.includes("thanks") || lowerCaseMsg.includes("thank you")) {
             response = "You're welcome! Let me know if anything else comes up.";
        }

        botLoading = false;
        return response;
    }

    async function handleSendMessage(event: { detail: string }) {
        const userMessageText = event.detail;

        // Add user message to store
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            text: userMessageText,
            sender: 'user',
            timestamp: Date.now()
        };
        chatMessages.update(msgs => [...msgs, userMessage]);

        // Get and add bot response
        const botResponseText = await getMockBotResponse(userMessageText);

        const botMessage: ChatMessage = {
            id: crypto.randomUUID(),
            text: botResponseText,
            sender: 'bot',
            timestamp: Date.now() + 1 // Ensure slightly different timestamp
        };
        chatMessages.update(msgs => [...msgs, botMessage]);
    }

</script>

<ChatInterface
    messages={$chatMessages}
    loading={botLoading}
    inputPlaceholder="Ask the LearnFlow assistant..."
    on:send={handleSendMessage}
/> 