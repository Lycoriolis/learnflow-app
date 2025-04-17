# Bézout's Theorem and Identity

**Type:** course  
**Difficulty:** intermediate  
**Estimated Time:** 90 minutes  
**Tags:** math, number theory, gcd, bezout

## Introduction

In number theory, **Bézout's identity** states that for any nonzero integers *a* and *b*, there exist integers *x* and *y* such that:

```math
ax + by = 
\gcd(a, b)
```

This course covers the theory of greatest common divisor (GCD), the statement and proof of Bézout's identity, the extended Euclidean algorithm for finding the coefficients, and practical applications.

---

## 1. Greatest Common Divisor

- Definition: The largest positive integer dividing both *a* and *b* without remainder.
- Properties:  
  • Divisor relations  
  • Euclidean algorithm basics

### Example

Compute \(\gcd(252, 198)\) by successive division steps.

---

## 2. Bézout's Identity Statement

For integers *a*, *b* (not both zero), there exist *x*, *y* ∈ ℤ such that:

```math
ax + by = d
```  
where \(d = \gcd(a, b)\).

### Proof Sketch

1. Use the Euclidean algorithm to express remainders.  
2. Back-substitute to express the GCD as a linear combination of *a* and *b*.

---

## 3. Extended Euclidean Algorithm

- Algorithmic steps for computing *d*, *x*, and *y*.  
- Complexity: logarithmic in input size.

### Pseudocode

```text
function extended_gcd(a, b):
    if b == 0:
        return (a, 1, 0)
    (d, x1, y1) = extended_gcd(b, a mod b)
    x = y1
    y = x1 - ⌊a/b⌋ * y1
    return (d, x, y)
```

---

## 4. Applications

- Solving linear Diophantine equations.  
- Modular inverses in cryptography.  
- Coefficients in polynomial GCD computations.

---

## 5. Further Reading

- Donald Knuth, *The Art of Computer Programming*, Vol. 2 (Seminumerical Algorithms)  
- https://en.wikipedia.org/wiki/B%C3%A9zout%27s_identity  
- https://mathworld.wolfram.com/GreatestCommonDivisor.html
