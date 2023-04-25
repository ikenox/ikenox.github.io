import "@/components/BlogPostBody.css";

export const BlogPostBody = ({ contentHtml }: { contentHtml: string }) => (
  <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
);
