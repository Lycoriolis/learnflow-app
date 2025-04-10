<!-- src/routes/zen/+page.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';

    // --- Breathing Exercise State ---
    let breathPhase: 'in' | 'hold' | 'out' = 'in';
    let breathText = 'Start Breathing Exercise';
    let animationDuration = 4000; // ms
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let running = false;

    // --- Music Player State ---
    type Track = { src: string; title: string; artist: string };
    const playlist: Track[] = [
        // Pointing to files now served from the 'static/audio' directory
        { src: '/audio/downloaded_file_2.mp3', title: 'Stillness', artist: 'Nature Sounds' },
        { src: '/audio/downloaded_file.mp3', title: 'Gentle Flow', artist: 'Piano Dreams' },
        { src: '/audio/Persona 5 OST 102 - Freedom and Security.mp3', title: 'Deep Focus', artist: 'Mindful Beats' }
    ];
    let currentTrackIndex = 0;
    let audioPlayer: HTMLAudioElement;
    let isPlaying = false;
    let currentTime = 0;
    let duration = 0;

    // --- Breathing Logic ---
    function cycleBreath() {
        let nextPhase: typeof breathPhase = 'in';
        let nextDuration = 4000;
        let nextText = 'Breathe In...';

        switch (breathPhase) {
            case 'in':
                nextPhase = 'hold';
                nextText = 'Hold...';
                nextDuration = 1500; // Hold duration
                break;
            case 'hold':
                nextPhase = 'out';
                nextText = 'Breathe Out...';
                nextDuration = 6000; // Exhale duration
                break;
            case 'out':
                nextPhase = 'in';
                nextText = 'Breathe In...';
                nextDuration = 4000; // Inhale duration
                break;
        }
        breathPhase = nextPhase;
        breathText = nextText;
        animationDuration = nextDuration;

        // Reset interval with new duration
        if (running && intervalId) {
            clearInterval(intervalId);
            intervalId = setInterval(cycleBreath, animationDuration);
        }
    }

    function startBreathing() {
       if (running) return;
       running = true;
       // Immediately set the first state text/duration before starting interval
       breathPhase = 'in'; 
       breathText = 'Breathe In...';
       animationDuration = 4000;
       // Clear any previous interval just in case
       if(intervalId) clearInterval(intervalId);
       intervalId = setInterval(cycleBreath, animationDuration); 
    }

    function stopBreathing() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        running = false;
        breathText = 'Start Breathing Exercise'; 
        // Optional: Reset animation state if desired when stopped
        // animationDuration = 4000; 
    }

    // --- Music Logic ---
    function loadTrack(index: number) {
        if (index < 0 || index >= playlist.length) return;
        currentTrackIndex = index;
        if (audioPlayer) {
            audioPlayer.src = playlist[currentTrackIndex].src;
            audioPlayer.load(); // Important to load the new source
             if (isPlaying) {
                 // Try to play after loading (might require user interaction first)
                 audioPlayer.play().catch(e => console.error("Audio play failed:", e));
             } 
        }
    }

    function togglePlayPause() {
        if (!audioPlayer) return;
        if (audioPlayer.paused) {
            audioPlayer.play().then(() => isPlaying = true).catch(e => console.error("Audio play failed:", e));
        } else {
            audioPlayer.pause();
            isPlaying = false;
        }
    }

     function playNext() {
        loadTrack((currentTrackIndex + 1) % playlist.length);
    }

    function playPrev() {
        loadTrack((currentTrackIndex - 1 + playlist.length) % playlist.length);
    }

     // Update time/duration display
     function handleTimeUpdate() {
        currentTime = audioPlayer.currentTime;
        duration = audioPlayer.duration || 0;
    }
    function handleLoadedMetadata() {
         duration = audioPlayer.duration || 0;
    }

    // Format time helper
    function formatTime(seconds: number): string {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // --- Lifecycle ---
    onDestroy(() => {
        stopBreathing();
        if (audioPlayer) {
             audioPlayer.pause(); // Stop audio on unmount
        }
    });

    onMount(() => {
        if (!running) {
           breathText = 'Start Breathing Exercise'; 
        }
         // Audio element is only available client-side
        audioPlayer = new Audio();
        audioPlayer.addEventListener('timeupdate', handleTimeUpdate);
        audioPlayer.addEventListener('loadedmetadata', handleLoadedMetadata);
        audioPlayer.addEventListener('ended', playNext); // Auto-play next track
        audioPlayer.addEventListener('pause', () => isPlaying = false);
        audioPlayer.addEventListener('play', () => isPlaying = true);
        loadTrack(currentTrackIndex); // Load initial track

        return () => {
            // Cleanup audio event listeners
            if (audioPlayer) {
                 audioPlayer.removeEventListener('timeupdate', handleTimeUpdate);
                 audioPlayer.removeEventListener('loadedmetadata', handleLoadedMetadata);
                 audioPlayer.removeEventListener('ended', playNext);
                 audioPlayer.removeEventListener('pause', () => isPlaying = false);
                 audioPlayer.removeEventListener('play', () => isPlaying = true);
            }
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

    <div class="text-center z-10 max-w-lg w-full">
        <h1 class="text-4xl font-light mb-6 text-indigo-100">Zen Space</h1>
        <p class="text-lg text-purple-200 mb-10">Relax, breathe, and find your focus.</p>

        <!-- Breathing Exercise -->
        <div class="mb-12 bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-lg">
             <h2 class="text-xl font-medium text-indigo-200 mb-4">Guided Breathing</h2>
             <div class="breathing-circle-container mb-4">
                 {#key animationDuration}
                     <div 
                        class="breathing-circle" 
                        class:animate-breath={running} 
                        style="--duration: {animationDuration}ms"
                     ></div>
                 {/key}
                 <span class="breath-text text-lg text-indigo-100 font-light transition-opacity duration-500">{breathText}</span>
            </div>
            {#if !running}
                <button on:click={startBreathing} class="w-full px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition duration-200">
                    Start Exercise
                </button>
            {:else}
                 <button on:click={stopBreathing} class="w-full px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition duration-200">
                    Stop Exercise
                </button>
            {/if}
        </div>

        <!-- Music Player -->
         <div class="mb-12 bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-lg">
             <h2 class="text-xl font-medium text-indigo-200 mb-4">Calming Music</h2>
             <div class="text-center mb-3">
                <p class="text-lg text-indigo-100 truncate">{playlist[currentTrackIndex].title}</p>
                <p class="text-sm text-purple-200">{playlist[currentTrackIndex].artist}</p>
             </div>
             <!-- Placeholder for seek bar if needed -->
             <!-- <div class="w-full h-1 bg-white/10 rounded-full mb-3"></div> -->
             <div class="flex items-center justify-center space-x-6">
                <button on:click={playPrev} class="text-purple-200 hover:text-white transition duration-200" aria-label="Previous track">
                    <i class="fas fa-backward fa-lg"></i>
                </button>
                 <button on:click={togglePlayPause} class="text-white bg-white/10 hover:bg-white/20 w-14 h-14 flex items-center justify-center rounded-full transition duration-200" aria-label={isPlaying ? 'Pause' : 'Play'}>
                    <i class="fas {isPlaying ? 'fa-pause' : 'fa-play'} fa-lg ml-1"></i>
                 </button>
                <button on:click={playNext} class="text-purple-200 hover:text-white transition duration-200" aria-label="Next track">
                    <i class="fas fa-forward fa-lg"></i>
                </button>
             </div>
             <div class="text-xs text-purple-200 mt-3 text-center">
                 {formatTime(currentTime)} / {formatTime(duration)}
             </div>
         </div>

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