import { createMemo, createSignal } from "solid-js";
import { parse } from "marked";

interface CodeViewerProps {
  html: string;
  rawContent: string;
  isMarkdown?: boolean;
}

export default function CodeViewer(props: CodeViewerProps) {
  const [showLineNumbers, setShowLineNumbers] = createSignal(true);
  const [wrapLines, setWrapLines] = createSignal(false);
  const [copied, setCopied] = createSignal(false);
  const [showRendered, setShowRendered] = createSignal(props.isMarkdown ?? false);
  const renderedHtml = createMemo(() => parse(props.rawContent, { async: false }) as string);
  const contentWithLineNumberDivs = createMemo(() =>
    props.html.replace(
      /<span class="line">([\s\S]*?)<\/span>/g,
      (_, lineContent: string) =>
        `<div class="code-line"><div class="line-number" aria-hidden="true"></div><div class="line-content">${lineContent}</div></div>`,
    ),
  );
  let timer: NodeJS.Timeout | null = null;

  const handleCopy = async () => {
    if (timer) clearTimeout(timer);
    await navigator.clipboard.writeText(props.rawContent);
    setCopied(true);
    timer = setTimeout(() => setCopied(false), 2000);
  };

  const handleCodeWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || e.shiftKey) return;
    e.preventDefault();
    window.scrollBy({ top: e.deltaY, behavior: "auto" });
  };

  return (
    <div class="w-full">
      <div
        class="
        relative sm:-mx-4
        before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 md:before:-left-80 md:before:-right-80 before:border-y before:border-mauve-200
        after:z-0 after:content-[''] after:absolute after:top-0 after:bottom-0 after:left-0 after:right-0 md:after:-left-80 md:after:-right-80 after:bg-mauve-200 after:bg-diagonal after:mask-(--background-image-diagonal) after:mask-size-[6px_6px] after:mask-repeat after:opacity-10
        "
      >
        <div class="relative flex items-center justify-between bg-mauve-50 px-4 py-2 z-20 border border-mauve-200">
          <div class="flex items-center gap-4">
            {props.isMarkdown && (
              <div class="flex items-center gap-1 border-r border-mauve-200 pr-4">
                <button
                  onClick={() => setShowRendered(true)}
                  class="text-xs uppercase tracking-wider font-sans cursor-pointer px-2 py-0.5"
                  classList={{
                    "bg-mauve-200": showRendered(),
                    "text-mauve-500 hover:text-mauve-900": !showRendered(),
                  }}
                >
                  Render
                </button>
                <button
                  onClick={() => setShowRendered(false)}
                  class="text-xs uppercase tracking-wider font-sans cursor-pointer px-2 py-0.5"
                  classList={{
                    "bg-mauve-200": !showRendered(),
                    "text-mauve-500 hover:text-mauve-900": showRendered(),
                  }}
                >
                  Raw
                </button>
              </div>
            )}
            {(!props.isMarkdown || !showRendered()) && (
              <>
                <label class="flex items-center gap-2 text-sm cursor-pointer border-r border-mauve-200 pr-4">
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
                <label class="flex items-center gap-2 text-sm cursor-pointer border-r border-mauve-200 pr-4">
                  <input
                    type="checkbox"
                    checked={wrapLines()}
                    onChange={(e) => setWrapLines(e.currentTarget.checked)}
                    class="hidden"
                  />
                  <span class="font-sans text-xs uppercase tracking-wider">
                    Line wrap: {wrapLines() ? "on" : "off"}
                  </span>
                </label>
              </>
            )}
          </div>

          <button
            onClick={handleCopy}
            class="border-l border-mauve-200 text-sm pl-4 cursor-pointer w-18 font-sans hover:underline"
          >
            {copied() ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {props.isMarkdown && showRendered() ? (
        <div class="border-b border-mauve-200 w-full p-8 bg-white">
          <div
            innerHTML={renderedHtml()}
            class="prose prose-sm max-w-none prose-headings:font-sans prose-a:text-mauve-700 prose-a:underline prose-code:font-mono prose-code:text-sm prose-pre:bg-mauve-50 prose-pre:border prose-pre:border-mauve-200 prose-img:border prose-img:border-mauve-200 prose-blockquote:border-l-mauve-300 prose-blockquote:text-mauve-600"
          />
        </div>
      ) : (
        <div
          onWheel={handleCodeWheel}
          class="overflow-x-auto border-b border-mauve-200 w-full p-4 pl-0 bg-white overscroll-x-none"
        >
          <div
            innerHTML={contentWithLineNumberDivs()}
            class="shiki-container text-sm pre:m-0 font-mono"
            classList={{
              "no-line-numbers": !showLineNumbers(),
              "wrap-lines [&_pre]:whitespace-pre-wrap [&_pre]:wrap-break-word": wrapLines(),
            }}
          />
        </div>
      )}
    </div>
  );
}
