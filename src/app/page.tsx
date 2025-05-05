'use client';

import { useEffect, useRef, useState } from 'react';
import { Advocate } from '@/@types';
import { filterAdvocates } from '@/utilities';
import SearchBar from './components/SearchBar';
import Table from './components/ProviderOutputTable';
import Pagination from './components/Pagination';
import Loading from './components/Loading';
import PageHeading from './components/PageHeading';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Advocate;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/advocates');
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.advocates);
        setFilteredAdvocates(jsonResponse.advocates);
      } catch (error) {
        console.error('Error fetching advocates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  const handleSort = (key: keyof Advocate) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onSearchTermInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filtered = filterAdvocates(advocates, searchTerm);
    setFilteredAdvocates(filtered);
    setSortConfig(null);
  };

  const onResetButtonClick = () => {
    setFilteredAdvocates(advocates);
    setSortConfig(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const sortedAdvocates = [...filteredAdvocates].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const paginatedAdvocates = sortedAdvocates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedAdvocates.length / itemsPerPage);

  if (loading) return <Loading />;

  return (
    <main style={{ margin: '24px' }}>
      <PageHeading />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchTermInputChange}
        onReset={onResetButtonClick}
        inputRef={inputRef}
      />
      <Table
        advocates={paginatedAdvocates}
        onSort={handleSort}
        sortConfig={sortConfig}
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
