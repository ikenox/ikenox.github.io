import generateRssFeed from '@/lib/rss';

export async function GET() {
  return new Response(await generateRssFeed(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
