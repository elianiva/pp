import { createMemo, createSignal } from "solid-js";

interface CodeViewerProps {
  html: string;
  renderedHtml?: string | null;
  rawContent: string;
  isMarkdown?: boolean;
  isHtml?: boolean;
  rendered?: boolean;
}

export default function CodeViewer(props: CodeViewerProps) {
  const [showLineNumbers, setShowLineNumbers] = createSignal(true);
  const [wrapLines, setWrapLines] = createSignal(false);
  const [copied, setCopied] = createSignal(false);
  const [showRendered, setShowRendered] = createSignal(props.rendered ?? false);
  const hasRenderTabs = props.isMarkdown || props.isHtml;
  const contentWithLineNumberDivs = createMemo(() =>
    props.html.replace(
      /<span class="line">([\s\S]*?)<\/span>(\n|$)/g,
      (_, lineContent: string) =>
        `<div class="code-line"><div class="line-number" aria-hidden="true"></div><div class="line-content">${lineContent}</div></div>`,
    ),
  );
  let timer: NodeJS.Timeout | null = null;
  let iframeRef: HTMLIFrameElement | undefined;
  const CONTENT_WIDTH = 1920;

  const wrappedSrcdoc = `<html><head><style>html,body{height:100%;margin:0;overflow:hidden;display:flex;justify-content:center;align-items:center;}#scale-root{transform-origin:top center;}</style></head><body><div id="scale-root" style="width:${CONTENT_WIDTH}px;">${props.rawContent}</div><script>window.addEventListener('message',e=>{if(typeof e.data==='number'){document.getElementById('scale-root').style.transform='scale('+e.data+')';document.body.style.width=e.data*${CONTENT_WIDTH}+'px';}})</script></body></html>`;

  const handleIframeLoad = () => {
    if (!iframeRef) return;
    const scale = iframeRef.clientWidth / CONTENT_WIDTH;
    iframeRef.contentWindow?.postMessage(scale, '*');
  };


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
            {hasRenderTabs && (
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
            {(!hasRenderTabs || !showRendered()) && (
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

      {hasRenderTabs && showRendered() ? (
        props.isHtml ? (
          <div class="border-b border-mauve-200 w-full bg-white">
            <iframe
              ref={(el: HTMLIFrameElement) => (iframeRef = el)}
              srcdoc={wrappedSrcdoc}
              sandbox="allow-scripts"
              class="w-full border-0 aspect-video mx-auto"
              onLoad={handleIframeLoad}
            />
          </div>
        ) : (
          <div class="border-b border-mauve-200 w-full px-4 py-3 bg-white">
            <div
              innerHTML={props.renderedHtml ?? props.html}
              class="markdown-body text-[15px] leading-relaxed text-mauve-800
                [&_h1]:text-2xl [&_h1]:font-sans [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
                [&_h2]:xl:text-xl [&_h2]:font-sans [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-lg [&_h3]:font-sans [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2
                [&_p]:my-3
                [&_ul]:my-3 [&_ul]:pl-6 [&_ul]:list-disc
                [&_ol]:my-3 [&_ol]:pl-6 [&_ol]:list-decimal
                [&_li]:my-1
                [&_a]:text-mauve-700 [&_a]:underline [&_a]:decoration-mauve-300 [&_a]:underline-offset-2 [&_a]:hover:text-mauve-900
                [&_code]:font-mono [&_code]:text-[13px] [&_code]:bg-mauve-100 [&_code]:px-1.5 [&_code]:py-0.5
                [&_pre]:my-4 [&_pre]:overflow-x-auto
                [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[13px]
                [&_table]:my-4 [&_table]:w-full [&_table]:text-[14px]
                [&_thead]:border-b [&_thead]:border-mauve-200
                [&_th]:py-2 [&_th]:text-left [&_th]:font-sans [&_th]:font-semibold [&_th]:text-mauve-600
                [&_td]:py-2 [&_td]:border-b [&_td]:border-mauve-100
                [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-mauve-300 [&_blockquote]:pl-4 [&_blockquote]:text-mauve-600
                [&_hr]:my-6 [&_hr]:border-mauve-200
                [&_img]:my-4 [&_img]:border [&_img]:border-mauve-200"
            />
          </div>
        )
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
