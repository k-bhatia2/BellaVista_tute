import { fetchUserDashboard } from '@/lib/data';
import { Badge, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@nakshatra/ui';

export const dynamic = 'force-dynamic';

export default async function UserDashboardPage() {
  const { gym, membership, workout, offers, featured } = await fetchUserDashboard();

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your gym</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{gym.name}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">{gym.location}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {gym.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p>Status: <strong>{membership.status}</strong></p>
            <p>Started: {new Date(membership.startedAt).toLocaleDateString()}</p>
            <p>Expires: {new Date(membership.expiresAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s workout</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {workout.blocks.map((block) => (
              <div key={block.title} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h3 className="font-semibold">{block.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{block.description}</p>
                <p className="text-xs uppercase text-slate-400">Duration: {block.durationMinutes} minutes</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest offers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                <p className="font-medium">{offer.title}</p>
                <p className="text-xs text-slate-500">{new Date(offer.activeUntil).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">Featured content</h2>
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Published</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {featured.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.mediaType}</TableCell>
                    <TableCell>{new Date(item.publishedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
