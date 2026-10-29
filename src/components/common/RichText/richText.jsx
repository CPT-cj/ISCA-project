import { useMemo } from "react";
import { parseRichText } from "../../../utils/html";

// Shows API HTML safely (see utils/html.js). useMemo: parsing the HTML is the
// only real work here, so it is redone only when the html string changes.
const RichText = ({ html, className = "" }) => {
  const { main, footnotes } = useMemo(() => parseRichText(html), [html]);
  if (!main.trim() && !footnotes.trim()) return null;

  return (
    <div className={className}>
      {main && (
        <div
          className="leading-8 text-stone-700 dark:text-stone-300 [&_blockquote]:border-s-2 [&_blockquote]:border-emerald-700/30 [&_blockquote]:ps-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:ps-6"
          dangerouslySetInnerHTML={{ __html: main }}
        />
      )}
      {footnotes && (
        <div
          className="mt-4 border-t border-stone-300/70 pt-3 text-xs leading-6 text-stone-500 dark:border-white/10 dark:text-stone-400 [&_p]:mb-1"
          dangerouslySetInnerHTML={{ __html: footnotes }}
        />
      )}
    </div>
  );
};

export default RichText;
