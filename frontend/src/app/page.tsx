'use client';

import { useState } from 'react';

// Types pour les trajets
interface Train {
  origine: string;
  destination: string;
  date: string;
  heure_depart: string;
  heure_arrivee: string;
  duree: string;
}

interface RoundTripResult {
  destination: string;
  aller: Train[];
  retour: Train[];
}

type SearchMode = 'SINGLE' | 'ROUND_TRIP' | 'DATE_RANGE';

export default function Home() {
  // États pour les modes de recherche
  const [searchMode, setSearchMode] = useState<SearchMode>('SINGLE');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  
  // États pour les paramètres de base
  const [origin, setOrigin] = useState('PARIS');
  const [destination, setDestination] = useState('');
  const [departDate, setDepartDate] = useState('2025-06-27');
  const [returnDate, setReturnDate] = useState('2025-06-29');
  const [dateRangeDays, setDateRangeDays] = useState(7);
  
  // États pour les plages horaires
  const [departStart, setDepartStart] = useState('06:00');
  const [departEnd, setDepartEnd] = useState('23:00');
  const [returnStart, setReturnStart] = useState('06:00');
  const [returnEnd, setReturnEnd] = useState('23:00');
  
  // États pour les paramètres avancés
  const [maxDuration, setMaxDuration] = useState(12);
  const [sortBy, setSortBy] = useState('Heure de départ');
  const [sortOrder, setSortOrder] = useState('Croissant');
  
  // États pour les résultats
  const [results, setResults] = useState<Train[] | RoundTripResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    setError(null);
    
    try {
      let url = '';
      
      if (searchMode === 'SINGLE') {
        url = `http://127.0.0.1:8000/api/trains/single?date=${departDate}&origin=${origin}${destination ? `&destination=${destination}` : ''}`;
      } else if (searchMode === 'DATE_RANGE') {
        url = `http://127.0.0.1:8000/api/trains/range?start_date=${departDate}&days=${dateRangeDays}&origin=${origin}${destination ? `&destination=${destination}` : ''}`;
      } else if (searchMode === 'ROUND_TRIP') {
        url = `http://127.0.0.1:8000/api/trains/round-trip?depart_date=${departDate}&return_date=${returnDate}&origin=${origin}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('La recherche a échoué. Veuillez réessayer.');
      }
      
      const data = await response.json();
      setResults(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background avec pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>
        
        {/* Header */}
        <div className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚄</span>
              </div>
              <h1 className="text-xl font-bold text-white">TGV Max Finder</h1>
            </div>
            <button className="text-white hover:text-blue-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 pb-16 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Trouvez vos trajets
              <span className="block text-blue-200">TGV Max</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Découvrez toutes les destinations accessibles avec votre abonnement TGV Max en quelques clics
            </p>
            
            {/* Quick Search */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Départ</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                  <select
                    value={searchMode}
                    onChange={(e) => setSearchMode(e.target.value as SearchMode)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="SINGLE">Aller simple</option>
                    <option value="ROUND_TRIP">Aller-retour</option>
                    <option value="DATE_RANGE">Plage de dates</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Recherche en cours...
                  </div>
                ) : (
                  'Rechercher les trains'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Search Section */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg className={`w-5 h-5 mr-2 transition-transform ${showAdvancedSearch ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Recherche avancée
            </button>
          </div>

          {showAdvancedSearch && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Mode de recherche */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Mode de recherche</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'SINGLE', label: '🎯 Aller simple', description: 'Explorez toutes les destinations' },
                      { id: 'ROUND_TRIP', label: '🔄 Aller-retour', description: 'Trouvez des trajets complets' },
                      { id: 'DATE_RANGE', label: '📅 Plage de dates', description: 'Recherche sur plusieurs jours' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setSearchMode(mode.id as SearchMode)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          searchMode === mode.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{mode.label}</div>
                        <div className="text-sm opacity-75">{mode.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paramètres de base */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Paramètres</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville de départ</label>
                        <input
                          type="text"
                          value={origin}
                          onChange={(e) => setOrigin(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="PARIS"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville d'arrivée</label>
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          placeholder="LYON"
                          disabled={searchMode === 'SINGLE'}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date aller</label>
                        <input
                          type="date"
                          value={departDate}
                          onChange={(e) => setDepartDate(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {searchMode === 'ROUND_TRIP' ? 'Date retour' : 'Nombre de jours'}
                        </label>
                        {searchMode === 'ROUND_TRIP' ? (
                          <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        ) : searchMode === 'DATE_RANGE' ? (
                          <input
                            type="number"
                            value={dateRangeDays}
                            onChange={(e) => setDateRangeDays(parseInt(e.target.value))}
                            min="1"
                            max="30"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                          />
                        ) : (
                          <input
                            type="text"
                            value="N/A"
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plages horaires */}
              <div className="border-t pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">⏰ Plages horaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Départ début</label>
                    <input
                      type="time"
                      value={departStart}
                      onChange={(e) => setDepartStart(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Départ fin</label>
                    <input
                      type="time"
                      value={departEnd}
                      onChange={(e) => setDepartEnd(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  {searchMode === 'ROUND_TRIP' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Retour début</label>
                        <input
                          type="time"
                          value={returnStart}
                          onChange={(e) => setReturnStart(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Retour fin</label>
                        <input
                          type="time"
                          value={returnEnd}
                          onChange={(e) => setReturnEnd(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Paramètres avancés */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Paramètres avancés</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée maximale (heures)</label>
                    <input
                      type="number"
                      value={maxDuration}
                      onChange={(e) => setMaxDuration(parseInt(e.target.value))}
                      min="1"
                      max="12"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                      <option value="Heure de départ">Heure de départ</option>
                      <option value="Durée">Durée</option>
                      <option value="Destination">Destination</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
                    <div className="flex gap-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="Croissant"
                          checked={sortOrder === 'Croissant'}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="mr-2"
                        />
                        Croissant
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="Décroissant"
                          checked={sortOrder === 'Décroissant'}
                          onChange={(e) => setSortOrder(e.target.value)}
                          className="mr-2"
                        />
                        Décroissant
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="px-4 py-8 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                ✨ {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''} !
              </h2>
              <p className="text-gray-600">Voici vos trajets disponibles</p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(results) && results.length > 0 && (
                results.map((item, index) => {
                  // Vérifier si c'est un trajet simple
                  if ('origine' in item && 'destination' in item && 'date' in item) {
                    const train = item as Train;
                    return (
                      <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm">🚄</span>
                              </div>
                              <span className="text-sm text-gray-500">{train.date}</span>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">TGV Max</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900">{train.origine}</p>
                                <p className="text-sm text-gray-500">Départ</p>
                              </div>
                              <div className="text-center">
                                <div className="w-12 h-0.5 bg-gray-300 relative">
                                  <div className="absolute -top-1 left-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <div className="absolute -top-1 right-0 w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{train.duree}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">{train.destination}</p>
                                <p className="text-sm text-gray-500">Arrivée</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                              <div className="text-center">
                                <p className="text-lg font-bold text-blue-600">{train.heure_depart}</p>
                                <p className="text-xs text-gray-500">Départ</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-bold text-green-600">{train.heure_arrivee}</p>
                                <p className="text-xs text-gray-500">Arrivée</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  // Vérifier si c'est un résultat aller-retour
                  else if ('destination' in item && 'aller' in item && 'retour' in item) {
                    const roundTrip = item as RoundTripResult;
                    return (
                      <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{roundTrip.destination}</h3>
                            <p className="text-sm text-gray-500">Aller-retour disponible</p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-blue-800">🚄 Aller</h4>
                                <span className="text-sm text-blue-600">{roundTrip.aller.length} trajet(s)</span>
                              </div>
                              {roundTrip.aller.slice(0, 2).map((train, idx) => (
                                <div key={idx} className="text-sm text-gray-700 mb-1 flex justify-between">
                                  <span>{train.heure_depart} → {train.heure_arrivee}</span>
                                  <span className="text-gray-500">({train.duree})</span>
                                </div>
                              ))}
                              {roundTrip.aller.length > 2 && (
                                <div className="text-xs text-blue-500">+{roundTrip.aller.length - 2} autres</div>
                              )}
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-green-800">🔄 Retour</h4>
                                <span className="text-sm text-green-600">{roundTrip.retour.length} trajet(s)</span>
                              </div>
                              {roundTrip.retour.slice(0, 2).map((train, idx) => (
                                <div key={idx} className="text-sm text-gray-700 mb-1 flex justify-between">
                                  <span>{train.heure_depart} → {train.heure_arrivee}</span>
                                  <span className="text-gray-500">({train.duree})</span>
                                </div>
                              ))}
                              {roundTrip.retour.length > 2 && (
                                <div className="text-xs text-green-500">+{roundTrip.retour.length - 2} autres</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && !error && showAdvancedSearch && (
        <div className="px-4 py-16 sm:px-6 lg:px-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun résultat</h3>
            <p className="text-gray-600">Lancez une recherche pour découvrir vos trajets disponibles</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">Développé par Baptiste Cuchet 🚀</p>
            <p className="text-sm text-gray-500 mt-2">Trouvez vos trajets TGV Max en quelques clics</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
