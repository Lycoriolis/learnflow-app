<!-- src/lib/components/exercises/types/MultipleChoiceExercise.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { ContentMetadata } from '$lib/services/enhancedContentService';
  
  export let exercise: ContentMetadata;
  export let showFeedback = true;
  export let allowMultipleSelections = false;
  
  type Option = {
    id: string;
    text: string;
    isCorrect: boolean;
  };
  
  type SubmissionResult = {
    correct: boolean;
    score: number;
    selectedOptions: string[];
    feedback?: string;
  };
  
  const dispatch = createEventDispatcher<{
    submit: SubmissionResult;
    change: { selectedOptions: string[] };
  }>();
  
  // Parse options from exercise content or frontmatter
  let options: Option[] = [];
  let selectedOptions: string[] = [];
  let feedbackMessage = '';
  let hasSubmitted = false;
  let isCorrect = false;
  
  $: {
    // Extract options from exercise.options if available, otherwise from content
    if (exercise.options && Array.isArray(exercise.options)) {
      options = exercise.options.map((opt, index) => ({
        id: typeof opt.id === 'string' ? opt.id : `option-${index}`,
        text: opt.text || '',
        isCorrect: opt.isCorrect || false
      }));
    } else {
      // If no options are provided, try to parse from content
      const parsedOptions = parseOptionsFromContent(exercise.content || '');
      if (parsedOptions.length > 0) {
        options = parsedOptions;
      } else {
        // Fallback to sample options for development
        options = [
          { id: 'option-1', text: 'Sample option 1', isCorrect: true },
          { id: 'option-2', text: 'Sample option 2', isCorrect: false },
          { id: 'option-3', text: 'Sample option 3', isCorrect: false },
          { id: 'option-4', text: 'Sample option 4', isCorrect: false }
        ];
      }
    }
  }
  
  function parseOptionsFromContent(content: string): Option[] {
    // This would parse markdown content with a specific format for options
    // For example: "- [x] Correct option" or "- [ ] Incorrect option"
    const optionRegex = /^\s*-\s*\[([ x])\]\s*(.+)$/gm;
    const parsedOptions: Option[] = [];
    
    let match;
    let index = 0;
    
    while ((match = optionRegex.exec(content)) !== null) {
      parsedOptions.push({
        id: `option-${index}`,
        text: match[2].trim(),
        isCorrect: match[1] === 'x'
      });
      index++;
    }
    
    return parsedOptions;
  }
  
  function handleOptionSelect(optionId: string) {
    if (!allowMultipleSelections) {
      selectedOptions = [optionId];
    } else {
      if (selectedOptions.includes(optionId)) {
        selectedOptions = selectedOptions.filter(id => id !== optionId);
      } else {
        selectedOptions = [...selectedOptions, optionId];
      }
    }
    
    // Dispatch change event
    dispatch('change', { selectedOptions });
  }
  
  function submitAnswer() {
    // Calculate correctness
    const correctOptionIds = options
      .filter(option => option.isCorrect)
      .map(option => option.id);
    
    // For exact matching: all correct options must be selected, and no incorrect ones
    const allCorrectSelected = correctOptionIds.every(id => selectedOptions.includes(id));
    const noIncorrectSelected = selectedOptions.every(id => correctOptionIds.includes(id));
    isCorrect = allCorrectSelected && noIncorrectSelected;
    
    // Calculate partial score for multiple selection questions
    let score = 0;
    if (allowMultipleSelections) {
      // Count correct selections
      const correctSelections = selectedOptions.filter(id => correctOptionIds.includes(id)).length;
      // Count incorrect selections
      const incorrectSelections = selectedOptions.length - correctSelections;
      
      // Score formula: (correct selections - incorrect selections) / total correct options
      // This penalizes both missing correct options and selecting incorrect ones
      score = Math.max(0, (correctSelections - incorrectSelections) / correctOptionIds.length);
      score = Math.min(1, score); // Cap at 1.0 (100%)
    } else {
      // For single selection, it's all or nothing
      score = isCorrect ? 1 : 0;
    }
    
    // Generate feedback
    if (isCorrect) {
      feedbackMessage = 'Correct! Well done.';
    } else if (score > 0) {
      feedbackMessage = 'Partially correct. Review the correct answers.';
    } else {
      feedbackMessage = 'Incorrect. Try again or review the material.';
    }
    
    // Mark as submitted
    hasSubmitted = true;
    
    // Dispatch submission event
    dispatch('submit', {
      correct: isCorrect,
      score,
      selectedOptions,
      feedback: feedbackMessage
    });
  }
  
  function resetExercise() {
    selectedOptions = [];
    feedbackMessage = '';
    hasSubmitted = false;
    isCorrect = false;
  }
</script>

