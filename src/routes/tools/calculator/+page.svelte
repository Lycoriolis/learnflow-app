<script lang="ts">
  import { calcDisplay, calcCurrentInput, calcOperator, calcPreviousValue, calcWaitingForSecondOperand } from '$lib/stores/pipStores';
  import { onMount, onDestroy } from 'svelte';

  let scientificMode = false;
  let showHistory = false;
  let calculationHistory: string[] = [];
  let angleMode: 'deg' | 'rad' = 'deg';

  // simple keypad layout
  const keys = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+']
  ];

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
  });

  function keyAriaLabel(key: any): string | undefined {
    if (key === '*') return 'multiply';
    if (key === '-') return 'subtract';
    if (key === '+') return 'add';
    if (key === '=') return 'equals';
    if (key === '.') return 'decimal point';
    if (typeof key === 'number') return String(key);
    return undefined;
  }

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

    // If user pressed '=' compute result
    if (nextOperator === '=') {
      if ($calcOperator && $calcPreviousValue !== null) {
        const result = performCalculation();
        calcDisplay.set(String(result));
        calcPreviousValue.set(null);
        calcOperator.set(null);
        calcWaitingForSecondOperand.set(false);
      }
      return;
    }

    // Normal operator flow: store prev value or compute pending operation
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
        result = currentValue === 0 ? NaN : prevValue / currentValue;
        break;
      case 'pow':
        result = Math.pow(prevValue, currentValue);
        break;
      default:
        return currentValue;
    }

    calculationHistory = [...calculationHistory, `${prevValue} ${$calcOperator} ${currentValue} = ${result}`];
    return result;
  }

  function handleScientificFunction(fn: string) {
    const currentValue = parseFloat($calcDisplay);
    let result: number;

    switch (fn) {
      case 'sin':
        result = angleMode === 'deg' ? Math.sin(currentValue * Math.PI / 180) : Math.sin(currentValue);
        break;
      case 'cos':
        result = angleMode === 'deg' ? Math.cos(currentValue * Math.PI / 180) : Math.cos(currentValue);
        break;
      case 'tan':
        result = angleMode === 'deg' ? Math.tan(currentValue * Math.PI / 180) : Math.tan(currentValue);
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
        calcDisplay.set(String(Math.PI));
        calculationHistory = [...calculationHistory, `π = ${Math.PI}`];
        return;
      case 'e':
        calcDisplay.set(String(Math.E));
        calculationHistory = [...calculationHistory, `e = ${Math.E}`];
        return;
      default:
        return;
    }

    calcDisplay.set(String(result));
    calcCurrentInput.set($calcDisplay);
    calculationHistory = [...calculationHistory, `${fn}(${currentValue}) = ${result}`];
  }

  function copyToClipboard() {
    navigator.clipboard?.writeText($calcDisplay);
  }

  function clearHistory() {
    calculationHistory = [];
  }

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
</script>

