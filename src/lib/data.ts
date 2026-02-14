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

export const trips: Trip[] = [
  {
    id: '3',
    name: 'Rio de Janeiro — Fev 2026',
    destination: 'Rio de Janeiro, Brasil',
    start_date: '2026-02-05',
    end_date: '2026-02-09',
    status: 'completed',
    notes: '',
  },
  {
    id: '5',
    name: 'Floripa Carnaval — Fev 2026',
    destination: 'Florianópolis, Brasil',
    start_date: '2026-02-16',
    end_date: '2026-02-22',
    status: 'upcoming',
    notes: 'Casa dos sogros em Jurerê',
  },
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
  {
    id: '4',
    name: 'Madrid → São Paulo — Mai 2026',
    destination: 'Madrid → São Paulo',
    start_date: '2026-05-08',
    end_date: '2026-05-23',
    status: 'planned',
    notes: 'Volta de Antonio e Henrique da Espanha',
  },
  {
    id: '7',
    name: 'Laura em SP — Abr 2026',
    destination: 'São Paulo, Brasil',
    start_date: '2026-04-03',
    end_date: '2026-04-15',
    status: 'upcoming',
    notes: 'Delta direto JFK↔GRU. Confirmação: JKZVAP. eTicket: #0062404938031',
  },
  {
    id: '6',
    name: 'China Oxygen Journeys — Mai 2026',
    destination: 'Beijing → Shanghai → Suzhou → Hong Kong → Shenzhen',
    start_date: '2026-05-14',
    end_date: '2026-05-28',
    status: 'planned',
    notes: '⚠️ Docs: Visto chinês + Certificado Febre Amarela. Roteiro: Beijing → Shanghai → Suzhou → Hong Kong → Shenzhen',
  },
];

export const tripMembers: TripMember[] = [
  { id: '1', trip_id: '1', member_name: 'Lars', role: 'organizador' },
  { id: '2', trip_id: '1', member_name: 'Andrea', role: 'viajante' },
  { id: '3', trip_id: '2', member_name: 'Henrique', role: 'viajante' },
  { id: '4', trip_id: '3', member_name: 'Lars', role: 'viajante' },
  { id: '5', trip_id: '4', member_name: 'Antonio', role: 'viajante' },
  { id: '6', trip_id: '4', member_name: 'Henrique', role: 'viajante' },
  { id: '7', trip_id: '5', member_name: 'Lars', role: 'viajante' },
  { id: '8', trip_id: '5', member_name: 'Andrea', role: 'viajante' },
  { id: '11', trip_id: '7', member_name: 'Laura', role: 'viajante' },
  { id: '9', trip_id: '6', member_name: 'Lars', role: 'viajante' },
  { id: '10', trip_id: '6', member_name: 'Andrea', role: 'viajante' },
];

