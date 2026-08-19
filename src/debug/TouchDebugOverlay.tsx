import React from "react";

/**
 * TEMPORARY diagnostic — delete once the mobile "first tap after swipe is
 * swallowed" bug is identified. Mount it anywhere (it renders a fixed overlay)
 * and read the log on the device itself; no remote debugging needed.
 *
 * The overlay is `pointer-events: none` throughout, so it cannot itself absorb
 * a tap and skew the result.
 */

type Entry = {
  id: number;
  t: number;
  type: string;
  target: string;
  note?: string;
  count: number;
};

const TRACKED = [
  "touchstart",
  "touchmove",
  "touchend",
  "touchcancel",
  "pointerdown",
  "pointerup",
  "pointercancel",
  "mouseover",
  "mousemove",
  "mousedown",
  "mouseup",
  "click",
  "focusin",
  "focusout",
  "gotpointercapture",
  "lostpointercapture",
  "selectstart",
  "contextmenu",
  "dragstart",
] as const;

const MAX_ENTRIES = 26;

function describe(target: EventTarget | null): string {
  if (!(target instanceof Element)) return "-";
  const cls = target.className;
  const firstClass =
    typeof cls === "string" && cls ? "." + cls.trim().split(/\s+/)[0] : "";
  const text = (target.textContent ?? "").trim().slice(0, 10);
  return `${target.tagName.toLowerCase()}${firstClass}${text ? ` "${text}"` : ""}`;
}

export default function TouchDebugOverlay() {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const state = React.useRef({
    id: 0,
    t0: 0,
    lastScrollAt: 0,
    clickSinceTouchStart: false,
    scrollAtTouchStart: 0,
    gestureX: 0,
    gestureY: 0,
    gestureT: 0,
  });

  React.useEffect(() => {
    const s = state.current;

    const push = (type: string, target: string, note?: string) => {
      const now = performance.now();
      if (!s.t0) s.t0 = now;
      const t = Math.round(now - s.t0);
      setEntries((prev) => {
        const last = prev[prev.length - 1];
        // Coalesce move spam so the interesting events stay on screen.
        if (last && last.type === type && last.target === target && !note) {
          const merged = { ...last, count: last.count + 1, t };
          return [...prev.slice(0, -1), merged];
        }
        s.id += 1;
        const next = [...prev, { id: s.id, t, type, target, note, count: 1 }];
        return next.slice(-MAX_ENTRIES);
      });
    };

    const onScroll = () => {
      s.lastScrollAt = performance.now();
    };

    const onEvent = (event: Event) => {
      const type = event.type;
      let note: string | undefined;

      const touch =
        "changedTouches" in event
          ? (event as TouchEvent).changedTouches[0]
          : undefined;
      const vv = window.visualViewport;

      if (type === "touchstart") {
        s.clickSinceTouchStart = false;
        s.scrollAtTouchStart = window.scrollY;
        s.gestureX = touch?.clientX ?? 0;
        s.gestureY = touch?.clientY ?? 0;
        s.gestureT = performance.now();
        note = `y=${Math.round(window.scrollY)} vv=${Math.round(vv?.height ?? 0)}/${Math.round(vv?.offsetTop ?? 0)}`;
        const sinceScroll = performance.now() - s.lastScrollAt;
        if (s.lastScrollAt && sinceScroll < 400) {
          note += `  FLING? scroll ${Math.round(sinceScroll)}ms ago`;
        }
      }

      if (type === "click") s.clickSinceTouchStart = true;

      if (type === "focusin" || type === "focusout") {
        note = `active=${describe(document.activeElement)}`;
      }

      if (type === "touchend") {
        const dx = (touch?.clientX ?? 0) - s.gestureX;
        const dy = (touch?.clientY ?? 0) - s.gestureY;
        const dist = Math.hypot(dx, dy);
        const dt = Math.max(1, performance.now() - s.gestureT);
        const v = dist / dt;
        // Hammer's swipe recognizer: threshold 10px, velocity 0.3px/ms
        // (hammer.js:1979-1980). Below either bound it never fires `swipe`.
        const recognized = dist > 10 && v > 0.3;
        note = `d=${Math.round(dist)}px v=${v.toFixed(2)}px/ms ${
          recognized ? "→ HAMMER SWIPE" : "→ no swipe"
        } vv=${Math.round(vv?.height ?? 0)}/${Math.round(vv?.offsetTop ?? 0)}`;
      }

      push(type, describe(event.target), note);

      if (type === "touchend") {
        const scrolled = window.scrollY !== s.scrollAtTouchStart;
        const yAtEnd = window.scrollY;
        // Watch for 3s: does the page keep coasting after the finger lifts, and
        // when exactly does it come to rest? A fling that is still running when
        // the next tap lands would explain the swallowed click.
        const t0 = performance.now();
        let lastMoveAt = 0;
        let maxDelta = 0;
        const sample = () => {
          const d = window.scrollY - yAtEnd;
          if (d !== 0 && Math.abs(d) !== Math.abs(maxDelta)) {
            lastMoveAt = performance.now() - t0;
          }
          if (Math.abs(d) > Math.abs(maxDelta)) maxDelta = d;
          if (performance.now() - t0 < 3000) {
            requestAnimationFrame(sample);
          } else if (maxDelta !== 0) {
            push(
              "  fling",
              `Δy=${Math.round(maxDelta)}px, stopped ${Math.round(lastMoveAt)}ms after lift`,
              "coasted"
            );
          }
        };
        requestAnimationFrame(sample);

        window.setTimeout(() => {
          if (!s.clickSinceTouchStart) {
            push(
              "— DEAD TAP —",
              scrolled ? "(page scrolled during touch)" : "(no scroll)",
              "no click dispatched"
            );
          }
        }, 400);
      }
    };

    // Bubble phase on window runs after every element handler, so
    // `defaultPrevented` here tells us whether anything in the app called
    // preventDefault — which would suppress the compatibility mouse events and
    // the click while still letting the ripple fire.
    const onAfter = (event: Event) => {
      if (event.defaultPrevented) {
        push(`  ${event.type}`, describe(event.target), "defaultPrevented!");
      }
    };
    const AFTER = ["touchstart", "touchmove", "touchend", "pointerdown"];

    for (const type of TRACKED) {
      document.addEventListener(type, onEvent, {
        capture: true,
        passive: true,
      });
    }
    for (const type of AFTER) {
      window.addEventListener(type, onAfter, { passive: true });
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      for (const type of TRACKED) {
        document.removeEventListener(type, onEvent, { capture: true });
      }
      for (const type of AFTER) {
        window.removeEventListener(type, onAfter);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        maxHeight: "42vh",
        overflow: "hidden",
        background: "rgba(0,0,0,0.82)",
        color: "#0f0",
        font: "10px/1.35 monospace",
        padding: "4px 6px",
        zIndex: 99999,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      <div>
        {entries.map((e) => (
          <div
            key={e.id}
            style={{
              color: e.note || e.type.startsWith("—") ? "#ff6" : "#0f0",
            }}
          >
            {String(e.t).padStart(6)} {e.type}
            {e.count > 1 ? `×${e.count}` : ""} {e.target}
            {e.note ? `  ← ${e.note}` : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
