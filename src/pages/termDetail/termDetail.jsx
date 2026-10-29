import { Suspense, lazy } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { FiArrowRight } from "react-icons/fi";
import ExpandableText from "../../components/common/ExpandableText/expandableText";
import RichText from "../../components/common/RichText/richText";
import { API, useApi } from "../../hooks/useApi";
import Section from "./section";
import { getRelationGroups } from "./relationsGraphData";
import SourcesSection from "./sourcesSection";

// Cytoscape is large: it is downloaded only when a term page with relations opens
const TermRelationsGraph = lazy(() => import("./termRelationsGraph"));

const chip =
  "rounded-full border px-2.5 py-0.5 text-xs border-stone-300 text-stone-600 dark:border-white/15 dark:text-stone-400";

const Encyclopedia = ({ id }) => {
  const api = useApi(`${API}/term/${id}/encyclopedia`);
  const entry = api.data?.data;
  const text = entry?.description || entry?.old_description;

  return (
    <Section title="فرهنگ‌نامه" state={api} isEmpty={!entry?.title && !text} emptyText="اطلاعات فرهنگ‌نامه‌ای برای این اصطلاح ثبت نشده است.">
      {entry?.title && (
        <h4 className="mb-2 font-semibold text-stone-900 dark:text-stone-100">{entry.title}</h4>
      )}
      {text?.trim() && (
        <ExpandableText>
          <RichText html={text} />
        </ExpandableText>
      )}
    </Section>
  );
};

const TermDetailBody = ({ id }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const main = useApi(`${API}/term/${id}`);
  const term = main.data?.data;

  // opened from inside the site -> go back; opened from a shared link -> home
  const goBack = () => (location.key === "default" ? navigate("/") : navigate(-1));

  return (
    <div className="mx-auto w-[90%] max-w-4xl space-y-4 pb-24">
      <button
        type="button"
        onClick={goBack}
        className="inline-flex items-center gap-2 text-sm text-emerald-800 hover:underline dark:text-emerald-300"
      >
        <FiArrowRight aria-hidden="true" />
        بازگشت
      </button>

      {main.loading && (
        <div role="status" aria-label="در حال بارگذاری" className="h-40 animate-pulse rounded-2xl bg-stone-900/5 dark:bg-white/5" />
      )}

      {main.error && (
        <div role="alert" className="rounded-2xl border border-stone-300/70 bg-white/70 p-8 text-center text-stone-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400">
          <p>دریافت اطلاعات اصطلاح با خطا مواجه شد.</p>
          <button
            type="button"
            onClick={main.retry}
            className="mt-4 inline-flex h-10 items-center rounded-lg border border-emerald-700/40 px-4 text-sm text-emerald-800 hover:bg-emerald-700/10 dark:border-emerald-400/40 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
          >
            تلاش دوباره
          </button>
        </div>
      )}

      {!main.loading && !main.error && !term && (
        <p className="rounded-2xl border border-stone-300/70 bg-white/70 p-8 text-center text-stone-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400">
          اصطلاحی با این شناسه پیدا نشد.
        </p>
      )}

      {term && (
        <>
          <header className="rounded-2xl border border-stone-300/70 bg-white/70 p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">{term.title}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {term.pref && <span className={chip}>{term.pref}</span>}
              {term.status && <span className={chip}>{term.status}</span>}
              {term.domain?.title && (
                <Link to={`/domain/${term.domain.id}`} className={`${chip} inline-flex items-center gap-1.5 hover:border-emerald-600/50`}>
                  {term.domain.color && (
                    <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: term.domain.color }} />
                  )}
                  {term.domain.title}
                </Link>
              )}
            </div>
          </header>

          <Section title="تعریف و توضیحات" isEmpty={!term.description?.trim() && !term.note?.trim()} emptyText="توضیحاتی برای این اصطلاح ثبت نشده است.">
            {term.description?.trim() && (
              <ExpandableText>
                <RichText html={term.description} />
              </ExpandableText>
            )}
            {term.note?.trim() && (
              <div className="mt-4 border-t border-stone-300/70 pt-3 dark:border-white/10">
                <h4 className="mb-1 text-sm font-semibold text-stone-500 dark:text-stone-400">یادداشت</h4>
                <ExpandableText>
                  <RichText html={term.note} className="text-sm" />
                </ExpandableText>
              </div>
            )}
          </Section>

          <Section title="رابطه‌ها" isEmpty={getRelationGroups(term).length === 0} emptyText="رابطه‌ای برای این اصطلاح ثبت نشده است.">
            <Suspense fallback={<div role="status" aria-label="در حال بارگذاری" className="h-[420px] animate-pulse rounded-xl bg-stone-900/5 dark:bg-white/5" />}>
              <TermRelationsGraph term={term} />
            </Suspense>
          </Section>
        </>
      )}

      {/* outside the `term &&` block on purpose: these three requests start together
          with the main one instead of waiting for it */}
      {!main.error && (
        <>
          <Encyclopedia id={id} />
          <SourcesSection id={id} endpoint="resource" title="منابع" emptyText="منبعی برای این اصطلاح ثبت نشده است." />
          <SourcesSection id={id} endpoint="index" title="نمایه‌ها" emptyText="نمایه‌ای برای این اصطلاح ثبت نشده است." />
        </>
      )}
    </div>
  );
};

// `key={id}`: moving from a term to a related term remounts the page, so the
// state of the sections (like their page numbers) starts fresh.
const TermDetail = () => {
  const { id } = useParams();
  return <TermDetailBody key={id} id={id} />;
};

export default TermDetail;
