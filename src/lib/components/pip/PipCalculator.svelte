<script lang="ts">
  import {
    calcDisplay,
    calcCurrentInput,
    calcOperator,
    calcPreviousValue,
    calcWaitingForSecondOperand
  } from '$lib/stores/pipStores.js';

  const performCalculation: Record<string, (a: number, b: number) => number> = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand // Handles pressing equals multiple times
  };

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
    }
     calcCurrentInput.set($calcDisplay);
  }

  function handleOperator(nextOperator: string) {
    const inputValue = parseFloat($calcDisplay);

    if ($calcOperator && $calcWaitingForSecondOperand) {
      calcOperator.set(nextOperator);
      return;
    }

    if ($calcPreviousValue === null) {
      calcPreviousValue.set(inputValue);
    } else if ($calcOperator) {
      const currentValue = $calcPreviousValue || 0;
      const result = performCalculation[$calcOperator](currentValue, inputValue);

      calcDisplay.set(String(parseFloat(result.toFixed(7)))); // Limit precision
      calcPreviousValue.set(result);
    }

    calcWaitingForSecondOperand.set(true);
    calcOperator.set(nextOperator);
  }

  function clearAll() {
    calcDisplay.set('0');
    calcCurrentInput.set('');
    calcOperator.set(null);
    calcPreviousValue.set(null);
    calcWaitingForSecondOperand.set(false);
  }

  // Map button clicks to functions
  function handleButtonClick(key: string) {
      if (/\d/.test(key)) {
          inputDigit(key);
      } else if (key === '.') {
          inputDecimal();
      } else if (key === 'AC') {
          clearAll();
      } else if (['/', '*', '+', '-', '='].includes(key)) {
          handleOperator(key);
      }
      // Add other functions like +/- or % if needed
  }

  const buttons = [
      'AC', '+/-', '%', '/',
      '7', '8', '9', '*',
      '4', '5', '6', '-',
      '1', '2', '3', '+',
      '0', '.', '='
  ];

</script>

<div class="bg-gray-700 p-2 rounded-lg">
   <h4 class="text-xs font-medium text-purple-300 uppercase mb-2">Calculator</h4>
   <input
     type="text"
     class="w-full text-right mb-2 px-2 py-1 border-0 focus:ring-0 text-xl font-mono bg-gray-800 text-gray-100 rounded-md"
     bind:value={$calcDisplay}
     readonly
   >
   <div class="grid grid-cols-4 gap-1">
      {#each buttons as key}
        {@const isOperator = ['/', '*', '-', '+', '='].includes(key)}
        {@const isZero = key === '0'}
        {@const isClear = key === 'AC'}
        <button
          on:click={() => handleButtonClick(key)}
          class="p-2 rounded text-sm font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-700
                 {isZero ? 'col-span-2' : ''}
                 {isOperator ? 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-400' : ''}
                 {isClear ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-400' : ''}
                 {!isOperator && !isClear ? 'bg-gray-600 hover:bg-gray-500 text-gray-100 focus:ring-gray-400' : ''}"
        >
            <!-- Use icons for operators if desired -->
            {#if key === '/'}÷{:else if key === '*'}<i class="fas fa-times"></i>{:else if key === '-'}<i class="fas fa-minus"></i>{:else if key === '+'}<i class="fas fa-plus"></i>{:else if key === '='}<i class="fas fa-equals"></i>{:else}{key}{/if}
        </button>
      {/each}
    </div>
</div>
