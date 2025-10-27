import { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { api } from '@/lib/api';
import { fetchGymDashboard } from '@/lib/gym-data';
import { useRealtime } from '@/hooks/use-realtime';
import { CheckInEventSchema, DashboardSummarySchema } from '@nakshatra/types';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function GymScreen() {
  const [summary, setSummary] = useState(() => DashboardSummarySchema.parse({
    memberships: 0,
    activeOffers: 0,
    activeCheckIns: 0,
    featuredCount: 0,
  }));
  const [scannerOpen, setScannerOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const checkInEvent = useRealtime('check-in');

  useEffect(() => {
    fetchGymDashboard().then(setSummary).catch(console.error);
  }, []);

  useEffect(() => {
    if (!checkInEvent) return;
    const parsed = CheckInEventSchema.safeParse(checkInEvent);
    if (parsed.success) {
      setSummary((current) => ({
        ...current,
        activeCheckIns: current.activeCheckIns + 1,
      }));
    }
  }, [checkInEvent]);

  const handleScan = async ({ data }: { data: string }) => {
    try {
      await api.post('/checkins/qr', { qrPayload: data });
      setScannerOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const requestPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    setScannerOpen(status === 'granted');
  };

  if (scannerOpen && hasPermission) {
    return (
      <View className="flex-1 bg-black">
        <BarCodeScanner style={{ flex: 1 }} onBarCodeScanned={handleScan} />
        <TouchableOpacity className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-white px-6 py-3" onPress={() => setScannerOpen(false)}>
          <Text className="text-base font-semibold text-slate-900">Close scanner</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6 dark:bg-slate-950">
      <View className="rounded-2xl bg-brand-500 p-6 shadow-lg">
        <Text className="text-lg font-semibold text-white">Today&apos;s check-ins</Text>
        <Text className="mt-2 text-4xl font-bold text-white">{summary.activeCheckIns}</Text>
        <TouchableOpacity className="mt-6 self-start rounded-full bg-white/20 px-4 py-2" onPress={requestPermission}>
          <Text className="text-sm font-semibold text-white">Tap to check-in</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6 grid gap-4">
        <StatCard label="Memberships" value={summary.memberships} />
        <StatCard label="Offers" value={summary.activeOffers} />
        <StatCard label="Featured posts" value={summary.featuredCount} />
      </View>
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <View className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
      <Text className="text-sm text-slate-500 dark:text-slate-300">{label}</Text>
      <Text className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</Text>
    </View>
  );
}
