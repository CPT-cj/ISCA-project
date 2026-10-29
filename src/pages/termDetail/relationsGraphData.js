// /v1/term/{id} returns the related terms in groups with short codes as keys
// (bej, akh, av, bek, am). Put the Persian name of a group here to show it
// instead of the code (in the legend and in the details panel), e.g. { bek: "..." }.
export const RELATION_LABELS = {};

// One colour per relation group (like the reference image). Muted enough to sit
// on both themes, dark enough for white labels, and different from the emerald
// of the central node.
const GROUP_COLORS = ["#a4568f", "#2f7fc1", "#8c8f1f", "#c4702a", "#c2475a", "#6b6fc4"];

// The same group keeps the same colour on every term page (new keys get the next colours).
const GROUP_KEYS = ["bej", "akh", "av", "bek", "am"];
const colorOf = (key, index) => {
  const known = GROUP_KEYS.indexOf(key);
  return GROUP_COLORS[(known >= 0 ? known : GROUP_KEYS.length + index) % GROUP_COLORS.length];
};

// every key of the answer that holds a non-empty `data` list of related terms
export const getRelationGroups = (term) =>
  Object.entries(term ?? {}).filter(
    ([, value]) => Array.isArray(value?.data) && value.data.some((item) => item?.term?.id),
  );

// Points on a circle around (0, 0), one per related term. Many terms alternate
// between two radii so neighbouring labels do not overlap.
const radialPositions = (count) => {
  const radius = Math.max(170, count * 12);
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const r = count > 14 && i % 2 ? radius * 1.3 : radius;
    return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
  });
};

// API answer -> Cytoscape elements + the list of groups for the legend.
// Nodes are placed group by group, so each group fills one arc of the circle.
export const buildGraph = (term) => {
  const groups = getRelationGroups(term).map(([key, value], index) => ({
    key,
    color: colorOf(key, index),
    items: value.data,
  }));

  const nodes = [];
  const edges = [];
  const seen = new Set([term.id]); // a term listed in two groups is drawn once

  for (const { key, color, items } of groups) {
    for (const { term: related, perspective } of items) {
      if (!related?.id || seen.has(related.id)) continue;
      seen.add(related.id);
      nodes.push({
        data: {
          id: related.id, // the real id: it is also the term page's address (/term/:id)
          label: related.title,
          group: key,
          color,
          perspective,
          status: related.status,
          domain: related.domain?.title,
          description: related.description,
        },
      });
      edges.push({ data: { id: `${term.id}-${related.id}`, source: term.id, target: related.id, color } });
    }
  }

  const positions = radialPositions(nodes.length);
  nodes.forEach((node, i) => {
    node.position = positions[i];
  });

  const center = {
    data: {
      id: term.id,
      label: term.title,
      center: true,
      status: term.status,
      domain: term.domain?.title,
    },
    position: { x: 0, y: 0 },
  };

  return { elements: [center, ...nodes, ...edges], groups, count: nodes.length };
};

// Cytoscape draws on a canvas, so its look is described here, not in Tailwind.
export const graphStyle = (isDark) => {
  const outline = isDark ? "#ffffff" : "#1c1917";
  return [
    {
      selector: "node",
      style: {
        label: "data(label)",
        "background-color": "data(color)",
        color: "#ffffff",
        "font-size": 13,
        "font-weight": 600,
        "text-valign": "center",
        "text-halign": "center",
        "text-wrap": "ellipsis",
        "text-max-width": 130,
        shape: "ellipse",
        width: "label",
        height: "label",
        padding: "11px",
        "border-width": 0,
        "overlay-opacity": 0,
        "transition-property": "opacity, border-width",
        "transition-duration": 150,
      },
    },
    {
      selector: "node[?center]",
      style: {
        "background-color": "#047857",
        "border-width": 3,
        "border-color": "#6ee7b7",
        "font-size": 15,
        padding: "16px",
        "z-index": 10,
      },
    },
    {
      selector: "edge",
      style: { width: 1.6, "line-color": "data(color)", opacity: 0.75, "curve-style": "straight" },
    },
    { selector: "node.hover", style: { "border-width": 3, "border-color": outline } },
    { selector: "node:selected", style: { "border-width": 4, "border-color": outline } },
    { selector: ".faded", style: { opacity: 0.22 } },
  ];
};
