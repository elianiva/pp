import { createSignal, createEffect } from "solid-js";
import LanguageSelector from "./LanguageSelector";
import { guessLanguage, type Language } from "../lib/shiki";

export default function PasteForm() {
  const [content, setContent] = createSignal("");
  const [language, setLanguage] = createSignal<Language>("plaintext");
  const [autoDetected, setAutoDetected] = createSignal(false);

  createEffect(() => {
    const text = content();
    if (text.length > 10 && !autoDetected()) {
      const guessed = guessLanguage(text);
      if (guessed !== "plaintext") {
        setLanguage(guessed);
      }
    }
  });
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async () => {
    const text = content().trim();
    if (!text) {
      setError("Please enter some content");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/paste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, language: language() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create paste");
      }

      const { id } = await response.json();
      window.location.href = `/${id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create paste");
      setIsSubmitting(false);
    }
  };

  return (
    <div class="">
      <div
        class="
        relative sm:-mx-4
        before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 md:before:-left-80 md:before:-right-80 before:border-y before:border-mauve-200
        after:z-0 after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 md:after:-left-80 md:after:-right-80 after:bg-mauve-200 after:bg-diagonal after:mask-(--background-image-diagonal) after:mask-size-[6px_6px] after:mask-repeat after:opacity-10
        "
      >
        <div class="relative bg-mauve-50 px-4 py-2 z-20 border border-mauve-200">
          <LanguageSelector
            value={language()}
            onChange={(v) => {
              setLanguage(v);
              setAutoDetected(true);
            }}
          />
        </div>
      </div>

      {/* Text area */}
      <textarea
        value={content()}
        onInput={(e) => setContent(e.currentTarget.value)}
        class="block w-full min-h-[60vh] md:min-h-128 overscroll-none p-4 bg-white text-mauve-700 font-mono text-sm resize-none focus:outline-none border-mauve-200 leading-relaxed"
        placeholder="Paste youre text here..."
        disabled={isSubmitting()}
        spellcheck={false}
      />

      {/* Action bar */}
      <div
        class="
        relative sm:-mx-4
        before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 md:before:-left-80 md:before:-right-80 before:border-y before:border-mauve-200
        after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 md:after:-left-80 md:after:-right-80 after:bg-mauve-200 after:bg-diagonal after:mask-(--background-image-diagonal) after:mask-size-[6px_6px] after:mask-repeat after:opacity-10
        "
      >
        <div class="relative bg-mauve-50 z-20 border border-mauve-200 flex items-center justify-between py-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting()}
            class="py-1 px-4 bg-mauve-50 text-mauve-700 text-sm font-medium cursor-pointer border-r border-mauve-200 hover:underline text-left"
          >
            {isSubmitting() ? "Creating..." : "Create Paste"}
          </button>
          <div class={`text-sm text-mauve-400 text-mono px-4 border-l border-mauve-200`}>
            <span class="tabular-nums break-all sm:break-normal">
              {content().length} chars · {content().split("\n").length} lines
            </span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error() && (
        <div class="error-box border-x-0">
          <span class="text-mono">error:</span> {error()}
        </div>
      )}
    </div>
  );
}
