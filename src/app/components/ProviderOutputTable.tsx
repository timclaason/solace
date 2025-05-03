import React from 'react';
import { Advocate } from '@/@types';

interface ProviderOutputTableProps {
  advocates: Advocate[];
  onSort: (key: keyof Advocate) => void;
  sortConfig: { key: keyof Advocate; direction: 'asc' | 'desc' } | null;
}

const ProviderOutputTable: React.FC<ProviderOutputTableProps> = ({
  advocates,
  onSort,
  sortConfig,
}) => {
  return (
    <table className="advocates-table">
      <thead>
        <tr>
          <th onClick={() => onSort('firstName')}>
            First Name{' '}
            {sortConfig?.key === 'firstName' &&
              (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => onSort('lastName')}>
            Last Name{' '}
            {sortConfig?.key === 'lastName' &&
              (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => onSort('city')}>
            City{' '}
            {sortConfig?.key === 'city' &&
              (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </th>
          <th onClick={() => onSort('degree')}>
            Degree{' '}
            {sortConfig?.key === 'degree' &&
              (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </th>
          <th>Specialties</th>
          <th onClick={() => onSort('yearsOfExperience')}>
            Years of Experience{' '}
            {sortConfig?.key === 'yearsOfExperience' &&
              (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </th>
          <th>Phone Number</th>
        </tr>
      </thead>
      <tbody>
        {advocates.map((advocate, index) => (
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
            <td>{advocate.phoneNumber}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProviderOutputTable;
