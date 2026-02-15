-- Janér Viagens — Supabase Schema + Full Seed Data
-- Run this in the Supabase SQL Editor

-- Drop existing tables if re-running
DROP TABLE IF EXISTS accommodations CASCADE;
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS trip_members CASCADE;
DROP TABLE IF EXISTS trips CASCADE;

CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'planned')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE trip_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  role TEXT DEFAULT 'viajante'
);

CREATE TABLE flights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_time TIMESTAMPTZ,
  arrival_time TIMESTAMPTZ,
  confirmation_code TEXT DEFAULT '',
  cabin_class TEXT DEFAULT '',
  notes TEXT DEFAULT ''
);

CREATE TABLE accommodations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT DEFAULT '',
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  confirmation_code TEXT DEFAULT '',
  notes TEXT DEFAULT ''
);

-- RLS: Enable with public read access
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read trips" ON trips FOR SELECT USING (true);
CREATE POLICY "Public read trip_members" ON trip_members FOR SELECT USING (true);
CREATE POLICY "Public read flights" ON flights FOR SELECT USING (true);
CREATE POLICY "Public read accommodations" ON accommodations FOR SELECT USING (true);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Trips (UUIDs: 00000000-0000-0000-0000-00000000000X)
INSERT INTO trips (id, name, destination, start_date, end_date, status, notes) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NYC + Austin — Mar 2026', 'New York & Austin, EUA', '2026-03-06', '2026-03-23', 'upcoming', ''),
  ('00000000-0000-0000-0000-000000000002', 'Henrique Páscoa — Mar/Abr 2026', 'São Paulo, Brasil', '2026-03-27', '2026-04-05', 'upcoming', ''),
  ('00000000-0000-0000-0000-000000000003', 'Rio de Janeiro — Fev 2026', 'Rio de Janeiro, Brasil', '2026-02-05', '2026-02-09', 'completed', ''),
  ('00000000-0000-0000-0000-000000000004', 'Madrid → São Paulo — Mai 2026', 'Madrid → São Paulo', '2026-05-08', '2026-05-23', 'planned', 'Volta de Antonio e Henrique da Espanha'),
  ('00000000-0000-0000-0000-000000000005', 'Floripa Carnaval — Fev 2026', 'Florianópolis, Brasil', '2026-02-16', '2026-02-22', 'upcoming', 'Casa dos sogros em Jurerê'),
  ('00000000-0000-0000-0000-000000000006', 'China Oxygen Journeys — Mai 2026', 'Beijing → Shanghai → Suzhou → Hong Kong → Shenzhen', '2026-05-14', '2026-05-28', 'planned', '⚠️ Docs: Visto chinês + Certificado Febre Amarela. Roteiro: Beijing → Shanghai → Suzhou → Hong Kong → Shenzhen'),
  ('00000000-0000-0000-0000-000000000007', 'Laura em SP — Abr 2026', 'São Paulo, Brasil', '2026-04-03', '2026-04-15', 'upcoming', 'Delta direto JFK↔GRU. Confirmação: JKZVAP. eTicket: #0062404938031');

