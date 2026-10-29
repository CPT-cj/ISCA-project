const box =
  "rounded-2xl border border-stone-300/70 bg-white/70 p-5 dark:border-white/10 dark:bg-white/[0.04]";

// A titled card that handles the loading / error / empty states of its content.
// `state` is what useApi returns; sections built from data that is already
// loaded (like the relations) simply omit it.
const Section = ({ title, state = {}, isEmpty, emptyText, children }) => (
  <section className={box}>
    <h3 className="mb-3 text-lg font-bold text-emerald-800 dark:text-emerald-300">
      {title}
    </h3>

    {state.loading ? (
      <div
        role="status"
        aria-label="در حال بارگذاری"
        className="h-16 animate-pulse rounded-lg bg-stone-900/5 dark:bg-white/5"
      />
    ) : state.error ? (
      <div role="alert" className="text-sm text-stone-600 dark:text-stone-400">
        <p>دریافت اطلاعات با خطا مواجه شد.</p>
        <button
          type="button"
          onClick={state.retry}
          className="mt-3 inline-flex h-9 items-center rounded-lg border border-emerald-700/40 px-4 text-emerald-800 transition hover:bg-emerald-700/10 dark:border-emerald-400/40 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
        >
          تلاش دوباره
        </button>
      </div>
    ) : isEmpty ? (
      <p className="text-sm text-stone-500 dark:text-stone-400">{emptyText}</p>
    ) : (
      children
    )}
  </section>
);

export default Section;
