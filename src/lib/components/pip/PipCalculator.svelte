<script lang="ts">
  import {
    calcDisplay,
    calcCurrentInput,
    calcOperator,
    calcPreviousValue,
    calcWaitingForSecondOperand,
    calculatorMode
  } from '$lib/stores/pipStores.js';

  const performCalculation: Record<string, (a: number, b: number) => number> = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand // Handles pressing equals multiple times
  };

  // Scientific functions map
  const scientificFunctions: Record<string, (a: number) => number> = {
    'sin': Math.sin,
    'cos': Math.cos,
    'tan': Math.tan,
    'log': Math.log10, // Base-10 log
    'ln': Math.log,   // Natural log
    '√': Math.sqrt,
    'x²': (a) => a * a,
    'xʸ': (a) => a, // Placeholder: requires second operand handling
    '1/x': (a) => 1 / a,
    'π': () => Math.PI,
    'e': () => Math.E
    // Add more functions like asin, acos, factorial (!), etc. if needed
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

  // --- Handle Scientific Functions ---
  function handleScientificFunction(funcKey: string) {
      const func = scientificFunctions[funcKey];
      if (!func) return;

      try {
          const currentValue = parseFloat($calcDisplay);
          let result: number;

          // Handle functions that don't need input (constants)
          if (funcKey === 'π' || funcKey === 'e') {
              result = func(0); // Argument doesn't matter for constants
          } else {
              // Check for invalid input for certain functions
              if ((funcKey === '√' || funcKey === 'ln' || funcKey === 'log') && currentValue < 0) {
                  throw new Error('Invalid input for function');
              }
               if (funcKey === '1/x' && currentValue === 0) {
                  throw new Error('Division by zero');
              }
              // Handle power function separately if implementing fully
              if (funcKey === 'xʸ') {
                 alert('Power function (xʸ) needs two operands - not fully implemented in this basic version.');
                 return;
              }
              result = func(currentValue);
          }
          
          // Limit precision and update display
          const resultString = String(parseFloat(result.toFixed(7)));
          calcDisplay.set(resultString);
          calcCurrentInput.set(resultString);
          calcWaitingForSecondOperand.set(true); // Prepare for potential next operator
          calcPreviousValue.set(null); // Reset previous value after unary operation
          calcOperator.set(null);

      } catch (error: any) {
          console.error("Calculator Error:", error);
          calcDisplay.set('Error');
          // Reset state after showing error briefly?
          // setTimeout(clearAll, 1500);
      }
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
      } else if (scientificFunctions[key]) {
          handleScientificFunction(key);
      }
      // Add +/- logic if needed
      else if (key === '+/-') {
          if ($calcDisplay !== '0' && $calcDisplay !== 'Error') {
              calcDisplay.set(String(parseFloat($calcDisplay) * -1));
              calcCurrentInput.set($calcDisplay); // Keep current input updated
          }
      }
      // Add % logic if needed 
       else if (key === '%') {
           if ($calcDisplay !== 'Error') {
               calcDisplay.set(String(parseFloat($calcDisplay) / 100));
               calcCurrentInput.set($calcDisplay);
           }
       }
  }

  // Define button layouts
  const basicButtons = [
      'AC', '+/-', '%', '/',
      '7', '8', '9', '*',
      '4', '5', '6', '-',
      '1', '2', '3', '+',
      '0', '.', '='
  ];
  const scientificButtonsLeft = [
      'sin', 'cos', 'tan',
      'log', 'ln', '√',
      'x²', 'xʸ', '1/x',
      'π', 'e', '(' // Placeholder for parenthesis
  ];

  function toggleMode() {
    calculatorMode.update(mode => mode === 'basic' ? 'scientific' : 'basic');
  }

</script>

<div class="bg-gray-700 p-2 rounded-lg">
   <div class="flex justify-between items-center mb-2">
     <h4 class="text-xs font-medium text-purple-300 uppercase">Calculator</h4>
     <button 
        on:click={toggleMode} 
        class="px-2 py-0.5 text-xs rounded border border-purple-400 text-purple-300 hover:bg-purple-800 transition"
        title="Toggle Scientific Mode"
     >
        {$calculatorMode === 'basic' ? 'Sci' : 'Basic'}
     </button>
   </div>
   
   <input
     type="text"
     class="w-full text-right mb-2 px-2 py-1 border-0 focus:ring-0 text-xl font-mono bg-gray-800 text-gray-100 rounded-md"
     bind:value={$calcDisplay}
     readonly
   >

   <div class="grid gap-1" class:grid-cols-4={$calculatorMode === 'basic'} class:grid-cols-6={$calculatorMode === 'scientific'}>
      <!-- Scientific Buttons (Left Side) -->
      {#if $calculatorMode === 'scientific'}
        <div class="grid grid-cols-2 col-span-2 gap-1">
             {#each scientificButtonsLeft as key}
                <button
                  on:click={() => handleButtonClick(key)}
                  class="p-1.5 rounded text-xs font-medium transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-700 bg-gray-600 hover:bg-gray-500 text-gray-100 focus:ring-gray-400"
                >
                    {key}
                </button>
             {/each}
             <!-- Placeholder for right parenthesis -->
              <button class="p-1.5 rounded text-xs ..." disabled>')'</button> 
        </div>
      {/if}

      <!-- Basic/Numeric Buttons (Right Side or Full Width) -->
       <div class="grid grid-cols-4 col-span-4 gap-1">
          {#each basicButtons as key}
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
                {#if key === '/'}÷{:else if key === '*'}<i class="fas fa-times text-xs"></i>{:else if key === '-'}<i class="fas fa-minus text-xs"></i>{:else if key === '+'}<i class="fas fa-plus text-xs"></i>{:else if key === '='}<i class="fas fa-equals text-xs"></i>{:else}{key}{/if}
            </button>
          {/each}
       </div>
   </div>
</div>
