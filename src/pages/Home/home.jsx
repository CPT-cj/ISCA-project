import { useMemo, useRef } from "react";
import { useSearchParams } from "react-router";
import Pagination from "../../components/common/Pagination/pagination";
import { DOMAINS_URL, useApi } from "../../hooks/useApi";
import TermCard from "../term/termCard";
import TermIntro from "../term/termIntro";

const PAGE_SIZE = 12;

// Each domain has its own page (pages/domain) that lists its terms.
const getDomainPath = (dom) => `/domain/${dom.id}`;

const toFa = (n) => n.toLocaleString("fa-IR");

// Makes Persian search forgiving: Arabic/Persian ی ک, half-spaces, diacritics.
const normalize = (value) =>
  String(value ?? "")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u065F\u0640]/g, "")
    .replace(/[\u200c\u200d]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const messageBox =
  "rounded-xl border border-stone-300/70 bg-white/70 p-8 text-center text-stone-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400";
const actionButton =
  "mt-4 inline-flex h-10 items-center rounded-lg border border-emerald-700/40 px-4 text-sm text-emerald-800 transition hover:bg-emerald-700/10 focus-visible:ring-2 focus-visible:ring-emerald-600/40 focus-visible:outline-none dark:border-emerald-400/40 dark:text-emerald-300 dark:hover:bg-emerald-400/10";

const Home = () => {
  // Same request the Header makes for its select: it is sent once and shared.
  const { data, loading, error, retry } = useApi(DOMAINS_URL);
  const ready = !loading && !error;
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef(null);

  const domains = useMemo(
    () =>
      (Array.isArray(data?.data) ? data.data : []).filter(
        (dom) => dom?.id != null && dom?.title,
      ),
    [data],
  );

  // The search text and the page live in the URL (?q=...&page=...), so the
  // header search box, the back button and shared links all stay in sync.
  const query = searchParams.get("q")?.trim() ?? "";

  const filtered = useMemo(() => {
    if (!query) return domains;
    const needle = normalize(query);
    return domains.filter((dom) => normalize(dom.title).includes(needle));
  }, [domains, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requested = Number.parseInt(searchParams.get("page") ?? "1", 10);
  // Clamped on every render, so a stale/invalid ?page= can never show nothing.
  const page = Number.isNaN(requested)
    ? 1
    : Math.min(Math.max(requested, 1), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

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

  const clearSearch = () => setSearchParams({});

  let summary = "";
  if (ready && filtered.length > 0) {
    const range = `${toFa(start + 1)} تا ${toFa(start + visible.length)} از ${toFa(filtered.length)}`;
    summary = query
      ? `نتایج جستجوی «${query}»: ${range} دامنه`
      : `نمایش ${range} دامنه`;
  }

  return (
    <div className="mx-auto w-[90%] max-w-4xl space-y-10 pb-24">
      <TermIntro />

      <section
        ref={listRef}
        aria-labelledby="domains-title"
        className="scroll-mt-6"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="domains-title"
              className="text-xl font-bold text-stone-900 dark:text-white"
            >
              دامنه‌های اصطلاحنامه
            </h2>
            <p
              aria-live="polite"
              className="mt-1 min-h-6 text-sm text-stone-500 dark:text-stone-400"
            >
              {summary}
            </p>
          </div>
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="h-9 rounded-lg border border-stone-300 px-3 text-sm text-stone-700 transition hover:border-emerald-600/50 hover:text-emerald-800 dark:border-white/15 dark:text-stone-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
            >
              پاک کردن جستجو
            </button>
          )}
        </div>

        {loading && (
          <ul
            role="status"
            aria-label="در حال بارگذاری"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <li
                key={i}
                className="h-[74px] animate-pulse rounded-xl bg-stone-900/5 dark:bg-white/5"
              />
            ))}
          </ul>
        )}

        {error && (
          <div role="alert" className={messageBox}>
            <p>دریافت فهرست دامنه‌ها با خطا مواجه شد.</p>
            <button type="button" onClick={retry} className={actionButton}>
              تلاش دوباره
            </button>
          </div>
        )}

        {ready && filtered.length === 0 && (
          <div className={messageBox}>
            {query ? (
              <>
                <p>نتیجه‌ای برای «{query}» پیدا نشد.</p>
                <button
                  type="button"
                  onClick={clearSearch}
                  className={actionButton}
                >
                  نمایش همه دامنه‌ها
                </button>
              </>
            ) : (
              <p>هنوز دامنه‌ای ثبت نشده است.</p>
            )}
          </div>
        )}

        {ready && visible.length > 0 && (
          <>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((dom, i) => (
                <li key={dom.id}>
                  <TermCard
                    title={dom.title}
                    number={start + i + 1}
                    to={getDomainPath(dom)}
                  />
                </li>
              ))}
            </ul>
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={goToPage}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
