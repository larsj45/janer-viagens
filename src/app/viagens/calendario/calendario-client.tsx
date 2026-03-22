'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Trip, TripMember } from '@/lib/data';

const MEMBER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Lars:     { bg: 'bg-blue-100',    text: 'text-blue-800',    border: 'border-blue-400' },
  Andrea:   { bg: 'bg-rose-100',    text: 'text-rose-800',    border: 'border-rose-400' },
  Laura:    { bg: 'bg-purple-100',  text: 'text-purple-800',  border: 'border-purple-400' },
  Antonio:  { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-400' },
  Henrique: { bg: 'bg-amber-100',   text: 'text-amber-800',   border: 'border-amber-400' },
};

const MEMBER_DOT_COLORS: Record<string, string> = {
  Lars: 'bg-blue-500',
  Andrea: 'bg-rose-500',
  Laura: 'bg-purple-500',
  Antonio: 'bg-emerald-500',
  Henrique: 'bg-amber-500',
};

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function dateToKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDate(s: string): Date {
  return new Date(s + 'T12:00:00');
}

interface TripEvent {
  trip: Trip;
  members: string[];
}

interface DayData {
  date: Date;
  key: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: TripEvent[];
}

interface Props {
  trips: Trip[];
  allMembers: TripMember[];
}

