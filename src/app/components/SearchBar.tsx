import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onReset,
  inputRef,
}) => {
  return (
    <div className="search-container">
      <div className="search-box">
        <input
          id="search-input"
          ref={inputRef}
          className="input-field"
          placeholder="Type to search..."
          value={searchTerm}
          onChange={onSearchChange}
        />
        <button className="button" onClick={onReset}>
          Reset Search
        </button>
      </div>
      <p className="search-status">
        Searching for:{' '}
        <span className="search-term">{searchTerm || 'None'}</span>
      </p>
    </div>
  );
};

export default SearchBar;
