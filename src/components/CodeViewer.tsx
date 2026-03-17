import { createSignal } from "solid-js";

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
      {/* Terminal toolbar */}
      <div class="terminal-bar terminal-bar-dots">
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
            <input
              type="checkbox"
              checked={showLineNumbers()}
              onChange={(e) => setShowLineNumbers(e.currentTarget.checked)}
            />
            <span class="text-mono text-xs uppercase tracking-wider">Line numbers</span>
          </label>
        </div>

        <button
          onClick={handleCopy}
          class={`text-sm text-mono text-xs uppercase tracking-wider px-3 py-1 border transition-colors ${
            copied()
              ? "bg-[var(--success-bg)] border-[var(--success-border)] text-[var(--success-text)]"
              : "bg-[var(--bg-secondary)] border-[var(--border-secondary)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
          }`}
        >
          {copied() ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Code display */}
      <div
        class="overflow-x-auto border-b border-[var(--border-primary)]"
        classList={{
          "[&_.line]:pl-4": !showLineNumbers(),
        }}
      >
        <div
          innerHTML={props.html}
          class="shiki-container"
          classList={{
            "no-line-numbers": !showLineNumbers(),
          }}
        />
      </div>
    </div>
  );
}