-- Trip Members
INSERT INTO trip_members (trip_id, member_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Lars', 'organizador'),
  ('00000000-0000-0000-0000-000000000001', 'Andrea', 'viajante'),
  ('00000000-0000-0000-0000-000000000002', 'Henrique', 'viajante'),
  ('00000000-0000-0000-0000-000000000003', 'Lars', 'viajante'),
  ('00000000-0000-0000-0000-000000000004', 'Antonio', 'viajante'),
  ('00000000-0000-0000-0000-000000000004', 'Henrique', 'viajante'),
  ('00000000-0000-0000-0000-000000000005', 'Lars', 'viajante'),
  ('00000000-0000-0000-0000-000000000005', 'Andrea', 'viajante'),
  ('00000000-0000-0000-0000-000000000006', 'Lars', 'viajante'),
  ('00000000-0000-0000-0000-000000000006', 'Andrea', 'viajante'),
  ('00000000-0000-0000-0000-000000000007', 'Laura', 'viajante');

-- Flights
INSERT INTO flights (trip_id, member_name, airline, flight_number, origin, destination, departure_time, arrival_time, confirmation_code, cabin_class, notes) VALUES
  -- Trip 3 — Rio de Janeiro
  ('00000000-0000-0000-0000-000000000003', 'Lars', 'Gol', 'G31052', 'CGH', 'SDU', '2026-02-05T10:40:00-03:00', '2026-02-05T11:40:00-03:00', 'UONMKI', '', 'Ida — São Paulo → Rio'),
  ('00000000-0000-0000-0000-000000000003', 'Lars', 'Gol', 'G31035', 'SDU', 'CGH', '2026-02-09T16:35:00-03:00', '2026-02-09T17:40:00-03:00', 'EQLOWN', '', 'Volta — Rio → São Paulo'),
  -- Trip 1 — NYC + Austin
  ('00000000-0000-0000-0000-000000000001', 'Lars & Andrea', 'Delta', 'DL226', 'GRU', 'JFK', '2026-03-06T21:00:00-03:00', '2026-03-07T05:00:00-05:00', 'JL2ITR / JMGSUO', '', 'Ida — São Paulo → Nova York'),
  ('00000000-0000-0000-0000-000000000001', 'Lars & Andrea', 'Delta', 'DL2323', 'JFK', 'AUS', '2026-03-10T13:10:00-05:00', '2026-03-10T16:45:00-06:00', 'F9A4B4 / GHBYQK', '', 'Nova York → Austin'),
  ('00000000-0000-0000-0000-000000000001', 'Lars & Andrea', 'Delta', 'DL2323', 'AUS', 'JFK', '2026-03-18T17:59:00-06:00', '2026-03-18T22:48:00-05:00', 'F9A4B4 / GHBYQK', '', 'Austin → Nova York'),
  ('00000000-0000-0000-0000-000000000001', 'Lars & Andrea', 'Delta', 'DL227', 'JFK', 'GRU', '2026-03-23T23:10:00-05:00', '2026-03-24T09:55:00-03:00', 'JL2ITR / JMGSUO', '', 'Volta — Nova York → São Paulo'),
  -- Trip 2 — Henrique Páscoa
  ('00000000-0000-0000-0000-000000000002', 'Henrique', 'Air Europa', 'UX57', 'MAD', 'GRU', '2026-03-27T23:55:00+01:00', '2026-03-28T06:00:00-03:00', '8WX5KD', '', 'NOBAG'),
  ('00000000-0000-0000-0000-000000000002', 'Henrique', 'Air Europa', 'UX58', 'GRU', 'MAD', '2026-04-05T13:50:00-03:00', '2026-04-06T04:00:00+01:00', '8WX5KD', '', 'NOBAG'),
  ('00000000-0000-0000-0000-000000000002', 'Henrique', 'LATAM', 'LA4620', 'CGH', 'FLN', '2026-03-29T19:20:00-03:00', '2026-03-29T20:35:00-03:00', 'JDDPTO', 'Economy Standard', 'SP→Floripa · LATAM Flex 2 dias'),
  -- Trip 7 — Laura em SP
  ('00000000-0000-0000-0000-000000000007', 'Laura', 'Delta', 'DL0227', 'JFK', 'GRU', '2026-04-03T21:50:00-05:00', '2026-04-04T08:50:00-03:00', 'JKZVAP', 'Main Classic (T)', 'Nonstop · A330-900neo · Seat 50A · Terminal 4→3'),
  ('00000000-0000-0000-0000-000000000007', 'Laura', 'Delta', 'DL0226', 'GRU', 'JFK', '2026-04-15T20:35:00-03:00', '2026-04-16T05:28:00-05:00', 'JKZVAP', 'Main Classic (T)', 'Nonstop · A330-900neo · Seat 50A · Terminal 3→4'),
  -- Trip 5 — Floripa Carnaval
  ('00000000-0000-0000-0000-000000000005', 'Lars & Andrea', 'LATAM', 'LA3080', 'CGH', 'FLN', '2026-02-16T08:30:00-03:00', '2026-02-16T09:40:00-03:00', 'WEVGPP', '', 'Ida — São Paulo → Floripa'),
  ('00000000-0000-0000-0000-000000000005', 'Lars & Andrea', 'Gol', 'G31225', 'FLN', 'CGH', '2026-02-22T18:35:00-03:00', '2026-02-22T19:55:00-03:00', 'ABIJQO', '', 'Volta — Floripa → São Paulo'),
  -- Trip 6 — China Oxygen
  ('00000000-0000-0000-0000-000000000006', 'Lars & Andrea', 'Qatar Airways', 'QR774', 'GRU', 'DOH', '2026-05-14T01:20:00-03:00', '2026-05-14T21:40:00+03:00', '8SWPLH / 8SOHUX', 'Business', 'Ida — São Paulo → Doha'),
  ('00000000-0000-0000-0000-000000000006', 'Lars & Andrea', 'Qatar Airways', 'QR892', 'DOH', 'PKX', '2026-05-15T02:10:00+03:00', '2026-05-15T15:00:00+08:00', '8SWPLH / 8SOHUX', 'Business', 'Doha → Beijing'),
  ('00000000-0000-0000-0000-000000000006', 'Lars & Andrea', 'Qatar Airways', 'QR815', 'HKG', 'DOH', '2026-05-28T00:55:00+08:00', '2026-05-28T04:05:00+03:00', '8SWPLH / 8SOHUX', 'Business', 'Hong Kong → Doha'),
  ('00000000-0000-0000-0000-000000000006', 'Lars & Andrea', 'Qatar Airways', 'QR773', 'DOH', 'GRU', '2026-05-28T07:45:00+03:00', '2026-05-28T16:25:00-03:00', '8SWPLH / 8SOHUX', 'Business', 'Volta — Doha → São Paulo'),
  -- Trip 4 — Madrid → SP
  ('00000000-0000-0000-0000-000000000004', 'Antonio', 'LATAM', 'LA8065', 'MAD', 'GRU', '2026-05-08T23:45:00+01:00', '2026-05-09T05:10:00-03:00', 'YQJTKA', '', ''),
  ('00000000-0000-0000-0000-000000000004', 'Henrique', 'LATAM', 'LA8065', 'MAD', 'GRU', '2026-05-22T23:45:00+01:00', '2026-05-23T05:10:00-03:00', 'CWAWLW', '', '');

-- Accommodations
INSERT INTO accommodations (trip_id, name, address, check_in, check_out, confirmation_code, notes) VALUES
  ('00000000-0000-0000-0000-000000000003', 'Airbnb Baixo Gávea', 'Baixo Gávea, Rio de Janeiro', '2026-02-05', '2026-02-09', '', ''),
  ('00000000-0000-0000-0000-000000000001', 'AKA NoMad', 'New York, NY', '2026-03-07', '2026-03-10', '5720645716', 'Primeira estadia NYC'),
  ('00000000-0000-0000-0000-000000000001', 'Renaissance Chelsea', 'New York, NY', '2026-03-07', '2026-03-10', '5034281826', ''),
  ('00000000-0000-0000-0000-000000000001', 'AKA NoMad', 'New York, NY', '2026-03-18', '2026-03-23', '6694665376', 'Segunda estadia NYC (pós-Austin)'),
  ('00000000-0000-0000-0000-000000000001', 'Thompson Austin', 'Austin, TX', '2026-03-10', '2026-03-18', 'Lars Janer (Final)', 'King Bed - City View · SXSW Innovation Badge 2026'),
  ('00000000-0000-0000-0000-000000000005', 'Casa dos Sogros', 'Jurerê, Florianópolis', '2026-02-16', '2026-02-22', '', 'Casa da família');
