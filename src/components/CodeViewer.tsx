import { createSignal } from "solid-js";

interface CodeViewerProps {
  html: string;
  rawContent: string;
}

export default function CodeViewer(props: CodeViewerProps) {
  const [showLineNumbers, setShowLineNumbers] = createSignal(true);
  const [copied, setCopied] = createSignal(false);
  let timer: NodeJS.Timeout | null = null;

  const handleCopy = async () => {
    if (timer) clearTimeout(timer);
    await navigator.clipboard.writeText(props.rawContent);
    setCopied(true);
    timer = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div class="w-full">
      <div
        class="
        relative
        before:content-[''] before:absolute before:top-0 before:bottom-0 before:-left-80 before:-right-80 before:border-y before:border-mauve-200
        after:z-0 after:content-[''] after:absolute after:top-0 after:bottom-0 after:-left-80 after:-right-80 after:bg-mauve-200 after:bg-diagonal after:mask-(--background-image-diagonal) after:mask-size-[6px_6px] after:mask-repeat after:opacity-10
        "
      >
        <div class="relative flex items-center justify-between bg-mauve-50 px-4 py-2 z-20 border border-mauve-200 -mx-4">
          <div class="flex items-center gap-6 pr-4 border-r border-mauve-200">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showLineNumbers()}
                onChange={(e) => setShowLineNumbers(e.currentTarget.checked)}
                class="hidden"
              />
              <span class="font-sans text-xs uppercase tracking-wider">
                Line numbers: {showLineNumbers() ? "on" : "off"}
              </span>
            </label>
          </div>

          <button
            onClick={handleCopy}
            class="border-l border-mauve-200 text-sm pl-4 cursor-pointer w-18 font-sans hover:underline"
          >
            {copied() ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Code display */}
      <div
        class="overflow-x-auto border-b border-mauve-200 max-w-3xl p-4 pl-0 bg-white"
        classList={{
          "[&_.line]:pl-12": !showLineNumbers(),
        }}
      >
        <div
          innerHTML={props.html}
          class="shiki-container text-sm pre:m-0 font-mono"
          classList={{
            "no-line-numbers": !showLineNumbers(),
          }}
        />
      </div>
    </div>
  );
}
