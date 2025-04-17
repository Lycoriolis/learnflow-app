# Bézout’s Identity Exercises

**Type:** exercise  
**Difficulty:** intermediate  
**Estimated Time:** 30 minutes  
**Tags:** math, number theory, gcd, bezout

## Instructions

Implement the following functions in your programming language of choice. Write code and verify your solutions with sample inputs.

### 1. Compute GCD
Write a function `gcd(a, b)` that returns the greatest common divisor of two integers using the Euclidean algorithm.

```
Example:
  gcd(252, 198)    // returns 18
  gcd(100, 15)     // returns 5
```

### 2. Extended Euclidean Algorithm
Write an implementation of the Extended Euclidean Algorithm:

```js
function extendedGCD(a, b) {
  // returns { d, x, y } such that a*x + b*y = d = gcd(a, b)
}
```

Test cases:
```
extendedGCD(252, 198)  // { d: 18, x: -7, y: 9 }
extendedGCD(30, 20)    // { d: 10, x: 1,  y: -1 }
```

### 3. Bézout Coefficients
Using your `extendedGCD` function, write `bezout(a, b)` that returns the pair `[x, y]` satisfying `a*x + b*y = gcd(a, b)`.

```
Example:
  bezout(99, 78)   // returns [x, y] such that 99*x + 78*y = 3
```

### 4. Practical Application
Implement a function `modInverse(a, m)` that computes the modular inverse of `a` modulo `m` (i.e., the integer `x` such that `a*x ≡ 1 (mod m)`). Use your extended GCD to derive the inverse or indicate if it does not exist.

```
Example:
  modInverse(3, 11)   // returns 4, because 3*4 ≡ 1 mod 11
  modInverse(6, 9)    // returns null, no inverse exists
```

---

## Hints

- Remember the Euclidean algorithm reduces `gcd(a, b)` by replacing `(a, b)` with `(b, a mod b)`.
- In the extended version, backtrack each remainder step to express the GCD as a linear combination.

## Sample Solution

```js
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function extendedGCD(a, b) {
  if (b === 0) return { d: a, x: 1, y: 0 };
  const { d, x: x1, y: y1 } = extendedGCD(b, a % b);
  return { d, x: y1, y: x1 - Math.floor(a / b) * y1 };
}

function bezout(a, b) {
  const { d, x, y } = extendedGCD(a, b);
  return [x, y];
}

function modInverse(a, m) {
  const { d, x } = extendedGCD(a, m);
  return d === 1 ? ((x % m) + m) % m : null;
}
```
