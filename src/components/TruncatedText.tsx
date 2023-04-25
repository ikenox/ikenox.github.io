export const TruncatedText = ({ text, maxLines }: { text: string; maxLines: number }) => (
  <p
    style={{
      display: "-webkit-box",
      textOverflow: "ellipsis",
      overflow: "hidden",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
    }}
  >
    {text}
  </p>
);
