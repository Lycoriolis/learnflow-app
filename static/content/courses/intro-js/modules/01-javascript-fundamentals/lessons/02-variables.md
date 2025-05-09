---
title: "Understanding Variables"
order: 2
estimatedTime: "20 minutes"
---

# Understanding Variables in JavaScript

Variables are fundamental building blocks in JavaScript that allow you to store and manipulate data in your programs. Think of them as labeled containers that hold values you want to use throughout your code.

## Declaring Variables

In modern JavaScript, there are three ways to declare variables:

### 1. Using `let`

```javascript
let age = 25;
let name = "John";
let isStudent = true;
```

The `let` keyword declares a block-scoped variable that can be reassigned:

```javascript
let count = 1;
count = 2; // This is valid
```

### 2. Using `const`

```javascript
const PI = 3.14159;
const MAX_USERS = 100;
```

The `const` keyword declares variables whose values cannot be reassigned:

```javascript
const API_KEY = "abc123";
API_KEY = "xyz789"; // This will cause an error
```

Note: While you can't reassign a `const` variable, if it contains an object or array, you can still modify its properties or elements.

### 3. Using `var` (older method)

```javascript
var message = "Hello";
```

The `var` keyword is the older way of declaring variables. It has function scope rather than block scope and is generally avoided in modern JavaScript.

## Variable Naming Rules

- Names can contain letters, digits, underscores, and dollar signs
- Names must begin with a letter, $ or _
- Names are case sensitive (`myVar` and `myvar` are different variables)
- Reserved words (like JavaScript keywords) cannot be used as names

## Variable Scope

Scope determines where your variables are accessible:

### Block Scope

Variables declared with `let` and `const` have block scope - they are only accessible within the block they are defined in.

```javascript
if (true) {
  let blockScoped = "I'm only available in this block";
  console.log(blockScoped); // Works fine
}
console.log(blockScoped); // Error - variable not accessible here
```

### Function Scope

Variables declared with `var` have function scope:

```javascript
function exampleFunction() {
  var functionScoped = "I'm available throughout the function";
  
  if (true) {
    var anotherVar = "I'm also available throughout the function";
  }
  
  console.log(functionScoped); // Works
  console.log(anotherVar); // Also works
}

console.log(functionScoped); // Error - not accessible outside the function
```

## Practice Exercise

Try declaring different variables in your browser's console:

1. Declare a `const` variable called `favoriteFruit` with your favorite fruit
2. Declare a `let` variable called `temperature` and set it to the current temperature
3. Try changing the value of `temperature`
4. Try changing the value of `favoriteFruit` and observe the error

In the next lesson, we'll explore JavaScript data types in detail.
