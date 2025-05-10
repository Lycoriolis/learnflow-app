<!-- src/lib/components/exercises/types/WrittenExercise.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ContentMetadata } from '$lib/services/enhancedContentService';
  
  export let exercise: ContentMetadata;
  export let showFeedback = true;
  export let minWordCount = 50;
  export let maxWordCount = 500;
  export let withRubric = true;
  
  type RubricItem = {
    id: string;
    criteria: string;
    points: number;
    description?: string;
  };
  
  type SubmissionResult = {
    content: string;
    wordCount: number;
    meetsCriteria: boolean;
    selfAssessment?: Record<string, number>;
    feedback?: string;
  };
  
  const dispatch = createEventDispatcher<{
    submit: SubmissionResult;
    change: { content: string; wordCount: number };
  }>();
  
  // Exercise state
  let content = '';
  let rubric: RubricItem[] = [];
  let selfAssessment: Record<string, number> = {};
  let hasSubmitted = false;
  let wordCount = 0;
  let feedbackMessage = '';
  let isValid = false;
  
  // Initialize rubric if needed
  $: {
    if (exercise && withRubric) {
      if (exercise.rubric && Array.isArray(exercise.rubric)) {
        rubric = exercise.rubric.map((item, index) => ({
          id: item.id || `rubric-${index}`,
          criteria: item.criteria || `Criteria ${index + 1}`,
          points: item.points || 10,
          description: item.description || ''
        }));
      } else {
        // Default rubric if none provided
        rubric = [
          {
            id: 'content',
            criteria: 'Content Quality',
            points: 10,
            description: 'The response thoroughly addresses the topic with relevant and accurate information.'
          },
          {
            id: 'organization',
            criteria: 'Organization',
            points: 5,
            description: 'The response is logically organized with clear transitions between ideas.'
          },
          {
            id: 'language',
            criteria: 'Language Use',
            points: 5,
            description: 'The response demonstrates effective use of language with appropriate vocabulary and grammar.'
          }
        ];
      }
      
      // Initialize self-assessment with zeros
      rubric.forEach(item => {
        selfAssessment[item.id] = 0;
      });
    }
  }
  
  // Calculate word count and validate
  $: {
    wordCount = content ? content.trim().split(/\s+/).length : 0;
    isValid = wordCount >= minWordCount && wordCount <= maxWordCount;
  }
  
  function updateContent(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    content = target.value;
    
    // Dispatch change event
    dispatch('change', { content, wordCount });
  }
  
  function updateSelfAssessment(itemId: string, value: number) {
    selfAssessment[itemId] = value;
  }
  
  function submitExercise() {
    // Validate submission
    if (!isValid) {
      feedbackMessage = `Your response should be between ${minWordCount} and ${maxWordCount} words.`;
      return;
    }
    
    if (withRubric) {
      // Check if all rubric items have been assessed
      const allAssessed = Object.values(selfAssessment).every(value => value > 0);
      if (!allAssessed) {
        feedbackMessage = 'Please complete the self-assessment for all criteria.';
        return;
      }
    }
    
    // Mark as submitted
    hasSubmitted = true;
    
    // Generate feedback
    feedbackMessage = 'Your response has been submitted successfully.';
    
    // Dispatch submission event
    dispatch('submit', {
      content,
      wordCount,
      meetsCriteria: isValid,
      selfAssessment: withRubric ? selfAssessment : undefined,
      feedback: feedbackMessage
    });
  }
  
  function resetExercise() {
    content = '';
    hasSubmitted = false;
    feedbackMessage = '';
    
    // Reset self-assessment
    if (withRubric) {
      rubric.forEach(item => {
        selfAssessment[item.id] = 0;
      });
    }
  }
</script>

