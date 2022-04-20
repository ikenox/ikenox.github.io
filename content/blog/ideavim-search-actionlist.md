---
templateKey: blog-post
title: IdeaVimで、「IntelliJでいつも使ってるあの機能」のaction名を探し当てる
date: "2019-06-11T00:00Z"
lastModified: "2019-06-11T00:00Z"
lang: ja
---

## IdeaVimのaction

IdeaVimでは、`~/.ideavimrc`に設定を記述することでキーマップに任意のIntelliJの機能(action)を割り当てることができる。
以下に設定の記述例を示す。

```vim
nnoremap gd :action GotoDeclaration<CR>
```

これは、「ノーマルモードで`gd`を入力すると、`GotoDeclaration`というactionを実行する」というキーマップの設定である。
ここで`GotoDeclaration`というのは、関数や定数の定義元にジャンプするIntelliJの機能であり、デフォルトだと`ctrl+B`(Macなら`cmd+B`)に割り当てられている。

このように、IdeaVimでは、任意のIntelliJの機能をキーマップに割り当てることができるようになっている。

## 「IntelliJでいつも使ってるあの機能」のaction名の見つけ方

では、「IntelliJでいつも使ってるあの機能」のaction名を探し当てるにはどうしたらよいのか。

IdeaVimでは`:actionlist 文字列` コマンドによって、文字列に部分一致するaction名の検索が可能になっている。そして、
**IdeaVimのv0.51.2からは、action名の部分一致のほか、現在そのactionに割り当てられているショートカットキーの部分一致でも検索できるようになった。**

これにより、目的のaction名が飛躍的に見つけやすくなった。
(それまでは、肝心のaction名がわからないのにaction名の部分一致で検索するしかなかったので、頑張ってそれっぽい単語で検索してみて当たるまで繰り返すということをやるしかなかった)

### 例


`:actionlist <M-I>` で検索した場合


```txt
--- Actions ---
ImplementMethods                                   <M-I>
MethodHierarchy.ImplementMethodAction              <M-I>
```


`:actionlist <M-S-` で検索した場合


```txt
--- Actions ---
$Redo                                              <M-S-Z> <A-S-BS>
ActivateVersionControlToolWindow                   <M-9> <M-S-9>
ChangeTypeSignature                                <M-S-F6>
CloseActiveTab                                     <M-S-F4>
CollapseAllRegions                                 <M-S-m> <M-S-->
CollapseBlock                                      <M-S-.>
...
```
