import { createSignal, createMemo, For, Show, onMount, onCleanup } from "solid-js";
import { LANGUAGES, type Language } from "../lib/shiki";

const EXTENSION_MAP: Record<Language, string> = {
  plaintext: "",
  typescript: ".tsx, .ts",
  javascript: ".js, .jsx",
  python: ".py",
  rust: ".rs",
  go: ".go",
  html: ".html",
  css: ".css",
  json: ".json",
  markdown: ".md",
};

interface LanguageSelectorProps {
  value: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSelector(props: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  const selectedLabel = createMemo(() => {
    const lang = LANGUAGES.find((l) => l.value === props.value);
    return lang?.label ?? props.value;
  });

  const handleSelect = (value: Language) => {
    props.onChange(value);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  let containerRef: HTMLDivElement;

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });

  return (
    <div class="flex items-center gap-3">
      <label class="text-sm text-secondary text-mono tracking-wider font-display font-medium">
        Lang:
      </label>

      <div class="relative" ref={(el) => (containerRef = el)}>
        {/* Trigger button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen())}
          class="flex items-center gap-2 border-x border-mauve-200 text-sm text-mono text-mauve-700 px-3 py-1.5 focus:outline-none transition-colors min-w-50 justify-between"
          aria-expanded={isOpen()}
          aria-haspopup="listbox"
        >
          <span>{selectedLabel()}</span>
          <svg
            class={`w-4 h-4 text-mauve-400 transition-transform ${isOpen() ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown menu */}
        <Show when={isOpen()}>
          <div
            class="absolute top-full z-50 w-50 bg-mauve-50 border border-mauve-200/50 max-h-64 overflow-auto overflow-x-hidden divide-y divide-mauve-200"
            role="listbox"
          >
            <For each={LANGUAGES}>
              {(lang) => (
                <button
                  type="button"
                  onClick={() => handleSelect(lang.value)}
                  class={`w-full text-left px-3 py-2 text-sm text-mono transition-colors flex items-center justify-between gap-4 ${
                    props.value === lang.value
                      ? "bg-mauve-100 text-mauve-900"
                      : "text-mauve-600 hover:bg-mauve-100 hover:text-mauve-900"
                  }`}
                  role="option"
                  aria-selected={props.value === lang.value}
                >
                  <span>{lang.label}</span>
                  <Show when={EXTENSION_MAP[lang.value]}>
                    <span class="text-xs text-mauve-400">{EXTENSION_MAP[lang.value]}</span>
                  </Show>
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  );
}
