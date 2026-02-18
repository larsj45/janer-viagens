'use client';

import { useState } from 'react';
import { familyData, getPerson, getParents, getChildren, getSpouses, type Person } from './data';

export default function ArvoreGenealogica() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar pessoas por busca
  const filteredPeople = familyData.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderizar cartão de pessoa
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
                          onClick={() => setSelectedPerson(p)}
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
                          onClick={() => setSelectedPerson(s)}
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
                          onClick={() => setSelectedPerson(c)}
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

  // Renderizar árvore simplificada a partir de Lars
  const renderTree = () => {
    const lars = getPerson('lars')!;
    
    return (
      <div className="space-y-8">
        {/* Geração dos bisavós */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">Bisavós</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['tor-ewald', 'ruth', 'jose-verda', 'thereza-mello', 'adhemar', 'edina-faria', 'eneas', 'rachel-silva'].map(id => {
              const person = getPerson(id);
              if (!person) return null;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedPerson(person)}
                  className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition text-left"
                >
                  <div className="text-sm font-medium">{person.name.split(' ')[0]} {person.name.split(' ')[person.name.split(' ').length - 1]}</div>
                  <div className="text-xs text-gray-600">{person.birthDate || '?'}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Geração dos avós */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">Avós</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['lars-wilhelm', 'teresa', 'octavio', 'magali'].map(id => {
              const person = getPerson(id);
              if (!person) return null;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedPerson(person)}
                  className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-left"
                >
                  <div className="text-sm font-medium">{person.name.split(' ')[0]} {person.name.split(' ')[person.name.split(' ').length - 1]}</div>
                  <div className="text-xs text-gray-600">{person.birthDate || '?'}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Geração dos pais */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">Pais</h3>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {['tor', 'edina'].map(id => {
              const person = getPerson(id);
              if (!person) return null;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedPerson(person)}
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-left"
                >
                  <div className="font-medium">{person.name.split(' ')[0]} {person.name.split(' ')[person.name.split(' ').length - 1]}</div>
                  <div className="text-sm text-gray-600">{person.birthDate}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lars e Andrea */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">Casal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md">
            {['lars', 'andrea'].map(id => {
              const person = getPerson(id);
              if (!person) return null;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedPerson(person)}
                  className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-left"
                >
                  <div className="font-bold">{person.name}</div>
                  <div className="text-sm text-gray-600">{person.birthDate}</div>
                  <div className="text-xs text-gray-500 mt-1">{person.birthPlace}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filhos */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">Filhos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl">
            {['laura', 'antonio', 'henrique'].map(id => {
              const person = getPerson(id);
              if (!person) return null;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedPerson(person)}
                  className="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition text-left"
                >
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-gray-600">{person.birthDate}</div>
                  {person.notes && <div className="text-xs text-gray-500 mt-1">{person.notes}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lado Melegari */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-3">Família Melegari (Andrea)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['antonio-melegari', 'maria-alice', 'orlando-melegari', 'iracema', 'luigi-melegaro', 'corinna-rinaldi'].map(id => {
              const person = getPerson(id);
              if (!person) return null;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedPerson(person)}
                  className="p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition text-left"
                >
                  <div className="text-sm font-medium">{person.name.split(' ')[0]} {person.name.split(' ')[person.name.split(' ').length - 1]}</div>
                  <div className="text-xs text-gray-600">{person.birthDate || person.birthPlace || '—'}</div>
                </button>
              );
            })}
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

        {/* Busca */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar pessoa por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
              {filteredPeople.map(person => (
                <button
                  key={person.id}
                  onClick={() => setSelectedPerson(person)}
                  className="p-3 bg-white rounded-lg shadow hover:shadow-md transition text-left"
                >
                  <div className="font-medium">{person.name}</div>
                  <div className="text-sm text-gray-600">
                    {person.birthDate && `${person.birthDate}`}
                    {person.birthPlace && ` — ${person.birthPlace}`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Árvore */}
        {!searchTerm && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            {renderTree()}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <div className="text-sm text-gray-600">
            <strong>{familyData.length}</strong> pessoas catalogadas
            {' • '}
            <span>Geração mais antiga: Georg Wilhelm Fleetwood (1669-1728)</span>
          </div>
        </div>
      </div>

      {/* Modal de detalhes */}
      {selectedPerson && renderPersonCard(selectedPerson)}
    </div>
  );
}
