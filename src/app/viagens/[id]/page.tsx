import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getTrip, getTripMembers, getTripFlights, getTripAccommodations } from '@/lib/data';
import type { Flight } from '@/lib/data';

export const dynamic = 'force-dynamic';

const PEOPLE = ['lars', 'andrea', 'laura', 'antonio', 'henrique'];

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getAirlineLink(airline: string): { url: string; label: string } | null {
  const a = airline.toLowerCase();
  if (a.includes('delta')) return { url: 'https://www.delta.com/mytrips/', label: 'Delta — Minhas Viagens' };
  if (a.includes('latam')) return { url: 'https://www.latamairlines.com/br/pt/minhas-viagens', label: 'LATAM — Minhas Viagens' };
  if (a.includes('gol')) return { url: 'https://www.voegol.com.br/minhas-viagens', label: 'Gol — Minhas Viagens' };
  if (a.includes('air europa')) return { url: 'https://www.aireuropa.com/br/pt/voos/gere-a-tua-reserva', label: 'Air Europa — Gere sua Reserva' };
  if (a.includes('qatar')) return { url: 'https://www.qatarairways.com/en/manage-booking.html', label: 'Qatar — Manage Booking' };
  if (a.includes('american')) return { url: 'https://www.aa.com/reservation/view/find-your-trip', label: 'American — Find Your Trip' };
  if (a.includes('azul')) return { url: 'https://www.voeazul.com.br/minhas-viagens', label: 'Azul — Minhas Viagens' };
  return null;
}

function formatDateTime(d: string) {
  if (d.includes('T')) {
    // Strip timezone offset — flight times are always local to departure airport
    const local = d.replace(/[+-]\d{2}:\d{2}$/, '').replace(/Z$/, '');
    const [datePart, timePart] = local.split('T');
    const [, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    const monthName = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][month - 1];
    return `${day} de ${monthName} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }
  return formatDate(d);
}

// Date-only (YYYY-MM-DD) of a flight's local departure, for past/future comparison.
function flightDateStr(d: string): string {
  if (!d) return '';
  const local = d.replace(/[+-]\d{2}:\d{2}$/, '').replace(/Z$/, '');
  return local.split('T')[0];
}

function todayStr(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

// Past = departed on a date strictly before today. Flights without a date are
// treated as upcoming (never hidden).
function isPastFlight(f: Flight): boolean {
  const ds = flightDateStr(f.departure_time);
  return ds !== '' && ds < todayStr();
}

function FlightCard({ f }: { f: Flight }) {
  const link = getAirlineLink(f.airline);
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--color-navy)]">{f.flight_number}</span>
          <span className="text-gray-400 text-sm">{f.airline}</span>
        </div>
        {f.confirmation_code && (
          <span className="bg-gray-100 text-gray-600 text-xs font-mono px-2 py-1 rounded">
            {f.confirmation_code}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-gray-700">{f.origin}</span>
        <span className="text-gray-300">→</span>
        <span className="font-semibold text-gray-700">{f.destination}</span>
        <span className="text-gray-400 ml-auto">{formatDateTime(f.departure_time)}</span>
      </div>
      {f.notes && (
        <p className="text-xs text-gray-400 mt-2">{f.notes}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-gray-400">👤 {f.member_name}</p>
        {link ? (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-navy-dark)] font-medium px-3 py-1 rounded-lg transition-colors"
          >
            🔗 {link.label}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Support /viagens/laura, /viagens/andrea, etc. → redirect to filtered list
  if (PEOPLE.includes(id.toLowerCase())) {
    redirect(`/viagens?pessoa=${id.toLowerCase()}`);
  }
  
  const trip = await getTrip(id);
  if (!trip) notFound();

  const [members, tripFlights, hotels] = await Promise.all([
    getTripMembers(id),
    getTripFlights(id),
    getTripAccommodations(id),
  ]);

  // Split flown vs upcoming. Collapse the flown ones only when there is still a
  // flight to come — for a fully completed trip, show everything (that's when
  // you open it to look back).
  const pastFlights = tripFlights.filter(isPastFlight);
  const upcomingFlights = tripFlights.filter((f) => !isPastFlight(f));
  const collapsePast = upcomingFlights.length > 0 && pastFlights.length > 0;
  const visibleFlights = collapsePast ? upcomingFlights : tripFlights;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="bg-[var(--color-navy)] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/viagens" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold">{trip.name}</h1>
          <p className="text-blue-200 text-sm mt-1">
            📍 {trip.destination} · 📅 {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Members */}
        <section>
          <h2 className="text-lg font-bold text-[var(--color-navy)] mb-4">👥 Viajantes</h2>
          <div className="flex gap-3 flex-wrap">
            {members.map((m) => (
              <div key={m.id} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
                <span className="font-medium text-[var(--color-navy)]">{m.member_name}</span>
                <span className="text-gray-400 text-sm ml-2">{m.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Flights */}
        <section>
          <h2 className="text-lg font-bold text-[var(--color-navy)] mb-4">✈️ Voos</h2>
          {collapsePast && (
            <details className="mb-3 group">
              <summary className="cursor-pointer list-none text-sm text-gray-400 hover:text-gray-600 select-none">
                <span className="inline-block transition-transform group-open:rotate-90">▸</span>{' '}
                Ver {pastFlights.length} voo{pastFlights.length !== 1 ? 's' : ''} anterior{pastFlights.length !== 1 ? 'es' : ''}
              </summary>
              <div className="space-y-3 mt-3 opacity-60">
                {pastFlights.map((f) => (
                  <FlightCard key={f.id} f={f} />
                ))}
              </div>
            </details>
          )}
          <div className="space-y-3">
            {visibleFlights.map((f) => (
              <FlightCard key={f.id} f={f} />
            ))}
          </div>
          {visibleFlights.length === 0 && (
            <p className="text-sm text-gray-400">Nenhum voo cadastrado.</p>
          )}
        </section>

        {/* Hotels */}
        {hotels.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-[var(--color-navy)] mb-4">🏨 Hospedagem</h2>
            <div className="space-y-3">
              {hotels.map((h) => (
                <div key={h.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[var(--color-navy)]">{h.name}</span>
                    {h.confirmation_code && (
                      <span className="bg-gray-100 text-gray-600 text-xs font-mono px-2 py-1 rounded">
                        {h.confirmation_code}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{h.address}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    📅 {formatDate(h.check_in)} — {formatDate(h.check_out)}
                  </p>
                  {h.notes && (
                    <p className="text-xs text-gray-400 mt-2">{h.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
