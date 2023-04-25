"use client"
import * as React from "react"
import { useEffect } from "react";

export function TwitterButton() {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "https://platform.twitter.com/widgets.js"
    script.async = true
    try {
      document
        .getElementById("twitter-button-link")
        ?.parentElement?.appendChild(script)
    } catch (e) {
      console.error(e)
    }

    return () => {
      document
        .getElementById("twitter-button-link")
        ?.parentElement?.removeChild(script)
    }
  })

  return (
    <a
      id="twitter-button-link"
      href="https://twitter.com/share?ref_src=twsrc%5Etfw"
      className="twitter-share-button"
      data-show-count="false"
      style={{ display: "none" }}
    >
      Tweet
    </a>
  )
}
