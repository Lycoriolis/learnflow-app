// src/lib/musicService.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Track = { src: string; title: string; artist: string };

// --- Static Playlist ---
const playlist: Track[] = [
    { src: '/audio/downloaded_file_2.mp3', title: 'Stillness', artist: 'Nature Sounds' },
    { src: '/audio/downloaded_file.mp3', title: 'Gentle Flow', artist: 'Piano Dreams' },
    { src: '/audio/Persona 5 OST 102 - Freedom and Security.mp3', title: 'Deep Focus', artist: 'Mindful Beats' }
];

// --- Reactive Stores ---
export const currentTrackIndex = writable<number>(0);
export const currentTrack = writable<Track | null>(null);
export const isPlaying = writable<boolean>(false);
export const currentTime = writable<number>(0);
export const duration = writable<number>(0);

// --- Internal Audio Element ---
let audioPlayer: HTMLAudioElement | null = null;
let isInitialized = false;

// --- Initialization (Client-Side Only) ---
function initializeAudioPlayer() {
    if (!browser || isInitialized) return; // Run only once on client
    isInitialized = true; // Mark as initialized

    console.log("Initializing Audio Player Service...");
    audioPlayer = new Audio();
    let _currentIndex = 0;

    // Update currentTrack when index changes
    currentTrackIndex.subscribe(index => {
        _currentIndex = index;
        currentTrack.set(playlist[_currentIndex] || null);
        // Load src when index changes
        if (audioPlayer && playlist[_currentIndex]) {
             console.log(`Loading track by index change: ${index}: ${playlist[index]?.src}`);
             audioPlayer.src = playlist[index]?.src;
             audioPlayer.load();
             // If it was playing before, attempt to play (may fail due to browser policy)
             isPlaying.subscribe(playing => {
                 if (playing) {
                    audioPlayer?.play().catch(e => console.warn("Autoplay after track change failed:", e));
                 }
             })();
        }
    });

    // Audio event listeners
    audioPlayer.addEventListener('loadedmetadata', () => {
        duration.set(audioPlayer?.duration || 0);
    });
    audioPlayer.addEventListener('timeupdate', () => {
        currentTime.set(audioPlayer?.currentTime || 0);
    });
    audioPlayer.addEventListener('ended', () => {
        playNext();
    });
    audioPlayer.addEventListener('play', () => {
        isPlaying.set(true);
    });
    audioPlayer.addEventListener('pause', () => {
        isPlaying.set(false);
    });

    // Trigger initial track load
     currentTrackIndex.set(0);
}

// --- Control Functions ---
export function loadTrackByIndex(index: number) {
    if (!browser || index < 0 || index >= playlist.length) return;
    console.log(`Function call: loadTrackByIndex(${index})`);
    currentTrackIndex.set(index);
}

export function togglePlayPause() {
    if (!browser || !audioPlayer) return;
    console.log("Function call: togglePlayPause");
    if (audioPlayer.paused) {
        audioPlayer.play().catch(e => console.error("Audio play failed:", e));
    } else {
        audioPlayer.pause();
    }
}

export function playNext() {
    if (!browser) return;
    console.log("Function call: playNext");
    let nextIndex = 0;
    currentTrackIndex.subscribe(val => { nextIndex = (val + 1) % playlist.length })();
    loadTrackByIndex(nextIndex);
}

export function playPrev() {
    if (!browser) return;
    console.log("Function call: playPrev");
    let prevIndex = 0;
    currentTrackIndex.subscribe(val => { prevIndex = (val - 1 + playlist.length) % playlist.length })();
    loadTrackByIndex(prevIndex);
}

// --- Ensure Initialization ---
if (browser) {
    initializeAudioPlayer();
} 