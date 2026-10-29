// Draws a PNG's alpha shape in the current text colour, so one icon works in
// both themes: colour it with text-* classes (e.g. text-emerald-700).
const MaskIcon = ({ src, width, height, label, className = "" }) => (
  <span
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    className={`inline-block shrink-0 bg-current mask-contain mask-center mask-no-repeat ${className}`}
    style={{
      maskImage: `url(${src})`,
      WebkitMaskImage: `url(${src})`,
      aspectRatio: `${width} / ${height}`,
    }}
  />
);

export default MaskIcon;
