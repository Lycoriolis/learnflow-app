<!-- filepath: /home/linux/learnflow-app/learnflow-app/src/routes/tools/calculator/+page.svelte -->
<script lang="ts">
  import { calcDisplay, calcCurrentInput, calcOperator, calcPreviousValue, calcWaitingForSecondOperand } from '$lib/stores/pipStores';
  import { onMount } from 'svelte';

  let scientificMode = false;
  let memoryValue = 0;
  let showHistory = false;
  let calculationHistory: string[] = [];
  let angleMode: 'deg' | 'rad' = 'deg';

  function inputDigit(digit: string) {
    if ($calcWaitingForSecondOperand) {
      calcDisplay.set(digit);
      calcWaitingForSecondOperand.set(false);
    } else {
      calcDisplay.set($calcDisplay === '0' ? digit : $calcDisplay + digit);
    }
    calcCurrentInput.set($calcDisplay);
  }

  function inputDecimal() {
    if ($calcWaitingForSecondOperand) {
      calcDisplay.set('0.');
      calcWaitingForSecondOperand.set(false);
      return;
    }

    if (!$calcDisplay.includes('.')) {
      calcDisplay.set($calcDisplay + '.');
      calcCurrentInput.set($calcDisplay);
    }
  }

  function clearAll() {
    calcDisplay.set('0');
    calcCurrentInput.set('');
    calcOperator.set(null);
    calcPreviousValue.set(null);
    calcWaitingForSecondOperand.set(false);
  }

  function handleOperator(nextOperator: string) {
    const inputValue = parseFloat($calcDisplay);

    if ($calcPreviousValue === null) {
      calcPreviousValue.set(inputValue);
    } else if ($calcOperator) {
      const result = performCalculation();
      calcDisplay.set(String(result));
      calcPreviousValue.set(result);
    }

    calcWaitingForSecondOperand.set(true);
    calcOperator.set(nextOperator);
  }

  function performCalculation(): number {
    const prevValue = $calcPreviousValue;
    const currentValue = parseFloat($calcDisplay);

    if (prevValue === null) return currentValue;

    let result: number;
    switch ($calcOperator) {
      case '+':
        result = prevValue + currentValue;
        break;
      case '-':
        result = prevValue - currentValue;
        break;
      case '*':
        result = prevValue * currentValue;
        break;
      case '/':
        result = prevValue / currentValue;
        break;
      case 'pow':
        result = Math.pow(prevValue, currentValue);
        break;
      default:
        return currentValue;
    }

    // Add to history
    calculationHistory = [...calculationHistory, `${prevValue} ${$calcOperator} ${currentValue} = ${result}`];
    return result;
  }

  function handleScientificFunction(fn: string) {
    const currentValue = parseFloat($calcDisplay);
    let result: number;

    switch (fn) {
      case 'sin':
        result = angleMode === 'deg' ? 
          Math.sin(currentValue * Math.PI / 180) : 
          Math.sin(currentValue);
        break;
      case 'cos':
        result = angleMode === 'deg' ? 
          Math.cos(currentValue * Math.PI / 180) : 
          Math.cos(currentValue);
        break;
      case 'tan':
        result = angleMode === 'deg' ? 
          Math.tan(currentValue * Math.PI / 180) : 
          Math.tan(currentValue);
        break;
      case 'sqrt':
        result = Math.sqrt(currentValue);
        break;
      case 'log':
        result = Math.log10(currentValue);
        break;
      case 'ln':
        result = Math.log(currentValue);
        break;
      case 'exp':
        result = Math.exp(currentValue);
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return;
    }

    calcDisplay.set(String(result));
    calcCurrentInput.set($calcDisplay);
    calculationHistory = [...calculationHistory, `${fn}(${currentValue}) = ${result}`];
  }

  function handleMemory(operation: string) {
    const currentValue = parseFloat($calcDisplay);
    
    switch (operation) {
      case 'MC':
        memoryValue = 0;
        break;
      case 'MR':
        calcDisplay.set(String(memoryValue));
        break;
      case 'M+':
        memoryValue += currentValue;
        break;
      case 'M-':
        memoryValue -= currentValue;
        break;
      case 'MS':
        memoryValue = currentValue;
        break;
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText($calcDisplay);
  }

  function clearHistory() {
    calculationHistory = [];
  }

  // Handle keyboard input
  function handleKeydown(event: KeyboardEvent) {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
      inputDigit(key);
    } else if (key === '.') {
      inputDecimal();
    } else if (['+', '-', '*', '/'].includes(key)) {
      handleOperator(key);
    } else if (key === 'Enter' || key === '=') {
      handleOperator('=');
    } else if (key === 'Escape') {
      clearAll();
    } else if (key === 'Backspace') {
      calcDisplay.set($calcDisplay.slice(0, -1) || '0');
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<svelte:head>
  <title>Scientific Calculator | LearnFlow</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-10">
  <div class="flex justify-between items-start mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
        <i class="fas fa-calculator mr-3 text-purple-500"></i> Scientific Calculator
      </h1>
      <p class="text-gray-600 dark:text-gray-400">Advanced calculator with scientific functions</p>
    </div>
    <div class="flex gap-2">
      <button 
        class="text-sm px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        on:click={() => showHistory = !showHistory}
      >
        <i class="fas fa-history mr-2"></i> History
      </button>
      <button 
        class="text-sm px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        on:click={() => scientificMode = !scientificMode}
      >
        {scientificMode ? 'Basic' : 'Scientific'}
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 {showHistory ? 'lg:grid-cols-3' : ''} gap-8">
    <div class="lg:col-span-2">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <!-- Display -->
        <div class="mb-4 relative">
          <input
            type="text"
            class="w-full text-right px-4 py-3 text-2xl font-mono bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg"
            bind:value={$calcDisplay}
            readonly
          >
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            on:click={copyToClipboard}
            title="Copy to clipboard"
          >
            <i class="fas fa-copy"></i>
          </button>
        </div>

        {#if scientificMode}
          <!-- Scientific Functions -->
          <div class="grid grid-cols-4 gap-2 mb-4">
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleScientificFunction('sin')}
            >sin</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleScientificFunction('cos')}
            >cos</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleScientificFunction('tan')}
            >tan</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => angleMode = angleMode === 'deg' ? 'rad' : 'deg'}
            >{angleMode}</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleScientificFunction('log')}
            >log</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleScientificFunction('ln')}
            >ln</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleScientificFunction('exp')}
            >exp</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleScientificFunction('sqrt')}
            >√</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleOperator('pow')}
            >x^y</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleScientificFunction('pi')}
            >π</button>
            <button 
              class="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              on:click={() => handleScientificFunction('e')}
            >e</button>
          </div>

          <!-- Memory Functions -->
          <div class="grid grid-cols-5 gap-2 mb-4">
            <button 
              class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              on:click={() => handleMemory('MC')}
            >MC</button>
            <button 
              class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              on:click={() => handleMemory('MR')}
            >MR</button>
            <button 
              class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              on:click={() => handleMemory('M+')}
            >M+</button>
            <button 
              class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              on:click={() => handleMemory('M-')}
            >M-</button>
            <button 
              class="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
              on:click={() => handleMemory('MS')}
            >MS</button>
          </div>
        {/if}

        <!-- Basic Calculator Grid -->
        <div class="grid grid-cols-4 gap-2">
          <button
            class="p-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
            on:click={clearAll}
          >AC</button>
          <button
            class="p-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            on:click={() => calcDisplay.set(String(-parseFloat($calcDisplay)))}
          >±</button>
          <button
            class="p-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            on:click={() => calcDisplay.set(String(parseFloat($calcDisplay) / 100))}
          >%</button>
          <button
            class="p-4 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            on:click={() => handleOperator('/')}
          >÷</button>
          
          {#each [7, 8, 9, '*', 4, 5, 6, '-', 1, 2, 3, '+', 0, '.', '='] as key}
            {@const isOperator = ['*', '-', '+', '='].includes(String(key))}
            {@const isZero = key === 0}
            <button
              class="p-4 {isOperator ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 hover:bg-gray-700'} 
                     text-white rounded transition {isZero ? 'col-span-2' : ''}"
              on:click={() => {
                if (typeof key === 'number' || key === '.') {
                  key === '.' ? inputDecimal() : inputDigit(String(key));
                } else {
                  handleOperator(key);
                }
              }}
            >
              {#if key === '*'}<i class="fas fa-times"></i>
              {:else if key === '-'}<i class="fas fa-minus"></i>
              {:else if key === '+'}<i class="fas fa-plus"></i>
              {:else if key === '='}<i class="fas fa-equals"></i>
              {:else}{key}{/if}
            </button>
          {/each}
        </div>
      </div>
    </div>

    {#if showHistory}
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">History</h3>
            <button
              class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              on:click={clearHistory}
            >
              Clear
            </button>
          </div>
          {#if calculationHistory.length === 0}
            <p class="text-gray-500 dark:text-gray-400 text-sm">No calculations yet</p>
          {:else}
            <div class="space-y-2">
              {#each calculationHistory as calc}
                <div class="text-sm text-gray-600 dark:text-gray-300 font-mono">{calc}</div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>