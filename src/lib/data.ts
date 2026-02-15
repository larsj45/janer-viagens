import { supabase } from './supabase';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed' | 'planned';
  notes: string;
}

export interface TripMember {
  id: string;
  trip_id: string;
  member_name: string;
  role: string;
}

export interface Flight {
  id: string;
  trip_id: string;
  member_name: string;
  airline: string;
  flight_number: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  confirmation_code: string;
  cabin_class: string;
  notes: string;
}

export interface Accommodation {
  id: string;
  trip_id: string;
  name: string;
  address: string;
  check_in: string;
  check_out: string;
  confirmation_code: string;
  notes: string;
}

export function getTripStatus(start_date: string, end_date: string): Trip['status'] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(start_date + 'T00:00:00');
  const end = new Date(end_date + 'T23:59:59');
  if (today > end) return 'completed';
  if (today >= start && today <= end) return 'active';
  return 'upcoming';
}

export async function getAllTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('start_date', { ascending: true });
  if (error) throw error;
  return data as Trip[];
}

export async function getAllTripMembers(): Promise<TripMember[]> {
  const { data, error } = await supabase
    .from('trip_members')
    .select('*');
  if (error) throw error;
  return data as TripMember[];
}

export async function getTrip(id: string): Promise<Trip | undefined> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return undefined;
  return data as Trip;
}

export async function getTripMembers(tripId: string): Promise<TripMember[]> {
  const { data, error } = await supabase
    .from('trip_members')
    .select('*')
    .eq('trip_id', tripId);
  if (error) throw error;
  return data as TripMember[];
}

export async function getTripFlights(tripId: string): Promise<Flight[]> {
  const { data, error } = await supabase
    .from('flights')
    .select('*')
    .eq('trip_id', tripId)
    .order('departure_time', { ascending: true });
  if (error) throw error;
  return data as Flight[];
}

export async function getTripAccommodations(tripId: string): Promise<Accommodation[]> {
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('trip_id', tripId)
    .order('check_in', { ascending: true });
  if (error) throw error;
  return data as Accommodation[];
}
