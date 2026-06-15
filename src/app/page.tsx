'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const sections = [
  {
    href: '/viagens',
    emoji: '✈️',
    cpEmoji: '🏔️',
    title: 'Viagens',
    cpTitle: 'Ilha do Pinguim',
    desc: 'Voos, hotéis e roteiros da família',
    cpDesc: 'Expedições pelo Ártico e além dos mares gelados',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    cpColor: 'bg-sky-100 border-sky-300 hover:bg-sky-200',
    textColor: 'text-blue-800',
    cpTextColor: 'text-sky-900',
    active: true,
  },
  {
    href: '/arvore',
    emoji: '🌳',
    cpEmoji: '🗺️',
    title: 'Árvore Genealógica',
    cpTitle: 'O Mapa da Tribo',
    desc: 'História e origem da família Janér',
    cpDesc: 'De onde vieram os pinguins Janér',
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    cpColor: 'bg-teal-100 border-teal-300 hover:bg-teal-200',
    textColor: 'text-emerald-800',
    cpTextColor: 'text-teal-900',
    active: true,
  },
  {
    href: '/documentos',
    emoji: '📄',
    cpEmoji: '📜',
    title: 'Documentos',
    cpTitle: 'Pergaminhos Oficiais',
    desc: 'Passaportes, CPFs, vencimentos e dados importantes',
    cpDesc: 'Pergaminhos reais, selos e credenciais do iglu',
    color: 'bg-amber-50 border-amber-200 hover:bg-amber-100',
    cpColor: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
    textColor: 'text-amber-800',
    cpTextColor: 'text-yellow-900',
    active: true,
  },
  {
    href: '/saude',
    emoji: '🏥',
    cpEmoji: '❄️',
    title: 'Planos de Saúde',
    cpTitle: 'Iglu da Cura',
    desc: 'Coberturas, carteirinhas e contatos dos planos',
    cpDesc: 'O iglu do Doutor Pinguim e suas poções de gelo',
    color: 'bg-rose-50 border-rose-200 hover:bg-rose-100',
    cpColor: 'bg-pink-100 border-pink-300 hover:bg-pink-200',
    textColor: 'text-rose-800',
    cpTextColor: 'text-pink-900',
    active: false,
  },
  {
    href: '/emergencia',
    emoji: '🆘',
    cpEmoji: '🐧',
    title: 'Emergência',
    cpTitle: 'Guarda do Iglu',
    desc: 'Números úteis, médicos, seguradoras e contatos críticos',
    cpDesc: 'A polícia dos pinguins e os heróis do gelo',
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    cpColor: 'bg-orange-100 border-orange-300 hover:bg-orange-200',
    textColor: 'text-red-800',
    cpTextColor: 'text-orange-900',
    active: false,
  },
  {
    href: '/imoveis',
    emoji: '🏠',
    cpEmoji: '🏔️',
    title: 'Imóveis',
    cpTitle: 'Nossos Iglus',
    desc: 'Casa SP, Baroneza, Jurerê — dados e documentos',
    cpDesc: 'O iglu de SP, o iglu da montanha e o iglu da praia',
    color: 'bg-violet-50 border-violet-200 hover:bg-violet-100',
    cpColor: 'bg-indigo-100 border-indigo-300 hover:bg-indigo-200',
    textColor: 'text-violet-800',
    cpTextColor: 'text-indigo-900',
    active: false,
  },
];

// Snowflake component
function Snowflake({ style }: { style: React.CSSProperties }) {
  return (
    <div className="absolute pointer-events-none select-none text-white opacity-60 animate-bounce" style={style}>
      ❄️
    </div>
  );
}

