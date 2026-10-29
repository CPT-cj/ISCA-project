import { useState } from "react";
import { Link } from "react-router";
import Pagination from "../Pagination/pagination";
import { API, useApi } from "../../../hooks/useApi";
import { fa } from "../../../utils/format";

const label =
  "rounded border border-emerald-600/60 px-1.5 text-xs text-emerald-700 dark:border-emerald-400/50 dark:text-emerald-400";

// A labelled line of a card; nothing is drawn when the API value is empty.
const Field = ({ name, value }) =>
  value ? (
    <p className="flex flex-wrap items-baseline gap-2 text-sm leading-7 text-stone-700 dark:text-stone-300">
      <span className={label}>{name}:</span>
      {value}
    </p>
  ) : null;

// Both lists (/docs/new and /docs/new_indexed) open the same detail page.
const DocCard = ({ doc }) => (
  <li className="w-72 shrink-0 snap-start">
    <Link
      to={`/doc/${doc.id}`}
      className="block h-full rounded-xl border border-stone-300/70 bg-white/80 p-4 shadow-md transition hover:border-emerald-600/50 focus-visible:ring-2 focus-visible:ring-emerald-600/40 focus-visible:outline-none dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none dark:hover:border-emerald-400/40"
    >
      {doc.type && (
        <span className="text-xs text-stone-500 dark:text-stone-400">{doc.type}</span>
      )}
      <h3 className="mb-3 line-clamp-3 text-sm leading-7 font-bold text-emerald-700 dark:text-emerald-400">
        {doc.title}
      </h3>
      <div className="space-y-2">
        <Field name="انتشارات" value={doc.publisher} />
        <Field name="نویسنده" value={doc.author && fa(doc.author)} />
        <Field name="سال نشر" value={doc.publish_date && fa(doc.publish_date)} />
      </div>
    </Link>
  </li>
);

// Row of the newest documents. The ORDER is the server's: `/docs/new` and
// `/docs/new_indexed` return them newest first, so the list is shown as received
// (publish_date is only the book's publication year, not a registration date,
// so sorting by it would be wrong). `endpoint` is "new" or "new_indexed".
const LatestDocs = ({ title, endpoint, emptyText }) => {
  const [page, setPage] = useState(1);
  const { data, loading, error, retry } = useApi(
    `${API}/docs/${endpoint}${page > 1 ? `?page=${page}` : ""}`,
  );

  const docs = Array.isArray(data?.data) ? data.data.filter((d) => d?.id != null && d?.title) : [];
  const pagination = data?.meta?.pagination; // optional: not every endpoint sends it

  return (
    <section aria-labelledby={`latest-${endpoint}`}>
      <h2 id={`latest-${endpoint}`} className="text-xl font-bold text-stone-900 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 mb-4 min-h-6 text-sm text-stone-500 dark:text-stone-400">
        {pagination?.total > 0 &&
          `${pagination.total.toLocaleString("fa-IR")} مورد · صفحه ${pagination.current_page.toLocaleString("fa-IR")} از ${pagination.total_pages.toLocaleString("fa-IR")}`}
      </p>

      {loading && (
        <ul role="status" aria-label="در حال بارگذاری" className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="h-40 w-72 shrink-0 animate-pulse rounded-xl bg-stone-900/5 dark:bg-white/5" />
          ))}
        </ul>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-stone-300/70 bg-white/70 p-8 text-center text-stone-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400">
          <p>دریافت اطلاعات با خطا مواجه شد.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 inline-flex h-10 items-center rounded-lg border border-emerald-700/40 px-4 text-sm text-emerald-800 transition hover:bg-emerald-700/10 dark:border-emerald-400/40 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
          >
            تلاش دوباره
          </button>
        </div>
      )}

      {!loading && !error && docs.length === 0 && (
        <p className="rounded-xl border border-stone-300/70 bg-white/70 p-8 text-center text-stone-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400">
          {emptyText}
        </p>
      )}

      {docs.length > 0 && (
        <>
          {/* horizontal row: starts at the right edge (RTL) and scrolls to the left */}
          <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-1 pt-1 pb-4 [scrollbar-width:thin] [scrollbar-color:rgba(120,130,140,0.45)_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-stone-200/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stone-400/60 [&::-webkit-scrollbar-thumb:hover]:bg-stone-500/70 dark:[scrollbar-color:rgba(255,255,255,0.22)_transparent] dark:[&::-webkit-scrollbar-track]:bg-white/5 dark:[&::-webkit-scrollbar-thumb]:bg-white/20 dark:[&::-webkit-scrollbar-thumb:hover]:bg-white/35">
            {docs.map((doc) => (
              <DocCard key={doc.id} doc={doc} />
            ))}
          </ul>
          {pagination && (
            <Pagination page={page} totalPages={pagination.total_pages} onChange={setPage} />
          )}
        </>
      )}
    </section>
  );
};

export default LatestDocs;
