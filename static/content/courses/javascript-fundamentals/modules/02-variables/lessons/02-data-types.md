---
title: "Working with Data Types in JavaScript"
order: 2
estimatedTime: "20 minutes"
objectives:
  - Learn how to work with strings in JavaScript
  - Understand number operations and limitations
  - Learn about arrays and objects manipulation
---

# Working with Data Types in JavaScript

In this lesson, we'll explore how to work with different data types in JavaScript and perform common operations.

## Working with Strings

Strings in JavaScript are sequences of characters enclosed in quotes. They can be created using single quotes (`'`), double quotes (`"`), or backticks (`` ` ``).

```javascript
let singleQuotes = 'Hello World';
let doubleQuotes = "Hello World";
let backticks = `Hello World`;
```

### String Operations

Strings have many built-in methods for manipulation:

```js run
let text = "JavaScript is awesome";

// String length
console.log("Length:", text.length);

// Accessing characters
console.log("First character:", text[0]);
console.log("Character at position 5:", text.charAt(5));

// Finding substrings
console.log("Position of 'is':", text.indexOf("is"));

// Extracting substrings
console.log("Substring from 0 to 10:", text.substring(0, 10));
console.log("Slice from 11 to end:", text.slice(11));

// Changing case
console.log("Uppercase:", text.toUpperCase());
console.log("Lowercase:", text.toLowerCase());

// Replacing content
console.log("Replace 'awesome' with 'amazing':", text.replace("awesome", "amazing"));

// Splitting strings
console.log("Split by space:", text.split(" "));
```

:::tip
Template literals (backticks) allow for multiline strings and string interpolation:

```javascript
let name = "Alice";
let greeting = `Hello ${name},
Welcome to JavaScript!`;
```
:::

## Working with Numbers

JavaScript uses the IEEE-754 format for all numeric operations.

```js run
// Basic arithmetic
console.log("5 + 2 =", 5 + 2);
console.log("5 - 2 =", 5 - 2);
console.log("5 * 2 =", 5 * 2);
console.log("5 / 2 =", 5 / 2);
console.log("5 % 2 =", 5 % 2);  // Remainder
console.log("5 ** 2 =", 5 ** 2); // Exponentiation (5 squared)

// Special numbers
console.log("Infinity:", Infinity);
console.log("-Infinity:", -Infinity);
console.log("Not a Number:", NaN);

// Testing for NaN
console.log("Is NaN?", isNaN(NaN));
console.log("Is Finite?", isFinite(42));

// Converting strings to numbers
console.log("parseInt('42'):", parseInt("42"));
console.log("parseFloat('3.14'):", parseFloat("3.14"));
console.log("Number('42'):", Number("42"));

// Precision issues (be careful!)
console.log("0.1 + 0.2 =", 0.1 + 0.2);
console.log("Fixed precision:", (0.1 + 0.2).toFixed(2));
```

:::warning
JavaScript has floating-point precision issues. Never directly compare floating-point numbers for equality.
```javascript
// Bad
if (0.1 + 0.2 === 0.3) { ... }  // This will be false!

// Good
if (Math.abs((0.1 + 0.2) - 0.3) < 0.0001) { ... }
```
:::

## Working with Arrays

Arrays are ordered collections that can hold any type of data.

```js run
// Creating arrays
let fruits = ["Apple", "Banana", "Cherry"];
let mixed = [1, "two", true, null, {name: "object"}];

// Array length
console.log("Fruits array length:", fruits.length);

// Accessing elements
console.log("First fruit:", fruits[0]);
console.log("Last fruit:", fruits[fruits.length - 1]);

// Adding elements
fruits.push("Date");  // Add to end
console.log("After push:", fruits);

fruits.unshift("Apricot");  // Add to beginning
console.log("After unshift:", fruits);

// Removing elements
let lastFruit = fruits.pop();  // Remove from end
console.log("Removed last fruit:", lastFruit);
console.log("After pop:", fruits);

let firstFruit = fruits.shift();  // Remove from beginning
console.log("Removed first fruit:", firstFruit);
console.log("After shift:", fruits);

// Finding elements
console.log("Index of Banana:", fruits.indexOf("Banana"));

// Slicing arrays
let someFruits = fruits.slice(0, 2);
console.log("Slice of fruits:", someFruits);

// Joining arrays
console.log("Fruits joined:", fruits.join(", "));

// Iterating over arrays
fruits.forEach((fruit, index) => {
  console.log(`Fruit ${index}: ${fruit}`);
});

// Mapping arrays
let fruitLengths = fruits.map(fruit => fruit.length);
console.log("Fruit name lengths:", fruitLengths);

// Filtering arrays
let longFruits = fruits.filter(fruit => fruit.length > 5);
console.log("Fruits with more than 5 characters:", longFruits);
```

## Working with Objects

Objects are collections of key-value pairs.

```js run
// Creating objects
let person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  hobbies: ["reading", "cycling", "coding"],
  address: {
    street: "123 Main St",
    city: "Anytown",
    country: "USA"
  },
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
};

// Accessing properties
console.log("First name:", person.firstName);
console.log("First hobby:", person.hobbies[0]);
console.log("City:", person["address"]["city"]);  // Bracket notation
console.log("Full name:", person.fullName());

// Adding properties
person.email = "john.doe@example.com";
console.log("After adding email:", person);

// Deleting properties
delete person.age;
console.log("After deleting age:", person);

// Checking if property exists
console.log("Has lastName property:", "lastName" in person);
console.log("Has SSN property:", "ssn" in person);

// Object keys and values
console.log("Object keys:", Object.keys(person));
console.log("Object values:", Object.values(person));
console.log("Object entries:", Object.entries(person));
```

## Test Your Knowledge

:::quiz
{
  "id": "js-string-quiz",
  "question": "What will be the output of the following code?\n```javascript\nlet str = 'JavaScript';\nconsole.log(str.slice(4, 7));\n```",
  "options": [
    "Java",
    "Scr",
    "aSc",
    "aScr"
  ],
  "answer": 1,
  "explanation": "str.slice(4, 7) extracts characters from index 4 (which is 'S') to index 6 (which is 'r'), resulting in 'Scr'. Remember that string indices are zero-based, and the end index in slice is not included."
}
:::

## Practice Exercise

Try creating a function that takes an array of student objects and returns an array of their names:

```js run
// Example student array
let students = [
  { id: 1, name: "Alice", grade: "A" },
  { id: 2, name: "Bob", grade: "B" },
  { id: 3, name: "Charlie", grade: "C" }
];

// Write your function here
function getStudentNames(students) {
  return students.map(student => student.name);
}

// Test your function
console.log(getStudentNames(students));
```

## Summary

- Strings in JavaScript are powerful with many built-in methods for manipulation.
- Numbers in JavaScript follow the IEEE-754 standard and can have precision issues.
- Arrays provide methods for adding, removing, and transforming elements.
- Objects allow for organizing related data and functionality together.
- Both arrays and objects are reference types, meaning they are passed by reference, not by value.
