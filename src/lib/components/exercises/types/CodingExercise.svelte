<!-- src/lib/components/exercises/types/CodingExercise.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import type { ContentMetadata } from '$lib/services/enhancedContentService';
  
  export let exercise: ContentMetadata;
  export let showHints = true;
  export let autoEvaluate = true;
  
  type TestCase = {
    id: string;
    input: any;
    expected: any;
    description?: string;
    hidden?: boolean;
  };
  
  type SubmissionResult = {
    success: boolean;
    testResults: TestResult[];
    score: number;
    feedback?: string;
    code: string;
  };
  
  type TestResult = {
    id: string;
    passed: boolean;
    message?: string;
    input?: any;
    expected?: any;
    actual?: any;
  };
  
  const dispatch = createEventDispatcher<{
    submit: SubmissionResult;
    codeChange: { code: string };
  }>();
  
  // Exercise state
  let code = '';
  let testCases: TestCase[] = [];
  let language = 'javascript';
  let boilerplateCode = '';
  let showHintSection = false;
  let currentHintIndex = 0;
  let testResults: TestResult[] = [];
  let hasSubmitted = false;
  let isEvaluating = false;
  let overallSuccess = false;
  let errorMessage = '';
  let hints: string[] = [];
  
  // Editor options
  let editorHeight = 'min-h-[300px]';
  let editorTheme = 'vs-dark';
  let consoleOutput = '';
  let showConsole = false;
  
  // Initialize exercise data
  $: {
    if (exercise) {
      language = exercise.language || 'javascript';
      
      // Extract test cases from exercise
      if (exercise.testCases && Array.isArray(exercise.testCases)) {
        testCases = exercise.testCases.map((test, index) => ({
          id: test.id || `test-${index}`,
          input: test.input,
          expected: test.expected,
          description: test.description || `Test case ${index + 1}`,
          hidden: test.hidden || false
        }));
      } else {
        // Create default test cases if none provided
        testCases = [
          { 
            id: 'test-1', 
            input: [1, 2, 3], 
            expected: 6, 
            description: 'Should sum all numbers in the array',
            hidden: false
          },
          { 
            id: 'test-2', 
            input: [5, 5], 
            expected: 10, 
            description: 'Should handle basic addition',
            hidden: false
          },
          { 
            id: 'test-3', 
            input: [], 
            expected: 0, 
            description: 'Should handle empty arrays',
            hidden: true
          }
        ];
      }
      
      // Extract code template/boilerplate
      boilerplateCode = extractBoilerplateCode(exercise.content || '');
      
      if (boilerplateCode) {
        code = boilerplateCode;
      } else {
        // Default code template based on language
        code = getDefaultCodeTemplate(language);
      }
      
      // Extract hints
      hints = exercise.hints || [];
    }
  }
  
  onMount(() => {
    // In a real implementation, this would initialize the code editor
    // For now, we're simulating the experience
    
    // Mock editor setup
    setTimeout(() => {
      // Normally you'd have an actual editor initialized here
      // For example: monaco.editor.create(editorElement, { ... });
    }, 100);
  });
  
  function extractBoilerplateCode(content: string): string {
    // Try to find code blocks in the markdown content
    const codeBlockRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    const match = codeBlockRegex.exec(content);
    
    if (match && match[2]) {
      // Found a code block
      if (match[1]) {
        // If language was specified in the code block, update our language
        language = match[1].trim().toLowerCase();
      }
      return match[2].trim();
    }
    
    return '';
  }
  
  function getDefaultCodeTemplate(lang: string): string {
    switch (lang.toLowerCase()) {
      case 'javascript':
        return `// Write your solution here
function solution(input) {
  // Your code here
  return 0;
}

// Don't edit below this line
module.exports = solution;`;
      case 'python':
        return `# Write your solution here
def solution(input):
    # Your code here
    return 0

# Don't edit below this line`;
      case 'java':
        return `// Write your solution here
public class Solution {
    public static int solution(int[] input) {
        // Your code here
        return 0;
    }
}`;
      default:
        return `// Write your solution in ${lang}`;
    }
  }
  
  function handleCodeChange(newCode: string) {
    code = newCode;
    dispatch('codeChange', { code });
    
    if (autoEvaluate && hasSubmitted) {
      // Re-evaluate code when it changes after first submission
      evaluateCode();
    }
  }
  
  function showNextHint() {
    if (currentHintIndex < hints.length - 1) {
      currentHintIndex++;
    }
  }
  
  function evaluateCode() {
    // Reset state
    isEvaluating = true;
    errorMessage = '';
    testResults = [];
    
    // In a real implementation, this would send the code to a backend service
    // For now, we'll simulate evaluation with a timeout
    
    setTimeout(() => {
      try {
        // Mock evaluation
        if (language === 'javascript') {
          evaluateJavaScript();
        } else {
          // For other languages, just simulate results
          simulateTestResults();
        }
        
        // Calculate overall success
        overallSuccess = testResults.every(result => result.passed);
        
        // Generate console output (in a real app this would come from the evaluated code)
        consoleOutput = `Running tests...\n${testResults.map(r => 
          `Test "${r.description || r.id}": ${r.passed ? 'PASSED' : 'FAILED'}`
        ).join('\n')}`;
        
        if (overallSuccess) {
          consoleOutput += '\n\nAll tests passed! Great job!';
        } else {
          consoleOutput += '\n\nSome tests failed. Check the test results for details.';
        }
        
        // Show console when there are results
        showConsole = true;
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'An error occurred during evaluation';
        consoleOutput = `Error: ${errorMessage}`;
        showConsole = true;
      } finally {
        isEvaluating = false;
        hasSubmitted = true;
        
        // Dispatch submission result
        dispatch('submit', {
          success: overallSuccess,
          testResults,
          score: calculateScore(),
          feedback: overallSuccess ? 'All tests passed!' : 'Some tests failed. Check the test results for details.',
          code
        });
      }
    }, 800);
  }
  
  function evaluateJavaScript() {
    // This is a simplified mock evaluation
    // In a real app, you'd use a more sophisticated method, possibly with a sandbox
    
    testResults = testCases.map(test => {
      // Mock evaluation logic - in reality, this would execute the code safely
      let passed = false;
      let actual;
      
      // Very basic code evaluation simulation
      if (code.includes('return input.reduce((sum, num) => sum + num, 0)')) {
        // Correct implementation for summing array
        actual = Array.isArray(test.input) ? test.input.reduce((sum, num) => sum + num, 0) : 0;
        passed = actual === test.expected;
      } else if (code.includes('input.reduce') || code.includes('for') || code.includes('forEach')) {
        // Partially correct implementation
        actual = Math.random() > 0.5 ? test.expected : test.expected - 1;
        passed = actual === test.expected;
      } else {
        // Incorrect/incomplete implementation
        actual = 0;
        passed = actual === test.expected && test.expected === 0;
      }
      
      return {
        id: test.id,
        passed,
        message: passed ? 'Test passed!' : `Expected ${test.expected} but got ${actual}`,
        input: test.hidden ? '[hidden]' : test.input,
        expected: test.hidden ? '[hidden]' : test.expected,
        actual: test.hidden ? '[hidden]' : actual,
        description: test.description
      };
    });
  }
  
  function simulateTestResults() {
    // For languages we can't evaluate in the browser, simulate results
    testResults = testCases.map(test => {
      // Random success based on how complete the code looks
      const codeCompleteness = code.length > 50 ? 0.8 : 0.3;
      const passed = Math.random() < codeCompleteness;
      
      return {
        id: test.id,
        passed,
        message: passed ? 'Test passed!' : `Expected ${test.expected} but got something else`,
        input: test.hidden ? '[hidden]' : test.input,
        expected: test.hidden ? '[hidden]' : test.expected,
        actual: test.hidden ? '[hidden]' : passed ? test.expected : `[${test.expected} + ${Math.floor(Math.random() * 5) - 2}]`,
        description: test.description
      };
    });
  }
  
  function calculateScore(): number {
    if (testResults.length === 0) return 0;
    
    const passedTests = testResults.filter(result => result.passed).length;
    return passedTests / testResults.length;
  }
  
  function resetExercise() {
    code = boilerplateCode || getDefaultCodeTemplate(language);
    testResults = [];
    hasSubmitted = false;
    overallSuccess = false;
    errorMessage = '';
    consoleOutput = '';
    showConsole = false;
  }
  
  function toggleHints() {
    showHintSection = !showHintSection;
  }
