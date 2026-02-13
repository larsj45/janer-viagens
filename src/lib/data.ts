export interface Trip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed';
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

export const trips: Trip[] = [
  {
    id: '1',
    name: 'NYC + Austin — Mar 2026',
    destination: 'New York & Austin, EUA',
    start_date: '2026-03-06',
    end_date: '2026-03-23',
    status: 'upcoming',
    notes: '',
  },
  {
    id: '2',
    name: 'Henrique Páscoa — Mar/Abr 2026',
    destination: 'São Paulo, Brasil',
    start_date: '2026-03-27',
    end_date: '2026-04-05',
    status: 'upcoming',
    notes: '',
  },
];

export const tripMembers: TripMember[] = [
  { id: '1', trip_id: '1', member_name: 'Lars', role: 'organizador' },
  { id: '2', trip_id: '1', member_name: 'Andrea', role: 'viajante' },
  { id: '3', trip_id: '2', member_name: 'Henrique', role: 'viajante' },
];

export const flights: Flight[] = [
  {
    id: '1', trip_id: '1', member_name: 'Lars & Andrea',
    airline: 'Delta', flight_number: 'DL226',
    origin: 'GRU', destination: 'JFK',
    departure_time: '2026-03-06', arrival_time: '2026-03-06',
    confirmation_code: '', cabin_class: '', notes: 'Ida — São Paulo → Nova York',
  },
  {
    id: '2', trip_id: '1', member_name: 'Lars & Andrea',
    airline: 'Delta', flight_number: 'DL2323',
    origin: 'JFK', destination: 'AUS',
    departure_time: '2026-03-10', arrival_time: '2026-03-10',
    confirmation_code: '', cabin_class: '', notes: 'Nova York → Austin',
  },
  {
    id: '3', trip_id: '1', member_name: 'Lars & Andrea',
    airline: 'Delta', flight_number: 'DL2323',
    origin: 'AUS', destination: 'JFK',
    departure_time: '2026-03-18', arrival_time: '2026-03-18',
    confirmation_code: '', cabin_class: '', notes: 'Austin → Nova York',
  },
  {
    id: '4', trip_id: '1', member_name: 'Lars & Andrea',
    airline: 'Delta', flight_number: 'DL227',
    origin: 'JFK', destination: 'GRU',
    departure_time: '2026-03-23', arrival_time: '2026-03-23',
    confirmation_code: '', cabin_class: '', notes: 'Volta — Nova York → São Paulo',
  },
  {
    id: '5', trip_id: '2', member_name: 'Henrique',
    airline: 'Air Europa', flight_number: 'UX57',
    origin: 'MAD', destination: 'GRU',
    departure_time: '2026-03-27T23:55', arrival_time: '2026-03-28',
    confirmation_code: '8WX5KD', cabin_class: '', notes: 'NOBAG',
  },
  {
    id: '6', trip_id: '2', member_name: 'Henrique',
    airline: 'Air Europa', flight_number: 'UX58',
    origin: 'GRU', destination: 'MAD',
    departure_time: '2026-04-05T13:50', arrival_time: '2026-04-05',
    confirmation_code: '8WX5KD', cabin_class: '', notes: 'NOBAG',
  },
];

export const accommodations: Accommodation[] = [
  {
    id: '1', trip_id: '1',
    name: 'AKA NoMad',
    address: 'New York, NY',
    check_in: '2026-03-07', check_out: '2026-03-10',
    confirmation_code: '5720645716', notes: 'Primeira estadia NYC',
  },
  {
    id: '2', trip_id: '1',
    name: 'Renaissance Chelsea',
    address: 'New York, NY',
    check_in: '2026-03-07', check_out: '2026-03-10',
    confirmation_code: '5034281826', notes: '',
  },
  {
    id: '3', trip_id: '1',
    name: 'AKA NoMad',
    address: 'New York, NY',
    check_in: '2026-03-18', check_out: '2026-03-23',
    confirmation_code: '6694665376', notes: 'Segunda estadia NYC (pós-Austin)',
  },
];

export function getTrip(id: string) {
  return trips.find(t => t.id === id);
}

export function getTripMembers(tripId: string) {
  return tripMembers.filter(m => m.trip_id === tripId);
}

export function getTripFlights(tripId: string) {
  return flights.filter(f => f.trip_id === tripId);
}

export function getTripAccommodations(tripId: string) {
  return accommodations.filter(a => a.trip_id === tripId);
}
