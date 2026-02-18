'use client';

import { useState, useRef, useEffect } from 'react';
import { getPerson, getParents, getChildren, getSpouses, type Person, familyData } from './data';

interface TreeNode {
  person: Person;
  x: number;
  y: number;
  level: number;
  expanded: boolean;
}

export default function FamilyTreeElegant() {
  const [focusPersonId, setFocusPersonId] = useState('lars');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scale, setScale] = useState(0.8);
  const [translateX, setTranslateX] = useState(200);
  const [translateY, setTranslateY] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['lars', 'tor', 'edina', 'andrea']));
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Buscar pessoas
  const searchResults = searchTerm 
    ? familyData.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8)
    : [];

  const zoomIn = () => setScale(s => Math.min(s * 1.2, 3));
  const zoomOut = () => setScale(s => Math.max(s / 1.2, 0.3));
  const resetView = () => {
    setScale(0.8);
    setTranslateX(200);
    setTranslateY(100);
    setFocusPersonId('lars');
  };

  const expandAll = () => {
    const allIds = new Set(familyData.map(p => p.id));
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set(['lars']));
  };

  const toggleExpand = (personId: string, direction: 'up' | 'down') => {
    const newExpanded = new Set(expandedNodes);
    const person = getPerson(personId);
    if (!person) return;

    if (direction === 'up') {
      const parents = getParents(personId);
      parents.forEach(p => newExpanded.add(p.id));
    } else {
      const children = getChildren(personId);
      children.forEach(c => newExpanded.add(c.id));
    }
    
    setExpandedNodes(newExpanded);
  };

  // Mouse drag
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

  // Construir árvore recursiva
  const buildTree = (personId: string, level: number, x: number, visited: Set<string> = new Set()): TreeNode[] => {
    const person = getPerson(personId);
    if (!person || visited.has(personId)) return [];

    visited.add(personId);

    const nodes: TreeNode[] = [];
    const isExpanded = expandedNodes.has(personId);
    
    nodes.push({
      person,
      x,
      y: level * 180 + 100,
      level,
      expanded: isExpanded,
    });

    if (!isExpanded) return nodes;

    // Parents
    const parents = getParents(personId);
    if (parents.length > 0) {
      const parentY = level - 1;
      const parentSpacing = 200;
      const parentX = x - (parents.length - 1) * parentSpacing / 2;
      parents.forEach((parent, idx) => {
        nodes.push(...buildTree(parent.id, parentY, parentX + idx * parentSpacing, visited));
      });
    }

    // Children
    const children = getChildren(personId);
    if (children.length > 0) {
      const childY = level + 1;
      const childSpacing = 180;
      const childX = x - (children.length - 1) * childSpacing / 2;
      children.forEach((child, idx) => {
        nodes.push(...buildTree(child.id, childY, childX + idx * childSpacing, visited));
      });
    }

    // Spouse
    const spouses = getSpouses(personId);
    if (spouses.length > 0) {
      spouses.forEach(spouse => {
        if (!visited.has(spouse.id)) {
          nodes.push(...buildTree(spouse.id, level, x + 200, visited));
        }
      });
    }

    return nodes;
  };

  const tree = buildTree(focusPersonId, 2, 600);
  const uniqueTree = Array.from(new Map(tree.map(n => [n.person.id, n])).values());

  const renderPersonCard = (node: TreeNode) => {
    const person = node.person;
    const w = 160;
    const h = 90;
    const isDark = person.gender === 'M';
    const hasParents = getParents(person.id).length > 0;
    const hasChildren = getChildren(person.id).length > 0;

    return (
      <g key={person.id} transform={`translate(${node.x},${node.y})`} className="node-group">
        {/* Card */}
        <rect
          x={-w/2}
          y={-h/2}
          width={w}
          height={h}
          rx={8}
          fill={isDark ? '#3a6d96' : '#9b5d8e'}
          stroke="#d4a853"
          strokeWidth={2}
          className="node-card cursor-pointer"
          onClick={() => setFocusPersonId(person.id)}
        />
        
        {/* Connection circles */}
        {hasParents && (
          <circle
            cx={0}
            cy={-h/2}
            r={6}
            fill="#8b6914"
            stroke="#2b2520"
            strokeWidth={1}
          />
        )}
        {hasChildren && (
          <circle
            cx={0}
            cy={h/2}
            r={6}
            fill="#8b6914"
            stroke="#2b2520"
            strokeWidth={1}
          />
        )}

        {/* Flag */}
        <text
          x={-w/2 + 12}
          y={-h/2 + 22}
          fontSize="18"
          className="select-none"
        >
          🇧🇷
        </text>

        {/* Name */}
        <text
          x={0}
          y={-10}
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="white"
          className="select-none pointer-events-none"
        >
          {person.name.split(' ')[0]}
        </text>
        <text
          x={0}
          y={6}
          textAnchor="middle"
          fontSize="11"
          fill="rgba(255,255,255,0.9)"
          className="select-none pointer-events-none"
        >
          {person.name.split(' ').slice(-1)[0]}
        </text>

        {/* Birth */}
        <text
          x={0}
          y={24}
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
            className="expand-btn cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(person.id, 'up');
            }}
          >
            <circle cx={w/2 - 16} cy={-h/2 + 12} r={8} fill="rgba(139,105,20,0.8)" />
            <text x={w/2 - 16} y={-h/2 + 16} textAnchor="middle" fontSize="10" fill="white" className="pointer-events-none">
              ↑
            </text>
          </g>
        )}
        {hasChildren && (
          <g
            className="expand-btn cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(person.id, 'down');
            }}
          >
            <circle cx={w/2 - 16} cy={h/2 - 12} r={8} fill="rgba(139,105,20,0.8)" />
            <text x={w/2 - 16} y={h/2 - 8} textAnchor="middle" fontSize="10" fill="white" className="pointer-events-none">
              ↓
            </text>
          </g>
        )}

        {/* Info button */}
        <g
          className="expand-btn cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedPerson(person);
          }}
        >
          <circle cx={-w/2 + 16} cy={h/2 - 12} r={8} fill="rgba(139,105,20,0.8)" />
          <text x={-w/2 + 16} y={h/2 - 8} textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" className="pointer-events-none">
            i
          </text>
        </g>
      </g>
    );
  };

  const renderLines = () => {
    const lines: React.ReactElement[] = [];
    uniqueTree.forEach(node => {
      const parents = getParents(node.person.id);
      parents.forEach(parent => {
        const parentNode = uniqueTree.find(n => n.person.id === parent.id);
        if (parentNode) {
          lines.push(
            <line
              key={`${node.person.id}-${parent.id}`}
              x1={parentNode.x}
              y1={parentNode.y + 45}
              x2={node.x}
              y2={node.y - 45}
              stroke="#333"
              strokeWidth={1.5}
            />
          );
        }
      });
    });
    return lines;
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
              className="w-full px-4 py-2 rounded-full border border-[#d5cdbf] bg-[#f5f0e8] outline-none"
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#ece5d8] border border-[#d5cdbf] rounded-lg max-h-60 overflow-y-auto z-50">
                {searchResults.map(person => (
                  <div
                    key={person.id}
                    onClick={() => {
                      setFocusPersonId(person.id);
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
          <svg
            ref={svgRef}
            className="w-full h-full"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <g transform={`translate(${translateX},${translateY}) scale(${scale})`}>
              {renderLines()}
              {uniqueTree.map(renderPersonCard)}
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
              Clique no nome para focar
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
