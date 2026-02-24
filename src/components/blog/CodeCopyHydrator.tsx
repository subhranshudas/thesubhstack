"use client";

import { useEffect } from "react";

/**
 * Attaches copy-to-clipboard behavior to all `.copy-btn` buttons
 * rendered server-side inside code blocks.
 */
export default function CodeCopyHydrator() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".copy-btn");
      if (!btn) return;

      const code = btn.dataset.code ?? "";
      navigator.clipboard.writeText(code).then(() => {
        const prev = btn.textContent;
        btn.textContent = "✓ copied";
        setTimeout(() => {
          btn.textContent = prev;
        }, 2000);
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
