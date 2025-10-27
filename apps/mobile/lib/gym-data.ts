import { api } from './api';
import { DashboardSummarySchema } from '@nakshatra/types';

export async function fetchGymDashboard() {
  const response = await api.get('/analytics/manager-summary');
  return DashboardSummarySchema.parse(response);
}
