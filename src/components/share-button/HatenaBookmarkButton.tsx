'use client';
import * as React from 'react';
import { useEffect } from 'react';

export function HatenaBookmarkButton() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://b.st-hatena.com/js/bookmark_button.js';
    script.async = true;
    try {
      document.getElementById('hatena-button-wrapper')?.appendChild(script);
    } catch (e) {
      console.error(e);
    }

    return () => {
      document.getElementById('hatena-button-wrapper')?.removeChild(script);
    };
  });

  return (
    <span id="hatena-button-wrapper" style={{ height: '20px' }}>
      <a
        href="http://b.hatena.ne.jp/entry/"
        className="hatena-bookmark-button"
        data-hatena-bookmark-layout="basic-label-counter"
        data-hatena-bookmark-lang="ja"
        title="このエントリーをはてなブックマークに追加"
      ></a>
    </span>
  );
}
