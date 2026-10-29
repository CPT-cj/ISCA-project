import { useState } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router";
import { DOMAINS_URL, useApi } from "../../../../hooks/useApi";

import TextType from "./../../../../../components/ui/TextType";
import ShinyText from "../../../../../components/ui/ShinyText";

const optionClasses =
  "bg-white text-stone-900 dark:bg-neutral-900 dark:text-white";

// Shared by the text input and the select so both look identical in each theme.
const fieldClasses =
  "h-14 w-full rounded-xl border border-stone-300 bg-white text-base text-stone-900 outline-none transition-all focus:border-emerald-600/60 focus:ring-2 focus:ring-emerald-600/15 dark:border-white/10 dark:bg-black/25 dark:text-white dark:focus:border-white/30 dark:focus:bg-black/35 dark:focus:ring-white/10";

const Header = () => {
  const [searchParams] = useSearchParams();
  const urlWord = searchParams.get("word") ?? "";
  // On /domain/:id the select shows that domain; everywhere else "" = global search.
  const urlDomain = useMatch("/domain/:id")?.params.id ?? "";
  // `draft` is what the user is typing; null means "show the URL's ?word=".
  const [draft, setDraft] = useState(null);
  // A changed select is remembered only while the URL's domain stays the same,
  // so opening another domain from the site makes the select follow the URL.
  const [scopeDraft, setScopeDraft] = useState(null);
  // The same request Home makes: sent once, shared by both.
  const { data, loading } = useApi(DOMAINS_URL);
  const domains = Array.isArray(data?.data) ? data.data : [];
  const location = useLocation();
  const navigate = useNavigate();

  const query = draft ?? urlWord;
  const scope = scopeDraft?.from === urlDomain ? scopeDraft.value : urlDomain;
  const lastRoute = location.pathname;

  const handleSubmit = (e) => {
    e.preventDefault();
    const word = query.trim();
    setDraft(null);
    setScopeDraft(null);
    navigate({
      // a domain id -> search inside it; "" -> search in all domains
      pathname: scope ? `/domain/${scope}` : "/search",
      search: word ? `?${new URLSearchParams({ word })}` : "",
    });
  };

  return (
    <header className="mx-auto mt-18 mb-8 w-[90%] max-w-4xl min-w-0 text-center">
      <div className="mx-auto w-full min-w-0 max-w-3xl">
        <div className="flex min-w-0 flex-col items-center justify-center gap-4">
          <TextType
            text={[
              `${
                lastRoute === "/doc"
                  ? "کتابخانه"
                  : lastRoute === "/index"
                    ? "نمایه"
                    : lastRoute === "/term"
                      ? "اصطلاحنامه"
                      : "پایگاه مدیریت اطلاعات علوم اسلامی"
              }`,
            ]}
            typingSpeed={90}
            pauseDuration={8000}
            showCursor
            cursorCharacter="|"
            texts={["پایگاه مدیریت اطلاعات علوم اسلامی"]}
            deletingSpeed={50}
            variableSpeedEnabled={false}
            variableSpeedMin={60}
            variableSpeedMax={120}
            cursorBlinkDuration={0.5}
            className="max-w-full font-semibold scale-125 text-base sm:text-lg md:font-medium md:scale-200 md:text-inherit mb-2"
          />
          <ShinyText
            text={
              lastRoute === "/doc"
                ? "گنجینه منابع علوم اسلامی"
                : lastRoute === "/index"
                  ? "گنجینه نمایه های علوم اسلامی"
                  : lastRoute === "/term"
                    ? "گنجینه اصطلاحات علوم اسلامی"
                    : "جستجو در منابع و دانشنامه‌های علوم اسلامی"
            }
            color="#94a3b8"
            shineColor="#b3d0c6"
            speed={2.2}
            shineWidth={40}
            softness={1}
            trigger="loop"
            delay={0.4}
            angle={120}
            bands={1}
            glow={0.4}
            direction="left"
            easing="smooth"
            yoyo={false}
            followPointer={false}
            pauseOnHover={false}
            disabled={false}
          />
        </div>

        <form
          onSubmit={handleSubmit}
          role="search"
          className="mt-8 flex flex-col md:flex-row-reverse items-stretch gap-3 rounded-2xl border border-stone-300/70 bg-white/70 p-2 shadow-[0_20px_70px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/15 dark:bg-white/[0.07] dark:shadow-[0_20px_70px_rgba(0,0,0,0.28)]"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="عبارت مورد نظرتان را وارد کنید..."
              className={`${fieldClasses} px-5 text-right placeholder:text-stone-400 dark:placeholder:text-white/35`}
              dir="rtl"
              aria-label="عبارت جستجو"
            />
          </div>

          {/* `group` + `relative`: the chevron is positioned over the select */}
          <div className="group relative w-full md:w-44">
            <select
              value={scope}
              onChange={(e) =>
                setScopeDraft({ from: urlDomain, value: e.target.value })
              }
              className={`${fieldClasses} cursor-pointer appearance-none ps-4 pe-10 text-right scheme-light dark:scheme-dark`}
              dir="rtl"
              aria-label="محدوده جستجو"
            >
              <option value="" className={optionClasses}>
                جست‌وجو سراسری
              </option>
              {loading && (
                <option disabled className={optionClasses}>
                  در حال بارگذاری دامنه‌ها...
                </option>
              )}
              {domains.map((domain) => (
                <option
                  key={domain.id}
                  value={domain.id}
                  className={optionClasses}
                >
                  {domain.title}
                </option>
              ))}
            </select>

            {/* In RTL, `end` is the left edge, away from the right-aligned text */}
            <FiChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-stone-500 transition-transform duration-150 ease-in-out group-focus-within:rotate-180 dark:text-white/50"
              size={18}
            />
          </div>

          <button
            type="submit"
            aria-label="جستجو"
            className="h-14 w-full md:w-14 shrink-0 rounded-xl border border-emerald-800/20 bg-emerald-700 text-white flex items-center justify-center transition-all hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 shadow-lg dark:border-white/15 dark:bg-white dark:text-black dark:hover:bg-white/90"
          >
            <FiSearch size={21} strokeWidth={2.2} />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
