import { useApi } from "../../../hooks/useApi";

// The API sends numbers as strings ("449543"). Missing, null and "" must not
// become 0 (Number("") is 0), so they are turned into NaN and skipped.
const toNumber = (raw) =>
  raw === null || raw === undefined || String(raw).trim() === "" ? NaN : Number(raw);

const message = "col-span-full text-center text-sm text-stone-500 dark:text-stone-400";

// `items`: [{ key, label }] where `key` is a field of the API answer.
// Reused by the term page and the index page; each gives its own url and items.
const Stats = ({ url, items }) => {
  const { data, loading, error, retry } = useApi(url);

  const stats = data?.data ?? data; // the fields are at the top level (or inside `data`)
  const isEmpty =
    !stats || (typeof stats === "object" && Object.keys(stats).length === 0);
  const shown = items
    .map(({ key, label }) => ({ key, label, value: toNumber(stats?.[key]) }))
    .filter(({ value }) => Number.isFinite(value));

  // The answer arrived but none of the expected fields is in it: the page asks
  // for the wrong field names. This is a bug to fix, not "no data", so it is
  // reported separately and the fields that were really received are logged.
  const unexpected = !loading && !error && !isEmpty && shown.length === 0;
  if (unexpected) {
    console.warn(`Stats: none of [${items.map((i) => i.key)}] found in ${url}. Received fields:`, Object.keys(stats));
  }

  return (
    <section aria-label="آمار" className="grid grid-cols-[repeat(auto-fit,minmax(13rem,1fr))] gap-4">
      {loading &&
        items.map(({ key }) => (
          <div key={key} role="status" aria-label="در حال بارگذاری" className="h-20 animate-pulse rounded-xl bg-stone-900/5 dark:bg-white/5" />
        ))}

      {error && (
        <p role="alert" className={message}>
          دریافت آمار با خطا مواجه شد.{" "}
          <button type="button" onClick={retry} className="text-emerald-800 underline dark:text-emerald-300">
            تلاش دوباره
          </button>
        </p>
      )}

      {unexpected && <p role="alert" className={message}>قالب پاسخ آمار با انتظار برنامه مطابقت ندارد.</p>}

      {!loading && !error && isEmpty && <p className={message}>آماری در دسترس نیست.</p>}

      {shown.map(({ key, label, value }) => (
        <div
          key={key}
          className="rounded-xl border border-stone-300/70 bg-white/80 p-4 text-center shadow-md dark:border-white/10 dark:bg-white/[0.05] dark:shadow-none"
        >
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-stone-900 dark:text-white">
            {value.toLocaleString("fa-IR")}
          </p>
        </div>
      ))}
    </section>
  );
};

export default Stats;
