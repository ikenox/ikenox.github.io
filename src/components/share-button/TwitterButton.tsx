import * as React from "react";

export class TwitterButton extends React.Component {
  componentDidMount(): void {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    try {
      document
        .getElementById("twitter-button-link")
        .parentElement.appendChild(script);
    } catch {}
  }

  render() {
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
    );
  }
}
