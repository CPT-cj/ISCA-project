import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const COLLAPSED_HEIGHT = 160; // px, about five lines of body text
const TOLERANCE = 48; // a text only slightly taller than the limit is shown whole

// Shows its children clipped to COLLAPSED_HEIGHT with a "more" button, but only
// when they are taller than that. Nothing is cut from the DOM: the full text is
// always there (also for screen readers), only the visible height is limited.
// Every instance keeps its own open/closed state; a parent that shows other
// content in the same place should give it a different `key` to reset it.
const ExpandableText = ({ children, collapsedHeight = COLLAPSED_HEIGHT }) => {
  const contentRef = useRef(null);
  const [fullHeight, setFullHeight] = useState(null); // null = not measured yet
  const [expanded, setExpanded] = useState(false);

  // measure the real height of the content (also when the screen is resized)
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setFullHeight(entry.contentRect.height));
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  const collapsible = fullHeight !== null && fullHeight > collapsedHeight + TOLERANCE;
  // before the first measurement the box is already limited, so a long text never flashes at full height
  const maxHeight = fullHeight === null ? collapsedHeight : collapsible ? (expanded ? fullHeight : collapsedHeight) : undefined;

  return (
    <div>
      <div
        style={{ maxHeight }}
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out motion-reduce:transition-none ${
          collapsible && !expanded ? "[mask-image:linear-gradient(to_bottom,black_60%,transparent)]" : ""
        }`}
      >
        <div ref={contentRef}>{children}</div>
      </div>

      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="mt-2 inline-flex items-center gap-1 text-sm text-emerald-800 hover:underline focus-visible:ring-2 focus-visible:ring-emerald-600/40 focus-visible:outline-none dark:text-emerald-300"
        >
          {expanded ? "نمایش کمتر" : "مشاهده بیشتر"}
          <FiChevronDown aria-hidden="true" className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
