import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../../theme/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"}
      title={isDark ? "حالت روشن" : "حالت تاریک"}
      className="fixed bottom-5 start-5 z-50 grid size-11 place-items-center rounded-full border border-stone-300 bg-white/80 text-stone-700 shadow-lg backdrop-blur-xl transition hover:border-emerald-600/50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600/40 focus-visible:outline-none dark:border-white/15 dark:bg-neutral-950/60 dark:text-stone-200 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
    >
      {isDark ? <FiSun size={19} /> : <FiMoon size={19} />}
    </button>
  );
};

export default ThemeToggle;
