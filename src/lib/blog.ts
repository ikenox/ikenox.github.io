import fs from 'fs';
import matter from 'gray-matter';

import remarkGfm from 'remark-gfm';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeExternalLinks from 'rehype-external-links';
import { visit } from 'unist-util-visit';
import { join } from 'path';
import { htmlToText } from 'html-to-text';

const postsDirectory = join(process.cwd(), 'blog');

export type BlogPost = {
  readonly slug: string;
  readonly title: string;
  readonly date: Date;
  readonly contentHtml: string;
  readonly contentText: string;
  readonly lang?: string;
};

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await Promise.all(
    fs.readdirSync(postsDirectory).map((slug) => getPostBySlug(slug))
  );
  return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const fullPath = join(postsDirectory, `${slug}/post.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const contentHtml = await markdownToHtml(content, `/blog/${slug}`);
  return {
    slug,
    title: data.title as string,
    date: new Date(data.date as string),
    lang: data.lang as string | undefined,
    contentText: htmlToText(contentHtml, {
      formatters: {
        ignore: () => {
          // do nothing
        },
      },
      selectors: [
        {
          selector: 'img',
          format: 'ignore',
        },
        {
          selector: 'a',
          options: {
            ignoreHref: true,
          },
        },
        ...['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((selector) => ({
          selector,
          options: {
            uppercase: false,
          },
        })),
      ],
    }),
    contentHtml,
  };
}

export default async function markdownToHtml(markdown: string, locationPath?: string) {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(changeImagePath, { locationPath })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeExternalLinks, { target: '_blank' })
    .use(rehypeFormat)
    .use(rehypePrettyCode, {
      theme: 'dark-plus',
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
    visit(tree, 'image', (node) => {
      node.url = join(options?.locationPath ?? '', node.url);
    });
  }

  return transform;
}
