---
templateKey: blog-post
title: ブログをGatsbyJSに載せ替えました
date: "2018-08-04T00:00Z"
lastModified: "2018-08-04T00:00Z"
---

### GatsbyJS

<preview-link title="GatsbyJS" url="https://www.gatsbyjs.org/"></preview-link>

今までブログは[ Jekyll ](https://jekyllrb.com/)で生成してましたが、GatsbyJS に移行してみました。

GatsbyJS を使うと React.js ベースの静的 PWA サイトを生成できます。
`Blazing-fast static site generator` と謳っているだけあって、ページ遷移が爆速になったので満足です。

今までどおりホスティングは GitHub Pages ですが、GitHub Pages がいつの間にか独自ドメインの HTTPS をサポートするようになってたので、今まで使っていた Cloudflare の SSL 証明書から GitHub Pages のものに移行しました。
