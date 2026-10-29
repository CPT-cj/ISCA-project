import LatestDocs from "../../components/common/LatestDocs/latestDocs";
import Stats from "../../components/common/Stats/stats";
import { API } from "../../hooks/useApi";

const STATS_URL = `${API}/web/static/index`;
// field of the answer -> Persian title
const STATS_ITEMS = [
  { key: "index_count", label: "تعداد نمایه‌ها" },
  { key: "doc_index_count", label: "تعداد منابع نمایه‌شده" },
  { key: "term_index_count", label: "تعداد اصطلاحات به‌کاررفته در نمایه‌ها" },
];

const index = () => {
  return (
    <div className="mx-auto w-[90%] max-w-4xl space-y-10 pb-24">
      <Stats url={STATS_URL} items={STATS_ITEMS} />
      <LatestDocs
        title="جدیدترین کتب نمایه‌شده"
        endpoint="new_indexed"
        emptyText="موردی برای نمایش وجود ندارد."
      />
    </div>
  );
};

export default index;
