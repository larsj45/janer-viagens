import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getTrip, getTripMembers, getTripFlights, getTripAccommodations } from '@/lib/data';

export const dynamic = 'force-dynamic';

const PEOPLE = ['lars', 'andrea', 'laura', 'antonio', 'henrique'];

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getAirlineLink(airline: string, confirmationCode?: string): { url: string; label: string } | null {
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
    const dt = new Date(d);
    return dt.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', timeZone: 'America/Sao_Paulo' }) + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
  }
  return formatDate(d);
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
          <div className="space-y-3">
            {tripFlights.map((f) => (
              <div key={f.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
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
                  {(() => {
                    const link = getAirlineLink(f.airline, f.confirmation_code);
                    return link ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-navy-dark)] font-medium px-3 py-1 rounded-lg transition-colors"
                      >
                        🔗 {link.label}
                      </a>
                    ) : null;
                  })()}
                </div>
              </div>
            ))}
          </div>
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
