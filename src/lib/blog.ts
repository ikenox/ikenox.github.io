import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import markdownToHtml from "@/lib/markdown";
import { htmlToText } from "html-to-text";

const postsDirectory = join(process.cwd(), "blog");

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
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const contentHtml = await markdownToHtml(content, `/blog/${slug}`);
  return {
    slug,
    title: data.title as string,
    date: new Date(data.date as string),
    lang: data.lang as string | undefined,
    contentText: htmlToText(contentHtml),
    contentHtml,
  };
}

export async function getStaticFileNamesBySlug(slug: string): Promise<string[]> {
  return fs.readdirSync(join(postsDirectory, `${slug}/static`));
}
