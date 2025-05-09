---
title: "JavaScript Array Methods"
slug: "js-array-methods"
type: "exercise"
difficulty: "intermediate"
tags: ["javascript", "arrays", "methods"]
estimatedTime: "30 minutes"
---

# JavaScript Array Methods Exercise

In this exercise, you'll practice using various array methods in JavaScript to manipulate and extract data from arrays.

## Difficulty: Intermediate

## Estimated Time: 30 minutes

## Instructions

Complete each of the following tasks using JavaScript array methods. Try to solve them without using traditional for loops.

### Task 1: Map

Given an array of numbers, create a new array that contains each number multiplied by 2.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Your code here
```

### Task 2: Filter

Given an array of numbers, create a new array that only contains the even numbers.

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Your code here
```

### Task 3: Reduce

Given an array of numbers, calculate the sum of all numbers.

```javascript
const numbers = [10, 20, 30, 40, 50];

// Your code here
```

### Task 4: Find

Given an array of objects representing people, find the person with the name "John".

```javascript
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "John", age: 35 },
  { name: "Sara", age: 28 }
];

// Your code here
```

### Task 5: Every and Some

Check if all numbers in an array are positive, and check if at least one number is greater than 10.

```javascript
const numbers = [2, 4, 6, 8, 12];

// Your code here
```

### Task 6: Combining Methods

Given an array of objects representing products, filter for products with a price less than 50, then map them to get an array of their names, and finally join them into a string separated by commas.

```javascript
const products = [
  { name: "Laptop", price: 1200 },
  { name: "Book", price: 20 },
  { name: "Smartphone", price: 800 },
  { name: "Headphones", price: 45 },
  { name: "Keyboard", price: 35 }
];

// Your code here
```

## Solution

<details>
<summary>Click to reveal solutions</summary>

### Task 1: Map
```javascript
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
```

### Task 2: Filter
```javascript
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6, 8, 10]
```

### Task 3: Reduce
```javascript
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum); // 150
```

### Task 4: Find
```javascript
const john = people.find(person => person.name === "John");
console.log(john); // { name: "John", age: 35 }
```

### Task 5: Every and Some
```javascript
const allPositive = numbers.every(num => num > 0);
const someGreaterThan10 = numbers.some(num => num > 10);
console.log(allPositive); // true
console.log(someGreaterThan10); // true
```

### Task 6: Combining Methods
```javascript
const affordableProductNames = products
  .filter(product => product.price < 50)
  .map(product => product.name)
  .join(", ");
console.log(affordableProductNames); // "Book, Headphones, Keyboard"
```
</details>

## Further Practice

Try creating your own challenges that use array methods like `sort`, `forEach`, `includes`, and `slice`. Practice is key to mastering these powerful methods!
