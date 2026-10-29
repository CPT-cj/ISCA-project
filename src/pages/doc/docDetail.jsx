import { useLocation, useNavigate, useParams } from "react-router";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";
import RichText from "../../components/common/RichText/richText";
import { API, useApi } from "../../hooks/useApi";
import { fa, formatDate } from "../../utils/format";
import Section from "../termDetail/section";

const box =
  "rounded-2xl border border-stone-300/70 bg-white/70 p-8 text-center text-stone-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400";
const label =
  "rounded border border-emerald-600/60 px-1.5 text-xs text-emerald-700 dark:border-emerald-400/50 dark:text-emerald-400";

// Opened from the cards of the doc page and of the index page:
// both use the same API, /v1/web/docs/{id}/details.
const DocDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, loading, error, retry } = useApi(`${API}/web/docs/${id}/details`);

  const doc = data?.doc;
  const details = Array.isArray(data?.details) ? data.details : [];
  const created = doc?.Created_at && formatDate(doc.Created_at);
  const updated = doc?.Updated_at && formatDate(doc.Updated_at);
  // the link comes from the database: only plain web addresses become links
  const url = /^https?:\/\//i.test(doc?.Url ?? "") ? doc.Url : null;

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

      {loading && (
        <div role="status" aria-label="در حال بارگذاری" className="h-40 animate-pulse rounded-2xl bg-stone-900/5 dark:bg-white/5" />
      )}

      {error && (
        <div role="alert" className={box}>
          <p>دریافت اطلاعات منبع با خطا مواجه شد.</p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 inline-flex h-10 items-center rounded-lg border border-emerald-700/40 px-4 text-sm text-emerald-800 hover:bg-emerald-700/10 dark:border-emerald-400/40 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
          >
            تلاش دوباره
          </button>
        </div>
      )}

      {!loading && !error && !doc && <p className={box}>منبعی با این شناسه پیدا نشد.</p>}

      {doc && (
        <>
          <header className="rounded-2xl border border-stone-300/70 bg-white/70 p-6 dark:border-white/10 dark:bg-white/[0.04]">
            <h2 className="text-2xl leading-10 font-bold text-stone-900 dark:text-white">{doc.Title}</h2>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-800 hover:underline dark:text-emerald-300"
              >
                <FiExternalLink aria-hidden="true" />
                مشاهده منبع
              </a>
            )}
          </header>

          <Section title="مشخصات" isEmpty={details.length === 0 && !doc.PublishDate} emptyText="مشخصاتی ثبت نشده است.">
            <div className="space-y-2">
              {details.map((item, i) => (
                <p key={i} className="flex flex-wrap items-baseline gap-2 text-sm leading-7 text-stone-700 dark:text-stone-300">
                  <span className={label}>{item.type}:</span>
                  {item.title}
                </p>
              ))}
              {doc.PublishDate && (
                <p className="flex flex-wrap items-baseline gap-2 text-sm leading-7 text-stone-700 dark:text-stone-300">
                  <span className={label}>سال نشر:</span>
                  {fa(doc.PublishDate)}
                </p>
              )}
            </div>
          </Section>

          <Section title="چکیده و توضیحات" isEmpty={!doc.Abstract?.trim() && !doc.Description?.trim()} emptyText="چکیده یا توضیحاتی برای این منبع ثبت نشده است.">
            <RichText html={doc.Abstract} />
            <RichText html={doc.Description} className={doc.Abstract?.trim() ? "mt-4" : ""} />
          </Section>

          {(created || updated) && (
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {created && `ثبت در سامانه: ${created}`}
              {created && updated && " · "}
              {updated && `آخرین به‌روزرسانی: ${updated}`}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default DocDetail;
