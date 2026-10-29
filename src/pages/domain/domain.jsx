import { useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { FiArrowRight } from "react-icons/fi";
import Pagination from "../../components/common/Pagination/pagination";
import { DOMAINS_URL, useApi } from "../../hooks/useApi";
import { useTerms } from "../../hooks/useTerms";
import TermItem from "./termItem";

const toFa = (n) => n.toLocaleString("fa-IR");

const messageBox =
  "rounded-xl border border-stone-300/70 bg-white/70 p-8 text-center text-stone-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400";
const actionButton =
  "mt-4 inline-flex h-10 items-center rounded-lg border border-emerald-700/40 px-4 text-sm text-emerald-800 transition hover:bg-emerald-700/10 dark:border-emerald-400/40 dark:text-emerald-300 dark:hover:bg-emerald-400/10";

// Serves two routes: /domain/:id (terms of one domain) and /search (all domains).
// The word and the page come from the URL (?word=...&page=...), which the
// Header search form writes. A new search is a new URL without `page`, so
// the page resets to 1 by itself.
const Domain = () => {
  const { id = "" } = useParams(); // "" = global search
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef(null);

  const word = searchParams.get("word")?.trim() ?? "";
  const requested = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isNaN(requested) ? 1 : Math.max(requested, 1);

  const { terms, pagination, loading, error, retry } = useTerms({
    domain: id,
    word,
    page,
  });

  // /v1/domains is already cached by the Header, so this costs no extra request.
  const { data: domainsAnswer } = useApi(DOMAINS_URL);
  const domainTitle = domainsAnswer?.data?.find((d) => String(d.id) === id)?.title;
  const title = id ? (domainTitle ?? "اصطلاحات دامنه") : "نتایج جستجو در همه دامنه‌ها";

  const totalPages = pagination?.total_pages ?? 1;

  const goToPage = (next) => {
    const target = Math.min(Math.max(next, 1), totalPages);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (target === 1) params.delete("page");
      else params.set("page", String(target));
      return params;
    });
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  let summary = "";
  if (pagination && pagination.total > 0) {
    summary = `${word ? `نتایج «${word}»: ` : ""}${toFa(pagination.total)} اصطلاح · صفحه ${toFa(pagination.current_page)} از ${toFa(totalPages)}`;
  }

  return (
    <div className="mx-auto w-[90%] max-w-4xl pb-24">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-emerald-800 hover:underline dark:text-emerald-300"
      >
        <FiArrowRight aria-hidden="true" />
        همه دامنه‌ها
      </Link>

      <h2 className="mt-4 text-2xl font-bold text-stone-900 dark:text-white">
        {title}
      </h2>

      <p
        ref={listRef}
        aria-live="polite"
        className="mt-2 mb-4 min-h-6 scroll-mt-6 text-sm text-stone-500 dark:text-stone-400"
      >
        {summary}
      </p>

      {loading && (
        <ul role="status" aria-label="در حال بارگذاری" className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <li
              key={i}
              className="h-[84px] animate-pulse rounded-xl bg-stone-900/5 dark:bg-white/5"
            />
          ))}
        </ul>
      )}

      {error && (
        <div role="alert" className={messageBox}>
          <p>دریافت اصطلاحات با خطا مواجه شد.</p>
          <button type="button" onClick={retry} className={actionButton}>
            تلاش دوباره
          </button>
        </div>
      )}

      {!loading && !error && terms.length === 0 && (
        <div className={messageBox}>
          {pagination?.total > 0 ? (
            <>
              <p>این صفحه وجود ندارد.</p>
              <button type="button" onClick={() => goToPage(1)} className={actionButton}>
                رفتن به صفحه اول
              </button>
            </>
          ) : word ? (
            <p>اصطلاحی با «{word}» پیدا نشد.</p>
          ) : (
            <p>اصطلاحی برای نمایش وجود ندارد.</p>
          )}
        </div>
      )}

      {terms.length > 0 && (
        <>
          <ul className="space-y-3">
            {terms.map((term) => (
              <TermItem key={term.id} term={term} showDomain={!id} />
            ))}
          </ul>
          <Pagination page={page} totalPages={totalPages} onChange={goToPage} />
        </>
      )}
    </div>
  );
};

export default Domain;