</script>

<div class="coding-exercise">
  <!-- Instructions area -->
  <div class="instructions mb-4 prose prose-sm dark:prose-invert max-w-none">
    {#if exercise.description}
      <p class="text-gray-700 dark:text-gray-300">{exercise.description}</p>
    {/if}
  </div>
  
  <!-- Code editor -->
  <div class="code-editor-container mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <!-- Editor toolbar -->
    <div class="editor-toolbar bg-gray-100 dark:bg-gray-800 p-2 flex justify-between items-center">
      <div class="language-indicator text-xs font-mono text-gray-600 dark:text-gray-400 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
        {language.toUpperCase()}
      </div>
      <div class="editor-actions">
        <button 
          class="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          on:click={resetExercise}
          aria-label="Reset code"
        >
          <i class="fas fa-undo mr-1"></i> Reset
        </button>
      </div>
    </div>
    
    <!-- Mock code editor - in a real app, this would be replaced with a proper editor -->
    <div class="code-editor-mock bg-gray-900 dark:bg-gray-950 p-3 {editorHeight} font-mono text-sm">
      <textarea 
        bind:value={code}
        on:input={() => handleCodeChange(code)}
        class="w-full h-full bg-transparent text-gray-300 dark:text-gray-200 focus:outline-none resize-none"
        spellcheck="false"
        aria-label="Code editor"
      ></textarea>
    </div>
  </div>
  
  <!-- Submission and Testing area -->
  <div class="submission-area">
    <div class="flex justify-between items-center mb-3">
      <button 
        class="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        on:click={evaluateCode}
        disabled={isEvaluating}
      >
        {#if isEvaluating}
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Evaluating...
        {:else}
          <i class="fas fa-play mr-2"></i>
          Run Tests
        {/if}
      </button>
      
      {#if hints.length > 0 && showHints}
        <button 
          class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center"
          on:click={toggleHints}
          aria-expanded={showHintSection}
        >
          <i class="fas fa-lightbulb mr-1"></i>
          {showHintSection ? 'Hide Hints' : 'Show Hints'}
        </button>
      {/if}
    </div>
    
    <!-- Hints section -->
    {#if showHintSection && hints.length > 0}
      <div class="hints-section mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3"
        transition:fly={{ y: -20, duration: 150 }}
      >
        <h3 class="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center">
          <i class="fas fa-lightbulb mr-2"></i> Hint {currentHintIndex + 1} of {hints.length}
        </h3>
        
        <p class="text-sm text-amber-700 dark:text-amber-200 mb-2">{hints[currentHintIndex]}</p>
        
        {#if currentHintIndex < hints.length - 1}
          <button 
            class="text-xs text-amber-600 dark:text-amber-300 hover:underline"
            on:click={showNextHint}
          >
            Show next hint <i class="fas fa-chevron-right ml-1"></i>
          </button>
        {/if}
      </div>
    {/if}
    
    <!-- Test results -->
    {#if hasSubmitted && testResults.length > 0}
      <div class="test-results mb-4">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Test Results</h3>
        
        <div class="space-y-2">
          {#each testResults as result}
            <div class="test-result p-2 border rounded-lg
              {result.passed ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : 
                             'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'}"
            >
              <div class="flex justify-between">
                <div class="flex items-center">
                  {#if result.passed}
                    <i class="fas fa-check-circle text-green-500 dark:text-green-400 mr-2"></i>
                  {:else}
                    <i class="fas fa-times-circle text-red-500 dark:text-red-400 mr-2"></i>
                  {/if}
                  
                  <span class="text-sm font-medium
                    {result.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}"
                  >
                    {result.description || result.id}
                  </span>
                </div>
                
                <!-- Expand/collapse details button -->
              </div>
              
              <!-- Test details - could be expanded in a real implementation -->
              <div class="test-details mt-1 pl-6 text-xs">
                <div>
                  <span class="font-medium text-gray-600 dark:text-gray-400">Input:</span>
                  <span class="ml-1 font-mono">{JSON.stringify(result.input)}</span>
                </div>
                
                <div>
                  <span class="font-medium text-gray-600 dark:text-gray-400">Expected:</span>
                  <span class="ml-1 font-mono">{JSON.stringify(result.expected)}</span>
                </div>
                
                {#if !result.passed}
                  <div>
                    <span class="font-medium text-gray-600 dark:text-gray-400">Actual:</span>
                    <span class="ml-1 font-mono">{JSON.stringify(result.actual)}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Console output -->
    {#if showConsole && consoleOutput}
      <div class="console-output mb-4">
        <div class="flex justify-between items-center mb-1">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Console Output</h3>
          <button 
            class="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            on:click={() => showConsole = false}
            aria-label="Close console output"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <pre class="text-xs font-mono bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-2 rounded-lg max-h-32 overflow-y-auto">{consoleOutput}</pre>
      </div>
    {/if}
    
    <!-- Error message -->
    {#if errorMessage}
      <div class="error-message mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
        <div class="flex items-start">
          <i class="fas fa-exclamation-triangle text-red-500 dark:text-red-400 mr-2 mt-0.5"></i>
          <span>{errorMessage}</span>
        </div>
      </div>
    {/if}
    
    <!-- Action buttons -->
    {#if hasSubmitted}
      <div class="action-buttons flex justify-between mt-4">
        <button 
          class="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg transition-colors"
          on:click={resetExercise}
        >
          Reset Exercise
        </button>
        
        {#if overallSuccess}
          <button
            class="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            on:click={() => {
              // In a real app, this would mark the exercise as completed and move on
              dispatch('submit', {
                success: overallSuccess,
                testResults,
                score: calculateScore(),
                feedback: 'All tests passed!',
                code
              });
            }}
          >
            Continue
          </button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  /* Custom scrollbar for textarea and console output */
  textarea::-webkit-scrollbar,
  pre::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  textarea::-webkit-scrollbar-track,
  pre::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  
  textarea::-webkit-scrollbar-thumb,
  pre::-webkit-scrollbar-thumb {
    background: rgba(120, 120, 120, 0.5);
    border-radius: 4px;
  }
  
  textarea::-webkit-scrollbar-thumb:hover,
  pre::-webkit-scrollbar-thumb:hover {
    background: rgba(120, 120, 120, 0.8);
  }
</style>
