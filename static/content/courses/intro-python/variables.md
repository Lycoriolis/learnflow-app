---
title: Variables and Data Types
description: Learn about different types of data in Python and how to store them in variables
tags: ['python', 'basics', 'variables']
difficulty: beginner
estimatedTime: 45 minutes
prerequisites: ['none']
---

# Variables and Data Types in Python

Python is a dynamically typed language, which means you don't need to declare variable types explicitly. Let's explore the fundamental data types and how to work with variables.

## Basic Data Types

### Numbers

Python has several numeric types:

```python
# Integer
age = 25

# Float
height = 1.75

# Complex number
z = 3 + 4j
```

### Strings

Text data is represented using strings:

```python
# Single or double quotes
name = "Alice"
message = 'Hello, World!'

# Multi-line strings
description = """
This is a
multi-line string
"""
```

### Boolean

Boolean values are either `True` or `False`:

```python
is_student = True
has_passed = False
```

## Type Conversion

You can convert between types using built-in functions:

```python
# String to integer
age_str = "25"
age_num = int(age_str)

# Integer to string
count = 42
count_str = str(count)

# String to float
price_str = "19.99"
price = float(price_str)
```

## Practice Exercise

Try creating variables of different types and convert between them. Here's a starter exercise:

1. Create a string containing a number
2. Convert it to an integer
3. Multiply it by 2
4. Convert the result back to a string
5. Print the final result

```python
# Your solution here
number_str = "5"
number = int(number_str)
result = number * 2
result_str = str(result)
print(result_str)  # Should print "10"
```

## Key Points

- Variables in Python are created when you first assign a value
- Python determines the type automatically based on the value
- You can check a variable's type using the `type()` function
- Common type conversion functions: `int()`, `float()`, `str()`, `bool()`

## Next Steps

Practice working with different data types and try combining them in meaningful ways. In the next lesson, we'll learn about operators and how to perform operations on these variables.