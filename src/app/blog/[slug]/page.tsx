import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { HatenaBookmarkButton } from "@/components/share-button/HatenaBookmarkButton";
import { PocketButton } from "@/components/share-button/PocketButton";
import { TwitterButton } from "@/components/share-button/TwitterButton";
import { toDateString } from "@/lib/util";
import { Metadata } from "next";
import { pageInfoBase, toMetadata } from "@/app/page-info";
import { BlogPostBody } from "@/components/BlogPostBody";

type Params = {
  readonly slug: string;
};

export default async function Post({ params }: { params: Params }) {
  const post = await getPostBySlug(params.slug);

  return (
    <main>
      <div className={"no-vertical-margin"}>
        <h1>{post.title}</h1>
        <p>{toDateString(post.date)}</p>
      </div>
      <HatenaBookmarkButton /> <TwitterButton /> <PocketButton />
      <BlogPostBody contentHtml={post.contentHtml} />
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  return toMetadata({
    ...pageInfoBase,
    title: post.title,
  });
}
