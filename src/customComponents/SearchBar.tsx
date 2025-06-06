import React, { useState } from 'react'

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
}

type SearchBarProps = {
  onSelect: (lat: number, lon: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 2) {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`
      );
      const data = await res.json();
      setSuggestions(data.slice(0, 5));
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (s: Suggestion) => {
    setQuery(s.display_name);
    setShowDropdown(false);
    setSuggestions([]);
    onSelect(Number(s.lat), Number(s.lon));
  };

  return (
    <div className="relative flex justify-center items-center">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Let's find you a place to park..."
        className="w-150 px-4 py-2 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute right-0 top-10 mt-3 bg-white rounded-lg shadow-lg z-10 text-black ">
          {suggestions.map((s, idx) => (
            <div
              key={idx}
              className="px-4 py-2 cursor-pointer hover:bg-blue-50"
              onClick={() => handleSelect(s)}
            >
              {s.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
