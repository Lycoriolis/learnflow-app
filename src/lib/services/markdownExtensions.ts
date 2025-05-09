import { marked } from 'marked';

// Define the extension types
export type CustomExtension = {
  name: string;
  level: 'block' | 'inline';
  start: (src: string) => number | undefined;
  tokenizer: (src: string) => any;
  renderer: (token: any) => string;
};

// Define the quiz extension
export const quizExtension: CustomExtension = {
  name: 'quiz',
  level: 'block',
  start(src) {
    return src.match(/^:::quiz/)?.index;
  },
  tokenizer(src) {
    const rule = /^:::quiz\s+(.+?):::/s;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'quiz',
        raw: match[0],
        text: match[1].trim()
      };
    }
    return undefined;
  },
  renderer(token) {
    // Parse the quiz content which should be in JSON format
    try {
      const quizData = JSON.parse(token.text);
      let html = `<div class="quiz-container bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg my-4">
        <h3 class="font-bold text-lg mb-2">${quizData.question}</h3>
        <div class="options space-y-2">`;
      
      quizData.options.forEach((option: string, index: number) => {
        html += `<div class="option flex items-center p-2 bg-white dark:bg-gray-800 rounded hover:bg-indigo-100 dark:hover:bg-indigo-800 cursor-pointer">
          <input type="radio" id="option-${index}" name="quiz-${quizData.id || Math.random().toString(36).substr(2, 9)}" value="${index}">
          <label for="option-${index}" class="ml-2 cursor-pointer flex-1">${option}</label>
        </div>`;
      });
      
      html += `</div>
        <div class="answer hidden mt-4 p-3 bg-green-100 dark:bg-green-900 rounded">
          <p class="font-medium">${quizData.explanation || 'Correct answer: ' + quizData.options[quizData.answer]}</p>
        </div>
        <button class="check-answer mt-3 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded">Check Answer</button>
      </div>`;
      
      return html;
    } catch (e) {
      console.error('Error parsing quiz data:', e);
      return `<div class="bg-red-100 dark:bg-red-900 p-4 rounded-lg my-4">
        <p class="text-red-600 dark:text-red-300">Error parsing quiz data. Make sure it's valid JSON.</p>
        <pre class="mt-2 text-sm">${token.text}</pre>
      </div>`;
    }
  }
};

// Define the callout extension
export const calloutExtension: CustomExtension = {
  name: 'callout',
  level: 'block',
  start(src) {
    return src.match(/^:::/)?.index;
  },
  tokenizer(src) {
    const rule = /^:::(info|warning|error|tip|note)\s+(.+?):::/s;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'callout',
        raw: match[0],
        calloutType: match[1],
        text: match[2].trim()
      };
    }
    return undefined;
  },
  renderer(token) {
    const typeToClass: Record<string, {bg: string, icon: string}> = {
      info: { bg: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700', icon: 'fa-info-circle text-blue-500 dark:text-blue-400' },
      warning: { bg: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700', icon: 'fa-exclamation-triangle text-yellow-500 dark:text-yellow-400' },
      error: { bg: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700', icon: 'fa-times-circle text-red-500 dark:text-red-400' },
      tip: { bg: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700', icon: 'fa-lightbulb text-green-500 dark:text-green-400' },
      note: { bg: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700', icon: 'fa-sticky-note text-gray-500 dark:text-gray-400' }
    };
    
    const { bg, icon } = typeToClass[token.calloutType] || typeToClass.note;
    
    return `<div class="callout ${bg} border-l-4 p-4 rounded-r-lg my-4">
      <div class="flex items-center">
        <i class="fas ${icon} mr-3 text-lg"></i>
        <div>${marked.parse(token.text)}</div>
      </div>
    </div>`;
  }
};

// Define the interactive code extension
export const codeRunExtension: CustomExtension = {
  name: 'coderun',
  level: 'block',
  start(src) {
    return src.match(/^```(js|javascript|python|typescript|html)\s+run/)?.index;
  },
  tokenizer(src) {
    const rule = /^```(js|javascript|python|typescript|html)\s+run\s+([\s\S]+?)```/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'coderun',
        raw: match[0],
        lang: match[1],
        code: match[2].trim()
      };
    }
    return undefined;
  },
  renderer(token) {
    return `<div class="code-runner my-4">
      <div class="code-block relative">
        <pre><code class="language-${token.lang}">${token.code}</code></pre>
        <button class="run-code absolute top-2 right-12 p-1 rounded bg-green-600 text-white text-xs hover:bg-green-700">
          <i class="fas fa-play mr-1"></i> Run
        </button>
      </div>
      <div class="output mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded hidden">
        <div class="output-header flex justify-between items-center mb-2">
          <span class="font-medium">Output</span>
          <button class="clear-output text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <i class="fas fa-times"></i> Clear
          </button>
        </div>
        <div class="output-content font-mono text-sm"></div>
      </div>
    </div>`;
  }
};

// Register custom extensions with marked
export function registerCustomExtensions() {
  marked.use({
    extensions: [
      quizExtension,
      calloutExtension,
      codeRunExtension
    ]
  });
}
