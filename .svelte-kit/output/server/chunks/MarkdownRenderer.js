import { N as fallback, G as attr_class, M as bind_props, B as pop, z as push, J as stringify } from "./index.js";
import "marked";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import ruby from "highlight.js/lib/languages/ruby";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import markdown from "highlight.js/lib/languages/markdown";
/* empty css                                               */
import { h as html } from "./html.js";
function MarkdownRenderer($$payload, $$props) {
  push();
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("cpp", cpp);
  hljs.registerLanguage("csharp", csharp);
  hljs.registerLanguage("ruby", ruby);
  hljs.registerLanguage("go", go);
  hljs.registerLanguage("rust", rust);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("markdown", markdown);
  let content = fallback($$props["content"], "");
  let className = fallback($$props["className"], "");
  let renderedContent = "";
  $$payload.out += `<!---->/// <reference lib="dom"></reference> <div${attr_class(`markdown-content prose prose-lg dark:prose-invert max-w-none ${stringify(className)}`)}>${html(renderedContent)}</div>`;
  bind_props($$props, { content, className });
  pop();
}
export {
  MarkdownRenderer as M
};
