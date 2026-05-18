import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { formatPostDate, getAllPosts, getPost } from "@/lib/posts";
import { AuthorChip } from "@/components/author-chip";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            {formatPostDate(post.date)}
          </p>
          <AuthorChip author={post.author} />
        </div>
        <h1 className="text-2xl tracking-tight">{post.title}</h1>
        {post.description ? (
          <p className="text-muted-foreground">{post.description}</p>
        ) : null}
      </header>

      <div className="prose-mdx space-y-6 [&_h2]:text-lg [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:text-base [&_h3]:mt-8 [&_h3]:mb-2 [&_p]:leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground">
        <MDXRemote source={post.content} />
      </div>

      <footer className="pt-6 border-t border-border">
        <Link
          href="/blog"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← all writing
        </Link>
      </footer>
    </article>
  );
}
