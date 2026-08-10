/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

interface TechHighlightContextType {
  hoveredTech: string | null;
  setHoveredTech: (tech: string | null) => void;
}

const TechHighlightContext = createContext<TechHighlightContextType>({
  hoveredTech: null,
  setHoveredTech: () => {},
});

export const TechHighlightProvider = ({ children }: { children: React.ReactNode }) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <TechHighlightContext.Provider value={{ hoveredTech, setHoveredTech }}>
      {children}
    </TechHighlightContext.Provider>
  );
};

export const useTechHighlight = () => useContext(TechHighlightContext);
