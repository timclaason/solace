'use client';

import { useEffect, useRef, useState } from 'react';
import { Advocate } from '@/@types';
import { filterAdvocates, formatPhoneNumber } from '@/utilities';
import './globals.css';
import './styles/global.css';
import './styles/table.css';
import './styles/search.css';
import './styles/heading.css';
import './styles/pagination.css';

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAdvocates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/advocates');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonResponse = await response.json();
        if (isMounted) {
          setAdvocates(jsonResponse.advocates);
          setFilteredAdvocates(jsonResponse.advocates);
        }
      } catch (error) {
        console.error('Error fetching advocates:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAdvocates();

    return () => {
      isMounted = false;
    };
  }, []);

  const onSearchTermInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const filteredAdvocates = filterAdvocates(advocates, searchTerm);
    setFilteredAdvocates(filteredAdvocates);
    setSortConfig(null);
  };

  const onResetButtonClick = () => {
    setFilteredAdvocates(advocates);
    setSortConfig(null);
    if (inputRef.current) {
      inputRef.current.value = ''; // Clear the input field
    }
  };

  const sortedAdvocates = [...filteredAdvocates].sort((a, b) => {
    if (!sortConfig) return 0; // No sorting applied

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

  const totalPages = Math.ceil(sortedAdvocates.length / itemsPerPage);

  const paginatedAdvocates = sortedAdvocates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key: keyof Advocate) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        // Toggle direction if the same column is clicked
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      // Default to ascending order
      return { key, direction: 'asc' };
    });
  };

  if (loading) {
    return (
      <main style={{ margin: '24px' }}>
        <h1 className="page-heading">Solace Advocates</h1>
        <p>Loading data, please wait...</p>
      </main>
    );
  }

  return (
    <main style={{ margin: '24px' }}>
      <h1 className="page-heading">Solace Advocates</h1>
      <br />
      <br />
      <div className="search-container">
        <div className="search-box">
          <input
            id="search-input"
            ref={inputRef}
            className="input-field"
            placeholder="Type to search..."
            onChange={onSearchTermInputChange}
          />
          <button className="button" onClick={onResetButtonClick}>
            Reset Search
          </button>
        </div>
        <p className="search-status">
          Searching for:{' '}
          <span className="search-term">{searchTerm || 'None'}</span>
        </p>
      </div>
      <br />
      <br />
      <table className="advocates-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('firstName')}>
              First Name{' '}
              {sortConfig?.key === 'firstName' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('lastName')}>
              Last Name{' '}
              {sortConfig?.key === 'lastName' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('city')}>
              City{' '}
              {sortConfig?.key === 'city' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('degree')}>
              Degree{' '}
              {sortConfig?.key === 'degree' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th>Specialties</th>
            <th onClick={() => handleSort('yearsOfExperience')}>
              Years of Experience{' '}
              {sortConfig?.key === 'yearsOfExperience' &&
                (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th className="no-sort">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAdvocates.map((advocate, index) => {
            return (
              <tr key={`${advocate.phoneNumber}_${index}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s, index) => (
                    <span key={index} className="specialty-tag">
                      {s}
                    </span>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{formatPhoneNumber(advocate.phoneNumber)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {sortedAdvocates.length > itemsPerPage && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
