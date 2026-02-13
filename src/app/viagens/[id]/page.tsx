import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTrip, getTripMembers, getTripFlights, getTripAccommodations } from '@/lib/data';

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(d: string) {
  if (d.includes('T')) {
    const dt = new Date(d);
    return dt.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) + ' ' + dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  return formatDate(d);
}

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = getTrip(id);
  if (!trip) notFound();

  const members = getTripMembers(id);
  const tripFlights = getTripFlights(id);
  const hotels = getTripAccommodations(id);

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
                <p className="text-xs text-gray-400 mt-1">👤 {f.member_name}</p>
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
