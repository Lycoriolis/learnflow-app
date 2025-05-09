---
title: "JavaScript Array Manipulation"
slug: "js-array-manipulation"
type: "exercise"
difficulty: "intermediate"
tags: ["javascript", "arrays", "methods"]
estimatedTime: "25 minutes"
relatedCourses: ["javascript-fundamentals"]
---

# JavaScript Array Manipulation Exercise

In this exercise, you'll practice using various JavaScript array methods to transform and extract data. This will reinforce your understanding of functional programming concepts in JavaScript.

## Instructions

Complete each of the following tasks using array methods like `map`, `filter`, `reduce`, `find`, and `some`. Avoid using traditional `for` loops.

### Task 1: Transformation

You have an array of numbers. Create a new array where each number is doubled.

```javascript
const numbers = [2, 5, 8, 11, 14];

// Your code here
```

### Task 2: Filtering

Filter the following array to include only people who are over 30 years old.

```javascript
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 32 },
  { name: "Charlie", age: 19 },
  { name: "Diana", age: 40 },
  { name: "Edward", age: 27 }
];

// Your code here
```

### Task 3: Aggregation

Calculate the total of all even numbers in the following array.

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Your code here
```

### Task 4: Finding Elements

Find the first product that costs more than $50.

```javascript
const products = [
  { name: "Keyboard", price: 25 },
  { name: "Mouse", price: 15 },
  { name: "Monitor", price: 120 },
  { name: "Headphones", price: 40 },
  { name: "Speaker", price: 85 }
];

// Your code here
```

### Task 5: Combined Operations

Given an array of student records, find the average score of students who passed (score >= 60).

```javascript
const students = [
  { name: "Alex", score: 85 },
  { name: "Brian", score: 45 },
  { name: "Carla", score: 72 },
  { name: "David", score: 90 },
  { name: "Emma", score: 30 },
  { name: "Fiona", score: 65 }
];

// Your code here
```

## Solutions

<details>
<summary>Click to reveal solutions</summary>

### Task 1: Transformation
```javascript
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [4, 10, 16, 22, 28]
```

### Task 2: Filtering
```javascript
const over30 = people.filter(person => person.age > 30);
console.log(over30); // [{ name: "Bob", age: 32 }, { name: "Diana", age: 40 }]
```

### Task 3: Aggregation
```javascript
const sumOfEven = numbers.reduce((sum, num) => 
  num % 2 === 0 ? sum + num : sum, 0);
console.log(sumOfEven); // 30 (2+4+6+8+10)
```

### Task 4: Finding Elements
```javascript
const expensiveProduct = products.find(product => product.price > 50);
console.log(expensiveProduct); // { name: "Monitor", price: 120 }
```

### Task 5: Combined Operations
```javascript
const passingStudents = students.filter(student => student.score >= 60);
const averageScore = passingStudents.reduce((sum, student) => 
  sum + student.score, 0) / passingStudents.length;
console.log(averageScore); // 78 ((85 + 72 + 90 + 65) / 4)
```
</details>

## Bonus Challenge

Create a function that takes an array of objects and a property name, and returns an object where the keys are the unique values of that property, and the values are arrays of objects that have that property value.

Example:
```javascript
const users = [
  { id: 1, role: "admin", name: "Alice" },
  { id: 2, role: "user", name: "Bob" },
  { id: 3, role: "admin", name: "Charlie" },
  { id: 4, role: "user", name: "Diana" }
];

// Expected output for groupBy(users, "role"):
// {
//   admin: [{ id: 1, role: "admin", name: "Alice" }, { id: 3, role: "admin", name: "Charlie" }],
//   user: [{ id: 2, role: "user", name: "Bob" }, { id: 4, role: "user", name: "Diana" }]
// }
```

<details>
<summary>Bonus Solution</summary>

```javascript
function groupBy(array, property) {
  return array.reduce((grouped, item) => {
    const key = item[property];
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
    return grouped;
  }, {});
}

const groupedByRole = groupBy(users, "role");
console.log(groupedByRole);
```
</details>
