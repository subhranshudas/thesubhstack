"use client";

import { useEffect } from "react";

/**
 * Finds all `.mermaid-placeholder` divs injected by the server-rendered HTML
 * (with `data-mermaid` attribute containing URL-encoded chart code) and
 * replaces them with rendered Mermaid SVGs.
 */
export default function MermaidHydrator() {
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        darkMode: true,
        themeVariables: {
          background: "#18181e",
          primaryColor: "#1f1f27",
          primaryTextColor: "#e8e8f0",
          primaryBorderColor: "#35354a",
          lineColor: "#4a4a65",
          secondaryColor: "#18181e",
          tertiaryColor: "#111115",
          edgeLabelBackground: "#111115",
          clusterBkg: "#1f1f27",
          titleColor: "#e8e8f0",
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          fontSize: "13px",
          nodeBorder: "#35354a",
          mainBkg: "#18181e",
          nodeTextColor: "#e8e8f0",
          signalColor: "#00d4aa",
          signalTextColor: "#e8e8f0",
          activationBorderColor: "#00d4aa",
          activationBkgColor: "#0d2e25",
          sequenceNumberColor: "#e8e8f0",
          labelBoxBkgColor: "#18181e",
          labelBoxBorderColor: "#35354a",
          labelTextColor: "#e8e8f0",
          loopTextColor: "#e8e8f0",
          noteBorderColor: "#4a4a65",
          noteBkgColor: "#1f1f27",
          noteTextColor: "#a0a0b8",
          fillType0: "#18181e",
          fillType1: "#1f1f27",
        },
      });

      const placeholders = document.querySelectorAll<HTMLDivElement>(
        ".mermaid-placeholder"
      );

      await Promise.all(
        Array.from(placeholders).map(async (el) => {
          if (cancelled) return;
          const encoded = el.dataset.mermaid;
          if (!encoded) return;

          const chart = decodeURIComponent(encoded);
          const id = `mermaid-${Math.random().toString(36).slice(2)}`;

          try {
            const { svg } = await mermaid.render(id, chart);
            if (!cancelled) {
              const wrapper = document.createElement("div");
              wrapper.className = "mermaid-wrapper not-prose";
              wrapper.setAttribute("role", "img");
              wrapper.setAttribute("aria-label", "Diagram");
              wrapper.innerHTML = svg;
              el.replaceWith(wrapper);
            }
          } catch (err) {
            console.error("Mermaid render error:", err);
          }
        })
      );
    }

    hydrate();
    return () => { cancelled = true; };
  }, []);

  return null;
}
