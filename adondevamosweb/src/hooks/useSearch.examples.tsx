/**
 * Example usage of useSearch hook
 * 
 * This file demonstrates how to use the reusable search hook in different scenarios
 */

// Example 1: Basic search with Trips
import useSearch from '../hooks/useSearch';
import useTripQueryApi from '../hooks/Trips/useTripQueryApi';

export function ExampleTripSearch() {
  const { searchTrips } = useTripQueryApi();
  const { results, isLoading, error, search, hasResults } = useSearch(searchTrips);

  const handleSearch = async () => {
    const filters = { name: 'Japan', initialdate: '2024-01-01' };
    await search(filters);
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      
      {error && <div>Error: {error.message}</div>}
      
      {hasResults && (
        <div>
          <h2>Found {results.length} trips</h2>
          {results.map(trip => (
            <div key={trip.id}>{trip.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// Example 2: Search with Places
import usePlaceQueryApi from '../hooks/Places/usePlaceQueryApi';

export function ExamplePlaceSearch() {
  const { searchPlaces } = usePlaceQueryApi();
  const placeSearch = useSearch(searchPlaces, { initialResults: [] });

  const handleSearch = async (filters) => {
    const result = await placeSearch.search(filters);
    
    if (result.success) {
      console.log('Search successful:', result.data);
    } else {
      console.error('Search failed:', result.error);
    }
  };

  return (
    <div>
      {/* Your search UI here */}
      <button onClick={() => handleSearch({ name: 'Tokyo' })}>
        Search Places
      </button>
      
      {placeSearch.isLoading && <div>Loading...</div>}
      
      {placeSearch.hasResults && (
        <ul>
          {placeSearch.results.map(place => (
            <li key={place.id}>{place.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Example 3: Multiple searches on same page
export function ExampleMultipleSearches() {
  const { searchTrips } = useTripQueryApi();
  const { searchPlaces } = usePlaceQueryApi();
  
  const tripSearch = useSearch(searchTrips);
  const placeSearch = useSearch(searchPlaces);

  return (
    <div>
      <section>
        <h2>Search Trips</h2>
        <button onClick={() => tripSearch.search({ name: 'Adventure' })}>
          Search Trips
        </button>
        {tripSearch.hasResults && <div>{tripSearch.results.length} trips found</div>}
      </section>

      <section>
        <h2>Search Places</h2>
        <button onClick={() => placeSearch.search({ countryid: 1 })}>
          Search Places
        </button>
        {placeSearch.hasResults && <div>{placeSearch.results.length} places found</div>}
      </section>
    </div>
  );
}

// Example 4: Using reset and clearResults
export function ExampleWithReset() {
  const { searchTrips } = useTripQueryApi();
  const { results, search, reset, clearResults, hasSearched } = useSearch(searchTrips);

  return (
    <div>
      <button onClick={() => search({ name: 'Beach' })}>Search</button>
      <button onClick={clearResults}>Clear Results</button>
      <button onClick={reset}>Reset Everything</button>
      
      {hasSearched && !results.length && <div>No results found</div>}
      {results.length > 0 && <div>{results.length} results</div>}
    </div>
  );
}
