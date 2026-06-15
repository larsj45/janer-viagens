'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Doc {
  label: string;
  value: string;
  expires?: string;
  alert?: boolean;
  warn?: boolean;
  pending?: boolean;
}

interface Person {
  name: string;
  emoji: string;
  color: string;
  border: string;
  docs: Doc[];
}

const people: Person[] = [
  {
    name: 'Lars',
    emoji: '👨',
    color: 'bg-blue-50',
    border: 'border-blue-200',
    docs: [
      { label: 'Passaporte BR', value: 'GLO088006', expires: '16/03/2035' },
      { label: 'Passaporte PT', value: 'CD071062', expires: '03/11/2027' },
    ],
  },
  {
    name: 'Andrea',
    emoji: '👩',
    color: 'bg-rose-50',
    border: 'border-rose-200',
    docs: [
      { label: 'Passaporte BR', value: 'GL089826', expires: '16/03/2035' },
      { label: 'Cidadania PT', value: '⏳ Para decisão (etapa 3/4)', pending: true },
    ],
  },
  {
    name: 'Laura',
    emoji: '👧',
    color: 'bg-purple-50',
    border: 'border-purple-200',
    docs: [
      { label: 'CPF', value: '518.196.378-16' },
      { label: 'RG', value: '67.153.193-1' },
      { label: 'Passaporte BR', value: 'GC278823', expires: '07/02/2031' },
      { label: 'Passaporte PT', value: 'CA405742', expires: '14/02/2024', warn: true },
    ],
  },
  {
    name: 'Antonio',
    emoji: '👦',
    color: 'bg-amber-50',
    border: 'border-amber-200',
    docs: [
      { label: 'CPF', value: '518.196.488-50' },
      { label: 'RG', value: '68047573-4' },
      { label: 'Passaporte BR', value: 'YE662975', expires: '09/01/2034' },
      { label: 'Passaporte PT', value: 'CC926948', expires: '12/09/2027' },
    ],
  },
  {
    name: 'Henrique',
    emoji: '👦',
    color: 'bg-emerald-50',
    border: 'border-emerald-200',
    docs: [
      { label: 'CPF', value: '518.196.538-54' },
      { label: 'Passaporte BR', value: '⚠️ verificar', expires: '29/06/2026', alert: true },
      { label: 'Passaporte PT', value: 'CD890936', expires: '24/08/2028' },
    ],
  },
  {
    name: 'Tor (avô)',
    emoji: '👴',
    color: 'bg-slate-50',
    border: 'border-slate-200',
    docs: [
      { label: 'Passaporte BR', value: '—', expires: '—' },
    ],
  },
  {
    name: 'Edina (avó)',
    emoji: '👵',
    color: 'bg-slate-50',
    border: 'border-slate-200',
    docs: [
      { label: 'Passaporte BR', value: '—', expires: '—' },
    ],
  },
];

function expiryBadge(expires?: string, alert?: boolean, warn?: boolean) {
  if (!expires || expires === '—') return null;
  return (
    <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
      alert
        ? 'bg-red-100 text-red-700 animate-pulse'
        : warn
        ? 'bg-orange-100 text-orange-700'
        : 'bg-gray-100 text-gray-500'
    }`}>
      {alert ? '⚠️ ' : warn ? '⏰ ' : ''}vence {expires}
    </span>
  );
}

export default function DocumentosPage() {
  const [search, setSearch] = useState('');
  const filtered = people.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const alerts = people.flatMap(p =>
    p.docs.filter(d => d.alert || d.warn).map(d => ({ person: p.name, doc: d }))
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="bg-[var(--color-navy)] text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-blue-200 hover:text-white text-sm mb-2 inline-block">
            ← Portal
          </Link>
          <h1 className="text-2xl font-bold">📄 Documentos da Família</h1>
          <p className="text-blue-200 text-sm mt-1">Passaportes, CPFs e documentos importantes</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Alert banners */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map(({ person, doc }) => (
              <div key={`${person}-${doc.label}`}
                className={`rounded-xl p-4 flex items-start gap-3 border ${
                  doc.alert
                    ? 'bg-red-50 border-red-200'
                    : 'bg-orange-50 border-orange-200'
                }`}>
                <span className="text-xl">{doc.alert ? '⚠️' : '⏰'}</span>
                <div>
                  <p className={`font-semibold text-sm ${doc.alert ? 'text-red-800' : 'text-orange-800'}`}>
                    {doc.alert ? 'Documento vencendo em breve' : 'Documento expirado'}
                  </p>
                  <p className={`text-sm mt-0.5 ${doc.alert ? 'text-red-600' : 'text-orange-600'}`}>
                    {doc.label} de <strong>{person}</strong> — vence {doc.expires}
                    {doc.alert && ' — renovar com urgência!'}
                    {doc.warn && ' — verificar renovação'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar pessoa..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-navy)] bg-white"
        />

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map(person => (
            <div key={person.name} className={`rounded-2xl border-2 p-5 shadow-sm ${person.color} ${person.border}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{person.emoji}</span>
                <h2 className="font-bold text-[var(--color-navy)] text-lg">{person.name}</h2>
              </div>
              <div className="space-y-2">
                {person.docs.map(doc => (
                  <div key={doc.label} className="flex items-center justify-between text-sm flex-wrap gap-1">
                    <span className="text-gray-500 min-w-[140px]">{doc.label}</span>
                    <div className="flex items-center flex-wrap gap-1">
                      <span className={`font-mono px-2 py-0.5 rounded text-xs ${
                        doc.value.startsWith('⚠️')
                          ? 'bg-red-100 text-red-700'
                          : doc.pending
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-white/60 text-gray-700'
                      }`}>
                        {doc.value}
                      </span>
                      {expiryBadge(doc.expires, doc.alert, doc.warn)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 pt-4">
          🔒 Dados sensíveis — acesso restrito à família
        </p>
      </main>
    </div>
  );
}
