import { LANGUAGES, type Language } from '../lib/shiki';

interface LanguageSelectorProps {
  value: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSelector(props: LanguageSelectorProps) {
  return (
    <div class="flex items-center gap-2">
      <label class="text-sm text-stone-600">Language:</label>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.currentTarget.value as Language)}
        class="px-3 py-1.5 bg-white border border-stone-300 rounded text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-mauve-500 focus:border-mauve-500"
      >
        {LANGUAGES.map((lang) => (
          <option value={lang.value}>{lang.label}</option>
        ))}
      </select>
    </div>
  );
}
