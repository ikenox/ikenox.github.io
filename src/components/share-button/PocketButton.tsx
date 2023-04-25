"use client";
import * as React from "react";
import { useEffect } from "react";

export function PocketButton() {
  useEffect(() => {
    const script = document.createElement("script");
    script.id = "pocket-btn-js";
    script.src = "https://widgets.getpocket.com/v1/j/btn.js?v=1";
    script.async = true;
    try {
      document.getElementById("pocket-button-a")?.parentElement?.appendChild(script);
    } catch (e) {
      console.error(e);
    }

    return () => {
      document.getElementById("pocket-button-a")?.parentElement?.removeChild(script);
    };
  });

  return (
    <div
      style={{
        display: "inline-block",
        height: "20px",
        overflow: "hidden",
      }}
    >
      <a
        id="pocket-button-a"
        data-pocket-label="pocket"
        data-pocket-count="horizontal"
        style={{ display: "inline-block" }}
        data-lang="en"
      />
    </div>
  );
}
