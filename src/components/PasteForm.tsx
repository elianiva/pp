import { createSignal } from 'solid-js';
import LanguageSelector from './LanguageSelector';
import type { Language } from '../lib/shiki';

export default function PasteForm() {
  const [content, setContent] = createSignal('');
  const [language, setLanguage] = createSignal<Language>('plaintext');
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleSubmit = async () => {
    const text = content().trim();
    if (!text) {
      setError('Please enter some content');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/paste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text, language: language() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create paste');
      }

      const { id } = await response.json();
      window.location.href = `/${id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create paste');
      setIsSubmitting(false);
    }
  };

  return (
    <div class="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
      <div class="p-4 border-b border-stone-200 flex items-center justify-between">
        <LanguageSelector value={language()} onChange={setLanguage} />
      </div>
      <textarea
        value={content()}
        onInput={(e) => setContent(e.currentTarget.value)}
        class="w-full h-96 p-4 font-mono text-sm text-stone-700 bg-white resize-none focus:outline-none"
        placeholder="Paste your text or code here..."
        disabled={isSubmitting()}
      />
      {error() && (
        <div class="px-4 py-2 bg-red-50 border-t border-red-200 text-red-600 text-sm">
          {error()}
        </div>
      )}
      <div class="p-4 border-t border-stone-200 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting()}
          class="px-6 py-2 bg-mauve-600 text-white text-sm font-medium rounded hover:bg-mauve-700 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting() ? 'Creating...' : 'Create Paste'}
        </button>
      </div>
    </div>
  );
}
