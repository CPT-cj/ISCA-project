import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
// use your own icon import if react-icons is not available
import { GoArrowUpRight } from "react-icons/go";
import userIcon from "../../../../imgs/user.png";
import { Link } from "react-router";

const CardNav = ({
  logo = "./logo-w.png",
  logoAlt = "Logo",
  items,
  className = "",
  ease = "power3.out",
  baseColor,
  menuColor,
  buttonBgColor,
  buttonTextColor,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content");
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        contentEl.offsetHeight;

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i) => (el) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={` card-nav-container mx-auto mt-6 w-[94%] max-w-[800px] min-w-0 sm:mt-11 sm:w-[90%] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""} block h-[60px] p-0 rounded-2xl border border-stone-300/70 bg-white/70 shadow-[0_18px_60px_rgba(0,0,0,0.08)] dark:border-white/15 dark:bg-neutral-950/40 dark:shadow-[0_18px_60px_rgba(0,0,0,0.28)] relative overflow-hidden will-change-[height] backdrop-blur-xl`}
        style={{
          backgroundColor: baseColor,
          backdropFilter: "blur(18px) saturate(120%)",
          WebkitBackdropFilter: "blur(18px) saturate(120%)",
        }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 z-[2] grid h-[60px] grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-1 p-2 border-b md:flex md:justify-between md:gap-2 md:pl-[1.1rem] border-stone-300/60 bg-stone-900/[0.03] dark:border-white/10 dark:bg-white/[0.06] backdrop-blur-xl">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""} group col-start-3 row-start-1 h-full w-8 justify-self-start flex flex-col items-center justify-center cursor-pointer gap-[6px] md:col-auto md:row-auto md:w-auto md:justify-self-auto text-stone-900 dark:text-white`}
            onClick={toggleMenu}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={menuColor ? { color: menuColor } : undefined}
          >
            <div
              className={`hamburger-line w-7.5 h-0.5 bg-current transition-all duration-300 ease-linear origin-[50%_50%] ${
                isHamburgerOpen ? "translate-y-1 rotate-45" : ""
              } group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line w-7.5 h-0.5 bg-current transition-all  duration-300 ease-linear origin-[50%_50%] ${
                isHamburgerOpen ? "-translate-y-1 -rotate-45" : ""
              } group-hover:opacity-75`}
            />
          </div>

          <Link className="logo-container hidden min-w-0 max-w-[calc(100%-5rem)] items-center justify-center gap-1.5 ml-0 mx-auto md:flex md:ml-5 md:max-w-none md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:order-0">
            <img
              src={logo}
              alt={logoAlt}
              className="logo h-6 w-auto shrink-0 object-contain invert dark:invert-0 sm:h-7"
            />
            <p className="text-stone-800 dark:text-white/90 min-w-0 truncate text-[11px] font-medium tracking-tight sm:text-sm md:text-base md:whitespace-nowrap">
              پژوهشکده مدیریت اطلاعات و مدارک اسلامی
            </p>
          </Link>

          <div className="mobile-logo col-start-1 row-start-1 flex items-center justify-self-end md:hidden">
            <img
              src={logo}
              alt={logoAlt}
              className="h-6 w-auto shrink-0 object-contain invert dark:invert-0"
            />
          </div>

          {/* <p className="col-start-2 row-start-1 min-w-0 max-w-full truncate text-center text-[10px] font-medium tracking-tight text-stone-800 dark:text-white/90 sm:text-xs md:hidden">
            پژوهشکده مدیریت اطلاعات و مدارک اسلامی
          </p> */}
          <p className="col-start-2 row-start-1 min-w-0 max-w-full truncate text-center text-[13px] font-medium tracking-tight text-stone-800 dark:text-white/90 sm:text-xs md:hidden">
            پژوهشکده مدیریت اطلاعات و مدارک اسلامی
          </p>

          <Link to={"https://adminthesaurus.isca.ac.ir"}>
            <button
              type="button"
              className="card-nav-cta-button hidden shrink-0 md:inline-flex border-0 rounded-[0.55rem] px-4 items-center h-full font-medium cursor-pointer transition-colors duration-300 text-stone-800 dark:text-white/90"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              ورود/ثبت نام
              <img
                src={userIcon}
                alt="user "
                className="mr-3 invert dark:invert-0"
              />
            </button>
          </Link>
        </div>

        <div
          className={`card-nav-content absolute left-0 right-0 top-15 bottom-0 p-2 flex flex-col items-stretch gap-2 justify-start z-1 ${
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none"
          } md:flex-row md:items-end md:gap-3`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 4).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[0.55rem] min-w-0 flex-[1_1_auto] h-auto min-h-15 md:h-full md:min-h-0 md:flex-[1_1_0%] border border-stone-300/70 bg-emerald-900/[0.04] text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              ref={setCardRef(idx)}
              style={item.textColor ? { color: item.textColor } : undefined}
            >
              <Link
                to={item.links[0].href}
                className="nav-card-label font-normal tracking-[-0.5px] text-[18px] md:text-[22px]"
              >
                {item.label}
              </Link>
              <div className="nav-card-links mt-auto flex flex-col gap-0.5">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex items-center gap-1.5 no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[15px] md:text-[16px]"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                  >
                    <GoArrowUpRight
                      className="nav-card-link-icon shrink-0"
                      aria-hidden="true"
                    />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <Link
            to="https://adminthesaurus.isca.ac.ir"
            className="mt-1 flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-lg border border-stone-300/70 bg-stone-900/[0.04] px-4 py-3 text-sm font-medium text-stone-800 transition-colors hover:bg-stone-900/[0.08] dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.1] md:hidden"
          >
            <img
              src={userIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 shrink-0 invert dark:invert-0"
            />
            <span>ورود/ثبت نام</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
