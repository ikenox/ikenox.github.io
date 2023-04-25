import remarkGfm from "remark-gfm";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeExternalLinks from "rehype-external-links";
import { visit } from "unist-util-visit";
import { join } from "path";

export default async function markdownToHtml(markdown: string, locationPath?: string) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(changeImagePath, { locationPath })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeExternalLinks, { target: "_blank" })
    .use(rehypeFormat)
    .use(rehypePrettyCode, {
      theme: "min-dark",
      keepBackground: true,
    })
    .use(rehypeStringify)
    .process(markdown)
    .then((a) => a.toString());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function changeImagePath(options: { locationPath?: string }): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function transform(tree: any) {
    visit(tree, "image", (node) => {
      node.url = join(options?.locationPath ?? "", node.url);
    });
  }

  return transform;
}
