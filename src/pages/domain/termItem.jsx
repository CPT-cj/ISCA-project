import { Link } from "react-router";
import MaskIcon from "../../components/common/MaskIcon/maskIcon";
import { icons } from "../../imgs/icons";
import { htmlToText } from "../../utils/html";

const chip =
  "rounded-full border px-2.5 py-0.5 text-xs border-stone-300 text-stone-600 dark:border-white/15 dark:text-stone-400";
const preferredChip =
  "rounded-full border px-2.5 py-0.5 text-xs border-emerald-700/40 bg-emerald-700/10 text-emerald-800 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300";

const Count = ({ icon, value, label }) =>
  value > 0 && (
    <span className="inline-flex items-center gap-1.5">
      <MaskIcon {...icon} className="h-4 text-emerald-700 dark:text-emerald-400" />
      {value.toLocaleString("fa-IR")} {label}
    </span>
  );

// One row of the search result. Every field except `title` and `id` is optional.
// The definition can contain HTML, so the list shows only a plain-text preview.
const TermItem = ({ term, showDomain }) => {
  const definition = htmlToText(term.description || term.encyclopedia?.description);

  return (
    <li>
      <Link
        to={`/term/${term.id}`}
        className="block rounded-xl border border-stone-300/70 bg-white/70 p-4 transition hover:border-emerald-600/50 hover:bg-white focus-visible:ring-2 focus-visible:ring-emerald-600/40 focus-visible:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-emerald-400/40 dark:hover:bg-white/[0.07]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
            {term.title}
          </h3>
          {term.pref && (
            <span className={term.pref === "مرجح" ? preferredChip : chip}>
              {term.pref}
            </span>
          )}
          {term.status && <span className={chip}>{term.status}</span>}
          {showDomain && term.domain && <span className={chip}>{term.domain}</span>}
        </div>

        {definition && (
          <p className="mt-2 line-clamp-3 text-sm leading-7 text-stone-600 dark:text-stone-400">
            {definition}
          </p>
        )}

        {(term.relations_count > 0 || term.indexes_count > 0) && (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
            <Count icon={icons.relations} value={term.relations_count} label="رابطه" />
            <Count icon={icons.index} value={term.indexes_count} label="نمایه" />
          </div>
        )}
      </Link>
    </li>
  );
};

export default TermItem;
