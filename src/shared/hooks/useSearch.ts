import { useState, useEffect, useRef } from 'react';

interface UseSearchOptions {
  debounceTime?: number;
}

interface UseSearchResult<T> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  debouncedSearchTerm: string;
  results: T[];
  loading: boolean;
  error: string | null;
}

function useSearch<T>(
  searchFunction: (term: string) => Promise<T[]>,
  options?: UseSearchOptions,
): UseSearchResult<T> {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const initialLoad = useRef(true);
  const searchFnRef = useRef(searchFunction);

  const debounceTime = options?.debounceTime ?? 500; // Default debounce time of 500ms

  useEffect(() => {
    searchFnRef.current = searchFunction;
  }, [searchFunction]);

  // Debounce the search term
  useEffect(() => {
    // Skip debouncing on initial render to prevent immediate search with empty string
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceTime]);

  // Perform search when debouncedSearchTerm changes
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSearchTerm.trim() === '') {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await searchFnRef.current(debouncedSearchTerm);
        setResults(data);
      } catch (err) {
        setError('Failed to fetch search results.');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  return { searchTerm, setSearchTerm, debouncedSearchTerm, results, loading, error };
}

export default useSearch;
