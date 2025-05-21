<script lang="ts">
  import { slide } from 'svelte/transition';
  import { onMount } from 'svelte';
  import UnifiedRenderer from '../UnifiedRenderer.svelte';
  import ExerciseRating from '../courses/exercise/ExerciseRating.svelte';
  import type { ContentNode } from '$lib/services/courses/courseService';
  import { getAuth } from 'firebase/auth';
  import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
  import Icon from '@iconify/svelte';
  import { navigateToCourse, navigateToExercise } from '$lib/utils/navigation';

  export let item: ContentNode | null = null;
  export let type: 'exercise' | 'course' = 'exercise';
  export let onBack: () => void = () => {};

  $: sections = item ? extractContentSections(item.content || '') : {};

  let isCompleted = false;
  let isInProgress = false;
  let lastAttemptDate: Date | null = null;
  let userNotes = '';
  let showNotes = false;
  let notesAreEditable = false;

  $: hasSolution = !!sections.solution;
  $: hasContent = !!sections.content || !!sections.main;
  $: showSolution = false;
  let solutionRevealProgress = 0;
  let solutionBlurLevel = 5;
  let checkedHints: string[] = [];
  let hintsArray: string[] = [];

  let startTime: Date | null = null;
  let timeSpent = 0;
  let timerInterval: number | null = null;

  onMount(() => {
    let cleanupFunction = () => {};
    (async () => {
      if (item && type === 'exercise') {
        startTime = new Date();
        timerInterval = window.setInterval(updateTimeSpent, 1000);
        await loadUserProgress();
      }
    })();

    cleanupFunction = () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
    return cleanupFunction;
  });

  async function loadUserProgress() {
    if (!item) return;

    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const db = getFirestore();
      const userProgressRef = doc(db, 'users', auth.currentUser.uid, 'progress', type === 'exercise' ? 'exercises' : 'courses');

      const userProgressDoc = await getDoc(userProgressRef);
      if (userProgressDoc.exists()) {
        const data = userProgressDoc.data();

        if (data.completed && data.completed[item.id]) {
          isCompleted = true;
        } else if (data.inProgress && data.inProgress[item.id]) {
          isInProgress = true;
        }
      }

      const itemDetailRef = doc(db, 'users', auth.currentUser.uid, type === 'exercise' ? 'exercises' : 'courses', item.id);
      const itemDetailDoc = await getDoc(itemDetailRef);

      if (itemDetailDoc.exists()) {
        const data = itemDetailDoc.data();
        userNotes = data.notes || '';
        lastAttemptDate = data.lastAttemptDate?.toDate() || null;
        checkedHints = data.checkedHints || [];
      }
    } catch (err) {
      console.error('Error loading user progress:', err);
    }
  }

  async function saveUserProgress(status: 'completed' | 'inProgress' | 'reset') {
    if (!item) return;

    const auth = getAuth();
    if (!auth.currentUser) return;

    try {
      const db = getFirestore();
      const userProgressRef = doc(db, 'users', auth.currentUser.uid, 'progress', type === 'exercise' ? 'exercises' : 'courses');

      if (status === 'completed') {
        await setDoc(userProgressRef, {
          completed: { [item.id]: true },
          inProgress: { [item.id]: false }
        }, { merge: true });

        isCompleted = true;
        isInProgress = false;
      } else if (status === 'inProgress') {
        await setDoc(userProgressRef, {
          inProgress: { [item.id]: true },
          completed: { [item.id]: false }
        }, { merge: true });

        isInProgress = true;
        isCompleted = false;
      } else {
        await setDoc(userProgressRef, {
          inProgress: { [item.id]: false },
          completed: { [item.id]: false }
        }, { merge: true });

        isInProgress = false;
        isCompleted = false;
      }

      const itemDetailRef = doc(db, 'users', auth.currentUser.uid, type === 'exercise' ? 'exercises' : 'courses', item.id);
      await setDoc(itemDetailRef, {
        timeSpent: timeSpent + (getTimeSpentSoFar() || 0),
        lastAttemptDate: new Date(),
        notes: userNotes,
        checkedHints: checkedHints
      }, { merge: true });

    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }

  function getTimeSpentSoFar(): number | null {
    if (!startTime) return null;
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
  }

  function updateTimeSpent() {
    if (startTime) {
      timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    }
  }

  function formatTimeSpent(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }

  function extractContentSections(content: string): Record<string, string> {
    const result: Record<string, string> = {
      main: content
    };

    const sectionMatches = content.matchAll(/^##\s+([A-Za-z\s]+)\s*$([\s\S]*?)(?=^##\s+[A-Za-z\s]+\s*$|$)/gm);

    for (const match of sectionMatches) {
      if (match[1] && match[2]) {
        const sectionName = match[1].trim().toLowerCase();
        const sectionContent = match[2].trim();
        result[sectionName] = sectionContent;
      }
    }

    const hintsSection = result.hints || '';
    if (hintsSection) {
      const hints = hintsSection.split(/\n?(?:^###\s+Hint \d+\s*$|^\*\s+)/gm).map(h => h.trim()).filter(Boolean);
      if (hints.length > 0) {
        hintsArray = hints;
      }
    }

    if (type === 'exercise') {
      if (Object.keys(result).length > 1) {
        delete result.main;
      }

      if (result.problem) {
        result.content = result.problem;
        delete result.problem;
      }
    }

    return result;
  }

  function handleToggleSolution() {
    if (!showSolution) {
      solutionRevealProgress = 0;
      const interval = setInterval(() => {
        solutionRevealProgress += 5;
        if (solutionRevealProgress >= 100) {
          clearInterval(interval);
          showSolution = true;
        }
      }, 100);
    } else {
      showSolution = false;
      solutionRevealProgress = 0;
    }
  }

  function handleToggleNotes() {
    showNotes = !showNotes;
    notesAreEditable = showNotes && notesAreEditable;
  }

  function handleEditNotes() {
    notesAreEditable = true;
  }

  function handleSaveNotes() {
    notesAreEditable = false;
    if (item) {
      saveUserProgress(isCompleted ? 'completed' : 'inProgress');
    }
  }

  function handleMarkComplete() {
    if (!isCompleted) {
      saveUserProgress('completed');
    } else {
      saveUserProgress('reset');
    }
  }

  function toggleHint(index: number) {
    const hintId = `hint-${index}`;

    if (checkedHints.includes(hintId)) {
      checkedHints = checkedHints.filter((h: string) => h !== hintId);
    } else {
      checkedHints = [...checkedHints, hintId];
    }

    if (item) {
      saveUserProgress(isCompleted ? 'completed' : 'inProgress');
    }
  }

  function handleViewDetails() {
    if (!item) return;
    
    if (type === 'exercise' && item.id) {
      navigateToExercise(item.id);
    } else if (type === 'course' && item.id) {
      navigateToCourse(item.id);
    }
  }
</script>

<div class="content-viewer bg-surface dark:bg-surface-dark text-text dark:text-text-light p-4 sm:p-6 lg:p-8 rounded-squircle shadow-card flex flex-col h-full overflow-hidden" transition:slide>
  {#if item}
    <div class="flex-shrink-0 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <h2 class="text-xl sm:text-2xl font-jakarta font-semibold text-text dark:text-text-light truncate pr-4">
          {item.title}
        </h2>
        <div class="flex items-center space-x-2">
          <button
            on:click={handleViewDetails}
            class="text-cherry-600 hover:text-cherry-700 dark:hover:text-cherry-400 transition-colors p-1 rounded-full"
            aria-label="View full details"
          >
            <Icon icon="mdi:open-in-new" class="w-5 h-5" />
          </button>
          <button
            on:click={onBack}
            class="text-gray-400 hover:text-cherry-600 dark:hover:text-cherry-400 transition-colors p-1 rounded-full -mr-1"
            aria-label="Close viewer"
          >
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>
        </div>
      </div>
      {#if item.category}
        <span class="text-sm font-medium text-cherry-700 dark:text-cherry-500 bg-cherry-100 dark:bg-cherry-900/30 px-2.5 py-0.5 rounded-full mt-2 inline-block">
          {item.category}
        </span>
      {/if}
      {#if item.tags && item.tags.length > 0}
        <div class="mt-3 flex flex-wrap gap-2">
          {#each item.tags as tag}
            <span class="text-xs font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-900/30 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          {/each}
        </div>
      {/if}
    </div>

    <div class="flex-grow overflow-y-auto prose dark:prose-invert prose-cherry lg:prose-lg scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2 -mr-2">
      {#if type === 'exercise'}
        <UnifiedRenderer content={sections.content || sections.main} type="exercise" isNested={true} />
        
        {#if hintsArray && hintsArray.length > 0}
          <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 class="text-lg font-semibold mb-3">Hints</h3>
            <div class="space-y-3">
              {#each hintsArray as hint, i}
                <div class="hint-container">
                  <button 
                    class="flex items-center justify-between w-full p-3 text-left border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    on:click={() => toggleHint(i)}
                  >
                    <span class="font-medium">Hint {i + 1}</span>
                    <Icon icon={checkedHints.includes(`hint-${i}`) ? "mdi:chevron-up" : "mdi:chevron-down"} class="w-5 h-5" />
                  </button>
                  
                  {#if checkedHints.includes(`hint-${i}`)}
                    <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-md mt-1" transition:slide>
                      <UnifiedRenderer content={hint} />
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        {#if hasSolution}
          <div class="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-semibold">Solution</h3>
              <button 
                on:click={handleToggleSolution}
                class="px-3 py-1.5 text-sm font-medium rounded-md bg-cherry-100 dark:bg-cherry-900/30 text-cherry-700 dark:text-cherry-400 hover:bg-cherry-200 dark:hover:bg-cherry-800/50 transition-colors"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            </div>
            
            {#if solutionRevealProgress > 0 && !showSolution}
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                <div class="bg-cherry-600 dark:bg-cherry-500 h-2.5 rounded-full" style="width: {solutionRevealProgress}%"></div>
              </div>
            {/if}
            
            {#if showSolution}
              <div transition:slide>
                <UnifiedRenderer content={sections.solution} type="markdown" />
              </div>
            {:else if solutionRevealProgress > 0}
              <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-md" style="filter: blur({solutionBlurLevel - (solutionBlurLevel * solutionRevealProgress / 100)}px);">
                <UnifiedRenderer content={sections.solution} type="markdown" />
              </div>
            {/if}
          </div>
        {/if}
      {:else if type === 'course'}
        <UnifiedRenderer content={sections.content || sections.main} type="markdown" />
      {:else}
        <UnifiedRenderer content={sections.content || sections.main} type="markdown" />
      {/if}
    </div>

    <div class="flex-shrink-0 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-2">
        <button 
          on:click={handleToggleNotes}
          class="flex items-center text-sm font-medium text-cherry-600 dark:text-cherry-400 hover:text-cherry-700 dark:hover:text-cherry-300"
        >
          <Icon icon="mdi:note-text-outline" class="w-5 h-5 mr-1" />
          {showNotes ? 'Hide Notes' : 'Show Notes'}
        </button>
        
        <div class="flex items-center space-x-2">
          <button 
            on:click={handleMarkComplete}
            class="px-3 py-1.5 text-sm font-medium rounded-md {isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'} hover:opacity-90 transition-colors"
          >
            {isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
          
          {#if lastAttemptDate}
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Last attempt: {lastAttemptDate.toLocaleDateString()}
            </span>
          {/if}
          
          {#if startTime}
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Time: {formatTimeSpent(timeSpent)}
            </span>
          {/if}
        </div>
      </div>
      
      {#if showNotes}
        <div transition:slide>
          {#if notesAreEditable}
            <div class="mt-2">
              <textarea
                bind:value={userNotes}
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-surface dark:bg-surface-dark text-text dark:text-text-light focus:ring-cherry-500 focus:border-cherry-500 dark:focus:ring-cherry-400 dark:focus:border-cherry-400 min-h-[100px]"
                placeholder="Add your notes here..."
              ></textarea>
              <div class="flex justify-end mt-2">
                <button 
                  on:click={handleSaveNotes}
                  class="px-3 py-1.5 text-sm font-medium rounded-md bg-cherry-600 text-white hover:bg-cherry-700 dark:bg-cherry-500 dark:hover:bg-cherry-600 transition-colors"
                >
                  Save Notes
                </button>
              </div>
            </div>
          {:else}
            <div class="mt-2 p-3 border border-gray-200 dark:border-gray-700 rounded-md min-h-[50px] bg-gray-50 dark:bg-gray-800">
              {#if userNotes}
                <UnifiedRenderer content={userNotes} type="markdown" />
              {:else}
                <p class="text-gray-500 dark:text-gray-400 italic">No notes yet. Click "Edit" to add notes.</p>
              {/if}
              <div class="flex justify-end mt-2">
                <button 
                  on:click={handleEditNotes}
                  class="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    {#if type === 'exercise'}
      <div class="flex-shrink-0 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <ExerciseRating exerciseId={item.id} />
      </div>
    {/if}
  {:else}
    <div class="flex flex-col items-center justify-center h-full text-center text-text-secondary dark:text-text-secondary-light">
      <Icon icon="mdi:information-outline" class="w-12 h-12 mb-4 text-gray-400 dark:text-gray-500" />
      <p class="text-lg font-medium">Select an item</p>
      <p class="text-sm">Choose an exercise or course from the list to view its details here.</p>
    </div>
  {/if}
</div>