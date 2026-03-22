import { getAllTrips, getAllTripMembers } from '@/lib/data';
import CalendarioClient from './calendario-client';

export const dynamic = 'force-dynamic';

export default async function CalendarioPage() {
  const [trips, allMembers] = await Promise.all([
    getAllTrips(),
    getAllTripMembers(),
  ]);

  return <CalendarioClient trips={trips} allMembers={allMembers} />;
}
