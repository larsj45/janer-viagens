-- Janér Viagens — Supabase Schema
-- Run this in the Supabase SQL Editor when ready

CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
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

-- Seed data
INSERT INTO trips (id, name, destination, start_date, end_date, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NYC + Austin — Mar 2026', 'New York & Austin, EUA', '2026-03-06', '2026-03-23', 'upcoming'),
  ('00000000-0000-0000-0000-000000000002', 'Henrique Páscoa — Mar/Abr 2026', 'São Paulo, Brasil', '2026-03-27', '2026-04-05', 'upcoming');

INSERT INTO trip_members (trip_id, member_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Lars', 'organizador'),
  ('00000000-0000-0000-0000-000000000001', 'Andrea', 'viajante'),
  ('00000000-0000-0000-0000-000000000002', 'Henrique', 'viajante');

INSERT INTO flights (trip_id, member_name, airline, flight_number, origin, destination, departure_time, confirmation_code, notes) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Lars & Andrea', 'Delta', 'DL226', 'GRU', 'JFK', '2026-03-06', '', 'Ida — São Paulo → Nova York'),
  ('00000000-0000-0000-0000-000000000001', 'Lars & Andrea', 'Delta', 'DL2323', 'JFK', 'AUS', '2026-03-10', '', 'Nova York → Austin'),
  ('00000000-0000-0000-0000-000000000001', 'Lars & Andrea', 'Delta', 'DL2323', 'AUS', 'JFK', '2026-03-18', '', 'Austin → Nova York'),
  ('00000000-0000-0000-0000-000000000001', 'Lars & Andrea', 'Delta', 'DL227', 'JFK', 'GRU', '2026-03-23', '', 'Volta — Nova York → São Paulo'),
  ('00000000-0000-0000-0000-000000000002', 'Henrique', 'Air Europa', 'UX57', 'MAD', 'GRU', '2026-03-27 23:55', '8WX5KD', 'NOBAG'),
  ('00000000-0000-0000-0000-000000000002', 'Henrique', 'Air Europa', 'UX58', 'GRU', 'MAD', '2026-04-05 13:50', '8WX5KD', 'NOBAG');

INSERT INTO accommodations (trip_id, name, address, check_in, check_out, confirmation_code, notes) VALUES
  ('00000000-0000-0000-0000-000000000001', 'AKA NoMad', 'New York, NY', '2026-03-07', '2026-03-10', '5720645716', 'Primeira estadia NYC'),
  ('00000000-0000-0000-0000-000000000001', 'Renaissance Chelsea', 'New York, NY', '2026-03-07', '2026-03-10', '5034281826', ''),
  ('00000000-0000-0000-0000-000000000001', 'AKA NoMad', 'New York, NY', '2026-03-18', '2026-03-23', '6694665376', 'Segunda estadia NYC (pós-Austin)');
