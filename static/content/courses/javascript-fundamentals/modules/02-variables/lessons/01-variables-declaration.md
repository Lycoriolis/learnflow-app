---
title: "Variables and Data Types in JavaScript"
order: 1
estimatedTime: "25 minutes"
objectives:
  - Understand how to declare variables in JavaScript
  - Learn about different JavaScript data types
  - Understand type coercion and conversion
---

# Variables and Data Types in JavaScript

JavaScript provides several ways to declare variables, each with its own behavior and use cases.

## Variable Declaration

:::info
Variables are containers for storing data values. In JavaScript, we have three ways to declare variables: `var`, `let`, and `const`.
:::

### Let's examine each type of variable declaration:

#### 1. Using `var` (older way)

```javascript
var message = "Hello";
var count = 5;
```

#### 2. Using `let` (ES6 and recommended)

```javascript
let message = "Hello";
let count = 5;
```

#### 3. Using `const` (for values that won't change)

```javascript
const PI = 3.14159;
const MAX_USERS = 100;
```

:::warning
Variables declared with `const` cannot be reassigned. However, if the const variable points to an object, the object's properties can still be changed.
:::

## Data Types in JavaScript

JavaScript has several built-in data types:

### Primitive Types:

1. **String** - Textual data in quotes
2. **Number** - Integers or floating-point numbers
3. **Boolean** - `true` or `false`
4. **Undefined** - A variable without a value
5. **Null** - Intentional absence of any object value
6. **Symbol** (ES6) - Unique and immutable primitive values
7. **BigInt** (newer) - For larger integers than Number can hold

### Reference Type:

1. **Object** - Collections of properties (this includes Arrays, Functions, and other objects)

## Interactive Code Examples

Let's see these data types in action:

```js run
// Primitive Types
let name = "Alice";       // String
let age = 25;             // Number
let isStudent = true;     // Boolean
let job = undefined;      // Undefined
let salary = null;        // Null

// Object type
let person = {
  firstName: "John",
  lastName: "Doe"
};

// Array (which is an object)
let colors = ["red", "green", "blue"];

// Output the values and their types
console.log("name:", name, "type:", typeof name);
console.log("age:", age, "type:", typeof age);
console.log("isStudent:", isStudent, "type:", typeof isStudent);
console.log("job:", job, "type:", typeof job);
console.log("salary:", salary, "type:", typeof salary);
console.log("person:", person, "type:", typeof person);
console.log("colors:", colors, "type:", typeof colors);
```

## Type Coercion

JavaScript automatically converts types in certain contexts. This is called type coercion.

:::note
Type coercion can lead to unexpected results if you're not careful. Always use strict equality (`===`) when comparing values where the type matters.
:::

```js run
// Type coercion examples
console.log("5" + 2);        // "52" (string concatenation)
console.log("5" - 2);        // 3 (number subtraction)
console.log("5" == 5);       // true (loose equality)
console.log("5" === 5);      // false (strict equality)
console.log(Boolean(""));    // false
console.log(Boolean("hi"));  // true
console.log(Boolean(0));     // false
console.log(Boolean(1));     // true
```

## Test Your Knowledge

:::quiz
{
  "id": "js-var-quiz",
  "question": "Which of the following is NOT a valid way to declare a variable in JavaScript?",
  "options": [
    "let name = 'John';",
    "const age = 30;",
    "var job = 'Developer';",
    "string city = 'New York';"
  ],
  "answer": 3,
  "explanation": "JavaScript does not use type prefixes like 'string' when declaring variables. The correct ways to declare variables are using let, const, or var."
}
:::

:::quiz
{
  "id": "js-type-quiz",
  "question": "What will be the output of: console.log(typeof [1, 2, 3]);",
  "options": [
    "array",
    "object",
    "Array",
    "list"
  ],
  "answer": 1,
  "explanation": "In JavaScript, arrays are objects, so typeof [1, 2, 3] returns 'object'. To check if something is an array, use Array.isArray([1, 2, 3])."
}
:::

## Practice Exercise

Try to identify the type of each variable in the following code:

```javascript
let a = 100;
let b = "100";
let c = true;
let d = [1, 2, 3];
let e = { name: "JavaScript", age: 25 };
let f = null;
let g;
```

:::tip
Remember that you can use the `typeof` operator to check the type of a variable. However, be aware that `typeof null` returns "object" which is considered a historical bug in JavaScript.
:::

## Summary

- JavaScript has three ways to declare variables: `var`, `let`, and `const`.
- JavaScript has primitive types (String, Number, Boolean, Undefined, Null, Symbol, BigInt) and reference types (Objects).
- Type coercion happens automatically in JavaScript, but you can use strict equality (`===`) to avoid unexpected results.
- Always use `let` or `const` over `var` in modern JavaScript code.
- `const` variables cannot be reassigned, but their properties can be modified if they are objects.