<div class="multiple-choice-exercise">
  <div class="mb-4 prose prose-sm dark:prose-invert max-w-none">
    <!-- Exercise description/question -->
    {#if exercise.description}
      <p class="text-gray-700 dark:text-gray-300">{exercise.description}</p>
    {/if}
  </div>
  
  <!-- Options list -->
  <div class="options-list space-y-3 mb-6">
    {#each options as option}
      <div 
        class="option flex items-start p-3 border rounded-lg cursor-pointer transition-colors
          {selectedOptions.includes(option.id) ? 'selected' : ''} 
          {hasSubmitted && option.isCorrect ? 'correct' : ''} 
          {hasSubmitted && selectedOptions.includes(option.id) && !option.isCorrect ? 'incorrect' : ''} 
          {hasSubmitted ? 'disabled' : ''}
          {!hasSubmitted && !selectedOptions.includes(option.id) ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' : ''} 
          {!hasSubmitted && selectedOptions.includes(option.id) ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/30' : ''} 
          {hasSubmitted && option.isCorrect ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30' : ''} 
          {hasSubmitted && selectedOptions.includes(option.id) && !option.isCorrect ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30' : ''}"
        on:click={() => !hasSubmitted && handleOptionSelect(option.id)}
        on:keydown={(e) => !hasSubmitted && e.key === 'Enter' && handleOptionSelect(option.id)}
        role="radio"
        aria-checked={selectedOptions.includes(option.id)}
        tabindex="0"
      >
        <div class="option-checkbox flex-shrink-0 mr-3 mt-0.5">
          {#if allowMultipleSelections}
            <div class="w-5 h-5 border rounded transition-colors flex items-center justify-center
              {hasSubmitted && option.isCorrect ? 'border-green-500 dark:border-green-400' : 
               hasSubmitted && selectedOptions.includes(option.id) && !option.isCorrect ? 'border-red-500 dark:border-red-400' :
               selectedOptions.includes(option.id) ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-100 dark:bg-indigo-900' : 
               'border-gray-300 dark:border-gray-600'}"
            >
              {#if selectedOptions.includes(option.id)}
                <i class="fas fa-check text-xs
                  {hasSubmitted && option.isCorrect ? 'text-green-500 dark:text-green-400' : 
                   hasSubmitted && !option.isCorrect ? 'text-red-500 dark:text-red-400' : 
                   'text-indigo-500 dark:text-indigo-400'}"></i>
              {/if}
            </div>
          {:else}
            <div class="w-5 h-5 border rounded-full transition-colors flex items-center justify-center
              {hasSubmitted && option.isCorrect ? 'border-green-500 dark:border-green-400' : 
               hasSubmitted && selectedOptions.includes(option.id) && !option.isCorrect ? 'border-red-500 dark:border-red-400' :
               selectedOptions.includes(option.id) ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-100 dark:bg-indigo-900' : 
               'border-gray-300 dark:border-gray-600'}"
            >
              {#if selectedOptions.includes(option.id)}
                <div class="w-3 h-3 rounded-full
                  {hasSubmitted && option.isCorrect ? 'bg-green-500 dark:bg-green-400' : 
                   hasSubmitted && !option.isCorrect ? 'bg-red-500 dark:bg-red-400' : 
                   'bg-indigo-500 dark:bg-indigo-400'}"></div>
              {/if}
            </div>
          {/if}
        </div>
        
        <div class="option-text flex-grow">
          <span class="text-sm {hasSubmitted && option.isCorrect ? 'text-green-700 dark:text-green-300' : 
                                hasSubmitted && selectedOptions.includes(option.id) && !option.isCorrect ? 'text-red-700 dark:text-red-300' : 
                                'text-gray-700 dark:text-gray-300'}"
          >{option.text}</span>
          
          {#if hasSubmitted && option.isCorrect}
            <div class="text-xs text-green-600 dark:text-green-400 mt-1">
              <i class="fas fa-check-circle mr-1"></i> Correct option
            </div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  
  <!-- Feedback message -->
  {#if hasSubmitted && showFeedback}
    <div class="feedback-message p-3 rounded-lg mb-4
      {isCorrect ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 
       'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0 mr-2">
          {#if isCorrect}
            <i class="fas fa-check-circle text-green-500 dark:text-green-400"></i>
          {:else}
            <i class="fas fa-times-circle text-red-500 dark:text-red-400"></i>
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
      on:click={hasSubmitted ? resetExercise : submitAnswer}
    >
      {hasSubmitted ? 'Try Again' : 'Submit Answer'}
    </button>
    
    {#if hasSubmitted}
      <button
        class="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        on:click={() => {
          // Here you would typically mark the exercise as completed and move on
          // For now, we'll just reset the exercise
          resetExercise();
          // Emit an event that could be caught by a parent component to advance
          dispatch('submit', { 
            correct: isCorrect, 
            score: isCorrect ? 1 : 0, 
            selectedOptions,
            feedback: feedbackMessage
          });
        }}
      >
        Continue
      </button>
    {/if}
  </div>
</div>

<style>
  .option {
    position: relative;
    overflow: hidden;
  }
  
  .option.disabled {
    cursor: default;
  }
  
  .option:hover:not(.disabled) {
    background-color: rgba(79, 70, 229, 0.05);
  }
  
  .option:focus {
    outline: 2px solid rgba(79, 70, 229, 0.5);
    outline-offset: 2px;
  }
  
  /* Styling for different states handled via Tailwind classes in the template */
</style>
