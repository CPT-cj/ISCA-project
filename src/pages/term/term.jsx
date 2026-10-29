import Stats from "../../components/common/Stats/stats";
import { API } from "../../hooks/useApi";

const STATS_URL = `${API}/web/static/term`;
// field of the answer -> Persian title
const STATS_ITEMS = [
  { key: "term_count", label: "تعداد اصطلاحات" },
  { key: "domain_count", label: "تعداد حوزه‌ها" },
  { key: "relation_count", label: "تعداد روابط" },
  { key: "enc_count", label: "تعداد مدخل‌های فرهنگ‌نامه" },
];

const Term = () => {
  return (
    <div className="">
      <h1 className="text-stone-900 dark:text-white font-black text-3xl dark:drop-shadow-2xl w-[90%] max-w-4xl mx-auto text-center">
        اصطلاحنامه
      </h1>
      <span></span>
      <p className="text-stone-600 dark:text-white/75 dark:drop-shadow-2xl w-[90%] max-w-4xl mx-auto text-center">
        اصطلاح‌نامه جامع علوم اسلامی مجموعه‌ای مشتمل بر اصطلاحات، واژه‌ها و
        عناوین مرتبط با حوزه‌های مختلف علوم اسلامی و حوزه‌های وابسته به آن است.
        این مجموعه، واژگان یک زبان نمایه‌ایِ کنترل‌شده است که به‌صورت
        سازمان‌یافته، روابط میان مفاهیم و ارتباطات پیشین میان آن‌ها را تبیین
        می‌کند.
      </p>

      <div className="mx-auto mt-10 w-[90%] max-w-4xl pb-24">
        <Stats url={STATS_URL} items={STATS_ITEMS} />
      </div>
    </div>
  );
};

export default Term;
