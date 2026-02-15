import { getAllTrips, getAllTripMembers, getTripFlights, getTripAccommodations, getTripStatus } from '@/lib/data';
import type { Trip, TripMember } from '@/lib/data';
import ViagensClient from './viagens-client';

export const dynamic = 'force-dynamic';

export default async function ViagensPage() {
  const [trips, allMembers] = await Promise.all([
    getAllTrips(),
    getAllTripMembers(),
  ]);

  // Pre-fetch flight/accommodation counts for each trip
  const tripExtras = await Promise.all(
    trips.map(async (trip) => {
      const [flights, accommodations] = await Promise.all([
        getTripFlights(trip.id),
        getTripAccommodations(trip.id),
      ]);
      return {
        tripId: trip.id,
        flightCount: flights.length,
        hotelCount: accommodations.length,
        computedStatus: getTripStatus(trip.start_date, trip.end_date),
      };
    })
  );

  const extrasMap: Record<string, { flightCount: number; hotelCount: number; computedStatus: string }> = {};
  for (const e of tripExtras) {
    extrasMap[e.tripId] = e;
  }

  return <ViagensClient trips={trips} allMembers={allMembers} extrasMap={extrasMap} />;
}
