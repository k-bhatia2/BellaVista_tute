import { z } from 'zod';

export const RoleSchema = z.enum(['USER', 'MANAGER', 'ADMIN']);
export type Role = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  phone: z.string().min(8).optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: RoleSchema,
  gymId: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

export const GymSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  amenities: z.array(z.string()),
  managers: z.array(UserSchema.pick({ id: true, firstName: true, lastName: true, email: true })),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Gym = z.infer<typeof GymSchema>;

export const MembershipSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  gymId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']),
  startedAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});
export type Membership = z.infer<typeof MembershipSchema>;

export const CheckInSchema = z.object({
  id: z.string().uuid(),
  membershipId: z.string().uuid(),
  gymId: z.string().uuid(),
  userId: z.string().uuid(),
  timestamp: z.string().datetime(),
  source: z.enum(['WEB', 'MOBILE', 'QR']),
});
export type CheckIn = z.infer<typeof CheckInSchema>;

export const OfferSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  activeFrom: z.string().datetime(),
  activeUntil: z.string().datetime(),
  createdById: z.string().uuid(),
});
export type Offer = z.infer<typeof OfferSchema>;

export const FeaturedContentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  contentUrl: z.string().url(),
  mediaType: z.enum(['ARTICLE', 'VIDEO', 'PODCAST']),
  publishedAt: z.string().datetime(),
  createdById: z.string().uuid(),
});
export type FeaturedContent = z.infer<typeof FeaturedContentSchema>;

export const WorkoutBlockSchema = z.object({
  title: z.string(),
  description: z.string(),
  durationMinutes: z.number().int().nonnegative(),
  equipment: z.array(z.string()),
});

export const WorkoutPlanSchema = z.object({
  id: z.string().uuid(),
  gymId: z.string().uuid(),
  userId: z.string().uuid(),
  day: z.string(),
  blocks: z.array(WorkoutBlockSchema),
  createdAt: z.string().datetime(),
});
export type WorkoutPlan = z.infer<typeof WorkoutPlanSchema>;

export const AnalyticsEventSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['CHECK_IN', 'WORKOUT_START', 'OFFER_VIEW', 'FEATURED_VIEW', 'ERROR']),
  occurredAt: z.string().datetime(),
  payload: z.record(z.any()),
});
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

export const SystemHealthSchema = z.object({
  version: z.string(),
  status: z.enum(['OK', 'DEGRADED', 'DOWN']),
  timestamp: z.string().datetime(),
  dependencies: z.array(
    z.object({
      name: z.string(),
      status: z.enum(['OK', 'DEGRADED', 'DOWN']),
      latencyMs: z.number().nonnegative(),
    }),
  ),
});
export type SystemHealth = z.infer<typeof SystemHealthSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().int(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: RoleSchema.default('USER'),
  gymId: z.string().uuid().optional(),
});
export type SignupRequest = z.infer<typeof SignupRequestSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

export const CheckInEventSchema = z.object({
  checkIn: CheckInSchema,
  gym: GymSchema.pick({ id: true, name: true }),
  user: UserSchema.pick({ id: true, firstName: true, lastName: true }),
});
export type CheckInEvent = z.infer<typeof CheckInEventSchema>;

export const AnnouncementSchema = z.object({
  id: z.string().uuid(),
  message: z.string(),
  level: z.enum(['INFO', 'WARNING', 'CRITICAL']).default('INFO'),
  createdAt: z.string().datetime(),
});
export type Announcement = z.infer<typeof AnnouncementSchema>;

export const PaginatedRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    total: z.number().int().nonnegative(),
  });

export const DashboardSummarySchema = z.object({
  memberships: z.number().int().nonnegative(),
  activeOffers: z.number().int().nonnegative(),
  activeCheckIns: z.number().int().nonnegative(),
  featuredCount: z.number().int().nonnegative(),
});
export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;

export const MobileCheckInRequestSchema = z.object({
  membershipId: z.string().uuid(),
  qrPayload: z.string().optional(),
});
export type MobileCheckInRequest = z.infer<typeof MobileCheckInRequestSchema>;