export default function CalendarioClient({ trips, allMembers }: Props) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [memberFilter, setMemberFilter] = useState<string>('Todos');

  const allMemberNames = useMemo(() => {
    const names = new Set<string>();
    allMembers.forEach((m) => {
      m.member_name.split(' & ').forEach((n) => names.add(n.trim()));
    });
    return Array.from(names).sort();
  }, [allMembers]);

  // Build a map: dateKey -> TripEvent[]
  const eventMap = useMemo(() => {
    const map: Record<string, TripEvent[]> = {};

    for (const trip of trips) {
      const members = allMembers
        .filter((m) => m.trip_id === trip.id)
        .flatMap((m) => m.member_name.split(' & ').map((n) => n.trim()));

      const start = parseDate(trip.start_date);
      const end = parseDate(trip.end_date);
      const cursor = new Date(start);

      while (cursor <= end) {
        const key = dateToKey(cursor);
        if (!map[key]) map[key] = [];
        map[key].push({ trip, members });
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    return map;
  }, [trips, allMembers]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startPad = firstDay.getDay(); // 0=Sun
    const days: DayData[] = [];

    // Previous month padding
    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth, -i);
      const key = dateToKey(d);
      days.push({
        date: d,
        key,
        isCurrentMonth: false,
        isToday: false,
        events: eventMap[key] || [],
      });
    }

    // Current month days
    const todayKey = dateToKey(today);
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const d = new Date(currentYear, currentMonth, day);
      const key = dateToKey(d);
      days.push({
        date: d,
        key,
        isCurrentMonth: true,
        isToday: key === todayKey,
        events: eventMap[key] || [],
      });
    }

    // Next month padding (fill to complete last week)
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(currentYear, currentMonth + 1, i);
        const key = dateToKey(d);
        days.push({
          date: d,
          key,
          isCurrentMonth: false,
          isToday: false,
          events: eventMap[key] || [],
        });
      }
    }

    return days;
  }, [currentYear, currentMonth, eventMap, today]);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  }

  function goToday() {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(null);
  }

  // Filter events by member
  function filterEvents(events: TripEvent[]): TripEvent[] {
    if (memberFilter === 'Todos') return events;
    return events.filter((e) => e.members.includes(memberFilter));
  }

  // Get unique members traveling on a day
  function getDayMembers(events: TripEvent[]): string[] {
    const members = new Set<string>();
    for (const e of filterEvents(events)) {
      e.members.forEach((m) => members.add(m));
    }
    return Array.from(members);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b" style={{ background: 'var(--color-navy)', borderColor: 'var(--color-navy-dark)' }}>
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/viagens" className="text-white/70 hover:text-white text-sm">
              ← Viagens
            </Link>
            <h1 className="text-lg font-bold text-white">Calendário</h1>
          </div>
          <span className="text-2xl">🦅</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Legend + filter */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setMemberFilter('Todos')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              memberFilter === 'Todos'
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={memberFilter === 'Todos' ? { background: 'var(--color-navy)' } : {}}
          >
            Todos
          </button>
          {allMemberNames.map((name) => {
            const colors = MEMBER_COLORS[name] || { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-400' };
            const isActive = memberFilter === name;
            return (
              <button
                key={name}
                onClick={() => setMemberFilter(name)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isActive
                    ? `${colors.bg} ${colors.text} ring-2 ring-offset-1 ${colors.border.replace('border-', 'ring-')}`
                    : `${colors.bg} ${colors.text} opacity-70 hover:opacity-100`
                }`}
              >
                <span className={`inline-block h-2 w-2 rounded-full ${MEMBER_DOT_COLORS[name] || 'bg-gray-500'}`} />
                {name}
              </button>
            );
          })}
        </div>

        {/* Month navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button onClick={prevMonth} className="rounded-lg p-2 hover:bg-gray-100 text-lg">
            ‹
          </button>
          <div className="text-center">
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-navy)' }}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>
            <button onClick={goToday} className="text-xs text-gray-500 hover:text-gray-800 mt-0.5">
              Hoje
            </button>
          </div>
          <button onClick={nextMonth} className="rounded-lg p-2 hover:bg-gray-100 text-lg">
            ›
          </button>
        </div>

        {/* Calendar grid */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const dayMembers = getDayMembers(day.events);
              const filteredEvents = filterEvents(day.events);
              const hasEvents = filteredEvents.length > 0;

              return (
                <button
                  key={day.key}
                  onClick={() => hasEvents ? setSelectedDay(day) : setSelectedDay(null)}
                  className={`relative min-h-[72px] sm:min-h-[90px] border-b border-r border-gray-50 p-1 text-left transition-colors ${
                    day.isCurrentMonth ? '' : 'bg-gray-50/50'
                  } ${hasEvents ? 'cursor-pointer hover:bg-blue-50/50' : 'cursor-default'} ${
                    selectedDay?.key === day.key ? 'bg-blue-50 ring-2 ring-blue-300 ring-inset' : ''
                  }`}
                >
                  {/* Day number */}
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      day.isToday
                        ? 'text-white font-bold'
                        : day.isCurrentMonth
                          ? 'text-gray-700'
                          : 'text-gray-300'
                    }`}
                    style={day.isToday ? { background: 'var(--color-navy)' } : {}}
                  >
                    {day.date.getDate()}
                  </span>

                  {/* Member dots */}
                  {dayMembers.length > 0 && (
                    <div className="mt-0.5 flex flex-wrap gap-0.5">
                      {dayMembers.map((name) => (
                        <span
                          key={name}
                          className={`inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${MEMBER_DOT_COLORS[name] || 'bg-gray-400'}`}
                          title={name}
                        />
                      ))}
                    </div>
                  )}

                  {/* Trip labels (desktop only) */}
                  <div className="hidden sm:block mt-0.5 space-y-0.5 overflow-hidden">
                    {filteredEvents.slice(0, 2).map((evt, i) => {
                      const color = evt.members[0] ? MEMBER_COLORS[evt.members[0]] : null;
                      return (
                        <div
                          key={`${evt.trip.id}-${i}`}
                          className={`truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight ${
                            color ? `${color.bg} ${color.text}` : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {evt.trip.destination}
                        </div>
                      );
                    })}
                    {filteredEvents.length > 2 && (
                      <div className="text-[10px] text-gray-400 px-1">+{filteredEvents.length - 2}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day detail */}
        {selectedDay && filterEvents(selectedDay.events).length > 0 && (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              {selectedDay.date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h3>
            <div className="space-y-3">
              {/* Deduplicate trips */}
              {Array.from(
                new Map(
                  filterEvents(selectedDay.events).map((e) => [e.trip.id, e])
                ).values()
              ).map((evt) => (
                <Link
                  key={evt.trip.id}
                  href={`/viagens/${evt.trip.id}`}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col gap-1 mt-0.5">
                    {evt.members.map((name) => (
                      <span
                        key={name}
                        className={`inline-block h-3 w-3 rounded-full ${MEMBER_DOT_COLORS[name] || 'bg-gray-400'}`}
                        title={name}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{evt.trip.destination}</p>
                    <p className="text-xs text-gray-500">{evt.trip.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(evt.trip.start_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                      {' → '}
                      {new Date(evt.trip.end_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {evt.members.map((name) => {
                        const c = MEMBER_COLORS[name] || { bg: 'bg-gray-100', text: 'text-gray-600' };
                        return (
                          <span key={name} className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${c.bg} ${c.text}`}>
                            {name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
