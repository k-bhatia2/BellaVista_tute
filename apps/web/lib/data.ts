import {
  DashboardSummarySchema,
  FeaturedContentSchema,
  GymSchema,
  OfferSchema,
  WorkoutPlanSchema,
  MembershipSchema,
  AnalyticsEventSchema,
  SystemHealthSchema,
  UserSchema,
} from '@nakshatra/types';
import { serverApi } from './api-client';

export async function fetchUserDashboard() {
  const [gym, membership, workout, offers, featured] = await Promise.all([
    serverApi.get('/gyms/current'),
    serverApi.get('/memberships/current'),
    serverApi.get('/workouts/today'),
    serverApi.get('/offers'),
    serverApi.get('/featured'),
  ]);

  return {
    gym: GymSchema.parse(gym),
    membership: MembershipSchema.parse(membership),
    workout: WorkoutPlanSchema.parse(workout),
    offers: OfferSchema.array().parse(offers),
    featured: FeaturedContentSchema.array().parse(featured),
  };
}

export async function fetchManagerDashboard() {
  const [summary, members, checkins, offers] = await Promise.all([
    serverApi.get('/analytics/manager-summary'),
    serverApi.get('/memberships'),
    serverApi.get('/checkins/today'),
    serverApi.get('/offers'),
  ]);

  return {
    summary: DashboardSummarySchema.parse(summary),
    members: MembershipSchema.array().parse(members),
    checkins: AnalyticsEventSchema.array().parse(checkins),
    offers: OfferSchema.array().parse(offers),
  };
}

export async function fetchAdminDashboard() {
  const [gyms, managers, featured, analytics, health] = await Promise.all([
    serverApi.get('/gyms'),
    serverApi.get('/users?role=MANAGER'),
    serverApi.get('/featured/pending'),
    serverApi.get('/analytics/global'),
    serverApi.get('/health'),
  ]);

  return {
    gyms: GymSchema.array().parse(gyms),
    managers: UserSchema.array().parse(managers),
    featured: FeaturedContentSchema.array().parse(featured),
    analytics: AnalyticsEventSchema.array().parse(analytics),
    health: SystemHealthSchema.parse(health),
  };
}

export async function fetchFeaturedContent() {
  const response = await serverApi.get('/featured');
  return FeaturedContentSchema.array().parse(response);
}
