import type { Metadata } from "next";
import BlogIndex from "./blog-index";
import { blogMetadata } from "./metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return blogMetadata(lang, 1);
}

export default async function BlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <BlogIndex lang={lang} page={1} />;
}
