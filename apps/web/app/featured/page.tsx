import Link from 'next/link';
import { fetchFeaturedContent } from '@/lib/data';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@nakshatra/ui';

export const dynamic = 'force-dynamic';

export default async function FeaturedPage() {
  const content = await fetchFeaturedContent();

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Featured content</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {content.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                {item.title}
                <Badge variant="outline">{item.mediaType}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <p>{item.excerpt}</p>
              <Link
                href={item.contentUrl}
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
                target="_blank"
                rel="noopener noreferrer"
              >
                View content
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
