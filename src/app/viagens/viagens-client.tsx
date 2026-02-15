'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Trip, TripMember } from '@/lib/data';

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

const PEOPLE = ['Todos', 'Lars', 'Andrea', 'Laura', 'Antonio', 'Henrique'];

function getMonthLabel(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
}

function getMonthNum(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').getMonth();
}

function statusBadge(status: string) {
  switch (status) {
    case 'completed': return { label: '✅ Concluída', cls: 'bg-gray-200 text-gray-600' };
    case 'upcoming': return { label: '🟢 Próxima', cls: 'bg-[var(--color-accent)] text-[var(--color-navy-dark)]' };
    case 'planned': return { label: '📋 Planejada', cls: 'bg-blue-100 text-blue-700' };
    default: return { label: status, cls: 'bg-gray-100 text-gray-600' };
  }
}

interface Props {
  trips: Trip[];
  allMembers: TripMember[];
  extrasMap: Record<string, { flightCount: number; hotelCount: number; computedStatus: string }>;
}

function ViagensContent({ trips, allMembers, extrasMap }: Props) {
  const searchParams = useSearchParams();
  const pessoaParam = searchParams.get('pessoa');

  const initialPerson = pessoaParam
    ? PEOPLE.find(p => p.toLowerCase() === pessoaParam.toLowerCase()) || 'Todos'
    : 'Todos';

  const [personFilter, setPersonFilter] = useState(initialPerson);
  const [monthFilter, setMonthFilter] = useState('all');

  useEffect(() => {
    if (pessoaParam) {
      const match = PEOPLE.find(p => p.toLowerCase() === pessoaParam.toLowerCase());
      if (match) setPersonFilter(match);
    }
  }, [pessoaParam]);

  // Build months from trips
  const allMonths = Array.from(new Set(
    trips.flatMap(t => [
      `${getMonthNum(t.start_date)}-${getMonthLabel(t.start_date)}`,
      `${getMonthNum(t.end_date)}-${getMonthLabel(t.end_date)}`,
    ])
  )).sort((a, b) => parseInt(a) - parseInt(b));

  const MONTHS = [{ value: 'all', label: 'Todos' }, ...allMonths.map(m => {
    const [num, label] = m.split('-');
    return { value: num, label: label.charAt(0).toUpperCase() + label.slice(1) };
  })];

  const getMembersForTrip = (tripId: string) => allMembers.filter(m => m.trip_id === tripId);

  const filtered = trips.filter(trip => {
    if (personFilter !== 'Todos') {
      const members = getMembersForTrip(trip.id);
      const memberNames = members.flatMap(m => m.member_name.split(' & '));
      if (!memberNames.some(n => n.trim() === personFilter)) return false;
    }
    if (monthFilter !== 'all') {
      const startMonth = getMonthNum(trip.start_date);
      const endMonth = getMonthNum(trip.end_date);
      const filterMonth = parseInt(monthFilter);
      if (filterMonth < startMonth || filterMonth > endMonth) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="bg-[var(--color-navy)] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">✈️ Viagens da Família</h1>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-3">
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide mr-3">Pessoa</span>
            <div className="inline-flex flex-wrap gap-2">
              {PEOPLE.map(p => (
                <button
                  key={p}
                  onClick={() => setPersonFilter(p)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    personFilter === p
                      ? 'bg-[var(--color-navy)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wide mr-3">Mês</span>
            <div className="inline-flex flex-wrap gap-2">
              {MONTHS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setMonthFilter(m.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    monthFilter === m.value
                      ? 'bg-[var(--color-navy)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((trip) => {
            const members = getMembersForTrip(trip.id);
            const extras = extrasMap[trip.id] || { flightCount: 0, hotelCount: 0, computedStatus: 'upcoming' };
            const badge = statusBadge(extras.computedStatus);
            const isCompleted = extras.computedStatus === 'completed';

            return (
              <Link key={trip.id} href={`/viagens/${trip.id}`}>
                <div className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 cursor-pointer ${isCompleted ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-bold text-[var(--color-navy)]">{trip.name}</h2>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">📍 {trip.destination}</p>
                  <p className="text-gray-600 text-sm mb-4">📅 {formatDate(trip.start_date)} — {formatDate(trip.end_date)}</p>
                  <div className="flex gap-2 flex-wrap text-sm text-gray-500">
                    👥{' '}
                    {members.map((m, i) => (
                      <span key={m.id}>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPersonFilter(m.member_name); }}
                          className="text-[var(--color-navy)] hover:underline font-medium"
                        >
                          {m.member_name}
                        </button>
                        {i < members.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-gray-400">
                    <span>✈️ {extras.flightCount} voo{extras.flightCount !== 1 ? 's' : ''}</span>
                    <span>🏨 {extras.hotelCount} {extras.hotelCount !== 1 ? 'hotéis' : 'hotel'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-12">Nenhuma viagem encontrada com esses filtros.</p>
        )}
      </main>
    </div>
  );
}

export default function ViagensClient(props: Props) {
  return (
    <Suspense>
      <ViagensContent {...props} />
    </Suspense>
  );
}
