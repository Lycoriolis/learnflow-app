<!-- src/routes/zen/+page.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    let breathPhase: 'in' | 'hold' | 'out' = 'in';
    let breathText = 'Breathe In...';
    let animationDuration = 4000; // Initial duration for inhale (ms)
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let running = false;

    function cycleBreath() {
        switch (breathPhase) {
            case 'in':
                breathPhase = 'hold';
                breathText = 'Hold...';
                animationDuration = 1000; // Shorter hold
                break;
            case 'hold':
                breathPhase = 'out';
                breathText = 'Breathe Out...';
                animationDuration = 6000; // Longer exhale
                break;
            case 'out':
                breathPhase = 'in';
                breathText = 'Breathe In...';
                animationDuration = 4000; // Back to inhale duration
                break;
        }
         // Apply the new duration *before* setting the interval again if running
        if (running && intervalId) {
            clearInterval(intervalId);
            intervalId = setInterval(cycleBreath, animationDuration);
        }
    }

    function startBreathing() {
       if (running) return;
       running = true;
       breathPhase = 'out'; // Start cycle logic before first interval
       cycleBreath(); 
       intervalId = setInterval(cycleBreath, animationDuration);
    }

    function stopBreathing() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
         running = false;
         // Reset text immediately
         breathText = 'Start Breathing Exercise'; 
    }

    onDestroy(() => {
        stopBreathing(); // Clean up interval on unmount
    });

    // Initial text setup
    onMount(() => {
        if (!running) {
           breathText = 'Start Breathing Exercise'; 
        }
    });

</script>

<svelte:head>
    <title>LearnFlow | Zen Space</title>
    <meta name="description" content="A space for relaxation and mindfulness." />
</svelte:head>

<div class="zen-container flex flex-col items-center justify-center min-h-screen text-white p-4 relative overflow-hidden">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 -z-10"></div>

    <div class="text-center z-10">
        <h1 class="text-4xl font-light mb-8 text-indigo-100">Zen Space</h1>
        <p class="text-lg text-purple-200 mb-12">Take a moment to relax and recenter.</p>

        <!-- Breathing Exercise Visualizer -->
        <div class="breathing-circle-container mb-12">
            <!-- Key change: Use key block to force re-render on duration change -->
             {#key animationDuration}
                 <div 
                    class="breathing-circle" 
                    class:animate-breath={running} 
                    style="--duration: {animationDuration}ms"
                 ></div>
             {/key}
             <span class="breath-text text-xl text-indigo-100 font-light transition-opacity duration-500">{breathText}</span>
        </div>


        <!-- Controls -->
        {#if !running}
            <button
                on:click={startBreathing}
                class="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition duration-200 text-lg"
            >
                {breathText} <!-- Use state variable for button text too -->
            </button>
        {:else}
             <button
                on:click={stopBreathing}
                class="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full transition duration-200 text-lg"
            >
                Stop Exercise
            </button>
        {/if}
    </div>
</div>

<style>
    .zen-container {
        /* Ensure text is readable over gradient */
        text-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }

    .breathing-circle-container {
        position: relative;
        width: 200px;
        height: 200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .breathing-circle {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(165, 180, 252, 0.3); /* Indigo-300 with opacity */
        position: absolute;
        top: 0;
        left: 0;
        transform: scale(0.5);
        opacity: 0.5;
        /* Remove transition here, handle via animation */
    }

    .breathing-circle.animate-breath {
        animation: breathe var(--duration) ease-in-out infinite;
    }

     .breath-text {
        position: relative; /* Ensure text is above the circle */
        z-index: 2;
    }

    @keyframes breathe {
        0% {
            transform: scale(0.5);
            opacity: 0.5;
        }
        50% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0.5);
            opacity: 0.5;
        }
    }
</style> 