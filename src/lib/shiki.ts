import { createHighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import flouride from "@elianiva/flouride";
import typescript from "@shikijs/langs/typescript";
import javascript from "@shikijs/langs/javascript";
import python from "@shikijs/langs/python";
import rust from "@shikijs/langs/rust";
import go from "@shikijs/langs/go";
import html from "@shikijs/langs/html";
import css from "@shikijs/langs/css";
import json from "@shikijs/langs/json";
import markdown from "@shikijs/langs/markdown";
import oneLight from "@shikijs/themes/one-light";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";

let highlighter: Awaited<ReturnType<typeof createHighlighterCore>> | null = null;

export async function getHighlighter() {
  if (highlighter) return highlighter;

  highlighter = await createHighlighterCore({
    themes: [oneLight],
    langs: [typescript, javascript, python, rust, go, html, css, json, markdown],
    engine: createJavaScriptRegexEngine(),
  });

  return highlighter;
}

export async function highlight(code: string, lang: string): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang: lang === "plaintext" ? "text" : lang,
    theme: "one-light",
  });
}

export const LANGUAGES = [
  { value: "auto", label: "Auto Detect" },
  { value: "plaintext", label: "Plain Text" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
] as const;

export type Language = (typeof LANGUAGES)[number]["value"];

const SUPPORTED_LANGUAGES = new Set(LANGUAGES.map((l) => l.value));

export function guessLanguage(code: string): Language {
  const result = flouride(code, { shiki: true, noUnknown: true });
  const lang = result.language as Language;
  return SUPPORTED_LANGUAGES.has(lang) && lang !== "auto" ? lang : "plaintext";
}

export const LANGUAGE_EXTENSION: Record<string, string> = {
  typescript: "tsx",
  javascript: "jsx",
  python: "py",
  rust: "rs",
  go: "go",
  html: "html",
  css: "css",
  json: "json",
  markdown: "md",
  plaintext: "txt",
};

export function getExtension(language: string): string | null {
  return LANGUAGE_EXTENSION[language] ?? null;
}

export function getLanguageFromExtension(ext: string): string {
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    rs: "rust",
    go: "go",
    html: "html",
    htm: "html",
    css: "css",
    json: "json",
    md: "markdown",
    txt: "plaintext",
  };
  return map[ext] || "plaintext";
}

export async function renderMarkdown(content: string): Promise<string> {
  const hl = await getHighlighter();
  const marked = new Marked(
    markedHighlight({
      langPrefix: "shiki language-",
      highlight(code, lang) {
        const language = lang && hl.getLanguage(lang) ? lang : "text";
        return hl.codeToHtml(code, { lang: language, theme: "one-light" });
      },
    }),
  );
  return marked.parse(content) as string;
}
