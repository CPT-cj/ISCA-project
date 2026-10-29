// Descriptions from the API contain HTML copied from Word (inline styles, nested
// <span>s, footnotes). We never inject it as-is. Instead we rebuild it from
// scratch: only the tags below survive, and NO attributes are copied (so no
// style, href, onerror, ...). Every other tag is unwrapped (its text stays),
// and dangerous ones are dropped together with their content.
const ALLOWED = new Set(["P", "BR", "STRONG", "B", "EM", "I", "U", "UL", "OL", "LI", "SUP", "SUB", "BLOCKQUOTE"]);
const DROPPED = new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "NOSCRIPT", "TEMPLATE", "SVG", "MATH", "HEAD", "LINK", "META", "TITLE"]);
const MUST_HAVE_TEXT = new Set(["P", "LI", "BLOCKQUOTE"]); // empty ones (<p>&nbsp;</p>) are skipped

const rebuild = (source, target) => {
  for (const node of source.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      target.appendChild(document.createTextNode(node.textContent));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (DROPPED.has(node.tagName.toUpperCase())) continue;
      if (ALLOWED.has(node.tagName)) {
        const el = document.createElement(node.tagName.toLowerCase());
        rebuild(node, el);
        if (MUST_HAVE_TEXT.has(node.tagName) && !el.textContent.trim()) continue;
        target.appendChild(el);
      } else {
        rebuild(node, target); // unwrap: keep the content, lose the tag
      }
    }
  }
};

const sanitize = (root) => {
  const box = document.createElement("div"); // never attached to the page
  rebuild(root, box);
  return box.innerHTML;
};

const FOOTNOTES_ID = "footnote-rel-content";

// -> { main, footnotes }: two safe HTML strings (empty string when absent).
export const parseRichText = (html) => {
  if (typeof html !== "string" || !html.trim()) return { main: "", footnotes: "" };
  const doc = new DOMParser().parseFromString(html, "text/html"); // inert: nothing runs
  const footnotes = doc.getElementById(FOOTNOTES_ID);
  footnotes?.remove();
  return {
    main: sanitize(doc.body),
    footnotes: footnotes ? sanitize(footnotes) : "",
  };
};

// Plain text for list previews (no footnotes, no tags).
export const htmlToText = (html) => {
  if (typeof html !== "string" || !html.trim()) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.getElementById(FOOTNOTES_ID)?.remove();
  doc.querySelectorAll("script, style").forEach((el) => el.remove());
  return doc.body.textContent.replace(/\s+/g, " ").trim();
};
