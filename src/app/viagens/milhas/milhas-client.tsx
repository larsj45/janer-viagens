'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { LoyaltyAccount } from '@/lib/data';

const PEOPLE = ['Todos', 'Lars', 'Andrea', 'Laura', 'Antonio', 'Henrique'];

const CATEGORIES: { key: LoyaltyAccount['category']; label: string; icon: string }[] = [
  { key: 'aerea', label: 'Aéreas', icon: '✈️' },
  { key: 'hotel', label: 'Hotéis', icon: '🏨' },
  { key: 'locadora', label: 'Locadoras', icon: '🚗' },
  { key: 'pontos', label: 'Pontos / Cartões', icon: '💳' },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        });
      }}
      className="ml-2 shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500 hover:bg-gray-200 transition-colors"
      title="Copiar número"
    >
      {copied ? '✓ copiado' : 'copiar'}
    </button>
  );
}

interface Props {
  accounts: LoyaltyAccount[];
}

export default function MilhasClient({ accounts }: Props) {
  const [personFilter, setPersonFilter] = useState('Todos');

  const people = personFilter === 'Todos'
    ? PEOPLE.slice(1)
    : [personFilter];

  // Keep only people who actually have accounts, plus any extra owners (e.g. Melegari)
  const ownersWithData = Array.from(new Set(accounts.map(a => a.member_name)));
  const visiblePeople = (personFilter === 'Todos'
    ? [...PEOPLE.slice(1), ...ownersWithData.filter(o => !PEOPLE.includes(o))]
    : people
  ).filter(p => accounts.some(a => a.member_name === p));

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="bg-[var(--color-navy)] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">🎟️ Milhas &amp; Programas</h1>
            <Link
              href="/viagens"
              className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/25 transition-colors"
            >
              ✈️ Viagens
            </Link>
          </div>
          <p className="mt-1 text-sm text-white/70">
            Números de cadastro dos programas de fidelidade da família. Senhas/PINs não ficam aqui.
          </p>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {visiblePeople.map(person => {
          const personAccounts = accounts.filter(a => a.member_name === person);
          if (personAccounts.length === 0) return null;
          return (
            <section key={person}>
              <h2 className="text-lg font-bold text-[var(--color-navy)] mb-3">{person}</h2>
              <div className="space-y-4">
                {CATEGORIES.map(cat => {
                  const rows = personAccounts.filter(a => a.category === cat.key);
                  if (rows.length === 0) return null;
                  return (
                    <div key={cat.key} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {cat.icon} {cat.label}
                      </div>
                      <ul className="divide-y divide-gray-100">
                        {rows.map(a => (
                          <li key={a.id} className="px-4 py-3 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-medium text-gray-800">{a.program}</div>
                              {(a.tier || a.login || a.notes) && (
                                <div className="text-xs text-gray-400 mt-0.5 space-x-2">
                                  {a.tier && <span>{a.tier}</span>}
                                  {a.login && <span>· {a.login}</span>}
                                  {a.notes && <span className="text-amber-600">· {a.notes}</span>}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center shrink-0">
                              <span className="font-mono text-sm text-gray-900 tabular-nums">
                                {a.account_number || '—'}
                              </span>
                              <CopyButton value={a.account_number} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
