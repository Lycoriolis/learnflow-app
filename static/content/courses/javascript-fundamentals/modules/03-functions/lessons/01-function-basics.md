---
title: "JavaScript Function Basics"
order: 1
estimatedTime: "25 minutes"
objectives:
  - Understand what functions are and why they're important
  - Learn how to define and call functions
  - Understand function parameters and return values
---

# JavaScript Function Basics

Functions are one of the fundamental building blocks in JavaScript. A function is a reusable block of code designed to perform a specific task.

## Why Use Functions?

:::info
Functions help organize your code, make it reusable, and easier to understand. They also help prevent code duplication, which is a key principle of clean code.
:::

Functions provide several benefits:

1. **Code Reusability**: Write code once and use it many times
2. **Modularity**: Break complex problems into manageable pieces
3. **Organization**: Structure your code in a logical way
4. **Maintainability**: Easier to debug and maintain
5. **Abstraction**: Hide complex implementation details

## Function Declaration

There are several ways to define functions in JavaScript:

### 1. Function Declaration

```javascript
function greet(name) {
  return "Hello, " + name + "!";
}
```

### 2. Function Expression

```javascript
const greet = function(name) {
  return "Hello, " + name + "!";
};
```

### 3. Arrow Function (ES6)

```javascript
const greet = (name) => {
  return "Hello, " + name + "!";
};
```

## Function Parameters

Functions can accept inputs called parameters:

```js run
// Function with two parameters
function add(a, b) {
  return a + b;
}

// Calling the function with arguments
console.log(add(5, 3)); // Output: 8

// Default parameters (ES6)
function greet(name = "Guest") {
  return "Hello, " + name + "!";
}

console.log(greet("John")); // Output: Hello, John!
console.log(greet()); // Output: Hello, Guest!

// Rest parameters (ES6)
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // Output: 15
```

:::warning
Be careful about parameter naming! If you use the same name for a parameter and a global variable, the parameter will take precedence within the function scope.
:::

## Return Values

Functions can return values using the `return` statement:

```js run
function multiply(a, b) {
  return a * b;
}

const result = multiply(4, 5);
console.log(result); // Output: 20

// Functions without a return statement return undefined
function sayHello(name) {
  console.log("Hello, " + name);
  // No return statement
}

const value = sayHello("Alice"); // Logs: Hello, Alice
console.log(value); // Output: undefined

// Early return
function isPositive(number) {
  if (number <= 0) {
    return false;
  }
  return true;
}

console.log(isPositive(5)); // Output: true
console.log(isPositive(-3)); // Output: false
```

## Function Scope

Variables declared inside a function are only accessible within that function:

```js run
function testScope() {
  const localVar = "I am local";
  console.log(localVar); // Accessible
}

testScope();
// console.log(localVar); // Error: localVar is not defined

// Global vs local
let message = "Global message";

function showMessage() {
  let message = "Local message";
  console.log("Inside function: " + message);
}

showMessage(); // Output: Inside function: Local message
console.log("Outside function: " + message); // Output: Outside function: Global message
```

## Function Hoisting

Function declarations are hoisted (moved to the top of their scope), which means you can call them before they are defined:

```js run
// This works!
console.log(add(5, 3)); // Output: 8

function add(a, b) {
  return a + b;
}

// But this doesn't work!
try {
  console.log(subtract(5, 3));
} catch (e) {
  console.log("Error: " + e.message);
}

const subtract = function(a, b) {
  return a - b;
};
```

:::note
Only function declarations are hoisted with their definitions. Function expressions and arrow functions are not hoisted in the same way.
:::

## Nested Functions

You can define functions inside other functions:

```js run
function outer() {
  console.log("Outer function");
  
  function inner() {
    console.log("Inner function");
  }
  
  // Call the inner function
  inner();
}

outer();
// inner(); // This would cause an error
```

## Function as Values

In JavaScript, functions are first-class citizens, which means they can be:

1. Assigned to variables
2. Passed as arguments to other functions
3. Returned from other functions

```js run
// Assign to variable
const sayHello = function(name) {
  return "Hello, " + name;
};

// Pass as argument (callback)
function processUser(user, callback) {
  return callback(user);
}

const user = "John";
const result = processUser(user, sayHello);
console.log(result); // Output: Hello, John

// Return from function
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // Output: 10
console.log(triple(5)); // Output: 15
```

## Pure Functions

A pure function is a function that:

1. Given the same inputs, always returns the same output
2. Has no side effects (doesn't modify external state)

```js run
// Pure function
function add(a, b) {
  return a + b;
}

// Impure function (uses external state)
let total = 0;
function addToTotal(value) {
  total += value;
  return total;
}

console.log(add(5, 3)); // Always returns 8
console.log(add(5, 3)); // Always returns 8

console.log(addToTotal(5)); // Returns 5
console.log(addToTotal(3)); // Returns 8 (state changed)
```

:::tip
Pure functions are easier to test, debug, and reason about, making your code more maintainable. Try to use pure functions when possible.
:::

## Test Your Knowledge

:::quiz
{
  "id": "js-function-quiz",
  "question": "What will be the output of the following code?\n```javascript\nlet x = 10;\nfunction test() {\n  let x = 20;\n  return x;\n}\nconsole.log(test());\nconsole.log(x);\n```",
  "options": [
    "20, 20",
    "20, 10",
    "10, 10",
    "10, 20"
  ],
  "answer": 1,
  "explanation": "The function `test()` creates a local variable `x` with a value of 20, which is returned. The global variable `x` remains 10 and is not affected by the function's local variable."
}
:::

## Practice Exercise

Try writing a function that calculates the factorial of a number:

```js run
// Write your factorial function here
function factorial(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

// Test cases
console.log(factorial(5)); // Should return 120 (5 * 4 * 3 * 2 * 1)
console.log(factorial(0)); // Should return 1
console.log(factorial(10)); // Should return 3628800
```

## Summary

- Functions are reusable blocks of code that perform specific tasks
- Functions can accept parameters and return values
- JavaScript has several ways to define functions: declarations, expressions, and arrow functions
- Variables declared inside a function are scoped to that function
- Function declarations are hoisted, function expressions are not
- Functions in JavaScript are first-class objects that can be passed around like values
- Pure functions always produce the same output for the same input and have no side effects
