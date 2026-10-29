import { Link } from "react-router";
import { FiArrowLeft } from "react-icons/fi";

// `number` is just the item's position in the list (UI numbering, not an API field).
const TermCard = ({ title, number, to }) => (
  <Link
    to={to}
    className="group flex items-center gap-3 rounded-xl border border-stone-300/70 bg-white/70 p-3 transition hover:border-emerald-600/50 hover:bg-white focus-visible:ring-2 focus-visible:ring-emerald-600/40 focus-visible:outline-none dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-emerald-400/40 dark:hover:bg-white/[0.07]"
  >
    {/* diamond badge: a nod to the geometric rosettes of manuscripts */}
    <span className="grid size-12 shrink-0 place-items-center">
      <span className="grid size-8 rotate-45 place-items-center rounded-md border border-emerald-700/30 text-emerald-700 transition group-hover:bg-emerald-700/10 dark:border-emerald-400/30 dark:text-emerald-400 dark:group-hover:bg-emerald-400/10">
        <span className="-rotate-45 text-xs">
          {number.toLocaleString("fa-IR")}
        </span>
      </span>
    </span>

    <span className="flex-1 leading-8 font-semibold text-stone-900 dark:text-stone-100">
      {title}
    </span>

    <FiArrowLeft
      aria-hidden="true"
      className="shrink-0 text-stone-400 transition group-hover:-translate-x-1 group-hover:text-emerald-700 dark:text-white/30 dark:group-hover:text-emerald-400"
    />
  </Link>
);

export default TermCard;
