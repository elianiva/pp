import { createSignal } from 'solid-js';

interface CodeViewerProps {
  html: string;
  rawContent: string;
}

export default function CodeViewer(props: CodeViewerProps) {
  const [showLineNumbers, setShowLineNumbers] = createSignal(true);
  const [copied, setCopied] = createSignal(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(props.rawContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div class="w-full">
      <div class="flex items-center justify-between px-4 py-2 bg-stone-100 border-b border-stone-200">
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showLineNumbers()}
              onChange={(e) => setShowLineNumbers(e.currentTarget.checked)}
              class="rounded border-stone-300 text-mauve-600 focus:ring-mauve-500"
            />
            Line numbers
          </label>
        </div>
        <button
          onClick={handleCopy}
          class="px-3 py-1.5 text-sm bg-white border border-stone-300 rounded hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500 transition-colors"
        >
          {copied() ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div
        class="overflow-x-auto"
        classList={{
          '[&_.line]:pl-4': !showLineNumbers(),
        }}
      >
        <div innerHTML={props.html} class="shiki-container" />
      </div>
    </div>
  );
}
