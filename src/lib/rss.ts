import RSS from "rss";
import { getAllPosts } from "@/lib/blog";
import { description, siteName, siteUrl } from "@/metadata";
import { trimString } from "@/lib/util";

export default async function generateRssFeed(): Promise<string> {
  const feed = new RSS({
    title: siteName,
    site_url: siteUrl,
    description: description,
    feed_url: `${siteUrl}/rss.xml`,
    image_url: `${siteUrl}/logo.png`,
    pubDate: new Date(),
  });
  (await getAllPosts()).forEach((post) => {
    feed.item({
      title: post.title,
      description: trimString(post.contentText, 200),
      url: `${siteUrl}/blog/${post.slug}`,
      date: post.date,
    });
  });
  return feed.xml({ indent: true });
}
