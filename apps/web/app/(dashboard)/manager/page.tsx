import { fetchManagerDashboard } from '@/lib/data';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from '@nakshatra/ui';

export const dynamic = 'force-dynamic';

export default async function ManagerDashboardPage() {
  const { summary, members, checkins, offers } = await fetchManagerDashboard();

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard title="Active memberships" value={summary.memberships.toString()} />
        <StatCard title="Active offers" value={summary.activeOffers.toString()} />
        <StatCard title="Live check-ins" value={summary.activeCheckIns.toString()} />
        <StatCard title="Featured posts" value={summary.featuredCount.toString()} />
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Member roster</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Member</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Expires</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.userId}</TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'ACTIVE' ? 'success' : 'warning'}>{member.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(member.expiresAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Enroll new member</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Use the mobile app or admin dashboard to assign a new membership. API integration coming soon.
            </p>
            <Button variant="secondary">Open enrollment form</Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance feed</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            {checkins.map((event) => (
              <div key={event.id} className="rounded-md border border-slate-200 p-3 dark:border-slate-800">
                <p className="font-medium">{event.type}</p>
                <p className="text-xs text-slate-500">{new Date(event.occurredAt).toLocaleTimeString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                <p className="font-medium">{offer.title}</p>
                <p className="text-xs text-slate-500">Active until {new Date(offer.activeUntil).toLocaleDateString()}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
