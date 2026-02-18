'use client';

import { useState } from 'react';
import { getPerson, getParents, getChildren, getSpouses, type Person } from './data';

interface TreeNode {
  person: Person;
  x: number;
  y: number;
  level: number;
}

export default function FamilyTree() {
  const [focusPersonId, setFocusPersonId] = useState('lars');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar pessoas
  const searchResults = searchTerm ? 
    (getPerson as any)('lars').constructor.name ? [] : [] // stub
    : [];

  const renderTree = () => {
    const focusPerson = getPerson(focusPersonId);
    if (!focusPerson) return null;

    const parents = getParents(focusPersonId);
    const children = getChildren(focusPersonId);
    const spouses = getSpouses(focusPersonId);

    // Layout: pessoa foco no centro, pais acima, filhos abaixo
    const centerX = 400;
    const centerY = 300;
    const levelGap = 150;
    const siblingGap = 180;

    const nodes: TreeNode[] = [];
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];

    // Pessoa foco
    nodes.push({ person: focusPerson, x: centerX, y: centerY, level: 0 });

    // Cônjuge ao lado
    if (spouses.length > 0) {
      nodes.push({ person: spouses[0], x: centerX + siblingGap, y: centerY, level: 0 });
      // Linha horizontal entre cônjuges
      lines.push({ x1: centerX + 80, y1: centerY + 40, x2: centerX + siblingGap - 80, y2: centerY + 40 });
    }

    // Pais acima
    if (parents.length > 0) {
      const parentY = centerY - levelGap;
      const parentStartX = centerX - (parents.length - 1) * siblingGap / 2;

      parents.forEach((parent, idx) => {
        const parentX = parentStartX + idx * siblingGap;
        nodes.push({ person: parent, x: parentX, y: parentY, level: -1 });
        
        // Linha do foco para pai
        lines.push({ 
          x1: centerX, 
          y1: centerY - 50, 
          x2: parentX, 
          y2: parentY + 70 
        });
      });

      // Linha horizontal entre pais
      if (parents.length === 2) {
        lines.push({
          x1: parentStartX,
          y1: parentY + 70,
          x2: parentStartX + siblingGap,
          y2: parentY + 70
        });
      }
    }

    // Filhos abaixo
    if (children.length > 0) {
      const childY = centerY + levelGap;
      const childStartX = centerX + (spouses.length > 0 ? siblingGap / 2 : 0) - (children.length - 1) * 120 / 2;

      children.forEach((child, idx) => {
        const childX = childStartX + idx * 120;
        nodes.push({ person: child, x: childX, y: childY, level: 1 });

        // Linha do foco para filho
        lines.push({
          x1: centerX + (spouses.length > 0 ? siblingGap / 2 : 0),
          y1: centerY + 80,
          x2: childX,
          y2: childY - 50
        });
      });
    }

    return (
      <svg width="100%" height="600" viewBox="0 0 800 600" className="border border-gray-200 rounded-lg bg-white">
        {/* Linhas de conexão */}
        <g stroke="#94a3b8" strokeWidth="2" fill="none">
          {lines.map((line, idx) => (
            <line key={idx} {...line} />
          ))}
        </g>

        {/* Nodes de pessoas */}
        {nodes.map((node, idx) => (
          <g key={idx}>
            {/* Box da pessoa */}
            <rect
              x={node.x - 80}
              y={node.y - 50}
              width={160}
              height={100}
              fill={node.level === 0 ? '#e0e7ff' : node.level === -1 ? '#dbeafe' : '#fce7f3'}
              stroke={node.person.id === focusPersonId ? '#4f46e5' : '#94a3b8'}
              strokeWidth={node.person.id === focusPersonId ? 3 : 1}
              rx={8}
              className="cursor-pointer transition-all hover:stroke-indigo-500"
              onClick={() => setFocusPersonId(node.person.id)}
            />
            
            {/* Nome */}
            <text
              x={node.x}
              y={node.y - 10}
              textAnchor="middle"
              fontSize="14"
              fontWeight="600"
              fill="#1e293b"
              className="pointer-events-none select-none"
            >
              {node.person.name.split(' ')[0]} {node.person.name.split(' ')[node.person.name.split(' ').length - 1]}
            </text>

            {/* Data de nascimento */}
            {node.person.birthDate && (
              <text
                x={node.x}
                y={node.y + 10}
                textAnchor="middle"
                fontSize="11"
                fill="#64748b"
                className="pointer-events-none select-none"
              >
                {node.person.birthDate}
              </text>
            )}

            {/* Botão de info */}
            <circle
              cx={node.x + 70}
              cy={node.y - 40}
              r={12}
              fill="#6366f1"
              className="cursor-pointer hover:fill-indigo-700"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPerson(node.person);
              }}
            />
            <text
              x={node.x + 70}
              y={node.y - 36}
              textAnchor="middle"
              fontSize="12"
              fill="white"
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              i
            </text>
          </g>
        ))}

        {/* Legenda de navegação */}
        <text x="20" y="30" fontSize="13" fill="#64748b" fontWeight="500">
          💡 Clique em uma pessoa para navegar | Clique no (i) para detalhes
        </text>
      </svg>
    );
  };

  const renderPersonCard = (person: Person) => {
    const parents = getParents(person.id);
    const children = getChildren(person.id);
    const spouses = getSpouses(person.id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPerson(null)}>
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{person.name}</h2>
              <button
                onClick={() => setSelectedPerson(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {person.birthDate && (
                <div>
                  <span className="font-semibold">Nascimento:</span> {person.birthDate}
                  {person.birthPlace && ` — ${person.birthPlace}`}
                </div>
              )}

              {person.deathDate && (
                <div>
                  <span className="font-semibold">Falecimento:</span> {person.deathDate}
                  {person.deathPlace && ` — ${person.deathPlace}`}
                </div>
              )}

              {person.notes && (
                <div>
                  <span className="font-semibold">Notas:</span> {person.notes}
                </div>
              )}

              {parents.length > 0 && (
                <div>
                  <span className="font-semibold">Pais:</span>
                  <div className="ml-4 mt-1 space-y-1">
                    {parents.map(p => (
                      <div key={p.id}>
                        <button
                          onClick={() => {
                            setFocusPersonId(p.id);
                            setSelectedPerson(null);
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {p.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {spouses.length > 0 && (
                <div>
                  <span className="font-semibold">Cônjuge(s):</span>
                  <div className="ml-4 mt-1 space-y-1">
                    {spouses.map(s => (
                      <div key={s.id}>
                        <button
                          onClick={() => {
                            setFocusPersonId(s.id);
                            setSelectedPerson(null);
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {s.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {children.length > 0 && (
                <div>
                  <span className="font-semibold">Filhos:</span>
                  <div className="ml-4 mt-1 space-y-1">
                    {children.map(c => (
                      <div key={c.id}>
                        <button
                          onClick={() => {
                            setFocusPersonId(c.id);
                            setSelectedPerson(null);
                          }}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {c.name}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌳 Árvore Genealógica</h1>
          <p className="text-gray-600">Família Janér-Melegari</p>
        </div>

        {/* Controles */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFocusPersonId('lars')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            🏠 Voltar para Lars
          </button>
          
          <button
            onClick={() => {
              const parents = getParents(focusPersonId);
              if (parents.length > 0) setFocusPersonId(parents[0].id);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ⬆️ Ver Pais
          </button>

          <button
            onClick={() => {
              const children = getChildren(focusPersonId);
              if (children.length > 0) setFocusPersonId(children[0].id);
            }}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
          >
            ⬇️ Ver Filhos
          </button>
        </div>

        {/* Info da pessoa em foco */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
          {(() => {
            const person = getPerson(focusPersonId);
            if (!person) return null;
            return (
              <div>
                <div className="font-bold text-lg text-gray-900">{person.name}</div>
                <div className="text-sm text-gray-600">
                  {person.birthDate && `Nascimento: ${person.birthDate}`}
                  {person.birthPlace && ` — ${person.birthPlace}`}
                </div>
                {person.notes && <div className="text-sm text-gray-500 mt-1">{person.notes}</div>}
              </div>
            );
          })()}
        </div>

        {/* Árvore visual */}
        <div className="bg-gray-50 rounded-lg p-4">
          {renderTree()}
        </div>

        {/* Legenda */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-200 rounded"></div>
              <span>Pessoa em foco</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span>Pais / Avós</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-200 rounded"></div>
              <span>Filhos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de detalhes */}
      {selectedPerson && renderPersonCard(selectedPerson)}
    </div>
  );
}
