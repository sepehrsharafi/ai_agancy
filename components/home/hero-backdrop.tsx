// "Signal ribbon": a silk ribbon of thin parallel curves twisting through the hero's background,
// rising from the bottom start corner to the top end, behind the console. It is drawn once, on
// the server, as plain SVG paths: no canvas, no per-frame JS, no filters. The only motion is one
// slow CSS drift on the whole SVG (a composited transform), see `hero-ribbon` in hero.css.

const VIEW_W = 1600;
const VIEW_H = 900;
const LINES = 28;
const SAMPLES = 28;
// The curves run past both sides of the viewBox so the drift never shows a cut end.
const X_FROM = -120;
const X_TO = VIEW_W + 120;

const TAU = Math.PI * 2;
const round = (n: number) => Math.round(n * 10) / 10;

// The spine: a diagonal sweep from the bottom start up to the top end with a gentle S and a
// small ripple on top, so it reads as cloth and not as a ruler. It stays low under the copy
// column, climbs behind the console and rises steeply out of its top end.
function spine(t: number) {
  const sweep = Math.pow(Math.max(0, t), 1.8);
  return 860 - 700 * sweep + 22 * Math.sin(TAU * 1.6 * t + 0.8);
}

// Half the ribbon's width: fat at both ends (under the copy, above the console) and narrow in
// the middle, where the console covers it.
function halfWidth(t: number) {
  return 140 + 70 * Math.sin(TAU * 0.9 * t + 1.1);
}

// How far the ribbon has turned about its own axis. cos(phase) is 1 when it faces the viewer
// and 0 when it is edge-on (every line meets on the spine), so this is the whole 3D illusion.
function phase(t: number) {
  return TAU * 1.55 * t + 0.35 + 0.35 * Math.sin(TAU * 0.8 * t);
}

// Catmull-Rom through the points, written as cubic Beziers.
function smoothPath(pts: [number, number][]) {
  const last = pts.length - 1;
  let d = `M${round(pts[0][0])},${round(pts[0][1])}`;
  for (let i = 0; i < last; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(last, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${round(c1x)},${round(c1y)} ${round(c2x)},${round(c2y)} ${round(p2[0])},${round(p2[1])}`;
  }
  return d;
}

// Computed once at module load, never in the browser.
const RIBBON = Array.from({ length: LINES }, (_, k) => {
  const u = (2 * k) / (LINES - 1) - 1; // -1 .. 1 across the ribbon's width
  const pts = Array.from({ length: SAMPLES }, (_, i): [number, number] => {
    const x = X_FROM + ((X_TO - X_FROM) * i) / (SAMPLES - 1);
    const t = x / VIEW_W;
    const a = phase(t);
    // A touch of perspective: the edge turning toward the viewer spreads, the far edge tightens.
    const y = spine(t) + u * halfWidth(t) * Math.cos(a) * (1 + 0.22 * u * Math.sin(a));
    return [x, y];
  });
  // Brightest on one shoulder of the ribbon, like light catching a fold; 0.14 .. 0.55.
  const glow = Math.exp(-(((k / (LINES - 1) - 0.68) / 0.32) ** 2));
  return { d: smoothPath(pts), opacity: round((0.14 + 0.41 * glow) * 100) / 100 };
});

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="hero-backdrop">
      <div className="hero-backdrop-glow" />
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="hero-ribbon"
        focusable="false"
      >
        {/* One gradient across the whole sweep: ultra, a lighter violet, then mint at the far end. */}
        <defs>
          <linearGradient id="hero-ribbon-stroke" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VIEW_W} y2="0">
            <stop offset="0" stopColor="#3b2dff" />
            <stop offset="0.55" stopColor="#7b6bff" />
            <stop offset="1" stopColor="#18c98c" />
          </linearGradient>
        </defs>
        {/* Stroke on the group (inherited), so the phone-only copy below can <use> it as is;
            vector-effect does not inherit, hence on every path. */}
        <g id="hero-ribbon-lines" fill="none" stroke="url(#hero-ribbon-stroke)" strokeWidth={1.25}>
          {RIBBON.map((line, k) => (
            <path key={k} d={line.d} strokeOpacity={line.opacity} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
      {/* Phones: the same lines again, framed on the ribbon's rising end and placed in the empty
          top-end corner beside the headline, so the first screen has it too. No second copy of
          the path data, just a reference. */}
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="hero-ribbon-top" focusable="false">
        <use href="#hero-ribbon-lines" />
      </svg>
    </div>
  );
}
