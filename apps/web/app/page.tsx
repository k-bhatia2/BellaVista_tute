import Link from 'next/link';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@nakshatra/ui';

export default function HomePage() {
  return (
    <div className="grid gap-12 py-12">
      <section className="grid gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Train smarter with Nakshatra Fitness</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          Access unified workout plans, personalised offers, and live check-in analytics across web and mobile. Built
          for members, managers, and admins to stay in sync.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Create account
          </Link>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>{feature.description}</CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}

const features = [
  {
    title: 'Realtime insights',
    description: 'Track member check-ins and attendance patterns with live updates from every gym location.',
  },
  {
    title: 'Role-based dashboards',
    description: 'Dedicated views for members, gym managers, and administrators with secure role enforcement.',
  },
  {
    title: 'Omnichannel experiences',
    description: 'Seamless coordination across the web, mobile, and onsite kiosks powered by a shared API.',
  },
];
