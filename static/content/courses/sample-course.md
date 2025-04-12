# Introduction to Web Development

## Welcome to the Course!

This course will introduce you to the fundamentals of web development. You'll learn about HTML, CSS, and JavaScript, the three core technologies of the web.

### What You'll Learn

- HTML - The structure of web pages
- CSS - The styling and appearance
- JavaScript - The interactive functionality

## HTML Basics

HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.

### Elements and Tags

HTML consists of a series of elements, which you use to enclose, or wrap, different parts of the content to make it appear a certain way, or act a certain way.

```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Web Page</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a paragraph of text.</p>
</body>
</html>
```

## CSS Fundamentals

CSS (Cascading Style Sheets) is a stylesheet language used for describing the presentation of a document written in HTML.

### Selectors and Properties

CSS consists of selectors and declaration blocks:

```css
/* This is a CSS comment */
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
    text-align: center;
}
```

## JavaScript Introduction

JavaScript is a programming language that allows you to implement complex features on web pages.

### Variables and Functions

Here's a simple JavaScript example:

```javascript
// This is a JavaScript comment
let greeting = "Hello, World!";
console.log(greeting);

function calculateSum(a, b) {
    return a + b;
}

const result = calculateSum(5, 10);
console.log("The sum is: " + result);
```

## Putting It All Together

When you combine HTML, CSS, and JavaScript, you create interactive web pages:

1. HTML provides the structure
2. CSS handles the presentation and styling
3. JavaScript adds interactivity and behavior

### Example Project

Below is a simple interactive button example:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Interactive Button</title>
    <style>
        button {
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h1>Click the Button</h1>
    <button id="myButton">Click Me</button>
    <p id="output">Button hasn't been clicked yet.</p>
    
    <script>
        const button = document.getElementById('myButton');
        const output = document.getElementById('output');
        
        button.addEventListener('click', function() {
            output.textContent = 'Button was clicked!';
        });
    </script>
</body>
</html>
```

## Next Steps

Now that you've learned the basics, you can:

- Create more complex web pages
- Learn about responsive design
- Explore JavaScript frameworks
- Study backend development 