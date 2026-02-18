'use client';

import { useState, useRef, useEffect } from 'react';
import { getPerson, getParents, getChildren, getSpouses, type Person, familyData } from './data';

interface NodePosition {
  x: number;
  y: number;
}

interface Link {
  from: string;
  to: string;
}

const CARD_W = 160;
const CARD_H = 90;
const GEN_GAP = 180;
const H_GAP = 20;

export default function FamilyTreeElegant() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scale, setScale] = useState(0.7);
  const [translateX, setTranslateX] = useState(400);
  const [translateY, setTranslateY] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [visibleNodes, setVisibleNodes] = useState<Set<string>>(
    new Set(['lars', 'andrea', 'laura', 'antonio', 'henrique', 'tor', 'edina'])
  );
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    new Set(['lars_parents', 'andrea_parents'])
  );

  const svgRef = useRef<SVGSVGElement>(null);

  const searchResults = searchTerm 
    ? familyData.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 8)
    : [];

  const zoomIn = () => setScale(s => Math.min(s * 1.2, 3));
  const zoomOut = () => setScale(s => Math.max(s / 1.2, 0.3));
  const resetView = () => {
    setScale(0.7);
    setTranslateX(400);
    setTranslateY(400);
  };

  const expandAll = () => {
    const allIds = new Set(familyData.map(p => p.id));
    setVisibleNodes(allIds);
  };

  const collapseAll = () => {
    setVisibleNodes(new Set(['lars', 'andrea', 'laura', 'antonio', 'henrique']));
    setExpandedKeys(new Set());
  };

  const toggleExpand = (personId: string, direction: 'up' | 'down') => {
    const person = getPerson(personId);
    if (!person) return;

    const key = `${personId}_${direction === 'up' ? 'parents' : 'children'}`;
    const newExpanded = new Set(expandedKeys);
    const newVisible = new Set(visibleNodes);

    if (direction === 'up') {
      const parents = getParents(personId);
      parents.forEach(p => newVisible.add(p.id));
      newExpanded.add(key);
    } else {
      const children = getChildren(personId);
      children.forEach(c => newVisible.add(c.id));
      newExpanded.add(key);
    }

    setExpandedKeys(newExpanded);
    setVisibleNodes(newVisible);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - translateX, y: e.clientY - translateY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTranslateX(e.clientX - dragStart.x);
    setTranslateY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Compute layout using BFS from Lars
  const computeLayout = (): { positions: Record<string, NodePosition>, links: Link[] } => {
    const positions: Record<string, NodePosition> = {};
    const links: Link[] = [];
    
    if (visibleNodes.size === 0) return { positions, links };

    // BFS to assign generations
    const gens: Record<string, number> = {};
    const queue: Array<[string, number]> = [['lars', 0]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) continue;
      const [pid, gen] = item;
      
      if (visited.has(pid)) continue;
      if (!visibleNodes.has(pid)) continue;
      
      visited.add(pid);
      gens[pid] = gen;

      // Spouses = same generation
      const spouses = getSpouses(pid).filter(s => visibleNodes.has(s.id));
      spouses.forEach(s => {
        if (!visited.has(s.id)) queue.push([s.id, gen]);
      });

      // Children = gen + 1
      const children = getChildren(pid).filter(c => visibleNodes.has(c.id));
      children.forEach(c => {
        if (!visited.has(c.id)) queue.push([c.id, gen + 1]);
      });

      // Parents = gen - 1
      const parents = getParents(pid).filter(p => visibleNodes.has(p.id));
      parents.forEach(p => {
        if (!visited.has(p.id)) queue.push([p.id, gen - 1]);
      });
    }

    // Group by generation
    const genGroups: Record<number, string[]> = {};
    Object.entries(gens).forEach(([pid, gen]) => {
      if (!genGroups[gen]) genGroups[gen] = [];
      genGroups[gen].push(pid);
    });

    // Order within each generation (keep couples together)
    Object.keys(genGroups).forEach(genKey => {
      const gen = Number(genKey);
      const group = genGroups[gen];
      const ordered: string[] = [];
      const used = new Set<string>();

      group.forEach(pid => {
        if (used.has(pid)) return;
        used.add(pid);
        ordered.push(pid);

        // Add spouse next to them
        const spouses = getSpouses(pid).filter(s => group.includes(s.id) && !used.has(s.id));
        spouses.forEach(s => {
          used.add(s.id);
          ordered.push(s.id);
        });
      });

      genGroups[gen] = ordered;
    });

    // Position nodes
    const sortedGens = Object.keys(genGroups).map(Number).sort((a, b) => a - b);

    sortedGens.forEach(gen => {
      const group = genGroups[gen];
      const y = gen * (CARD_H + GEN_GAP);
      const totalW = group.length * CARD_W + (group.length - 1) * H_GAP;
      let x = -totalW / 2;

      group.forEach(pid => {
        positions[pid] = { x, y };
        x += CARD_W + H_GAP;
      });
    });

    // Generate links
    visibleNodes.forEach(pid => {
      const parents = getParents(pid).filter(p => visibleNodes.has(p.id));
      parents.forEach(p => {
        links.push({ from: p.id, to: pid });
      });
    });

    return { positions, links };
  };

  const { positions, links } = computeLayout();

  const renderPersonCard = (personId: string) => {
    const person = getPerson(personId);
    const pos = positions[personId];
    if (!person || !pos) return null;

    const isDark = person.gender === 'M';
    const hasParents = getParents(personId).some(p => !visibleNodes.has(p.id));
    const hasChildren = getChildren(personId).some(c => !visibleNodes.has(c.id));

    return (
      <g key={personId} transform={`translate(${pos.x},${pos.y})`} className="node-group">
        {/* Card */}
        <rect
          x={0}
          y={0}
          width={CARD_W}
          height={CARD_H}
          rx={8}
          fill={isDark ? '#3a6d96' : '#9b5d8e'}
          stroke="#d4a853"
          strokeWidth={2}
          className="cursor-pointer transition-all hover:brightness-125"
        />

        {/* Connection circles */}
        {(hasParents || getParents(personId).length > 0) && (
          <circle
            cx={CARD_W / 2}
            cy={0}
            r={6}
            fill="#8b6914"
            stroke="#2b2520"
            strokeWidth={1}
          />
        )}
        {(hasChildren || getChildren(personId).length > 0) && (
          <circle
            cx={CARD_W / 2}
            cy={CARD_H}
            r={6}
            fill="#8b6914"
            stroke="#2b2520"
            strokeWidth={1}
          />
        )}

        {/* Flag */}
        <text x={12} y={22} fontSize="18" className="select-none">
          🇧🇷
        </text>

        {/* Name */}
        <text
          x={CARD_W / 2}
          y={35}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="white"
          className="select-none pointer-events-none"
        >
          {person.name.split(' ')[0]}
        </text>
        <text
          x={CARD_W / 2}
          y={50}
          textAnchor="middle"
          fontSize="11"
          fill="rgba(255,255,255,0.9)"
          className="select-none pointer-events-none"
        >
          {person.name.split(' ').slice(-1)[0]}
        </text>

        {/* Birth */}
        <text
          x={CARD_W / 2}
          y={68}
          textAnchor="middle"
          fontSize="10"
          fill="rgba(255,255,255,0.7)"
          className="select-none pointer-events-none"
        >
          ★{person.birthDate?.split('/')[2] || '?'}
        </text>

        {/* Expand buttons */}
        {hasParents && (
          <g
            className="cursor-pointer opacity-80 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(personId, 'up');
            }}
          >
            <circle cx={CARD_W - 16} cy={12} r={8} fill="rgba(139,105,20,0.8)" />
            <text x={CARD_W - 16} y={16} textAnchor="middle" fontSize="10" fill="white" className="pointer-events-none">
              ↑
            </text>
          </g>
        )}
        {hasChildren && (
          <g
            className="cursor-pointer opacity-80 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(personId, 'down');
            }}
          >
            <circle cx={CARD_W - 16} cy={CARD_H - 12} r={8} fill="rgba(139,105,20,0.8)" />
            <text x={CARD_W - 16} y={CARD_H - 8} textAnchor="middle" fontSize="10" fill="white" className="pointer-events-none">
              ↓
            </text>
          </g>
        )}

        {/* Info button */}
        <g
          className="cursor-pointer opacity-80 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPerson(person);
          }}
        >
          <circle cx={16} cy={CARD_H - 12} r={8} fill="rgba(139,105,20,0.8)" />
          <text x={16} y={CARD_H - 8} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" className="pointer-events-none">
            i
          </text>
        </g>
      </g>
    );
  };

  const renderLines = () => {
    return links.map((link, idx) => {
      const fromPos = positions[link.from];
      const toPos = positions[link.to];
      if (!fromPos || !toPos) return null;

      return (
        <line
          key={`${link.from}-${link.to}-${idx}`}
          x1={fromPos.x + CARD_W / 2}
          y1={fromPos.y + CARD_H}
          x2={toPos.x + CARD_W / 2}
          y2={toPos.y}
          stroke="#333"
          strokeWidth={1.5}
        />
      );
    });
  };

  return (
    <div className="flex h-screen w-screen bg-[#f5f0e8]">
      {/* Sidebar */}
      <div className={`${selectedPerson ? 'w-80' : 'w-0'} bg-[#ece5d8] border-r border-[#d5cdbf] transition-all duration-300 flex flex-col overflow-hidden`}>
        {selectedPerson && (
          <>
            <div className="flex items-center justify-between p-5 border-b border-[#d5cdbf]">
              <h2 className="text-[#8b6914] text-lg">Detalhes</h2>
              <button onClick={() => setSelectedPerson(null)} className="text-2xl text-[#8a8078] hover:text-[#2b2520]">
                ×
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="text-2xl font-bold text-[#6b4f0a] mb-2">{selectedPerson.name}</div>
              {selectedPerson.birthDate && (
                <div className="mb-3 text-sm">
                  <span className="text-[#8a8078]">Nascimento:</span> {selectedPerson.birthDate}
                  {selectedPerson.birthPlace && ` — ${selectedPerson.birthPlace}`}
                </div>
              )}
              {selectedPerson.notes && (
                <div className="mt-3 text-sm text-[#5a5148] bg-[#f5f0e8] p-3 rounded">{selectedPerson.notes}</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="flex items-center gap-4 px-5 py-3 bg-[#3a2e1e] border-b-2 border-[#c9a84c]">
          <h1 className="text-[#f0d080] text-2xl font-bold whitespace-nowrap">
            🌳 Família Janér-Melegari
          </h1>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="🔍 Buscar pessoa..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearch(true);
              }}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              className="w-full px-4 py-2 rounded-full border border-[#d5cdbf] bg-[#f5f0e8] outline-none"
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#ece5d8] border border-[#d5cdbf] rounded-lg max-h-60 overflow-y-auto z-50">
                {searchResults.map(person => (
                  <div
                    key={person.id}
                    onClick={() => {
                      const newVisible = new Set(visibleNodes);
                      newVisible.add(person.id);
                      setVisibleNodes(newVisible);
                      setSearchTerm('');
                      setShowSearch(false);
                    }}
                    className="p-3 hover:bg-[#d5cdbf] cursor-pointer border-b border-[#d5cdbf]"
                  >
                    <div className="font-medium text-[#6b4f0a]">{person.name}</div>
                    <div className="text-xs text-[#8a8078]">{person.birthDate}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button onClick={zoomIn} className="px-3 py-1 bg-[#d5cdbf] hover:bg-[#c9a84c] rounded">＋</button>
            <button onClick={zoomOut} className="px-3 py-1 bg-[#d5cdbf] hover:bg-[#c9a84c] rounded">－</button>
            <button onClick={resetView} className="px-3 py-1 bg-[#d5cdbf] hover:bg-[#c9a84c] rounded">⌂</button>
            <button onClick={expandAll} className="px-3 py-1 bg-[#d5cdbf] hover:bg-[#c9a84c] rounded">Expandir ↕</button>
            <button onClick={collapseAll} className="px-3 py-1 bg-[#d5cdbf] hover:bg-[#c9a84c] rounded">Recolher ↔</button>
          </div>
        </div>

        {/* Tree */}
        <div
          className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg ref={svgRef} className="w-full h-full">
            <g transform={`translate(${translateX},${translateY}) scale(${scale})`}>
              {renderLines()}
              {Array.from(visibleNodes).map(renderPersonCard)}
            </g>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 right-3 bg-[#ece5d8] border border-[#d5cdbf] rounded-lg p-3 text-xs text-[#8a8078]">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-[#3a6d96]"></div>
              <span>Masculino</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-full bg-[#9b5d8e]"></div>
              <span>Feminino</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-[#8b6914]"></div>
              <span>Título nobre</span>
            </div>
            <div className="text-[10px]">
              Clique ↑↓ para expandir<br/>
              Clique no (i) para detalhes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