<div class="max-w-4xl mx-auto p-6">
  <div class="flex items-center justify-between mb-4">
    <div class="flex gap-3">
      <button
        class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-md hover:scale-105 focus:outline-none"
        on:click={() => (showHistory = !showHistory)}
        title={showHistory ? 'Hide history' : 'Show history'}
        aria-label={showHistory ? 'Hide history' : 'Show history'}
      >
        <i class="fas fa-history"></i>
      </button>

      <button
        class="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-600 to-orange-600 text-white shadow-md hover:scale-105 focus:outline-none"
        on:click={() => (scientificMode = !scientificMode)}
        title={scientificMode ? 'Switch to basic mode' : 'Switch to scientific mode'}
        aria-label={scientificMode ? 'Switch to basic mode' : 'Switch to scientific mode'}
      >
        <i class="fas fa-flask"></i>
      </button>
    </div>

    <p class="text-gray-600 dark:text-gray-300">Advanced calculator with scientific functions and calculation history</p>
  </div>

  <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800">
    <div class="relative mb-4">
      <input
        type="text"
        class="w-full text-right px-4 py-3 text-2xl font-mono bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
        bind:value={$calcDisplay}
        readonly
      />
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition"
        on:click={() => copyToClipboard()}
        title="Copy to clipboard"
        aria-label="Copy to clipboard"
      >
        <i class="fas fa-copy"></i>
      </button>
    </div>

    {#if scientificMode}
      <div class="grid grid-cols-4 gap-3 mb-4">
        <button class="calculator-btn bg-red-500 hover:bg-red-600 text-white" on:click={() => handleScientificFunction('sin')}>sin</button>
        <button class="calculator-btn bg-red-500 hover:bg-red-600 text-white" on:click={() => handleScientificFunction('cos')}>cos</button>
        <button class="calculator-btn bg-red-500 hover:bg-red-600 text-white" on:click={() => handleScientificFunction('tan')}>tan</button>
        <button class="calculator-btn bg-blue-500 hover:bg-blue-600 text-white" on:click={() => (angleMode = angleMode === 'deg' ? 'rad' : 'deg')}>{angleMode}</button>

        <button class="calculator-btn bg-red-500 hover:bg-red-600 text-white" on:click={() => handleScientificFunction('log')}>log</button>
        <button class="calculator-btn bg-red-500 hover:bg-red-600 text-white" on:click={() => handleScientificFunction('ln')}>ln</button>
        <button class="calculator-btn bg-blue-500 hover:bg-blue-600 text-white" on:click={() => handleScientificFunction('exp')}>exp</button>
        <button class="calculator-btn bg-blue-500 hover:bg-blue-600 text-white" on:click={() => handleScientificFunction('sqrt')}>√</button>

        <button class="calculator-btn bg-orange-500 hover:bg-orange-600 text-white" on:click={() => handleOperator('pow')}>x^y</button>
        <button class="calculator-btn bg-blue-500 hover:bg-blue-600 text-white" on:click={() => handleScientificFunction('pi')}>π</button>
        <button class="calculator-btn bg-blue-500 hover:bg-blue-600 text-white" on:click={() => handleScientificFunction('e')}>e</button>
        <div></div>
      </div>
    {/if}

    <div class="grid grid-cols-4 gap-3">
      <button class="calculator-btn bg-red-500 hover:bg-red-600 text-white" on:click={() => clearAll()}>AC</button>
      <button class="calculator-btn bg-gray-500 hover:bg-gray-600 text-white" on:click={() => { calcDisplay.set($calcDisplay.slice(0, -1) || '0'); }}>DEL</button>
      <button class="calculator-btn bg-gray-500 hover:bg-gray-600 text-white" on:click={() => handleOperator('pow')}>x^y</button>
      <button class="calculator-btn bg-yellow-500 hover:bg-yellow-600 text-white" on:click={() => handleOperator('/')}>/</button>

      {#each keys as row}
        {#each row as key}
          {#if key === '0'}
            <button
              class="calculator-btn col-span-2 bg-gray-700 hover:bg-gray-800 text-white"
              aria-label={keyAriaLabel(key)}
              on:click={() => inputDigit(String(key))}
            >
              {key}
            </button>
          {:else if key === '.'}
            <button
              class="calculator-btn bg-gray-600 hover:bg-gray-700 text-white"
              aria-label={keyAriaLabel(key)}
              on:click={() => inputDecimal()}
            >
              {key}
            </button>
          {:else if key === '='}
            <button
              class="calculator-btn bg-indigo-600 hover:bg-indigo-700 text-white"
              aria-label="equals"
              on:click={() => handleOperator('=')}
            >
              =
            </button>
          {:else}
            <button
              class="calculator-btn {['+','-','*','/'].includes(key) ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'} text-white"
              aria-label={keyAriaLabel(key)}
              on:click={() => {
                if (['+','-','*','/'].includes(key)) handleOperator(key);
                else inputDigit(String(key));
              }}
            >
              {#if key === '*'}<i class="fas fa-times"></i>{:else}{key}{/if}
            </button>
          {/if}
        {/each}
      {/each}
    </div>
  </div>

  {#if showHistory}
    <div class="mt-4 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-semibold"><i class="fas fa-history mr-2 text-indigo-500"></i>History</h3>
        <button class="text-sm text-gray-500 hover:text-indigo-500" on:click={() => clearHistory()}>Clear</button>
      </div>

      {#if calculationHistory.length === 0}
        <div class="text-center py-8 text-gray-500 italic">No calculations yet</div>
      {:else}
        <div class="space-y-2 max-h-64 overflow-y-auto">
          {#each calculationHistory as calc}
            <div class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="text-sm text-gray-600 dark:text-gray-300 font-mono">{calc}</div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .calculator-btn {
    @apply p-4 rounded-xl font-semibold shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50;
  }
</style>