import Link from "next/link";
import { github, siteName, twitter } from "@/metadata";

export function NavLinks() {
  return (
    <p>
      <b className={"title"}>
        <Link href={"/"}>{siteName}</Link>
      </b>
      &nbsp; | &nbsp;
      <Link href={`/aboutme`}>me</Link>
      &nbsp;
      <Link href={`https://github.com/${github}`} target={"_blank"}>
        github
      </Link>
      &nbsp;
      <Link href={`https://twitter.com/${twitter}`} target={"_blank"}>
        twitter
      </Link>
      &nbsp;
      <Link href={"/rss.xml"} target={"_blank"}>
        rss
      </Link>
    </p>
  );
}
