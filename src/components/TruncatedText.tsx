export const TruncatedText = ({ text, maxLines }: { text: string; maxLines: number }) => (
  <p
    style={{
      display: "-webkit-box",
      textOverflow: "ellipsis",
      overflow: "hidden",
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: "vertical",
    }}
  >
    {text}
  </p>
);
