// Cropped from the supplied icons.png. They are used as CSS masks (see MaskIcon),
// so only their shape matters and the colour comes from Tailwind's text-* classes.
import logo from "./isca-logo.png";
import divider from "./divider.png";
import relations from "./icon-relations.png";
import dictionary from "./icon-dictionary.png";
import sources from "./icon-sources.png";
import index from "./icon-index.png";

export const icons = {
  logo: { src: logo, width: 326, height: 103 },
  divider: { src: divider, width: 125, height: 4 },
  relations: { src: relations, width: 77, height: 65 },
  dictionary: { src: dictionary, width: 55, height: 59 },
  sources: { src: sources, width: 56, height: 68 },
  index: { src: index, width: 62, height: 65 },
};
