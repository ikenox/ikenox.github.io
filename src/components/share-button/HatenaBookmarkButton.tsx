import * as React from "react";

export class HatenaBookmarkButton extends React.Component {
  componentDidMount(): void {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://b.st-hatena.com/js/bookmark_button.js";
    script.async = true;
    try {
      document.getElementById("hatena-button-wrapper").appendChild(script);
    } catch {}
  }

  render() {
    return (
      <span id="hatena-button-wrapper" style={{ height: "20px" }}>
        <a
          href="http://b.hatena.ne.jp/entry/"
          className="hatena-bookmark-button"
          data-hatena-bookmark-layout="basic-label-counter"
          data-hatena-bookmark-lang="ja"
          title="このエントリーをはてなブックマークに追加"
        >
          <img
            src="https://b.st-hatena.com/images/v4/public/entry-button/button-only@2x.png"
            alt="このエントリーをはてなブックマークに追加"
            width="20"
            height="20"
            style={{ border: null }}
          />
        </a>
      </span>
    );
  }
}
