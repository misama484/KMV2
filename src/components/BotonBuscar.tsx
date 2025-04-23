import React, { useState } from 'react';

interface BotonBuscarProps {
  placeholder: string;
  onSearch: (searchTerm: string) => void;
}

const BotonBuscar: React.FC<BotonBuscarProps> = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Llama a la función de búsqueda con el término ingresado
  };

  return (
    <div className='mx-4 '>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-20 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default BotonBuscar;