import { fetchAdminDashboard } from '@/lib/data';
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

export default async function AdminDashboardPage() {
  const { gyms, managers, featured, analytics, health } = await fetchAdminDashboard();

  return (
    <div className="grid gap-8">
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gyms awaiting approval</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Location</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gyms.map((gym) => (
                  <TableRow key={gym.id}>
                    <TableCell>{gym.name}</TableCell>
                    <TableCell>{gym.location}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm">Approve</Button>
                      <Button size="sm" variant="ghost">
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Managers</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {managers.map((manager) => (
              <div key={manager.id} className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800">
                <p className="font-semibold">
                  {manager.firstName} {manager.lastName}
                </p>
                <p className="text-xs text-slate-500">{manager.email}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Featured moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {featured.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.mediaType}</TableCell>
                    <TableCell>
                      <Badge variant="warning">Pending</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System health</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge variant={health.status === 'OK' ? 'success' : 'danger'}>{health.status}</Badge>
            </div>
            <div className="grid gap-2">
              {health.dependencies.map((dependency) => (
                <div key={dependency.name} className="flex items-center justify-between rounded-md bg-slate-100 px-3 py-2 dark:bg-slate-800">
                  <span>{dependency.name}</span>
                  <span>
                    {dependency.status} ({dependency.latencyMs}ms)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Global analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Event</TableHeaderCell>
                  <TableHeaderCell>Timestamp</TableHeaderCell>
                  <TableHeaderCell>Payload</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>{new Date(event.occurredAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <pre className="whitespace-pre-wrap text-xs text-slate-500">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </TableCell>
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
