import { fetchPostBySlug } from '@/services/publicService';
import siteConfig from '@/config/siteConfig';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { notFound } from 'next/navigation';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug).catch(() => null);
  if (!post) return { title: 'Không tìm thấy – Vitechs' };
  return {
    title: post.metaTitle || `${post.title} – Vitechs`,
    description: post.metaDescription || post.excerpt || '',
  };
}

export default async function TinTucDetailPage({ params }: Props) {
  const config = siteConfig;
  const post = await fetchPostBySlug(params.slug).catch(() => null);

  if (!post) notFound();

  return (
    <>
      <Navbar config={config} />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/tin-tuc"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-700 mb-6 transition-colors">
          <ArrowLeft size={14} /> Quay lại tin tức
        </Link>

        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-3">{post.title}</h1>

        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <CalendarDays size={14} />
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
          {post.author?.fullName && <span>· {post.author.fullName}</span>}
        </div>

        {post.thumbnail && (
          <img src={post.thumbnail} alt={post.title}
            className="w-full rounded-2xl mb-8 object-cover max-h-96" />
        )}

        <article
          className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-primary-700"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />
      </main>
      <Footer config={config} />
    </>
  );
}
