import { Metadata } from "next";
import { pageInfo } from "@/app/page-info";
import Link from "next/link";

export default async function AboutMe() {
  return (
    <main>
      <h1>Naoto Ikeno</h1>
      <ul>
        <li>Backend Software Engineer</li>
      </ul>
      <h2>Presentations</h2>
      <ul>
        <li>
          <Link
            href={"https://www.slideshare.net/ssuser901930/mbaas-for-global-and-china-170523864"}
            target={"_blank"}
          >
            MBaaS for Global and China
          </Link>
        </li>
        <li>
          <Link href={"https://speakerdeck.com/dena_tech/techcon2021-winter7"} target={"_blank"}>
            アーキテクトを目指す若手エンジニアのこれまで
          </Link>
        </li>
      </ul>
    </main>
  );
}

export const metadata: Metadata = {
  ...pageInfo,
  title: "About me",
};