export default function Home() {
  const [cpMode, setCpMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [snow, setSnow] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Secret: click the 🦅 eagle 3 times fast
  function handleLogoClick() {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 800);

    if (clickCount.current >= 3) {
      clickCount.current = 0;
      if (!cpMode) {
        setSnow(true);
        setTimeout(() => {
          setCpMode(true);
          setSnow(false);
        }, 1200);
      } else {
        setCpMode(false);
      }
    }
  }

  // Show hint after 10s
  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 10000);
    return () => clearTimeout(t);
  }, []);

  const snowflakes = Array.from({ length: 18 }, (_, i) => ({
    style: {
      left: `${(i * 6) % 100}%`,
      top: `${Math.random() * 80}%`,
      fontSize: `${10 + (i % 4) * 6}px`,
      animationDelay: `${i * 0.15}s`,
      animationDuration: `${1 + (i % 3) * 0.4}s`,
    } as React.CSSProperties,
  }));

  return (
    <div className={`min-h-screen transition-colors duration-700 ${cpMode ? 'bg-sky-200' : 'bg-[var(--color-bg)]'}`}>
      {/* Snow transition */}
      {snow && (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
          {snowflakes.map((s, i) => <Snowflake key={i} style={s.style} />)}
        </div>
      )}

      {/* Header */}
      <header className={`text-white transition-colors duration-700 ${cpMode ? 'bg-sky-700' : 'bg-[var(--color-navy)]'}`}>
        <div className="max-w-4xl mx-auto px-4 py-10 text-center relative">
          <button
            onClick={handleLogoClick}
            className="text-5xl mb-3 block mx-auto cursor-pointer select-none hover:scale-110 transition-transform active:scale-95"
            title={cpMode ? 'Sair do modo Club Penguin' : undefined}
          >
            {cpMode ? '🐧' : '🦅'}
          </button>
          <h1 className="text-3xl font-bold tracking-tight transition-all duration-500">
            {cpMode ? '🏔️ Club Penguin Janér 🏔️' : 'Portal Família Janér'}
          </h1>
          <p className={`mt-2 text-sm transition-all duration-500 ${cpMode ? 'text-sky-200' : 'text-blue-200'}`}>
            {cpMode
              ? 'Bem-vindos à aldeia gelada dos pinguins Janér! 🐟'
              : 'Tudo num só lugar — para todos da família'}
          </p>
          {cpMode && (
            <div className="mt-3 flex justify-center gap-1 text-lg">
              {'❄️🐧❄️🐧❄️🐧❄️'.split('').map((c, i) => (
                <span key={i} style={{ animationDelay: `${i * 0.1}s` }} className="animate-bounce inline-block">{c}</span>
              ))}
            </div>
          )}

          {/* Hint */}
          {showHint && !cpMode && (
            <p className="absolute bottom-1 right-4 text-xs text-blue-300/40 italic">
              psst... clique 3x na águia 🦅
            </p>
          )}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-4xl mx-auto px-4 py-10">
        {cpMode && (
          <p className="text-center text-sky-700 font-semibold mb-6 text-sm">
            🐧 Escolha seu iglu, pinguim! 🐧
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {sections.map((s) => {
            const color = cpMode ? s.cpColor : s.color;
            const textColor = cpMode ? s.cpTextColor : s.textColor;
            const emoji = cpMode ? s.cpEmoji : s.emoji;
            const title = cpMode ? s.cpTitle : s.title;
            const desc = cpMode ? s.cpDesc : s.desc;

            const card = (
              <div className={`relative rounded-2xl border-2 p-6 transition-all cursor-pointer shadow-sm hover:shadow-md ${color} ${!s.active ? 'opacity-60' : ''}`}>
                {!s.active && (
                  <span className="absolute top-3 right-3 text-xs font-semibold bg-white/70 text-gray-500 px-2 py-0.5 rounded-full border border-gray-200">
                    {cpMode ? 'iglu em construção 🔨' : 'em breve'}
                  </span>
                )}
                <div className="text-3xl mb-3 transition-all duration-300">{emoji}</div>
                <h2 className={`text-lg font-bold transition-all duration-300 ${textColor}`}>{title}</h2>
                <p className="text-gray-500 text-sm mt-1 leading-snug transition-all duration-300">{desc}</p>
              </div>
            );

            return s.active ? (
              <Link key={s.href} href={s.href}>{card}</Link>
            ) : (
              <div key={s.href} className="cursor-default">{card}</div>
            );
          })}
        </div>

        <p className="text-center text-xs mt-12 transition-all duration-500 text-gray-400">
          {cpMode
            ? '🐟 Bem-vindo à Ilha Janér — neve garantida 🐟'
            : '🔒 Acesso restrito · Família Janér'}
        </p>
      </main>
    </div>
  );
}