<div class="written-exercise">
  <!-- Instructions area -->
  <div class="instructions mb-4 prose prose-sm dark:prose-invert max-w-none">
    {#if exercise.description}
      <p class="text-gray-700 dark:text-gray-300">{exercise.description}</p>
    {/if}
  </div>
  
  <!-- Response area -->
  <div class="response-area mb-4">
    <div class="flex justify-between items-center mb-2">
      <label for="response" class="text-sm font-medium text-gray-700 dark:text-gray-300">Your Response</label>
      <div class="word-count text-xs {isValid ? 'text-gray-500 dark:text-gray-400' : 'text-red-500 dark:text-red-400'}">
        {wordCount} / {minWordCount}-{maxWordCount} words
      </div>
    </div>
    
    <textarea
      id="response"
      bind:value={content}
      on:input={updateContent}
      class="w-full min-h-[200px] p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y
        {isValid || content === '' ? 'border-gray-300 dark:border-gray-600' : 'border-red-300 dark:border-red-600'}
        {hasSubmitted ? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400' : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200'}"
      placeholder="Write your response here..."
      disabled={hasSubmitted}
    ></textarea>
    
    {#if !isValid && content !== ''}
      <p class="text-xs text-red-500 dark:text-red-400 mt-1">
        {wordCount < minWordCount ? 
          `Your response is too short. Please write at least ${minWordCount} words.` : 
          `Your response is too long. Please keep it under ${maxWordCount} words.`}
      </p>
    {/if}
  </div>
  
  <!-- Self-assessment rubric -->
  {#if withRubric}
    <div class="rubric-area mb-6 {hasSubmitted ? 'opacity-60' : ''}">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Self-Assessment</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Evaluate your response against the following criteria:</p>
      
      <div class="space-y-4">
        {#each rubric as item}
          <div class="rubric-item">
            <div class="flex justify-between items-start mb-1">
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">{item.criteria}</h4>
                {#if item.description}
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                {/if}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {selfAssessment[item.id]} / {item.points}
              </div>
            </div>
            
            <div class="rating-slider">
              <input
                type="range"
                min="0"
                max={item.points}
                step="1"
                value={selfAssessment[item.id]}
                on:input={(e) => updateSelfAssessment(item.id, parseInt((e.target as HTMLInputElement).value))}
                class="w-full accent-indigo-600 disabled:opacity-60"
                disabled={hasSubmitted}
                aria-label={`Rate your ${item.criteria.toLowerCase()}`}
              />
              
              <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
                <span>Not Meeting Expectations</span>
                <span>Meeting Expectations</span>
                <span>Exceeding Expectations</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Feedback message -->
  {#if feedbackMessage && showFeedback}
    <div class="feedback-message p-3 rounded-lg mb-4
      {hasSubmitted ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 
       'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0 mr-2">
          {#if hasSubmitted}
            <i class="fas fa-check-circle text-green-500 dark:text-green-400"></i>
          {:else}
            <i class="fas fa-exclamation-circle text-red-500 dark:text-red-400"></i>
          {/if}
        </div>
        <div>{feedbackMessage}</div>
      </div>
    </div>
  {/if}
  
  <!-- Action buttons -->
  <div class="action-buttons flex justify-between">
    <button 
      class="px-4 py-2 text-sm font-medium rounded-lg transition-colors
        {hasSubmitted ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300' : 
        'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:hover:bg-indigo-800 dark:text-indigo-300'}"
      on:click={hasSubmitted ? resetExercise : submitExercise}
    >
      {hasSubmitted ? 'Start Over' : 'Submit Response'}
    </button>
    
    {#if hasSubmitted}
      <button
        class="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        on:click={() => {
          // Here you would typically mark the exercise as completed and move on
          dispatch('submit', {
            content,
            wordCount,
            meetsCriteria: isValid,
            selfAssessment: withRubric ? selfAssessment : undefined,
            feedback: 'Response submitted and marked as completed.'
          });
        }}
      >
        Mark as Completed
      </button>
    {/if}
  </div>
</div>

<style>
  /* Custom styling for range input (slider) */
  input[type="range"] {
    -webkit-appearance: none;
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    margin: 10px 0;
  }
  
  :global(.dark) input[type="range"] {
    background: #374151;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
  }
  
  :global(.dark) input[type="range"]::-webkit-slider-thumb {
    background: #6366f1;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #4f46e5;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  
  :global(.dark) input[type="range"]::-moz-range-thumb {
    background: #6366f1;
  }
  
  /* Disabled state */
  input[type="range"]:disabled::-webkit-slider-thumb {
    background: #9ca3af;
  }
  
  :global(.dark) input[type="range"]:disabled::-webkit-slider-thumb {
    background: #6b7280;
  }
  
  input[type="range"]:disabled::-moz-range-thumb {
    background: #9ca3af;
  }
  
  :global(.dark) input[type="range"]:disabled::-moz-range-thumb {
    background: #6b7280;
  }
</style>
