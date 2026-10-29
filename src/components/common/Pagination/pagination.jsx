import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const toFa = (n) => n.toLocaleString("fa-IR");

// 1 … 4 5 6 … 20  (numbers and "…" gaps)
const buildPages = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  const pages = [1];
  if (left > 2) pages.push("gap-start");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("gap-end");
  pages.push(total);
  return pages;
};

const base =
  "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm transition focus-visible:ring-2 focus-visible:ring-emerald-600/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40";
const idle =
  "border-stone-300 bg-white/70 text-stone-700 hover:border-emerald-600/50 hover:text-emerald-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300";
const active =
  "border-emerald-700 bg-emerald-700 text-white dark:border-emerald-400/50 dark:bg-emerald-500/15 dark:text-emerald-300";

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="صفحه‌بندی"
      dir="rtl"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        className={`${base} ${idle}`}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="صفحه قبل"
      >
        <FiChevronRight size={16} />
        قبلی
      </button>

      {buildPages(page, totalPages).map((item) =>
        typeof item === "string" ? (
          <span
            key={item}
            aria-hidden="true"
            className="px-1 text-stone-400 dark:text-white/30"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${base} ${item === page ? active : idle}`}
            onClick={() => onChange(item)}
            aria-label={`صفحه ${toFa(item)}`}
            aria-current={item === page ? "page" : undefined}
          >
            {toFa(item)}
          </button>
        ),
      )}

      <button
        type="button"
        className={`${base} ${idle}`}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="صفحه بعد"
      >
        بعدی
        <FiChevronLeft size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
