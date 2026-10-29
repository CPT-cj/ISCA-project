import { Link } from "react-router";
import MaskIcon from "../../components/common/MaskIcon/maskIcon";
import { icons } from "../../imgs/icons";

// Text taken from the supplied reference screenshot.
// "/#" is a placeholder for the sections that have no page yet.
const quickLinks = [
  { label: "رابطه‌ها", to: "/#", icon: icons.relations },
  { label: "فرهنگ‌نامه", to: "/encyclopedia", icon: icons.dictionary },
  { label: "منابع", to: "/doc", icon: icons.sources },
  { label: "نمایه‌ها", to: "/index", icon: icons.index },
];

const TermIntro = () => (
  <section
    aria-labelledby="term-intro-title"
    className="relative rounded-2xl border border-stone-300/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-1.5 before:rounded-[0.65rem] before:border before:border-emerald-700/15 md:p-8 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_60px_rgba(0,0,0,0.28)] dark:before:border-emerald-400/15"
  >
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
      <div className="flex-1">
        <h2
          id="term-intro-title"
          className="text-xl leading-10 font-bold text-emerald-800 md:text-2xl dark:text-emerald-300"
        >
          کلیدی برای گشودن و بازیابی اطلاعات انباشته شده و انبوه
        </h2>
        <span className="mt-3 block h-0.5 w-24 rounded-full bg-emerald-700/30 dark:bg-emerald-400/30" />
        <p className="mt-4 text-sm leading-8 text-stone-600 md:text-base dark:text-stone-400">
          اصطلاحات گزیده شده و نظام یافته است که بین آنها روابط معنایی و رده‌ای،
          یا سلسله مراتبی برقرار است و توانایی آن را دارد که موضوع آن رشته را با
          تمام جنبه‌های اصلی، فرعی و وابسته به شکلی نظام یافته و به قصد ذخیره و
          بازیابی اطلاعات و مدارک و مقاصد جنبی دیگر عرضه کند.
        </p>
      </div>

      <MaskIcon
        {...icons.logo}
        label="اصطلاح"
        className="h-16 text-emerald-700 md:h-20 dark:text-emerald-400"
      />
    </div>

    <MaskIcon
      {...icons.divider}
      className="mx-auto mt-8 block h-1 text-stone-400 dark:text-white/30"
    />

    <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {quickLinks.map(({ label, to, icon }) => (
        <li key={label}>
          <Link
            to={to}
            className="group flex flex-col items-center gap-3 rounded-xl px-2 py-4 text-emerald-700 transition hover:bg-emerald-700/[0.06] focus-visible:ring-2 focus-visible:ring-emerald-600/40 focus-visible:outline-none dark:text-emerald-400 dark:hover:bg-emerald-400/[0.07]"
          >
            <MaskIcon
              {...icon}
              className="h-10 transition-transform group-hover:-translate-y-0.5"
            />
            <span className="text-sm text-stone-700 dark:text-stone-300">
              {label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default TermIntro;
