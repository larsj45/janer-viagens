import Link from 'next/link';
import { trips, getTripMembers, getTripFlights, getTripAccommodations } from '@/lib/data';

function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
}

export default function ViagensPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="bg-[var(--color-navy)] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">✈️ Janér Viagens</h1>
          <p className="text-blue-200 text-sm mt-1">Nossas próximas aventuras</p>
        </div>
      </header>

      {/* Trip Cards */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {trips.map((trip) => {
            const members = getTripMembers(trip.id);
            const flightCount = getTripFlights(trip.id).length;
            const hotelCount = getTripAccommodations(trip.id).length;

            return (
              <Link key={trip.id} href={`/viagens/${trip.id}`}>
                <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-bold text-[var(--color-navy)]">{trip.name}</h2>
                    <span className="bg-[var(--color-accent)] text-[var(--color-navy-dark)] text-xs font-semibold px-2.5 py-1 rounded-full">
                      {trip.status === 'upcoming' ? 'Em breve' : trip.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4">
                    📍 {trip.destination}
                  </p>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    📅 {formatDate(trip.start_date)} — {formatDate(trip.end_date)}
                  </p>

                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>👥 {members.map(m => m.member_name).join(', ')}</span>
                  </div>

                  <div className="flex gap-4 mt-3 text-xs text-gray-400">
                    <span>✈️ {flightCount} voo{flightCount !== 1 ? 's' : ''}</span>
                    <span>🏨 {hotelCount} hotel{hotelCount !== 1 ? 'éis' : ''}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
