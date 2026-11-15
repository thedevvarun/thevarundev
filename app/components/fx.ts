const clamp = (x: number) => Math.min(1, Math.max(0, x));

/**
 * One scroll loop for the whole page. It writes plain numbers into CSS variables
 * and the stylesheet does the rest:
 *   [data-p]    --p  0→1 while the element crosses the viewport
 *   [data-vel]  --v  0→1 scroll speed, eased
 *   [data-page] --page  0→1 through the document
 *   [data-in]   gets .in the first time it enters
 */
export function startFx(root: HTMLElement) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }),
    { rootMargin: "0px 0px -10% 0px" }
  );
  root.querySelectorAll("[data-in]").forEach((el) => io.observe(el));
  root.classList.add("fx");

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => io.disconnect();

  const tracked = [...root.querySelectorAll<HTMLElement>("[data-p],[data-vel]")];
  const page = root.querySelector<HTMLElement>("[data-page]");
  const set = (el: HTMLElement, name: string, value: number) => {
    const v = value.toFixed(3);
    if (el.style.getPropertyValue(name) !== v) el.style.setProperty(name, v);
  };

  // The headline squeeze re-lays out text every frame; phones scroll better without it.
  const squeeze = !matchMedia("(pointer: coarse)").matches;
  let raf = 0;
  let lastY = scrollY;
  let vel = 0;
  let dirty = true;

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const y = scrollY;
    vel += (y - lastY - vel) * 0.16;
    lastY = y;
    const v = clamp(Math.abs(vel) / 70);
    if (v < 0.002 && !dirty) return;
    dirty = v >= 0.002;

    const vh = innerHeight;
    if (page) set(page, "--page", y / Math.max(1, document.documentElement.scrollHeight - vh));
    // Measure everything before writing anything, so the frame lays out once.
    const rects = tracked.map((el) => el.getBoundingClientRect());
    tracked.forEach((el, i) => {
      const r = rects[i];
      if (r.bottom < -300 || r.top > vh + 300) return;
      if (squeeze && "vel" in el.dataset) set(el, "--v", v);
      if ("p" in el.dataset) set(el, "--p", clamp((vh - r.top) / (vh + r.height)));
    });
  };
  const wake = () => {
    dirty = true;
  };
  addEventListener("scroll", wake, { passive: true });
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    removeEventListener("scroll", wake);
  };
}
