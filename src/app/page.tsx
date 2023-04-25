import { BlogPost, getAllPosts } from "@/lib/blog";
import React from "react";
import Link from "next/link";
import { toDateString, trimString } from "@/lib/util";
import { pageInfoBase, toMetadata } from "@/app/page-info";
import { TruncatedText } from "@/components/TruncatedText";

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-5">
      <main>
        <div>
          {posts.map((post) => (
            <PostSummary post={post} key={post.slug} />
          ))}
        </div>
      </main>
    </div>
  );
}

function PostSummary({ post }: { post: BlogPost }) {
  return (
    <div className={"post-summary no-vertical-margin"}>
      <p>{toDateString(post.date)}</p>
      <h2>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      <TruncatedText text={trimString(post.contentText, 400)} maxLines={3} />
    </div>
  );
}

export const metadata = toMetadata(pageInfoBase);
