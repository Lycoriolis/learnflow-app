---
title: "Binary Search Algorithm"
slug: "binary-search"
type: "exercise"
difficulty: "intermediate"
tags: ["algorithms", "searching", "binary search", "efficiency"]
estimatedTime: "30 minutes"
relatedCourses: ["javascript-fundamentals", "algorithms-101"]
---

# Binary Search Algorithm Exercise

Binary search is a fast and efficient algorithm for finding an element in a sorted array. It works by repeatedly dividing the search interval in half, making it much more efficient than linear search for large datasets.

## Problem Statement

Implement a binary search algorithm that searches for a target value in a sorted array. Your implementation should:

1. Take a sorted array and a target value as input
2. Return the index of the target value if found
3. Return -1 if the target value is not in the array

## Algorithm Overview

The binary search algorithm works as follows:

1. Begin with the entire sorted array
2. Find the middle element
3. If the middle element is the target, return its index
4. If the target is less than the middle element, repeat the search on the left half
5. If the target is greater than the middle element, repeat the search on the right half
6. If the search interval is empty, the target is not in the array, so return -1

## Implementation Template

```javascript
/**
 * Binary search implementation
 * @param {number[]} sortedArray - The sorted array to search in
 * @param {number} target - The value to search for
 * @return {number} - The index of the target if found, otherwise -1
 */
function binarySearch(sortedArray, target) {
  // Your code here
}

// Test cases
console.log(binarySearch([1, 2, 3, 4, 5], 3)); // Should return 2
console.log(binarySearch([1, 2, 3, 4, 5], 6)); // Should return -1
console.log(binarySearch([], 1)); // Should return -1
```

:::info
Binary search has a time complexity of O(log n), making it much faster than linear search (O(n)) for large datasets.
:::

## Interactive Example

Let's visualize how binary search works on a sorted array:

```js run
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let steps = 0;
  
  console.log(`Searching for ${target} in [${arr}]`);
  
  while (left <= right) {
    steps++;
    let mid = Math.floor((left + right) / 2);
    console.log(`Step ${steps}: Looking at index ${mid} with value ${arr[mid]}`);
    
    if (arr[mid] === target) {
      console.log(`Found ${target} at index ${mid} in ${steps} steps`);
      return mid;
    }
    
    if (arr[mid] < target) {
      console.log(`${arr[mid]} < ${target}, so searching right half`);
      left = mid + 1;
    } else {
      console.log(`${arr[mid]} > ${target}, so searching left half`);
      right = mid - 1;
    }
  }
  
  console.log(`${target} not found after ${steps} steps`);
  return -1;
}

// Test with a sorted array
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

// Try to find 11 (exists in the array)
binarySearch(sortedArray, 11);

// Try to find 6 (doesn't exist in the array)
binarySearch(sortedArray, 6);
```

## Iterative vs. Recursive Approach

Binary search can be implemented either iteratively (using a loop) or recursively (a function calling itself). Here's how both approaches compare:

### Iterative Approach (shown above)
- Uses a while loop
- Typically more space-efficient (O(1) space complexity)
- Often preferred in practice for its simplicity and efficiency

### Recursive Approach
- The function calls itself with a smaller subarray
- More elegant but potentially less efficient due to function call overhead
- Has O(log n) space complexity due to the call stack

:::tip
For most practical purposes, the iterative approach is recommended due to its space efficiency and avoidance of call stack limitations.
:::

## Performance Comparison

For an array of size n:

| Algorithm     | Time Complexity (Worst Case) | Space Complexity |
|---------------|------------------------------|------------------|
| Linear Search | O(n)                         | O(1)             |
| Binary Search | O(log n)                     | O(1) (iterative) |
|               |                              | O(log n) (recursive) |

## Challenge: Implement Recursive Binary Search

Can you implement the binary search algorithm recursively? Here's a template to get started:

```javascript
function recursiveBinarySearch(sortedArray, target, left = 0, right = sortedArray.length - 1) {
  // Your recursive implementation here
}
```

:::quiz
{
  "id": "binary-search-quiz",
  "question": "What is the time complexity of binary search?",
  "options": [
    "O(1)",
    "O(log n)",
    "O(n)",
    "O(n log n)"
  ],
  "answer": 1,
  "explanation": "Binary search has a time complexity of O(log n) because it divides the search space in half with each step."
}
:::

## Submission

Your task is to implement both the iterative and recursive versions of the binary search algorithm. Pay close attention to edge cases such as:

- Empty arrays
- Arrays with a single element
- Target value smaller than all elements
- Target value larger than all elements
- Duplicate values in the array

Good luck!