export const flights: Flight[] = [
  // Trip 3 — Rio de Janeiro
  {
    id: '7', trip_id: '3', member_name: 'Lars',
    airline: 'Gol', flight_number: 'G31052',
    origin: 'CGH', destination: 'SDU',
    departure_time: '2026-02-05T10:40', arrival_time: '2026-02-05T11:40',
    confirmation_code: 'UONMKI', cabin_class: '', notes: 'Ida — São Paulo → Rio',
  },
  {
    id: '16', trip_id: '3', member_name: 'Lars',
    airline: 'Gol', flight_number: 'G31035',
    origin: 'SDU', destination: 'CGH',
    departure_time: '2026-02-09T16:35', arrival_time: '2026-02-09T17:40',
    confirmation_code: 'EQLOWN', cabin_class: '', notes: 'Volta — Rio → São Paulo',
  },
  // Trip 1 — NYC + Austin
  {
    id: '1', trip_id: '1', member_name: 'Lars & Andrea',
    airline: 'Delta', flight_number: 'DL226',
    origin: 'GRU', destination: 'JFK',
    departure_time: '2026-03-06T21:00', arrival_time: '2026-03-07T05:00',
    confirmation_code: 'JL2ITR / JMGSUO', cabin_class: '', notes: 'Ida — São Paulo → Nova York',
  },
  {
    id: '2', trip_id: '1', member_name: 'Lars & Andrea',
    airline: 'Delta', flight_number: 'DL2323',
    origin: 'JFK', destination: 'AUS',
    departure_time: '2026-03-10T13:10', arrival_time: '2026-03-10T16:45',
    confirmation_code: 'F9A4B4 / GHBYQK', cabin_class: '', notes: 'Nova York → Austin',
  },
  {
    id: '3', trip_id: '1', member_name: 'Lars & Andrea',
    airline: 'Delta', flight_number: 'DL2323',
    origin: 'AUS', destination: 'JFK',
    departure_time: '2026-03-18T17:59', arrival_time: '2026-03-18T22:48',
    confirmation_code: 'F9A4B4 / GHBYQK', cabin_class: '', notes: 'Austin → Nova York',
  },
  {
    id: '4', trip_id: '1', member_name: 'Lars & Andrea',
    airline: 'Delta', flight_number: 'DL227',
    origin: 'JFK', destination: 'GRU',
    departure_time: '2026-03-23T23:10', arrival_time: '2026-03-24T09:55',
    confirmation_code: 'JL2ITR / JMGSUO', cabin_class: '', notes: 'Volta — Nova York → São Paulo',
  },
  // Trip 2 — Henrique Páscoa
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
  // Trip 7 — Laura em SP
  {
    id: '17', trip_id: '7', member_name: 'Laura',
    airline: 'Delta', flight_number: 'DL0227',
    origin: 'JFK', destination: 'GRU',
    departure_time: '2026-04-03T21:50', arrival_time: '2026-04-04T08:50',
    confirmation_code: 'JKZVAP', cabin_class: 'Main Classic (T)', notes: 'Nonstop · A330-900neo · Seat 50A · Terminal 4→3',
  },
  {
    id: '18', trip_id: '7', member_name: 'Laura',
    airline: 'Delta', flight_number: 'DL0226',
    origin: 'GRU', destination: 'JFK',
    departure_time: '2026-04-15T20:35', arrival_time: '2026-04-16T05:28',
    confirmation_code: 'JKZVAP', cabin_class: 'Main Classic (T)', notes: 'Nonstop · A330-900neo · Seat 50A · Terminal 3→4',
  },
  // Trip 5 — Floripa Carnaval
  {
    id: '10', trip_id: '5', member_name: 'Lars & Andrea',
    airline: 'LATAM', flight_number: 'LA3080',
    origin: 'CGH', destination: 'FLN',
    departure_time: '2026-02-16T08:30', arrival_time: '2026-02-16T09:40',
    confirmation_code: 'WEVGPP', cabin_class: '', notes: 'Ida — São Paulo → Floripa',
  },
  {
    id: '11', trip_id: '5', member_name: 'Lars & Andrea',
    airline: 'Gol', flight_number: 'G31225',
    origin: 'FLN', destination: 'CGH',
    departure_time: '2026-02-22T18:35', arrival_time: '2026-02-22T19:55',
    confirmation_code: 'ABIJQO', cabin_class: '', notes: 'Volta — Floripa → São Paulo',
  },
  // Trip 6 — China Oxygen
  {
    id: '12', trip_id: '6', member_name: 'Lars & Andrea',
    airline: 'Qatar Airways', flight_number: 'QR774',
    origin: 'GRU', destination: 'DOH',
    departure_time: '2026-05-14T01:20', arrival_time: '2026-05-14T21:40',
    confirmation_code: '8SWPLH / 8SOHUX', cabin_class: 'Business', notes: 'Ida — São Paulo → Doha',
  },
  {
    id: '13', trip_id: '6', member_name: 'Lars & Andrea',
    airline: 'Qatar Airways', flight_number: 'QR892',
    origin: 'DOH', destination: 'PKX',
    departure_time: '2026-05-15T02:10', arrival_time: '2026-05-15T15:00',
    confirmation_code: '8SWPLH / 8SOHUX', cabin_class: 'Business', notes: 'Doha → Beijing',
  },
  {
    id: '14', trip_id: '6', member_name: 'Lars & Andrea',
    airline: 'Qatar Airways', flight_number: 'QR815',
    origin: 'HKG', destination: 'DOH',
    departure_time: '2026-05-28T00:55', arrival_time: '2026-05-28T04:05',
    confirmation_code: '8SWPLH / 8SOHUX', cabin_class: 'Business', notes: 'Hong Kong → Doha',
  },
  {
    id: '15', trip_id: '6', member_name: 'Lars & Andrea',
    airline: 'Qatar Airways', flight_number: 'QR773',
    origin: 'DOH', destination: 'GRU',
    departure_time: '2026-05-28T07:45', arrival_time: '2026-05-28T16:25',
    confirmation_code: '8SWPLH / 8SOHUX', cabin_class: 'Business', notes: 'Volta — Doha → São Paulo',
  },
  // Trip 4 — Madrid → SP
  {
    id: '8', trip_id: '4', member_name: 'Antonio',
    airline: 'LATAM', flight_number: 'LA8065',
    origin: 'MAD', destination: 'GRU',
    departure_time: '2026-05-08T23:45', arrival_time: '2026-05-09T05:10',
    confirmation_code: 'YQJTKA', cabin_class: '', notes: '',
  },
  {
    id: '9', trip_id: '4', member_name: 'Henrique',
    airline: 'LATAM', flight_number: 'LA8065',
    origin: 'MAD', destination: 'GRU',
    departure_time: '2026-05-22T23:45', arrival_time: '2026-05-23T05:10',
    confirmation_code: 'CWAWLW', cabin_class: '', notes: '',
  },
];

export const accommodations: Accommodation[] = [
  // Trip 3 — Rio
  {
    id: '4', trip_id: '3',
    name: 'Airbnb Baixo Gávea',
    address: 'Baixo Gávea, Rio de Janeiro',
    check_in: '2026-02-05', check_out: '2026-02-09',
    confirmation_code: '', notes: '',
  },
  // Trip 1 — NYC + Austin
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
  // Trip 1 — Austin (SXSW)
  {
    id: '6', trip_id: '1',
    name: 'Thompson Austin',
    address: 'Austin, TX',
    check_in: '2026-03-10', check_out: '2026-03-18',
    confirmation_code: 'Lars Janer (Final)',
    notes: 'King Bed - City View · SXSW Innovation Badge 2026 · $5,690.20',
  },
  // Trip 5 — Floripa
  {
    id: '5', trip_id: '5',
    name: 'Casa dos Sogros',
    address: 'Jurerê, Florianópolis',
    check_in: '2026-02-16', check_out: '2026-02-22',
    confirmation_code: '', notes: 'Casa da família',
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
