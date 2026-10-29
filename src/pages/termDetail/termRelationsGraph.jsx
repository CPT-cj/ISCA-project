import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import cytoscape from "cytoscape";
import { FiMaximize, FiMinus, FiPlus } from "react-icons/fi";
import { useTheme } from "../../theme/useTheme";
import { htmlToText } from "../../utils/html";
import { RELATION_LABELS, buildGraph, graphStyle } from "./relationsGraphData";

const FIT_PADDING = 30;

// Dims everything except the clicked node, its line and the centre.
const focusNode = (cy, node) => {
  cy.elements().removeClass("faded");
  if (node.data("center")) return;
  cy.elements().not(node.closedNeighborhood()).addClass("faded");
};

const controlButton =
  "grid size-9 place-items-center rounded-lg border border-stone-300 bg-white/90 text-stone-700 transition hover:border-emerald-600/50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-600/40 focus-visible:outline-none dark:border-white/15 dark:bg-neutral-900/80 dark:text-stone-200 dark:hover:text-emerald-300";

// Radial graph of the related terms: the current term in the centre, the
// related ones around it, coloured by relation group. `term` is the answer of
// /v1/term/{id}, which TermDetail already fetched, so no extra request is made.
const TermRelationsGraph = ({ term }) => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [selected, setSelected] = useState(null); // data of the clicked node

  const graph = useMemo(() => buildGraph(term), [term]);

  // create the graph; destroy it (and its listeners) when the term changes or the page closes
  useEffect(() => {
    const container = containerRef.current;
    const cy = cytoscape({
      container,
      elements: graph.elements,
      layout: { name: "preset", fit: true, padding: FIT_PADDING },
      style: graphStyle(theme === "dark"),
      minZoom: 0.2,
      maxZoom: 3,
      userZoomingEnabled: false, // the page must keep scrolling with the wheel: zoom uses the buttons
      boxSelectionEnabled: false,
      autoungrabify: true, // nodes do not move: a drag pans the graph, a click only selects
    });
    cyRef.current = cy;

    cy.on("tap", "node", (event) => {
      focusNode(cy, event.target);
      setSelected(event.target.data());
    });
    cy.on("tap", (event) => {
      if (event.target !== cy) return; // tapped the background
      focusNode(cy, cy.nodes("[?center]"));
      setSelected(null);
    });
    cy.on("mouseover", "node", (event) => {
      event.target.addClass("hover");
      container.style.cursor = "pointer";
    });
    cy.on("mouseout", "node", (event) => {
      event.target.removeClass("hover");
      container.style.cursor = "";
    });

    // keep the graph fitted when the screen size changes (phone rotation, resize)
    const observer = new ResizeObserver(() => {
      cy.resize();
      cy.fit(undefined, FIT_PADDING);
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      cy.destroy();
      cyRef.current = null;
    };
    // the theme only restyles (next effect), it must not rebuild the graph
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph]);

  useEffect(() => {
    cyRef.current?.style(graphStyle(theme === "dark"));
  }, [theme, graph]);

  const zoomBy = (factor) => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.zoom({
      level: cy.zoom() * factor,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
    });
  };
  const fit = () => cyRef.current?.fit(undefined, FIT_PADDING);

  const description = selected && htmlToText(selected.description);

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-stone-300/70 bg-white/60 dark:border-white/10 dark:bg-white/[0.03]">
        <div
          ref={containerRef}
          role="img"
          aria-label={`گراف رابطه‌های اصطلاح «${term.title}»`}
          className="h-[420px] w-full sm:h-[560px]"
        />
        <div className="absolute start-3 top-3 flex flex-col gap-2">
          <button type="button" onClick={() => zoomBy(1.25)} aria-label="بزرگ‌نمایی" className={controlButton}>
            <FiPlus />
          </button>
          <button type="button" onClick={() => zoomBy(0.8)} aria-label="کوچک‌نمایی" className={controlButton}>
            <FiMinus />
          </button>
          <button type="button" onClick={fit} aria-label="نمایش کامل گراف" className={controlButton}>
            <FiMaximize />
          </button>
        </div>
      </div>

      {/* what each colour means */}
      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 dark:text-stone-400">
        {graph.groups.map(({ key, color }) => (
          <li key={key} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span dir="ltr">{RELATION_LABELS[key] ?? key}</span>
          </li>
        ))}
        <li className="ms-auto">برای نمایش جزئیات روی یک اصطلاح بزنید</li>
      </ul>

      {selected && (
        <div className="mt-3 rounded-xl border border-stone-300/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/[0.05]">
          <div className="flex flex-wrap items-center gap-2">
            {selected.color && (
              <span aria-hidden="true" className="size-3 rounded-full" style={{ backgroundColor: selected.color }} />
            )}
            <h4 className="font-semibold text-stone-900 dark:text-stone-100">{selected.label}</h4>
            {selected.group && (
              <span dir="ltr" className="rounded-full border border-stone-300 px-2.5 py-0.5 text-xs text-stone-600 dark:border-white/15 dark:text-stone-400">
                {RELATION_LABELS[selected.group] ?? selected.group}
              </span>
            )}
            {selected.status && (
              <span className="rounded-full border border-stone-300 px-2.5 py-0.5 text-xs text-stone-600 dark:border-white/15 dark:text-stone-400">
                {selected.status}
              </span>
            )}
          </div>

          {selected.domain && (
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">دامنه: {selected.domain}</p>
          )}
          {selected.perspective && (
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">دیدگاه: {selected.perspective}</p>
          )}
          {description && (
            <p className="mt-2 line-clamp-4 text-sm leading-7 text-stone-700 dark:text-stone-300">{description}</p>
          )}

          {selected.center ? (
            <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">این همان اصطلاحی است که در این صفحه می‌بینید.</p>
          ) : (
            <Link
              to={`/term/${selected.id}`}
              className="mt-3 inline-flex h-9 items-center rounded-lg border border-emerald-700/40 px-4 text-sm text-emerald-800 transition hover:bg-emerald-700/10 dark:border-emerald-400/40 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
            >
              رفتن به صفحه‌ی این اصطلاح
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default TermRelationsGraph;
