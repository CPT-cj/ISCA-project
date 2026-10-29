import { useState } from "react";
import { Link } from "react-router";
import Pagination from "../../components/common/Pagination/pagination";
import ExpandableText from "../../components/common/ExpandableText/expandableText";
import RichText from "../../components/common/RichText/richText";
import { API, useApi } from "../../hooks/useApi";
import { fa } from "../../utils/format";
import Section from "./section";

// One entry of /resource or /index. Only the fields that exist are drawn.
const SourceEntry = ({ entry, currentId }) => {
  const doc = entry.doc_details ?? entry.doc;
  const heading = doc?.title ?? entry.title;
  const meta = [
    doc?.type,
    doc?.author && `نویسنده: ${doc.author}`,
    doc?.publisher && `ناشر: ${doc.publisher}`,
    doc?.publish_date && `سال نشر: ${fa(doc.publish_date)}`,
  ].filter(Boolean);
  const place = [
    entry.volume && `جلد ${fa(entry.volume)}`,
    entry.from &&
      (entry.to && entry.to !== entry.from
        ? `صفحه ${fa(entry.from)} تا ${fa(entry.to)}`
        : `صفحه ${fa(entry.from)}`),
  ].filter(Boolean);
  const others = (entry.terms?.data ?? []).filter((t) => t?.id && t.id !== currentId);

  if (!heading && !entry.text && others.length === 0) return null;

  return (
    <li className="rounded-xl border border-stone-300/60 p-4 dark:border-white/10">
      {heading && (
        <h4 className="font-semibold text-stone-900 dark:text-stone-100">{heading}</h4>
      )}
      {(meta.length > 0 || place.length > 0) && (
        <p className="mt-1 text-xs leading-6 text-stone-500 dark:text-stone-400">
          {[...meta, ...place].join(" · ")}
        </p>
      )}
      {typeof entry.text === "string" && entry.text.trim() && (
        <div className="mt-2">
          <ExpandableText>
            <RichText html={entry.text} className="text-sm" />
          </ExpandableText>
        </div>
      )}
      {others.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-stone-500 dark:text-stone-400">اصطلاحات مرتبط:</span>
          {others.map((t) => (
            <Link
              key={t.id}
              to={`/term/${t.id}`}
              className="rounded-full border border-stone-300 px-2.5 py-0.5 text-stone-700 hover:border-emerald-600/50 hover:text-emerald-800 dark:border-white/15 dark:text-stone-300 dark:hover:text-emerald-300"
            >
              {t.title}
            </Link>
          ))}
        </div>
      )}
    </li>
  );
};

// `endpoint` is "resource" or "index". These lists are paginated by the API
// (meta.pagination), so the page is part of the url: the data of a page is
// requested only when the section shows it (and cached for later).
const SourcesSection = ({ id, endpoint, title, emptyText }) => {
  const [page, setPage] = useState(1);
  const api = useApi(
    `${API}/term/${id}/${endpoint}${page > 1 ? `?page=${page}` : ""}`,
  );
  const entries = Array.isArray(api.data?.data) ? api.data.data : [];
  const pagination = api.data?.meta?.pagination;
  const heading = pagination?.total ? `${title} (${pagination.total.toLocaleString("fa-IR")})` : title;

  return (
    <Section title={heading} state={api} isEmpty={entries.length === 0} emptyText={emptyText}>
      <ul className="space-y-3">
        {entries.map((entry, i) => (
          <SourceEntry key={entry.id ?? i} entry={entry} currentId={id} />
        ))}
      </ul>
      {pagination && (
        <Pagination page={page} totalPages={pagination.total_pages} onChange={setPage} />
      )}
    </Section>
  );
};

export default SourcesSection;
