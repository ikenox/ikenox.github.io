---
title: ブログをGatsbyJSに載せ替えました
date: "2018-08-04T00:00Z"
---

### GatsbyJS

[https://www.gatsbyjs.org/]( https://www.gatsbyjs.org/ )
> Blazing-fast static site generator for React

今までブログは[ Jekyll ]( https://jekyllrb.com/ )で生成してましたが、GatsbyJSに移行してみました。

GatsbyJSを使うとReact.jsベースの静的PWAサイトを生成できます。
`Blazing-fast static site generator` と謳っているだけあって、ページ遷移が爆速になったので満足です。

今までどおりホスティングはGitHub Pagesですが、GitHub Pagesがいつの間にか独自ドメインのHTTPSをサポートするようになってたので、今まで使っていたCloudflareのSSL証明書からGitHub Pagesのものに移行しました。

